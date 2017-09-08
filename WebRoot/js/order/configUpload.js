var cur_year="";
var pageSize=10;
var extArray = new Array(".xls");
var json_configList=null;
$(document).ready(function(){
	initPage();
	$(".btnQuery").on("click",function(){
		ajaxQuery();
	}); 
	
	$("#btnAdd").on("click",function(){		
		showCreatePage();
	})

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/BMS/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})
	
	$("#configQty").change(function(){
		//alert($(this).data("allot_qty"));
		var config_qty=Number($(this).val());
		if(isNaN(config_qty)){
			alert("配置数量只能为数字！");
			$(this).val("");
			return false;
		}
		/*var old_qty=Number($(this).data("old_qty"));
		//alert(old_qty);
		var config_qty_total=getOrderConfigTotalQty($("#order_id").val());
		if($(this).val()<$(this).data("allot_qty")){
			alert("该配置的配置数量不能小于产地分配数量，配置产地已分配"+$(this).data("allot_qty")+"台！");
			$("#configQty").focus();
			$(this).val($(this).data("allot_qty"));
			return false;
		}
		if(!isNaN(old_qty)){//编辑时
			var order_qty=Number($("#order").attr("order_qty"));
			//alert(order_qty);
			if((config_qty_total-old_qty+config_qty)>order_qty){
				alert("配置数量之和不能超出订单数量！该订单已配置数量为:"+config_qty_total+",订单数量为:"+order_qty);
				return false;
			}
		}
		if(isNaN(old_qty)){//新增时
			var order_qty=Number($("#order").attr("order_qty"));
			//alert(order_qty)
			if((config_qty_total+config_qty)>order_qty){
				alert("配置数量之和不能超出订单数量！该订单已配置数量为:"+config_qty_total+",订单数量为:"+order_qty);
				return false;
			}
		}
		*/
	});
	
});

function initPage(){
	getBusNumberSelect('#nav-search-input');
	cur_year = new Date().getFullYear();
	$("#search_productive_year").val(cur_year)
	/*$("#search_productive_year").html('<option value="'+cur_year+'">'+cur_year+'</option><option value="'+(cur_year-1)+'">'+(cur_year-1)+'</option><option value="'+(cur_year+1)+'">'+(cur_year+1)+'</option><option value="'+(cur_year+2)+'">'+(cur_year+2)+'</option>');	*/
	getOrderNoSelect("#search_order_no","#orderId");
	getOrderNoSelect("#order","#order_id",function(value){
		$("#order").attr("order_qty",value.orderQty);
	});
	var orderNo = getParamValue("orderNo");
	$("#search_order_no").val(orderNo);
	ajaxQuery();
}

function ajaxQuery(){
	var tb=$("#tableOrder").DataTable({
		serverSide: true,
/*		fixedColumns:   {
            leftColumns: 1,
            rightColumns:1
        },*/
/*		dom: 'Bfrtip',
	    buttons: [
	        {extend:'excel',title:'data_export',className:'black',text:'<i class=\"glyphicon glyphicon-search bigger-130 showbus\"></i>'},
	        {extend:'colvis',text:'选择显示'}
	    ],*/
        rowsGroup:[0,1,2,3,4],
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
		lengthChange:false,
		orderMulti:false,
		language: {
			emptyTable:"抱歉，未查询到数据！",
			info:"共计 _TOTAL_ 条，当前第 _PAGE_ 页 共 _PAGES_ 页",
			infoEmpty:"",
			paginate: {
			  first:"首页",
		      previous: "上一页",
		      next:"下一页",
		      last:"尾页",
		      loadingRecords: "请稍等,加载中...",		     
			}
		},
		ajax:function (data, callback, settings) {
			var param ={
				"draw":1,
				"orderNo":$("#search_order_no").val(),
				"orderName":$("#search_order_name").val(),
				"actYear":$("#search_productive_year").val()
			};
            param.length = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;//开始的记录序号
            param.page = (data.start / data.length)+1;//当前页码

            $.ajax({
                type: "post",
                url: "showOrderConfigList",
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
                    //console.log(returnData);
                    //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                    //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                    callback(returnData);
                }
            });
		
		},
		columns: [
		            {"title":"订单编号","class":"center","data":"order_no","defaultContent": ""},
		            {"title":"订单描述","class":"center","data":"order_name_str","defaultContent": ""},
		            {"title":"生产年份","class":"center","data":"productive_year","defaultContent": ""},
		            {"title":"订单交期","class":"center","data": "delivery_date","defaultContent": ""},
		            {"title":"订单数量","class":"center","data":"order_qty","defaultContent": ""},		            
		            {"title":"配置名称","class":"center","data":"order_config_name","defaultContent": ""},		            
		            {"title":"配置数量","class":"center","data": "config_qty","defaultContent": ""},
		            {"title":"总成料号","class":"center","data":"sap_materialNo","defaultContent":""},
		            {"title":"物料描述","class":"center","data":"material","defaultContent": ""},
		            {"title":"操作","class":"center","data":null,"render":function(data,type,row){
		            	return "<i class=\"glyphicon glyphicon-search bigger-130 showbus\" title='查看' onclick = 'showInfoPage(" + JSON.stringify(row)+");' style='color:blue;cursor: pointer;'></i>&nbsp;&nbsp;&nbsp;"+ 
		            	"<i class=\"ace-icon fa fa-pencil bigger-130 editorder\" title='导入' onclick = 'showEditPage(" + JSON.stringify(row)+ ");' style='color:green;cursor: pointer;'></i>";
		            		
		            	},
		            }
		          ],
	});
	/*$("#tableOrder_info").addClass('col-xs-6');
	$("#tableOrder_paginate").addClass('col-xs-6');
	$(".dt-buttons").css("margin-top","-50px").find("a").css("border","0px");*/
}

