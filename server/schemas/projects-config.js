var mongoose = require('mongoose');

var ProjectsConfigSchema = new mongoose.Schema({
	projType:String,
	projName:{
    	type:String, //项目名称
    	unique:true
    },
	projDesc:String, //项目描述，文字字符串
	projTreeRootID:String, //根目录（已经废弃不用了）
    projConfig: {
		type: 'Mixed' //json字符串，每个项目自己定义配置
	},
	projUserIndex:[String] //该项目中用到的用户
});


ProjectsConfigSchema.statics = {
	findByName:function (name, cb) {
		return this
			.findOne({projName:name})
			.exec(cb);
	}
};

module.exports = ProjectsConfigSchema;