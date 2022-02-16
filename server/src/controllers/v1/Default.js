const Controller = require('./Controller.js')
const { BadRequestError } = Controller.errors
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const { isEmptyObject } = require('../../lib/helpers.js')
// TODO: Default controller hooks for CRUD operations: create, read, get, update, delete
// TODO: Customizing/extending the Default controller, testing

/**
	* Default application logic for all endpoints in case when there's no custom controller implementation.
	*	All dynamic endpoints (created through Endpoint builder GUI) use this controller by default,
	* but can be customized by creating a controller with the same name as the endpoint, e.g /posts - PostsController.js.
	* get() method for each route handles getting a record by id (/endpoint/:id), while read() handles getting mutiple records
	* @extends Controller
	* @param 	{Object} 	api 		[API reference]
	* @param 	{Object} 	model 	[Model object to be used for the Default controller]
	*/
	
class DefaultController extends Controller {

	constructor(api, model) {
		super(api)
		this._model = model // _schema

		// this.read = this.read
 	}

	/**
		*	Default CREATE hook for method POST. Used to create a record.
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
			// Validate therecord against JSON Schema defined in this._model._schema
			const schemaErrors = Controller.validateToSchema(this._model.name, record)
			const error = Controller.formatSchemaErrors(schemaErrors)
			if (error) throw new BadRequestError('Schema validation error', { schemaErrors: errors })

			const db = Controller.api.db.connection
			const response = await db.collection(this._model.name).insertOne(req.body)
			if (!response.insertedId) throw new Controller.errors.InternalServerError()

			const doc =  await db.collection(this._model.name).findOne({ _id: new ObjectId(response.insertedId) })
			return res.status(201).json(doc)
		} catch (err) {
			return next(err)
		}
	}

	// TODO: Maybe create input(model) - output(model) - helpers for model - fortune
	/**
		*	Default READ hook for method GET. Used for getting more records, and filtering with
		* query parameters: limit, fields, sort, match, include
    * @param 	{Object} 		req 		The request object
    * @param 	{Object} 		res 		The response object
    * @param 	{function} 	next 		The callback to the next program handler
    */
	async read(req, res, next) {
		const db = Controller.api.db.connection
		const limit = req.queryParsed.limit, fields = req.queryParsed.fields, sort = req.queryParsed.sort, match = req.queryParsed.match, include = req.queryParsed.include;
		try {
			const docs = await db.collection(this._model.name).find().sort(sort).limit(limit).project(fields).toArray()
			return res.status(200).json(docs)
			// return res.send(`<pre>${JSON.stringify(this._model, null, 2)}</pre>`)
		
		} catch (err) {
			return next(err)
		}
	}

	// TODO: Add support for query string - [match, include]
	async get(req, res, next) {
		const id = req.params.id
		const db = Controller.api.db.connection

		const options = {
			fields: req.queryParsed.fields
		}
		try {
			const doc = await db.collection(this._model.name).findOne({_id: new ObjectId(id)}, options)
			if (doc) return res.status(200).json(doc)
		
		} catch (err) {
			return next(err)
		}
	}

	// async update(req, res, next) {

	// }

	async delete(req, res, next) {
		try {
			const id = req.params.id
			const db = Controller.api.db.connection
			const response = await db.collection(this._model.name).deleteOne({ _id: new ObjectId(id) })

			if (response.deletedCount === 0) throw new Controller.errors.NotFoundError('Record not found')

			return res.status(200).json(response)
		} catch (err) {
			return next(err)
		}
	}
}

module.exports = DefaultController