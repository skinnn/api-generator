const moment = require('moment')

/**
 * Checks if an object is empty (if obj has any properties)
 * @param 	{Object} 	obj	 [Object to be evaluated]
 * @return	{Boolean}			 [Returns boolean true or false]
 */
const isEmptyObject = obj => {
	if (!obj) throw new Error('Value not specified')
	if (obj && typeof obj !== 'object' || obj === null) throw new TypeError('The provided value is not of type Object')
	return obj && obj.constructor === Object && Object.keys(obj).length === 0
}


/**
 * Modify properties from one object to another
 * @param 	{Object} 	obj	 [Object to be evaluated]
 * @return	{Object}			 [Returns the new object]
 */
const modify = (obj, newObj) => {
	Object.keys(obj).forEach((key) => delete obj[key])
	Object.keys(newObj).forEach((key) => obj[key] = newObj[key])
}


/**
 * Checks if 2 arrays have at least 1 common element
 * @param 	{Array} 		arr1 		[First array, should be a bigger one for better performance]
 * @param 	{Array} 		arr2 		[Second array]
 * @return 	{Boolean}						[Returns a boolean true or false]
 */
const haveCommonElements = (arr1, arr2) => {
	if (!arr1 || !arr2) throw new Error('Both arrays must be specified')
	const arr1Set = new Set(arr1)
	return arr2.some(el => arr1Set.has(el))
}


/**
 * Stingify object properties
 * @param 	{Object} 		obj 			[Object which properties should be stringified]
 * @param 	{Function}	replacer	[A function that transforms the result (same as replacer for JSON.stringify)]
 * @param 	{Number}		space 		[Adds indentation, white space and line break characters (same as space for JSON.stringify)]
 * @return 	{Object}							[Returns an object with stringified properties]
 */
const strigifyProps = (obj, replacer, space) => {
	if (!obj) throw new Error('Value not provided')
	if (obj && obj.constructor !== Object) throw new Error('The provided value is not of type Object')
	if (!replacer) replacer = null
	if (!space) space = 2
	Function.prototype.toJSON = Function.prototype.toJSON || function() {
		var props = {}
		for(var x in this) {
			if(this.hasOwnProperty(x)) {
				props[x] = this[x]
			}
		}
		return props
	}
	return JSON.stringify(obj, replacer, space)
}


const routeLogger = (req, res, next) => {
	const time = moment().format('hh:mm:ss')
	const log = [
		`${req.protocol} `,
		`${req.method} `,
		`${req.path} `,
		`- Time: ${time}`
	]
	console.log(log.join(''))
	next()
}

module.exports = {
	routeLogger: routeLogger,
	isEmptyObject: isEmptyObject,
	haveCommonElements: haveCommonElements,
	strigifyProps: strigifyProps
}
