var pageSize=1;
var table;
var table_height = $(window).height()-270;
$(document).ready(function(){
	initPage();
	
	function initPage(){
		getBusNumberSelect('#nav-search-input');
		getFactorySelect("quality/qaTargetParameter",'',"#search_factory","全部",'id');
		getKeysSelect("QUALITY_TARGET_PARAM", "", "#search_targetType","全部","value");
		getWorkshopSelect("quality/qaTargetParameter",$("#search_factory :selected").text(),"","#search_workshop","全部","id");
	}

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/BMS/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})
	
	$("#btnQuery").click (function () {
		ajaxQuery();
		return false;
	});
	
	$('#search_factory').change(function(){ 
		getWorkshopSelect("quality/qaTargetParameter",$("#search_factory :selected").text(),"","#search_workshop",null,"id");
	});
	$('#new_factory').change(function(){ 
		getWorkshopSelect("quality/qaTargetParameter",$("#new_factory :selected").text(),"","#new_workshop",null,"id");
	});
	
	$("#btnAdd").on('click', function(e) {
		getFactorySelect("quality/qaTargetParameter",'',"#new_factory",null,'id');
		getWorkshopSelect("quality/qaTargetParameter",$("#new_factory :selected").text(),"","#new_workshop",null,"id");
		getKeysSelect("QUALITY_TARGET_PARAM", "", "#new_targetType","全部","value");
		e.preventDefault();
		$("#dialog-add").removeClass('hide').dialog({
			resizable: false,
			title: '<div class="widget-header"><h4 class="smaller"><i class="ace-icon fa fa-users green"></i> 增加质量目标参数</h4></div>',
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

function btnNewConfirm(){
	var factory=$("#new_factory").val();
	var workshop=$("#new_workshop").val();
	var targetType=$("#new_targetType").val();
	var targetVal=$("#new_targetVal").val();
	var effectDateStart=$("#new_date_start").val();
	var effectDateEnd=$("#new_date_end").val();
	if(factory==''){
		alert("请选择工厂！");
		return false;
	}
	if(workshop==''){
		alert("请选择车间！");
		return false;
	} 
	if(targetType==''){
		alert("请选择参数类别！");
		return false;
	} 
	if(targetVal==''){
		alert("请输入目标值！");
		return false;
	}
	if(effectDateStart==''){
		alert("请输入有效日期！");
		return false;
	}
	if(effectDateEnd==''){
		alert("请输入有效日期！");
		return false;
	}
	
	$.ajax({
		url: "addQaTargetParam",
		dataType: "json",
		type: "get",
		data: {
				"factoryId" : factory,
				"workshopId" : workshop,
				"targetTypeId" : targetType,
				"targetVal" : targetVal,
				"effecDateStart" : effectDateStart,
				"effecDateEnd" : effectDateEnd
		},
		async: false,
		error: function () {alert(response.message);},
		success: function (response) {
			if(response.success){
				$.gritter.add({
					title: '系统提示：',
					text: '<h5>增加成功！</h5>',
					class_name: 'gritter-info'
				});
			}
			$("#dialog-add").dialog( "close" );
			ajaxQuery();
		}
	});
	
}

function ajaxQuery(){
	var factoryId=isNaN(parseInt($("#search_factory").val()))?0:parseInt($("#search_factory").val());
	var workshopId=isNaN(parseInt($("#search_workshop").val()))?0:parseInt($("#search_workshop").val());
	var targetTypeId=isNaN(parseInt($("#search_targetType").val()))?0:parseInt($("#search_targetType").val());
	var conditions="{factoryId:"+factoryId+",workshopId:"+workshopId+",targetTypeId:"+targetTypeId+
		",effecDateStart:'"+$("#date_start").val()+"',effecDateEnd:'"+$("#date_end").val()+"'}";
	
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
				"conditions":conditions
			};
            param.length = data.length;					//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;					//开始的记录序号
            param.page = (data.start / data.length)+1;	//当前页码

            $.ajax({
                type: "post",
                url: "getQaTargetParamList",
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
		            {"title":"车间",width:'80',"class":"center","data":"workshop_name","defaultContent": ""},
		            {"title":"参数类别",width:'80',"class":"center","data":"target_type","defaultContent": ""},
		            {"title":"目标值",width:'80',"class":"center","data":"target_value","defaultContent": ""},
		            {"title":"有效起始日",width:'80',"class":"center","data":"estart_date","defaultContent": ""},
		            {"title":"有效结束日",width:'80',"class":"center","data":"eend_date","defaultContent": ""},
		            {"title":"维护人",width:'80',"class":"center","data":"username","defaultContent": ""},
		            {"title":"维护时间",width:'80',"class":"center","data":"edit_date","defaultContent": ""},
		            {"title":"操作",width:'60',"class":"center","data":null,"defaultContent": "",
		            	"render": function ( data, type, row ) {
		            		return "<i class=\"glyphicon glyphicon-edit bigger-130 showbus\" title=\"编辑\" onclick='editTargetParamete(" 
		            		+ row['id'] + ",\"" + row['factory_id'] + "\",\"" + row['workshop_id'] + "\",\"" + row['target_type_id'] + "\",\""
		            		+ row['target_value'] + "\",\"" + row['estart_date'] + "\",\"" + row['eend_date'] 
		            		+ "\")' style='color:blue;cursor: pointer;'></i>" + 
		            		"&nbsp;&nbsp;&nbsp;<i class=\"glyphicon glyphicon-remove bigger-130 showbus\" title=\"删除\" onclick='deleteTargetParamete(" 
		            		+ row['id'] + ",\"" + row['factory_id'] + "\",\"" + row['workshop_id'] + "\",\"" + row['target_type_id'] + "\",\""
		            		+ row['target_value'] + "\",\"" + row['estart_date'] + "\",\"" + row['eend_date'] 
		            		+ "\")' style='color:blue;cursor: pointer;'></i>"
		            	},
		            }
		          ],
	});
	
}

function deleteTargetParamete(id,factory_id,workshop_id,target_type_id,target_value,estart_date,eend_date){
	if(confirm("确定要删除吗？")==true){
		console.log("deleteTargetParamete" + id);
		$.ajax({
			url: "updateQaTargetParam",
			dataType: "json",
			type: "get",
			data: {
					"id" : id,
					"factoryId" : factory_id,
					"workshopId" : workshop_id,
					"targetTypeId" : target_type_id,
					"targetVal" : target_value,
					"status" : "1",
					"effecDateStart" : estart_date,
					"effecDateEnd" : eend_date
			},
			async: false,
			error: function () {alert(response.message);},
			success: function (response) {
				if(response.success){
					$.gritter.add({
						title: '系统提示：',
						text: '<h5>删除成功！</h5>',
						class_name: 'gritter-info'
					});
				}
				//$("#dialog-edit").dialog( "close" );
				ajaxQuery();
			}
		});
	}
}

function editTargetParamete(id,factory_id,workshop_id,target_type_id,target_value,estart_date,eend_date){
	$("#edit_id").val(id);
	getFactorySelect("quality/qaTargetParameter",'',"#edit_factory",null,'id');
	$("#edit_factory").val(factory_id);
	getWorkshopSelect("quality/qaTargetParameter",$("#edit_factory :selected").text(),"","#edit_workshop",null,"id");
	$("#edit_workshop").val(workshop_id);
	getKeysSelect("QUALITY_TARGET_PARAM", "", "#edit_targetType","全部","value");
	$("#edit_targetType").val(target_type_id);
	$("#edit_targetVal").val(target_value);
	$("#edit_date_start").val(estart_date);
	$("#edit_date_end").val(eend_date);
	
	$("#dialog-edit").removeClass('hide').dialog({
		resizable: false,
		title: '<div class="widget-header"><h4 class="smaller"><i class="ace-icon fa fa-users green"></i> 编辑质量目标参数</h4></div>',
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
						btnEditConfirm();
					} 
				}
			]
	});
}

