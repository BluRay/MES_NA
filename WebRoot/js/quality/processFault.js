var pageSize=1;
var table;
var table_height = $(window).height()-250;
$(document).ready(function(){
	initPage();
	$("#breadcrumbs").resize(function() {
		ajaxQuery();
	});

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/BMS/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})
	function initPage(){
		getBusNumberSelect('#nav-search-input');
		getFactorySelect("quality/processFault",'',"#search_factory",null,'id');
		$('#new_report_file,#edit_report_file').ace_file_input({
			no_file:'请选择要上传的文件...',
			btn_choose:'选择文件',
			btn_change:'重新选择',
			width:"300px",
			droppable:false,
			onchange:null,
			thumbnail:false, //| true | large
			//allowExt: ['pdf','PDF'],
		}).on('file.error.ace', function(event, info) {
			alert("请上传正确的文件!");
			return false;
	    });
	}
	
	$("#btnQuery").click (function () {
		ajaxQuery();
		return false;
	});
	
	$('#new_factory').change(function(){ 
		getWorkshopSelect("quality/processFault",$("#new_factory :selected").text(),"","#new_workshop",null,"id");
	});
	$('#edit_factory').change(function(){ 
		getWorkshopSelect("quality/processFault",$("#edit_factory :selected").text(),"","#edit_workshop",null,"id");
	});
	
	$("#btnAdd").on('click', function(e) {
		getBusType();
		getFactorySelect("quality/processFault",'',"#new_factory",null,'id');
		getWorkshopSelect("quality/processFault",$("#new_factory :selected").text(),"","#new_workshop",null,"id");
		
		e.preventDefault();
		$("#dialog-add").removeClass('hide').dialog({
			resizable: false,
			title: '<div class="widget-header"><h4 class="smaller"><i class="ace-icon fa fa-users green"></i> 增加制程异常</h4></div>',
			title_html: true,
			width:'600px',
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

function showProcessFault(id){
	getBusType();
	getFactorySelect("quality/processFault",'',"#edit_factory",null,'id');
	getWorkshopSelect("quality/processFault",$("#edit_factory :selected").text(),"","#edit_workshop",null,"id");
	
	$.ajax({
		url: "showProcessFaultInfo",
		dataType: "json",
		data: {"id":id},
		async: false,
		error: function () {alertError();},
		success: function (response) {
			$("#edit_bus_type").find("option:contains('"+response.data.bus_type+"')").attr("selected",true);
			$("#edit_fault_date").val(response.data.fault_date);
			$("#edit_fault_mils").val(response.data.fault_mils);
			$("#edit_customer_name").val(response.data.customer_name);
			$("#edit_license_number").val(response.data.license_number);
			$("#edit_vin").val(response.data.vin);
			$("#edit_fault_level_id").val(response.data.fault_level_id);
			$("#edit_is_batch").val(response.data.is_batch);
			$("#edit_fault_phenomenon").val(response.data.fault_phenomenon);
			$("#edit_fault_reason").val(response.data.fault_reason);
			$("#edit_factory").val(response.data.factory_id);
			$("#edit_workshop").find("option:contains('"+response.data.response_workshop+"')").attr("selected",true);
			$("#edit_resolve_method").val(response.data.resolve_method);
			$("#edit_resolve_date").val(response.data.resolve_date);
			$("#edit_resolve_result").val(response.data.resolve_result);
			$("#edit_punish").val(response.data.punish);
			$("#edit_compensation").val(response.data.compensation);
			$("#edit_memo").val(response.data.memo);
			//$("#edit_report_file").hide();
			if(response.data.report_file_path != null){
				$('#file_link').show();
				$('#file_link').attr('href',response.data.report_file_path); 
			}else{
				$('#file_link').hide();
			}
			
			$(".div-dialog input").prop("disabled",true);  
		    $(".div-dialog select").prop("disabled",true);  
			
			$("#dialog-edit").removeClass('hide').dialog({
				resizable: false,
				title: '<div class="widget-header"><h4 class="smaller"><i class="ace-icon fa fa-users green"></i> 查看制程异常</h4></div>',
				title_html: true,
				width:'600px',
				modal: true,
				buttons: [{
							text: "关闭",
							"class" : "btn btn-minier",
							click: function() {$( this ).dialog( "close" );} 
						}
					]
			});
			
		}
	})
}

function editProcessFault(id){
	getBusType();
	getFactorySelect("quality/processFault",'',"#edit_factory",null,'id');
	getWorkshopSelect("quality/processFault",$("#edit_factory :selected").text(),"","#edit_workshop",null,"id");

	$(".div-dialog input").prop("disabled",false);  
    $(".div-dialog select").prop("disabled",false);  
	$.ajax({
		url: "showProcessFaultInfo",
		dataType: "json",
		data: {"id":id},
		async: false,
		error: function () {alertError();},
		success: function (response) {
			$("#edit_bus_type").find("option:contains('"+response.data.bus_type+"')").attr("selected",true);
			$("#edit_fault_date").val(response.data.fault_date);
			$("#edit_fault_mils").val(response.data.fault_mils);
			$("#edit_customer_name").val(response.data.customer_name);
			$("#edit_license_number").val(response.data.license_number);
			$("#edit_vin").val(response.data.vin);
			$("#edit_fault_level_id").val(response.data.fault_level_id);
			$("#edit_is_batch").val(response.data.is_batch);
			$("#edit_fault_phenomenon").val(response.data.fault_phenomenon);
			$("#edit_fault_reason").val(response.data.fault_reason);
			$("#edit_factory").val(response.data.factory_id);
			$("#edit_workshop").find("option:contains('"+response.data.response_workshop+"')").attr("selected",true);
			$("#edit_resolve_method").val(response.data.resolve_method);
			$("#edit_resolve_date").val(response.data.resolve_date);
			$("#edit_resolve_result").val(response.data.resolve_result);
			$("#edit_punish").val(response.data.punish);
			$("#edit_compensation").val(response.data.compensation);
			$("#edit_memo").val(response.data.memo);
			//$("#edit_report_file").show();
			if(response.data.report_file_path != null){
				$('#file_link').show();
				$('#file_link').attr('href',response.data.report_file_path); 
			}else{
				$('#file_link').hide();
			}
			
			$("#dialog-edit").removeClass('hide').dialog({
				resizable: false,
				title: '<div class="widget-header"><h4 class="smaller"><i class="ace-icon fa fa-users green"></i> 编辑制程异常</h4></div>',
				title_html: true,
				width:'550px',
				modal: true,
				buttons: [{
							text: "关闭",
							"class" : "btn btn-minier",
							click: function() {$( this ).dialog( "close" );} 
						},{
							text: "保存",
							id:"btn_ok",
							"class" : "btn btn-success btn-minier",
							click: function() {
								btnEditConfirm(id);
							} 
						}
					]
			});
			
		}
	})
}

function btnEditConfirm(id){
	var vinTest = /^[A-Z0-9]{17}$/;
	if($("#edit_fault_date").val()==''){
		alert("请输入故障反馈日期！");
		$("#edit_fault_date").focus();
		return false;
	}
	if($("#edit_fault_mils").val()==''){
		alert("请输入故障里程！");
		$("#new_fault_mils").focus();
		return false;
	}
	if($("#edit_customer_name").val()==''){
		alert("请输入客户名称！");
		$("#edit_customer_name").focus();
		return false;
	}
	if($("#edit_license_number").val()==''){
		alert("请输入车牌号码！");
		$("#edit_license_number").focus();
		return false;
	}
	if($("#edit_vin").val()==''){
		alert("请输入VIN号！");
		$("#edit_vin").focus();
		return false;
	}
	if(!vinTest.test($("#edit_vin").val())){
		alert("请输入长度为17位，只包含大写字母和数字的VIN号！");
		$("#edit_vin").focus();
		return false;
	}
	if($("#edit_fault_phenomenon").val()==''){
		alert("请输入故障现象！");
		$("#edit_fault_phenomenon").focus();
		return false;
	}
	if($("#edit_fault_reason").val()==''){
		alert("请输入故障原因！");
		$("#edit_fault_reason").focus();
		return false;
	}
	console.log("-->id = "+ id);
	$('#form_edit').ajaxSubmit({
		url: "editProcessFault",
		dataType : "json",
		type : "post",
	    data: {
	    	"id":id,
	    	"bus_type" : $("#edit_bus_type").find("option:selected").text(),
			"fault_date":$("#edit_fault_date").val(),
			"fault_mils" : $("#edit_fault_mils").val(),
			"customer_name" : $("#edit_customer_name").val(),
			"license_number" : $("#edit_license_number").val(),
			"vin" : $("#edit_vin").val(),
			"fault_level_id" : $("#edit_fault_level_id").val(),
			"is_batch" : $("#edit_is_batch").val(),
			"fault_phenomenon" : $("#edit_fault_phenomenon").val(),
			"fault_reason" : $("#edit_fault_reason").val(),
			"factory" : $("#edit_factory").val(),
			"workshop" : $('#edit_workshop').find("option:selected").text(),
			"resolve_method" : $("#edit_resolve_method").val(),
			"resolve_date" : $("#edit_resolve_date").val(),
			"resolve_result" : $("#edit_resolve_result").val(),
			"punish" : $("#edit_punish").val(),
			"compensation" : $("#edit_compensation").val(),
			"memo" : $("#edit_memo").val()
	    },
		async: false,
	    success:function (response) {
	    	if (response.success) {
		    	$.gritter.add({
					title: '系统提示：',
					text: '<h5>编辑成功！</h5>',
					class_name: 'gritter-info'
				});
	    		$( "#dialog-edit" ).dialog( "close" ); 
	    		ajaxQuery();
	    	} else {
		    	$.gritter.add({
					title: '系统提示：',
					text: '<h5>编辑失败！</h5>',
					class_name: 'gritter-info'
				});
	    	}
	    },
	    error:function(){alertError();}
	});
	
}

function btnNewConfirm(){
	var vinTest = /^[a-zA-Z0-9]{17}$/;
	
	if($("#new_fault_date").val()==''){
		alert("请输入故障反馈日期！");
		$("#new_fault_date").focus();
		return false;
	}
	if($("#new_fault_mils").val()==''){
		alert("请输入故障里程！");
		$("#new_fault_mils").focus();
		return false;
	}
	if($("#new_customer_name").val()==''){
		alert("请输入客户名称！");
		$("#new_customer_name").focus();
		return false;
	}
	if($("#new_license_number").val()==''){
		alert("请输入车牌号码！");
		$("#new_license_number").focus();
		return false;
	}
	if($("#new_vin").val()==''){
		alert("请输入VIN号！");
		$("#new_vin").focus();
		return false;
	}
	if(!vinTest.test($("#new_vin").val())){
		alert("请输入长度为17位，只包含大写字母和数字的VIN号！");
		$("#new_vin").focus();
		return false;
	}
	if($("#new_fault_phenomenon").val()==''){
		alert("请输入故障现象！");
		$("#new_fault_phenomenon").focus();
		return false;
	}
	if($("#new_fault_reason").val()==''){
		alert("请输入故障原因！");
		$("#new_fault_reason").focus();
		return false;
	}
	
	$('#form_add').ajaxSubmit({
		url: "addProcessFault",
		dataType : "json",
		type : "post",
	    data: {
	    	"bus_type" : $("#new_bus_type").find("option:selected").text(),
			"fault_date":$("#new_fault_date").val(),
			"fault_mils" : $("#new_fault_mils").val(),
			"customer_name" : $("#new_customer_name").val(),
			"license_number" : $("#new_license_number").val(),
			"vin" : $("#new_vin").val(),
			"fault_level_id" : $("#new_fault_level_id").val(),
			"is_batch" : $("#new_is_batch").val(),
			"fault_phenomenon" : $("#new_fault_phenomenon").val(),
			"fault_reason" : $("#new_fault_reason").val(),
			"factory" : $("#new_factory").val(),
			"workshop" : $('#new_workshop').find("option:selected").text(),
			"resolve_method" : $("#new_resolve_method").val(),
			"resolve_dat" : $("#new_resolve_date").val(),
			"resolve_result" : $("#new_resolve_result").val(),
			"punish" : $("#new_punish").val(),
			"compensation" : $("#new_compensation").val(),
			"memo" : $("#new_memo").val()
	    },
		async: false,
	    success:function (response) {
	    	if (response.success) {
		    	$.gritter.add({
					title: '系统提示：',
					text: '<h5>新增成功！</h5>',
					class_name: 'gritter-info'
				});
	    		$( "#dialog-add" ).dialog( "close" ); 
	    		ajaxQuery();
	    	} else {
		    	$.gritter.add({
					title: '系统提示：',
					text: '<h5>新增失败！</h5>',
					class_name: 'gritter-info'
				});
	    	}
	    },
	    error:function(){alertError();}
	});
	
}

function getBusType(){
	$(".busType").empty();
	$.ajax({
		url: "/BMS/common/getBusType",
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

function ajaxQuery(){
	$("#tableData").dataTable({
		serverSide: true,paiging:true,ordering:false,searching: false,bAutoWidth:false,
		destroy: true,sScrollY: table_height,sScrollX:true,orderMulti:false,
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
				"orderColumn":"id",
				"factory_id" : $("#search_factory").val(),
				"customer_name" : $("#search_customer_name").val(),
				"status" : $("#search_resolve_result").val(),
				"fault_phenomenon" : $("#search_fault_phenomenon").val(),
				"fault_date_start" : $("#search_date_start").val(),
				"fault_date_end" : $("#search_date_end").val()
			};
            param.length = data.length;					//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;					//开始的记录序号
            param.page = (data.start / data.length)+1;	//当前页码

            $.ajax({
                type: "post",
                url: "getProcessFaultList",
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
		            {"title":"车型",width:'60',"class":"center","data":"bus_type","defaultContent": ""},
		            {"title":"反馈日期",width:'95',"class":"center","data":"fault_date","defaultContent": ""},
		            {"title":"故障里程",width:'80',"class":"center","data":"fault_mils","defaultContent": ""},
		            {"title":"客户",width:'80',"class":"center","data":"customer_name","defaultContent": ""},
		            {"title":"车牌号码",width:'80',"class":"center","data":"license_number","defaultContent": ""},
		            {"title":"VIN号",width:'80',"class":"center","data":"vin","defaultContent": ""},
		            {"title":"故障等级",width:'80',"class":"center","data":"fault_level_id","defaultContent": ""},
		            {"title":"故障现象",width:'100',"class":"center","data":"fault_phenomenon","defaultContent": ""},
		            {"title":"责任工厂",width:'80',"class":"center","data":"factory_name","defaultContent": ""},
		            {"title":"责任车间",width:'80',"class":"center","data":"response_workshop","defaultContent": ""},
		            {"title":"维护人",width:'60',"class":"center","data":"editor_name","defaultContent": ""},
		            {"title":"维护时间",width:'150',"class":"center","data":"edit_date","defaultContent": ""},
		            {"title":"操作",width:'80',"class":"center","data":null,"defaultContent": "",
		            	"render": function ( data, type, row ) {
		            		return "<i class=\"glyphicon glyphicon-search bigger-130 showbus\" title=\"查看\" onclick='showProcessFault(" 
		            		+ row['id'] + ")' style='color:blue;cursor: pointer;'></i>" + 
		            		"&nbsp;&nbsp;&nbsp;<i class=\"glyphicon glyphicon-edit bigger-130 showbus\" title=\"编辑\" onclick='editProcessFault(" 
		            		+ row['id'] + ")' style='color:blue;cursor: pointer;'></i>"
		            	},
		            }
		          ],
	});
}