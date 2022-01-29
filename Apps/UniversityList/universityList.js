class OctoUniversityListApp {
	octoConstructor(request){
		console.log("UniversityList Hello!!")	
		let req = request("requests")
		req.get('http://universities.hipolabs.com/search', {'country': 'Nepal'}).then(()=>{})
	}
	octoDestructor(){
		console.log("UniversityList Bye!!")
	}
}

module.exports = OctoUniversityListApp