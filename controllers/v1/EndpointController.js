const fs = require('fs')
const path = require('path')
const helpers= require('../../lib/helpers.js')
const Controller = require('./Controller.js')
const Endpoint = require('../../models/Endpoint.js')
const builtInEndpoints = require('../../config/schemas/Endpoints.js')

class EndpointController extends Controller {
	constructor() {
		super()
	}

	static async getEndpointByName(req, res) {
		try {
			let schema = await Endpoint.getEndpointByName(req.params.name)
			if (schema) return res.status(200).json(schema)
			else res.status(404).json({ success: false, message: 'Schema with specified name is not found.' })
		
		} catch (err) {
			throw err
		}
	}

	static async getEndpoints(req, res) {
		let endpoints = await Endpoint.getEndpoints()
		return res.status(200).json(endpoints)
	}

	static async createEndpoint(req, res) {
		res.set('Accept', 'application/json')
		const endpoint = req.body
		try {
			const exists = await Endpoint.getEndpointByName(endpoint.name)
			if (exists) {
				return res.status(400).json({
					success: false,
					message: `Endpoint already exist. Endpoint: ${endpoint.name}`
				})
			}

			for (const prop in endpoint.properties) {
				if (endpoint.properties.hasOwnProperty(prop)) {
					// Delete unnecessary endpoint property data
					delete endpoint.properties[prop].id
					delete endpoint.properties[prop].name
					delete endpoint.properties[prop].required
					// Allow prop type only if prop format is string
					if (!endpoint.properties[prop].format || endpoint.properties[prop].type !== 'string') delete endpoint.properties[prop].format
					// TODO use relation and then delete it
					delete endpoint.properties[prop].relation
				}
			}

			const newEndpoint = {
				name: endpoint.name,
				_schema: endpoint,
				__owner: req.user.id
			}
			// Save endpoint in the db
			const savedEndpoint = await Endpoint.createEndpoint(newEndpoint)
			console.log('Created endpoint: ', savedEndpoint)
			// TODO: Potentially create helper for adding a single (new) endpoint to improve performance
			// Reload dynamic routes so new endpoint is added, no need to await
			Controller.loadDynamicEndpoints()

			// TODO: Generate docs for created endpoint (DocsController)

			return res.status(201).json({ success: true, record: savedEndpoint })
		} catch (err) {
			console.error(err)
			return res.status(400).json({
				message: err
			})
		}
	}

	static async updateEndpointById(req, res) {
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
			const schema = await Endpoints.updateEndpointById(req.params.id, fields)

			return res.status(200).json(schema)
		} catch (err) {
			throw err
		}
	}

	static async deleteEndpointById(req, res) {
		// TODO: Reload dynamic endpoints
		// TODO: Delete default controller instance for deleted dynamic endpoint
		// TODO: Get schema for dynamic endpoint, e.g posts
		try {
			var deletedEndpoint = await Endpoint.deleteEndpointById(req.params.id)
			try {
				// Remove collection
				const isCollectionDeleted = await Controller.api.db.connection.dropCollection(`${deletedEndpoint.name}`)				
			} catch (err) {
				if (err.name === 'MongoError') {
					if (err.message === 'ns not found' || err.errmsg === 'ns not found' || err.codeName === 'NamespaceNotFound') {
						// console.log(`Collection: ${deletedEndpoint.name} - doesnt exist`)
					}
				} else {
					throw err
				}
			}

			// Reload dynamic routes
			// Controller.loadDynamicEndpoints()
			Controller.removeDynamicEndpoint(deletedEndpoint.name)
			return res.status(200).json(deletedEndpoint)
		} catch (err) {
			throw err
		}
		// Recreate doc for development
		// const d = JSON.parse(JSON.stringify(deletedEndpoint))
		// delete deletedEndpoint._id
		// delete deletedEndpoint.created
		// await Endpoint.createEndpoint(d)
	}

	// Get contents from schema file, add new schema and save file
	// static writeSchemaToFile(resource, schemaToSave) {
	// 	return new Promise((resolve, reject) => {
	// 		const schemaFile = path.join(__dirname, '../../config/schemas/Access.js')
	// 		builtInEndpointss[resource] = schemaToSave
	// 		const data = 'module.exports = ' + JSON.stringify(builtInEndpointss, null, 2)
	// 		fs.writeFile(schemaFile, data, 'utf-8', (err) => {
	// 			if (err) reject(err)
	// 			resolve(data)
	// 		})
	// 	})
	// }
}

module.exports = EndpointController