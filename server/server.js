const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const config = require('./config/config.js')
const exphbs = require('express-handlebars')
const logger = require('./middleware/logger.js')
const Controller = require('./controllers/v1/Controller.js')
const path = require('path')

const app = express()

// Middleware
app.use(cors({ origin: '*' }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(logger)

// Routes
app.use('/api', require('./routes/index.js'))

// Template engine
app.engine('hbs', exphbs({
	extname: '.hbs',
	defaultLayout: 'main',
	layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/partials/'
}))
app.set('view engine', 'hbs')

app.listen(config.port, () => {
	// App initialization
	Controller.init()

	console.log(`Server started on port ${config.port} - ${config.mode}`)
})