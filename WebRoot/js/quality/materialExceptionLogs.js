var pageSize=1;
var table;
var table_height = $(window).height()-255;
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
		getBusType("#search_bustype");
		getOrderNoSelect("#search_orderno","#orderId");
		getOrderNoSelect("#new_orderNo","#orderId",setBusType);
		getOrderNoSelect("#edit_orderNo","#orderId");
		getFactorySelect("quality/materialExceptionLogs",'',"#search_factory","全部",'id');
		getWorkshopSelect("quality/materialExceptionLogs",$("#search_factory :selected").text(),"","#search_workshop",null,"id");
		$('#new_bphoto,#new_fphoto,#edit_bphoto,#edit_fphoto').ace_file_input({
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
		ajaxQuery();
	}
	
	$("#btnQuery").click (function () {
		ajaxQuery();
		return false;
	});
	$('#search_factory').change(function(){ 
		getWorkshopSelect("quality/materialExceptionLogs",$("#search_factory :selected").text(),"","#search_workshop",null,"id");
	});
	$('#new_factory').change(function(){ 
		getWorkshopSelect("quality/materialExceptionLogs",$("#new_factory :selected").text(),"","#new_workshop",null,"id");
	});
	$('#edit_factory').change(function(){ 
		getWorkshopSelect("quality/materialExceptionLogs",$("#edit_factory :selected").text(),"","#edit_workshop",null,"id");
	});
	
	
	$("#btnAdd").on('click', function(e) {
		getBusType("#new_bus_type");
		getFactorySelect("quality/materialExceptionLogs",'',"#new_factory",null,'id');
		getWorkshopSelect("quality/materialExceptionLogs",$("#new_factory :selected").text(),"","#new_workshop",null,"id");
		
		e.preventDefault();
		$("#dialog-add").removeClass('hide').dialog({
			resizable: false,
			title: '<div class="widget-header"><h4 class="smaller"><i class="ace-icon fa fa-users green"></i> 增加物料异常记录</h4></div>',
			title_html: true,
			width:800,
			height:600,
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

function showExceptionLogs(id){
	clear();
	getBusType("#edit_bus_type");
	getFactorySelect("quality/materialExceptionLogs",'',"#edit_factory",null,'id');
	getWorkshopSelect("quality/materialExceptionLogs",$("#edit_factory :selected").text(),"","#edit_workshop",null,"id");
	
	$.ajax({
		url: "showMaterialExceptionLogs",
		dataType: "json",
		data: {"id":id},
		async: false,
		error: function () {},
		success: function (response) {
			$("#edit_factory option[value='"+response.data.factroy_id+"']").attr("selected",true);
			$("#edit_bus_type option[value='"+response.data.bus_type_id+"']").attr("selected",true);
			$("#edit_material").val(response.data.material);
			$("#edit_orderNo").val(response.data.order_no);
			$("#edit_occurDate").val(response.data.occur_date);
			$("#edit_description").val(response.data.description);
			$("#edit_tmpMeasures").val(response.data.tmp_measures);
			$("#edit_faultReason").val(response.data.fault_reason);
			$("#edit_impMeasures").val(response.data.imp_measures);
			$("#edit_expcFinishDate").val(response.data.expc_finish_date);
			$("#edit_respUnit").val(response.data.resp_unit);
			$("#edit_respPerson").val(response.data.resp_person);
			$("#edit_factory").val(response.data.factory_id);
			$("#edit_workshop option[value='"+response.data.workshop_id+"']").attr("selected",true);
			$("#edit_verifier").val(response.data.verifier);
			$("#edit_verifyResult option[value='"+response.data.verify_result+"']").attr("selected",true);
			$("#edit_bugLevel option[value='"+response.data.verify_result+"']").attr("selected",true);
			$("#edit_memo").val(response.data.memo);
			if(response.data.bphoto != null){
				$('#bphoto').show();
				$('#bphoto').attr('href',response.data.bphoto); 
				$('#edit_bphoto').hide();
			}else{
				$('#bphoto').hide();
			}
			if(response.data.fphoto != null){
				$('#fphoto').show();
				$('#fphoto').attr('href',response.data.fphoto); 
				$('#edit_fphoto').hide();
			}else{
				$('#fphoto').hide();
			}
			
			$(".div-dialog input").prop("disabled",true);  
		    $(".div-dialog select").prop("disabled",true);  
		    $(".div-dialog textarea").prop("disabled",true);
			$("#dialog-edit").removeClass('hide').dialog({
				resizable: false,
				title: '<div class="widget-header"><h4 class="smaller"><i class="ace-icon fa fa-users green"></i> 查看物料异常记录</h4></div>',
				title_html: true,
				width:800,
				height:600,
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

function editExceptionLogs(id){
	getBusType("#edit_bus_type");
	getFactorySelect("quality/materialExceptionLogs",'',"#edit_factory",null,'id');
	getWorkshopSelect("quality/materialExceptionLogs",$("#edit_factory :selected").text(),"","#edit_workshop",null,"id");

	$(".div-dialog input").prop("disabled",false);  
    $(".div-dialog select").prop("disabled",false); 
    $(".div-dialog textarea").prop("disabled",false); 
	$.ajax({
		url: "showMaterialExceptionLogs",
		dataType: "json",
		data: {"id":id},
		async: false,
		error: function () {alertError();},
		success: function (response) {
			$("#edit_factory option[value='"+response.data.factroy_id+"']").attr("selected",true);
			$("#edit_bus_type option[value='"+response.data.bus_type_id+"']").attr("selected",true);
			$("#edit_material").val(response.data.material);
			$("#edit_orderNo").val(response.data.order_no);
			$("#edit_occurDate").val(response.data.occur_date);
			$("#edit_description").val(response.data.description);
			$("#edit_tmpMeasures").val(response.data.tmp_measures);
			$("#edit_faultReason").val(response.data.fault_reason);
			$("#edit_impMeasures").val(response.data.imp_measures);
			$("#edit_expcFinishDate").val(response.data.expc_finish_date);
			$("#edit_respUnit").val(response.data.resp_unit);
			$("#edit_respPerson").val(response.data.resp_person);
			$("#edit_factory").val(response.data.factory_id);
			$("#edit_workshop option[value='"+response.data.workshop_id+"']").attr("selected",true);
			$("#edit_verifier").val(response.data.verifier);
			$("#edit_verifyResult option[value='"+response.data.verify_result+"']").attr("selected",true);
			$("#edit_memo").val(response.data.memo);
			if(response.data.bphoto != null){
				$('#edit_bphoto').show();
				$('#bphoto').show();
				$('#bphoto').attr('href',response.data.bphoto); 
			}else{
				$('#bphoto').hide();
			}
			if(response.data.fphoto != null){
				$('#edit_fphoto').show();
				$('#fphoto').show();
				$('#fphoto').attr('href',response.data.fphoto); 
			}else{
				$('#fphoto').hide();
			}
			$("#dialog-edit").removeClass('hide').dialog({
				resizable: false,
				title: '<div class="widget-header"><h4 class="smaller"><i class="ace-icon fa fa-users green"></i> 编辑制程异常</h4></div>',
				title_html: true,
				width:800,
				height:600,
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
	if($("#edit_occurDate").val()==''){
		alert("请输入发生日期！");
		$("#edit_occurDate").focus();
		return false;
	}
	if($("#edit_material").val()==''){
		alert("请输入物料名称！");
		$("#edit_material").focus();
		return false;
	}
	if($("#edit_orderNo").val()==''){
		alert("请输入订单编号！");
		$("#edit_orderNo").focus();
		return false;
	}
	if($("#edit_description").val()==''){
		alert("请输入问题描述！");
		$("#edit_description").focus();
		return false;
	}
	//console.log("-->id = "+ id);
	$('#form_edit').ajaxSubmit({
		url: "editMaterialExceptionLogs",
		dataType : "json",
		type : "post",
	    data: {
	    	"id":id,
	    	"occurDate" : $("#edit_occurDate").val(),
	    	"bus_type" : $("#edit_bus_type").val(),
			"factroy_id":$("#edit_factory").val(),
			"material" : $("#edit_material").val(),
			"orderNo" : $("#edit_orderNo").val(),
			"description" : $("#edit_description").val(),
			"tmpMeasures" : $("#edit_tmpMeasures").val(),
			"faultReason" : $("#edit_faultReason").val(),
			"impMeasures" : $("#edit_impMeasures").val(),
			"workshop" : $('#edit_workshop').val(),
			"bugLevel" : $("#edit_bugLevel").val(),
			"expcFinishDate" : $("#edit_expcFinishDate").val(),
			"respUnit" : $("#edit_respUnit").val(),
			"respPerson" : $("#edit_respPerson").val(),
			"verifier" : $("#edit_verifier").val(),
			"verifyResult" : $("#edit_verifyResult").val(),
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
	if($("#new_occurDate").val()==''){
		alert("请输入发生日期！");
		$("#new_occurDate").focus();
		return false;
	}
	if($("#new_material").val()==''){
		alert("请输入物料名称！");
		$("#new_material").focus();
		return false;
	}
	if($("#new_orderNo").val()==''){
		alert("请输入订单编号！");
		$("#new_orderNo").focus();
		return false;
	}
	if($("#new_description").val()==''){
		alert("请输入问题描述！");
		$("#new_description").focus();
		return false;
	}
	$('#form_add').ajaxSubmit({
		url: "addMaterialExceptionLogs",
		dataType : "json",
		type : "post",
	    data: {
	    	"occurDate" : $("#new_occurDate").val(),
	    	"bus_type" : $("#new_bus_type").val(),
			"factroy_id":$("#new_factory").val(),
			"material" : $("#new_material").val(),
			"orderNo" : $("#new_orderNo").val(),
			"description" : $("#new_description").val(),
			"bphoto" : $("#new_bphoto").val(),
			"fphoto" : $("#new_fphoto").val(),
			"tmpMeasures" : $("#new_tmpMeasures").val(),
			"faultReason" : $("#new_faultReason").val(),
			"impMeasures" : $("#new_impMeasures").val(),
			"workshop" : $('#new_workshop').val(),
			"bugLevel" : $("#new_bugLevel").val(),
			"expcFinishDate" : $("#new_expcFinishDate").val(),
			"respUnit" : $("#new_respUnit").val(),
			"respPerson" : $("#new_respPerson").val(),
			"verifier" : $("#new_verifier").val(),
			"verifyResult" : $("#new_verifyResult").val(),
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

function setBusType(order){
	//alert(order.busType);
	$("#new_bus_type").find("option:contains('"+order.busType+"')").attr("selected",true);
	//$("#edit_bus_type").find("option:contains('"+order.busType+"')").attr("selected",true);
    //$("#new_bus_type").val('3');
   // $("#edit_bus_type").val(order.busType);
}

function getBusType(element){
	$(element).empty();
	//$("#new_bus_type").empty();
	//$("#edit_bus_type").empty();
	$.ajax({
		url: "../common/getBusType",
		dataType: "json",
		data: {},
		async: false,
		error: function () {},
		success: function (response) {
			var strs = "";
		    $.each(response.data, function(index, value) {
		    	strs += "<option value=" + value.id + ">" + value.name + "</option>";
		    });
		    if(element=="#search_bustype"){
		    	$("#search_bustype").append("<option value=''>全部</option>" + strs);
		    }else{
		    	 $(element).append(strs);
		    }
		   
		    //$("#search_bustype").append("<option value=''>全部</option>" + strs);
		    //$("#new_bus_type").append(strs);
		    //$("#edit_bus_type").append(strs);
		    //$("#search_bustype").append(strs);
		}
	})
}
function ajaxQuery(){
	var bugLevel = [];
	$('input[name="search_bugLevel"]:checked').each(function() {
		bugLevel.push($(this).val());
	});
	bugLevel=bugLevel.join(",");
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
				"factoryId" : $("#search_factory").val(),
				"workshopId" : $("#search_workshop").val(),
				"bustypeId" : $("#search_bustype").val(),
				"material" : $("#search_material").val(),
				"orderNo" : $("#search_orderno").val(),
				"occurDateStart" : $("#search_date_start").val(),
				"occurDateEnd" : $("#search_date_end").val(),
				"bugLevel" : bugLevel
			};
            param.length = data.length;					//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;					//开始的记录序号
            param.page = (data.start / data.length)+1;	//当前页码

            $.ajax({
                type: "post",
                url: "getmaterialExceptionLogsList",
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
		            {"title":"工厂",width:'80',"class":"center","data":"factory_name","defaultContent": ""},
		            {"title":"车间",width:'75',"class":"center","data":"workshop_name","defaultContent": ""},
		            {"title":"车型",width:'80',"class":"center","data":"bus_type_code","defaultContent": ""},
		            {"title":"订单",width:'100',"class":"center","data":"order_name","defaultContent": ""},
		            {"title":"物料名称",width:'80',"class":"center","data":"material","defaultContent": ""},
		            {"title":"缺陷等级",width:'70',"class":"center","data":"bug_level","defaultContent": ""},
		            {"title":"责任单位",width:'80',"class":"center","data":"resp_unit","defaultContent": ""},
		            {"title":"责任人",width:'80',"class":"center","data":"resp_person","defaultContent": ""},
		            {"title":"预计完成时间",width:'100',"class":"center","data":"expc_finish_date","defaultContent": ""},
		            {"title":"验证结果",width:'80',"class":"center","data":"verify_result","defaultContent": ""},
		            {"title":"验证人",width:'60',"class":"center","data":"verifier","defaultContent": ""},
		            {"title":"发生日期",width:'120',"class":"center","data":"occur_date","defaultContent": ""},
		            {"title":"操作",width:'80',"class":"center","data":null,"defaultContent": "",
		            	"render": function ( data, type, row ) {
		            		return "<i class=\"glyphicon glyphicon-search bigger-130 showbus\" title=\"查看\" onclick='showExceptionLogs(" 
		            		+ row['id'] + ")' style='color:blue;cursor: pointer;'></i>" + 
		            		"&nbsp;&nbsp;&nbsp;<i class=\"glyphicon glyphicon-edit bigger-130 showbus\" title=\"编辑\" onclick='editExceptionLogs(" 
		            		+ row['id'] + ")' style='color:blue;cursor: pointer;'></i>"
		            	},
		            }
		          ],
	});
}
function clear(){
	$("#edit_material").val("");
	$("#edit_orderNo").val("");
	$("#edit_occurDate").val("");
	$("#edit_description").val("");
	$("#edit_tmpMeasures").val("");
	$("#edit_faultReason").val("");
	$("#edit_impMeasures").val("");
	$("#edit_expcFinishDate").val("");
	$("#edit_respUnit").val("");
	$("#edit_respPerson").val("");
	$("#edit_verifier").val("");
	$("#edit_memo").val("");
    $('#edit_bphoto').val("");
    $('#edit_fphoto').val("");
}