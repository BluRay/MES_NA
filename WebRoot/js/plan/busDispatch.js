var pageSize=1;
var table;
var toolList;
var table_height = $(window).height()-340;
var busNoArray = new Array();
var planLeft;
$(document).ready(function () {	
	initPage();
	
	function initPage(){
		getBusNumberSelect('#nav-search-input');
		getBusNumberSelect('#busNo');
		getFactorySelect("plan/busDispatchPlan",'',"#search_factory",null,'id');
		getOrderNoSelect("#search_order_no","#orderId");
		$("#dispatchBtn").prop("disabled","disabled");
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
	
	$('#busNo').bind('keydown', function(event) {
		var errorFlag=false;
		if (event.keyCode == "13") {
			var busDispatchQty=$("#dispatchDetail tbody").find("tr").length;
			console.log("-->busDispatchQty = " + busDispatchQty + " ; planLeft = " + planLeft);
			if(busNoArray.indexOf($("#busNo").val()) < 0){
				if(busDispatchQty==planLeft){
					errorFlag=true;
				}else if (jQuery.trim($('#busNo').val()) != "") {
					$("#dispatchForm").css("display", "");
					ajaxGetBusInfo();// 获取车辆信息					
				}
				if(errorFlag){
					 setTimeout(function(){
						 alert("发车数量不能大于计划剩余数量！");
						 $("#busNo").val("").focus();
				        },0);
				}
				
			}else{
				setTimeout(function(){
					 alert("此车已经录入！");
					 $("#busNo").focus();
			        },0);
				return false;
			}
			
		}
		
	});
	
	$("#dispatchBtn").click(function(){
		$("#workcardid").val("");
		$("#receiver").val("");
		$("#workcardid").focus();
		var doDispatch=true;
		var trs=$("#dispatchDetail tbody tr");
		
		var tr_count = 0;
		$.each(trs,function(index,tr){
			tr_count ++;
			var number3c=$(tr).find("td").eq("4").find("input").val();
			if(number3c.trim().length==0){
				alert("请输入3C编号！");
				doDispatch=false;
				return false;
			}
		})
		if(tr_count == 0)doDispatch=false;
		if(doDispatch){
		$("#receiver").val();
		$("#dispatchModal").removeClass('hide').dialog({
			resizable: false,
			title: '<div class="widget-header"><h4 class="smaller"><i class="ace-icon fa fa-users green"></i> 请刷厂牌</h4></div>',
			title_html: true,
			width:'550px',
			modal: true,
			buttons: [{
						text: "取消",
						"class" : "btn btn-minier",
						click: function() {$( this ).dialog( "close" );} 
					},
					{
						text: "交接",
						id:"btn_ok",
						"class" : "btn btn-success btn-minier",
						click: function() {
							btnDispatchConfirm();
						} 
					}
				]
		});
		}
	});
	
	$("#dispatchCustomerBtn").click(function(){
		if($("#customerNoStart").val()==null || $("#customerNoStart").val()==''){
			alert('起始流水号不能为空！');
			return;
		}
		if($("#customerNoEnd").val()==null || $("#customerNoEnd").val()==''){
			alert('结束流水号不能为空！');
			return;
		}
		var start = parseInt($("#customerNoStart").val());
		var end = parseInt($("#customerNoEnd").val());
		if(start>end){
			alert('起始流水号不能大于结束流水号！');
			return;
		}
		var count = end-start+1;
		
		if(planLeft<count){
			alert('交接数量不能大于计划剩余数量 ！');
			return;
		}
		
		$("#kdForm").data("qtys",count);
		var KDNo = $("#dis_order_no_kd").val()+"-"+$("#customerNoStart").val()+"_"+$("#customerNoEnd").val();
		$("#kdForm").data("bus_number",KDNo);

		$("#receiverKD").val();
		$("#dispatchKDModal").removeClass('hide').dialog({
			resizable: false,
			title: '<div class="widget-header"><h4 class="smaller"><i class="ace-icon fa fa-users green"></i> 请刷厂牌</h4></div>',
			title_html: true,
			width:'550px',
			modal: true,
			buttons: [{
						text: "取消",
						"class" : "btn btn-minier",
						click: function() {$( this ).dialog( "close" );} 
					},
					{
						text: "交接",
						id:"btn_ok",
						"class" : "btn btn-success btn-minier",
						click: function() {
							btnDispatchKDConfirm();
						} 
					}
				]
		});
		
	});
	
	function btnDispatchKDConfirm(){
		if($("#receiverKD").val() == ""){
			alert("请先刷厂牌！");
			$("#workcardidKD").focus();
			return false;
		}
		if($("#receiver").val() == ""){
			alert("请先刷厂牌获取接收人信息！");
			$("#workcardid").focus();
			return false;
		}
		var qtys = parseInt($("#kdForm").data("qtys"));
		var plan_id = parseInt($("#kdForm").data("plan_id"));
		
		var plan_status="1";//发车中
		if(qtys==planLeft){
			plan_status="2";//已完成
		}
		if(confirm("确认交接？")){
			var cardNumber=$("#workcardidKD").val();
			var username=$("#receiverKD").val();
			var department=$("#departmentKD").val();
			var patch_plan_id=plan_id;

			$.ajax({
				url:"saveDispatchRecordKD",
				type: "post",
				dataType:"json",
				data:{
					"patch_plan_id":patch_plan_id,
					"plan_status":plan_status,
					"cardNumber":cardNumber,
					"username":username,
					'qtys':qtys||1,
					'bus_number':$("#kdForm").data("bus_number"),
				},
				success:function(response){
					$.gritter.add({
						title: '系统提示：',
						text: '<h5>操作成功！</h5>',
						class_name: 'gritter-info'
					});
					$("#dispatchKDModal").dialog( "close" );
					$("#dispatchBtn").prop("disabled","disabled");
					ajaxQuery();
				}
			});
			
		}
	}
	
	function btnDispatchConfirm(){
		if($("#workcardid").val() == ""){
			alert("请先刷厂牌！");
			$("#workcardid").focus();
			return false;
		}
		if($("#receiver").val() == ""){
			alert("请先刷厂牌获取接收人信息！");
			$("#workcardid").focus();
			return false;
		}
		var busDispatchQty=$("#dispatchDetail tbody").find("tr").length;
		var plan_status="1";//发车中
		if(busDispatchQty==planLeft){
			plan_status="2";//已完成
		}
		if(confirm("确认交接？")){
			var cardNumber=$("#workcardid").val();
			var username=$("#receiver").val();
			
			var trs=$("#dispatchDetail tbody").find("tr");
			form_str = "";
			$(trs).each(function(index,tr){
				var dispatch_plan_id=$("#dispatch_plan_id_"+index).val();
				var bus_number=$("#bus_number_"+index).val();
				var dispatcher_id = cardNumber;
				var receiver = username;
				var workcardid = cardNumber;
				var batch_desc = $("#batch_"+bus_number).val();
				var flag_3c = 0;
				var number_3c = $("#number_3c_"+index).val();
				var qtys = $("#qtys_"+index).val();
				form_str += dispatch_plan_id + "^" + bus_number + "^" + dispatcher_id + "^" + receiver + "^" + workcardid + "^" +
				batch_desc + "^" + flag_3c + "^" + number_3c + "^" + qtys + "|"
				
			});
			console.log(form_str);
			$.ajax({
				type : "get",
				dataType : "json",
				url : "saveDispatchRecord",
				data : {
					"form_str" : form_str,
					"plan_status":plan_status
				},
				success : function(response) {
					$.gritter.add({
						title: '系统提示：',
						text: '<h5>操作成功！</h5>',
						class_name: 'gritter-info'
					});
					$("#dispatchModal").dialog( "close" );
					$("#dispatchBtn").prop("disabled","disabled");
					$("#dispatchDetail tbody").html("");
					form_str = "";
					ajaxQuery();
				}
			});
			
		}
	}
	
	$("#workcardid").bind('keydown', function(event) {
		var cardId=$(this).val();
		//cardId=0;
		if (event.keyCode == "13") {
			var user=getUserInfoByCard(cardId);
			if(user==null){
				alert("不是该系统用户，请联系系统管理员！");
			}else{
				$("#workcardid").val(user.staff_number);
				$("#receiver").val(user.username);
				factory_id = user.factory_id;
			}
			return false;
		}
	});
	
	$("#workcardidKD").bind('keydown', function(event) {
		var cardId=$(this).val();
		//cardId=0;
		if (event.keyCode == "13") {
			var user=getUserInfoByCard(cardId);
			if(user==null){
				alert("不是该系统用户，请联系系统管理员！");
			}else{
				$("#workcardidKD").val(user.staff_number);
				$("#receiverKD").val(user.username);
				factory_id = user.factory_id;
			}
			return false;
		}
	});
	
	
});

function ajaxGetBusInfo() {
	var busDispatchQty=$("#dispatchDetail tbody").find("tr").length;
	var busNo = $("#busNo").val();
	var orderId=$("#busNoForm").data("order_id");
	$.ajax({
		type : "get",
		dataType : "json",
		url : "getBusInfo",
		data : {
			"busNo" : busNo,
			"orderId" : orderId
		},
		success : function(response) {
			var bus = response.data.busInfo;
			var trindex=$("#dispatchDetail").find("tr").length-1;
			console.log("-->trindex = " + trindex);
			console.log("-->factory_id = " + bus.factory_id + " " + $("#busNoForm").data("factory_id"));
			toolList = response.data.toolList;
			if(bus==null){
				alert("此车辆不属于该计划对应订单！");						
			}else if(bus.factory_id!=$("#busNoForm").data("factory_id")){
				alert("此车辆不属于当前工厂!");	
			}else if(bus.warehousing_date==""){
				alert("此车辆尚未入库！");	
			}else if(bus.dispatch_date!=""){
				alert("此车辆已于"+bus.dispatch_date+"发车！");	
			}else if($("#busNoForm").data("customer_number")=="有自编号"&&(
					bus.customer_number==null||bus.customer_number.trim().length==0
			)){
				alert("请完善该车辆客户自编号！");
			}else{
				var tr = $("<tr />");
				var busNumberInput = "<input style='border:0;width:100%;background-color:white;' name='dispatchRecordList["+trindex+"].bus_number' value='" + bus.bus_number + "' readonly/>";
				$("<td style='width:150px' />").html(busNumberInput).appendTo(tr);
				$("<td />").html(bus.vin).appendTo(tr);
				$("<td />").html(bus.left_motor_number + "/"+ bus.right_motor_number).appendTo(tr);
				$("<td />").html(bus.customer_number).appendTo(tr);
				$("<td />").html("<input style='border:1;width:100%;background-color:white;height:30px' class='3c_number' id='number_3c_"+trindex+"' name='dispatchRecordList["+trindex+"].number_3c' />").appendTo(tr);
				$("<td />").html("<textarea rows=1 id='batch_"+ bus.bus_number+ "'style='border:0;width:100%;' name='dispatchRecordList["+trindex+"].batch_desc' class='batchDesc' onclick='showBatchDesc(\""+busNo+"\",\""+bus.bus_number+"\")'>").appendTo(tr);
				$("<td />").html("<i name='edit' class=\"fa fa-times\" onclick='remove_tr(this)' style=\"cursor: pointer\" ></i>").appendTo(tr);
				$("<input type='hidden' id='dispatch_plan_id_"+trindex+"' value='"+ $("#busNoForm").data("plan_id") + "'>").appendTo(tr);
				$("<input type='hidden' id='qtys_"+trindex+"' name='dispatchRecordList["+trindex+"].qtys' value='1'>").appendTo(tr);
				$("<input type='hidden' name='dispatchRecordList["+trindex+"].receiver' class='receiver'>").appendTo(tr);
				$("<input type='hidden' name='dispatchRecordList["+trindex+"].workcardid' class='workcardid'>").appendTo(tr);
				$("<input type='hidden' name='dispatchRecordList["+trindex+"].department' class='department'>").appendTo(tr);
				$("<input type='hidden' id='bus_number_"+trindex+"' value='"+bus.bus_number+"' class='department'>").appendTo(tr);
		
				$(tr).data("busNo",bus.bus_number);
				$("#dispatchDetail tbody").append(tr);
				busNoArray.push($("#busNo").val());
				$("#busNo").val("");

				$("#dispatchBtn").prop("disabled","");
			}
			
		}
	});
}

function remove_tr(obj){
	console.log("-->busNo = " + $(obj).parent().parent().data("busNo"));
	busNoArray.remove($(obj).parent().parent().data("busNo"));
	$(obj).parent().parent().remove();
}
//删除一行交接数据
Array.prototype.remove = function(val) {  
    var index = this.indexOf(val);  
    if (index > -1) {  
        this.splice(index, 1);  
    }  
}; 

function showBatchDesc(busno,bus_number){
	$("#patchModal").data("batchid", "batch_" + bus_number);
	$("#patchModal").data("busno", busno);
	console.log(busno + " " + "batch_" + bus_number);
	generateCheckList(toolList);
	$("#patchModal").removeClass('hide').dialog({
		resizable: false,
		title: '<div class="widget-header"><h4 class="smaller"><i class="ace-icon fa fa-check-square-o green"></i> 单车随车资料</h4></div>',
		title_html: true,
		width:'550px',
		modal: true,
		buttons: [{
					text: "取消",
					"class" : "btn btn-minier",
					click: function() {$( this ).dialog( "close" );} 
				},
				{
					text: "确认",
					id:"btn_ok",
					"class" : "btn btn-success btn-minier",
					click: function() {
						btnConfirm();
					} 
				}
			]
	});
	
};

function btnConfirm(){
	var batchid = $("#patchModal").data("batchid");
	var busno=$("#patchModal").data("busno");
	var toolListStr = "";
	var flag3c = '0';
	$('input[name="tool_checkbox"]:checked').each(function() {
		var toolNameEle=$(this).next();
		var toolname;
		if($(toolNameEle).is('span')){
			toolname = $(toolNameEle).html();
		}else{
			toolname = $(toolNameEle).val();
		}
		var index = ($(this).attr("id").split("_"))[1];
		
		var toolqty = $("#toolqty_" + index).val();
		var unit=$("#toolqty_" + index).next().html();
		if(toolname!=''||toolname.trim().length>0){
			toolListStr += toolname + ":" + toolqty + unit+",";
		}			
		if (toolname == '3C认证标贴') {
			flag3c = '1';
		}
	});
	
	toolListStr = toolListStr.substring(0, toolListStr.length - 1);
	// alert(toolListStr);
	$("#" + batchid).val(toolListStr);//设置附件明细
	$("#flag3c_"+busno).val(flag3c);//设置3C认证标贴flag
	$("#patchModal").dialog( "close" );
	
}

//生成随车附件选项表格
function generateCheckList(toolList) {
	$("#toollist").html("");
	var i = 0;
	var tr;
	$.each(toolList,function(index, value) {
		var tool = value;
		var checked="true";
		if(tool.checked=='false'){
			checked="false";
		}
		if (i % 3 == 0) {
			tr = $("<tr />");
		}
		var lableStr="<label class='checkbox'><input id='toolname_";
		lableStr+=i+"' name=\"tool_checkbox\" type=\"checkbox\" ";
		lableStr+=" onclick=\"checkTools("+i+")\"";
		if(tool.checked!='false'){
			lableStr+=" checked="+checked;
		}
		lableStr+=" ><span>"+tool.name + "</span></label>";
		$("<td style='width:150px'/>").html(lableStr).appendTo(tr);
		$("<td />").html("<input id='toolqty_" + i + "' style=\"width:30px;height:25px;text-align:center\" class='toolqty' value='" + tool.quantity + "'><span>"+tool.unit+"</span>").appendTo(tr);
		i++;
		$("#toollist").append(tr);
	});
	
}

function checkTools(toolIndex){
	if($("#toolname_"+toolIndex).attr("checked")=='undefined'||$("#toolname_"+toolIndex).attr("checked")){
		toolList[toolIndex].checked='true';
	}else{
		toolList[toolIndex].checked='false';
	}
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
				"bustype":'',
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
		                    return "<i class=\"fa fa-cogs bigger-130 showbus\" title=\"发车\" onclick='fun_dispatch("+ (row['plan_dispatch_qty']-row['plan_done_qty']) +","+row['id']+","+row['order_id']+","+row['customer_number_flag']+","+row['factory_id']+",\""+row['order_no']+"\")' style='color:blue;cursor: pointer;'></i>&nbsp;&nbsp;";
		                },
		            }
		          ],
	});
}

