const http = require('http')
const path = require('path')
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const masterConfig = require('./config/config.js')
const Controller = require('./controllers/v1/Controller.js')
const Dashboard = require('./lib/Dashboard')
const { logFilter } = require('./lib/helpers.js')

const app = express()

// View engine setup
app.engine('hbs', exphbs({ extname: '.hbs', defaultLayout: 'main', helpers: require('./lib/helpers.js').hbs, layoutsDir: __dirname + '/views/layouts/', partialsDir: __dirname + '/views/partials/' }))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

// Logger
app.use(morgan('dev', { skip: logFilter }))
// Cors
app.use(cors({ origin: '*', allowedHeaders: ['Content-Type', 'Authorization', 'Location', 'X-Total-Count'], methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'] }))
// Some headers for security
app.use(helmet(), helmet.contentSecurityPolicy({
  directives: {
		defaultSrc: ["'self'"],
		scriptSrc: ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com", "unpkg.com", "stackpath.bootstrapcdn.com", "cdn.jsdelivr.net", "code.jquery.com"],
    styleSrc: ["'self'", "'unsafe-inline'","stackpath.bootstrapcdn.com"]
  }
}))
app.use(express.json({ limit: 1024*100, type: 'application/json' })) // Allowed JSON body size 100kb and media type
app.use(express.urlencoded({ extended: true }))
app.use('/', express.static(path.join(__dirname, './public')))


// Boot the server with configuration
Controller.boot(masterConfig, app).then((ctx) => {
	// Setup Application-level middleware
	ctx.app.use(ctx.api.settings.restApi.path, ctx.middleware)
	
	// Mount dashboard router
	ctx.app.use(`${ctx.api.settings.restApi.path}/dashboard`, new Dashboard(ctx.api).router)
	// Mount main router
	ctx.app.use('/', require('./routes/index.js'))
	// Default error handler (always the last middleware)
	ctx.app.use((err, req, res, next) => ctx.handleError(err, req, res, next))

	// Create http/https server
	if (ctx.api.protocol === 'https') {
		TODO: Finish
		// const https = require('https')
		// ctx.api.server = https.createServer(ctx.getSSLOptions(), app)
	} else {
		ctx.api.server = http.createServer(app)
	}

	// Spin up the server
	ctx.api.server.listen(ctx.api.port, (err) => {
		console.log(`Server running in ${ctx.api.mode} mode - ${ctx.api.protocol}://${ctx.api.host}:${ctx.api.port}`)
		// TODO: Will contain hooks for all models when built-in Controllers get refactored
		// (currently contains only hooks for dynamic models added throuh GUI)
		// console.log(ctx.api.hooks)t
	})
})
.catch(err => Controller.logError(err))
