const path = require('path')
const mongoose = require('mongoose')
const Ajv = require('ajv')
const UserModel = require('../../models/User.js')
const builtinEndpoints = require('../../config/schemas/Endpoints.js')
const Endpoint = require('../../models/Endpoint.js')
const { toBoolean, haveCommonElements } = require('../../lib/helpers.js')

var _instances = {} 

/**
 * Main controller provides basic logic & helper methods
 */
class Controller {
	constructor(api) {
		this.api = api
		this.ajv = new Ajv()
	}

	// TODO: Should create boot instance of fortune store, connect to store load all the endpoints from database
	/**
	 * Creates boot instance of api, built-in models, then conntects to
	 * @param 	{Object} 	masterConfig 
	 * @param 	{*} 			app 
	 * @return	 					ctx 					[Returns context of the Controller]
	 */
	static boot(masterConfig, app) {
		Controller.api = masterConfig	
		Controller.app = app // express instance
		Controller.ajv = new Ajv()

		Controller.api.model = {}
		Controller.api.bootModel = builtinEndpoints

		// TODO: Create store, boot store instance and connect, init() should load all routes from the db
		return new Promise(async (resolve, reject) => {
			try {
				await Controller.init()
				resolve(this)
			} catch (err) {
				reject(err)
			}
		})
	}

	// App initialization - connect to db, load all endpoints, create root user if needed
	static async init() {
		Controller.defineResponseErrors()
		try {
			// Connect to MongoDB
			await Controller.connectDB()
			// Load default endpoints in the db
			await Controller.saveStaticEndpoints()
			// Load dynamic routes created from the GUI/endpoint builder
			await Controller.loadDynamicEndpoints()
			// Create root user from the config
			await Controller.createRootUser()
			
			console.log('Init complete')
		} catch (err) {
			Controller.logError(err)
		}
	}

	static middleware(req, res, next) {
		// Main middleware
		req.urlParsed = new URL(Controller.api.protocol + '://' + req.get('host') + req.originalUrl)
		next()
	}