function fun_dispatch(planLeftqty,planId,orderId,customer_number_flag,factory_id,order_no){
	console.log("-->planLeft = " + planLeftqty + " ; planId = " + planId + " ; orderId = " + orderId + " ; factory_id = " + factory_id);
	planLeft=planLeftqty;
	$.ajax({
		url: "../order/showOrderDetailList",
		dataType: "json",
		data: {"order_id" : orderId},
		async: false,
		error: function () {alertError();},
		success: function (response) {
			$("#dispatchDetail tbody").html("");
			busNoArray.length = 0;
			$("#dialog-dispatch").removeClass('hide').dialog({
				resizable: false,
				title: '<div class="widget-header"><h4 class="smaller"><i class="ace-icon fa fa-users green"></i> 发车</h4></div>',
				title_html: true,
				width:'550px',
				modal: true,
				buttons: [{
							text: "取消",
							"class" : "btn btn-minier",
							click: function() {$( this ).dialog( "close" );} 
						},
						{
							text: "发车",
							id:"btn_ok",
							"class" : "btn btn-success btn-minier",
							click: function() {
								btnEditConfirm(id);
							} 
						}
					]
			});
			
			
			
			$.each(response.data,function(index,value){
				if(index == 0){
					if(value.order_type=='KD件'){
						$("#busNoForm").css("display", "none");
						$("#kdForm").css("display", "");
						$("#kdForm").data("plan_id", planId);
						$("#kdForm").data("order_id", orderId);
						$("#kdForm").data("customer_number",customer_number_flag);
						$("#kdForm").data("factory_id",factory_id);
						$("#dis_order_no_kd").val(order_no);
						//$("#customerType").val(value.bus_type);
						//$("#customerCode").val(value.order_code);
						
					}else{
						$("#kdForm").css("display", "none");
						$("#busNoForm").css("display", "");
						$("#busNoForm").data("plan_id", planId);
						$("#busNoForm").data("order_id", orderId);
						$("#busNoForm").data("customer_number",customer_number_flag);
						$("#busNoForm").data("factory_id",factory_id);
						$("#dis_order_no").val(order_no);
					}
				}
				
			});
		}
	});
}

function close_form(){
	$("#busNoForm").css("display", "none");
}
function close_form_kd(){
	$("#kdForm").css("display", "none");
}