function btnEditConfirm(){
	var factory=$("#edit_factory").val();
	var workshop=$("#edit_workshop").val();
	var targetType=$("#edit_targetType").val();
	var targetVal=$("#edit_targetVal").val();
	var effectDateStart=$("#edit_date_start").val();
	var effectDateEnd=$("#edit_date_end").val();
	if(factory==''){
		alert("请选择工厂！");
		return false;
	}
	if(workshop==''){
		alert("请选择车间！");
		return false;
	} 
	if(targetType==''){
		alert("请选择参数类别！");
		return false;
	} 
	if(targetVal==''){
		alert("请输入目标值！");
		return false;
	}
	if(effectDateStart==''){
		alert("请输入有效日期！");
		return false;
	}
	if(effectDateEnd==''){
		alert("请输入有效日期！");
		return false;
	}
	
	$.ajax({
		url: "updateQaTargetParam",
		dataType: "json",
		type: "get",
		data: {
				"id" : $("#edit_id").val(),
				"factoryId" : factory,
				"workshopId" : workshop,
				"targetTypeId" : targetType,
				"targetVal" : targetVal,
				"status" : "0",
				"effecDateStart" : effectDateStart,
				"effecDateEnd" : effectDateEnd
		},
		async: false,
		error: function () {alert(response.message);},
		success: function (response) {
			if(response.success){
				$.gritter.add({
					title: '系统提示：',
					text: '<h5>编辑成功！</h5>',
					class_name: 'gritter-info'
				});
			}
			$("#dialog-edit").dialog( "close" );
			ajaxQuery();
		}
	});
}

