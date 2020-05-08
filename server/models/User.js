const mongoose = require('mongoose')
const MongooseSchema = mongoose.Schema
const bcrypt = require('bcrypt')
// Subschemas
const BillingSubschema = require('./subschemas/Billing.js')
const ShippingSubschema = require('./subschemas/Shipping.js')

const UserSchema = new MongooseSchema({
	// Roles: root, admin, user, anon
	roles: {
		type: Array,
		default: ['anon']
	},
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	firstName: {
		type: String,
		default: null
	},
	lastName: {
		type: String,
		default: null
	},
	country: {
		type: String,
		default: null
	},
	city: {
		type: String,
		default: null
	},
	postalCode: {
		type: Number,
		default: null
	},
	address: {
		type: String,
		default: null
	},
	suiteNumber: {
		type: Number,
		default: null
	},
	phone: {
		type: String,
		default: null
	},
	description: {
		type: String,
		default: null
	},
	stripeCustomer: {
		type: String,
		default: null
	},
	billingInfo: BillingSubschema,
	shippingInfo: ShippingSubschema,
	created: {
    type: Date,
    default: Date.now
  },
	updated: {
		type: Date,
		default: null
	}
})

const User = module.exports = mongoose.model('User', UserSchema)

module.exports.hashPassword = (password) => {
	return new Promise((resolve, reject) => {
		
		bcrypt.genSalt(10, (err, salt) => {
			if (err) reject(err)
			bcrypt.hash(password, salt, (err, hash) => {
				if (err) reject(err)

				resolve(hash)
			})
		})
	})
}

module.exports.comparePassword = (candidatePassword, hash) => {
	return new Promise((resolve, reject) => {
		bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
			if (err) reject(err)
			resolve(isMatch)
		})
	})
}

module.exports.createUser = (user) => {
	return new Promise((resolve, reject) => {
		if (user.roles && user.roles.includes('root')) {
			let e = new Error('Creating a root user is not allowed.')
			e.name = 'ForbiddenError'
			throw e
			// TODO: Send response from controller for this error
		}
		User.create(user, (err, doc) => {
			if (err) reject(err)
			resolve(doc)
		})
	})
}

module.exports.getUsers = () => {
	return new Promise((resolve, reject) => {
		User.find({}, (err, docs) => {
			if (err) reject(err)
			resolve(docs)
		})
	})
}

module.exports.getUserById = (id) => {
	return new Promise((resolve, reject) => {
		User.findById({ _id: id }, (err, doc) => {
			if (err) reject(err)
			resolve(doc)
		})
	})
}

module.exports.getUserByUsername = (username) => {
	return new Promise((resolve, reject) => {
		User.findOne({ username: username }, (err, doc) => {
			if (err) reject(err)
			resolve(doc)
		})
	})
}

module.exports.updateUserById = (id, fields) => {
	const options = { new: true }
	fields.updated = Date.now()
	return new Promise((resolve, reject) => {
		User.findByIdAndUpdate(id, fields, options, (err, doc) => {
			if (err) reject(err)
			resolve(doc)
		})
	})
}

module.exports.deleteUserById = (id) => {
	return new Promise((resolve, reject) => {
		// TODO: Dont allow deleting of root user
		User.findByIdAndDelete({ id }, (err, doc) => {
			if (err) reject(err)
			resolve(doc)
		})
	})
}