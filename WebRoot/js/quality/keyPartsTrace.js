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
		getBusTypeSelect("","#search_bus_type","All","id");
		getOrderNoSelect("#search_project_no","#orderId");
		ajaxQuery();
	}

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/BMS/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})
	
	$("#btnQuery").click (function () {
		ajaxQuery();
	});
	
	$('#search_factory').change(function(){ 
		getWorkshopSelect("quality/keyPartsTrace",$("#search_factory :selected").text(),"","#search_workshop",null,"id");
	});
	$('#search_order').change(function(){ 
		$("#search_config").html("");
		if($(this).val()==""){
			return false;
		}
		$.ajax({
			url: "/BMS/order/getOrderByNo",
			dataType: "json",
			data: {
				"order_no":$(this).val()
			},
			async: false,
			error: function () {},
			success: function (response) {
				if(response.data!=null && response.data!=undefined){
					getOrderConfigSelect(response.data.id,"","#search_config","全部","id");
				}
			}
		})
		//getOrderConfigSelect("quality/keyPartsTrace",$("#search_factory :selected").text(),"","#search_workshop",null,"id");
	});
});

function ajaxQuery(){
	$("#tableData").dataTable({
		serverSide: true,
		paiging:true,
		ordering:false,
		searching: false,
		autoWidth:false,
		destroy: true,
		scrollY: $(window).height()-245,
		scrollX: true,
		/*scrollCollapse: true,*/
		pageLength: 20,
		pagingType:"full_numbers",
		lengthChange:false,
		orderMulti:false,
		language: {
		},
		ajax:function (data, callback, settings) {
			var param ={
				"draw":1,
				"factoryId":$("#search_factory").val(),
				"bustypeId" : $("#search_bus_type").val(),
				"busNumber" : $("#search_busNumber").val(),
				"orderNo" : $("#search_order").val(),
				"workshop" : $("#search_workshop").find("option:selected").text(),
			};
            param.length = data.length;					//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;					//开始的记录序号
            param.page = (data.start / data.length)+1;	//当前页码

            $.ajax({
                type: "post",
                url: "getKeyPartsTraceList",
                cache: false,  //禁用缓存
                data: param,  //传入组装的参数
                dataType: "json",
                success: function (result) {
                    //console.log(result);
                	//封装返回数据
                    var returnData = {};
                    returnData.draw = data.draw;						//这里直接自行返回了draw计数器,应该由后台返回
                    returnData.recordsTotal = result.recordsTotal;		//返回数据全部记录
                    returnData.recordsFiltered = result.recordsTotal;	//后台不实现过滤功能，每次查询均视作全部结果
                    returnData.data = result.data;						//返回的数据列表
                    //console.log(returnData);
                    //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                    //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                    callback(returnData);
                }
            });
		},
		columns: [
          	{"title":"Plant","class":"center","data":"plant","defaultContent": ""},
            {"title":"Bus No.","class":"center","data":"bus_number","defaultContent": ""},
            {"title":"Project No.","class":"center","data":"project_name","defaultContent": ""},
            {"title":"Production Supervisor","class":"center","data":"editor","defaultContent": ""},
            {"title":"Production Supervisor Date","class":"center","data":"edit_date","defaultContent": ""},
            {"title":"","class":"center","data":"","render":function(data,type,row){
            	return "<i class=\"glyphicon glyphicon-search bigger-130 showbus\" title='Display' onclick = 'showInfoPage(" + JSON.stringify(row)+");' style='color:blue;cursor: pointer;'></i>&nbsp;&nbsp;&nbsp;" 
            	}
            },{"title":"","class":"center","data":"","render":function(data,type,row){
            	return "<i class=\"ace-icon fa fa-pencil bigger-130 editorder\" title='Edit' onclick = 'showEditPage(" + JSON.stringify(row)+ ");' style='color:green;cursor: pointer;'></i>";
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
		language: {
		},
		ajax:function (data, callback, settings) {
			var param ={
				"bus_number":json.bus_number,
			//	"workshop":json.workshop,
			//	"key_components_template_id":json.key_components_template_id
			};
           
            $.ajax({
                type: "post",
                url: "getBusNumberDetailList",
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
                    //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                    //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
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
		sScrollY: table_height,sScrollX:true,
		language: {
		},
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
        				buttons: [{
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
                    //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                    //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
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
	var busNumber=$("#busNumber").text();
	var production_plant_id=json.production_plant_id;
	var project_id=json.project_id;
	$.each(trs,function(index,tr){
		var tds=$(tr).children("td");
		var SAP_materail=tds.eq(1).text();
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
		obj.SAP_materail=SAP_materail;
		obj.parts_name=parts_name;
		obj.vendor=vendor;
		obj.workshop=workshop;
		obj.station=station;
		obj.bus_number=busNumber;
		obj.project_id=project_id;
		obj.production_plant_id=production_plant_id;
		arr.push(obj);
	});
    console.log("param",JSON.stringify(arr));
   // return false;
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
					title: 'Tip：',
					text: '<h5>Success！</h5>',
					class_name: 'gritter-info'
				});
		    	ajaxQuery();
		    	}else{
		    		$.gritter.add({
						title: 'Tip：',
						text: '<h5>Failure！</h5><br>'+response.message,
						class_name: 'gritter-info'
					});
		    	}
			$( "#dialog-edit" ).dialog("close");
			
		}
	})
	
;	
}
