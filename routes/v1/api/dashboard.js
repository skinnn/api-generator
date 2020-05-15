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

module.exports = router