function showEditPage(row){
	var allot_qty=row.allot_qty;
	//显示订单配置数据
	$("#order").val(row.order_no).attr("disabled",true).data("total_config_qty",row.total_config_qty||0);
	$("#order").attr("order_qty",row.order_qty);
	$("#order_id").val(row.id)
	$("#configName").val(row.order_config_name).attr("disabled",false).attr("config_id",row.config_id);
	$("#configQty").val(row.config_qty).attr("disabled",false).data("allot_qty",allot_qty).data("old_qty",row.config_qty);
	$("#materialNo").val(row.sap_materialNo).attr("disabled",false);
	$("#customer").val(row.customer).attr("disabled",false);
	$("#material").val(row.material).attr("disabled",false);
	$("#tire_type").val(row.tire_type).attr("disabled",false);
	$("#spring_num").val(row.spring_num).attr("disabled",false);
	$("#bus_seats").val(row.bus_seats).attr("disabled",false);
	$("#rated_voltage").val(row.rated_voltage).attr("disabled",false);
	$("#battery_capacity").val(row.battery_capacity).attr("disabled",false);
	$("#passenger_num").val(row.passenger_num).attr("disabled",false);
	$("#upload_div").show();
	json_configList=null;
	
	var param ={
			"configId":row.config_id||0
		};
	//显示订单配置明细列表
	$.ajax({
		type: "post",
        url: "getConfigDetailList",
        cache: false,  //禁用缓存
        data: param,  //传入组装的参数
        dataType: "json",
        success: function (result) {
        	drawConfigListTable(result);
        }
	});
	
	var dialog = $( "#dialog-config" ).removeClass('hide').dialog({
		width:900,
		height:600,
		modal: true,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i> 配置导入</h4></div>",
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
					ajaxEdit(); 
				} 
			},{
				text: "保存&新增",
				"class" : "btn btn-success btn-minier",
				click: function() {
					ajaxEdit(true); 
				} 
			}
		]
	});
	$( "#dialog-config" ).data("config_id",row.config_id);
}

function showCreatePage(){
	//显示订单配置数据
	$("#order").attr("disabled",false);
	$("#order").val("");
	$("#order_id").val('0');
	$("#configName").val("").attr("disabled",false);;
	$("#configQty").val("").attr("disabled",false);
	$("#configQty").data("allot_qty",0).data("old_qty",0);
	$("#materialNo").val("").attr("disabled",false);;
	$("#customer").val("").attr("disabled",false);;
	$("#material").val("").attr("disabled",false);;
	$("#tire_type").val("").attr("disabled",false);;
	$("#spring_num").val("").attr("disabled",false);;
	$("#bus_seats").val("").attr("disabled",false);;
	$("#rated_voltage").val("").attr("disabled",false);;
	$("#battery_capacity").val("").attr("disabled",false);;
	$("#passenger_num").val("").attr("disabled",false);;
	$("#upload_div").show();
	$("#orderConfigTable").html("");
	json_configList=null;
	
	var dialog = $( "#dialog-config" ).removeClass('hide').dialog({
		width:900,
		height:600,
		modal: true,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i> 配置导入</h4></div>",
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
					ajaxEdit('0'); 
				} 
			},{
				text: "保存&新增",
				"class" : "btn btn-success btn-minier",
				click: function() {
					ajaxEdit("0",true); 
				} 
			}
		]
	});
	$( "#dialog-config" ).data("config_id",'0');
}

