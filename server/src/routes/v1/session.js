const express = require('express')
const router = express.Router()
const SessionController = require('../../controllers/v1/SessionController.js')

/*
	Base: /api/login
*/

router.get('/', SessionController.getSessions)
router.post('/', SessionController.createSession)

/* DELETE */
router.delete('/', SessionController.deleteSession)

module.exports = router