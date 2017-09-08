var pageSize=1;
var table;
var dt;
$(document).ready(function(){
	initPage();
	ajaxQuery();
	function initPage(){
		getBusNumberSelect('#nav-search-input');
		getBusTypeSelect("","#search_bus_type","全部","id");
		getOrderNoSelect("#search_order_no","#orderId");
		ajaxQuery();
	}
	$(".btnQuery").on("click",function(){
		ajaxQuery();
	}); 
	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/BMS/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})
	$("#btnBulkAdd").click (function () {
		$("#divBulkAdd").show();
	});
	
	$("#btnBulkHide").click (function () {
		$("#divBulkAdd").hide();
	});
	$(document).on("click","#btnAdd",function(){
		
		var dialog = $( "#dialog_add" ).removeClass('hide').dialog({
			width:600,
			modal: true,
			title: '<div class="widget-header"><h4 class="smaller"><i class="ace-icon fa fa-gear green"></i> 新增车型</h4></div>',
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
						ajaxAdd();
					} 
				}
			]
		});
	}); 
	$("#btnDelete").on("click",function(){
		ajaxDelete();
	});
	$("#btn_upload").click (function () {
		$("#uploadMasterPlanForm").ajaxSubmit({
			url:"uploadExtraWorkHourManager",
			type: "post",
			dataType:"json",
			success:function(response){
				
				if(response.success){
					ajaxQuery();
					$.gritter.add({
						title: '系统提示：',
						text: '<h5>'+response.message+'！</h5>',
						class_name: 'gritter-info'
					});
				}else{
					$.gritter.add({
						title: '系统提示：',
						text: '<h5>导入失败！</h5><br>'+response.message,
						class_name: 'gritter-info'
					});
				}
			}			
		});
	});
	$(document).on("click",".edit",function(){
		var id=$(this).closest('tr').find('td').eq(0).find('input').eq(0).val();
		$("#editId").val(id);
		$("#edit_tmp_order_type").val($(this).closest('tr').find('td').eq(1).html());
		$("#edit_no").val($(this).closest('tr').find('td').eq(2).html());
		$("#edit_order_no").val($(this).closest('tr').find('td').eq(3).html());
		$("#edit_bus_type").val($(this).closest('tr').find('td').eq(4).html());
		$("#edit_time").val($(this).closest('tr').find('td').eq(5).html());
		$("#edit_tmp_name").val($(this).closest('tr').find('td').eq(6).html());
		$("#edit_reason_content").val($(this).closest('tr').find('td').eq(7).html());
		$("#edit_description").val($(this).closest('tr').find('td').eq(8).html());
		$("#edit_single_hour").val($(this).closest('tr').find('td').eq(9).html());
		$("#edit_order_type").val($(this).closest('tr').find('td').eq(10).html());
		$("#edit_assesor").val($(this).closest('tr').find('td').eq(11).html());
		$("#edit_assess_verifier").val($(this).closest('tr').find('td').eq(12).html());
		$("#edit_duty_unit").val($(this).closest('tr').find('td').eq(13).html());
		$("#edit_memo").val($(this).closest('tr').find('td').eq(14).html());
		var dialog = $( "#dialog-edit" ).removeClass('hide').dialog({
			width:600,
			height:520,
			modal: true,
			title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i>编辑额外工时库</h4></div>",
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
						if($("#edit_tmp_order_type").val()===""){
							alert("额外类型不能为空！");
							$("#edit_tmp_order_type").focus();
							return false;
						}
						if($("#edit_no").val()===""){
							alert("编号不能为空！");
							$("#edit_no").focus();
							return false;
						}	
						$.ajax({
						    url: "editExtraWorkHourManager",
						    dataType: "json",
							type: "post",
						    data: {
						    	"id":$("#editId").val(),
								"tmp_order_type":$("#edit_tmp_order_type").val(),
								"no":$("#edit_no").val(),
								"bus_type":$("#edit_bus_type").val(),
								"order_no":$("#edit_order_no").val(),
								"time":$("#edit_time").val(),
								"tmp_name":$("#edit_tmp_name").val(),
								"reason_content":$("#edit_reason_content").val(),
								"description":$("#edit_description").val(),
								"single_hour":$("#edit_single_hour").val(),
								"order_type":$("#edit_order_type").val(),
								"assesor":$("#edit_assesor").val(),
								"assess_verifier":$("#edit_assess_verifier").val(),
								"duty_unit":$("#edit_duty_unit").val(),
								"memo":$("#edit_memo").val(),
						    },
						    success:function(response){
						    	if(response.success){
						    	$.gritter.add({
									title: '系统提示：',
									text: '<h5>编辑成功！</h5>',
									class_name: 'gritter-info'
								});
						    	ajaxQuery();
						    	}else{
						    		$.gritter.add({
										title: '系统提示：',
										text: '<h5>编辑失败！</h5><br>'+response.message,
										class_name: 'gritter-info'
									});
						    	}
						    }
						});
						$( this ).dialog( "close" );
					} 
				}
			]
		});	
	//}
	});
});

