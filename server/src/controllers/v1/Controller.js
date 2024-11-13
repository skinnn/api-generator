const path = require('path')
const mongoose = require('mongoose')
const Ajv = require('ajv')
const User = require('../../models/User.js')
const builtinEndpoints = require('../../config/schemas/Endpoints.js')
const Endpoint = require('../../models/Endpoint.js')
const { toBoolean, isEmptyObject } = require('../../lib/helpers.js')

var _instances = {}, _api = {};

/**
 * Main controller provides basic logic & helpers
 */
class Controller {
	constructor(api) {
		this.api = api
		this.ajv = {} // new Ajv()
	}

	// TODO: Should create boot instance of fortune store, connect to store load all the endpoints from database
	/**
	 * Creates boot instance of api, built-in models, then calls initialization
	 * @param 	{Object} 	masterConfig  [Master configuration file]
	 * @param 	{Object}	app 					[Express app instance]
	 * @returns	{Object} 					 			[Context of the Controller]
	 */
	static boot(masterConfig, app) {
		Controller.modify(Controller.api, masterConfig)
		Controller.app = app //  express app instance
		Controller.ajv = new Ajv({ allErrors: true })
		Controller.api.model = {}
		Controller.api.bootModel = builtinEndpoints
		Controller.errors = Controller.createErrors()

		// TODO: Create store, boot store instance and connect
		return new Promise(async (resolve, reject) => {
			try {
				await Controller.init()
				resolve(this)
			} catch (err) {
				reject(err)
			}
		})
	}

	// App initialization - connect to db, load all endpoints, create root user if one is not found
	static async init() {
		try {
			// Connect to MongoDB
			Controller.api.db.connection = await Controller.connectDB()
			// Create root user from the config
			await Controller.createRootUser()
			// Save default endpoints in the db
			await Controller.saveStaticEndpoints()
			// Load dynamic routes created from the GUI/endpoint builder
			await Controller.loadDynamicEndpoints()

			console.log('Init complete')
		} catch (err) {
			throw err
		}
	}

