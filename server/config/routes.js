var mongoose = require('mongoose');
var _ = require('underscore');
var http = require("http");
var url = require("url");

var ProjectController = require('../controllers/projects-controller');
var VectorController = require('../controllers/vectordata-controller');

var route = function(app) {

	app.get('/v02/project-conf/findbyname/:projName', ProjectController.findbyname);
	//----------------------------矢量操作---------------------------------
	//添加1个矢量，返回完整json
	app.post('/v02/vectordata/new', VectorController.create)
	app.post('/v02/vectordata/update/:id', VectorController.update);
	app.get('/v02/vectordata/delete/:id', VectorController.delete);
	app.get('/v02/vectordata/find-by-id/:id', VectorController.find);
	//根据条件搜索，并返回所有的对象json [{obj},{obj}]
	app.post('/v02/vectordata/find-by-condition',VectorController.findByCondition);
};

module.exports = route;