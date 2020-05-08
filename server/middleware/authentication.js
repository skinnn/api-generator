const Token = require('../lib/Token.js')
const Login = require('../models/Login.js')
const Access = require('../models/AccessSchema.js')
const helpers = require('../lib/helpers.js')

/**
 * Make sure that user sending the request is authenticated && authorized.
 * 
 * First check that there is a token in the headers.
 * Then check that token is a valid JSON Web Token.
 * Then check that there is a login record with that token.
 * Then check that user making the request has correct privileges (roles).
 */

class Authentication {

	static ensureAuthenticated = async (req, res, next) => {
		try {
			// Express headers are auto converted to lowercase
			let token = req.headers['authorization'] || req.headers['cookie'] || req.headers['x-access-token'] || ''
			if (token.startsWith('Bearer')) {
				// Remove Bearer from string
				token = token.split(' ')[1]
			} else if (token.startsWith('token=')) {
				token = token.split('token=')[1]
			}
		
			if(!token) {
				return res.status(401).json({
					message: 'Token is not provided.'
				})
			}
			
			// Validate JWT
			const { validToken, decoded } = await Token.validateToken(token)
		
			// Check that there is a login record with this token
			const loginRecord = await Login.findOne({ token: validToken })
	
			if (!loginRecord) {
				return res.status(401).json({
					message: 'Access denied.'
				})
			}
	
			// const user = loginRecord.user
			// Set user to decoded user/data from the token
			req.user = decoded

			// Check permissions
			const havePermission = await this.checkPermissions(req, res)
			if (havePermission) return next()
			else res.status(403).send({ message: 'Access denied.' })

		} catch (err) {
			this.handleErrors(err)
		}
	}

	// Check privileges/permissions of user sending the request
	static checkPermissions = async (req, res) => {
		try {
			if (req.user) {
				var authorized = false
				// const resource = req.originalUrl.split('/').pop().toLowerCase() || null
				const resource = req.resource
				const schema = resource ? await Access.getSchemaByName(resource) : null
				if (schema) {
					const operation = this.getCRUDFromRequest(req.method)
					const roles = req.user.roles
					console.log(`Requested operation ${operation.toUpperCase()} on protected resource: ${req.resource} `)

					// If user has the right privilege
					const hasRole = helpers.haveCommonElements(schema.access[operation].roles, roles)
					if (hasRole) {
						authorized = true
						// TODO: If its not a root/admin, authorize the request only
						// if he is the owner
						// if (role !== 'root' && role !== 'admin') {
						// 	const userIsOwner = this.isOwner(req.user, schema)
						// 	if (schema.access[operation].owner && userIsOwner) authorized = true
						// }

					} else authorized = false

				} else {
					// console.error(`There is no defined access schema for this resource: ${resource}`)
					throw new Error(`There is no defined access schema for this resource: ${resource}`)
				}
				
				if (authorized) return true
				else return false
				
			} else res.status(400).send({ message: 'Invalid token.'})

			// if(req.user) { 
			// 	db.getPerms({ role_id: req.user.role_id, resource_id: req.resource.id })
			// 			.then(function(perms) {
			// 				var allow = false
			// 				//you can do this mapping of methods to permissions before the db call and just get the specific permission you want. 
			// 				perms.forEach(function(perm) {
			// 						if (req.method == "POST" && perms.create) allow = true
			// 						else if (req.method == "GET" && perms.read) allow = true
			// 						else if (req.method == "PUT" && perms.write) allow = true
			// 						else if (req.method == "DELETE" && perm.delete) allow = true
		
			// 				})
			// 				if (allow) return next()
			// 				else return res.status(403).send({ message: 'access denied' })
			// 			})//handle your reject and catch here
			// 	} else return res.status(400).send({ message: 'invalid token' })
		
		} catch (err) {
			throw err
		}
	}

	static getCRUDFromRequest(method) {
    switch(method) {
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

	static handleErrors(err) {
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