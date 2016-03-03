window.onload = InitPage;

var map = null;
var main_image_layer;   //存放图像瓦片图层

function InitPage(){
	initMap();
	showProjDescAlert();
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
}

function showProjDescAlert(){
	$.get('/system/getprojdesc',function(data,status){
		if(status =='success'){
			if(data.retStatus =='OK'){
				var projinfo = data.retValue.projDesc;
				alert(projinfo);
			}
		}
	});
};