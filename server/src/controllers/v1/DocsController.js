const Controller = require('./Controller.js')
// Models
// const DocsModel = require('../../models/Documentation.js')

/**
 * Provides CRUD operations for documentation endpoints
 */
class DocsController extends Controller {
	constructor(api) {
		super(api)
	}

	static async getVisibilityStatus(req, res, next) {
		try {
			return res.status(200).json({
				status: 'public',
				roles: ['root']
			})
		} catch (err) {
			return next(err);	
		}
	}
}

module.exports = DocsController