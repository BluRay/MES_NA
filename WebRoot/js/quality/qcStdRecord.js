
$(document).ready(function(){
	getBusNumberSelect('#nav-search-input');
	$("#addForm")[0].reset()
	ajaxQuery();

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/BMS/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})
	
	$(".btnQuery").on("click",function(){
		ajaxQuery();
	});
	
//	$("#btnDelete").on("click",function(){
//		ajaxDelete();
//	});
	
	$(document).on("click","#btnAdd",function(){
		$("#afile").val("");
    	$("#recordNo").val("");
    	$("#stdFileName").val("");
    	$("#usynopsis").val("");
    	$("#bfile").val("");
    	$("#memo").val("");
		var dialog = $( "#dialog-add" ).removeClass('hide').dialog({
			width:600,
			modal: true,
			title: '<div class="widget-header"><h4 class="smaller"><i class="ace-icon fa fa-gear green"></i> 品质标准更新记录新增</h4></div>',
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
						if($("#recordNo").val()===""){
							alert("记录编号不能为空！");
							$("#recordNo").focus();
							return false;
						}
						
						if($("#stdFileName").val()===""){
							alert("标准文件名称不能为空！");
							$("#stdFileName").focus();
							return false;
						}
						if($("#usynopsis").val()===""){
							alert("更新摘要内容不能为空！");
							$("#usynopsis").focus();
							return false;
						}
						if($("#afile").val()===""){
							alert("请选择更替后附件！");
							$("#afile").focus();
							return false;
						}
						$("#addForm").submit();
						$( this ).dialog( "close" ); 
					} 
				}
			]
		});
		return false;
	}); 
	
	$(document).on("click",".show",function(){
		var id=$(this).closest('tr').find('td').eq(0).find('input').eq(0).val();
		
		$.ajax({
			url:"showStdRecord",
			type: "post",
			data:{
				"id":id
			},
			dataType:"json",
			success:function(response){
				$('#recordNo_show').val(response.stdRecord.recordNo);
				$('#stdFileName_show').val(response.stdRecord.standardfile);
				$('#usynopsis_show').val(response.stdRecord.usynopsis);
				var val=$('#urlPath').val();
				if(response.stdRecord.bfilePath!=null){
					$('#bfile_path').text("查看");
					$('#bfile_path').attr("href",val+response.stdRecord.bfilePath);
				}else{
					$('#bfile_path').text("");
				}
				
				$('#afile_path').attr("href",val+response.stdRecord.afilePath);
				$("#memo_show").val(response.stdRecord.memo);
				$("#mailAddrs_show").val(response.stdRecord.mailAddrs);
			}
		})
		var dialog = $( "#dialog-edit" ).removeClass('hide').dialog({
			width:600,
			/*height:500,*/
			modal: true,
			title: '<div class="widget-header"><h4 class="smaller"><i class="ace-icon fa fa-gear green"></i> 品质标准更新记录查看</h4></div>',
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
//				{
//					text: "确定",
//					"class" : "btn btn-primary btn-minier",
//					click: function() {
//					$.ajax({
//					    url: "",
//					    dataType: "json",
//						type: "get",
//					    data: {},
//					    success:function(response){
//					    	if(response.success){
//					    	$.gritter.add({
//								title: '系统提示：',
//								text: '<h5>编辑成功！</h5>',
//								class_name: 'gritter-info'
//							});
//					    	$("#editForm")[0].reset();
//					    	ajaxQuery();
//					    	}else{
//					    		$.gritter.add({
//									title: '系统提示：',
//									text: '<h5>编辑失败！</h5><br>'+response.message,
//									class_name: 'gritter-info'
//								});
//					    	}
//					    }
//					});
//					$( this ).dialog( "close" ); 
//					} 
//				}
			]
		});
	}); 

});

function ajaxQuery(){

	$("#tableData").dataTable({
		serverSide: true,
		fixedColumns:   {
            leftColumns: 0,
            rightColumns:0
        },
        paging:false,
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
				"recordNo":$("#search_recordNo").val(),
				"stdFileName":$("#search_stdFileName").val(),
				"start_date":$("#start_date").val(),
				"end_date":$("#end_date").val(),
			};
            param.length = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;//开始的记录序号
            param.page = (data.start / data.length)+1;//当前页码

            $.ajax({
                type: "post",
                url: "showRecordList",
                cache: false,  //禁用缓存
                data: param,  //传入组装的参数
                dataType: "json",
                success: function (result) {
                	
                    console.log(result);
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
          	{"title":"<input type='checkbox' id='selectAll' onclick='selectAll()'/>","class":"center","data":"id","render": function ( data, type, row ) {
                return "<input id='id' value='"+data+"' type='hidden' /><input type='checkbox' fid='cb_"+data+"'>";
            },"defaultContent": ""},

            {"title":"记录编号","class":"center","data":"recordNo","defaultContent": ""},
            {"title":"更新内容摘要","class":"center","data":"usynopsis","defaultContent": ""},
            {"title":"标准文件编号/名称","class":"center","data":"standardfile","defaultContent": ""},
            {"title":"更新人","class":"center","data":"editor","defaultContent": ""},
            {"title":"更新时间","class":"center","data": "editDate","defaultContent": ""},
            {"title":"查看","class":"center","data":null,"defaultContent": "<i class=\"glyphicon glyphicon-search bigger-110 show\" style='color:green;cursor: pointer;'></i>"}
          ],
	});
	
}

function setInput(value){
	var input="<input type='text' value='"+value+"' />";
	return input;
} 

//复选框全选或反选
function selectAll() {
    if ($("#selectAll").prop("checked")) {
        $(":checkbox").prop("checked", true);
    } else {
        $(":checkbox").prop("checked", false);
    }
}