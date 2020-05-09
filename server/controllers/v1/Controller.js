const mongoose = require('mongoose')
const config = require('../../config/config.js')
const UserModel = require('../../models/User.js')
const defaultAccessSchemas = require('../../config/schemas/Access.js')
const AccessSchema = require('../../models/AccessSchema.js')

class Controller {
	constructor() {}
	
	// App initialization - Runs when server starts/restarts
	static async init() {
		try {
			// Connect to MongoDB
			await Controller.connectDB()
			// Save default schemas in the db
			await Controller.loadDefaultSchemas()
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

				mongoose.connection.on('connected', () => {
					console.log('MongoDB event connected')
				})
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
			const c = config
			const url = `mongodb://${c.db.user}:${c.db.password}@${c.db.host}:${c.db.port}/${c.db.name}`
			const options = {
				useNewUrlParser: true,
				useUnifiedTopology: true,
				useFindAndModify: false
			}
			await mongoose
				.connect(url, options, (err) => {
					if (err) {
						throw new Error(`MongoDB connection error: ${err}`)
					}
				})
				
		} catch (err) {
			throw err
		}
	}

	static async loadDefaultSchemas() {
		try {
			const defaultSchemas = defaultAccessSchemas
			let schemaNames = []
			let schemasArr = []
			for (const p in defaultSchemas) {
				// Create array of schema names
				schemaNames.push(p)
				// Crate array of schemas from object props
				schemasArr.push(defaultSchemas[p])
			}
			
			for (let name of schemaNames) {
				const schema = await AccessSchema.getSchemaByResource(name)
				// If a default schema does not exist, create one
				if (!schema) {
					await AccessSchema.createSchema(defaultSchemas[name])
				}
			}
		} catch (err) {
			throw err
		}
	}

	// Create root user if it doesnt exist
	static async createRootUser() {
		const user = config.rootUser
		try {
			const rootExist = await UserModel.getUserByUsername(user.username)
			
			if (!rootExist) {
				// If root's username changes in config.js,
				// delete the previous root user
				await UserModel.deleteOne({ roles: 'root' })

				// Create Stripe customer for this root user
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

	static logError(error) {
		console.error('Logger: ' + error)
	}

}

module.exports = Controller