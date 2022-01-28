class AppEngine {

	constructor(octoFactory) {
		if(!octoFactory) throw 'AppEngine requires OctoFactory instance to load the dependencies!!'
		this.apps = {}

		// load the dependencies
		this.appUtil = octoFactory.get('apps')
		this.statusCodes = octoFactory.get('statusCodes')
	}

	startEngine() {
	}

	restartEngine() {
	}

	stopEngine() {
	}
	
	loadApp(name, metadata = null) {
		// lets check if the application is already loaded
		if(this.isAppLoaded(name)) {
			// this means the app is already loaded
			return Promise.reject({'reason': `App ${name} already loaded!!`});
		}
		// lets load the app if it is available
		let appInfo = this.appUtil.load(name)
		if(appInfo == null) {
			// if app is not available, log the error and return
			console.error(`[AppEngine] Application "${name}" not found!!`)
			return Promise.reject({'reason': `Application "${name}" not found!!`})
		}

		// store the loaded application
		this.apps[name] = appInfo
		return Promise.resolve()
	}

	reloadApp(name, metadata = null) {
		this.appUtil.removeAppCache(name)
		this.loadApp(name, metadata)
	}

	startApp(name, metadata = null) {
		// the app must be loaded to be started
		if(!this.isAppLoaded(name)) {
			return Promise.reject({'reason': `App ${name} not loaded!!`})
		}
		
		// lets get the app and create an instance
		let appInfo = this.apps[name]
		let appClass = appInfo.app
		let app = new appClass()

		// save its instance that we are currently using
		appInfo['instance'] = app

		// call the lifecycle hooks
		app.octoConstructor()
		return Promise.resolve()
	}

	restartApp(name, metadata = null) {
		// make sure the app is loaded and started to be restarted
		if(!this.isAppLoaded(name)) {
			return Promise.reject({'reason': `App ${name} not loaded!!`})
		} else if(!this.isAppStarted(name)) {
			return Promise.reject({'reason': `App ${name} needs to be stopped before removing!!`})
		}

		return this.stopApp(name, metadata).then(() => {
			return this.startApp(name, metadata)
		})	
	}

	stopApp(name, metadata) {
		if(!this.isAppLoaded(name)) {
			return Promise.reject({'reason': `App ${name} not loaded!!`})
		} else if(!this.isAppStarted(name)) {
			return Promise.reject({'reason': `App ${name} needs to be stopped before removing!!`})
		}
		
		let app = this.apps[name].instance
		// now we first call the destructor lifecycle
		app.octoDestructor()
		delete this.apps[name]['instance']
		return Promise.resolve()
	}

	removeApp(name, metadata) {
		if(!this.isAppLoaded(name)) {
			return Promise.reject({'reason': `App ${name} not loaded!!`})
		} else if(this.isAppStarted(name)) {
			return Promise.reject({'reason': `App ${name} needs to be stopped before removing!!`})
		}

		// now lets remove
		this.appUtil.removeAppCache(name)
		delete this.apps[name]
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