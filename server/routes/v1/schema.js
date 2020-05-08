const express = require('express')
const router = express.Router()
const SchemaController = require('../../controllers/v1/SchemaController.js')

const auth = require('../../middleware/authentication.js')
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
router.use(auth.ensureAuthenticated)

router.post('/', SchemaController.createSchema)

module.exports = router