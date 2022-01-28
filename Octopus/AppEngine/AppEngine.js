class AppEngine {

	constructor(octoFactory) {
		this.apps = {}
		this.appUtil = octoFactory.get('apps')
		this.statusCodes = octoFactory.get('statusCodes')
	}

	startEngine() {
	}

	restartEngine() {
	}

	stopEngine() {
	}
	
	loadApp(appMetadata) {
		// lets check if the application is already loaded
		if(this.isAppLoaded(appMetadata.name)) {
			// this means the app is already loaded
			return Promise.reject({'reason': `App ${appMetadata.name} already loaded!!`});
		}
		// lets load the app if it is available
		let appInfo = this.appUtil.load(appMetadata.name)
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
		this.appUtil.removeAppCache(appMetadata.name)
		this.loadApp(appMetadata)
	}

	startApp(appMetadata) {
		// the app must be loaded to be started
		if(!this.isAppLoaded(appMetadata.name)) {
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
		// make sure the app is loaded and started to be restarted
		if(!this.isAppLoaded(appMetadata.name)) {
			return Promise.reject({'reason': `App ${appMetadata.name} not loaded!!`})
		} else if(!this.isAppStarted(appMetadata.name)) {
			return Promise.reject({'reason': `App ${appMetadata.name} needs to be stopped before removing!!`})
		}

		return this.stopApp(appMetadata).then(() => {
			return this.startApp(appMetadata)
		})	
	}

	stopApp(appMetadata) {
		if(!this.isAppLoaded(appMetadata.name)) {
			return Promise.reject({'reason': `App ${appMetadata.name} not loaded!!`})
		} else if(!this.isAppStarted(appMetadata.name)) {
			return Promise.reject({'reason': `App ${appMetadata.name} needs to be stopped before removing!!`})
		}
		
		let app = this.apps[appMetadata.name].instance
		// now we first call the destructor lifecycle
		app.octoDestructor()
		delete this.apps[appMetadata.name]['instance']
		return Promise.resolve()
	}

	removeApp(appMetadata) {
		if(!this.isAppLoaded(appMetadata.name)) {
			return Promise.reject({'reason': `App ${appMetadata.name} not loaded!!`})
		} else if(this.isAppStarted(appMetadata.name)) {
			return Promise.reject({'reason': `App ${appMetadata.name} needs to be stopped before removing!!`})
		}

		// now lets remove
		this.appUtil.removeAppCache(appMetadata.name)
		delete this.apps[appMetadata.name]
		return Promise.resolve()
	}

	isAppLoaded(appName) {
		return appName in this.apps
	}

	isAppStarted(appName) {
		return appName in this.apps && 'instance' in this.apps[appName]
	}
}

module.exports = AppEngine