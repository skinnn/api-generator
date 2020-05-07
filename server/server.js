const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const config = require('./config/config.js')
const logger = require('./middleware/logger.js')
const Controller = require('./controllers/v1/Controller.js')

const app = express()

// Middleware
app.use(cors({ origin: '*' }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(logger)

// Routes
app.use('/api', require('./routes/index.js'))

app.listen(config.port, () => {
	// App initialization
	Controller.init()

	console.log(`Server started on port ${config.port} - ${config.mode}`)
})