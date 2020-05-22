const Controller = require('./Controller.js')

class DashboardController extends Controller {
	constructor(api) {
		super(api)

		this._apiData = { name: api.name }
	}

	static getIndexPage(req, res) {
		return res.render('dashboard/index', {
			layout: 'dashboard',
			title: 'Dashboard',
			page: { index: true },
			api: DashboardController._apiData
		})
	}

	static getDocsPage(req, res) {
		return res.render('dashboard/docs', {
			layout: 'dashboard',
			title: 'Documentation',
			page: { docs: true },
			api: DashboardController._apiData
		})
	}

	static getEndpointPage(req, res) {
		return res.render('dashboard/endpoint', {
			layout: 'dashboard',
			title: 'Endpoints',
			page: { endpoint: true },
			api: DashboardController._apiData
		})
	}

	static getUsersPage(req, res) {
		return res.render('dashboard/users', {
			layout: 'dashboard',
			title: 'Users',
			page: { users: true },
			api: DashboardController._apiData
		})
	}

	static getLoginsPage(req, res) {
		return res.render('dashboard/logins', {
			layout: 'dashboard',
			title: 'Logins',
			page: { logins: true },
			api: DashboardController._apiData
		})
	}
}

module.exports = DashboardController