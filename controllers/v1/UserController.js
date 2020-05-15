const stripe = require('../../config/stripe.js')
const helpers = require ('../../lib/helpers.js')
// Models
const UserModel = require('../../models/User.js')

class UserController {

	static async createUser(req, res) {
		res.set('Accept', 'application/json')
		try {
			const userExist = await UserModel.getUserByUsername(req.body.username)
			if (userExist) {
				return res.status(400).json({
					success: false,
					message: 'User already exist'
				})
			}

			const b = req.body
			const fullName = b.firstName && b.lastName ? `${b.firstName.trim()} ${b.lastName.trim()}` : null
			// Create Stripe customer
			// TODO: Move to Stripe/other controller
			const customer = await stripe.customers.create({
				name: fullName,
				email: b.email,
				address: {
					line1: b.address || null,
					line2: b.suiteNumber || null,
					city: b.city || null,
					country: b.country || null,
					postal_code: b.postalCode || null
				},
				description: 'Customer created while creating a user account.',
				phone: b.phone || null
			})
			let user = b
			user.stripeCustomer = customer.id
			// Hash password
			const hashedPassword = await UserModel.hashPassword(b.password)
			user.password = hashedPassword
			// Save user in the db
			const savedUser = await UserModel.createUser(user)

			return res.status(201).json(savedUser)
		} catch (err) {
			throw err
		}
	}

	static async getUsers(req, res) {
		try {
			// TODO: Only return all users if admin/root is making a request
			const users = await UserModel.getUsers()

			return res.status(200).json(users)
		} catch (err) {
			throw err
		}
	}

	static async getUserById(req, res) {
		try {
			const user = await UserModel.getUserById(req.params.id)

			return res.status(200).json(user)
		} catch (err) {
			throw err
		}
	}

	static async deleteUserById(req, res) {
		try {
			const user = await UserModel.deleteUserById(req.params.id)

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
			const user = await UserModel.updateUserById(req.params.id, fields)

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