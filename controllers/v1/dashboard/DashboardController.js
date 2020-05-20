const Controller = require('../Controller.js')

class DashboardController extends Controller {

	static getIndexPage(req, res) {
		return res.render('dashboard/index', {
			layout: 'dashboard',
			title: 'Dashboard',
			active: { index: true }
		})
	}

	static getDocsPage(req, res) {
		return res.render('dashboard/docs', {
			layout: 'dashboard',
			title: 'Documentation',
			active: { docs: true }
		})
	}

	static getEndpointPage(req, res) {
		return res.render('dashboard/endpoint', {
			layout: 'dashboard',
			title: 'Endpoint builder',
			active: { endpoint: true }
		})
	}

	static getUsersPage(req, res) {
		return res.render('dashboard/users', {
			layout: 'dashboard',
			title: 'Users',
			active: { users: true }
		})
	}

	static getLoginsPage(req, res) {
		return res.render('dashboard/logins', {
			layout: 'dashboard',
			title: 'Logins',
			active: { logins: true }
		})
	}
}

module.exports = DashboardController