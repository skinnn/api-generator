const express = require('express')
const router = express.Router()
const path = require('path')
const masterConfig = require('../config/config')

router.use('/', express.static(path.join(__dirname, '../public')))

/**
	Base: /
*/

const apiPath = masterConfig.settings.restApi.path || '/api'
// REST API router
router.use(`${apiPath}`, require(`./v1/index.js`))

// Index routes
router.get('/', (req, res) => res.redirect(`${apiPath}/dashboard/login`))

// Catch all route
router.use('*', (req, res) => {
	return res.status(404).json({
		name: 'NotFoundError',
		message: 'Resource you are looking for is not found'
	})
})

module.exports = router