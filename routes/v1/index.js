const express = require('express')
const router = express.Router()
const path = require('path')
const Authentication = require('../../lib/Authentication')

/**
 * Base: /api
 */

// Static directory
router.use('/', express.static(path.join(__dirname, '../../../public')))
// Authentication middleware, used by all REST endpoints
router.use(Authentication.use)

// Redirect to login page
router.get('/', (req, res) => res.redirect('/dashboard/login'))
/**
 * Built-in REST Endpoints
 */
router.use('/endpoint', require('./endpoint.js'))
router.use('/user', require('./user.js'))
router.use('/login', require('./login.js'))

module.exports = router