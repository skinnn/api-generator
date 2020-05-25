const masterConfig = require('./config/config.js')
const { routeLogger } = require('./lib/helpers.js')
const Controller = require('./controllers/v1/Controller.js')
const http = require('http')
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const exphbs = require('express-handlebars')

const app = express()

// Cors
app.use(cors({
	origin: '*',
	allowedHeaders: ['Content-Type', 'Authorization', 'Location', 'X-Total-Count'],
	methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE']
}))
// Some headers for security
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
app.use(routeLogger)

// Used to handle req errors (e.g. if body has invalid json)
// app.use((err, req, res, next) => {
// 	if(err.status === 400) return res.status(err.status).json({ message: 'Dude, you messed up the JSON' });
// 	return next(err)
// })

// Routes
// app.use('/', require('./routes/index.js'))

// Template & view engine
app.engine('hbs', exphbs({
	extname: '.hbs',
	defaultLayout: 'main',
	layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/partials/'
}))
app.set('view engine', 'hbs')

// Boot the server with configuration
Controller.boot(masterConfig, app).then((ctx) => {
	// Setup all middleware
	ctx.app.use(ctx.middleware)
	// Load main router
	ctx.app.use('/', require('./routes/index.js'))
	// Error handler (always the last middleware)
	ctx.app.use((err, req, res, next) => {
		console.log('Error handler middleware: ', err)
		return next()
	})

	// Create http/https erver
	if (ctx.api.protocol === 'https') {
		// const https = require('https')
		// ctx.api.server = https.createServer(ctx.getSSLOptions(), app)
	} else {
		ctx.api.server = http.createServer(app)
	}

	// Spin up the server
	ctx.api.server.listen(ctx.api.port, ctx.api.host, (err) => {
		console.log(`Server running in ${ctx.api.mode} mode - ${Controller.api.protocol}://${Controller.api.host}:${Controller.api.port}`)
		// TODO: Will contain all hooks for all models when built-in Controllers get refactored
		// (currently contains only hooks for dynamic models added throuh GUI)
		// console.log(ctx.api.hooks)
	})
})
.catch(err => Controller.logError(err))