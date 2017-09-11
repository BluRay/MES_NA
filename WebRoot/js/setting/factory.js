/*var pageSize=1;
var table;
var cur_year="";*/
$(document).ready(function(){
	/*cur_year = new Date().getFullYear();
	cur_year = new Date().getFullYear();
	$("#search_productive_year").html('<option value="'+cur_year+'">'+cur_year+'</option><option value="'+(cur_year-1)+'">'+(cur_year-1)+'</option><option value="'+(cur_year+1)+'">'+(cur_year+1)+'</option><option value="'+(cur_year+2)+'">'+(cur_year+2)+'</option>');	
	$("#productive_year").html('<option value="'+cur_year+'">'+cur_year+'</option><option value="'+(cur_year-1)+'">'+(cur_year-1)+'</option><option value="'+(cur_year+1)+'">'+(cur_year+1)+'</option><option value="'+(cur_year+2)+'">'+(cur_year+2)+'</option>');	
	$("#edit_productive_year").html('<option value="'+cur_year+'">'+cur_year+'</option><option value="'+(cur_year-1)+'">'+(cur_year-1)+'</option><option value="'+(cur_year+1)+'">'+(cur_year+1)+'</option><option value="'+(cur_year+2)+'">'+(cur_year+2)+'</option>');	
	getOrderNoSelect("#search_order_no","#orderId");
	getFactorySelect();
	getBusType();*/
	ajaxQuery();
	
	$(".btnQuery").on("click",function(){
		ajaxQuery();
	});
	
	/*$("#btnAdd").on("click",function(){
		ajaxAdd();
	});*/
	
	$("#btnDelete").on("click",function(){
		ajaxDelete();
	});
	
	$(document).on("click","#btnAdd",function(){
		var dialog = $( "#dialog-add" ).removeClass('hide').dialog({
			width:600,
			modal: true,
			title: '<div class="widget-header"><h4 class="smaller"><i class="ace-icon fa fa-gear green"></i> Add Plant</h4></div>',
			title_html: true,
			buttons: [ 
				{
					text: "Cancel",
					"class" : "btn btn-minier",
					click: function() {
						$( this ).dialog( "close" ); 
						$("#addForm")[0].reset();
					} 
				},
				{
					text: "Save",
					"class" : "btn btn-primary btn-minier",
					click: function() {
						if($("#addFactoryName").val()===""){
							alert("Plant name can't be blank！");
							$("#addFactoryName").focus();
							return false;
						}
						if($("#addFactoryCode").val()===""){
							alert("Plant code can't be blank！");
							$("#addFactoryCode").focus();
							return false;
						}
						if($("#addShortName").val()===""){
							alert("Short name can't be blank！");
							$("#addShortName").focus();
							return false;
						}
						if($("#addCapacity").val()===""){
							alert("Capacity can't be blank！");
							$("#addCapacity").focus();
							return false;
						}
						if($("#addArea").val()===""){
							alert("Area can't be blank！");
							$("#addArea").focus();
							return false;
						}
						$.ajax({
						    url: "addFactory",
						    dataType: "json",
							type: "get",
						    data: {
						    	"factory_name" : $("#addFactoryName").val(),
						    	"factory_code" : $("#addFactoryCode").val(),
						    	"short_name" : $("#addShortName").val(),
						    	"capacity" : $("#addCapacity").val(),
						    	"area" : $("#addArea").val(),
						    	"memo" : $("#addMemo").val(),
						    },
						    success:function(response){
						    	if(response.success){
						    	$.gritter.add({
									title: 'Message：',
									text: '<h5>Plant Saved！</h5>',
									class_name: 'gritter-info'
								});
						    	$("#addForm")[0].reset();
						    	ajaxQuery();
						    	}else{
						    		$.gritter.add({
										title: 'Message：',
										text: '<h5>Save failed！</h5><br>'+response.message,
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
	
	$(document).on("click",".editfactory",function(){
		$('#editId').val($(this).closest('tr').find('td').eq(0).find('input').eq(0).val());
		$('#editFactoryName').val($(this).closest('tr').find('td').eq(1).html());
		$('#editFactoryCode').val($(this).closest('tr').find('td').eq(2).html());
		$('#editShortName').val($(this).closest('tr').find('td').eq(3).html());
		$('#editCapacity').val($(this).closest('tr').find('td').eq(4).html());
		$('#editArea').val($(this).closest('tr').find('td').eq(5).html());
		$('#editMemo').val($(this).closest('tr').find('td').eq(7).html());
		
		var dialog = $( "#dialog-edit" ).removeClass('hide').dialog({
			width:600,
			/*height:500,*/
			modal: true,
			title: '<div class="widget-header"><h4 class="smaller"><i class="ace-icon fa fa-gear green"></i> Edit Plant</h4></div>',
			title_html: true,
			buttons: [ 
				{
					text: "Cancel",
					"class" : "btn btn-minier",
					click: function() {
						$( this ).dialog( "close" ); 
						$("#editForm")[0].reset();
					} 
				},
				{
					text: "Save",
					"class" : "btn btn-primary btn-minier",
					click: function() {
						if($("#editFactoryName").val()===""){
							alert("Plant name can't be blank！");
							$("#editFactoryName").focus();
							return false;
						}
						if($("#editFactoryCode").val()===""){
							alert("Plant code can't be blank！");
							$("#editFactoryCode").focus();
							return false;
						}
						if($("#editShortName").val()===""){
							alert("Short name can't be blank！");
							$("#editShortName").focus();
							return false;
						}
						if($("#editCapacity").val()===""){
							alert("Capacity can't be blank！");
							$("#editCapacity").focus();
							return false;
						}
						if($("#editArea").val()===""){
							alert("Area can't be blank！");
							$("#editArea").focus();
							return false;
						}
					$.ajax({
					    url: "updateFactory",
					    dataType: "json",
						type: "get",
					    data: {
					    	"id" : $("#editId").val(),
					    	"factory_name" : $("#editFactoryName").val(),
					    	"factory_code" : $("#editFactoryCode").val(),
					    	"short_name" : $("#editShortName").val(),
					    	"capacity" : $("#editCapacity").val(),
					    	"area" : $("#editArea").val(),
					    	"memo" : $("#editMemo").val(),
					    },
					    success:function(response){
					    	if(response.success){
					    	$.gritter.add({
								title: 'Message：',
								text: '<h5>Saved successfully！</h5>',
								class_name: 'gritter-info'
							});
					    	$("#editForm")[0].reset();
					    	ajaxQuery();
					    	}else{
					    		$.gritter.add({
									title: 'Message：',
									text: '<h5>Save failed！</h5><br>'+response.message,
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
	
	
});

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
			title: 'Message：',
			text: '<h5>At least one plant must be checked！</h5>',
			class_name: 'gritter-info'
		});
		return false;
	}
	$.ajax({
	    url: "deleteFactory",
	    dataType: "json",
		type: "get",
	    data: {
	    	"ids" : ids.substring(0,ids.length-1)
	    },
	    success:function(response){
	    	if(response.success){
	    	$.gritter.add({
				title: 'Message：',
				text: '<h5>Delete plant success！</h5>',
				class_name: 'gritter-info'
			});
	    	
	    	ajaxQuery();
	    	}else{
	    		$.gritter.add({
					title: 'Message：',
					text: '<h5>Delete plant failed！</h5><br>'+response.message,
					class_name: 'gritter-info'
				});
	    	}
	    }
	});
}

function ajaxQuery(){
	$("#tableData").dataTable({
		serverSide: true,
		fixedColumns:   {
            leftColumns: 0,
            rightColumns:0
        },
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
			emptyTable:"No data available in table！",
			info:"Got a total of _TOTAL_ entries to show _PAGE_ of _PAGES_ pages",
			infoEmpty:"",
			paginate: {
			  first:"First",
		      previous: "Previous",
		      next:"Next",
		      last:"Last",
		      loadingRecords: "Please wait - loading...",		     
			}
		},
		ajax:function (data, callback, settings) {
			var param ={
				"draw":1,
				"factory":$("#search_factory").val()
			};
            param.length = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;//开始的记录序号
            param.page = (data.start / data.length)+1;//当前页码

            $.ajax({
                type: "post",
                url: "getFactoryList",
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
		          	{"title":"<input type='checkbox' id='selectAll' onclick='selectAll()'/>","class":"center","data":"id","render": function ( data, type, row ) {
	                    return "<input id='id' value='"+data+"' type='hidden' /><input type='checkbox' fid='cb_"+data+"'>";
	                },"defaultContent": ""},
		            {"title":"Plant Name","class":"center","data":"factoryName",/*"render": function ( data, type, row ) {
	                    return "<input style='border:0;width:100%;height:100%;background-color:transparent;text-align:center;' value='"+data+"' />";
	                },*/"defaultContent": ""},
		            {"title":"Plant Code","class":"center","data":"factoryCode","defaultContent": ""},
		            {"title":"Short Name","class":"center","data":"shortName","defaultContent": ""},
		            {"title":"Capacity","class":"center","data":"capacity","defaultContent": ""},
		            {"title":"Area","class":"center","data":"area","defaultContent": ""},
		            {"title":"Memo","class":"center","data": "memo","defaultContent": ""},
		            /*{"title":"工厂地址","class":"center","data":null,"defaultContent": ""},*/		            
		            {"title":"Editor","class":"center","data":"editor","defaultContent": ""},		            
		            {"title":"Edit Date","class":"center","data": "editDate","defaultContent": ""},
		            /*{"title":"订单状态","class":"center","data":"status","render":function(data,type,row){
		            	return data=="0"?"未开始":(data=="1"?"生产中":"已完成")},"defaultContent":""
		            },*/
		            
		            {"title":"Edit","class":"center","data":null,"defaultContent": "<i class=\"ace-icon fa fa-pencil bigger-130 editfactory\" style='color:green;cursor: pointer;'></i>"}
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