const axios = require('axios')

// we will just proxy the axios requests since we might want 
// to intercept in the future
const aixosProxy = new Proxy(axios, {
	get(target, property) {
		return function() {
			// intercept here
			return target[property].apply(target, arguments)
		} 
	}, 

	apply: function(target, thisArg, args) {
		return target(...args)
	}
})

module.exports = aixosProxy