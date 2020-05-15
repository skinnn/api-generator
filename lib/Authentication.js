const Controller = require('../controllers/v1/Controller.js')
const Token = require('../lib/Token.js')
const Login = require('../models/Login.js')
const User = require('../models/User.js')
const Access = require('../models/AccessSchema.js')
const helpers = require('../lib/helpers.js')
const url = require('url')

/**
 * Authentication middleware
 * 
 * 1. First get resource & operation which user is trying to access
 * 2. If it doesnt require authenticated user then proceed
 * 3. If it requires authenticated user then
 * 		- Check if there is a token present in any of these headers: Authorization, Cookie, X-access-token
 * 		- Check that it is a valid JWT
 * 		- Check if login records for this token exists
 * 		- Check if user is authorized to access the requested CRUD on resource
 */

class Authentication extends Controller {

	static ensureAuthenticated = async (req, res, next) => {
		try {
			const resource = this.getResourceFromRequest(req)
			const schema = resource ? await Access.getSchemaByName(resource) : null
			const operation = this.getCRUDFromRequest(req)
			if (schema) {
				// Check if authorization is required
				if (schema.access[operation].roles.includes('anon')) {
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
					const authorized = await this.checkPermissions(resource, operation, schema, user.roles)
					if (authorized) return next()
					else return res.status(403).json({ message: 'Access denied' })
				}
			} else {
				const msg = `There is no defined access schema for this resource: ${resource}`
				res.status(500).json({
					message: msg
				})
				let err = new Error(msg)
				err.name = 'Access schema'
				throw err
			}
		} catch (err) {
			this.handleErrors(err, res)
		}
	}

	// Check privileges/permissions of user sending the request
	static async checkPermissions(resource, operation, schema, userRoles) {
		var authorized = false
		console.log(`Requested operation ${operation.toUpperCase()} on protected resource: ${resource} `)
		const hasRole = helpers.haveCommonElements(schema.access[operation].roles, userRoles)
		if (hasRole) {
			authorized = true
			// TODO: If its neither root or admin, authorize the request only
			// if he is the owner && owner flag is true
			// if (role !== 'root' && role !== 'admin') {
			// 	const userIsOwner = this.isOwner(req.user, schema)
			// 	if (schema.access[operation].owner && userIsOwner) authorized = true
			// }

		} else authorized = false
		return authorized
	}

	// Get resource name from URL - /api/{resource_name}
	static getResourceFromRequest(req) {
		// const resource = req.url.split('/').pop().toLowerCase() || null
		const resource = req.path.split('/')[1].toLowerCase() || null
		// req.resource = resource
		if (!resource) throw new Error(`Resource for this route is not defined: ${resource}`)
		else return resource
	}

	static getCRUDFromRequest(req) {
    switch(req.method) {
      case 'GET':
        return 'read'
      case 'POST':
        return 'create'
      case 'PATCH':
      case 'PUT':
        return 'update'
      case 'DELETE':
        return 'delete'
    }
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