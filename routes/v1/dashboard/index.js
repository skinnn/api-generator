const express = require('express')
const router = express.Router()
const path = require('path')
const Authentication = require('../../../lib/Authentication.js')
const DashboardController = require('../../../controllers/v1/dashboard/DashboardController.js')


/**
	Base: /dashboard
*/

router.use('/', express.static(path.join(__dirname, '../../../public')))

// router.use((req, res, next) => { req.resource = 'dashboard'; next() })

/**
 * Unprotected routes
 * ============================================================ */

// Authentication middleware
router.use(Authentication.ensureAuthenticated)

/**
 * Protected routes
 * ============================================================ */
router.get('/', DashboardController.getIndexPage)

module.exports = router