function drawConfigListTable(data){
	$("#orderConfigTable").dataTable({
		paiging:false,
		ordering:false,
		searching: false,
		autoWidth:false,
		destroy: true,
		paginate:false,
		//sScrollY: $(window).height()-250,
		scrollX: true,
		scrollCollapse: true,
		lengthChange:false,
		orderMulti:false,
		info:false,
		language: {
			emptyTable:"",					     
			infoEmpty:"",
			zeroRecords:"请导入配置明细！"
		},
		columnDefs: [{
            "searchable": false,
            "orderable": false,
            "targets": 0
        }],
		data:data.data,
		columns: [
		            {"title":"零部件类别","class":"center","data":"parts_type","defaultContent": ""},
		            {"title":"物料编码","class":"center","data":"sap_mat","defaultContent": ""},
		            {"title":"零部件编号","class":"center","data":"components_no","defaultContent": ""},
		            {"title":"零部件名称","class":"center","data": "components_name","defaultContent": ""},
		            {"title":"材料/规格","class":"center","data":"size","defaultContent": ""},		            
		            {"title":"类别","class":"center","data":"type","defaultContent": ""},		            
		            {"title":"供应商名称","class":"center","data": "vendor","defaultContent": ""},
		            {"title":"装配车间","class":"center","data":"workshop","defaultContent":""},
		            {"title":"备注","class":"center","data":"notes","defaultContent": ""}		          
		          ]	
	});
}

function upload(form,file){
	if (file == "") {
		alert("请选择文件！");
		return false;
	}
	allowSubmit = false;
	if (!file)
		return;
	while (file.indexOf("\\") != -1)
		file = file.slice(file.indexOf("\\") + 1);
		ext = file.slice(file.indexOf(".")).toLowerCase();
	for (var i = 0; i < extArray.length; i++) {
		if (extArray[i] == ext) {
			allowSubmit = true;
			break;
		}
	}
	if (allowSubmit) {
		$("#uploadForm").ajaxSubmit({
			dataType : "json",
			type : 'post', // 提交方式 get/post
			url : 'uploadConfigListFile', // 需要提交的 url
			data : {
				
			},
			success : function(response) {
				//alert(response.data);
				json_configList=response.data;
				drawConfigListTable(response);
				$("#uploadForm").resetForm();
			}
		})
		
	}
	
}

