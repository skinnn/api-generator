const mongoose = require('mongoose')
const config = require('../../config/config.js')
const UserController = require('./UserController.js')
const defaultAccessSchemas = require('../../config/schemas/Access.js')
const AccessSchema = require('../../models/AccessSchema.js')

class Controller {

	// App initialization - Runs when server starts/restarts
	static async init() {
		try {
			// Connect to a MongoDB
			await this.connectDB()
			// Create root user from the config
			await UserController.createRootUser(config.rootUser)
			// TODO: Save default schemas in the db
			this.loadDefaultSchemas(defaultAccessSchemas)
			
			console.log('Init complete')
		} catch (err) {
			throw err
		}
	}

	static async connectDB() {
		try {
			await mongoose
				.connect(`mongodb://localhost:${config.db.port}/${config.db.name}`, {
					useNewUrlParser: true,
					useUnifiedTopology: true,
					useFindAndModify: false
				})
				.then(console.log('Database connected..'))
				.catch(err => console.error(err))
		} catch (err) {
			console.error(err)
			return res.send(500).json({
				success: false,
				message: err
			})
		}
	}

	static async loadDefaultSchemas(defaultSchemas) {
		try {
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
				// If a default schema does not exist, create aone
				if (!schema) {
					await AccessSchema.createSchema(defaultSchemas[name])
				}
			}
		} catch (err) {
			throw err
		}
	}

}

module.exports = Controller