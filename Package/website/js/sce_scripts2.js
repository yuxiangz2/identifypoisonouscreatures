var json=[]
var json2=[]
var json3=[]
var json4=[]
$(document).ready(function(){/* google maps -----------------------------------------------------*/

//get data from web_data
 myFunction(function(response) {    
    json=response;    
    // $('#response').html('response: ' + JSON.stringify(response));
});


 //get data from web_data
 myFunction2(function(response) {    
    json2=response;    
    // $('#response').html('response: ' + JSON.stringify(response));
});

 //get data from mentioneddata
 myFunction3(function(response) {    
    json3=response;    
    // $('#response').html('response: ' + JSON.stringify(response));
});

 
  //get data from web_data
 myFunction4(function(response) {    
    json4=response;    
    // $('#response').html('response: ' + JSON.stringify(response));
});

corechart(json,json3);
barchart(json2);
reflectFromTwitter(json4);




/* end google maps -----------------------------------------------------*/
});


function corechart(data, data2){
	var spcount=0;
	var sncount=0;
	var otcount=0;
	for(i in data.rows){
		if(data.rows[i].value.lable=='spider'){
			spcount=spcount+1;
		}else if(data.rows[i].value.lable=='snake'){
			sncount=sncount+1;
		}else if(data.rows[i].value.lable=='others'){
			otcount=otcount+1;
		}
	};

	//produce chart
	google.load("visualization", "1", {packages:["corechart"]});
      google.setOnLoadCallback(drawChart);
      function drawChart() {
        var data = google.visualization.arrayToDataTable([
          ['Task', 'Hours per Day'],
          ['Spiders',     spcount],
          ['Snakes',      sncount],
          ['Others',  otcount]
        ]);

        var options = {
          title: 'Percentage Comparison',
          is3D: true,
        };


        var chart = new google.visualization.PieChart(document.getElementById('piechart'));
        chart.draw(data, options);

         

        function selectHandler() {
		    var selectedItem = chart.getSelection()[0];
		    if (selectedItem) {
		    	
		       var value = data.getValue(selectedItem.row,0);
		       mentionedWords(value.toLowerCase());
		       //alert('The user selected ' + value);
		    }
		  };
        google.visualization.events.addListener(chart, 'select', selectHandler);

        function mentionedWords(value){
        	var str="The Rank "+value +" of Mentioned Word";
        	for(i in data2.rows){
        		if(data2.rows[i].key==value){
        			var list=data2.rows[i].value;
        			for(x in list){
        				var c=parseInt(x)+1;
        				str=str+"\n"+c+". "+list[x][0];
        			}
        			
        		}
        	}
        	document.getElementById("mentioned").innerHTML = str

        }

      }
}



function barchart(data){


var dataArray=[];
dataArray[0]=['Time', 'Poisonous Creatures']

var a=0;
for(i in data.rows){
	a=parseInt(i)+1;
	dataArray[a]=[data.rows[i].key,data.rows[i].value];
}
console.log(dataArray);
	//produce chart
	google.load("visualization", "1.1", {packages:["bar"]});
      google.setOnLoadCallback(drawChart);
      function drawChart() {
        var data = google.visualization.arrayToDataTable(dataArray);

        var options = {
          chart: {
            title: 'Appearence Time',
            subtitle: 'Sum, Duration: 00am-23pm' /*Expenses, and Profit: 2014-2017,*/
          },
          bars: 'horizontal' // Required for Material Bar Charts.
        };

        var chart = new google.charts.Bar(document.getElementById('barchart_material'));

        chart.draw(data, options);
      }
}

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
        url: 'http://115.146.85.71:5984/web_data/_design/all/_view/count_time?group=true',
        dataType: 'json',
        async : false,
        crossDomain : true
    }).done(function(response) {
        callback(response);
    });
}


function myFunction3(callback) {
    $.ajax({
        type: 'GET',
        url: 'http://115.146.85.71:5984/mentioned_target/_design/all/_view/mentionedwords',
        dataType: 'json',
        async : false,
        crossDomain : true
    }).done(function(response) {
        callback(response);
    });
}

function myFunction4(callback) {
    $.ajax({
        type: 'GET',
        url: 'http://115.146.85.71:5984/web_data/_design/all/_view/semtiment',
        dataType: 'json',
        async : false,
        crossDomain : true
    }).done(function(response) {
        callback(response);
    });
}


function reflectFromTwitter(data){
	var count=0;
	var l=0;
	var negative="";
	var positive="";

	for(i in data.rows){
		
		if(count<10){
			var neg=0;
			var str="<li><a>";
			//top 10 for negative	
			negative=negative +"<li><a>"+data.rows[i].value.name+"</a><p>"+data.rows[i].value.text+"</p><p>Score: "+data.rows[i].key+"</p></li>";
			

			var pos=0;
			
			//console.log(count);
			l=count+1;
			pos=data.rows[data.rows.length-l].key;
			data.rows[data.rows.length-l].value.name;
			data.rows[data.rows.length-l].value.text;
			positive=positive +"<li><a>"+data.rows[data.rows.length-l].value.name+"</a><p>"+data.rows[data.rows.length-l].value.text+"</p><p>Score: "+data.rows[data.rows.length-l].key+"</p></li>";
		};
		count++;
	};
	console.log(negative);
	document.getElementById("slider").innerHTML =negative;
	document.getElementById("slider1").innerHTML =positive;

}

