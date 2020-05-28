const Controller = require('../controllers/v1/Controller')
const Authentication = require('./Authentication') 
const express = require('express')
const router = express.Router()
const path = require('path')

var _data = {};

/**
 * Manages administration dashboard.
 * @extends Controller
 */
class Dashboard extends Controller {
	constructor(api) {
		super(api)

		this.router = router
		this.init(api)
	}

	init(api) {
		Dashboard.data = api
		// Static directory
		router.use('/', express.static(path.join(__dirname, '../public')))

		// Login page before authentication middleware
		// TODO: Create separate authentication for dashboard, then move all routes after auth middleware
		router.get('/login', this.loginPage)

		// Authentication
		router.use(Authentication.use)

		// router.use('/', (req, res, next) => {
		// 	// req.user cant be checked here because Authentication.use respond with 401 Unauthorized (API authentication)
		// 	if (!req.user) return res.redirect('/login')
		// 	else return next()
		// })

		router.get('/', this.getIndexPage)
		router.get('/settings', this.getSettingsPage)
		router.get('/docs', this.getDocsPage)
		router.get('/endpoint', this.getEndpointPage)
		router.get('/users', this.getUsersPage)
		router.get('/logins', this.getLoginsPage)
	}

	loginPage(req, res, next) {
		return res.render('dashboard/login', {
			layout: 'main',
			title: 'Login',
			apiPath: Dashboard.data.settings.restApi.path
		})
	}

	getIndexPage(req, res, next) {
		return res.render('dashboard/index', {
			layout: 'dashboard',
			title: 'Dashboard',
			page: { index: true },
			data: Dashboard.data
		})
	}

	getSettingsPage(req, res, next) {
		return res.render('dashboard/settings', {
			layout: 'dashboard',
			title: 'Settings',
			page: { settings: true },
			data: Dashboard.data
		})
	}

	getDocsPage(req, res, next) {
		return res.render('dashboard/docs', {
			layout: 'dashboard',
			title: 'Documentation',
			page: { docs: true },
			data: Dashboard.data
		})
	}

	getEndpointPage(req, res, next) {
		console.log(Dashboard.data)
		return res.render('dashboard/endpoint', {
			layout: 'dashboard',
			title: 'Endpoints',
			page: { endpoint: true },
			data: Dashboard.data
		})
	}

	getUsersPage(req, res, next) {
		return res.render('dashboard/users', {
			layout: 'dashboard',
			title: 'Users',
			page: { users: true },
			data: Dashboard.data
		})
	}

	getLoginsPage(req, res, next) {
		return res.render('dashboard/logins', {
			layout: 'dashboard',
			title: 'Logins',
			page: { logins: true },
			data: Dashboard.data
		})
	}

	static get data() { return _data }

	static set data(api) {
		_data = { name: api.name, settings: api.settings }
	}
}

module.exports = Dashboard