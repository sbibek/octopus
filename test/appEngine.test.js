const assert = require('assert')
const AppEngine = require('../Octopus/AppEngine')


describe('AppEngine Tests',() => {
	let engine  = new AppEngine()
	it('Instance should not be null',() => {
		assert.notEqual(engine, null)
		assert.notEqual(engine, undefined)
	})
})