
$(document).ready(function(){
	getBusNumberSelect('#nav-search-input');

	ajaxQuery();
	
	$(".btnQuery").on("click",function(){
		ajaxQuery();
	});
	
	$("#btnDelete").on("click",function(){
		ajaxDelete();
	});

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/BMS/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})
	
	$(document).on("click","#btnAdd",function(){
		var dialog = $( "#dialog-add" ).removeClass('hide').dialog({
			width:600,
			modal: true,
			title: '<div class="widget-header"><h4 class="smaller"><i class="ace-icon fa fa-gear green"></i> 新增临时派工类型</h4></div>',
			title_html: true,
			buttons: [ 
				{
					text: "取消",
					"class" : "btn btn-minier",
					click: function() {
						$( this ).dialog( "close" ); 
						$("#addForm")[0].reset();
					} 
				},
				{
					text: "确定",
					"class" : "btn btn-primary btn-minier",
					click: function() {
						if($("#add_name").val()===""){
							alert("派工不能为空！");
							$("#add_name").focus();
							return false;
						}
						$.ajax({
						    url: "addTmpOrderType",
						    dataType: "json",
							type: "get",
						    data: {
						    	"name" : $("#add_name").val(),
						    	"cost_transfer" : $('input:radio[name="add_cost_transfer"]:checked').val(),
						    	
						    },
						    success:function(response){
						    	if(response.success){
						    	$.gritter.add({
									title: '系统提示：',
									text: '<h5>增加成功！</h5>',
									class_name: 'gritter-info'
								});
						    	$("#addForm")[0].reset();
						    	ajaxQuery();
						    	}else{
						    		$.gritter.add({
										title: '系统提示：',
										text: '<h5>增加失败！</h5><br>'+response.message,
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
	}); 
	
	$(document).on("click",".editVinRule",function(){
		$('#editId').val($(this).closest('tr').find('td').eq(0).find('input').eq(0).val());
		
		$('#edit_name').val($(this).closest('tr').find('td').eq(1).html());
		var cost_transfer=($(this).closest('tr').find('td').eq(2).html()=="否" ? "0":"1");
		$(":radio[name='edit_cost_transfer'][value='" + cost_transfer + "']").prop("checked", "checked");
		var dialog = $( "#dialog-edit" ).removeClass('hide').dialog({
			width:600,
			/*height:500,*/
			modal: true,
			title: '<div class="widget-header"><h4 class="smaller"><i class="ace-icon fa fa-gear green"></i> 编辑临时派工类型</h4></div>',
			title_html: true,
			buttons: [ 
				{
					text: "取消",
					"class" : "btn btn-minier",
					click: function() {
						$( this ).dialog( "close" ); 
						$("#editForm")[0].reset();
					} 
				},
				{
					text: "确定",
					"class" : "btn btn-primary btn-minier",
					click: function() {
						if($("#edit_name").val()===""){
							alert("派工类型不能为空！");
							$("#edit_name").focus();
							return false;
						}
					$.ajax({
					    url: "editTmpOrderType",
					    dataType: "json",
						type: "get",
					    data: {
					    	"id" : $("#editId").val(),
					    	"name" : $("#edit_name").val(),
					    	"cost_transfer":$('input:radio[name="edit_cost_transfer"]:checked').val(),
					    },
					    success:function(response){
					    	if(response.success){
					    	$.gritter.add({
								title: '系统提示：',
								text: '<h5>编辑成功！</h5>',
								class_name: 'gritter-info'
							});
					    	$("#editForm")[0].reset();
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
					$("#editForm")[0].reset();
					} 
				}
			]
		});
	}); 
});

function ajaxDelete(){
	var ids = '';
	$(":checkbox").each(function(){
		if($(this).prop("checked")){
			if($(this).attr('fid')){
				ids += $(this).attr('fid').split('_')[1] + ',';
			}
		}
	});
	if(ids===''){
		$.gritter.add({
			title: '系统提示：',
			text: '<h5>请至少勾选一条记录！</h5>',
			class_name: 'gritter-info'
		});
		return false;
	}
	$.ajax({
	    url: "deleteTmpOrderType",
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

function ajaxQuery(){
	dt=$("#tableData").DataTable({
		serverSide: true,
		fixedColumns:   {
            leftColumns: 0,
            rightColumns:0
        },
        serverSide: true,
		paiging:true,
		ordering:false,
		searching: false,
		bAutoWidth:false,
		destroy: true,
		sScrollY: $(window).height()-250,
		scrollX: true,
		/*scrollCollapse: true,*/
		pageLength: 12,
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
				"name":$("#search_name").val(),
				"cost_transfer":$("#search_cost_transfer").val(),
			};
            param.length = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;//开始的记录序号
            param.page = (data.start / data.length)+1;//当前页码



            $.ajax({
                type: "post",
                url: "getTmpOrderTypeList",
                cache: false,  //禁用缓存
                data: param,  //传入组装的参数
                dataType: "json",
                success: function (result) {
                	
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
		          	{"title":"<input type='checkbox' id='selectAll' onclick='selectAll()'/>","class":"center","data":"id","render": function ( data, type, row ) {
	                    return "<input class='id' value='"+data+"' type='hidden' /><input type='checkbox' fid='cb_"+data+"'>";
	                },"defaultContent": ""},
		            {"title":"派工类型","class":"center","data":"name","defaultContent": ""},
		            {"title":"成本是否可转移","class":"center","data":"cost_transfer","defaultContent": "","render": function ( data, type, row ) {
	                    return data=='0' ? "否" : "是";
	                },"defaultContent": ""},
	                {"title":"录入人","class":"center","data":"username","defaultContent": ""},
	                {"title":"录入时间","class":"center","data":"edit_date","defaultContent": ""},
		            {"title":"编辑","class":"center","data":null,"defaultContent": "<i class=\"ace-icon fa fa-pencil bigger-130 editVinRule\" style='color:green;cursor: pointer;'></i>"}
		          ],
		
		
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