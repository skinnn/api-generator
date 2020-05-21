const mongoose = require('mongoose')
const MongooseSchema = mongoose.Schema

const LoginSchema = new MongooseSchema({
	// TODO: use __owner instead of userId??
  userId: {
    type: String,
    required: true
	},
	password: {
		type: String,
		required: true
	},
	token: {
		type: String,
		required: true
	},
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: null
  }
})

const Login = module.exports = mongoose.model('Login', LoginSchema)

module.exports.createLogin = (data) => {
	return new Promise((resolve, reject) => {
		Login.create(data, (err, doc) => {
			if (err) reject(err)
			resolve(doc)
		})
	})
}

module.exports.getLogins = () => {
	return new Promise((resolve, reject) => {
		Login.find({}, (err, docs) => {
			if (err) reject(err)
			resolve(docs)
		})
	})
}

module.exports.getLoginById = (id) => {
	return new Promise((resolve, reject) => {
		Login.findOne({ _id: id }, (err, doc) => {
			if (err) reject(err)
			resolve(doc)
		})
	})
}

module.exports.getLoginByToken = (token) => {
	return new Promise((resolve, reject) => {
		Login.findOne({ token: token }, (err, doc) => {
			if (err) reject(err)
			resolve(doc)
		})
	})
}

module.exports.deleteLoginByToken = (token) => {
	return new Promise((resolve, reject) => {
		Login.deleteOne({ token: token }, (err, doc) => {
			if (err) reject(err)
			resolve(doc)
		})
	})
}