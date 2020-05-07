const emptyObject = obj => {
	if (obj && obj.constructor !== Object) throw new Error('The provided value is not of type Object.')
	
	return obj && obj.constructor === Object && Object.keys(obj).length === 0
}

module.exports = {
	emptyObject: emptyObject
}
