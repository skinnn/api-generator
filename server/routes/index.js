const express = require('express')
const router = express.Router()
const path = require('path')

router.use('/', express.static(path.join(__dirname, '../public')))

/*
	Base: /api
*/
// TODO: Clean up
router.get('/', (req, res) => {
	// TODO: Force login page if user is not authenticated as admin
	res.redirect('/api/login')
})
router.use('/dashboard', require('./v1/dashboard/dashboard.js')) 

router.use('/docs', require('./v1/docs.js'))
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