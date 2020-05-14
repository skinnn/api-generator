const mongoose = require('mongoose')
const MongooseSchema = mongoose.Schema

const AccessSchema = new MongooseSchema({
	resource: {
		type: String,
		required: true
	},
	access: {
		create: {
			roles: {
				type: [String],
				required: true
			}
		},
		read: {
			roles: {
				type: [String],
				required: true
			},
			owner: {
				type: Boolean,
				required: true
			}
		},
		update: {
			roles: {
				type: [String],
				required: true
			},
			owner: {
				type: Boolean,
				required: true
			}
		},
		delete: {
			roles: {
				type: [String],
				required: true
			},
			owner: {
				type: Boolean,
				required: true
			}
		}
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

const Access = module.exports = mongoose.model('AccessSchema', AccessSchema)

module.exports.createSchema = (schema) => {
	return new Promise((resolve, reject) => {
		Access.create(schema, (err, doc) => {
			if (err) reject(err)
			resolve(doc)
		})
	})
}

module.exports.getSchemaByName = (name) => {
	return new Promise((resolve, reject) => {
		Access.findOne({ resource: name }, (err, doc) => {
			if (err) reject(err)
			resolve(doc)
		})
	})
}

module.exports.getSchemaByResource = (name) => {
	return new Promise((resolve, reject) => {
		Access.findOne({ resource: name }, (err, doc) => {
			if (err) reject(err)
			resolve(doc)
		})
	})
}

module.exports.getSchemaById = (id) => {
	return new Promise((resolve, reject) => {
		Access.findById(id, (err, doc) => {
			if (err) reject(err)
			resolve(doc)
		})
	})
}

module.exports.updateSchemaById = async (id, fields) => {
	fields.updated = Date.now()
	const data = { $set: fields }
	const options = { new: true }
	return new Promise((resolve, reject) => {
		Access.findByIdAndUpdate(id, data, options, (err, doc) => {
			if (err) reject(err)
			resolve(doc)
		})
	})
}