const express = require('express')
const router = express.Router()
const path = require('path')

router.use('/', express.static(path.join(__dirname, '../../../public')))

/*
	Base: /api
*/


// Force login page if user is not authenticated as admin
router.get('/', (req, res) => res.redirect('/api/login'))

router.use('/docs', require('./docs.js'))
router.use('/schema', require('./schema.js'))

router.use('/user', require('./user.js'))
router.use('/login', require('./login.js'))
router.use('/transaction', require('./transaction.js'))

// Catch all route
router.use('*', (req, res) => {
	return res.status(404).json({
		message: 'Resource you are looking for is not found.'
	})
})

module.exports = router