function ajaxQuery(){
	dt=$("#tableData").DataTable({
		serverSide: true,
		
        paging:true,
		ordering:false,
		searching: false,
		bAutoWidth:false,
		destroy: true,
		sScrollY: document.documentElement.clientHeight-250 + 'px',
		scrollX: "100%",
		/*scrollCollapse: true,*/
		pageLength: 10,
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
				"order_no":$("#search_order_no").val(),
				"bus_type":$("#search_bus_type").val(),
				"order_type":$("#search_order_type").val(),
				"reason_content":$("#search_reason_content").val()
			};
            param.length = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;//开始的记录序号
            param.page = (data.start / data.length)+1;//当前页码

            $.ajax({
                type: "post",
                url: "getExtraWorkHourManagerList",
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
                }
            });
		
		},
		columns: [
			{"title":"<input type='checkbox' id='selectAll' onclick='selectAll()'/>","class":"center","data":"id","render": function ( data, type, row ) {
			    return "<input id='id' value='"+data+"' type='hidden' /><input type='checkbox' fid='cb_"+data+"'>";
			},"defaultContent": ""},
            {"title":"额外类型","class":"center","data":"tmp_order_type","defaultContent": ""},
            {"title":"编号","class":"center","data":"no","defaultContent": ""},
            {"title":"订单","class":"center","data":"order_no","defaultContent": ""},
            {"title":"车型","class":"center","data":"bus_type","defaultContent": ""},
            {"title":"时间","class":"center","data":"time","defaultContent": ""},
            {"title":"名称","class":"center","data":"tmp_name","defaultContent": ""},
            {"title":"作业内容","class":"center","data":"reason_content","defaultContent": ""},
            {"title":"说明","class":"center","data":"description","defaultContent": ""},
            {"title":"单工时","class":"center","data":"single_hour","defaultContent": ""},
            {"title":"评估人","class":"center","data":"assesor","defaultContent": ""},
            {"title":"评估审核人","class":"center","data":"assess_verifier","defaultContent": ""},
            {"title":"责任部门","class":"center","data":"duty_unit","defaultContent": ""},
            	            		            
            {"title":"派工类型","class":"center","data": "order_type","defaultContent": ""},
            {"title":"备注","class":"center","data":"memo","defaultContent": ""},
            {"title":"编辑","class":"center","data":null,"render":function(data,type,row){
            	return "<i class=\"ace-icon fa fa-pencil bigger-130 edit\" style='color:green;cursor: pointer;'></i>"},
            	"defaultContent": "<i class=\"ace-icon fa fa-pencil bigger-130\" style='color:green;cursor: pointer;'></i>"}
          ],
	});

}

function ajaxAdd (argument) {

    $.ajax({
		type: "post",
		dataType: "json",
		url: "",
	    data: {
			
		},
		async: false,
	    success:function (response) {
	    	
	    	if (response.success) {
	    		$( "#dialog_add" ).dialog( "close" ); 
	    		ajaxQuery();
	    	} else {
	    		alert(response.message);
	    	}
	    },
	    error:function(){alert();}
	});
	
}
function ajaxDelete(){
	var ids = '';
	$(":checkbox").each(function(){
		if($(this).prop("checked")){
			//alert($(this).attr('fid'));
			if($(this).attr('fid')){
				ids += $(this).attr('fid').split('_')[1] + ',';
			}
		}
	});
	if(ids===''){
		$.gritter.add({
			title: '系统提示：',
			text: '<h5>请至少勾选一个要删除的记录！</h5>',
			class_name: 'gritter-info'
		});
		return false;
	}
	$.ajax({
	    url: "deleteExtraWorkHourManager",
	    dataType: "json",
		type: "get",
	    data: {
	    	"ids" : ids.substring(0,ids.length-1)
	    },
	    success:function(response){
	    	if(response.success){
	    	$.gritter.add({
				title: '系统提示：',
				text: '<h5>删除成功！</h5>',
				class_name: 'gritter-info'
			});
	    	
	    	ajaxQuery();
	    	}else{
	    		$.gritter.add({
					title: '系统提示：',
					text: '<h5>删除失败！</h5><br>'+response.message,
					class_name: 'gritter-info'
				});
	    	}
	    }
	});
}

//复选框全选或反选
function selectAll() {
    if ($("#selectAll").prop("checked")) {
        $(":checkbox").prop("checked", true);
    } else {
        $(":checkbox").prop("checked", false);
    }
}
