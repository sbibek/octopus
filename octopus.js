const octoFactory = require('./Octopus/Utils/OctoFactory')
const AppEngine = require('./Octopus/AppEngine')

// load up the the factory
octoFactory.register('statusCodes', require('./Octopus/Common/statusCodes'))
octoFactory.register('apps', require('./Apps'))
octoFactory.register('appEngine', new AppEngine(octoFactory))

engine = octoFactory.get('appEngine')  
engine.loadApp({'name': 'Dummy'}).then(()=>{return engine.startApp({'name': 'Dummy'})}).then(()=>console.log("started")).catch(err => console.log(err))
.then(()=>{return engine.restartApp({'name':'Dummy'})})