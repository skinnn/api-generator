const Controller = require('./Controller.js')

var apiData

/**
 * Manages administration dashboard routes
 * @extends Controller
 */
class DashboardController extends Controller {
	constructor(api) {
		super(api)

		apiData = {
			name: api.name,
			version: api.version
		}
	}

	static getIndexPage(req, res) {
		return res.render('dashboard/index', {
			layout: 'dashboard',
			title: 'Dashboard',
			page: { index: true },
			api: apiData
		})
	}

	static getDocsPage(req, res) {
		return res.render('dashboard/docs', {
			layout: 'dashboard',
			title: 'Documentation',
			page: { docs: true },
			api: apiData
		})
	}

	static getEndpointPage(req, res) {
		return res.render('dashboard/endpoint', {
			layout: 'dashboard',
			title: 'Endpoints',
			page: { endpoint: true },
			api: apiData
		})
	}

	static getUsersPage(req, res) {
		return res.render('dashboard/users', {
			layout: 'dashboard',
			title: 'Users',
			page: { users: true },
			api: apiData
		})
	}

	static getLoginsPage(req, res) {
		return res.render('dashboard/logins', {
			layout: 'dashboard',
			title: 'Logins',
			page: { logins: true },
			api: apiData
		})
	}
}

module.exports = DashboardController