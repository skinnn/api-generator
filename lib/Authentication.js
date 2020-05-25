const Controller = require('../controllers/v1/Controller.js')
const Token = require('../lib/Token.js')
const Login = require('../models/Login.js')
const User = require('../models/User.js')
const Endpoint = require('../models/Endpoint.js')
const { haveCommonElements } = require('../lib/helpers.js')

/**
 * REST API Authentication middleware
 * 
 * 1. First get endpoint & CRUD operation user is trying to access
 * 2. If endpoint doesnt require authentication then proceed
 * 3. If endpoint requires authenticated user then:
 * 	Check if there is a token present in any of these headers: Authorization, Cookie, X-access-token
 * 	Check that it is a valid JWT
 * 	Check if a login record for this token exists
 * 	Check if user is authorized to access the requested CRUD operation on this endpoint
 */
class Authentication extends Controller {

	static async use(req, res, next) {
		await Authentication.ensureAuthenticated(req, res, next)
	}

	static ensureAuthenticated = async (req, res, next) => {
		try {
			const resource = this.getResourceFromRequest(req)
			const endpoint = await Endpoint.getEndpointByName(resource)
			const operation = this.getCRUDFromMethod(req.method)
			if (endpoint) {
				// Check if authorization is required
				if (endpoint._schema.access[operation].roles.includes('anon')) {
					// Proceed since authorization is not required for this resource & operation
					// TODO: Create session for the anon user
					return next()
				} else {
					// Get token and run permission validation
					const token = Token.getTokenFromHeaders(req.headers)
					// TODO: Handle errors in catch, add Controller.errors.forbidden (error handling)
					if(!token) {
						return res.status(401).json({
							message: 'Token not provided'
						})
					}
					
					// Validate JWT
					const { validToken, decoded } = await Token.validateToken(token)
				
					// Check that there is a login record with this token
					const loginRecord = await Login.getLoginByToken(validToken)
					if (!loginRecord) {
						return res.status(401).json({
							message: 'Access denied.'
						})
					}

					// TODO: Get user from session instead
					const user = await User.getUserById(loginRecord.userId)
					if (!user) {
						return res.status(401).json({
							message: 'Access denied.'
						})
					}

					user.token = validToken
					// Set user in request
					req.user = user

					// Check permissions
					const authorized = await this.checkPermissions(resource, operation, endpoint, user.roles)
					if (authorized) return next()
					else return res.status(403).json({ message: 'Invalid permission' })
				}
			} else {
				// const msg = `There is no defined Endpoint for this resource: ${resource}`
				// let err = new Error(msg)
				// err.name = 'Endpoint schema'
				// Controller.logError(err)
				return next()
			}
		} catch (err) {
			this.handleErrors(err, res)
		}
	}

	// Check privileges/permissions of user sending the request
	static async checkPermissions(resource, operation, endpoint, userRoles) {
		var authorized = false
		if (Array.isArray(userRoles) && userRoles.length <= 0) userRoles = ['anon']
		console.log(`Requested operation ${operation.toUpperCase()} on protected endpoint: ${resource} `)
		const hasRole = haveCommonElements(endpoint._schema.access[operation].roles, userRoles)
		if (hasRole) {
			authorized = true
			// TODO: If its neither root or admin, authorize the request only
			// if he is the owner && owner flag is true
			// if (role !== 'root' && role !== 'admin') {
			// 	const userIsOwner = this.isOwner(req.user, endpoint)
			// 	if (endpoint.access[operation].owner && userIsOwner) authorized = true
			// }

		} else authorized = false
		return authorized
	}

	// TODO: Finish
	static isOwner(user, resource) {

	}

	static handleErrors(err, res) {
		console.error(err)
		// JWT errors
		if (err.name === 'JsonWebTokenError') {
			if (err.message === 'jwt malformed') {
			return res.status(401).json({
				success: false,
				message: 'Token is not valid'
			})

			}	else if (err.message === 'invalid signature') {
				return res.status(401).json({
					success: false,
					message: 'Token is not valid'
				})
			
			// If nothing matches send generic 401
			} else {
				return res.status(401).json({
					success: false,
					message: 'Forbidden'
				})
			}
		}
	}

	// static isAdmin = (req) => {
	// 	if (req.user.roles.includes('admin')) {
	// 		console.log(req.admin)
	// 		return true
	// 	} else {
	// 		console.log('Access denied, not Admin.')
	// 		return false
	// 	}
	// }

}

module.exports = Authentication