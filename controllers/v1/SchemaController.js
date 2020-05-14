const fs = require('fs')
const path = require('path')
const helpers= require('../../lib/helpers.js')
const Controller = require('./Controller.js')
const AccessSchema = require('../../models/AccessSchema.js')
const builtInAccessSchemas = require('../../config/schemas/Access.js')

class SchemaController extends Controller {
	constructor() {
		super()
	}

	static async getSchemaByName(req, res) {
		try {
			let schema = await AccessSchema.getSchemaByName(req.params.name)
			if (schema) return res.status(200).json(schema)
			else res.status(404).json({ success: false, message: 'Schema with specified name is not found.' })
		
		} catch (err) {
			throw err
		}
	}

	static async createSchema(req, res) {
		res.set('Accept', 'application/json')
		const exists = await AccessSchema.getSchemaByName(req.body.resource)
		if (exists) {
			return res.status(400).json({
				success: false,
				message: 'Schema already exist'
			})
		}
		try {
			const b = req.body
			// Save schema to db
			const dbSchema = await AccessSchema.createSchema(b)

			return res.status(200).json(dbSchema)
		} catch (err) {
			console.error(err)
			return res.status(400).json({
				message: err
			})
		}
	}

	static async updateSchemaById(req, res) {
		res.set('Accept', 'application/json')
		const fields = req.body.replace

		if (!fields) {
			return res.status(400).json({
				success: false,
				message: 'Fields property not specified.'
			})
		}
		const fieldsEmpty = helpers.isEmptyObject(fields)
		if (fieldsEmpty) {
			return res.status(400).json({
				success: false,
				message: 'Fields are not specified.'
			})
		}

		// // Initial fields
		// var fieldsToUpdate = {
		// 	resource: fields.resource
		// }
		// // Handle access fields update
		// if (fields.access) {
		// 	for (const f in fields.access) {
		// 		// Roles field
		// 		let rolesProp = `access.${f}.roles`
		// 		let rolesVal = fields.access[f].roles
		// 		rolesVal ? fieldsToUpdate[rolesProp] = rolesVal : null
		// 		// Owner field
		// 		let ownerProp = `access.${f}.owner`
		// 		let ownerVal = fields.access[f].owner
		// 		if (ownerVal === true || ownerVal === false) {
		// 			fieldsToUpdate[ownerProp] = ownerVal
		// 		}
		// 	}
		// }
		try {
			const schema = await AccessSchema.updateSchemaById(req.params.id, fields)

			return res.status(200).json(schema)
		} catch (err) {
			throw err
		}
	}

	// Get contents from schema file, add new schema and save file
	static writeSchemaToFile(resource, schemaToSave) {
		return new Promise((resolve, reject) => {
			const schemaFile = path.join(__dirname, '../../config/schemas/Access.js')
			builtInAccessSchemas[resource] = schemaToSave
			const data = 'module.exports = ' + JSON.stringify(builtInAccessSchemas, null, 2)
			fs.writeFile(schemaFile, data, 'utf-8', (err) => {
				if (err) reject(err)
				resolve(data)
			})
		})
	}
}

module.exports = SchemaController