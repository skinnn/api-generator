const Controller = require('./Controller.js')
const assert = require('assert')
// TODO: Default controllers loading (GET, POST, PATCH, DELETE)
// TODO: Add support for getting a resource by id - /api/endpoint/:id
// TODO: Add support for query parameters - [sort, fields={}, limit, match]
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
 	}

	/**
    * @param 	{Object} 		req 		The request object
    * @param 	{Object} 		res 		The response object
    * @param 	{function} 	next 		The callback to the next program handler
    * @return {Object} 		res 		The response object
    */
	async create(req, res, next) {
		const db = Controller.api.db.connection
		
		if (!req.body) return res.status(400).json({ message: 'No data' })
		try {
			// TODO: Validate req.body against JSON Schema defined in this._model._schema
			let validate = Controller.validateSchema(this._model.name, req.body)

			const response = await db.collection(this._model.name).insertOne(req.body)
			const doc = response.ops[0]
			return res.status(201).json(doc)
			
		} catch (err) {
			throw err
		}

		// let obj = req.body
		// // TODO: Validate JSON schema (AJV)
		// // const validator = this._model.validateCreate(obj)
		// if (true) {
		// // if (validator.passes()) {
		// 	let object = new this._model(obj)
		// 	object.save()
		// 		.then((savedObject) => {
		// 			return res.status(201).json({
		// 				records: [savedObject]
		// 			})
		// 		}, (err) => {
		// 			return next(err)
		// 		})
		// } else {
		// 		const appError = new AppError('input errors', BAD_REQUEST, validator.errors.all())
		// 		return next(appError)
		// }
	}

	async read(req, res, next) {
		// console.log('model: ', this._model)
		// TODO: Maybe create input(output) - output(model) - helpers for model/dbdata
		try {
			const db = Controller.api.db.connection
			console.log(this._model)

			const docs = await db.collection(this._model.name).find().toArray()
			return res.status(200).json(docs)

			// return res.send(`<pre>${JSON.stringify(this._model, null, 2)}</pre>`)
		
		} catch (err) {
			throw err
		}
	}
}

module.exports = DefaultController