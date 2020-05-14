const express = require('express')
const router = express.Router()
const LoginController = require('../../../controllers/v1/LoginController.js')
const Authentication = require('../../../lib/Authentication.js')

/*
	Base: /api/login
*/
// Define resource name
// router.use((req, res, next) => { req.resource = 'login'; next() })

/**
 * Unprotected routes
 * ============================================================ */
router.post('/', LoginController.createLogin)

/**
 * Protected routes
 * ============================================================ */
// Authentication middleware
router.use(Authentication.ensureAuthenticated)

/* DELETE */
router.delete('/', LoginController.deleteLogin)

module.exports = router