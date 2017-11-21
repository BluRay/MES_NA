var pageSize=1;
var table;
var table_height = $(window).height()-300;
var project_id='';
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
//	$('#search_workshop').change(function(){ 
//		var workshop=$("#search_workshop").find("option:selected").text();
//		if(workshop=='All'){
//			$('#search_station').html("");
//			return false;
//		}
//		getAllstationSelect();
//	});
	
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
	$("#search_busNumber").change(function(e){
		if($("#search_busNumber").val()==''){
			return false;
		}
		$.ajax({
			url:"../production/showBusNumberList",
			async:false,
			type:"post",
			dataType:"json",
			data:{
				"bus_number":$("#bus_number").val()
			},
			success:function(response){
				detail=response.data;
				if(detail.length>0){
					project_id=detail[0].project_id;
				}else{
					project_id='';
				}
			}
		})
	});
	$('body').on('keydown', ".batch",function(e){
		if (e.keyCode == "13") {
			$(e.target).parent("td").parent("tr").next().children().eq(6).find(".batch").focus();
		}
		if (e.keyCode == "38") { // 向上
			$(e.target).parent("td").parent("tr").prev().children().eq(6).find(".batch").focus();
		}
		if (e.keyCode == "40") { // 向下
			$(e.target).parent("td").parent("tr").next().children().eq(6).find(".batch").focus();
		}
	});
});


function showEditPage(){
	if($("#search_busNumber").val()==''){
		alert(Warn['P_common_02']);
		$("#search_busNumber").focus();
		return false;
	}else{
		$.ajax({
			url:"showBusNumberList",
			async:false,
			type:"post",
			dataType:"json",
			data:{
				"bus_number":$("#search_busNumber").val()
			},
			success:function(response){
				detail=response.data;
				if(detail.length>0){
					project_id=detail[0].project_id;
				}else{
					project_id='';
					alert(Warn['P_common_01']);
					return false;
				}
			}
		})
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
		sScrollY: $(window).height()-240,
		sScrollX:true,
		ajax:function (data, callback, settings) {
			var param ={
				"bus_number":$("#search_busNumber").val(),
				"project_id":project_id,
				"plant":$("#search_plant").val(),
				"workshop":$("#search_workshop").find("option:selected").text(),
				"station":$("#search_station").val(),
			};
           
            $.ajax({
                type: "post",
                url: "../quality/getBusNumberTemplateList",
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
			{"title":"Vendor","class":"center","data":"vendor","defaultContent": ""},
			{"title":"Workshop","class":"center","data":"workshop","defaultContent": ""},
			{"title":"Station","class":"center","data":"station","defaultContent": ""},
			{"title":"Batch/Serial Number","class":"center","data":"batch","render":function(data,type,row){
				return "<input style='width:180px;text-align:center' class='batch' " +
				" value='"+(data!=undefined ? data : '')+"'/><input type='hidden' class='trace_id' " +
				" value='"+(row.id!=undefined ? row.id : '')+"'/>" +
				"<input type='hidden' class='project_id' " +
				" value='"+(project_id!=undefined ? project_id : '')+"'/>"+
				"<input type='hidden' class='bus_number' " +
				" value='"+$("#search_busNumber").val()+"'/>"+
				"<input type='hidden' class='template_id' " +
				" value='"+(row.template_id!=undefined ? row.template_id : '')+"'/>"+
				"<input type='hidden' class='production_plant_id' " +
				" value='"+(row.production_plant_id!=undefined ? row.production_plant_id : '')+"'/>";
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
		var project_id=tds.eq(6).find(".project_id").val();
		var bus_number=tds.eq(6).find(".bus_number").val();
		var production_plant_id=tds.eq(6).find(".production_plant_id").val();
		var obj={};
		obj.trace_template_id=template_id;
		obj.SAP_material=SAP_material;
		obj.parts_name=parts_name;
		obj.vendor=vendor;
		obj.workshop=workshop;
		obj.station=station;
		obj.project_id=project_id;
		obj.bus_number=bus_number;
		obj.trace_id=trace_id;
		obj.batch=batch;
		obj.production_plant_id=production_plant_id;
		obj.type="modify";
		arr.push(obj);
	});
    if(arr.length==0){
    	alert(Warn['P_common_05']);
    	return false;
    }
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
					title: 'Message：',
					text: "<h5>"+Warn['P_common_03']+"</h5>",
					class_name: 'gritter-info'
				});
		    	ajaxQuery();
		    	}else{
		    		$.gritter.add({
						title: 'Message：',
						text: "<h5>"+Warn['P_common_04']+"</h5>",
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
		    	strs += "<option value='" + value.station_code + "'>" + value.station_code + "</option>";
		    });
		    $("#search_station").append(strs);
		}
	});
}