const Controller = require('./Controller.js')
const Token = require('../../lib/Token.js')
// Models
const Session = require('../../models/Session.js')
const User = require('../../models/User.js')

/**
 * Provides CRUD operations for login endpoints
 */
class SessionController extends Controller {
	constructor(api) {
		super(api)
	}

	static async createSession(req, res) {
		try {
			res.set('Accept', 'application/json')
			const user = await User.findOne({ username: req.body.username }).select('+password')
			if (!user) {
				return res.status(400).json({
					success: false,
					message: 'The username or password specified is not valid'
				})
			}

			const passwordsMatch = await User.comparePassword(req.body.password, user.password)
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
			const newSession = await Session.create(data)

			// TODO: Create and send refreshToken
			return res.status(200).json({
				token: newSession.token,
				userId: newSession.userId
			})
		} catch (err) {
			throw err
		}
	}

	// User logout
	static async deleteSession(req, res) {
		try {
			let token = req.user.token
			// if (token.startsWith('Bearer')) token = token.split(' ')[1]
			const removedLogin = await Session.deleteOne({ token: token })
			
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

	static async getSessions(req, res) {
		const logins = await Session.find({})

		return res.status(200).json(logins)
	}
}

module.exports = SessionController