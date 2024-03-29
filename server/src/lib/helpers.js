const moment = require('moment')

/**
 * Returns formatted time
 * @param {String} format [Moment lib time format]
 */
const formatTime = (format) => {
	return moment().format(format)
}

const logFilter = (req, res) => {
  var url = req.url;
  if(url.indexOf('?')>0) url = url.substr(0,url.indexOf('?'));
  if(url.match(/(js|jpg|png|ico|css|woff|woff2|eot|svg)$/ig)) return true
  return false;
}

/**
 * Checks if an object is empty (if obj has any properties)
 * @param 	{Object} 	obj	 [Object to be evaluated]
 * @return	{Boolean}			 [Returns boolean true or false]
 */
const isEmptyObject = obj => {
	if (!obj) throw new Error('Value not specified')
	if (obj && obj.constructor !== Object || obj === null) throw new TypeError('The provided value is not of type Object')
	return obj && obj.constructor === Object && Object.keys(obj).length === 0
}


/**
 * Modify properties from one object to another
 * @param 	{Object} 	obj	 	[Object to be evaluated]
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

const toBoolean = (value) => {
	if (typeof value !== 'string') {
		value = Boolean(value)
	}
	const s = value.toLowerCase();
	value = ['t', 'y', '1'].some(prefix => s.startsWith(prefix))
	return value
}

const json = (content) => {
	return JSON.stringify(content);
};


module.exports = {
	formatTime: formatTime,
	logFilter: logFilter,
	isEmptyObject: isEmptyObject,
	haveCommonElements: haveCommonElements,
	strigifyProps: strigifyProps,
	toBoolean: toBoolean,
	hbs: {
		json: json
	}
}
