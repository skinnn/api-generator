const DefaultController = require('./DefaultController')

// TODO: Overriding DefaultController methods not working, extending a Controller works
class TestController extends DefaultController {
	constructor(api, model) {
		super(api)
		this._model = model
	}

	async read(req, res, next) {
		console.log(req)
		res.status(200).json({ message: 'WORKS '})
	}

	async delete(req, res, next) {

	}
}

module.exports = TestController