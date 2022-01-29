const octoFactory = require('./Octopus/Utils/OctoFactory')
const AppEngine = require('./Octopus/AppEngine')

// load up the the factory
octoFactory.register('statusCodes', require('./Octopus/Common/statusCodes'))
octoFactory.register('apps', require('./Apps'))
octoFactory.register('appEngine', new AppEngine(octoFactory))

engine = octoFactory.get('appEngine')  
engine.loadApp('UniversityList').then(()=>{return engine.startApp('UniversityList')}).then(()=>console.log("started")).catch(err => console.log(err))
.then(()=>{return engine.restartApp('UniversityList')})