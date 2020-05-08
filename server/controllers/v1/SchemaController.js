// const fs = require('fs')
// const path = require('path')
const Controller = require('./Controller.js')
const AccessSchema = require('../../models/AccessSchema.js')

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
		let exists = await AccessSchema.getSchemaByName(req.body.resource)
		if (exists) {
			return res.status(400).json({
				success: false,
				message: 'Schema already exist'
			})
		}
		try {
			let schema = await AccessSchema.createSchema(req.body)
			if (schema) {
				return res.status(200).json({
					schema: schema
				})
			}
		} catch (err) {
			throw err
		}
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