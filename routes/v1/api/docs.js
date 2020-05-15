const express = require('express')
const router = express.Router()
const path = require('path')
const DocsController = require('../../../controllers/v1/DocsController.js')

/*
	Base: /api/docs
*/

router.use('/', express.static(path.join(__dirname, '../../public')))
router.get('/', DocsController.getIndex)

module.exports = router