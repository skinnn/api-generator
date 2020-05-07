const express = require('express')
const router = express.Router()

/*
	Base: /api
*/

router.use('/schema', require('./v1/schema.js'))

router.use('/user', require('./v1/user.js'))
router.use('/login', require('./v1/login.js'))
router.use('/transaction', require('./v1/transaction.js'))

router.use('*', (req, res) => {
	return res.status(404).json({
		success: false,
		message: 'Resource you are looking for is not found.'
	})
})

module.exports = router