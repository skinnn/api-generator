const express = require('express')
const router = express.Router()
const SchemaController = require('../../../controllers/v1/SchemaController.js')

/**
	Base: /api/schema
*/

/* GET */
router.get('/:name', SchemaController.getSchemaByName)
router.post('/', SchemaController.createSchema)
router.patch('/:id', SchemaController.updateSchemaById)

module.exports = router