const fs = require('fs')
const path = require('path')
const helpers= require('../../lib/helpers.js')
const Controller = require('./Controller.js')
const AccessSchema = require('../../models/AccessSchema.js')
const builtInAccessSchemas = require('../../config/schemas/Access.js')

class SchemaController extends Controller {

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
			// Save schema to file
			await SchemaController.writeSchemaToFile(b.resource, b.body)

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
		const fields = req.body.fields

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
		try {
			const schema = await AccessSchema.updateSchemaById(req.params.id, fields)
			console.log('updated schema: ', schema)

			return res.status(200).json({
				success: true,
				schema: schema
			})
		} catch (err) {
			throw err
		}
	}

	static writeSchemaToFile(resource, schemaToSave) {
		return new Promise((resolve, reject) => {
			const schemaFile = path.join(__dirname, '../../config/schemas/Access.js')
			builtInAccessSchemas[resource] = schemaToSave
			const data = 'module.exports = ' + JSON.stringify(builtInAccessSchemas)

			fs.writeFile(schemaFile, data, 'utf-8', (err) => {
				if (err) reject(err)
				else {
					resolve(data)
				}
			})
		})
	}

	// static async getSchemaByName(req, res) {
	// 	try {
	// 		const filePath = path.join(__dirname, `../../config/schemas/${req.params.name}.json`)

	// 		const file = fs.readFileSync(filePath)
	// 		if (file) {
	// 			let json = JSON.parse(file)
	// 			let formatted = JSON.stringify(json, null, 2)
				
	// 			return res.status(200).send(`<pre>${formatted}<pre>`)
	// 		}
	// 	} catch (err) {
	// 		if (err.code === 'ENOENT') {
	// 			// console.error('File not found. ', err)
	// 			return res.status(404).json({
	// 				success: false,
	// 				message: `Resource: ${req.params.name} is not found.`
	// 			})
	// 		}
	// 		throw err
	// 	}
	// }
}

module.exports = SchemaController