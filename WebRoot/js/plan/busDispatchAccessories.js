var orderQty = 0;//订单数量
var form_str = "";
var factory_id = 0;
$(document).ready(function () {	
	initPage();
	
	function initPage(){
		getBusNumberSelect('#nav-search-input');
		getOrderNoSelect("#orderNo","#orderId",function(obj){
			$("#orderName").html(obj.name);
			$("#busType").html(obj.busType);
			$("#orderQty").html(obj.orderQty+"辆");
			orderQty=obj.orderQty;
			$("#dispatchDetail tbody").html("");
			$("#dipatchRecord tbody").html("");
		});

		$("#querydisBtn").prop("disabled","disabled"); 
		$("#dispatchBtn").prop("disabled","disabled"); 
	}

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/BMS/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})
	
	//点击查询，查询订单附件信息
	$("#queryBtn").click(function(){
		ajaxQueryOrderTool($("#orderNo").val());
	});
	
	$("#querydisBtn").click(function(){
		ajaxQueryOrderTool($("#orderNo").val());
	});
	
	//点击确认交接
	$("#dispatchBtn").click(function(){
		var show_flag=true;
		var trs=$("#dispatchDetail tbody").find("tr");
		form_str = "";
		$(trs).each(function(index,tr){
			var tool_name=$("#toolName_"+index).val();
			var single_use=$("#singleUse_"+index).val();
			var unit=$("#unit_"+index).val();
			var quanity=$(tr).find(".quantity")[0];
			if(tool_name.trim().length==0){
				alert("随车附件名称不能为空！");
				show_flag=false;
				return false;
			}
			if(single_use.trim().length==0){
				alert("单车数量不能为空！");
				show_flag=false;
				return false;
			}
			if(unit.trim().length==0){
				alert("单位不能为空！");
				show_flag=false;
				return false;
			}
			if(isNaN(parseInt($(quanity).val()))){
				$(quanity).val(0);
			}
			form_str += tool_name + "," +  single_use + "," + unit + "," + $(quanity).val() + "," + $("#order_no_"+index).val() 
			+ "," + $("#receiver_"+index).val() + "," + $("#workcardid_"+index).val() + "," + $("#department_"+index).val() + ";";
		})
		console.log(form_str);
		if(show_flag){
			
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
							text: "确认",
							id:"btn_ok",
							"class" : "btn btn-success btn-minier",
							click: function() {
								btnConfirm();
							} 
						}
					]
			});
			
			$("#workcardid").val("");
			$("#workcardid").focus();
		}	
	});
	
	function btnConfirm(){
		if($("#receiver").val() == ""){
			alert("请先刷厂牌获取接收人信息！");
			$("#workcardid").focus();
			return false;
		}
		var cardNumber=$("#workcardid").val();
		var receiver=$("#receiver").val();
		if(confirm("确认交接？")){
			$.ajax({
				url:"saveOrderDispatchRecord",
				dataType:"json",
				data:{
					"form_str":form_str,
					"factory_id":factory_id,
					"cardNumber":cardNumber,
					"receiver":receiver
				},
				success:function(response){
					$.gritter.add({
						title: '系统提示：',
						text: '<h5>交接成功！</h5>',
						class_name: 'gritter-info'
					});
					$("#dispatchModal").dialog( "close" );
					//$("#queryBtn").attr("disabled",true);
					$("#dispatchDetail tbody").html("");
					$("#dipatchRecord tbody").html("");
					form_str = "";
					ajaxQueryOrderTool($("#orderNo").val());
				}
			});
			
		}
	};
	
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
	
	//点击“+”符号，往附件表格新增一行
	$(".fa-plus").on("click",function(){
		var trIndex=$("#dispatchDetail tbody").find("tr").length;
		var tr=$("<tr style=\"text-align:center;\"/>");
		var toolName_input="<input id='toolName_"+trIndex+"' style='border:1;width:100%;height:25px' class='tool_name' name='otDispatchRecordList["+trIndex+"].tool_name'>";
		//alert(toolName_input);
		$("<td />").html("<i class='fa fa-times' onclick='remove_tr(this)' style='cursor: pointer;color:red'></i>").appendTo(tr);
		$("<td />").html(toolName_input).appendTo(tr);
		$("<td />").html("<input id='singleUse_"+trIndex+"' style='border:1;width:100%;height:25px' class='singleUse' onchange='change_singleUse(this)' name='otDispatchRecordList["+trIndex+"].single_use_qty'>").appendTo(tr);
		$("<td />").html("<input id='unit_"+trIndex+"' style='border:1;width:100%;height:25px' name='otDispatchRecordList["+trIndex+"].unit'>").appendTo(tr);
		$("<td id='orderQty_"+trIndex+"'/>").html("").appendTo(tr);
		$("<td id='dispatchQty_"+trIndex+"'/>").html("0").appendTo(tr);
		$("<td />").html("<input style='border:1;width:100%;height:25px' id='quantity_"+trIndex+"' class='quantity' onchange='change_quantity(this)' name='otDispatchRecordList["+trIndex+"].quantity'>").appendTo(tr);
		$("<input type='hidden' id='order_no_"+trIndex+"' name='otDispatchRecordList["+trIndex+"].order_no' value='"+$("#orderNo").val()+"'>").appendTo(tr);
		$("<input type='hidden' id='receiver_"+trIndex+"' name='otDispatchRecordList["+trIndex+"].receiver' class='receiver'>").appendTo(tr);
		$("<input type='hidden' id='workcardid_"+trIndex+"' name='otDispatchRecordList["+trIndex+"].workcardid' class='workcardid'>").appendTo(tr);
		$("<input type='hidden' id='department_"+trIndex+"' name='otDispatchRecordList["+trIndex+"].department' class='department'>").appendTo(tr);
		$("#dispatchDetail tbody").append(tr);
		
	})
	
	
});

