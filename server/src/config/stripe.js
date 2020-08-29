const config = require('./config.js')
const stripe = require('stripe')(config.paymentOptions.stripe.secret)

module.exports = stripe