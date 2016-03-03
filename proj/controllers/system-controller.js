var config = require('../config/web.config');
var http = require("http");
var url = require("url");
var request = require('request')



exports.getprojdesc = function(req,res){
	var projName = config.ProjName;
	var url = config.ServerURL +'v02/project-conf/findbyname/'+projName; 

	var result = {};
	request(url,function(err,projres,body){
		if(err){
			console.log(err);
			result.retStatus = 'Fail';
			result.retError = err;
			res.json(result);
		}
		else{
			var resBody = JSON.parse(body);
			if(resBody.retStatus == 'Fail'){
				result.retStatus = 'Fail';
				result.retError = 'get projinfo error';
				res.json(result);
			}else{
				result.retStatus = 'OK';
				var valueobj = {};
				valueobj.projDesc = resBody.retValue.projDesc;
				result.retValue = valueobj;
				res.json(result);
			}
		}
	});
};

exports.get_vecs = function  (req,res) {
	var imgid = req.params.imgid;
	var retObj= {};

	var postbody = {
		url: config.ServerURL + 'v02/vectordata/find-by-condition',
		form : {
			condition:JSON.stringify({'belongto':imgid})
		}
	};
	// console.log(postbody);
	request.post(postbody,function(err,httpResponse,body) {
		
		if(err){
			retObj.retStatus ='Fail';
			retObj.retError = err;
			console.log(err);
			res.json(retObj);
		}else{
			var resbody = JSON.parse(body);
			if(resbody.retStatus == 'Fail'){
				retObj.retStatus ='Fail';
				retObj.retError = '';
				res.json(retObj);
			}else {
				retObj.retStatus = 'OK';
				retObj.retValueCount = resbody.retValue.length;
				retObj.retValue = resbody.retValue;
				res.json(retObj);
				// console.log(JSON.stringify(retObj));
			}
		}
	});
}

exports.mod_img_vec = function  (req,res) {
	
	var uploadobj = JSON.parse(req.body.vecdata);
	var imgId = uploadobj.image.id;
	var upload_vectors = uploadobj.vectors;


	var retvalue = []; 
	var retObj = {  
		retStatus:'OK',
		retImgId :imgId,
		retValue :retvalue
	};
	var vectors_num = upload_vectors.length;
	for(var i = 0 ;i < vectors_num; i++)
	{
		var valueobj = {};
		var vecdata = upload_vectors[i];
		var id = vecdata._id;
		valueobj.id = id;
		var modtype = id.substr(0,3);
		if(modtype == 'new'){
			var postbody = {
				url : config.ServerURL + 'v02/vectordata/new',
				form : {
					belongto:imgId,
					geometry:JSON.stringify(vecdata.geometry),
					properties:JSON.stringify(vecdata.properties)
				}
			};
			request.post(postbody,function(err,httpResponse,body) {
				if(err){
					retObj.retStatus ='Fail';
					valueobj.retError = err;
				}else{
					var resBody = JSON.parse( body);
					if(resBody.retStatus == 'Fail'){
						retObj.retStatus ='Fail';
						valueobj.retError = resBody.retError;
					}else{
						valueobj.retFlag ='create success';
					}
				}
				retObj.retValue.push(valueobj);
				if(retObj.retValue.length == vectors_num){
					res.json(retObj);
				}
			});
		}else if(modtype =='upd'){
			var vecId = id.substr(4,id.length - 4);
			var postbody = {
				url : config.ServerURL + 'v02/vectordata/update/'+vecId,
				form : {
					belongto:imgId,
					geometry:JSON.stringify(vecdata.geometry),
					properties:JSON.stringify(vecdata.properties)
				}
			};
			request.post(postbody,function(err,httpResponse,body) {
				if(err){
					retObj.retStatus ='Fail';
					valueobj.retError = err;
				}else{
					var resBody = JSON.parse( body);
					if(resBody.retStatus == 'Fail'){
						retObj.retStatus ='Fail';
						valueobj.retError = resBody.retError;
					}else{
						valueobj.retFlag ='update success';
					}
				}
				retObj.retValue.push(valueobj);
				if(retObj.retValue.length == vectors_num){
					res.json(retObj);
					// console.log(retObj);
				}
			});
		}else if(modtype == 'del'){
			var vecId = id.substr(4,id.length - 4);
			var  delurl= config.ServerURL+'v02/vectordata/delete/'+vecId;
			request(delurl,function(err,projRes,body){
				if(err){
					retObj.retStatus ='Fail';
					valueobj.retError = err;
				}else{
					var resBody = JSON.parse(body);
					if(resBody.retStatus == 'Fail'){
					    retObj.retStatus ='Fail';
					    valueobj.retError = resBody.retError;
					}else{
					    valueobj.retFlag ='delete success';
					}
				}
				retObj.retValue.push(valueobj);
				if(retObj.retValue.length == vectors_num){
					res.json(retObj);
					// console.log(retObj);
				}
			});
		}else{
			//没有改变，什么都不做
			valueobj.retFlag='not change';
			retObj.retValue.push(valueobj);
			if(retObj.retValue.length == vectors_num){
				res.json(retObj);
				// console.log(retObj);
			}
		}
	}
	console.log(retObj);
}