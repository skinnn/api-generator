const Controller = require('./Controller.js')
const Token = require('../../lib/Token.js')
// Models
const LoginModel = require('../../models/Login.js')
const UserModel = require('../../models/User.js')

/**
 * Provides CRUD operations for login endpoints
 */
class LoginController extends Controller {
	constructor(api) {
		super(api)
	}

	static async createLogin(req, res) {
		try {
			res.set('Accept', 'application/json')
			const user = await UserModel.getUserByUsername(req.body.username)
			if (!user) {
				return res.status(400).json({
					success: false,
					message: 'The username or password specified is not valid'
				})
			}

			const passwordsMatch = await UserModel.comparePassword(req.body.password, user.password)
			if (!passwordsMatch) {
				return res.status(404).json({
					success: false,
					message: 'The username or password specified is not valid'
				})
			}

			const data = {
				userId: user._id,
				password: user.password,
				token: await Token.jwtSignUser(user)
			}
			// Save login record in the db
			const newLogin = await LoginModel.createLogin(data)

			return res.status(200).json(newLogin)
		} catch (err) {
			throw err
		}
	}

	// User logout
	static async deleteLogin(req, res) {
		try {
			let token = req.user.token
			// if (token.startsWith('Bearer')) token = token.split(' ')[1]
			const removedLogin = await LoginModel.deleteLoginByToken(token)
			
			if (!removedLogin) {
				return res.status(500).json({
					success: false,
					message: 'An error occurred.'
				})
			}
	
			return res.status(200).json({
				success: true
			})
			
		} catch (err) {
			console.error(err)
			return res.status(500).json({
				success: false,
				message: err.message
			})
		}
	}

	static async getLogins(req, res) {
		const logins = await LoginModel.getLogins()

		return res.status(200).json(logins)
	}
}

module.exports = LoginController