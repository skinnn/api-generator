const express = require('express')
const router = express.Router()
const path = require('path')

router.use('/', express.static(path.join(__dirname, '../public')))

/**
	Base: /
*/

// API routes
router.use('/api', require('./v1/api/index.js'))
// Index routes
router.use('/', require('./v1/indexRoutes.js'))

router.use('*', (req, res) => {
	return res.status(404).json({
		message: 'Resource you are looking for is not found.'
	})
})

module.exports = router