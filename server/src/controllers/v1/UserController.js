const Controller = require('../v1/Controller.js')
const stripe = require('../../config/stripe.js')
const helpers = require ('../../lib/helpers.js')
// Models
const User = require('../../models/User.js')

// TODO: Allow altering of user schema & model, use JSON schema instead of mongoose schema

/**
 * Provides CRUD operations for users
 */
class UserController extends Controller {
	constructor(api) {
		super(api)
	}

	static async createUser(req, res) {
		res.set('Accept', 'application/json')

		if (req.body.roles && req.body.roles.includes('root')) {
			res.status(401).json({
				message: 'Access denied'
			})
			throw new Error('Access denied')
			// TODO: Potentially remove this session since it could be a basd intention
		}
		try {
			const userExist = await User.findOne({ username: req.body.username })
			if (userExist) {
				return res.status(400).json({
					success: false,
					message: 'User already exist'
				})
			}

			// const b = req.body
			// const fullName = b.firstName && b.lastName ? `${b.firstName.trim()} ${b.lastName.trim()}` : null
			// Create Stripe customer
			// // TODO: Move to Stripe/other controller
			// const customer = await stripe.customers.create({
			// 	name: fullName,
			// 	email: b.email,
			// 	address: {
			// 		line1: b.address || null,
			// 		line2: b.suiteNumber || null,
			// 		city: b.city || null,
			// 		country: b.country || null,
			// 		postal_code: b.postalCode || null
			// 	},
			// 	description: 'Customer created while creating a user account.',
			// 	phone: b.phone || null
			// })
			// let user = b
			// user.stripeCustomer = customer.id
			// Hash password
			const hashedPassword = await User.hashPassword(req.body.password)
			const user = new User({
				...req.body,
				password: hashedPassword
			})
			// Save user in the db
			const savedUser = await user.save()

			return res.status(201).json(savedUser)
		} catch (err) {
			throw err
		}
	}

	static async getUsers(req, res) {
		try {
			// TODO: Only return all users if admin/root is making a request
			console.log('req.user: ', req.user)
			if (req.user.roles.includes('root')) {
				const users = await User.find({})
				return res.status(200).json(users)
			} else {
				return res.status(401).json({
					message: 'Access denied'
				})
			}
		} catch (err) {
			throw err
		}
	}

	static async getUserById(req, res) {
		try {
			const user = await User.findById({ _id: req.params.id })

			return res.status(200).json(user)
		} catch (err) {
			throw err
		}
	}

	static async deleteUserById(req, res) {
		try {
			const user = await User.findOneAndDelete({ _id: req.params.id })
			if (!user) return res.status(404).json({ message: 'Resource not found' })
			return res.status(200).json(user)
		} catch (err) {
			throw err
		}
	}

	static async updateUserById(req, res) {
		res.set('Accept', 'application/json')
		const fields = req.body.replace
		const fieldsEmpty = helpers.isEmptyObject(fields)

		if (!fields) {
			return res.status(400).json({
				success: false,
				message: 'Fields property not specified.'
			})
		} else if (fieldsEmpty) {
			return res.status(400).json({
				success: false,
				message: 'Fields are not specified.'
			})
		}
		// Prevent users (non-admins) to update roles field
		if (!req.user.roles.includes('admin') && !req.user.roles.includes('root')) {
			delete fields.roles
		}
		try {
			const user = await User.updateUserById(req.params.id, fields)

			return res.status(200).json(user)
		} catch (err) {
			console.error(err)
			return res.status(500).json({
				message: err
			})
		}
	}
}

module.exports = UserController