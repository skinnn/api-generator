const fs = require('fs')
const path = require('path')
const Controller = require('./Controller.js')

class SchemaController extends Controller {

	static async getSchemaByName(req, res) {
		try {
			const filePath = path.join(__dirname, `../../config/schemas/${req.params.name}.json`)

			const file = fs.readFileSync(filePath)
			if (file) {
				let json = JSON.parse(file)
				let formatted = JSON.stringify(json, null, 2)
				
				return res.status(200).send(`<pre>${formatted}<pre>`)
			}
		} catch (err) {
			if (err.code === 'ENOENT') {
				// console.error('File not found. ', err)
				return res.status(404).json({
					success: false,
					message: `Resource: ${req.params.name} is not found.`
				})
			}
			throw err
		}
	}
}

module.exports = SchemaController