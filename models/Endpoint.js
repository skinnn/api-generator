const mongoose = require('mongoose')
const MongooseSchema = mongoose.Schema

const Schema = new MongooseSchema({
	name: { type: String, required: true },
	title: { type: String },
	description: { type: String },
	access: {
		create: {
			roles: { type: [String], required: true }
		},
		read: {
			roles: { type: [String], required: true },
			owner: { type: Boolean, required: true }
		},
		update: {
			roles: { type: [String], required: true },
			owner: { type: Boolean, required: true }
		},
		delete: {
			roles: { type: [String], required: true },
			owner: { type: Boolean, required: true }
		}
	},
	properties: { type: Object, required: true },
	type: { type: String, default: 'object' },
	required: { type: [String] }
})

const EndpointSchema = new MongooseSchema({
	name: {
		type: String,
		required: true
	},
	_schema: Schema, 
	created: {
		type: Date,
		default: Date.now
	},
	updated: {
		type: Date,
		default: null
	}
})

const Endpoint = module.exports = mongoose.model('Endpoint', EndpointSchema)

module.exports.createEndpoint = (endpoint) => {
	return new Promise((resolve, reject) => {
		Endpoint.create(endpoint, (err, doc) => {
			if (err) reject(err)
			resolve(doc)
		})
	})
}

module.exports.getEndpoints = () => {
	return new Promise((resolve, reject) => {
		Endpoint.find({}, (err, docs) => {
			if (err) reject(err)
			resolve(docs)
		})
	})
}

module.exports.getEndpointByName = (name) => {
	return new Promise((resolve, reject) => {
		Endpoint.findOne({ name: name }, (err, doc) => {
			if (err) reject(err)
			resolve(doc)
		})
	})
}

module.exports.getEndpointById = (id) => {
	return new Promise((resolve, reject) => {
		Endpoint.findById(id, (err, doc) => {
			if (err) reject(err)
			resolve(doc)
		})
	})
}

module.exports.updateEndpointById = async (id, fields) => {
	fields.updated = Date.now()
	const data = { $set: fields }
	const options = { new: true }
	return new Promise((resolve, reject) => {
		Endpoint.findByIdAndUpdate(id, data, options, (err, doc) => {
			if (err) reject(err)
			resolve(doc)
		})
	})
}