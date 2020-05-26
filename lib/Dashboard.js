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
		// Dashboard.apiData = super.copyModel(Dashboard.api.db)
		Controller.modify(Dashboard.data, api)

		// Static directory
		router.use('/', express.static(path.join(__dirname, '../public')))

		// Authentication
		router.use(Authentication.use)

		// router.use('/', (req, res, next) => {
		// 	// TODO: ??Create separate authentication middleware for dashboard
		// 	// req.user cant be checked here because Authentication.use respond with 401 Unauthorized (API authentication)
		// 	if (!req.user) return res.redirect('/login')
		// 	else return next()
		// })

		router.get('/', Dashboard.getIndexPage)
		router.get('/docs', Dashboard.getDocsPage)
		router.get('/endpoint', Dashboard.getEndpointPage)
		router.get('/users', Dashboard.getUsersPage)
		router.get('/logins', Dashboard.getLoginsPage)
	}

	static getIndexPage(req, res) {
		return res.render('dashboard/index', {
			layout: 'dashboard',
			title: 'Dashboard',
			page: { index: true },
			data: Dashboard.data
		})
	}

	static getDocsPage(req, res) {
		return res.render('dashboard/docs', {
			layout: 'dashboard',
			title: 'Documentation',
			page: { docs: true },
			data: Dashboard.data
		})
	}

	static getEndpointPage(req, res) {
		return res.render('dashboard/endpoint', {
			layout: 'dashboard',
			title: 'Endpoints',
			page: { endpoint: true },
			data: Dashboard.data
		})
	}

	static getUsersPage(req, res) {
		return res.render('dashboard/users', {
			layout: 'dashboard',
			title: 'Users',
			page: { users: true },
			data: Dashboard.data
		})
	}

	static getLoginsPage(req, res) {
		return res.render('dashboard/logins', {
			layout: 'dashboard',
			title: 'Logins',
			page: { logins: true },
			data: Dashboard.data
		})
	}

	static get data() { return _data }
}

module.exports = Dashboard