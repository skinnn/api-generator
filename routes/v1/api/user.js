const express = require('express')
const router = express.Router()
const UserController = require('../../../controllers/v1/UserController.js')

/**
 * Base: /api/user
 */

/* POST */
router.post('/', UserController.createUser)

/* GET */
router.get('/', UserController.getUsers)
router.get('/:id', UserController.getUserById)

/* PATCH */
router.patch('/:id', UserController.updateUserById)

/* DELETE */
router.delete('/:id', UserController.deleteUserById)


module.exports = router