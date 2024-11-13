const mongoose = require('mongoose')
const MongooseSchema = mongoose.Schema

const Schema = new MongooseSchema({
	name: { type: String, lowercase: true, required: true },
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
	// Dont save ids for subschema and disabled
}, { _id : false  })

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
	},
	__owner: {
		type: String,
		required: true
	}
// Minimize allows saving of empty objects in schema [_schema.properties]
}, { minimize: false })

const Endpoint = module.exports = mongoose.model('Endpoint', EndpointSchema)

module.exports.createEndpoint = async (endpoint) => {
	// Add built in props to the model
	endpoint._schema.properties.created = {
		title: 'Created date-time',
		type: 'string',
		format: 'date-time'
	}
	endpoint._schema.properties.updated = {
		title: 'Updated date-time',
		format: 'date-time',
		oneOf: [{ type: 'string' }, { type: 'null' }]
	}
	try {
		const doc = await Endpoint.create(endpoint)
		return doc
	} catch (err) {
		throw err
	}
}

module.exports.getEndpoints = async () => {
	try {
		const doc = await Endpoint.find().lean()
		return doc
	} catch (err) {
		throw err
	}
}

module.exports.getEndpointByName = async (name) => {
	try {
		const doc = await Endpoint.findOne({ name: name }).lean()
		return doc
	} catch (err) {
		throw err
	}
}

module.exports.getEndpointById = async (id) => {
	try {
		const doc = await Endpoint.findById(id).lean()
		return doc
	} catch (err) {
		throw err
	}
}

module.exports.updateEndpointById = async (id, fields) => {
	fields.updated = Date.now()
	const data = { $set: fields }
	const options = { new: true }
	try {
		const doc = Endpoint.findByIdAndUpdate(id, data, options)
		return doc
	} catch (err) {
		throw err
	}
}

module.exports.deleteEndpointById = async (id) => {
	try {
		const doc = Endpoint.findByIdAndDelete({_id: id })
		return doc
	} catch (err) {
		throw err
	}
}
