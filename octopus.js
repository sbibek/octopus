AppEngine = require('./Octopus/AppEngine')
engine  = new AppEngine()
engine.loadApp({'name': 'Dummy'}).then(()=>{return engine.startApp({'name': 'Dummy'})}).then(()=>console.log("started")).catch(err => console.log(err))
.then(()=>{return engine.restartApp({'name':'Dummy'})})