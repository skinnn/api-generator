const express = require('express')
const router = express.Router()
const EndpointController = require('../../../controllers/v1/EndpointController.js')

/**
	Base: /api/endpoint
*/

/* GET */
router.get('/:name', EndpointController.getEndpointByName)
router.post('/', EndpointController.createEndpoint)
router.patch('/:id', EndpointController.updateEndpointById)

module.exports = router