var pageSize=1;
var table;
var select_str = "";
var select_str1 = "";
var select_str2 = "";
var cur_year="";
var dt;

$(document).ready(function(){
	getBusNumberSelect('#nav-search-input');
	cur_year = new Date().getFullYear();
	$("#search_productive_year").val(cur_year);
	getOrderNoSelect("#search_order_no","#orderId");
	getFactorySelect();
	getBusType();
	ajaxQuery();
	
	$(".btnQuery").on("click",function(){
		ajaxQuery();
	}); 

	$(document).on("change","#newSearchName",function(e){
		$("#newProjectName").val("");
		var search_name=$(this).val();
		var bus_type=$("#new_bus_type :selected").text();
		if(search_name.trim().length>0&&bus_type.trim().length>0){
			$("#newProjectName").val(bus_type+"-"+search_name);
		}
	})
	
	$(document).on("change","#new_bus_type",function(e){
		$("#newProjectName").val("");
		var search_name=$("#newSearchName").val();
		var bus_type=$("#new_bus_type :selected").text();
		if(search_name.trim().length>0&&bus_type.trim().length>0){
			$("#newProjectName").val(bus_type+"-"+search_name);
		}
	})
	
	$(document).on("change","#edit_quantity",function(e){
		var project_id=$("#dialog-order_edit").data("project_id");
		var new_value=Number($(this).val());
		if(isNaN(new_value)){
			$(e.target).val("");
			alert("Please enter a number for the Quantity!");
			return false;
		}
		var old_value=Number($("#edit_quantity").data("old_value"));
		//如果数量减少，获取订单下在制车辆数，减少数量不能超出剩余未生产车辆数
		if(new_value<old_value){	
			var num_in_process=getBusNumInProcess(project_id)||0;
			if(new_value<num_in_process){
				$(e.target).val("");
				alert("已经有"+num_in_process+"台车在生产中，项目数量不能小于该数量！");
			}
		}
	});
	
	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/MES/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})
	
	$(document).on("click","#btnAdd",function(){
		$("#project_new").clearForm();
		var dialog = $( "#dialog-order_new" ).removeClass('hide').dialog({
			width:550,
			height:530,
			modal: true,
			title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i>&nbsp;Add Project</h4></div>",
			title_html: true,
			buttons: [ 
				{
					text: "Cancel",
					"class" : "btn btn-minier",
					click: function() {
						$( this ).dialog( "close" ); 
					} 
				},
				{
					text: "Save",
					"class" : "btn btn-primary btn-minier",
					click: function() {
						ajaxAdd();
						//$( this ).dialog( "close" ); 
					} 
				}
			]
		});
	});
	

});


