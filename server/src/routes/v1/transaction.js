const express = require('express')
const router = express.Router()
const PaypalController = require('../../../controllers/v1/transactions/PaypalController.js')
const PaypalInstance = new PaypalController()
const StripeController = require('../../../controllers/v1/transactions/StripeController.js')

/**
 *	Base: /api/transaction
 */

/**
 * Paypal
 */
router.post('/paypal', PaypalInstance.createTransaction)
router.get('/paypal/success', PaypalInstance.transactionSuccess)
router.get('/paypal/fail', PaypalInstance.transactionFail)

/**
 * Stripe
 */
router.post('/stripe', StripeController.createTransaction)

module.exports = router