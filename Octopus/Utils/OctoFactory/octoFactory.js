class OctoFactory {
	constructor() {
		this.cache = {}
	}

	register(name, obj, override = false) {
		if(name in this.cache && !override) {
			throw `${name} already exists!!` 
		}	
		this.cache[name] = obj
	}


	get(name) {
		if(name in this.cache) return this.cache[name]
		throw `Dependency ${name} not available!!`
	}
}

module.exports = OctoFactory 