function ajaxQuery(){
	//alert("调用");
	dt=$("#tableOrder").DataTable({
		serverSide: true,
		fixedColumns:   {
            leftColumns: 2,
            rightColumns:1
        },
		dom: 'Bfrtip',
		lengthMenu: [
		             [ 20, 30, 50, -1 ],
		             [ 'Show 20 rows', 'Show 30 rows', 'Show 50 rows', 'Show all rows' ]
		         ],
	    buttons: [
	        {extend:'excelHtml5',title:'data_export',className:'black',text:'<i class=\"fa fa-file-excel-o bigger-130\" tooltip=\"导出excel\"></i>'},
	        {extend:'pageLength',/*text:'显示行'*/}
	       
	    ],
        rowsGroup:[0,1,2,3,4,5],
		paiging:true,
		ordering:false,
		searching: false,
		autoWidth:false,
		destroy: true,
		scrollY: $(window).height()-240,
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
				"orderNo":$("#search_order_no").val(),
				"orderName":$("#search_order_name").val(),
				"actYear":$("#search_productive_year").val(),
				"factory":getAllFromOptions("#search_factory","id"),
				"orderStatus":$("#search_order_status").val(),	
				"orderColumn":"project_no"
			};
            param.length = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;//开始的记录序号
            param.page = (data.start / data.length)+1;//当前页码

            $.ajax({
                type: "post",
                url: "showOrderList",
                cache: true,  //禁用缓存
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
                    //console.log(returnData);
                    //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                    //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                 // settings.rowsGroup=[0,1,2,3,4,5];
                   //alert("分页调用");
                    callback(returnData);
                    var head_width=$(".dataTables_scrollHead").width();
                    //alert(head_width)
                    $(".dataTables_scrollHead").css("width",head_width-20);
                }
            });
		
		},
		columns: [
		            {"title":"Project No.","class":"center","data":"project_no",/*"render": function ( data, type, row ) {
	                    return "<input style='border:0;width:100%;height:100%;background-color:transparent;text-align:center;' value='"+data+"' />";
	                },*/"defaultContent": ""},
		            {"title":"Project Name","class":"center","data":"project_name","defaultContent": ""},
		            {"title":"Customer","class":"center","data":"customer","defaultContent": ""},
		            {"title":"Project Date","class":"center","data":"project_date","defaultContent": ""},
		            {"title":"Delivery Date","class":"center","data":"delivery_date","defaultContent": ""},
		            {"title":"Quantity","class":"center","data":"quantity","defaultContent": ""},
		            {"title":"Plant","class":"center","data": "production_plant","defaultContent": ""},
		            {"title":"Status","class":"center","data":"project_status","defaultContent": "","render":function(data,type,row){
		            	return data=="1"?"Created":(data=="2"?"In Process":"Completed");
		            }},		            
		            {"title":"Sales Manager","class":"center","data":"sales_manager","defaultContent": ""},		            
		            {"title":"Project Manager","class":"center","data": "project_manager","defaultContent": ""},
		            {"title":"Editor","class":"center","data":"editor","defaultContent":""},
		            {"title":"Edit Date","class":"center","data":"edit_date","defaultContent": ""},
		            {"title":"","class":"center","data":null,"render":function(data,type,row){
		            	return "<i title='Change' class=\"ace-icon fa fa-pencil bigger-130 editorder\" onclick = 'ajaxEdit(" + JSON.stringify(row)+ ");' style='color:green;cursor: pointer;'></i>"},
		            	"defaultContent": "<i class=\"ace-icon fa fa-pencil bigger-130 editorder\" style='color:green;cursor: pointer;'></i>"}
		          ],
		
	});

	$("#tableOrder_info").addClass('col-xs-6');
	$("#tableOrder_paginate").addClass('col-xs-6');
	$(".dt-buttons").css("margin-top","-50px").find("a").css("border","0px");
}
function setInput(value){
	var input="<input type='text' value='"+value+"' />";
	return input;
} 

function getFactorySelect() {
	$.ajax({
		url : "/MES/common/getFactorySelectAuth",
		dataType : "json",
		data : {"function_url":"order/maintain"},
		async : false,
		error : function(response) {
			alert(response.message)
		},
		success : function(response) {
			getSelects(response.data, "", "#search_factory","All");
			getSelects_noall(response.data, "", "#new_plant");
			getSelects_noall(response.data, "", "#edit_plant");
			
		}
	});
}

function getBusType(){
	$.ajax({
		url: "/MES/common/getBusType",
		dataType: "json",
		data: {},
		async: false,
		error: function () {alertError();},
		success: function (response) {
			options = $.templates("#tmplBusTypeSelect").render(response.data);
			$(".busType").append(options);
		}
	})
}

function getBusNumInProcess(project_id){
	var bus_num=0;
	$.ajax({
		url: "/MES/project/getBusInProcess",
		dataType: "json",
		data: {"project_id" : project_id},
		async: false,
		error: function () {alertError();},
		success: function (response) {
			bus_num= Number(response.data.num_in_process);
			if(isNaN(bus_num)){
				bus_num=0;
			}
		}
	})
	return bus_num;	
}


