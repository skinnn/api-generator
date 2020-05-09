const jwt = require('jsonwebtoken')
const config = require('../config/config.js')

const secret = config.auth.jwtSecret

class Token {

	// Sign user
	static jwtSignUser(user) {
		// Token expires in 1h
		const ONE_HOUR = 60 * 60 * 24
		return jwt.sign(user.toJSON(), config.auth.jwtSecret, {
			// expiresIn: ONE_HOUR
		})
	}

	static validateToken = (token) => {
		return new Promise((resolve, reject) => {

			if (token) {
				jwt.verify(token, secret, (err, decoded) => {
					if (err) reject(err)

					resolve({ validToken: token, decoded })
				})
			}

			throw new Error('Token is not provided.')
		})
	}

	static getTokenFromHeaders(headers) {
		// Express headers are auto converted to lowercase
		let token = headers['authorization'] || headers['cookie'] || headers['x-access-token'] || ''
		if (token.startsWith('Bearer')) {
			// Remove Bearer from string
			token = token.split(' ')[1]
		} else if (token.startsWith('token=')) {
			token = token.split('token=')[1]
		}
	
		if(!token) {
			return res.status(401).json({
				message: 'Token not provided'
			})
		}
		return token
	}
}

module.exports = Token