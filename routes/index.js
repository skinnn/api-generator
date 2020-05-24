const express = require('express')
const router = express.Router()
const path = require('path')
const Authentication = require('../lib/Authentication.js')

router.use('/', express.static(path.join(__dirname, '../public')))

/**
	Base: /
*/

// REST API & Dashboard built-in routes
router.use('/api',
	// Authentication middleware, used for all /api/* endpoints
	Authentication.ensureAuthenticated,
	require('./api/v1/index.js'))

// Index routes
router.get('/', (req, res) => res.redirect('/login'))
router.get('/login', (req, res) => res.render('login', { title: 'Login page' }))

// Catch all route
router.use('*', (req, res) => {
	return res.status(404).json({
		name: 'NotFoundError',
		message: 'Resource you are looking for is not found.'
	})
})

module.exports = router