const express = require('express')
const router = express.Router()
const path = require('path')
const Authentication = require('../lib/Authentication')
const masterConfig = require('../config/config')

router.use('/', express.static(path.join(__dirname, '../public')))

/**
	Base: /
*/

const apiPath = masterConfig.subPath ? masterConfig.subPath : '/'
// REST API & Dashboard built-in endpoints
router.use(apiPath,
	// Authentication middleware, used by default for all REST endpoints
	Authentication.use,
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