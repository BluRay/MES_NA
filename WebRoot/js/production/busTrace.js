var pageSize=1;
var table;
var table_height = $(window).height()-300;
$(document).ready(function(){
	initPage();
	$("#breadcrumbs").resize(function() {
		//ajaxQuery();
	});
	function initPage(){
		getBusNumberSelect('#nav-search-input');
		getBusNumberSelect('#search_busNumber');
		getFactorySelect("production/busTrace",'',"#search_plant","All",'id');
		getWorkshopSelect("",$("#search_plant :selected").text(),"","#search_workshop","All","id");
	}
	$('#search_plant').change(function(){ 
		getWorkshopSelect("production/busTrace",$("#search_plant :selected").text(),"","#search_workshop","All","id");
	});
	$('#search_workshop').change(function(){ 
		var workshop=$("#search_workshop").find("option:selected").text();
		if(workshop=='All'){
			$('#search_station').html("");
			return false;
		}
		getAllstationSelect();
	});
	
	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("../production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	});
	
	$("#btnQuery").click (function () {
		showEditPage();
	});
	
	$("#btnAdd").click (function () {
		ajaxEdit();
	});
});


function showEditPage(){
	if($("#search_busNumber").val()==''){
		alert("Please Enter Bus No.");
		$("#search_busNumber").focus();
		return false;
	}
	$("#tableData").dataTable({
		paiging:false,
		showRowNumber:true,
		ordering:false,
		searching: false,
		bAutoWidth:false,
		destroy: true,
		paginate:false,
		scrollCollapse: true,
		lengthChange:false,
		orderMulti:false,
		info:false,
		sScrollY: table_height,sScrollX:true,
		language: {
		},
		ajax:function (data, callback, settings) {
			var param ={
				"bus_number":$("#search_busNumber").val(),
				"plant":$("#search_plant").val(),
				"workshop":$("#search_workshop").find("option:selected").text(),
				"station":$("#search_station").val(),
			};
           
            $.ajax({
                type: "post",
                url: "../quality/getBusNumberDetailList",
                cache: false,  //禁用缓存
                data: param,  //传入组装的参数
                dataType: "json",
                success: function (result) {
                    var returnData = {};
                    returnData.data = result.data;						
                    callback(returnData);
                }
            });
		},
		columns: [
			{"title":"No.","class":"center","data":"id","defaultContent": "","render":function(data,type,row,meta){
				return meta.row + meta.settings._iDisplayStart + 1;
	        }},
			{"title":"SAP No.","class":"center","data":"SAP_material","defaultContent": ""},
			{"title":"Parts Name","class":"center","data":"parts_name","defaultContent": ""},
			{"title":"Vendor","class":"center","data":"Vendor","defaultContent": ""},
			{"title":"Workshop","class":"center","data":"workshop","defaultContent": ""},
			{"title":"Station","class":"center","data":"station","defaultContent": ""},
			{"title":"Batch/Serial Number","class":"center","data":"batch","render":function(data,type,row){
				return "<input style='border:0;width:100px;text-align:center' class='batch' " +
				" value='"+(data!=undefined ? data : '')+"'/><input type='hidden' class='trace_id' " +
				" value='"+(row.id!=undefined ? row.id : '')+"'/>";
			}
		}
		],
	});
}

function ajaxEdit(){
    var trs=$("#tableData tbody").children("tr");
	var arr=[];
	//var busNumber=$("#bus_number").text();
	//var production_plant_id=json.production_plant_id;
	//var project_id=json.project_id;
	$.each(trs,function(index,tr){
		var tds=$(tr).children("td");
		var SAP_material=tds.eq(1).text();
		var parts_name=tds.eq(2).text();
		var vendor=tds.eq(3).text();
		var workshop=tds.eq(4).text();
		var station=tds.eq(5).text();
		var template_id=tds.eq(6).find(".template_id").val();
		var trace_id=tds.eq(6).find(".trace_id").val();
		var batch=tds.eq(6).find(".batch").val();
		var obj={};
		obj.trace_template_id=template_id;
		obj.trace_id=trace_id;
		obj.batch=batch;
		//obj.SAP_material=SAP_material;
		//obj.parts_name=parts_name;
		//obj.vendor=vendor;
		//obj.workshop=workshop;
		//obj.station=station;
		//obj.bus_number=busNumber;
		//obj.project_id=project_id;
		//obj.production_plant_id=production_plant_id;
		obj.type="modify";
		arr.push(obj);
	});

	$.ajax({
		type:"post",
		url: "../quality/addKeyParts",
		dataType: "json",
		data: {
			"key_parts_list":JSON.stringify(arr)
		},
		async: false,
		error: function () {},
		success: function (response) {
			if(response.success){
		    	$.gritter.add({
					title: 'Tip：',
					text: '<h5>Success！</h5>',
					class_name: 'gritter-info'
				});
		    	ajaxQuery();
		    	}else{
		    		$.gritter.add({
						title: 'Tip：',
						text: '<h5>Failure！</h5><br>',
						class_name: 'gritter-info'
					});
		    	}
			$( "#dialog-edit" ).dialog("close");
		}
	});	
}
function getAllstationSelect() {

	$.ajax({
		url : "../setting/getStationList",
		dataType : "json",
		data : {
			factory:$("#search_plant").find("option:selected").text(),
			workshop:$("#search_workshop").find("option:selected").text(),
		//	line:$("#line").val(),
			start:0,
			length:-1
			},
		async : false,
		error : function(response) {
			//alert(response.message)
		},
		success : function(response) {
			var strs = "<option value=''>All</option>";
		    $("#search_station").html("");
		   
		    $.each(response.data, function(index, value) {
		    	strs += "<option value='" + value.station_name + "'>" + value.station_name + "</option>";
		    });
		  //  alert(station_id_default);
		    $("#search_station").append(strs);
		}
	});
}