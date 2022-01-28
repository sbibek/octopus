appLoad = require('../../Apps')

class AppEngine {
	startEngine() {
	}

	restartEngine() {
	}

	stopEngine() {
	}
	
	loadApp(appMetadata) {
		let appInfo = appLoad(appMetadata.app)
		let appClass = appInfo.entry
		let app = new appClass()
		app.octoConstructor()
		app.octoDestructor()
	}

	reloadApp() {
	}

	startApp() {
	}

	restartApp() {
	}

	stopApp() {
	}

	removeApp() {
	}
}

module.exports = AppEngine