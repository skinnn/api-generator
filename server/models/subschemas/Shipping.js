const mongoose = require('mongoose')
const MongooseSchema = mongoose.Schema

// Shipping details sub-schema
const Shipping = new MongooseSchema({
	_id: false, // Don't save _id for this subschema

	firstName: { type: String, default: null },
	lastName: { type: String, default: null },
	company: { type: String, default: null },
	city: { type: String, default: null },
	state: { type: String, default: null },
	country: { type: String, default: null },
	postalCode: { type: Number, default: null },
	address: { type: String, default: null },
	suiteNumber: { type: Number, default: null }
})

module.exports = Shipping