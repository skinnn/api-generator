const express = require('express')
const router = express.Router()

/**
	Base: /
*/

router.get('/', (req, res) => res.redirect('/login'))
router.get('/login', (req, res) => res.render('login', { title: 'Login page' }))
// Dashboard routes
router.use('/dashboard', require('./dashboard/index.js')) 

module.exports = router