appUtil = require('../../Apps')

class AppEngine {

	constructor() {
		this.apps = {}
	}

	startEngine() {
	}

	restartEngine() {
	}

	stopEngine() {
	}
	
	loadApp(appMetadata) {
		// lets check if the application is already loaded
		if(appMetadata.name in this.apps) {
			// this means the app is already loaded
			return Promise.reject({'reason': `App ${appMetadata.name} already loaded!!`});
		}
		// lets load the app if it is available
		let appInfo = appUtil.load(appMetadata.name)
		if(appInfo == null) {
			// if app is not available, log the error and return
			console.error(`[AppEngine] Application "${appMetadata.name}" not found!!`)
			return Promise.reject({'reason': `Application "${appMetadata.name}" not found!!`})
		}

		// store the loaded application
		this.apps[appMetadata.name] = appInfo
		return Promise.resolve()
	}

	reloadApp(appMetadata) {
		appUtil.removeAppCache(appMetadata.name)
		this.loadApp(appMetadata)
	}

	startApp(appMetadata) {
		// the app must be loaded to be started
		if(!(appMetadata.name in this.apps)) {
			return Promise.reject({'reason': `App ${appMetadata.name} not loaded!!`})
		}
		
		// lets get the app and create an instance
		let appInfo = this.apps[appMetadata.name]
		let appClass = appInfo.app
		let app = new appClass()

		// save its instance that we are currently using
		appInfo['instance'] = app

		// call the lifecycle hooks
		app.octoConstructor()
		return Promise.resolve()
	}

	restartApp(appMetadata) {
		if(!(appMetadata.name in this.apps)) {
			return Promise.reject({'reason': `App ${appMetadata.name} not loaded!!`})
		}
		
		let app = this.apps[appMetadata.name].instance
		// now we first call the destructor lifecycle
		app.octoDestructor()
		this.startApp(appMetadata)
		return Promise.resolve()
	}

	stopApp() {
	}

	removeApp() {
	}
}

module.exports = AppEngine