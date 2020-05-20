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
		Controller.api.model = builtinEndpoints
		// TODO: Create and load builtin models

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
			// Save default schemas in the db
			await Controller.loadStaticEndpoints()
			// Load dynamic routes created from the GUI/endpoint builder
			await Controller.loadDynamicEndpoints()
			// Create root user from the config
			await Controller.createRootUser()
			
			console.log('Init complete')
		} catch (err) {
			throw err
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
			const url = `mongodb://${db.user}:${db.password}@${db.host}:${db.port}/${db.name}`
			const options = {
				useNewUrlParser: true,
				useUnifiedTopology: true,
				useFindAndModify: false,
				authSource: db.name
			}
			const mongooseConnection = await mongoose
				.connect(url, options, (err) => {
					if (err) {
						Controller.logError(err)
					}
				})
			Controller.api.db.connection = mongooseConnection.connections[0].db
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
		const router = require('../../routes/v1/api/index.js')
		const endpoints = await Endpoint.getEndpoints()
		const methods = ['get', 'post', 'patch', 'delete']
		
		endpoints.forEach(endpoint => {
			const endpointName = endpoint.name[0].toUpperCase() + endpoint.name.slice(1)
			// Load models for dynamic endpoints
			Controller.api.model[endpoint.name] = endpoint._schema

			methods.forEach(method => {
				router[method]('/' + endpoint.name, (req, res, next) => {
					// TODO: Check if there is defined a custom controller for this endpoint before assigning the default one
					const operation = this.getCRUDFromRequest(method)
					var controllerPath = path.resolve(__dirname+'../../../'+'controllers/'+Controller.api.version+'/'+endpointName+'Controller'+'.js')
					var ctrl
					try {
						ctrl = require(controllerPath)
						// TODO: Here load model created for the endpoint instead of dummy test data
						Controller.instances[endpoint.name] = new ctrl(Controller.api, endpoint._schema)
					
					} catch (err) {
						if(err.code === 'MODULE_NOT_FOUND'){
							controllerPath = path.resolve(__dirname+'../../../'+'controllers/'+Controller.api.version+'/'+'Default.js')
							ctrl = require(controllerPath)
							// TODO: Here load model created for the endpoint instead of dummy test data
							Controller.instances[endpoint.name] = new ctrl(Controller.api, endpoint._schema)
						} else {
							throw err
						}
					}

					Controller.instances[endpoint.name][operation](req, res, next)
				})
			})
		})

		return router
	}

	static defineResponseErrors() {
		Controller.api.errors = {
			/**
			 * 
			 * @param {Object} 		res 			[Response object]
			 * @param {string} 		[error] 	[Optional error text]
			 */
			NotFound(res, error) {
				if (!error) var error = 'Resource you are looking for is not found.'
				return res.status(404).json({
					message: error
				})
			},
			/**
			 * 
			 * @param {Object} 		res 			[Response object]
			 * @param {string} 		[error] 	[Optional error text]
			 */
			Forbidden(res, error) {
				if (!error) var error = 'Access denied.'
				return res.status(404).json({
					message: error
				})
			},
		}
	}

	static validateSchema(modelName, record) {
		console.log('modelName: ', modelName)
		console.log('record: ', record)
		if(!this.api.validators) this.api.validators = {}
		// let schema = this.api.model[modelName]
		let schema = {
			access: {
				create: { roles: [Array] },
				read: { roles: [Array], owner: true },
				update: { roles: [Array], owner: true },
				delete: { roles: [Array], owner: true }
			},
			type: 'object',
			required: [ 'categories' ],
			_id: '5ec4882c02c87d2a84228251', // can be removed since its igored in schema validation
			name: 'posts',
			title: 'Post title',
			description: 'Post description',
			properties: {
				categories: {
					title: 'Post categories',
					description: 'Array of post categories',
					type: 'array',
					// format: 'date-time', // should exist only if property type is string
					// relation: [Object], // remove 
					// required: true // remove 
				}
			}
		}
		// console.log('this.api.model: ', this.api.model)
		// console.log('model schema: ', schema)
		if(!this.api.validators[modelName]) {
			this.api.validators[modelName] = this.ajv.compile(schema)
		}
		// var valid = this.api.validators[modelName]
		// var validate = ajv.compile(schema)
		var valid = this.api.validators[modelName](record)
		if (!valid) {
			console.log('validator: ', this.api.validators[modelName])
			return false
		}
		console.log('validator errors: ', this.api.validators[modelName].errors)
		return true
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
				const customer = await stripe.customers.create({
					name: user.name || null,
					email: user.email || null,
					address: user.address || null,
					phone: user.phone || null,
					description: 'Root user. Customer created while creating a root user account.'
				})
				user.stripeCustomer = customer.id
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
				console.log(`Customer for root created: ${customer}`)
			}
		} catch (err) {
			throw err
		}
	}

	static getCRUDFromRequest(method) {
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