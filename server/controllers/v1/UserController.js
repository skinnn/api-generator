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

			return res.status(201).json({
				success: true,
				message: 'User created',
				user: savedUser
			})
		} catch (err) {
			throw err
		}
	}

	// Create root admin if it doesnt exist
	static async createRootUser(user) {
		try {
			const rootExist = await UserModel.getUserByUsername(user.username)
			
			if (!rootExist) {
				// If root's username changes in config.js,
				// delete the previous root user
				await UserModel.deleteOne({ roles: 'root' })

				// Create Stripe customer for this root user
				const customer = await stripe.customers.create({
					name: user.name || null,
					email: user.email || null,
					address: user.address || null,
					phone: user.phone || null,
					description: 'Root user. Customer created while creating a root user account.'
				})
				user.stripeCustomer = customer.id
				const hashedPassword = await UserModel.hashPassword(user.password) 
				user.roles = ['root']
				user.password = hashedPassword
				// Save root user
				const root = await new Promise((resolve, reject) => {
					UserModel.create(user, (err, doc) => {
						if (err) reject(err)
						resolve(doc)
					})
				})

				console.log(`Root user created: ${root.username}`)
				console.log(`Customer for root created: ${customer}`)
			}
		} catch (err) {
			throw err
		}
	}

	static async getUsers(req, res) {
		try {
			// TODO: Only return all users if admin/root is making a request
			const users = await UserModel.getUsers()

			return res.status(200).json({
				success: true,
				users: users
			})
		} catch (err) {
			throw err
		}
	}

	static async getUserById(req, res) {
		try {
			const user = await UserModel.getUserById(req.params.id)

			return res.status(200).json({
				success: true,
				user: user
			})
		} catch (err) {
			throw err
		}
	}

	static async deleteUserById(req, res) {
		try {
			const user = await UserModel.deleteUserById(req.params.id)

			return res.status(200).json({
				success: true,
				message: 'Updated user successfully',
				user: user
			})
		} catch (err) {
			throw err
		}
	}

	static async updateUserById(req, res) {
		res.set('Accept', 'application/json')
		const fields = req.body.fields
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
		try {
			const user = await UserModel.updateUserById(req.params.id, fields)
			console.log('updated user: ', user)

			return res.status(200).json({
				success: true,
				message: 'Updated user successfully',
				user: user
			})
		} catch (err) {
			throw err
		}
	}
}

module.exports = UserController