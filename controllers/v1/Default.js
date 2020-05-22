const Controller = require('./Controller.js')
const mongoose = require('mongoose')
const { isEmptyObject } = require('../../lib/helpers.js')
// TODO: Default controller hooks for CRUD operations: read, create, update, delete
// TODO: Add support for query params - [:id] - /api/endpoint/:id
// TODO: Add support for query strings - [sort, fields={}, limit, match]
// TODO: Customizing/extending the Default controller, testing

/**
	* Default application logic for all endpoints in case when there's no custom controller implementation.
	*	All dynamic endpoints (created through Endpoint builder GUI) use Default controller by default,
	* but can be customized by extending this controller.
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
			let errors = Controller.validateToSchema(this._model.name, record)
			if (!errors) {
				const db = Controller.api.db.connection
				const response = await db.collection(this._model.name).insertOne(req.body)
				const doc = response.ops[0]
				return res.status(201).json(doc)
				
			} else {
				let errMsg = `Property ${errors[0].dataPath ? errors[0].dataPath+' ' :''}${errors[0].message}.`
				if(errors[0].params) {
					if (errors[0].params.additionalProperty) {
						errMsg += ` Property .${errors[0].params.additionalProperty} is not allowed.`
					}
					if(errors[0].params.allowedValues) {
						errMsg += ` Allowed values: ${errors[0].params.allowedValues.join(', ')}`
					}
				}

				// return Controller.api.errors.BadRequest(res, errMsg)
				return res.status(400).json({ message: 'BadRequestError', message: errMsg })
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
		const db = Controller.api.db.connection

		// Handle GET qparams and qstrings
		if (!isEmptyObject(req.params) || !isEmptyObject(req.query)) {
			const doc = await DefaultController.handleQParamsAndQStrings(req, this._model)
			if (doc) return res.status(200).json(doc)
		}

		try {
			const docs = await db.collection(this._model.name).find().toArray()
			return res.status(200).json(docs)

			// return res.send(`<pre>${JSON.stringify(this._model, null, 2)}</pre>`)
		
		} catch (err) {
			throw err
		}
	}

	static async handleQParamsAndQStrings(req, model) {
		// console.log('METHOD: ', req.method)
		if (req.method === 'GET') {
			const db = Controller.api.db.connection
			if (!isEmptyObject(req.params)) {
				const id = req.params[0] ? req.params[0] : null
				var options = {}

				if (!isEmptyObject(req.query)) {
					if (req.query.fields && req.query.fields.length > 0) {

						try {
							var parsed = JSON.parse(req.query.fields)
							options.fields = parsed
						} catch (err) {
							// console.error(err)
						}
						
					}
				}
				// TODO Use official nodejs mongodb driver or implement Feathers (has db adapters)
				const ObjectId = mongoose.Types.ObjectId(id)
				const doc = await db.collection(model.name).findOne({_id: ObjectId}, options)
				return doc
			}
		}
	}
}

module.exports = DefaultController