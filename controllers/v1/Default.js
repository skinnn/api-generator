const Controller = require('./Controller.js')
const assert = require('assert')

/**
	* Default business logic for an endpoint.
	* In case when there's no custom controller implementation
	* @param 	{Object} 	api 		[API reference]
	* @param 	{Object} 	model 	[Default model object for the controller]
	*/
class DefaultController extends Controller {

	constructor(api, model) {
		super(api)
		this._model = model
 	}

	async create(req, res, next) {
		const db = Controller.api.db.connection
		// TODO: Validate req.body against JSON Schema defined in this._model._schema
		if (!req.body) return res.status(400).json({ message: 'No data' })
		try {
			let query = await db.collection(this._model.name).insertOne(req.body)
			const doc = query.ops[0]
			return res.status(201).json({ records: doc })
			
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

	read(req, res, next) {
		// console.log('model: ', this._model)
		// TODO: Send actual posts from the db if any exist, instead of sending the model (schema)
		// TODO: maybe create input(output) - output(model) - helpers for model/dbdata
		const db = Controller.api.db.connection
		console.log(this._model)

		db.collection(this._model.name).find().toArray((err, result) => {
			if (err) throw err
			console.log('result: ', result)
			return res.json(result)
		})


			//return res.json(this._model)
			// return res.send(`<pre>${JSON.stringify(this._model, null, 2)}</pre>`)
		}
}

module.exports = DefaultController