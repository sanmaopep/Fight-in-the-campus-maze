window.onload = InitPage;


var remoteURL='http://114.215.124.232:10002/';
var map = null;
var main_image_layer;   //存放图像瓦片图层
var drawControl = null; 
var featuregroup_vector;//存放矢量图层
var imgGeoJson = {
	image:{
		'id':'ggm_FC8D3E5759E64D668730BB3141FEDBDD'
	},
	vectors:[]
} ;//
var referenceMarker=null;
//判断标签是否在拖动状态
var isDragging=false;
var isHitted=false;
var success=false;

function InitPage(){
	initMap();
};

function initMap(){
	map= new L.map('map');
	main_image_layer = L.tileLayer('http://115.236.19.70:11280/tile3d/hangzhou_zju_zijingang/L{z}/R{y}/C{x}.png', {  
		minZoom: 15,
		maxZoom: 18,
		attribution: 'DataShell Campus'   
	});
	main_image_layer.addTo(map);
	map.setMaxBounds([ [30.205226957321003, 120.162673377990004],    [30.177193725584999, 120.211253547667994]]);
	map.setView([ 30.203226957321003,120.162673377990004], 16);

	featuregroup_vector = new L.FeatureGroup();
	featuregroup_vector.addTo(map);

	getVectorsData (imgGeoJson.image.id);
	addReferenceMarker();
	
}

var searchForBuilding=function(){
	var searchName=prompt("输入要查找建筑物的名称", "");
	//遍历矢量查找是否存在相应的建筑物
	for( var i = 0; i < imgGeoJson.vectors.length; i++){
		var vecData = imgGeoJson.vectors[i];
		console.log('输出当前向量');
		console.log(vecData);
		if(vecData.properties.buildingName==searchName){
			//获取该建筑物上的第一个点
			var moveLatlng=vecData.geometry.coordinates[0][0];
			console.log("moveLatlng is:");
			console.log(moveLatlng);
			//调换moveLatlng两个元素位置
			var temp=moveLatlng[0];
			moveLatlng[0]=moveLatlng[1];
			moveLatlng[1]=temp;
			//地图向这个点移动
			map.setView(moveLatlng);

			console.log(map.getCenter());
			return 1;
		}
	}
	alert('该建筑物不存在');
};

//碰撞检测,向量数据的下标为第几个坐标
function hitTestCheck(VectorDataArray,TargetLatLng){
	var tX=TargetLatLng.lng;
	var tY=TargetLatLng.lat;
	console.log('测试碰撞检测算法');
	console.log(TargetLatLng);
	console.log(VectorDataArray);
	VectorDataArray.push(VectorDataArray[0]);
	var Q=[];
	for(var i=0;i<VectorDataArray.length-1;i++){
		var X1=VectorDataArray[i][0]-tX;
		var Y1=VectorDataArray[i][1]-tY;
		var X2=VectorDataArray[i+1][0]-VectorDataArray[i][0];
		var Y2=VectorDataArray[i+1][1]-VectorDataArray[i][1];
		Q.push(X1*Y2-X2*Y1);
	}
	var start=0;
	while(Q[start]==0){
		start++;
	}
	if(Q[start]>0){
		for(var i=start+1;i<Q.length;i++){
			if(Q[i]<0){
				isHitted=false;
				return false;
			}
		}
	}else{
		for(var i=start+1;i<Q.length;i++){
			if(Q[i]>0){
				isHitted=false;
				return false;
			}	
		}
	}
	isHitted=true;
	return true;
}

//添加参考的标签
var addReferenceMarker=function(){
	//设置参考icon
	var myIcon=L.icon({
		iconUrl:remoteURL+'images/niangao.jpg',
		iconSize: [30, 30],

	});
	var markerOption={
		icon:myIcon,
		draggable:true
	};

	referenceMarker=L.marker([30.199085626602006,120.16971149444508],markerOption).addTo(map);
	referenceMarker.on('dragstart',function(e){
		isDragging=true;
		console.log('start Drag');
	});
	referenceMarker.on('dragend',function(e){
		isDragging=false;
		console.log('end Drag');
	});
	
	setInterval(function(){
		// console.log('HitTest');
		if(isHitted){
			console.log('碰到了');
			if(success){
				alert("你成功达到了终点,拯救了校园");
				location.reload();	
			}else{
				alert('你不小心误入了教学楼，被老师抓去研究Node.js了');
				location.reload();	
			}
			
			isHitted=false;
		}
	}, 100);
}

//在参考marker上添加标签
var putIconInReference=function(){
	var addLatLng=referenceMarker.getLatLng();
	console.log('The LatLng you want to add Marker:');
	console.log(addLatLng);

	//地图上添加标签
	var marker=L.marker(addLatLng).addTo(map);
	console.log('The Marker GeoJson you add is:');
	console.log(marker.toGeoJSON());
	//上传到数据库

}


function getVectorsData (imageid) {

	geturl = remoteURL+'system/get-vecs/'+imageid;;
	$.get(geturl,function(data,status){
		if (status == 'success'){
			if(data.retStatus == 'Fail'){
				
			}else{
				imgGeoJson.vectors = data.retValue;

				// console.log(JSON.stringify(imgGeoJson));
				// 绘制矢量
				drawAllVectors();
			}
		}
	});
}

