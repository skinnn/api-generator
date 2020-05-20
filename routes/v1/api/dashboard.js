const express = require('express')
const router = express.Router()
const path = require('path')
const DashboardController = require('../../../controllers/v1/dashboard/DashboardController.js')

/**
	Base: /api/dashboard
*/

// Static directory
router.use('/', express.static(path.join(__dirname, '../../../public')))

router.get('/', DashboardController.getIndexPage)
router.get('/docs', DashboardController.getDocsPage)
router.get('/endpoint', DashboardController.getEndpointPage)
router.get('/users', DashboardController.getUsersPage)
router.get('/logins', DashboardController.getLoginsPage)

module.exports = router