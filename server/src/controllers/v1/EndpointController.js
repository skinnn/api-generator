const { isEmptyObject } = require('../../lib/helpers.js')
const Controller = require('./Controller.js')
const { BadRequestError } = Controller.errors
const Endpoint = require('../../models/Endpoint.js')

/**
 * Provides CRUD operations for endpoints
 * @extends Controller
 */
class EndpointController extends Controller {
	constructor(api) {
		super(api)
	}

	static async getEndpointByName(req, res, next) {
		try {
			let schema = await Endpoint.getEndpointByName(req.params.name)
			if (schema) return res.status(200).json(schema)
			else throw new BadRequestError(`Schema with the name "${req.params.name}" is not found`)

		} catch (err) {
			return next(err)
		}
	}

	static async getEndpoints(req, res, next) {
		try {
			let endpoints = await Endpoint.getEndpoints()
			return res.status(200).json(endpoints)
		} catch (err) {
			return next(err)
		}
	}

	static async createEndpoint(req, res, next) {
		// TODO: Create support for adding nested parameters, e.g. /posts/category, /posts/category/:id
		// TODO: Validate endpoint req body and endpoint properties
		res.set('Accept', 'application/json')
		try {
			const endpoint = req.body
			if (!endpoint.name) {
				throw new BadRequestError('Endpoint name is required');
			}
			const exists = await Endpoint.getEndpointByName(endpoint.name)
			if (exists) {
				return res.status(400).json({
					message: `Endpoint already exist: ${endpoint.name}`
				})
			}

			// If creating an endpoint without properties
			endpoint.properties = endpoint.properties ? endpoint.properties :  {}
			// Add root by default
			const createRoles = endpoint.access.create.roles;
			const readRoles = endpoint.access.read.roles;
			const updateRoles = endpoint.access.update.roles;
			const deleteRoles = endpoint.access.delete.roles;
			if (!createRoles.includes('root')) createRoles.push('root');
			if (!readRoles.includes('root')) readRoles.push('root');
			if (!updateRoles.includes('root')) updateRoles.push('root');
			if (!deleteRoles.includes('root')) deleteRoles.push('root');

			for (const prop in endpoint.properties) {
				if (endpoint.properties.hasOwnProperty(prop)) {
					if (endpoint.properties[prop].name === '') {
						throw new BadRequestError('Endpoint property name is required');
					}
					// Delete unnecessary endpoint property data
					delete endpoint.properties[prop].id
					delete endpoint.properties[prop].name
					delete endpoint.properties[prop].required
					// Allow prop type only if prop format is string
					if (!endpoint.properties[prop].format || endpoint.properties[prop].type !== 'string') {
						delete endpoint.properties[prop].format
					}
					// TODO: use relation and then delete it
					delete endpoint.properties[prop].relation
				}
			}

			// Validate with builtin JSON schema model for endpoints
			const schemaErrors = await Controller.validateToSchema('endpoint', endpoint)
			if (schemaErrors) {
				const errors = Controller.formatSchemaErrors(schemaErrors)
				throw new BadRequestError('Schema validation error', { schemaErrors: errors });
				// return res.status(400).json({ message: 'BadRequestError', message: error })
			}

			const newEndpoint = {
				name: endpoint.name,
				_schema: endpoint,
				__owner: req.user.id
			}

			// Save endpoint in the db
			const savedEndpoint = await Endpoint.createEndpoint(newEndpoint)

			// TODO: Create helper for adding a single (new) endpoint to improve performance
			// Reload dynamic routes so new endpoint is added, no need to await
			Controller.loadDynamicEndpoints([savedEndpoint])

			// TODO: Generate docs for created endpoint (DocsController)

			return res.status(201).json({ success: true, record: savedEndpoint })
		} catch (err) {
			return next(err)
		}
	}

	static async updateEndpointById(req, res, next) {
		res.set('Accept', 'application/json')
		const fields = req.body.replace
		try {

			if (!fields) {
				return res.status(400).json({
					success: false,
					message: 'Fields property not specified.'
				})
			}
			const fieldsEmpty = isEmptyObject(fields)
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
			const schema = await Endpoints.updateEndpointById(req.params.id, fields)
			return res.status(200).json(schema)
		} catch (err) {
			return next(err)
		}
	}

	static async deleteEndpointById(req, res, next) {
		// TODO: Get schema for dynamic endpoint, e.g posts
		try {
			const deletedEndpoint = await Endpoint.deleteEndpointById(req.params.id)
			if (!deletedEndpoint) throw new Controller.errors.NotFoundError('Endpoint not found');
			// Remove deleted endpoint from the app
			await Controller.removeDynamicEndpoint(deletedEndpoint.name)
			await Controller.loadDynamicEndpoints()
			try {
				// Remove collection
				const isCollectionDeleted = await Controller.api.db.connection.dropCollection(`${deletedEndpoint.name}`)
			} catch (err) {
				if (err.name === 'MongoError') {
					if (err.message === 'ns not found' || err.errmsg === 'ns not found' || err.codeName === 'NamespaceNotFound') {
						console.log(`Collection "${deletedEndpoint.name}" does not exist`)
					}
				} else {
					throw err
				}
			}
			return res.status(200).json(deletedEndpoint)
		} catch (err) {
			return next(err)
		}
	}

	// Get contents from schema file, add new schema and save file
	static writeSchemaToFile(resource, schemaToSave) {
		return new Promise((resolve, reject) => {
			const schemaFilePath = path.join(__dirname, '../../config/schemas/schemas.json')
			fs.readFile(schemaFilePath, 'utf8', (err, data) => {
				if (err) throw err
				console.log('schemas.json:', JSON.parse(data))
			});
			// // const builtInEndpoints = require('../../config/schemas/Endpoints.js')
			// // builtInEndpoints[resource] = schemaToSave
			// const data = 'module.exports = ' + JSON.stringify(builtInEndpointss, null, 2)
			// fs.writeFile(schemaFilePath, data, 'utf-8', (err) => {
			// 	if (err) reject(err)
			// 	resolve(data)
			// })
		})
	}
}

module.exports = EndpointController
