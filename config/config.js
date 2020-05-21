const env = process.env

const config = {
	version: 'v1',
	port: env.PORT || '8090',
	host:'localhost',
	mode: env.NODE_ENV || 'development',
	protocol: 'http',

	db: {
		user: env.DB_USER || 'apigenerator_user',
		password: env.DB_PASSWORD || '123123',
		host: env.DB_HOST || 'localhost',
		name: env.DB_NAME || 'apigenerator',
		port: env.DB_PORT || '27017' // Default MongoDB port
	},

	rootUser: {
		username: env.ROOT_USERNAME || 'admin',
		password: env.ROOT_PASSWORD || '123123',
		email: 'admin@example.com'
	},

	auth: {
		jwtSecret: env.JWT_SECRET || '321@_+tcretster2@!-;sl-vdmas,fmvm@#3321@_+tcretster2@!-;sl-vdmas,fmvm@#3321@_+tcretster2@!-;sl-vdmas,fmvm@#3'
	},

	paymentOptions: {
		paypal: {
			mode: env.PAYPAL_MODE || 'sandbox', // sandbox or live
			clientId: env.PAYPAL_CLIENT_ID || 'ATSlK1umuLkZclrhH6QEkel5ihjk1QH7Pb00TjSiuyQsLrwLqS2XF-w1wZbB22qfkdxq56zQswOBZytE',
  		clientSecret: env.PAYPAL_CLIENT_SECRET || 'EK-FKoisNXvYlRku6ksnsRrRuKPklqljSHj-8CF-2rvGwRIwscuwkVVkvg5cnSwciIDZnbpKc-B21d1f'
		},
		stripe: {
			public: env.STRIPE_PUBLIC || 'pk_test_eNF0TvZ5OOZKjJVWUcR4fQXV',
			secret: env.STRIPE_SECRET || 'sk_test_aEP9vc4ZURi33L0YHnjtR5TT'
		}
	}
}

module.exports = config