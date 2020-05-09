const express = require('express')
const router = express.Router()
const UserController = require('../../controllers/v1/UserController.js')

const Authentication = require('../../lib/Authentication.js')

/**
 * Base: /api/user
 */
// // Define resource name
// router.use((req, res, next) => { req.resource = 'user'; next() })

/**
 * Unprotected routes
 * ============================================================ */

/* POST */
router.post('/', UserController.createUser)

/**
 * Protected routes
 * ============================================================ */
// Authentication middleware
router.use(Authentication.ensureAuthenticated)

/* GET */
router.get('/', UserController.getUsers)
router.get('/:id', UserController.getUserById)

/* PATCH */
router.patch('/:id', UserController.updateUserById)

/* DELETE */
router.delete('/:id', UserController.deleteUserById)


module.exports = router