//绘制当前图像的相关矢量
function drawAllVectors () {
	//删除绘制的矢量
	featuregroup_vector.eachLayer(function (layer) {
		featuregroup_vector.removeLayer(layer);
	});
	if(!imgGeoJson.vectors) {
		return;
	}
	//绘制矢量
	for( var i = 0; i < imgGeoJson.vectors.length; i++){
		var vecData = imgGeoJson.vectors[i];
		if (!vecData || vecData.error){
			continue;
		}
		vecData.type = "Feature";
		(function(_vecData){
			var vecLay = L.geoJson(vecData,{
				style:{
					weight:2,
					fillOpacity:0.5
				}
			});
			vecLay.eachLayer(function(_layer){
				_layer._id = vecData._id;
				console.log('添加了一个碰撞检测');
				
				var VectorDataArray=vecData.geometry.coordinates[0];
				console.log('VectorDataArray');console.log(VectorDataArray);
				_layer.bindPopup(vecData.properties.buildingName);
				var currBuildingName=vecData.properties.buildingName;
				//输出向量数据
				// setInterval(hitTestCheck(vecData.geometry.coordinates[0],referenceMarker.getLatLng()), 1000);
				if(vecData.geometry.type!="Point")
					setInterval(function(){
						var TargetLatLng=referenceMarker.getLatLng();
						var tX=TargetLatLng.lng;
						var tY=TargetLatLng.lat;
						// console.log('测试碰撞检测算法');
						// console.log(TargetLatLng);
						// console.log(VectorDataArray);
						VectorDataArray.push(VectorDataArray[0]);
						var Q=[];
						for(var i=0;i<VectorDataArray.length-1;i++){
							var X1=VectorDataArray[i][0]-tX;
							var Y1=VectorDataArray[i][1]-tY;
							var X2=VectorDataArray[i+1][0]-VectorDataArray[i][0];
							var Y2=VectorDataArray[i+1][1]-VectorDataArray[i][1];
							Q.push(X1*Y2-X2*Y1);
						}
						VectorDataArray.pop();
						var start=0;
						while(Q[start]==0){
							start++;
						}
						if(Q[start]>0){
							for(var i=start+1;i<Q.length;i++){
								if(Q[i]<0){
									return false;
								}
							}
						}else{
							for(var i=start+1;i<Q.length;i++){
								if(Q[i]>0){
									return false;
								}	
							}
						}
						isHitted=true;
						console.log('currBuildingName is:');
						console.log(currBuildingName);
						if(currBuildingName=='终点')	success=true;
						return true;
					}, 100);

				_layer.on('mouseover',function(){
					
				});
				_layer.on('contextmenu',function(e){
					
				});
				if(_layer._id.indexOf('del_') < 0){  //不显示被删除的
					featuregroup_vector.addLayer(_layer);
				}
			});
		})(vecData);
	}
}


function StartModifyVec(){
	if(!drawControl){
		drawControl = new L.Control.Draw({
			draw:{
				polyline:false,
				circle:false,
				marker:true
			},
			edit:{
				featureGroup:featuregroup_vector
			}
		}); 
		DrawControlEvent();
	}
	if(drawControl) {
		map.addControl(drawControl); 
	}
};


function EndModifyVec(){
	if(drawControl){
		map.removeControl(drawControl); 
	}
	submitImgGeojson();
};

//提交当前的图像和矢量数据到服务端
function submitImgGeojson () {
	console.log(JSON.stringify(imgGeoJson));
	var url = remoteURL+'system/img-vec-mod';
	var dataobj = {
   	'vecdata':JSON.stringify(imgGeoJson)
	}
	console.log(dataobj);
	$.post(url,dataobj,function(data){
		var imgid = data.retImgId;
		getVectorsData(imgGeoJson.image.id);
	});
}

function DrawControlEvent(){

	map.on('draw:created',function(e){

		var buildingName=prompt("输入建筑物的名称","");

		var layer = e.layer;
		var layertype = e.layerType;
		//	if (layertype =='rectangle' || layertype=='polygon'){
		if (1){
			var _id = 'new_'+guid();//这个好技巧
			var addGeoJson = layer.toGeoJSON();
			addGeoJson._id = _id;
			var addGeoJsonLayer = L.geoJson(addGeoJson);
			addGeoJsonLayer.eachLayer(function(layer){
				layer._id = _id;

				layer.on('click',function(){
					layer.bindPopup(vecData.properties.buildingName);
				});
				layer.on('contextmenu',function(e){
					
				});
				featuregroup_vector.addLayer(layer); 
			});
			addGeoJson.properties.buildingName=buildingName;
			console.log(addGeoJson);

			imgGeoJson.vectors.push(addGeoJson);
			drawAllVectors();
		}
	});

	map.on('draw:deleted',function(e){
		var layers=e.layers;
		console.log('进入删除回调');
		layers.eachLayer(function(layer){
			console.log('查看一个layer');
			var _id = 'del_'+layer._id;
			var delGeoJson=layer.toGeoJSON();
			console.log(delGeoJson);
			delGeoJson._id=_id;
			imgGeoJson.vectors.push(delGeoJson);
		});
		submitImgGeojson();
	});

	map.on('draw:edited',function(e){
		var layers=e.layers;
		console.log('进入更新回调');
		layers.eachLayer(function(layer){
			console.log('查看一个layer');
			var _id = 'upd_'+layer._id;
			var updGeoJson=layer.toGeoJSON();
			console.log(updGeoJson);
			updGeoJson._id=_id;
			
			imgGeoJson.vectors.push(updGeoJson);
		});
	});
};

//获取uuid
function guid() {
   return 'xxxxxxxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
   });
}