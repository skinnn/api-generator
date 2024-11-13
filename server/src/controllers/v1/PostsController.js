const DefaultController = require('./Default.js')

/**
 * Controller used for only for testing the /posts endpoint which is created manually or by db seeding
 */
// TODO: Add any new features to the DefaultController since these controllers
// are the ones that should be modified by a developer that needs custom functionality

class PostsController extends DefaultController {
	constructor(api, model) {
		super(api)
		this._model = model
	}

	// async create(req, res) {
	// 	res.status(201).json({ message: 'create hook works' })
	// }

	// async read(req, res) {
	// 	res.status(200).json({ message: 'read hook works' })
	// }

	// async get(req, res) {
	// 	res.status(200).json({ message: 'get hook works' })
	// }

	async update(req, res) {
		res.status(200).json({ message: 'update hook works' })
	}

	async delete(req, res) {
		res.send(200).json({ message: 'delete hook works' })
	}

	// async 'GET /posts/test'(req, res) {
	// 	res.status(200).json({ message: 'Custom controller for nested hook works' })
	// }

	async 'GET /posts/test/:id'(req, res) {
		res.status(200).json({ message: 'Custom controller for nested hook works' })
	}

	async asd() {

	}
}

module.exports = PostsController
