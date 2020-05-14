const Controller = require('../Controller.js')

class DashboardController extends Controller {

	static getIndexPage(req, res) {
		res.render('index', { title: 'Dashboard index page' })
	}
}

module.exports = DashboardController