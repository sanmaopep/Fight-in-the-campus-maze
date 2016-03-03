var ProjectConfigModel = require('../models/projects-config');

exports.findbyname = function(req, res) {
	var projName = req.params.projName;
	var retObj = {};
	ProjectConfigModel.findByName(projName, function(err, doc) {
		if(err) {
			console.log(err);
			retObj.retStatus ='Fail';
			retObj.retError = err;
			res.json(retObj);
		}
		else {
			if(doc==null){
				retObj.retStatus ='Fail';
				retObj.retError = 'not exist';
				res.json(retObj);
			}else{
				retObj.retStatus ='OK';
				retObj.retValue = doc;
				res.json(retObj);
			}
		}
	});
};