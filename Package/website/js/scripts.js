
var map;
var json=[];
var heatmap_points=[];
var markers = [];




$(document).ready(function(){/* google maps -----------------------------------------------------*/
google.maps.event.addDomListener(window, 'load', initialize);

function initialize() {
  //ajax return
  

  //heatmap points
  


  /* position Amsterdam */
  var latlng = new google.maps.LatLng(-28.87343728086593,130.78685474999997);

  var mapOptions = {
    center: latlng,
    scrollWheel: true,
    zoom: 5
  };
  

  
  map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  // marker.setMap(map);

//get data from web_data
  myFunction(function(response) {    
    json=response;    
    // $('#response').html('response: ' + JSON.stringify(response));
});

  //get data from possibledata 
  myFunction2(function(response) {    
    json2=response;    
    // $('#response').html('response: ' + JSON.stringify(response));
}); 

  //console.log(json.rows);
  for(i in json.rows){
    var latlng = new google.maps.LatLng(json.rows[i].value.geo[1],json.rows[i].value.geo[0]);
    heatmap_points[i]=latlng;
  };

  console.log(heatmap_points);
  var pointArray = new google.maps.MVCArray(heatmap_points);
  var heatmap = new google.maps.visualization.HeatmapLayer({
    data: pointArray,
    radius: 15    
  });
  heatmap.setMap(map);

  listCity(json);

};
/* end google maps -----------------------------------------------------*/
});


function myFunction(callback) {
    $.ajax({
        type: 'GET',
        url: 'http://115.146.85.71:5984/web_data/_design/all/_view/geo',
        dataType: 'json',
        async : false,
        crossDomain : true
    }).done(function(response) {
        callback(response);
    });
}

function myFunction2(callback) {
    $.ajax({
        type: 'GET',
        url: 'http://115.146.85.71:5984/possibledata/_design/all/_view/geo',
        dataType: 'json',
        async : false,
        crossDomain : true
    }).done(function(response) {
        callback(response);
    });
}


function getSpiders(){
   deleteMarkers();
  for(i in json.rows){
    if(json.rows[i].value.lable=='spider'){
      var latlng = new google.maps.LatLng(json.rows[i].value.geo[1],json.rows[i].value.geo[0]);
      addMarker(latlng,"#FF0000");
    }
  }
  setMapOnAll(map);
}

function getSnakes(){
  deleteMarkers();
  for(i in json.rows){
    if(json.rows[i].value.lable=='snake'){
      var latlng = new google.maps.LatLng(json.rows[i].value.geo[1],json.rows[i].value.geo[0]);
      addMarker(latlng,"#FF0000");
    }
  }
  setMapOnAll(map);
}

function getOthers(){
   deleteMarkers();
  for(i in json.rows){
    if(json.rows[i].value.lable=='others'){
      var latlng = new google.maps.LatLng(json.rows[i].value.geo[1],json.rows[i].value.geo[0]);
      
      addMarker(latlng,"#FF0000");
    }
  }
  setMapOnAll(map);
}

function getPotential(){
  
   deleteMarkers();
  for(i in json2.rows){
    if(json2.rows[i].value.lable=='others'){
      var latlng = new google.maps.LatLng(json2.rows[i].value.geo[1],json2.rows[i].value.geo[0]);      
      addMarker(latlng,"#FFFF00");
    }
  }
  setMapOnAll(map);
}


// Adds a marker to the map and push to the array.
function addMarker(location,color) {

  var marker = new google.maps.Marker({
    position: location,
    map: map,
    icon: pinSymbol(color),
    animation: google.maps.Animation.DROP
  });
  markers.push(marker);
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
  setMapOnAll(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  clearMarkers();
  markers = [];
}

function pinSymbol(color) {
    return {
        path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
        fillColor: color,
        fillOpacity: 1,
        strokeColor: 'FFFFFF',
        strokeWeight: 2,
        scale: 1,
   };
}


function listCity(json){
  

  var sp_city=[];
 var sn_city=[];
 var ot_city=[];
      for(i in json.rows){
        city=json.rows[i].value.city;
        lable=json.rows[i].value.lable;
        if(sp_city.indexOf(city) == -1 && lable=='spider'){
            sp_city[i]=city;
        }else if(sn_city.indexOf(city) == -1 && lable=='snake'){
          sn_city[i]=city;
        }else if(ot_city.indexOf(city) == -1 && lable=='others'){
          ot_city[i]=city;
        }
      };
      
      //alert("!!!");
      var sp_str="";
      var sn_str="";
      var ot_str="";
      for(i in sp_city){
        sp_str=sp_str+" | " +sp_city[i];
      };

      for(i in sn_city){
        sn_str=sn_str+" | " +sn_city[i];
      };

      for(i in ot_city){
        ot_str=ot_str+" | " +ot_city[i];
      };

      //console.log(sp_str);
      document.getElementById("sp_city").innerHTML = sp_str;
      document.getElementById("sn_city").innerHTML = sn_str;
      document.getElementById("ot_city").innerHTML = ot_str;
}


function searchKeyword(){
  var data=[]
  var val=document.getElementById("searchword").value;
 // var val_set=val.replace(/[!.,;#()@|\"]+/g, "").split(" ");
 // 
  if(val=="" ){
    alert("Please just input one key word!");
    return;   
  }else{
    
    getsearchdata(function(response) {    
    data=response;   
    });

    if(data.rows.length==0){
      alert("Sorry, we don't have too much data or maybe data without GEO information.");
    }else{
    deleteMarkers();
    for(var i in data.rows){
      var latlng = new google.maps.LatLng(data.rows[i].value[1],data.rows[i].value[0]);
      addMarker(latlng,"#FF0000");
    }
    setMapOnAll(map);
    }
  }
  
}

function getsearchdata(callback) {
      var val=document.getElementById("searchword").value;
      val=val.toLowerCase();
      // alert(val+" is Searching"); 
    $.ajax({
        type: 'GET',
        url: 'http://115.146.85.71:5984/web_data/_design/all/_view/search?key="'+val+'"',
        dataType: 'json',
        async : false,
        crossDomain : true
    }).done(function(response) {
        callback(response);
        
    });
  }