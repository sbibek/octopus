const assert = require('assert')
const AppEngine = require('../Octopus/AppEngine')


describe('AppEngine Tests',() => {
	const octoFactory = require('../Octopus/Utils/OctoFactory')
	const AppEngine = require('../Octopus/AppEngine')

	// load up the the factory
	octoFactory.register('statusCodes', require('../Octopus/Common/statusCodes'))
	octoFactory.register('apps', require('../Apps'))
	octoFactory.register('appEngine', new AppEngine(octoFactory))

	const engine = octoFactory.get('appEngine')

	it('Instance should not be null',() => {
		assert.notEqual(engine, null)
		assert.notEqual(engine, undefined)
	})

	it('App that is not loaded should return not loaded', ()=>{
		assert.equal(engine.isAppLoaded("Dummy"), false)
	})

	it('App that is not started yet should return not started',() => {
		assert.equal(engine.isAppStarted("Dummy"), false)
	})

	it('Starting app that does not exist should reject the promise', () => {
		return engine.startApp('skfjskjfd')
		.then(() => { assert.equal(true, false)})
		.catch(err => {
			assert.equal(true, true)
		})
	})
	
	it('Starting app that is not loaded should reject the promise', () => {
		return engine.startApp('Dummy')
		.then(() => { assert.equal(true, false)})
		.catch(err => {
			assert.equal(true, true)
		})
	})

	it('Load -> isLoaded -> start -> isStarted -> stop lifecycle should work', () => {
		return engine.loadApp('Dummy')
		.then(() => {
			assert.equal(engine.isAppLoaded('Dummy'), true)
		})
		.then(() => {
			return engine.startApp('Dummy')
		}).then(() => {
			assert.equal(engine.isAppStarted('Dummy'), true)
		}).then(() => {
			return engine.stopApp('Dummy')
		}).then(() => {
			assert.equal(engine.isAppLoaded('Dummy'), true)
			assert.equal(engine.isAppStarted(), false)
		})
		.then(() => {
			return engine.removeApp('Dummy')
		})
		.then(() => {
			assert.equal(engine.isAppStarted(), false)
			assert.equal(engine.isAppLoaded('Dummy'), false)
		})
	})
})