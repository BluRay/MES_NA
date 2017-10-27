var cur_year="";
var pageSize=20;
$(document).ready(function(){
	initPage();
	$("#btnQuery").click(function () {
		ajaxQuery();
    });
	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("../production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	});
});

function initPage(){
	getBusNumberSelect('#nav-search-input');
	var cur_year = new Date().getFullYear();
	var factory_default=getQueryString("factory_id");
	$("#search_productive_year").val(cur_year);
	getOrderNoSelect("#search_project_no","#orderId");
	getFactorySelect("project/projectQuery",factory_default,"#search_plant","All","id")
	ajaxQuery();
	
}
function ajaxQuery(){
	var tb=$("#tableOrder").DataTable({
		serverSide: true,
		fixedColumns:   {
            leftColumns: 2,
            rightColumns:2
        },
		dom: 'Bfrtip',
		lengthMenu: [
		             [ 20, 50,100, -1 ],
		             ['Show 20 rows', 'Show 50 rows', 'Show 100 rows', 'Show all rows' ]
		         ],
	    buttons: [
	        {extend:'excelHtml5',title:'data_export',className:'black',text:'<i class=\"fa fa-file-excel-o bigger-130\" tooltip=\"导出excel\"></i>'},
	        {extend:'colvis',text:'<i class=\"fa fa-list bigger-130\" tooltip=\"选择展示列\"></i>'},
	        {extend:'pageLength',/*text:'显示行'*/}
	       
	    ],
        rowsGroup:[0,1,2,3,4,5,6],
		paiging:true,
		ordering:false,
		searching: false,
		bAutoWidth:false,
		destroy: true,
		sScrollY: $(window).height()-250,
		scrollX: true,
		/*scrollCollapse: true,*/
		pageLength: pageSize,
		pagingType:"full_numbers",
		lengthChange:true,
		orderMulti:false,
		language: {
		},
		ajax:function (data, callback, settings) {
			$(".divLoading").addClass("fade in").show();
			var param ={
				"draw":1,
				"project_no":$("#search_project_no").val(),
				"plant":getAllFromOptions("#search_plant","val"),
				"status":$("#search_status").val()
			};
            param.length = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;//开始的记录序号
            param.page = (data.start / data.length)+1;//当前页码

            $.ajax({
                type: "post",
                url: "getProjectDetailList",
                cache: false,  //禁用缓存
                data: param,  //传入组装的参数
                dataType: "json",
                success: function (result) {
                    //console.log(result);
                	//封装返回数据
                    var returnData = {};
                    returnData.draw = data.draw;//这里直接自行返回了draw计数器,应该由后台返回
                    returnData.recordsTotal = result.recordsTotal;//返回数据全部记录
                    returnData.recordsFiltered = result.recordsTotal;//后台不实现过滤功能，每次查询均视作全部结果
                    returnData.data = result.data;//返回的数据列表
                    callback(returnData);
                    var head_width=$(".dataTables_scrollHead").width();
                    $(".dataTables_scrollHead").css("width",head_width-20);
                    $(".divLoading").hide();
                }
            });
		},
		columns: [
            {"title":"Project No.","class":"center","data":"project_no","defaultContent": ""},
            {"title":"Project Name","width":"200","class":"center","data":"project_name","defaultContent": ""},
            {"title":"Status","class":"center","data":"status","defaultContent": "","render":function(data,type,row){
            	return data=="1"?"Created":(data=="2"?"In Process":"Completed");
            }},		            
            {"title":"Delivery Date","class":"center","data":"delivery_date","defaultContent": ""},
            {"title":"Plant","class":"center","data":"plant","defaultContent": ""},
            {"title":"Customer","class":"center","data":"customer","defaultContent":""},
            {"title":"Quantity","class":"center","data": "quantity","defaultContent": ""},
            {"title":"Welding Online","class":"center","data":"welding_online_count","defaultContent": ""},		            
            {"title":"Weiding Offline","class":"center","data": "welding_offline_count","defaultContent": ""},		            
            {"title":"Painting Online","class":"center","data":"painting_online_count","defaultContent": ""},
            {"title":"Painting Offline","class":"center","data":"painting_offline_count","defaultContent": ""},
            {"title":"Chassis Online","class":"center","data":"chassis_online_count","defaultContent": ""},
            {"title":"Chassis Offline","class":"center","data":"chassis_offline_count","defaultContent": ""},
            {"title":"Assembly Online","class":"center","data": "assembly_online_count","defaultContent": ""},
            {"title":"Assembly Offline","class":"center","data":"assembly_offline_count","defaultContent": ""},		            
            {"title":"Testing","class":"center","data":"testing_count","defaultContent": ""},		            
            {"title":"Outgoing","class":"center","data": "outgoing_count","defaultContent": ""},
            {"title":"Delivered","class":"center","data":"delivery_count","defaultContent":""},
            {"title":"BOM","class":"center","width":"50px","data":"","defaultContent":"","render":function(data,type,row){
            	return "<i class=\"ace-icon fa fa-search bigger-130 editorder\" onclick = 'ajaxShowBom(\""+ row.project_no+"\");' style='color:blue;cursor: pointer;' title='Bom'></i>";
            }},
            {"title":"Details","class":"center","width":"50px","data":"","defaultContent":"","render":function(data,type,row){
            	return "<i class=\"ace-icon fa fa-search bigger-130 editorder\" onclick = 'ajaxShowBusNumber(" + row.id+ ");' style='color:blue;cursor: pointer;' title='Details'></i>";
            }},
        ],
	});
	$("#tableOrder_info").addClass('col-xs-6');
	$("#tableOrder_paginate").addClass('col-xs-6');
	$(".dt-buttons").css("margin-top","-50px").find("a").css("border","0px");
}

function ajaxShowBusNumber(project_id){
	$(".divLoading").addClass("fade in").show();
	$.ajax({
		url: "../project/showProjectBusNumber",
		dataType: "json",
		data: {"project_id" : project_id},
		async: false,
		error: function () {},
		success: function (response) {
			var dialog = $( "#dialog-message" ).removeClass('hide').dialog({
				width:1150,
				height:550,
				modal: true,
				title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i> Bus Number Detail</h4></div>",
				title_html: true,
				buttons: [ 
					{
						text: "Cancel",
						"class" : "btn btn-minier",
						click: function() {
							$( this ).dialog( "close" ); 
						} 
					},
				]
			});
			if(response.success){
				if($.fn.dataTable.isDataTable("#tableBusNumber")){
					$('#tableBusNumber').DataTable().destroy();
					$('#tableBusNumber').empty();
				}
				drawBusInfoTable(response.data)
			}
		},
		complete:function (response){
        	$(".divLoading").hide();
		}
	})
}

function drawBusInfoTable(data){
	var t=$("#tableBusNumber").dataTable({
		//serverSide: true,
		fixedColumns: {
            leftColumns:2,
            //rightColumns:2
        },
        paiging:false,
		ordering:false,
		processing:true,
		searching: false,
		autoWidth:false,
		paginate:false,
		sScrollY: $(window).height()-260,
		scrollX: true,
		scrollCollapse: true,
		lengthChange:false,
		orderMulti:false,
		info:false,
		//destroy: true,
		data:data,
		columns: [
            {"title":"No.","class":"center","data":"","width": "45px"
            	,"render":function(data,type,row,meta){
					return meta.row + meta.settings._iDisplayStart + 1; // 序号值
		        }
            },
            {"title":"Bus No.","class":"center","data":"bus_number","defaultContent": ""},
            {"title":"VIN","class":"center","data":"VIN","width": "160px","defaultContent": ""},
            {"title":"Station","class":"center","data":"current_station","defaultContent": ""},
            {"title":"Welding Online","class":"center","data":"welding_online","defaultContent": ""},
            {"title":"Welding Offline","class":"center","data":"welding_offline","defaultContent": ""},
            {"title":"Painting Online","class":"center","data":"painting_online","defaultContent": ""},
            {"title":"Painting Offline","class":"center","data":"painting_offline","defaultContent": ""},
            {"title":"Chassis Online","class":"center","data":"chassis_online","defaultContent": ""},
            {"title":"Chassis Offline","class":"center","data":"chassis_offline","defaultContent": ""},
            {"title":"Assembly Online","class":"center","data":"assembly_online","defaultContent": ""},
            {"title":"Assembly Offline","class":"center","data":"assembly_offline","defaultContent": ""},
            {"title":"Testing","class":"center","data":"testing","defaultContent": ""},
            {"title":"Outgoing","class":"center","data":"outgoing","defaultContent": ""},
            {"title":"Delivered","class":"center","data":"delivery","defaultContent": ""},
       ],
	});
	var head_width=$("#tableBusNumber_wrapper").width();
	if(head_width>0){
		$("#tableBusNumber_wrapper .dataTables_scrollHead").css("width",head_width-17);
	}
}
function ajaxShowBom(project_no){
	$(".divLoading").addClass("fade in").show();
	$.ajax({
		url: "../project/getBomItemList",
		dataType: "json",
		data: {"projectNo" : project_no},
		async: false,
		error: function () {},
		success: function (response) {
			var dialog = $( "#dialog-config" ).removeClass('hide').dialog({
				width:1150,
				height:550,
				modal: true,
				title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i> Bom Detail</h4></div>",
				title_html: true,
				buttons: [ 
					{
						text: "Close",
						"class" : "btn btn-minier",
						click: function() {
							$( this ).dialog( "close" ); 
						} 
					}
				]
			});
			drawBomTable(response.data);
		},
		complete:function (response){
        	$(".divLoading").hide();
		}
	})
}

function drawBomTable(data){
	if($.fn.dataTable.isDataTable("#tableBom")){
		$('#tableBom').DataTable().destroy();
		$('#tableBom').empty();
	}
	var columns=[
	    {"title":"item No.","class":"center","width":"45px","data":"item_no","defaultContent": ""},
	    {"title":"SAP_material","class":"center","data":"SAP_material","defaultContent": ""},
	    {"title":"BYD_P/N","class":"center","data":"BYD_NO","defaultContent": ""},
	    {"title":"Part Name","class":"center","data": "part_name","defaultContent": ""},
	    {"title":"Specification","class":"center","width":"160px","data":"specification","defaultContent": ""},
	    {"title":"Unit","class":"center","width":"45px","data": "unit","defaultContent": ""},
	    {"title":"Quantity","class":"center","width":"60px","data": "quantity","defaultContent": ""},
	    {"title":"English Description","class":"center","data": "en_description","defaultContent": ""},
	    {"title":"Vendor","class":"center","data": "vendor","defaultContent": ""},
	    {"title":"Station Code","class":"center","width":"80px","data": "station_code","defaultContent": ""},
	    {"title":"Note","class":"center","data": "note","defaultContent": ""},
	];
	$("#tableBom").DataTable({
		paiging:false,
		ordering:false,
		processing:true,
		searching: false,
		autoWidth:false,
		paginate:false,
		sScrollY: $(window).height()-260,
		scrollX: true,
		lengthChange:false,
		orderMulti:false,
		info:false,
		data:data,
		columns:columns
	});
}