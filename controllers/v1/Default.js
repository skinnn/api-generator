const Controller = require('./Controller.js')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const { isEmptyObject, toBoolean } = require('../../lib/helpers.js')
// TODO: Default controller hooks for CRUD operations: read, create, update, delete
// TODO: Add support for query params - [:id] - /api/endpoint/:id
// TODO: Add support for query strings - [sort, fields={}, limit, match]
// TODO: Customizing/extending the Default controller, testing

/**
	* Default application logic for all endpoints in case when there's no custom controller implementation.
	*	All dynamic endpoints (created through Endpoint builder GUI) use this controller by default,
	* but can be customized by creating a controller with the same name as the endpoint, e.g /posts - PostsController.js.
	*
	* get() method for each route handles getting a record by id (/endpoint/:id), while read() handles getting mutiple records
	* @param 	{Object} 	api 		[API reference]
	* @param 	{Object} 	model 	[Model object for the Default controller]
	*/
	
class DefaultController extends Controller {

	constructor(api, model) {
		super(api)
		this._model = model // _schema

		// this.read = this.read
 	}

	/**
		*	Default CREATE logic for dynamic endpoints for method POST, PATCH.
    * @param 	{Object} 		req 		The request object
    * @param 	{Object} 		res 		The response object
    * @param 	{function} 	next 		The callback to the next program handler
    */
	async create(req, res, next) {
		// If body is empty
		if (isEmptyObject(req.body)) return res.status(400).json({ message: 'No data' })

		var record = req.body
		// Add built in props to record
		record.created = new Date(Date.now()).toISOString()
		record.updated = null
		try {
			// Validate record against JSON Schema defined in this._model._schema
			const schemaErrors = Controller.validateToSchema(this._model.name, record)
			const error = Controller.formatSchemaErrors(schemaErrors)
			
			if (!error) {
				const db = Controller.api.db.connection
				const response = await db.collection(this._model.name).insertOne(req.body)
				const doc = response.ops[0]
				return res.status(201).json(doc)

			} else {
				// TODO: Create proper error handling/mapping
				// return Controller.api.error.BadRequest(res, errMsg)
				return res.status(400).json({ message: 'BadRequestError', message: error })
			}
		} catch (err) {
			throw err
		}
	}

	// 	let obj = req.body
	// 	const validator = this._model.validateCreate(obj)
	// 	if (validator.passes()) {
	// 		let object = new this._model(obj)
	// 		object.save()
	// 			.then((savedObject) => {
	// 				return res.status(201).json({
	// 					records: [savedObject]
	// 				})
	// 			}, (err) => {
	// 				return next(err)
	// 			})
	// 	} else {
	// 			const appError = new AppError('input errors', BAD_REQUEST, validator.errors.all())
	// 			return next(appError)
	// 	}
	// }

	// TODO: Maybe create input(model) - output(model) - helpers for model/dbdata
	async read(req, res, next) {
		console.log('HIT READ')
		const db = Controller.api.db.connection
		var limit = 0, sort, fields;

		if (!isEmptyObject(req.query)) {
			if (req.query.limit) limit = parseInt(req.query.limit)
			if (req.query.sort) sort = req.query.sort
			if (req.query.fields) fields = req.query.fields
				
			// Handle fields format JSON object - fields={"_id":true}
			if (typeof fields === 'string') {
				try {
					var parsed = JSON.parse(fields)
					// Transform id in _id
					if (parsed.id === false || parsed.id === true) parsed._id = parsed.id; delete parsed.id;
					
					fields = parsed
				} catch (err) {}

			// Handle fields format JS object - fields[_id]=true
			} else {
				for (let f in fields) {
					if (fields.hasOwnProperty(f)) {
						// Transform id in _id
						if (f === 'id') { fields._id = toBoolean(fields[f]); delete fields.id; }
						else { fields[f] = toBoolean(fields[f]) }
					}
				}
			}
			
		}
		
		// Handle GET qparams and qstrings
		// if (!isEmptyObject(req.params) || !isEmptyObject(req.query)) {
		// 	const doc = await DefaultController.handleQParamsAndQStrings(req, this._model)
		// 	if (doc) return res.status(200).json(doc)
		// }

		try {
			const docs = await db.collection(this._model.name).find().limit(limit).project(fields).toArray()
			// const docs = await db.collection(this._model.name).find().toArray()
			return res.status(200).json(docs)

			// return res.send(`<pre>${JSON.stringify(this._model, null, 2)}</pre>`)
		
		} catch (err) {
			if (err.name === 'MongoError' && err.errmsg === 'Projection cannot have a mix of inclusion and exclusion.') {
				return res.status(400).json({ name: 'BadRequestError', message: 'Can not have a mix of both true and false (inclusion and exclusion) of fields.' })
			} else {
				throw err
			}
		}
	}

	async get(req, res, next) {
		console.log('HIT GET')
		const id = req.params.id
		const db = Controller.api.db.connection
		let options = {}
		if (!isEmptyObject(req.query)) {
			// Query: fields={}
			if (req.query.fields && req.query.fields.length > 0) {
				try {
					var parsed = JSON.parse(req.query.fields)
					options.fields = parsed
				} catch (err) {
				}
			}
		}

		const doc = await db.collection(this._model.name).findOne({_id: new ObjectId(id)}, options)
		if (doc) return res.status(200).json(doc)
	}

	static async handleQParamsAndQStrings(req, model) {
		const db = Controller.api.db.connection
		var options = {}, limit = 0, sort, fields;

		if (req.method === 'GET') {
			// Params: id
			if (!isEmptyObject(req.params)) {
				const id = req.params[0] ? req.params[0] : null

				if (!isEmptyObject(req.query)) {
					// Query: fields={}
					if (req.query.fields && req.query.fields.length > 0) {
						try {
							var parsed = JSON.parse(req.query.fields)
							options.fields = parsed
						} catch (err) {
						}
					}
				}
				
				const doc = await db.collection(model.name).findOne({_id: new ObjectId(id) }, options)
				return doc
			}

			// Querystrings
			if (req.query) {
				if (req.query.limit) limit = parseInt(req.query.limit)
				if (req.query.sort) sort = req.query.sort
				if (req.query.fields) fields = req.query.fields
				
				if (fields) {
					// Handle fields format - fields[_id]=true
					if (typeof fields === 'string') {
						try {
							var parsed = JSON.parse(fields)
							fields = parsed
						} catch (err) {}

					} else {
						// Handle fields format - fields={"_id":true}
						for (let f in fields) {
							if (fields.hasOwnProperty(f)) {
								fields[f] = toBoolean(fields[f])
							}
						}
					}
				}

				// TODO Use official nodejs mongodb driver or implement Feathers (has db adapters)
				const docs = await db.collection(model.name).find().limit(limit).project(fields).toArray()
				return docs
			}
			
		}
	}
}

module.exports = DefaultController