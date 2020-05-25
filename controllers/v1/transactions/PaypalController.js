const Controller = require('../Controller.js')
const paypal = require('../../../config/paypal.js')

/**
 * Provides CRUD operations for Paypal transactions
 */

class PaypalController extends Controller {

	createTransaction(req, res) {
		const transaction = req.body
		// TODO: Handle errors if any transaction prop is missing
		console.log(transaction)
		const createPayment = {
			intent: 'sale',
			payer: {
				payment_method: 'paypal'
			},
			redirect_urls: {
				return_url: 'http://localhost:8090/api/transaction/paypal/success',
				cancel_url: 'http://localhost:8090/api/transaction/paypal/cancel'
			},
			transactions: [transaction]
		}
		const createPaymentJSON = JSON.stringify(createPayment)

		// Create payment
		paypal.payment.create(createPaymentJSON, function (error, payment) {
			if (error) throw error

			for (let i = 0; i < payment.links.length; i++) {
				if (payment.links[i].rel === 'approval_url') {
					return res.status(200).json({
						message: 'Redirect',
						url: payment.links[i].href
					})
				}
			}
		})
	}

	transactionSuccess(req, res) {
		// console.log('params: ', req.params)
		// console.log('queries: ', req.query)
		const payerId = req.query.PayerID
		const paymentId = req.query.paymentId

		const executePayment = {
			payer_id: payerId,
			transactions: [
				{
					amount: {
						currency: 'EUR',
						total: '6.00'
					}
				}
			]
		}

		const executePaymentJSON = JSON.stringify(executePayment)
		
		paypal.payment.execute(paymentId, executePaymentJSON, (error, payment) => {
			if (error) {
				console.log(error.response)
				throw error
			}

			console.log('Get Payment Response')
			console.log(JSON.stringify(payment, null, 4))

			return res.status(200).json({
				message: 'Payment success',
				transaction: payment
			})
		})
	}

	transactionFail() {
		return res.status(400).json({
			success: false,
			message: 'Paypal transaction failed'
		})
	}
}

module.exports = PaypalController