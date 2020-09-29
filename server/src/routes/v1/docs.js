const express = require('express')
const router = express.Router()
const DocsController = require('../../controllers/v1/DocsController.js')

/**
	Base: /api/docs
*/

/* GET */
// router.get('/', DocsController.getEndpoints)
router.get('/status', DocsController.getVisibilityStatus)

module.exports = router