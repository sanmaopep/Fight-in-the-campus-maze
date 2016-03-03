//外网数据库配置
var dbconfig = {
	//mongodb
	db : 'mongodb://120.26.205.24/datashell_study',
	db_name : 'datashell_study',
	db_option:{          //连接用户名
		user: 'study',
		pass: 'study'
	},
	LocalPort:10001 //监听端口
};

// //工大校园网数据库配置
// var dbconfig = {
// 	//mongodb
// 	db : 'mongodb://172.16.12.152/datashell_study',
// 	db_name : 'datashell_study',
// 	db_option:{          //连接用户名
// 		user: '',
// 		pass: ''
// 	},
// 	LocalPort:10001 //监听端口
// };

module.exports = dbconfig;





// module.exports = dbconfig;