const express = require('express')
const router = express.Router()
const path = require('path')
const DashboardController = require('../../../controllers/v1/DashboardController.js')

// TODO: After separate authentication for dashboard is created,
// move dashboard to root / instead of /api

/**
	Base: /api/dashboard
*/

// Static directory
router.use('/', express.static(path.join(__dirname, '../../../public')))

router.use('/', (req, res, next) => {
	console.log('HIT')
	if (!req.user) return res.redirect('/login')
	else return next()
})

router.get('/', DashboardController.getIndexPage)
router.get('/docs', DashboardController.getDocsPage)
router.get('/endpoint', DashboardController.getEndpointPage)
router.get('/users', DashboardController.getUsersPage)
router.get('/logins', DashboardController.getLoginsPage)

module.exports = router