const express = require('express')
const schemaRouter = express.Router()
const SchemaController = require('../../controllers/v1/SchemaController.js')

const auth = require('../../middleware/authentication.js')

/*
	Base: /api/schema
*/

// Authentication middleware
// schemaRouter.use(auth.ensureAuthenticated)

/* GET */
schemaRouter.get('/:name', SchemaController.getSchemaByName)

module.exports = schemaRouter