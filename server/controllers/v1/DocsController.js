const Controller = require('./Controller.js')
const path = require('path')

class DocsController extends Controller {

	// TODO: Finish
	// static createDocs(req, res) {
	// }

	static getIndex(req, res) {
		res.render('docs', { title: 'Documentation' })
	}
}

module.exports = DocsController