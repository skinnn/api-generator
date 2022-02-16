const mongoose = require('mongoose')
const MongooseSchema = mongoose.Schema

const SessionSchema = new MongooseSchema({
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

const Login = module.exports = mongoose.model('Session', SessionSchema)