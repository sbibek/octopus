/**
 * Load the given application by name 
 * @param {*} appName 
 * @returns Application metadata if exists else returns null
 */
function load(appName) {
	try {
		return require(`./${appName}`)
	} catch(err) {
		return null
	}
}

function resolve(appName) {
	return require.resolve(`./${appName}`)
}

function removeAppCache(appName) {
	let appPath = `${__dirname}/${appName}`
	for(let path in require.cache) {
		if(path.startsWith(appPath)) delete require.cache[path]
	}
}

module.exports = {load, resolve, removeAppCache}