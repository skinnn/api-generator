const express = require('express')
const router = express.Router()
const UserController = require('../../controllers/v1/UserController.js')

const auth = require('../../middleware/authentication.js')

/**
 * Base: /api/user
 */
router.use((req, res, next) => { req.resource = 'user'; next() })

/**
 * Unprotected routes
 * ============================================================ */

/* POST */
router.post('/', UserController.createUser)

// Authentication middleware
router.use(auth.ensureAuthenticated)

/**
 * Protected routes
 * ============================================================ */

/* GET */
router.get('/', UserController.getUsers)
router.get('/:id', UserController.getUserById)

/* PATCH */
router.patch('/:id', UserController.updateUserById)

/* DELETE */
router.delete('/:id', UserController.deleteUserById)


module.exports = router