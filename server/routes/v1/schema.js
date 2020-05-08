const express = require('express')
const router = express.Router()
const SchemaController = require('../../controllers/v1/SchemaController.js')

const Auth = require('../../middleware/authentication.js')
/*
	Base: /api/schema
*/

// Define resource name
router.use((req, res, next) => { req.resource = 'schema'; next() })

/**
 * Unprotected routes
 * ============================================================ */

/* GET */
router.get('/:name', SchemaController.getSchemaByName)


/**
 * Protected routes
 * ============================================================ */

// Authentication middleware
router.use(Auth.ensureAuthenticated)

router.post('/', SchemaController.createSchema)
router.patch('/:id', SchemaController.updateSchemaById)

module.exports = router