function ajaxEdit(saveAdd){
	var config_id=$("#configName").attr("config_id")||0;
	var order_id=$("#order_id").val();
	var config_name=$("#configName").val();
	var config_qty=$("#configQty").val();
	var materialNo=$("#materialNo").val();
	var customer=$("#customer").val();
	var material=$("#material").val();
	var tire_type=$("#tire_type").val();
	var spring_num=$("#spring_num").val();
	var bus_seats=$("#bus_seats").val();
	var rated_voltage=$("#rated_voltage").val();
	var battery_capacity=$("#battery_capacity").val();
	var passenger_num=$("#passenger_num").val();
	
	if(order_id==undefined||order_id=='0'){
		alert("请输入有效订单！");
		return false;
	}
	if(config_name.trim().length==0){
		alert("请输入配置名称！");
		return false;
	}
	if(config_qty.trim().length==0){
		alert("请输入配置数量！");
		return false;
	}
/*	if(materialNo.trim().length==0){
		alert("请输入总成料号！");
		return false;
	}
	if(customer.trim().length==0){
		alert("请输入客户名称！");
		return false;
	}
	if(material.trim().length==0){
		alert("请输入物料描述！");
		return false;
	}
	
	if(tire_type.trim().length==0){
		alert("请输入轮胎规格！");
		return false;
	}
	if(spring_num.trim().length==0){
		alert("请输入弹簧片数！");
		return false;
	}
	if(bus_seats.trim().length==0){
		alert("请输入座位数！");
		return false;
	}
	if(rated_voltage.trim().length==0){
		alert("请输入额定电压！");
		return false;
	}
	if(battery_capacity.trim().length==0){
		alert("请输入电池容量！");
		return false;
	}
	if(passenger_num.trim().length==0){
		alert("请输入额定载客人数！");
		return false;
	}*/
	//alert(config_name);
	
	var config_qty=Number($("#configQty").val());
	var old_qty=Number($("#configQty").data("old_qty"));
	//alert(old_qty);
	var config_qty_total=getOrderConfigTotalQty($("#order_id").val());
	if($("#configQty").val()<$("#configQty").data("allot_qty")){
		alert("该配置的配置数量不能小于产地分配数量，配置产地已分配"+$("#configQty").data("allot_qty")+"台！");
		$("#configQty").focus();
		$("#configQty").val($("#configQty").data("allot_qty"));
		return false;
	}
	if(!isNaN(old_qty)){//编辑时
		var order_qty=Number($("#order").attr("order_qty"));
		//alert(order_qty);
		if((config_qty_total-old_qty+config_qty)>order_qty){
			alert("配置数量之和不能超出订单数量！该订单已配置数量为:"+config_qty_total+",订单数量为:"+order_qty);
			return false;
		}
	}
	if(isNaN(old_qty)){//新增时
		var order_qty=Number($("#order").attr("order_qty"));
		//alert(order_qty)
		if((config_qty_total+config_qty)>order_qty){
			alert("配置数量之和不能超出订单数量！该订单已配置数量为:"+config_qty_total+",订单数量为:"+order_qty);
			return false;
		}
	}
	
	var param={};
	param.config_id=config_id;
	param.order_id=order_id;
	param.config_name=config_name;
	param.config_qty=config_qty;
	param.materialNo=materialNo;
	param.customer=customer;
	param.material=material;
	param.tire_type=tire_type;
	param.spring_num=spring_num;
	param.bus_seats=bus_seats;
	param.rated_voltage=rated_voltage;
	param.battery_capacity=battery_capacity;
	param.passenger_num=passenger_num;
	param.config_detail=JSON.stringify(json_configList);
	
	$.ajax({
		type: "post",
        url: "saveOrderConfigDetail",
        cache: false,  //禁用缓存
        data: param,  //传入组装的参数
        dataType: "json",
        success: function (result) {
        	if(result.success){
        		alert("保存成功！");
        		if(!saveAdd){
        			$( "#dialog-config" ).dialog( "close" );
        		}else{
        			$("#configName").attr("config_id","0");
        			$("#configQty").data("old_qty","")
        		}
        		ajaxQuery();    		
        	}else{
        		alert(result.message);
        	}
        	
        },
        error:function(){
        	alert("保存失败！");
        }
	})
}

function showInfoPage(row){
	//显示订单配置数据
	$("#order").val(row.order_no).attr("disabled",true);
	$("#order_id").val(row.id);
	$("#configName").val(row.order_config_name).attr("disabled",true);
	$("#configQty").val(row.config_qty).attr("disabled",true);
	$("#materialNo").val(row.sap_materialNo).attr("disabled",true);
	$("#customer").val(row.customer).attr("disabled",true);
	$("#material").val(row.material).attr("disabled",true);
	$("#tire_type").val(row.tire_type).attr("disabled",true);
	$("#spring_num").val(row.spring_num).attr("disabled",true);
	$("#bus_seats").val(row.bus_seats).attr("disabled",true);
	$("#rated_voltage").val(row.rated_voltage).attr("disabled",true);
	$("#battery_capacity").val(row.battery_capacity).attr("disabled",true);
	$("#passenger_num").val(row.passenger_num).attr("disabled",true);
	$("#upload_div").hide();
	
	var param ={
			"configId":row.config_id||0
		};
	//显示订单配置明细列表
	$.ajax({
		type: "post",
        url: "getConfigDetailList",
        cache: false,  //禁用缓存
        data: param,  //传入组装的参数
        dataType: "json",
        success: function (result) {
        	drawConfigListTable(result)
        }
	});
	
	var dialog = $( "#dialog-config" ).removeClass('hide').dialog({
		width:900,
		height:600,
		modal: true,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i> 配置明细</h4></div>",
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
	$( "#dialog-config" ).data("config_id",row.config_id);
}

function getOrderConfigTotalQty(order_id){
	var qty=0;
	$.ajax({
		type: "post",
        url: "getOrderConfigTotalQty",
        async:false,
        data: {
        	order_id:order_id
        },  
        dataType: "json",
        success: function (result) {
        	qty=result.data;
        }
	});
	return qty;
}
