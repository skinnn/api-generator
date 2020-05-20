const http = require('http')
const https = require('https')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const masterConfig = require('./config/config.js')
const exphbs = require('express-handlebars')
const helpers = require('./lib/helpers.js')
const Controller = require('./controllers/v1/Controller.js')

const app = express()

// Middleware
app.use(cors({
	origin: '*',
	allowedHeaders: ['Content-Type', 'Authorization', 'Location', 'X-Total-Count'],
	methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE']
}))
// Disable x-powered-by header for security
app.disable('x-powered-by')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(helpers.routeLogger)

// Routes
app.use('/', require('./routes/index.js'))

// Template engine
app.engine('hbs', exphbs({
	extname: '.hbs',
	defaultLayout: 'main',
	layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/partials/'
}))
app.set('view engine', 'hbs')

// Error handler (always should be the last middleware)
app.use((err, req, res, next) => {
  console.log('Error handler middleware: ', err)
  console.log('Stack: ', err.stack)
})


// Boot the server with configuration
Controller.boot(app, masterConfig).then(() => {

	// Create http/https erver
	if (Controller.api.protocol === 'https') {
		Controller.api.server = https.createServer(app)
	} else {
		Controller.api.server = http.createServer(app)
	}

	// Spin up the server
	Controller.api.server.listen(Controller.api.port)

	console.log(`Running in ${Controller.api.mode} mode - http://localhost:${Controller.api.port}`)
})
.catch(err => Controller.logError(err))

// app.listen(config.port, () => {
// 	// App initialization
// 	Controller.init()

// 	console.log(`Server started in ${config.mode} mode`)
// 	console.log(`http://localhost:${config.port}`)
// })