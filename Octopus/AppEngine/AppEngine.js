class AppEngine {

	constructor(octoFactory) {
		if(!octoFactory) throw 'AppEngine requires OctoFactory instance to load the dependencies!!'
		this.apps = {}
		this.octoFactory = octoFactory
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
	
	async loadApp(name, metadata = null) {
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

	async reloadApp(name, metadata = null) {
		this.appUtil.removeAppCache(name)
		return this.loadApp(name, metadata)
	}

	async startApp(name, metadata = null) {
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
		let returnValue = app.octoConstructor((name) => this.fulFillAppDependencyRequest(name))
		if(!!returnValue && typeof returnValue.then == 'function') {
			// means the return value is promise
			return returnValue;
		}

		return Promise.resolve()
	}

	async restartApp(name, metadata = null) {
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

	async stopApp(name, metadata) {
		if(!this.isAppLoaded(name)) {
			return Promise.reject({'reason': `App ${name} not loaded!!`})
		} else if(!this.isAppStarted(name)) {
			return Promise.reject({'reason': `App ${name} needs to be stopped before removing!!`})
		}
		
		let app = this.apps[name].instance
		// now we first call the destructor lifecycle
		let returnValue = app.octoDestructor()
		return ((!!returnValue && typeof returnValue.then == 'function') ? returnValue: Promise.resolve()).then(() => {
			delete this.apps[name]['instance']
			return Promise.resolve()
		})
	}

	async removeApp(name, metadata) {
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

	fulFillAppDependencyRequest(name) {
		return this.octoFactory.get(name)
	}
}

module.exports = AppEngine