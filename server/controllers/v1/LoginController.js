const Controller = require('./Controller.js')
const Token = require('../../lib/Token.js')
// Models
const LoginModel = require('../../models/Login.js')
const UserModel = require('../../models/User.js')

class LoginController extends Controller {

	static async createLogin(req, res) {
		try {
			const user = await UserModel.getUserByUsername(req.body.username)
			if (!user) {
				return res.status(404).json({
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
				userId: user.username,
				password: user.password,
				token: await Token.jwtSignUser(user)
			}
			// Save login record in the db
			const newLogin = await LoginModel.createLogin(data)

			return res.status(200).json({
				success: true,
				message: 'Logged in',
				login: newLogin
			})
		} catch (err) {
			throw err
		}
	}

	static async getLogins(req, res) {
		// TODO: Only return all logins if admin/root is making a request
		const logins = await LoginModel.getLogins()

		return res.status(200).json({
			success: true,
			logins: logins
		})
	}
}

module.exports = LoginController