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
			console.log(doc)
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

module.exports.createMultiple = (schemas) => {
	return new Promise((resolve, reject) => {
		Access.insertMany(schemas, (err, docs) => {
			if (err) reject(err)
			resolve(docs)
		})
	})
}

// module.exports.getUsers = () => {
// 	return new Promise((resolve, reject) => {
// 		User.find({}, (err, docs) => {
// 			if (err) reject(err)
// 			resolve(docs)
// 		})
// 	})
// }

// module.exports.getUserById = (id) => {
// 	return new Promise((resolve, reject) => {
// 		User.findById({ _id: id }, (err, doc) => {
// 			if (err) reject(err)
// 			resolve(doc)
// 		})
// 	})
// }

// module.exports.getUserByUsername = (username) => {
// 	return new Promise((resolve, reject) => {
// 		User.findOne({ username: username }, (err, doc) => {
// 			if (err) reject(err)
// 			resolve(doc)
// 		})
// 	})
// }

// module.exports.updateUserById = (id, fields) => {
// 	const options = { new: true }
// 	fields.updated = Date.now()
// 	return new Promise((resolve, reject) => {
// 		User.findByIdAndUpdate(id, fields, options, (err, doc) => {
// 			if (err) reject(err)
// 			resolve(doc)
// 		})
// 	})
// }

// module.exports.deleteUserById = (id) => {
// 	return new Promise((resolve, reject) => {
// 		// TODO: Dont allow deleting of root user
// 		User.findByIdAndDelete({ id }, (err, doc) => {
// 			if (err) reject(err)
// 			resolve(doc)
// 		})
// 	})
// }