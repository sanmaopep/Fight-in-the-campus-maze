var VectorDataModel = require('../models/vector-data');

exports.create = function (req, res) {

	var dataObj = req.body;
	var _data;
	var saveDataObj = {};
	if(dataObj.belongto) saveDataObj.belongto = dataObj.belongto;
	if(dataObj.geometry) saveDataObj.geometry = JSON.parse(dataObj.geometry);
	if(dataObj.properties) saveDataObj.properties = JSON.parse(dataObj.properties);
	var retObj = {};
	console.log(saveDataObj);
	_data  = new VectorDataModel(saveDataObj);
	_data.save(function(err, doc){
		if (err) {
			retObj.retStatus = 'Fail';
			retObj.retError = err;
			res.json(retObj);
		} else {
			retObj.retStatus = 'OK';
			// 返回的retValue中有 _id 属性表示 刚保存的矢量的ID
			// 调用者获得这个id,将该矢量ID存入矢量图层中
			retObj.retValue = doc;
			console.log(retObj);
			res.json(retObj);
		}
	});
};

exports.find = function(req, res) {
	var id = req.params.id;
	var retObj = {};

	VectorDataModel.findById(id, function(err, doc) {
		if(err) {
			retObj.retStatus='Fail';
			retObj.retError = err;
			res.json(retObj);
		}else if(doc===null){
			retObj.retStatus='OK';
			retObj.retCount = 0;
			res.json(retObj);
		}else {
			retObj.retStatus = 'OK';
			retObj.retCount = 1;
			retObj.retValue = doc;
			res.json(retObj);
		}
	});
};

exports.delete = function(req, res) {
	var id = req.params.id;
	var retObj = {};
	console.log(id);
	VectorDataModel.findById(id, function(err, doc) {
		if(err) {
			retObj.retStatus='Fail';
			retObj.retError = err;
			res.json(retObj);
		}else if(doc === null){
			retObj.retStatus='Fail';
			retObj.retError = 'vectordata not found '+id;;
			res.json(retObj);
		}else {
			console.log(doc);
			doc.remove(function(_err, _doc) {
				if(_err) {
					retObj.retStatus='Fail';
					retObj.retError = _err;
					res.json(retObj);
				}else {
					retObj.retStatus = 'OK';
					retObj.retValue = doc;
					res.json(retObj);
				}
			});
		}
	});
};

exports.findByCondition = function(req,res){
	console.log(req.body);
	var condition = JSON.parse(req.body.condition);
	var retObj = {};
	
	VectorDataModel.findByCondition(condition,function(err,doc){
		if(err){
			retObj.retStatus = 'Fail';
			retObj.retError = err;
			res.json(retObj);
		}else{
			retObj.retStatus = 'OK';
			retObj.retValue = doc;
			res.json(retObj);
			console.log(retObj);
		}
	});
};


exports.update = function (req, res) {
	var id = req.params.id;
	var dataObj = req.body;
	var updateDataObj = {};
	if(dataObj.belongto) updateDataObj.belongto = dataObj.belongto;
	if(dataObj.geometry) updateDataObj.geometry = JSON.parse(dataObj.geometry);
	if(dataObj.properties) updateDataObj.properties = JSON.parse(dataObj.properties);
	var retObj = {};
	console.log(updateDataObj);
	VectorDataModel.updateById(id,updateDataObj,function(err,doc){
		if(err) {
			retObj.retStatus = 'Fail';
			retObj.retError = err;
			res.json(retObj);
		}else {
			retObj.retStatus = 'OK';
			retObj.retValue = doc;
			res.json(retObj);
		}
	});
};


