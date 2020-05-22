const path = require('path')
const mongoose = require('mongoose')
// const config = require('../../config/config.js')
const Ajv = require('ajv')
const UserModel = require('../../models/User.js')
const builtinEndpoints = require('../../config/schemas/Endpoints.js')
const Endpoint = require('../../models/Endpoint.js')

var _instances = {} 

/**
 * Base controller provides basic logic & helper methods
 */

class Controller {
	constructor(api) {
		this.api = api
		this.ajv = new Ajv()
	}

	static boot(express, masterConfig) {
		Controller.api = masterConfig	
		Controller.api.app = express
		Controller.ajv = new Ajv()

		Controller.api.model = {}
		Controller.api.bootModel = builtinEndpoints

		// TODO: Create store and connect here
		return new Promise(async (resolve, reject) => {
			await Controller.init().then(() => {
				resolve(true)
			})
			.catch((err) => err)
		})
	}

	// App initialization - Runs when server starts/restarts
	static async init() {
		Controller.defineResponseErrors()
		try {
			// Connect to MongoDB
			await Controller.connectDB()
			// Load default schemas in the db
			await Controller.loadStaticEndpoints()
			// Load dynamic routes created from the GUI/endpoint builder
			await Controller.loadDynamicEndpoints()
			// Create root user from the config
			await Controller.createRootUser()
			
			console.log('Init complete')
		} catch (err) {
			Controller.logError(err)
		}
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

			await mongoose.connect(url, options, (err) => {
				if (err) throw err
			})

			Controller.api.db.connection = mongoose.connection.db
		} catch (err) {
			throw err
		}
	}

	static async loadStaticEndpoints() {
		try {
			const defaultEndpoints = builtinEndpoints

			for (const endpointName in defaultEndpoints) {
				if (defaultEndpoints.hasOwnProperty(endpointName)) {
					const endpoint = await Endpoint.getEndpointByName(endpointName)
					// If a default endpoint does not exist, create one
					if (!endpoint) {
						// Assign root as static/default endpoints owner
						const db = Controller.api.db.connection
						let rootId = (await db.collection('users').findOne({ roles: ['root'] }))._id.toString()
						defaultEndpoints[endpointName].__owner = rootId
						// Save endpoint
						await Endpoint.createEndpoint(defaultEndpoints[endpointName])
						console.log(`Created new static endpoint: ${endpointName}`)
					}
				}
			}
		} catch (err) {
			throw err
		}
	}

	static async loadDynamicEndpoints() {
		var router = require('../../routes/'+Controller.api.version+'/api/index.js')
		try {
			var endpoints = await Endpoint.getEndpoints()
		} catch (err) {
			throw err
		}
		const methods = ['get', 'post', 'patch', 'delete']

		endpoints.forEach(endpoint => {
			const endpointName = endpoint.name[0].toUpperCase() + endpoint.name.slice(1)
			const url = '/' + endpoint.name + '*'
			// Load models for dynamic endpoints
			Controller.api.model[endpoint.name] = endpoint._schema
			
			// Check if there is a custom controller defined for this model before assigning the default one
			var controllerPath = path.resolve(`${__dirname}../../../controllers/${Controller.api.version}/${endpointName}Controller.js`)
			var ctrl
			try {
				ctrl = require(controllerPath)
				// Instantiate controller for this endpoint
				Controller.instances[endpoint.name] = new ctrl(Controller.api)
				
			} catch (err) {
				if(err.code === 'MODULE_NOT_FOUND') {
					controllerPath = path.resolve(`${__dirname}../../../controllers/${Controller.api.version}/Default.js`)
					const DefaultController = require(controllerPath)
					// Instantiate default controller with the right model for this endpoint
					Controller.instances[endpoint.name] = new DefaultController(Controller.api, endpoint._schema)
				} else {
					throw err
				}
			}

			methods.forEach((method) => {
				const operation = this.getCRUDFromMethod(method)
				router[method](url, this.useAPIMiddleware, (req, res, next) => Controller.instances[endpoint.name][operation](req, res, next))
			})
			// router.route(url).get(this.useAPIMiddleware, (req, res, next) => Controller.instances[endpoint.name].read(req, res, next))
		})
	}

	static async removeDynamicEndpoint(endpointName) {
		var router = require('../../routes/'+Controller.api.version+'/api/index.js')
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

	static useAPIMiddleware (req, res, next) {
		// TODO: Handle nested routes, if its /posts/:id || /posts/categories/:id, etc.
		if (req.params) {
			let par = Object.values(req.params[0].split('/'))
			par.shift()
			let obj = { ...par }
			req.params = obj
			// var containsNumber = /\d+/;
			// if(obj[0].match(containsNumber)) console.log('Contains number')
			next()
		} else next()
	}

	// TODO: Create better error handler
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
		let schema = JSON.parse(JSON.stringify(this.api.model[modelName]))

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
	static getResourceFromRequest(req) {
		// const resource = req.url.split('/').pop().toLowerCase() || null
		const resource = req.path.split('/')[1].toLowerCase() || null
		// req.resource = resource
		if (!resource) throw new Error(`Resource for this route is not defined: ${resource}`)
		else return resource
	}

	static copyModel(o){
    var output, v, key, inst = this;
    output = Array.isArray(o) ? [] : {};
    for (key in o) {
       v = o[key];
       output[key] = (typeof v === "object") ? inst.copyModel(v) : v;
    }
    return output;
  }

	static get instances() { return _instances }

	// session(context, roles) {
	// 	return this.api.session(context, roles)
	// }

	// roles(req, roles) {
	// 	return session.roles(req, roles)
	// }

	static logError(error) {
		console.error(error)
	}

}

module.exports = Controller