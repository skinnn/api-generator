const paypal = require('paypal-rest-sdk')
const config = require('./config.js')

// PayPal configuration
paypal.configure({
	mode: config.paymentOptions.paypal.mode,
	clientId: config.paymentOptions.paypal.clientId,
	clientSecret: config.paymentOptions.paypal.clientSecret
})

module.exports = paypal