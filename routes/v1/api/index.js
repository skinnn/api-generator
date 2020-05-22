/**
 * API router
 */

const express = require('express')
const router = express.Router()
const path = require('path')

/**
 * Base: /api
 */
// Static directory
router.use('/', express.static(path.join(__dirname, '../../../public')))

// Force login page if user is not authenticated as admin
router.get('/', (req, res) => res.redirect('/api/login'))

router.use('/endpoint', require('./endpoint.js'))
router.use('/dashboard', require('./dashboard.js'))
router.use('/docs', require('./docs.js'))
router.use('/user', require('./user.js'))
router.use('/login', require('./login.js'))
// router.use('/transaction', require('./transaction.js'))

module.exports = router