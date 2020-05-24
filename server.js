const masterConfig = require('./config/config.js')
const helpers = require('./lib/helpers.js')
const Controller = require('./controllers/v1/Controller.js')
const http = require('http')
const https = require('https')
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const exphbs = require('express-handlebars')

const app = express()

// Middleware
app.use(cors({
	origin: '*',
	allowedHeaders: ['Content-Type', 'Authorization', 'Location', 'X-Total-Count'],
	methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE']
}))
// Add some headers for security
app.use(helmet(), helmet.contentSecurityPolicy({
  directives: {
		defaultSrc: ["'self'"],
		scriptSrc: ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com", "unpkg.com", "stackpath.bootstrapcdn.com", "cdn.jsdelivr.net", "code.jquery.com"],
    styleSrc: ["'self'", "'unsafe-inline'","stackpath.bootstrapcdn.com"]
  }
}))
app.use((req, res, next) => { res.setHeader('X-Powered-By', masterConfig.name); next() })
app.use(express.json({ limit: 1024*100, type: 'application/json' })) // Allowed JSON body size 100kb and media type
app.use(express.urlencoded({ extended: true }))
app.use(helpers.routeLogger)

// Used to handle req.body errors (e.g. if body has invalid json)
app.use((err, req, res, next) => {
	if(err.status === 400) return res.status(err.status).json({ message: 'Dude, you messed up the JSON' });
	return next(err)
})


// Routes
app.use('/', require('./routes/index.js'))
// Error handler (always should be the last middleware)
app.use((err, req, res, next) => {
	console.log('Error handler middleware: ', err)
	return next()
})

// Template & view engine
app.engine('hbs', exphbs({
	extname: '.hbs',
	defaultLayout: 'main',
	layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/partials/'
}))
app.set('view engine', 'hbs')

// Boot the server with configuration
Controller.boot(app, masterConfig).then(() => {

	// Create http/https erver
	if (Controller.api.protocol === 'https') {
		Controller.api.server = https.createServer(Controller.getSSLOptions(), app)
	} else {
		Controller.api.server = http.createServer(app)
	}

	// Spin up the server
	Controller.api.server.listen(Controller.api.port, Controller.api.host, (err) => {
		console.log(`Running in ${Controller.api.mode} mode - http://localhost:${Controller.api.port}`)
	})
})
.catch(err => Controller.logError(err))