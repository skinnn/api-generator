const express = require('express')
const router = express.Router()
const LoginController = require('../../controllers/v1/LoginController.js')

/*
	Base: /api/login
*/

router.get('/', LoginController.getLogins)
router.post('/', LoginController.createLogin)

/* DELETE */
router.delete('/', LoginController.deleteLogin)

module.exports = router