const express = require('express')
const router = express.Router()
const path = require('path')
const Authentication = require('../lib/Authentication.js')

router.use('/', express.static(path.join(__dirname, '../public')))

/**
	Base: /
*/

// API routes
// router.use('/api',
// 	// Authentication middleware is used for all /api/* endpoints
// 	Authentication.ensureAuthenticated,
// 	require('./v1/api/index.js'))
// const apiRouter = require('./v1/api/index.js')
router.use('/api', Authentication.ensureAuthenticated)
router.use('/api', function APIRouter(req, res, next) { require('./v1/api/index.js')(req, res, next) } )

// Index routes
router.use('/', require('./v1/indexRoutes.js'))

// Catch all route
router.use('*', (req, res) => {
	return res.status(404).json({
		message: 'Resource you are looking for is not found.'
	})
})

module.exports = router