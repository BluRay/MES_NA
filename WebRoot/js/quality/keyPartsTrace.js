var pageSize=1;
var table;
var table_height = $(window).height()-240;
$(document).ready(function(){
	initPage();
	$("#breadcrumbs").resize(function(){
		//ajaxQuery();
	});
	
	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("../production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	});
	
	$("#btnQuery").click (function (){
		ajaxQuery();
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
function initPage(){
	getBusNumberSelect('#nav-search-input');
	getBusNumberSelect('#search_busNumber');
	getBusTypeSelect("","#search_bus_type","All","id");
	getOrderNoSelect("#search_project_no","#orderId");
	//ajaxQuery();
}
function ajaxQuery(){
//	if($.fn.dataTable.isDataTable("#tableData")){
//		$('#tableData').DataTable().destroy();
//		$('#tableData').empty();
//	}
	var table=$("#tableData").dataTable({
		serverSide: true,
		paiging:true,
		ordering:false,
		searching: false,
		bAutoWidth:false,
		destroy: true,
		sScrollY: $(window).height()-250,
		scrollX: true,
		pageLength: 20,
		pagingType:"full_numbers",
		lengthChange:false,
		orderMulti:false,
		language: {
		},
		ajax:function (data, callback, settings) {
			var param ={
				"draw":1,
				//"factoryId":$("#search_factory").val(),
				"bus_type" : $("#search_bus_type").find("option:selected").text(),
				"bus_number" : $("#search_busNumber").val(),
				"project_no" : $("#search_project_no").val(),
			//	"workshop" : $("#search_workshop").find("option:selected").text()
			};
			param.length = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;//开始的记录序号
            param.page = (data.start / data.length)+1;//当前页码
            $.ajax({
                type: "post",
                url: "getKeyPartsTraceList",
                cache: false,  //禁用缓存
                data: param,  //传入组装的参数
                dataType: "json",
                success: function (result) {
                	//alert(result.recordsTotal);
                	//封装返回数据
                    var returnData ={};
                    returnData.draw = data.draw;						//这里直接自行返回了draw计数器,应该由后台返回
                    returnData.recordsTotal = result.recordsTotal;		//返回数据全部记录
                    returnData.recordsFiltered = result.recordsTotal;	//后台不实现过滤功能，每次查询均视作全部结果
                    returnData.data = result.data;						//返回的数据列表
                    callback(returnData);
                }
            });
		},
		columns: [
          	{"title":"Plant","class":"center","data":"plant","defaultContent": ""},
            {"title":"Bus No.","class":"center","data":"bus_number","defaultContent": ""},
            {"title":"Project No.","class":"center","data":"project_name","defaultContent": ""},
            {"title":"Supervisor","class":"center","data":"editor","defaultContent": ""},
            {"title":"Supervisor Date","class":"center","data":"supervisor_date","defaultContent": ""},
            {"title":"","class":"center","data":"","width":"80px","render":function(data,type,row){
            	return "<i class=\"glyphicon glyphicon-search bigger-130\" title='Display' onclick = 'showInfoPage(" + JSON.stringify(row)+");' style='color:blue;cursor: pointer;'></i>&nbsp;&nbsp;" 
            	}
            },
            {"title":"","class":"center","data":"","width":"80px","render":function(data,type,row){
            	return "<i class=\"ace-icon fa fa-pencil bigger-130\" title='Edit' onclick = 'showEditPage(" + JSON.stringify(row)+ ");' style='color:green;cursor: pointer;'></i>";
            	}
            }
        ],
	});
}
function showInfoPage(json){
	$("#tableDataDetail").dataTable({
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
		ajax:function (data, callback, settings) {
			var param ={
				"bus_number":json.bus_number,
				"project_id":json.project_id
			};       
            $.ajax({
                type: "post",
                url: "getBusNumberTemplateList",
                cache: false,  //禁用缓存
                data: param,  //传入组装的参数
                dataType: "json",
                success: function (result) {
                	console.log("json",json);
                	$("#bus_number").text(json.bus_number);
                	$("#dialog-edit").removeClass('hide').dialog({
        				resizable: false,
        				title: '<div class="widget-header"><h4 class="smaller"><i class="ace-icon fa fa-users green"></i>Display Bus Trace</h4></div>',
        				title_html: true,
        				width:1000,
        				height:600,
        				modal: true,
        				buttons: [{
    							text: "Close",
    							"class" : "btn btn-minier",
    							click: function() {$( this ).dialog( "close" );} 
    						},
    					]
        			});
                	//封装返回数据
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
			{"title":"Batch/Serial Number","class":"center","data":"batch","defaultContent": ""},
       ],
	});
}
function showEditPage(json){
	$("#tableDataDetail").dataTable({
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
		language: {
			emptyTable:Warn['P_common_16'],
		},
		sScrollY: table_height,sScrollX:true,
		ajax:function (data, callback, settings) {
			var param ={
				"bus_number":json.bus_number,
				"project_id":json.project_id
			};
            $.ajax({
                type: "post",
                url: "getBusNumberTemplateList",
                cache: false,  //禁用缓存
                data: param,  //传入组装的参数
                dataType: "json",
                success: function (result) {
                	console.log("json",json);
                	$("#bus_number").text(json.bus_number);
                	$("#dialog-edit").removeClass('hide').dialog({
        				resizable: false,
        				title: '<div class="widget-header"><h4 class="smaller"><i class="ace-icon fa fa-users green"></i>Edit Bus Trace</h4></div>',
        				title_html: true,
        				width:1000,
        				height:600,
        				modal: true,
        				buttons: [
    				        {
    							text: "Close",
    							"class" : "btn btn-minier",
    							click: function() {$( this ).dialog( "close" );} 
    						},
    				        {
	    						text: "Save",
	    						"class" : "btn btn-primary btn-minier",
	    						click: function() {
	    							ajaxEdit(json); 
	    						} 
	    					}
		        		]
        			});
                	//封装返回数据
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
				return "<input style='border:1px;width:130px;text-align:center' class='batch' " +
				" value='"+(data!=undefined ? data : '')+"'/><input type='hidden' class='trace_id' " +
				" value='"+(row.trace_id!=undefined ? row.trace_id : '')+"'/><input type='hidden' class='template_id' " +
							" value='"+row.template_id+"'/>";
				}
			}
		],
	});
}
function ajaxEdit(json){
	var trs=$("#tableDataDetail tbody").children("tr");
	var arr=[];
	var busNumber=$("#bus_number").text();
	var production_plant_id=json.production_plant_id;
	var project_id=json.project_id;
	var flag=true;
	$.each(trs,function(index,tr){
		var tds=$(tr).children("td");
		if(tds.eq(0).text()==Warn['P_common_16']){
			flag=false;
		}
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
		obj.SAP_material=SAP_material;
		obj.parts_name=parts_name;
		obj.vendor=vendor;
		obj.workshop=workshop;
		obj.station=station;
		obj.bus_number=busNumber;
		obj.project_id=project_id;
		obj.production_plant_id=production_plant_id;
		obj.type="audit";// 审核操作
		arr.push(obj);
	});
	if(!flag){
		alert(Warn['P_common_05']);
		return false;
	}
	$.ajax({
		type:"post",
		url: "addKeyParts",
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