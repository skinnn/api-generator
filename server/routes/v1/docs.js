const express = require('express')
const router = express.Router()
const path = require('path')
const DocsController = require('../../controllers/v1/DocsController.js')
const Authentication = require('../../lib/Authentication.js')

/*
	Base: /api/docs
*/

// Static directory
router.use('/', express.static(path.join(__dirname, '../../public')))

/**
 * Protected routes
 * ============================================================ */
router.get('/', DocsController.getIndex)

/**
 * Unprotected routes
 * ============================================================ */
// Authentication middleware
router.use(Authentication.ensureAuthenticated)

module.exports = router