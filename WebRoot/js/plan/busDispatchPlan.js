var pageSize=1;
var table;
var table_height = $(window).height()-240;
$(document).ready(function () {	
	initPage();
	
	function initPage(){
		getBusNumberSelect('#nav-search-input');
		getFactorySelect("plan/busDispatchPlan",'',"#search_factory",null,'id');
		getFactorySelect("plan/busDispatchPlan",'',"#edit_factory",null,'id');
		getOrderNoSelect("#edit_order_no","#edit_orderId",orderNoBackEdit);
		getOrderNoSelect("#search_order_no","#orderId");
		getBusType();
		ajaxQuery();
	}

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/BMS/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})
	
	$("#btnQuery").on('click', function(e) {	
		ajaxQuery();
	});
	
	$("#btnAdd").on('click', function(e) {
		getFactorySelect("plan/busDispatchPlan",'',"#new_factory",null,'id');
		getOrderNoSelect("#new_order_no","#new_orderId",orderNoBack);
		e.preventDefault();
		$("#dialog-add").removeClass('hide').dialog({
			resizable: false,
			title: '<div class="widget-header"><h4 class="smaller"><i class="ace-icon fa fa-users green"></i> 增加发车计划</h4></div>',
			title_html: true,
			width:'550px',
			modal: true,
			buttons: [{
						text: "取消",
						"class" : "btn btn-minier",
						click: function() {$( this ).dialog( "close" );} 
					},
					{
						text: "增加",
						id:"btn_ok",
						"class" : "btn btn-success btn-minier",
						click: function() {
							btnNewConfirm();
						} 
					}
				]
		});
	});
	
});

//订单编号选中回调函数
function orderNoBack(obj){
	s_orderName=obj.name;
	s_busType=obj.busType;
	s_orderQty=obj.orderQty;
	s_orderId=obj.id;
	console.log("-->s_orderName = " + s_orderName);
	
	$.ajax({
		url: "getOrderDispatchQty",
		dataType: "json",
		data: {
			"order_id" : s_orderId
		},
		async: false,
		error: function () {alertError();},
		success: function (response) {
			$("#new_order_qty").html(s_orderQty+ " 辆");
			$("#new_plan_done_qty").html(response.message + " 辆");
			$("#new_plan_left_qty").html(((s_orderQty-response.message) + " 辆"));
		}
	});
	
}
function orderNoBackEdit(obj){
	s_orderName=obj.name;
	s_busType=obj.busType;
	s_orderQty=obj.orderQty;
	s_orderId=obj.id;
	console.log("-->s_orderName = " + s_orderName);
	
	$.ajax({
		url: "getOrderDispatchQty",
		dataType: "json",
		data: {
			"order_id" : s_orderId
		},
		async: false,
		error: function () {alertError();},
		success: function (response) {
			$("#edit_order_qty").html(s_orderQty+ " 辆");
			$("#edit_plan_done_qty").html(response.message + " 辆");
			$("#edit_plan_left_qty").html(((s_orderQty-response.message) + " 辆"));
		}
	});
	
}

function btnNewConfirm(){
	var mailTo=$("#new_mail_addr").val();
	if($("#new_order_no").val()==""){
		alert("请输入订单号！");
		return false;
	}
	if($("#new_plan_num").val()==""){
		alert("请输入发车数量！");
		return false;
	}
	if($("#new_plan_date").val()==""){
		alert("请输入发车日期！");
		return false;
	}
	var plan_left_qty=$("#new_plan_left_qty").html();
	var planNum=$("#new_plan_num").val();
	plan_left_qty=plan_left_qty.substring(0,plan_left_qty.length-1);
	if(parseInt(planNum)>parseInt(plan_left_qty)){
		alert("计划发车数量不能大于剩余数量");
		return false;
	}
	var error_mail=validateEmail(mailTo.split(";"));
	if(error_mail.trim().length>0){
		alert("收件人中"+error_mail+"不是有效邮箱地址！")
		return false;
	}
	
	$.ajax({
		url: "addDispatchPlan",
		dataType: "json",
		data: {
			"factory_id" : $('#new_factory').val(),
			"order_no" : $('#new_order_no').val(),
			"plan_dispatch_qty" : $('#new_plan_num').val(),
			"dispatch_date" : $('#new_plan_date').val(),
			"customer_number_flag" : $('#new_customer_number_flag').val(),
			"email_addrs" : $('#new_mail_addr').val(),
		},
		async: false,
		error: function () {alertError();},
		success: function (response) {
			$.gritter.add({
				title: '系统提示：',
				text: '<h5>增加成功！</h5>',
				class_name: 'gritter-info'
			});
		}
	});

	$("#dialog-add").dialog( "close" );
	ajaxQuery();
	
}

