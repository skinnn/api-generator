const express = require('express')
const router = express.Router()
const LoginController = require('../../controllers/v1/LoginController.js')

/*
	Base: /api/login
*/
// Define resource name
// router.use((req, res, next) => { req.resource = 'login'; next() })

router.get('/', (req, res) => res.render('login', { title: 'Login page' }))
router.post('/', LoginController.createLogin)
router.delete('/', LoginController.deleteLogin)

module.exports = router