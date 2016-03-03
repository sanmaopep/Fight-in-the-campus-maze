// 矢量对象保存
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var VectorDataSchema = new Schema({
   belongto:String,
	geometry : {
		'type' : {
            type : String
        },
        coordinates : {
            type : Array
        }
	},
    properties : {
        type:'Mixed'
    }
});

var findById = function(id,cb){
    return (this.findOne({_id:id}, cb));
};
var findByCondition = function(condition,cb){
    return(this.find(condition,cb))
};
var updateById = function(id,dataObj,cb){
    var conditions = {_id:id};
    var option = {
        new:true,
        upsert:true
    };
    var updates = {$set:dataObj};
    this.findByIdAndUpdate(conditions,updates,option,cb);
};

VectorDataSchema.statics = {
    findById : findById,
    findByCondition:findByCondition,
    updateById:updateById
};

module.exports = VectorDataSchema;