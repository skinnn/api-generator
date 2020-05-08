const mongoose = require('mongoose')
const MongooseSchema = mongoose.Schema
// Subschemas
// const AccessSchema = require('./subschemas/Access.js')

const AccessSchema = new MongooseSchema({
	resource: {
		type: String,
		required: true
	},
	access: {
		create: {
			roles: {
				type: Array,
				required: true
			}
		},
		read: {
			roles: {
				type: Array,
				required: true
			},
			owner: {
				type: Boolean,
				required: true
			}
		},
		update: {
			roles: {
				type: Array,
				required: true
			},
			owner: {
				type: Boolean,
				required: true
			}
		},
		delete: {
			roles: {
				type: Array,
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
	// Initial fields
	var fieldsToUpdate = {
		resource: fields.resource,
		updated: Date.now()
	}

	// Handle access fields update
	if (fields.access) {
		for (const f in fields.access) {
			// Roles field
			let rolesProp = `access.${f}.roles`
			let rolesVal = fields.access[f].roles
			rolesVal ? fieldsToUpdate[rolesProp] = rolesVal : null
			// Owner field
			let ownerProp = `access.${f}.owner`
			let ownerVal = fields.access[f].owner
			if (ownerVal === true || ownerVal === false) {
				fieldsToUpdate[ownerProp] = ownerVal
			}
		}
	}

	const data = {
		$set: fieldsToUpdate
	}

	const options = {
		new: true
	}

	return new Promise((resolve, reject) => {
		Access.findByIdAndUpdate(id, data, options, (err, doc) => {
			if (err) reject(err)
			resolve(doc)
		})
	})
}