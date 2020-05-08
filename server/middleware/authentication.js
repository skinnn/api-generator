const Token = require('../lib/Token.js')
const Login = require('../models/Login.js')
const Access = require('../models/AccessSchema.js')

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
			// console.log(req.user)
			// req.decoded = decoded

			// Check permissions
			const havePermission = await this.checkPermissions(req, res)
			if (havePermission) return next()
		
		} catch (err) {
			console.error(err)
			this.handleErrors(err)
		}
	}

	// Check privileges/permissions of user sending the request
	static checkPermissions = async (req, res) => {
		try {
			// TODO: Roles access - (is user/admin/anon authorized to access the route & CRUD operation)
			if (req.user) {
				var allow = false
				console.log('REQUESTED RESOURCE: ', req.resource)
				// const resource = req.originalUrl.split('/').pop().toLowerCase() || null
				const resource = req.resource
				const schema = resource ? await Access.getSchemaByName(resource) : null
				if (schema) {
					// TODO: When in roles is user he can only change the record if he
					// is the owner
					const operation = this.getCRUDFromRequest(req.method)
					// TODO: If there is a possibility/need of having multiple roles
					// in the roles array, handle that
					const role = req.user.roles[0]
					if (schema.access[operation].roles.includes(role)) allow = true
					else allow = false

				// If there is no schema for this resource
				} else {
					console.log(`There is no defined access schema for this resource: ${resource}`)
					// throw new Error(`There is no defined access schema for this resource: ${resource}`)
				}
				
				if (allow) return true
			}

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

	static handleErrors(err) {
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