function ajaxEditConfirm (argument){
	//数据验证
	if($("#edit_project_date").val().trim().length==0){
		alert('Please enter the Project Date!');
		return false;
	}
	if(isNaN($("#edit_quantity").val())){
		alert('Please enter a number for Quantity！');
		return false;
	}
	if($("#edit_quantity").val()==0){
		alert('项目数量必须大于0！');
		return false;
	}
	if($("#edit_delivery_date").val().trim().length==0){
		alert('Please enter the Delivery Date!');
		return false;
	}
	if($("#edit_plant :selected").text().trim().length==0){
		alert('Please select the Production Plant!');
		return false;
	}
	$("#btnEditConfirm").attr("disabled","disabled");

	$.ajax({
		type: "get",
		dataType: "json",
		url: "/MES/project/editOrder",
	    data: {
			"project_id":$("#dialog-order_edit").data("project_id"),
			//"customer":$("#editCustomer").val(),
			//"search_name":$("#editSearchName").val(),
			//"bus_type":$("#edit_bus_type :selected").text(),
			"delivery_date":$("#edit_delivery_date").val(),
			"project_name":$("#editProjectName").val(),
			"project_date":$('#edit_project_date').val(),
			"quantity":$("#edit_quantity").val(),
			"production_plant_id":$("#edit_plant").val(),
			"sales_manager":$("#edit_sales_manager").val(),
			"project_manager":$("#edit_project_manager").val()
		},
		async: false,
	    success:function (response) {
	    	$("#btnEditConfirm").removeAttr("disabled");
	    	alert(response.message)
    		$( "#dialog-order_edit" ).dialog( "close" );
    		ajaxQuery();
	     
	    },
	    error:function(){alertError();$("#btnEditConfirm").removeAttr("disabled");}
	});
	
}

function ajaxAdd (argument) {
	//数据验证
	if($("#newSearchName").val().trim().length==0){
		alert('Please enter the Search Name!');
		return false;
	}
	if($("#new_bus_type :selected").text().trim().length==0){
		alert('Please select the Bus Type!');
		return false;
	}
	if($("#new_project_date").val().trim().length==0){
		alert('Please enter the Project Date!');
		return false;
	}
	if(isNaN($("#new_quantity").val())){
		alert('Please enter a number for Quantity！');
		$("#btnAddConfirm").removeAttr("disabled");
		return false;
	}
	if($("#new_quantity").val()==0){
		alert('项目数量必须大于0！');
		$("#btnAddConfirm").removeAttr("disabled");
		return false;
	}
	if($("#new_delivery_date").val().trim().length==0){
		alert('Please enter the Delivery Date!');
		return false;
	}
	if($("#new_plant :selected").text().trim().length==0){
		alert('Please select the Production Plant!');
		return false;
	}

	$("#btnAddConfirm").attr("disabled","disabled");

	$.ajax({
		type: "get",
		dataType: "json",
		url: "/MES/project/addOrder",
	    data: {
			"project_name":$("#newProjectName").val(),
			"project_date":$("#new_project_date").val(),
			"bus_type":$("#new_bus_type :selected").text(),
			"quantity":$("#new_quantity").val(),
			"project_date":$("#new_project_date").val(),
			"delivery_date":$("#new_delivery_date").val(),
			"customer":$("#newCustomer").val(),
			"search_name":$("#newSearchName").val(),
			"search_name":$("#newSearchName").val(),
			"production_plant":$("#new_plant :selected").text(),
			"production_plant_id":$("#new_plant").val(),
			"sales_manager":$("#new_sales_manager").val(),
			"project_manager":$("#new_project_manager").val(),
			"project_status":'1',
		},
		async: false,
	    success:function (response) {
	    	
	    	if (response.success) {
	    		$( "#dialog-order_new" ).dialog( "close" ); 
	    		ajaxQuery();
	    	} else {
	    		alert(response.message);
	    	}
	    },
	    error:function(){alertError();}
	});
	
}

