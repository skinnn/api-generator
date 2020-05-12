const Controller = require('../controllers/v1/Controller.js')
const Token = require('../lib/Token.js')
const Login = require('../models/Login.js')
const Access = require('../models/AccessSchema.js')
const helpers = require('../lib/helpers.js')

/**
 * Make sure that user sending the request is authenticated && authorized.
 * 
 * 1. First check that there is a token in the headers.
 * 2. Then check that token is a valid JSON Web Token.
 * 3. Then check that there is a login record with that token.
 * 4. Then check that user making the request has the correct permission (role).
 */

class Authentication extends Controller {

	static ensureAuthenticated = async (req, res, next) => {
		try {
			const token = Token.getTokenFromHeaders(req.headers)
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
	
			// const user = loginRecord.user
			// Set user to decoded user/data from the token
			decoded.token = validToken
			req.user = decoded || null

			// Check permissions
			const authorized = await this.ensureAuthorized(req, res)
			if (authorized) return next()
			else return res.status(403).json({ message: 'Access denied' })
		} catch (err) {
			this.handleErrors(err, res)
		}
	}

	// Check privileges/permissions of user sending the request
	static ensureAuthorized = async (req, res) => {
		if (!req.user) {
			return false
		}
		var authorized = false
		const resource = this.getResourceFromRequest(req)
		try {
			const schema = resource ? await Access.getSchemaByName(resource) : null
			if (schema) {
				const operation = this.getCRUDFromRequest(req)
				const roles = req.user.roles
				console.log(`Requested operation ${operation.toUpperCase()} on protected resource: ${resource} `)

				// If user has the right privilege
				const hasRole = helpers.haveCommonElements(schema.access[operation].roles, roles)
				if (hasRole) {
					authorized = true
					// TODO: If its neither root or admin, authorize the request only
					// if he is the owner && owner flag is true
					// if (role !== 'root' && role !== 'admin') {
					// 	const userIsOwner = this.isOwner(req.user, schema)
					// 	if (schema.access[operation].owner && userIsOwner) authorized = true
					// }

				} else authorized = false

			} else {
				const msg = `There is no defined access schema for this resource: ${resource}`
				res.status(500).json({
					message: msg
				})
				let err = new Error(msg)
				err.name = 'Access schema'
				throw err
			}
			
			if (authorized) return true
			else return false
				
		} catch (err) {
			throw err
		}
	}

	// static async dashboardAuthentication(req, res, next) {
	// 	const token = Token.getTokenFromHeaders(req.headers)
	// 	if(!token) {
	// 		return res.status(401).redirect('/api/login')
	// 	}
	// 	try {
	// 		// Validate JWT
	// 		const { validToken, decoded } = await Token.validateToken(token)

	// 		// Check that there is a login record with this token
	// 		const loginRecord = await Login.getLoginByToken(validToken)
	// 		if (!loginRecord) {
	// 			return res.status(403).json({
	// 				message: 'Access denied'
	// 			})
	// 		}
	
	// 		// Set user to decoded user/data from the token
	// 		decoded.token = validToken
	// 		req.user = decoded || null

	// 		// Check permissions
	// 		const authorized = await this.ensureAuthorized(req, res)
	// 		if (authorized) return next()
	// 		else return res.status(403).json({ message: 'Access denied' })
	// 	} catch (err) {
	// 		throw err
	// 	}
	// }

	static getResourceFromRequest(req) {
		const resource = req.baseUrl.split('/').pop().toLowerCase() || null
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