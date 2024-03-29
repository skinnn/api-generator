const Controller = require('../Controller.js')
const stripe = require('../../../config/stripe.js')

/**
 * Provides CRUD operations for Paypal transactions
 */
class StripeController extends Controller {

	static async createTransaction(req, res) {
		try {
			// const paymentIntent = await stripe.paymentIntents.create({
			// 		amount: 2000,
			// 		currency: 'usd',
			// 		payment_method_types: ['card']
			// })
			console.log(paymentIntent)

			res.status(200).json({
				message: 'Transaction success'
			})
		} catch (err) {
			throw err
		}
	}

	static transactionSuccess(req, res) {
	}

	static transactionFail() {
		return res.status(400).json({
			success: false,
			message: 'Stripe transaction failed'
		})
	}
}

module.exports = StripeController