function ajaxQuery(){
	$("#tableData").dataTable({
		serverSide: true,paiging:true,ordering:false,searching: false,bAutoWidth:false,
		destroy: true,sScrollY: table_height,scrollX: "100%",orderMulti:false,
		pageLength: 25,pagingType:"full_numbers",lengthChange:false,
		language: {
			emptyTable:"抱歉，未查询到数据！",
			info:"共计 _TOTAL_ 条，当前第 _PAGE_ 页 共 _PAGES_ 页",
			infoEmpty:"",
			paginate: { first:"首页",previous: "上一页",next:"下一页",last:"尾页",loadingRecords: "请稍等,加载中..."}
		},
		ajax:function (data, callback, settings) {
			var param ={
				"draw":1,
				"factory":$("#search_factory").val(),
				"bustype":$("#search_bustype").val(),
				"order_no":$("#search_order_no").val(),
				"start_date":$("#start_date").val(),
				"end_date":$("#end_date").val(),
				"orderColumn":"id"
			};
            param.length = data.length;					//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;					//开始的记录序号
            param.page = (data.start / data.length)+1;	//当前页码

            $.ajax({
                type: "post",
                url: "getDispatchPlanList",
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
		            {"title":"生产订单","class":"center","data":"order_no","defaultContent": ""},	            
		            {"title":"生产工厂","class":"center","data":"factory_name","defaultContent": ""},	
		            {"title":"车辆型号","class":"center","data":"bus_type_code","defaultContent": ""},
		            {"title":"订单数量","class":"center","data":"order_qty","defaultContent": ""},
		            {"title":"计划发车数量","class":"center","data": "plan_dispatch_qty","defaultContent": ""},
		            {"title":"计划发车日期","class":"center","data":"dispatch_date","defaultContent": ""},		            
		            {"title":"已发车数量","class":"center","data": "plan_done_qty","defaultContent": "-"},                  
		            {"title":"剩余数量","class":"center","data": "plan_done_qty","defaultContent": "-",
		            	"render":function(data,type,row){
		            		return row['plan_dispatch_qty']-row['plan_done_qty'];
		            	},       
		            },
		            {"title":"有无自编号","class":"center","data": "customer_number_flag","defaultContent": "","render":function(data,type,row){
		            	return data=="1"?"无自编号":"有自编号"}}, 
		            {"title":"状态","class":"center","data": "status","defaultContent": "","render":function(data,type,row){
		            	var status = "";//0 已计划 1发车中 2已完成 3 已删除
		            	if (data == "0")status = "已计划";
		            	if (data == "1")status = "发车中";
		            	if (data == "2")status = "已完成";
		            	if (data == "3")status = "已删除";
		            	return status;
		            		}}, 
		            {"title":"操作","class":"center","data": null,"id":"staff_number",
		            	"render": function ( data, type, row ) {
		                    return "<i class=\"glyphicon glyphicon-edit bigger-130 showbus\" title=\"编辑\" onclick='edit(" + row['id'] + 
		                    ")' style='color:blue;cursor: pointer;'></i>&nbsp;&nbsp;";
		                },
		            }
		          ],
	});
}

function edit(id){
	$("#dialog-edit").removeClass('hide').dialog({
		resizable: false,
		title: '<div class="widget-header"><h4 class="smaller"><i class="ace-icon fa fa-users green"></i> 编辑发车计划</h4></div>',
		title_html: true,
		width:'550px',
		modal: true,
		buttons: [{
					text: "取消",
					"class" : "btn btn-minier",
					click: function() {$( this ).dialog( "close" );} 
				},
				{
					text: "保存",
					id:"btn_ok",
					"class" : "btn btn-success btn-minier",
					click: function() {
						btnEditConfirm(id);
					} 
				}
			]
	});
	
	$.ajax({
		url : "getDispatchPlanList",
		dataType : "json",
		data : {"id":id},
		async : false,
		error : function(response) {
			alert(response.message)
		},
		success : function(response) {
			$.each(response.data,function(index,value){
				if(index == 0){
					$("#edit_factory").val(value.factory_id);
					$("#edit_order_no").val(value.order_no);
					$("#edit_plan_num").val(value.plan_dispatch_qty);
					$("#edit_plan_date").val(value.dispatch_date);
					$("#edit_customer_number_flag").val(value.customer_number_flag);
					$("#edit_mail_addr").val(value.email_addrs);
					
					$.ajax({
						url: "getOrderDispatchQty",
						dataType: "json",
						data: {
							"order_id" : value.order_id
						},
						async: false,
						error: function () {alertError();},
						success: function (response2) {
							$("#edit_order_qty").html(value.order_qty+ " 辆");
							$("#edit_plan_done_qty").html(response2.message + " 辆");
							$("#edit_plan_left_qty").html(((value.order_qty-response2.message) + " 辆"));
						}
					});
					
				}
			});
		}
	});
	
}

function btnEditConfirm(id){
	var mailTo=$("#edit_mail_addr").val();
	if($("#edit_order_no").val()==""){
		alert("请输入订单号！");
		return false;
	}
	if($("#edit_plan_num").val()==""){
		alert("请输入发车数量！");
		return false;
	}
	if($("#edit_plan_date").val()==""){
		alert("请输入发车日期！");
		return false;
	}
	var plan_left_qty=$("#edit_plan_left_qty").html();
	var planNum=$("#edit_plan_num").val();
	plan_left_qty=plan_left_qty.substring(0,plan_left_qty.length-1);
	if(parseInt(planNum)>parseInt(plan_left_qty)){
		alert("计划发车数量不能大于剩余数量");
		return false;
	}
	var error_mail=validateEmail(mailTo.split(";"));
	if(error_mail.trim().length>0){
		alert("收件人中"+error_mail+"不是有效邮箱地址！")
		return false;
	}
	
	$.ajax({
		url: "editDispatchPlan",
		dataType: "json",
		data: {
			"id" : id,
			"factory_id" : $('#edit_factory').val(),
			"order_no" : $('#edit_order_no').val(),
			"plan_dispatch_qty" : $('#edit_plan_num').val(),
			"dispatch_date" : $('#edit_plan_date').val(),
			"customer_number_flag" : $('#edit_customer_number_flag').val(),
			"email_addrs" : $('#edit_mail_addr').val(),
		},
		async: false,
		error: function () {alertError();},
		success: function (response) {
			$.gritter.add({
				title: '系统提示：',
				text: '<h5>编辑成功！</h5>',
				class_name: 'gritter-info'
			});
			$("#dialog-edit").dialog( "close" );
			ajaxQuery();
		}
	});

	
}

function validateEmail(maillist){
	var mailaddr="";
	$.each(maillist,function(i,mail){
		if(!const_email_validate.test(mail)){
			mailaddr=mail;
			return false;
		}
	});
	return mailaddr;
}

function getBusType(){
	$("#search_bustype").empty();
	$.ajax({
		url: "../common/getBusType",
		dataType: "json",
		data: {},
		async: false,
		error: function () {alertError();},
		success: function (response) {
			var strs = "<option value=''>全部</option>";
		    $.each(response.data, function(index, value) {
		    	strs += "<option value=" + value.code + ">" + value.name + "</option>";
		    });
		    $("#search_bustype").append(strs);
		}
	})
}