const express = require('express')
const loginRouter = express.Router()
const LoginController = require('../../controllers/v1/LoginController.js')

/*
	Base: /api/login
*/

// loginRouter.get('/', LoginController.getUser)
loginRouter.post('/', LoginController.createLogin)

module.exports = loginRouter