function ajaxQueryOrderTool(orderNo){
	$("#dipatchRecord tbody").html("");
	$.ajax({
		url:"getQueryOrderTool",
		dataType:"json",
		data:{
			"orderNo":orderNo,
			"dis_name":$("#dis_name").val(),
			"dis_receiver":$("#dis_receiver").val(),
			"dis_date_start":$("#dis_date_start").val(),
			"dis_date_end":$("#dis_date_end").val()
		},
		success:function(response){
			$("#querydisBtn").attr("disabled",false);
			$("#dispatchBtn").attr("disabled",false);
			generateRecordTable(response.data);
			generateListTabel(response.data);
		}
	})
	
	$("#dispatchForm").css("display","");
}

//动态生成附件交接表
function generateListTabel(recordList){
	$("#dispatchDetail tbody").html("");
	var last_tool_name;
	var i=0;
	$.each(recordList,function(index,value){
		if(last_tool_name==value.tool_name){
			var tds=$("#dispatchDetail tbody tr:last").children();
			//alert(tds.length);
			var quantityinput=$(tds[5]);
			var last_quantity=isNaN(parseInt($(tds[5]).html()))?0:parseInt($(tds[5]).html());
			$(quantityinput).html(value.quantity+last_quantity);
		}else{
			var tr=$("<tr style=\"text-align:center;\"/>");
			var toolName_input="<input id='toolName_"+i
							+"' style='border:0;width:100%;height:100%;height:25px' class='tool_name' name='otDispatchRecordList["+i+"].tool_name'"
							+"value='"+value.tool_name+"' readonly>";
			var singleUse_input="<input id='singleUse_"+i
							+"'style='border:0;width:100%;height:100%;height:25px'  class='singleUse' onchange='change_singleUse(this)' name='otDispatchRecordList["+i+"].single_use_qty'"
							+" value="+value.single_use_qty+" readonly >";
			var unit_input="<input id='unit_"+i+"' style='border:0;width:100%;height:100%;height:25px' name='otDispatchRecordList["+i+"].unit'"
							+" value='"+value.unit+"' readonly>";
			var quantity_input="<input style='border:0;width:100%;height:100%;height:25px' class='quantity' onchange='change_quantity(this)' name='otDispatchRecordList["+i+"].quantity'>";
			//alert(toolName_input);
			$("<td />").html("<i class='fa fa-times' style='cursor: pointer;color:red'></i>").appendTo(tr);
			$("<td />").html(toolName_input).appendTo(tr);
			$("<td />").html(singleUse_input).appendTo(tr);
			$("<td />").html(unit_input).appendTo(tr);
			$("<td id='orderQty_"+i+"'/>").html(value.order_total).appendTo(tr);
			$("<td id='dispatchQty_"+i+"'/>").html(value.quantity).appendTo(tr);
			$("<td />").html(quantity_input).appendTo(tr);
			$("<input type='hidden' id='order_no_"+i+"'  name='otDispatchRecordList["+i+"].order_no' value='"+$("#orderNo").val()+"'>").appendTo(tr);
			$("<input type='hidden' id='receiver_"+i+"' name='otDispatchRecordList["+i+"].receiver' class='receiver'>").appendTo(tr);
			$("<input type='hidden' id='workcardid_"+i+"' name='otDispatchRecordList["+i+"].workcardid' class='workcardid'>").appendTo(tr);
			$("<input type='hidden' id='department_"+i+"' name='otDispatchRecordList["+i+"].department' class='department'>").appendTo(tr);
			$("#dispatchDetail tbody").append(tr);
			i++;
		}	
		last_tool_name=value.tool_name;
		
	});
	
}

//动态生成交接记录表
function generateRecordTable(recordList){
	$.each(recordList,function(index,value){
		var tr=$("<tr />");
		$("<td style=\"text-align:center;\"/>").html(value.tool_name).appendTo(tr);
		$("<td style=\"text-align:center;\"/>").html(value.single_use_qty).appendTo(tr);
		$("<td style=\"text-align:center;\"/>").html(value.unit).appendTo(tr);
		$("<td style=\"text-align:center;\"/>").html(value.quantity).appendTo(tr);
		$("<td style=\"text-align:center;\"/>").html(value.editor).appendTo(tr);
		$("<td style=\"text-align:center;\"/>").html(value.receiver).appendTo(tr);
		$("<td style=\"text-align:center;\"/>").html(value.edit_date).appendTo(tr);
		$("#dipatchRecord tbody").append(tr);
	});
}

function remove_tr(obj){
	$(obj).parent().parent().remove();
}

//填写完单车数量计算出订单合计
function change_singleUse(obj){
	var tds=$(obj).parent("td").siblings();
	if(isNaN(parseInt($(obj).val()))||parseInt($(obj).val())==0){
		alert("单车数量只能是大于0的数字！");
		$(obj).val(1);
	}	
	$(tds[3]).html(orderQty*$(obj).val());	
}
function change_quantity(obj){
	var tds=$(obj).parent().siblings();		
	var quantity_left=parseInt($(tds[4]).html())-parseInt($(tds[5]).html());
	var quantity=isNaN(parseInt($(obj).val()))?0:parseInt($(obj).val());
	if(quantity>quantity_left){
		alert("发车数量不能大于剩余数量！");
		$(obj).val("");
		$(obj).focus();
	}
}