	/**
	 * Application-level middleware, triggered for each incoming request to the application.
	 * Called before each
	 * @param 	{Object} 		req 		The request object
	 * @param 	{Object} 		res 		The response object
	 * @param 	{function} 	next 		The callback to the next program handler
	 */
	static async middleware(req, res, next) {
		res.setHeader('X-Powered-By', Controller.api.name)
		// req.urlParsed = new URL(Controller.api.protocol + '://' + req.get('host') + req.originalUrl)

		req.urlParsed = new URL(req.url, [Controller.api.protocol, '://', req.headers.host].join(''))
		req.resource = req.urlParsed.pathname.split('/')[1].toLowerCase()
		await Controller.parseQueryStringsFromRequest(req)
		return next()
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
		const db = Controller.api.db
		var url = `mongodb://${db.host}:${db.port}/${db.name}`
		var options = { useNewUrlParser: true, useUnifiedTopology: true }

		// if (process.env.NODE_ENV === 'production' ) {
		// 	url = `mongodb://${db.user}:${db.password}@${db.host}:${db.port}/${db.name}`
		// 	options = { authSource: db.name, useNewUrlParser: true, useUnifiedTopology: true }
		// }

		// TODO Use official nodejs mongodb driver or implement fortunejs
		try {
			const response = await mongoose.connect(url, options)
			return response.connection.db
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
						const root = await db.collection('users').findOne({ roles: ['root'] })
						const rootId = root._id.toString()
						builtinModels[modelName].__owner = rootId
						// Save endpoint
						await Endpoint.createEndpoint(builtinModels[modelName])
						console.log(`Created a built-in endpoint: ${modelName}`)
					}
				}
			}
		} catch (err) {
			throw err
		}
	}

	static async loadDynamicEndpoints(endpointList = null) {
		try {
			const endpoints = endpointList || await Endpoint.getEndpoints()
			// Remove builtin endpoints from loading
			let i = endpoints.length
			while (i-- ) {
				if (endpoints[i].name === 'dashboard') {
					endpoints.splice(i, 1)
				}
			}

			// Load models for all endpoints
			endpoints.forEach((endpoint) => {
				Controller.api.model[endpoint.name] = endpoint._schema
			})

			const methods = ['get', 'post', 'patch', 'put', 'delete']
			// Make default hooks for all models
			Controller.api.hooks = this.makeHooks(methods)
			const router = require(`../../routes/${Controller.api.version}/index.js`)

			// Create default endpoints for default hooks
			for (let modelName in Controller.api.hooks) {
				const controller = Controller.instances[modelName]


				// TODO: Create separate endpoint and model collections
				// 1. Creating a model from the GUI will just create these "default"
				// dynamic endpoints for that model
				// 2. Create endpoints separately from the models so we can have
				// deeply nested endpoints like /posts/category/:id that can be related
				// to any model


				// const nestedRoute = `/${modelName}/test/:id`
				// const nestedHook = `GET ${nestedRoute}`
				// router['get'](nestedRoute, this.RESTMiddleware, (req, res, next) => controller[nestedHook](req, res, next))

				router['get'](`/${modelName}`, this.RESTMiddleware, (req, res, next) => controller.read(req, res, next))
				router['get'](`/${modelName}/:id`, this.RESTMiddleware, (req, res, next) => controller.get(req, res, next))
				router['post'](`/${modelName}`, this.RESTMiddleware, (req, res, next) => controller.create(req, res, next))
				router['patch'](`/${modelName}/:id`, this.RESTMiddleware, (req, res, next) => controller.update(req, res, next))
				router['put'](`/${modelName}/:id`, this.RESTMiddleware, (req, res, next) => controller.update(req, res, next))
				router['delete'](`/${modelName}/:id`, this.RESTMiddleware, (req, res, next) => controller.delete(req, res, next))
				// const operation = this.getCRUDFromMethod(method)
				// router[method](`/${modelName}`, this.RESTMiddleware, (req, res, next) => controller[operation](req, res, next))
			}
		} catch (err) {
			throw err
		}
	}

	static async removeDynamicEndpoint(endpointName) {
		const router = require(`../../routes/${Controller.api.version}/index.js`)
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

	/**
	 * REST API middleware (router-level middelware).
	 * @param {Object} 		req
	 * @param {Object} 		res
	 * @param {Function}	next
	 */
	static RESTMiddleware(req, res, next) {
		req.resource = Controller.getAPIResourceFromRequest(req)
		// TODO: Handle nested routes, if its /posts/:id || /posts/categories/:id, etc.
		if (req.params && req.params.length && req.params.length > 0) {
			let par = Object.values(req.params[0].split('/'))
			par.shift()
			req.params = { ...par }
			// var containsNumber = /\d+/;
			// if(obj[0].match(containsNumber)) console.log('Contains number')
		}
		next()
	}

	/**
	 *
	 * @param 	{String} 									modelName  		[Name of the model to be validated]
	 * @param 	{Object} 									record 		 		[Record to be validated against JSON schema]
	 * @return 	{Array.<Object>|Boolean} 								[Returns array of errors or boolean false]
	 */
	static validateToSchema(modelName, record) {
		if(!this.api.validators) this.api.validators = {}
		const schema = this.api.model[modelName]
		// If property which is not specified in the schema exist, give an error
		schema.additionalProperties = false

		if (!this.api.validators[modelName]) {
			this.api.validators[modelName] = this.ajv.compile(schema)
		}
		const valid = this.api.validators[modelName](record)
		if (!valid) {
			return this.api.validators[modelName].errors
		}
		return false
	}

	static formatSchemaErrors(errors) {
		let formattedErrors = []
		if (Array.isArray(errors) && errors.length) {
			formattedErrors = errors.map((error) => {
				let errMsg = `Property ${error.dataPath ? error.dataPath+' ' :''}${error.message}.`
				if (error.params) {
					if (error.params.additionalProperty) {
						errMsg += ` Property .${error.params.additionalProperty} is not allowed.`
					}
					if (error.params.allowedValues) {
						errMsg += ` Allowed values: ${error.params.allowedValues.join(', ')}.`
					}
				}
				return errMsg
			})
		}
		return formattedErrors
	}

	// Create root user if it doesnt exist
	static async createRootUser() {
		const user = Controller.api.rootUser
		try {
			const rootExist = await User.findOne({ username: user.username })

			if (!rootExist) {
				// If root's username changes in config.js,
				// delete the previous root user
				await User.deleteOne({ roles: 'root' })

				const plainPassword = user.password
				const hashedPassword = await User.hashPassword(user.password)
				user.roles = ['root']
				user.password = hashedPassword

				// Create root user
				const root = await User.create(user)
				if (Controller.api.mode === 'development') {
					console.log(`Root user created: ${root.username}, ${plainPassword}`)
				}
			}
		} catch (err) {
			throw err
		}
	}

	/**
	 * Makes and assignes hooks for all models. If there is a custom controller with a valid hook name,
	 * assign hook from that custom controller to the model, otherwise assign a default hook.
	 * @param {Object} models
	 * @param {String} apiVersion
	 */
	static makeHooks(methods) {
		const models = Controller.api.model
		const apiVersion = Controller.api.version
		const hooks = {}
		const DefaultController = require(`${__dirname}../../../controllers/${apiVersion}/Default.js`)

		for (let modelName in models) {
			const controllerName = modelName[0].toUpperCase() + modelName.slice(1) + 'Controller.js'
			const defaultCtrl = new DefaultController(Controller.api, models[modelName])
			// Check if there is a custom controller defined for this model
			try {
				const ctrl = require(path.resolve(`${__dirname}../../../controllers/${apiVersion}/${controllerName}`))
				// Instantiate custom controller for this endpoint with the correct model
				Controller.instances[modelName] = new ctrl(Controller.api, models[modelName])
			} catch (err) {
				// If custom controller is not found, assign the default controller
				if (err.code === 'MODULE_NOT_FOUND') {
					// Instantiate default controller for this endpoint with the right model
					Controller.instances[modelName] = defaultCtrl
				} else {
					throw err
				}
			}

			// Load custom & default hooks for each model
			// If there is a custom controller with a valid hook assign that hook, otherwise assign a default hook
			const instance = Controller.instances[modelName]
			instance['read'] = instance['read'] || defaultCtrl['read']
			instance['get'] = instance['get'] || defaultCtrl['get']
			instance['create'] = instance['create'] || defaultCtrl['create']
			instance['update'] = instance['update'] || defaultCtrl['update']
			instance['delete'] = instance['delete'] || defaultCtrl['delete']

			// Add assigned hooks to all hooks
			if (!hooks[modelName]) hooks[modelName] = {}
			hooks[modelName].read = instance['read']
			hooks[modelName].get = instance['get']
			hooks[modelName].create = instance['create']
			hooks[modelName].update = instance['update']
			hooks[modelName].delete = instance['delete']
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

	// Get resource name from URL - /api/path/{resource_name}
	static getAPIResourceFromRequest(req) {
		const apiUrlParsed = new URL(req.url, [Controller.api.protocol, '://', req.headers.host].join(''))
		return apiUrlParsed.pathname.split('/')[1].toLowerCase()
	}

	/**
	 *Parses query parameters: `limit`, `fields`, `sort`, `match` and `include`.
	 * Parsed query params are attached to request object - req.queryParsed.
	 *
	 * limit:number, fields:Object, sort:Object, match:Object, include:Object
	 * @param 	{Object} 	req 	[The request object]
	 */
	static parseQueryStringsFromRequest(req) {
		return new Promise((resolve, reject) => {
			req.queryParsed = {}
			if (isEmptyObject(req.query)) resolve(true)

			let limit = 0, fields = {}, sort = {}, match = {}, include = {}
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

			// Fields (handle format JSON object - fields={"id":true})
			if (typeof fields === 'string') {
				try {
					fields = JSON.parse(fields)
					// Transform prop 'id' in '_id' (mongodb supported field)
					if (fields.id !== undefined) fields._id = fields.id; delete fields.id;
				} catch (err) {}

			// Fields (handle format JS object - fields[id]=true)
			} else {
				for (let f in fields) {
					if (fields.hasOwnProperty(f)) {
						// Transform prop 'id' in '_id' (mongodb supported field)
						if (f === 'id') { fields._id = toBoolean(fields[f]); delete fields.id; }
						else { fields[f] = toBoolean(fields[f]) }
					}
				}
			}
			req.queryParsed.limit = limit
			req.queryParsed.fields = fields
			req.queryParsed.sort = sort
			req.queryParsed.match = match
			req.queryParsed.include = include
			resolve(true)
		})
	}

	/**
	 * Default error handler.
	 * @param 	{Object} 		req 		The request object
	 * @param 	{Object} 		res 		The response object
	 * @param 	{function} 	next 		The callback to the next program handler
	 */
  static async errorHandler(err, req, res, next) {
		const statusCodeMap = {
			'ForbiddenError': 403,
			'BadRequestError': 400,
			'UnauthorizedError': 401,
			'NotFoundError': 404,
			'MethodError': 405,
			'NotAcceptableError': 406,
			'ConflictError': 409,
			'UnsupportedError': 415,
			'UnprocessableError': 422,
			'InternalServerError': 500
		}
		const defaultErrorMessageMap = {
			'ForbiddenError': 'Forbidden',
			'UnauthorizedError': 'Access denied',
			'BadRequestError': 'There is a problem with the request',
			'UnsupportedError': 'Unsupported media type',
			'InternalServerError': 'Server error'
		};
		const code = statusCodeMap[err.name] || 500;
		const errObj = {
			name: err.name || 'InternalServerError',
			message: err.message || defaultErrorMessageMap[err.name] || 'Message not specified',
			data: { ...err.data || {} },
			stack: err.details || err.stack
		};
		if (!res.headersSent) res.status(code).json(errObj);
		return Controller.logError(err)
  }

	static createErrors() {
		const createError = (name = '', message, data = null, ctx) => {
			var instance = new Error(message);
			instance.name = name;
			instance.data = data;
			instance.datetime = new Date().toISOString();
			Object.setPrototypeOf(instance, Object.getPrototypeOf(ctx));
			if (Error.captureStackTrace) {
				Error.captureStackTrace(instance, Controller.errors[name]);
			}
			return instance;
		}
		return {
			'ForbiddenError': function() { return createError('ForbiddenError', arguments[0], arguments[1], this) },
			'BadRequestError': function() { return createError('BadRequestError', arguments[0], arguments[1], this) },
			'UnauthorizedError': function() { return createError('UnauthorizedError', arguments[0], arguments[1], this) },
			'NotFoundError': function() { return createError('NotFoundError', arguments[0], arguments[1], this) },
			'MethodError': function() { return createError('MethodError', arguments[0], arguments[1], this) },
			'NotAcceptableError': function() { return createError('NotAcceptableError', arguments[0], arguments[1], this) },
			'ConflictError': function() { return createError('ConflictError', arguments[0], arguments[1], this) },
			'UnsupportedError': function() { return createError('UnsupportedError', arguments[0], arguments[1], this) },
			'UnprocessableError': function() { return createError('UnprocessableError', arguments[0], arguments[1], this) },
			'InternalServerError': function() { return createError('InternalServerError', arguments[0], arguments[1], this) }
		};
	}

	static logError(error) {
		console.error(error)
	}

	static get api() { return _api }
	static get instances() { return _instances }

	static modify(obj, newObj) {
    Object.keys(obj).forEach((key) => {
			delete obj[key]
		})
    Object.keys(newObj).forEach((key) => {
      obj[key] = newObj[key]
    })
  }

}

module.exports = Controller
