require('dotenv').config()
const env = process.env

const config = {
	name: 'API Generator',
	version: 'v1',
	protocol: env.PROTOCOL || 'http',
	host: env.HOST || 'localhost',
	port: env.PORT || 8090,
	mode: env.NODE_ENV || 'development',

	settings: {
		// REST API is exposed on the sub-path defined below, if sub-path is not needed leave empty string
		restApi: {
			path: '/api'
		}
	},

	db: {
		user: env.DB_USER || 'apigenerator_user',
		password: env.DB_PASSWORD || '123123',
		host: env.DB_HOST || 'localhost',
		name: env.DB_NAME || 'api-generator',
		port: env.DB_PORT || '27017' // Default MongoDB port
	},

	rootUser: {
		username: env.ROOT_USERNAME || 'admin',
		password: env.ROOT_PASSWORD || '123123',
		email: env.ROOT_EMAIL || 'admin@example.com'
	},

	auth: {
		jwtSecret: env.JWT_SECRET || '41df25d1-f58c-4712-80a8-fe0250cd5297'
	},

	store: null,
	server: null,
	hooks: null,

	paymentOptions: {
		paypal: {
			mode: env.PAYPAL_MODE,
			clientId: env.PAYPAL_CLIENT_ID,
  		clientSecret: env.PAYPAL_CLIENT_SECRET
		},
		stripe: {
			public: env.STRIPE_PUBLIC,
			secret: env.STRIPE_SECRET
		}
	}
}

module.exports = config
