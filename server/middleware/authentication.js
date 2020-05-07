const Token = require('../lib/Token.js')
const Login = require('../models/Login.js')

/**
 * Make sure that user sending the request is authenticated.
 * 
 * First check that there is a token in the headers.
 * Then check that token is a valid JSON Web Token.
 * Then check that there is a login record with that token.
 */

class Authentication {

	static ensureAuthenticated = async (req, res, next) => {
		try {
			// Express headers are auto converted to lowercase
			let token = req.headers['authorization'] || req.headers['x-access-token'] || ''
			if (token.startsWith('Bearer')) {
				// Remove Bearer from string
				token = token.split(' ')[1]
			}
		
			if(!token) {
				return res.status(401).json({
					success: false,
					message: 'Token is not provided.'
				})
			}
			
			// Validate JWT
			const { validToken, decoded } = await Token.validateToken(token)
		
			// Check that there is a login record with this token
			const loginRecord = await Login.findOne({ token: validToken })
	
			if (!loginRecord) {
				return res.status(401).json({
					success: false,
					message: 'Access denied. No login record found for this user.'
				})
			}
	
			const user = loginRecord.user
			req.user = decoded
			// req.decoded = decoded
			next()
		
		} catch (err) {
			console.error(err)
			// JWT errors
			if (err.name === 'JsonWebTokenError') {

				if (err.message === 'jwt malformed') {
				return res.status(401).json({
					success: false,
					message: 'Token is not valid.'
				})

				}	else if (err.message === 'invalid signature') {
					return res.status(401).json({
						success: false,
						message: 'Token is not valid.'
					})
				
				// If nothing matches send generic 401
				} else {
					return res.status(401).json({
						success: false,
						message: 'Forbidden.'
					})
				}
			}
		}
	}

	// Check privileges/permissions of user sending the request
	static checkPrivileges = async () => {
		try {

			// TODO: Roles access - (is user/admin/anon authorized to access the route & CRUD operation)
		
		} catch (err) {
			throw err
		}
	}

	// static isAdmin = (req, res, next) => {
	// 	if (req.user.roles === 'admin') {
	// 		console.log(req.admin)
	// 		return next()
	// 	} else {
	// 		console.log('Access denied, not Admin.')
	// 		return res.status(403).json({
	// 			success: false,
	// 			message: 'You are not Admin.'
	// 		})
	// 	}
	// }

	// static isUser = (req, res, next) => {
	// 	if (req.user.roles === 'user') {
	// 		console.log(req.user)
	// 		return next()
	// 	} else {
	// 		console.log('Access denied, not User.')
	// 		return res.status(403).json({
	// 			success: false,
	// 			message: 'You are not User.'
	// 		})
	// 	}
	// }

	// static isRoot = (req, res, next) => {
	// 	if (req.user.roles === 'root') {
	// 		console.log(req.user)
	// 		return next()
	// 	} else {
	// 		console.log('Access denied, not User.')
	// 		return res.status(403).json({
	// 			success: false,
	// 			message: 'You are not User.'
	// 		})
	// 	}
	// }
}

module.exports = Authentication