	static async connectDB() {
		mongoose.connection.once('open', () => {
			console.log('MongoDB connected')

			mongoose.connection.on('disconnected', () => {
				console.log('MongoDB event disconnected')
			})
			mongoose.connection.on('reconnected', () => {
				console.log('MongoDB event reconnected')
			})
			mongoose.connection.on('error', (err) => {
				Controller.logError(err)
			})
		})
		try {
			const db = Controller.api.db
			var url = `mongodb://${db.host}:${db.port}/${db.name}`
			var options = { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
			
			if (process.env.NODE_ENV === 'production' ) {
				url = `mongodb://${db.user}:${db.password}@${db.host}:${db.port}/${db.name}`
				options = { authSource: db.name, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
			}

			// TODO Use official nodejs mongodb driver or implement Feathers (has db adapters)
			await mongoose.connect(url, options, (err) => {
				if (err) throw err
			})

			Controller.api.db.connection = mongoose.connection.db
		} catch (err) {
			throw err
		}
	}

	static async saveStaticEndpoints() {
		try {
			const builtinModels = builtinEndpoints

			for (let modelName in builtinModels) {
				if (builtinModels.hasOwnProperty(modelName)) {
					const endpoint = await Endpoint.getEndpointByName(modelName)
					// If a default endpoint does not exist, create one
					if (!endpoint) {
						// Assign root as static/default endpoints owner
						const db = Controller.api.db.connection
						let rootId = (await db.collection('users').findOne({ roles: ['root'] }))._id.toString()
						builtinModels[modelName].__owner = rootId
						// TODO: Dont save static/built-in endpoints to the db
						// Save endpoint
						await Endpoint.createEndpoint(builtinModels[modelName])
						console.log(`Created new static endpoint: ${modelName}`)
					}
				}
			}
		} catch (err) {
			throw err
		}
	}

	static async loadDynamicEndpoints() {
		try {
			var endpoints = await Endpoint.getEndpoints()
		
			// TODO: Remove this when proper hooks are implemented in builtin Controllers [create, read, get, update, delete], and they work with 
			// Remove builtin endpoints from loading
			var i = endpoints.length
			while (i-- ) {
				if (endpoints[i].name === 'endpoint' || endpoints[i].name === 'dashboard' || endpoints[i].name === 'user' || endpoints[i].name === 'login') {
					endpoints.splice(i, 1)
				}
			}
			// Load models for all endpoints
			endpoints.forEach((endpoint) => Controller.api.model[endpoint.name] = endpoint._schema)

			const methods = ['get', 'post', 'patch', 'delete']
			// Make hooks for all models
			Controller.api.hooks = this.makeHooks(Controller.api.model, Controller.api.version)
			// console.log(`Hooks for ${modelName}:`, hooks[modelName])
			var router = require(`../../routes/api/${Controller.api.version}/index.js`)

			// Load hooks for all models
			for (let modelName in Controller.api.hooks) {
				methods.forEach((method) => {
					if (method === 'get') {
						router[method](`/${modelName}`, this.APIMiddleware, (req, res, next) => Controller.instances[modelName].read(req, res, next))
						router[method](`/${modelName}/:id`, this.APIMiddleware, (req, res, next) => Controller.instances[modelName].read(req, res, next))
					} else {
						const operation = this.getCRUDFromMethod(method)
						router[method](`/${modelName}`, this.APIMiddleware, (req, res, next) => Controller.instances[modelName][operation](req, res, next))
					}
				})
			}
		} catch (err) {
			throw err
		}
	}

	static async removeDynamicEndpoint(endpointName) {
		var router = require('../../routes/api/'+Controller.api.version+'/index.js')
		// Remove controller instance for this endpoint
		delete Controller.instances[endpointName]
		// Remove validators for this endpoint's model
		if (Controller.api.validators && Controller.api.validators[endpointName]) delete Controller.api.validators[endpointName]
		// Remove model
		delete Controller.api.model[endpointName]
		// Remove endpoints from the router [get, post, patch, delete]
		const url = `/${endpointName}`
		var i = router.stack.length
		while (i--) {
			if (router.stack[i].route && router.stack[i].route.path === url) { 
				router.stack.splice(i, 1)
			} 
		}
	}

	static APIMiddleware (req, res, next) {
		// TODO: Handle nested routes, if its /posts/:id || /posts/categories/:id, etc.
		if (req.params.length) {
			let par = Object.values(req.params[0].split('/'))
			par.shift()
			let obj = { ...par }
			req.params = obj
			// var containsNumber = /\d+/;
			// if(obj[0].match(containsNumber)) console.log('Contains number')
			next()
		} else next()
	}

	// TODO: Create error handler
	static defineResponseErrors() {
		Controller.api.errors = {
			/**
			 * @param {Object} 		res 			[Response object]
			 * @param {String} 		[error] 	[Optional error text]
			 */
			NotFound(res, error) {
				if (!error) var error = 'Resource you are looking for is not found'
				return res.status(404).json({ name: 'NotFoundError',  message: error })
			},
			/**
			 * @param {Object} 		res 			[Response object]
			 * @param {String} 		[error] 	[Optional error text]
			 */
			Forbidden(res, error) {
				if (!error) var error = 'Access denied'
				return res.status(404).json({ name: 'ForbiddenError', message: error })
			},
			/**
			 * @param {Object} 																			res 				[Response object]
			 * @param {Array.<{name: String, message: String}>} 		[errors] 		[Optional array of error objects]
			 */
			BadRequest(res, error) {
				if (!error) var error = 'Bad request error'
				// else errors.forEach((err) => err.name = 'BadRequestError')
				// return res.status(400).json(errors)
				return res.status(400).json({ name: 'BadRequestError', message: error })
			}
		}
	}

	/**
	 * 
	 * @param 	{String} 									modelName  		[Name of the model to be validated]
	 * @param 	{Object} 									record 		 		[Record to be validated against JSON schema]
	 * @return 	{Array.<Object>|Boolean} 								[Returns array of errors or boolean false]
	 */
	static validateToSchema(modelName, record) {
		if(!this.api.validators) this.api.validators = {}
		// let schema = JSON.parse(JSON.stringify(this.api.model[modelName]))
		let schema = this.api.model[modelName]
		// If property which is not specified in the schema exist, give an error
		schema.additionalProperties = false

		if(!this.api.validators[modelName]) {
			this.api.validators[modelName] = this.ajv.compile(schema)
		}
		var valid = this.api.validators[modelName](record)
		if (!valid) {
			console.log(`Endpoint: ${modelName}, schema is not valid: `, this.api.validators[modelName].errors)
			return this.api.validators[modelName].errors
		}
		// valid
		return false
	}

	static formatSchemaErrors(errors) {
		if (errors && errors.length) {
			let errMsg = `Property ${errors[0].dataPath ? errors[0].dataPath+' ' :''}${errors[0].message}.`
			if(errors[0].params) {
				if (errors[0].params.additionalProperty) {
					errMsg += ` Property .${errors[0].params.additionalProperty} is not allowed.`
				}
				if(errors[0].params.allowedValues) {
					errMsg += ` Allowed values: ${errors[0].params.allowedValues.join(', ')}.`
				}
			}
			return errMsg
		}
	}

	// Create root user if it doesnt exist
	static async createRootUser() {
		const user = Controller.api.rootUser
		try {
			const rootExist = await UserModel.getUserByUsername(user.username)
			
			if (!rootExist) {
				// If root's username changes in config.js,
				// delete the previous root user
				await UserModel.deleteOne({ roles: 'root' })

				// Create Stripe customer for this root user
				// TODO: Move to Strpe/other controller
				// const customer = await stripe.customers.create({
				// 	name: user.name || null,
				// 	email: user.email || null,
				// 	address: user.address || null,
				// 	phone: user.phone || null,
				// 	description: 'Root user. Customer created while creating a root user account.'
				// })
				// user.stripeCustomer = customer.id

				const hashedPassword = await UserModel.hashPassword(user.password) 
				user.roles = ['root']
				user.password = hashedPassword

				// Save root user
				const root = await new Promise((resolve, reject) => {
					UserModel.create(user, (err, doc) => {
						if (err) reject(err)
						resolve(doc)
					})
				})

				console.log(`Root user created: ${root.username}`)
				// console.log(`Customer for root created: ${customer}`)
			}
		} catch (err) {
			throw err
		}
	}

	static listener(req, res, next) {
		req.urlParsed = new URL(Controller.api.protocol + '://' + req.get('host') + req.originalUrl)
		next()
	}

	static handleError(req, res, next) {
		// TODO: Finish
	}

	/**
	 * Makes and assignes hooks for all models. If there is a custom controller with a valid hook name,
	 * assign hook from that custom controller to the model, otherwise assign a default hook.
	 * @param {Object} models 
	 * @param {String} apiVersion 
	 */
	static makeHooks(models, apiVersion) {
		var hooks = {}
		var DefaultController = require(`${__dirname}../../../controllers/${apiVersion}/Default.js`)

		for (let modelName in models) {
			const controllerName = modelName[0].toUpperCase() + modelName.slice(1) + 'Controller'
			
			// TODO: Ading custom controller will work when valid hooks are implemented in built-in Controllers
			// Check if there is a custom controller defined for this model
			var controllerPath = path.resolve(`${__dirname}../../../controllers/${apiVersion}/${controllerName}.js`)
			var ctrl
			try {
				ctrl = require(controllerPath)
				// Instantiate custom controller for this endpoint with the right model
				Controller.instances[modelName] = new ctrl(Controller.api, models[modelName])
			} catch (err) {
				// If custom controller is not found, assign the default controller
				if(err.code === 'MODULE_NOT_FOUND') {
					// controllerPath = path.resolve(`${__dirname}../../../controllers/${apiVersion}/Default.js`)
					// var DefaultController = require(controllerPath)
					// Instantiate default controller for this endpoint with the right model
					Controller.instances[modelName] = new DefaultController(Controller.api, models[modelName])
				} else {
					throw err
				}
			}

			if (!hooks[modelName]) hooks[modelName] = {}
			let defaultCtrl = new DefaultController(Controller.api, hooks[modelName])

			// Assign hooks to the model instance
			// If there is a custom controller with a valid hook name, assign hook from that custom controller, otherwise assign a default hook
			// 2 hooks for GET method, read() and get()
			Controller.instances[modelName]['read'] ? Controller.instances[modelName]['read'] = Controller.instances[modelName]['read'] : Controller.instances[modelName]['read'] = defaultCtrl['read']
			Controller.instances[modelName]['get'] ? Controller.instances[modelName]['get'] = Controller.instances[modelName]['get'] : Controller.instances[modelName]['get'] = defaultCtrl['get']
			Controller.instances[modelName]['create'] ? Controller.instances[modelName]['create'] = Controller.instances[modelName]['create'] : Controller.instances[modelName]['create'] = defaultCtrl['create']
			Controller.instances[modelName]['update'] ? Controller.instances[modelName]['update'] = Controller.instances[modelName]['update'] : Controller.instances[modelName]['update'] = defaultCtrl['update']
			Controller.instances[modelName]['delete'] ? Controller.instances[modelName]['delete'] = Controller.instances[modelName]['delete'] : Controller.instances[modelName]['delete'] = defaultCtrl['delete']

			// Add assigned hooks to all hooks
			hooks[modelName].read = Controller.instances[modelName]['read']
			hooks[modelName].get = Controller.instances[modelName]['get']
			hooks[modelName].create = Controller.instances[modelName]['create']
			hooks[modelName].update = Controller.instances[modelName]['update']
			hooks[modelName].delete = Controller.instances[modelName]['delete']

			// if (modelName === 'test') {
			// 	console.log('------------------- TEST model --------------------')
			// 	console.log('READ HOOK ASSIGNED for TEST: ', Controller.instances[modelName]['read'])
			// }
		}
		return hooks
	}

	static getCRUDFromMethod(method) {
    switch(method.toUpperCase()) {
      case 'GET':
        return 'read'
      case 'POST':
        return 'create'
      case 'PATCH':
      case 'PUT':
        return 'update'
      case 'DELETE':
        return 'delete'
    }
	}

	// Get resource name from URL - /api/{resource_name}
	static getAPIResourceFromRequest(req) {
		// Ignore API subPath if present
		// TODO: Move url parsing to "always executing middleware" - req.urlParsed
		const subPath = Controller.api.subPath || []
		const ignoredArr = subPath.split('/')
		ignoredArr.shift()
		let urlArr = req.urlParsed.pathname.split('/')
		urlArr.shift() // remove first item (empty string)

		if (haveCommonElements(urlArr, ignoredArr)) {
			for (let i = 0; i < urlArr.length; i++) {
				for (let j = 0; j < ignoredArr.length; j++) {
					if (urlArr[i] === ignoredArr[j]) urlArr.splice(i, 1)
				}
			}
		}

		// Defined resource or root /
		const resource = urlArr[0].toLowerCase() || '/'
 		// req.resource = resource
		if (!resource) {
			throw new Error(`Endpoint for the resource: ${resource}, at URL: ${req.urlParsed.href}, is not set.`)
		}
		else return resource
	}
	
		/**
		*	Handles query parameters: limit, fields, sort, match, include.
    * @param 	{Object} 			req 		[The request object]
    * @return {Object.<{limit: number, fields: Object, sort: Object, match: Object, include: Object}>} 	{limit, fields, sort, match, include} 		[Object which keys are parsed querystrings]
    */
	static handleQueryStringsFromRequest(req) {
		var limit = 0, fields = {}, sort = {}, match = {}, include = {};
		if (req.query.limit) limit = parseInt(req.query.limit)
		if (req.query.fields) fields = req.query.fields
		if (req.query.sort) sort = req.query.sort
			// TODO: Add support for query strings - [match, include]
		// if (req.query.match) match = req.query.match
		// if (req.query.include) include = req.query.include

		// Sort
		for (let field in sort) {
			if (sort.hasOwnProperty(field)) {
				if (sort[field] === 'asc' || sort[field] == '1') sort[field] = 1
				else if (sort[field] === 'desc' || sort[field] === '-1') sort[field] = -1
				else delete sort[field]
			}
		}
			
		// Fields (format JSON object - fields={"_id":true})
		if (typeof fields === 'string') {
			try {
				fields = JSON.parse(fields)
				// Transform prop 'id' in '_id' (mongodb supported field)
				if (fields.id === false || fields.id === true) fields._id = fields.id; delete fields.id;
			} catch (err) {}

		// Fields (format JS object - fields[_id]=true)
		} else {
			for (let f in fields) {
				if (fields.hasOwnProperty(f)) {
					// Transform prop 'id' in '_id' (mongodb supported field)
					if (f === 'id') { fields._id = toBoolean(fields[f]); delete fields.id; }
					else { fields[f] = toBoolean(fields[f]) }
				}
			}
		}

		return { limit, fields, sort, match, include }
	}

	static logError(error) {
		console.error(error)
	}

	static get instances() { return _instances }

	// session(context, roles) {
	// 	return this.api.session(context, roles)
	// }

	// roles(req, roles) {
	// 	return session.roles(req, roles)
	// }

	// static copyModel(o) {
  //   var output, v, key, inst = this;
  //   output = Array.isArray(o) ? [] : {};
  //   for (key in o) {
  //      v = o[key];
  //      output[key] = (typeof v === "object") ? inst.copyModel(v) : v;
  //   }
  //   return output;
  // }

}

module.exports = Controller