function ajaxEdit(row){
	$("#dialog-order_edit").data("project_id",row.id);				
	//填充订单基本信息
	$("#editCustomer").val(row.customer);
	$("#editSearchName").val(row.search_name);
	$("#edit_project_date").val(row.project_date);
	select_selectOption("#edit_bus_type",row.bus_type);
	$("#editProjectName").val(row.project_name);
	$("#edit_quantity").val(row.quantity);
	$("#edit_quantity").data("old_value",row.quantity);
	$("#edit_delivery_date").val(row.delivery_date);
	select_selectOption("#edit_plant",row.production_plant);						
	$("#edit_sales_manager").val(row.sales_manager);
	$("#edit_project_manager").val(row.project_manager);
	
	var dialog = $( "#dialog-order_edit" ).removeClass('hide').dialog({
		width:550,
		height:530,
		modal: true,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i> Change Project</h4></div>",
		title_html: true,
		buttons: [ 
			{
				text: "Cancel",
				"class" : "btn btn-minier",
				click: function() {
					$( this ).dialog( "close" ); 
				} 
			},
			{
				text: "Save",
				"class" : "btn btn-primary btn-minier",
				click: function() {
					ajaxEditConfirm();
				} 
			}
		]
	});
}

function ajaxShowBusNumber(order_id,factory_id){
	$.ajax({
		url: "/BMS/order/showBusNumber",
		dataType: "json",
		data: {"order_id" : order_id,"factory_id":factory_id},
		async: false,
		error: function () {alertError();},
		success: function (response) {
			if(response.success){
				$("#tableBusNumber tbody").html("");
	    		
				drawBusInfoTable(response.data)
			} else {
				alert(response.message);
			}
			var dialog = $( "#dialog-message" ).removeClass('hide').dialog({
				width:1000,
				height:500,
				modal: true,
				title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i> 车辆明细</h4></div>",
				title_html: true,
				buttons: [ 
					{
						text: "取消",
						"class" : "btn btn-minier",
						click: function() {
							$( this ).dialog( "close" ); 
						} 
					},
					{
						text: "确定",
						"class" : "btn btn-primary btn-minier",
						click: function() {
							$( this ).dialog( "close" ); 
						} 
					}
				]
			});
		}
	})
}

function drawBusInfoTable(data){

	var t=$("#tableBusNumber").dataTable({
		paiging:false,
		showRowNumber:true,
		ordering:false,
		searching: false,
		autoWidth:false,
		destroy: true,
		paginate:false,
		fixedColumns: {
            leftColumns:1,
        },
/*		sScrollY: $("#dialog-message").height()-30,
		scrollX: true,*/
/*		createdRow: function ( row, data, index ) {
			//alert(index)
			 $('td', row).	eq(1).find("input").data("allot_config_id",data.allot_config_id||0);
			 $('td', row).	eq(1).find("input").data("order_config_id",data.order_config_id);
        },*/
		scrollCollapse: false,
		lengthChange:false,
		orderMulti:false,
		info:false,
		language: {
			emptyTable:"",					     
			infoEmpty:"",
			zeroRecords:"未查询到车辆信息！"
		},
		data:data,
		columns: [
		            {"title":"车号","class":"center","data":"bus_number","defaultContent": ""},
		            {"title":"VIN","class":"center","data":"vin","defaultContent": ""},
		            {"title":"生产工厂","class":"center","data":"factory_name","defaultContent": ""},
		            {"title":"当前车间","class":"center","data":"workshop","defaultContent": ""},
		            {"title":"当前工序","class":"center","data":"process_name","defaultContent": ""},
		            {"title":"焊装上线","class":"center","data":"welding_online_date","defaultContent": ""},
		            {"title":"焊装下线","class":"center","data":"welding_offline_date","defaultContent": ""},
		            {"title":"涂装上线","class":"center","data":"painting_online_date","defaultContent": ""},
		            {"title":"涂装下线","class":"center","data":"painting_offline_date","defaultContent": ""},
		            {"title":"底盘上线","class":"center","data":"chassis_online_date","defaultContent": ""},
		            {"title":"底盘下线","class":"center","data":"chassis_offline_date","defaultContent": ""},
		            {"title":"总装上线","class":"center","data":"assembly_online_date","defaultContent": ""},
		            {"title":"总装下线","class":"center","data":"assembly_offline_date","defaultContent": ""},
		            {"title":"入库","class":"center","data":"warehousing_date","defaultContent": ""},
		            {"title":"发车","class":"center","data":"dispatch_date","defaultContent": ""}
		          ]	      
	});
}