const express = require('express')
const userRouter = express.Router()
const UserController = require('../../controllers/v1/UserController.js')

const auth = require('../../middleware/authentication.js')

/**
 * Base: /api/user
 */

/**
 * Unprotected routes
 * ============================================================ */

/* POST */
userRouter.post('/', UserController.createUser)

// Authentication middleware
userRouter.use(auth.ensureAuthenticated)

/**
 * Protected routes
 * ============================================================ */

/* GET */
userRouter.get('/', UserController.getUsers)
userRouter.get('/:id', UserController.getUserById)

/* PATCH */
userRouter.patch('/:id', UserController.updateUserById)

/* DELETE */
userRouter.delete('/:id', UserController.deleteUserById)


module.exports = userRouter