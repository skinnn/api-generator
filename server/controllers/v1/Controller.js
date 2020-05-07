const mongoose = require('mongoose')
const config = require('../../config/config.js')
const UserController = require('./UserController.js')

class Controller {

	// App initialization - Runs when server starts/restarts
	static async init() {
		try {
			// Connect to a MongoDB
			await this.connectDB()
			// Create root user from the config
			await UserController.createRootUser(config.rootUser)

			console.log('Init complete')
		} catch (err) {
			throw err
		}
	}

	static async connectDB() {
		try {
			await mongoose
				.connect(`mongodb://localhost:${config.db.port}/${config.db.name}`, {
					useNewUrlParser: true,
					useUnifiedTopology: true,
					useFindAndModify: false
				})
				.then(console.log('Database connected..'))
				.catch(err => console.error(err))
		} catch (err) {
			console.error(err)
			return res.send(500).json({
				success: false,
				message: err
			})
		}
	}

	static getCRUDFromRequest(req) {
    switch(req.method){
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
}

module.exports = Controller