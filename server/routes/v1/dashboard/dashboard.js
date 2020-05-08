const express = require('express')
const router = express.Router()
const Auth = require('../../../middleware/authentication.js')
const DashboardController = require('../../../controllers/v1/dashboard/DashboardController.js')

/*
	Base: /api/dashboard
*/
router.use((req, res, next) => { req.resource = 'dashboard'; next() })

/**
 * Unprotected routes
 * ============================================================ */

// Authentication middleware
router.use(Auth.ensureAuthenticated)

/**
 * Protected routes
 * ============================================================ */
router.get('/', DashboardController.getIndexPage)

module.exports = router