/**
 * Created by guguomin on 2015-07-19.
 */
var _ = require('underscore');
var http = require("http");
var url = require("url");
var config = require('./web.config');

var ViewController = require('../controllers/view-controller');
var SystemController = require('../controllers/system-controller');

var route = function(app) {
	app.set('views', __dirname + '/../view/pages');
	app.set('view engine', 'jade');

	//--------------------------------------------------------------------------
	// 获取项目基本信息
	app.get('/system/getprojdesc',SystemController.getprojdesc);
	//读取该图像相关的矢量数据
	app.get('/system/get-vecs/:imgid',SystemController.get_vecs);
	//修改该图像及相关的矢量数据
   app.post('/system/img-vec-mod',SystemController.mod_img_vec);
	//-----------------------视图---------------------------------------------------
	// 显示地图页面
	app.get('/view/index',ViewController.showMapMain);
};

module.exports = route;