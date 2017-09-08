var json_tpl_list=null;
$(document).ready(function(){
	initPage();
	$("#btnQuery").on("click",function(){
		ajaxQuery();
	}); 

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/BMS/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})
	
	$(document).on("input","#search_order_no",function(){
		//alert("change");
		$("#search_order_no").attr("order_id","");
	})
	$("#search_order_no").change(function(){
		getOrderConfigSelect($(this).attr("order_id")||"","","#search_order_config","全部","id") ;
	})
	
	$(document).on("input","#order",function(){
		//alert("change");
		$("#order").attr("order_id","");
	})
	$("#order").change(function(){
		getOrderConfigSelect($(this).attr("order_id")||"","","#order_config","请选择","id") ;
	})
	/**
	 * 匹配车型模板
	 */
	$("#btnQueryTpl").click(function(){
		var tpl_header_id=$("#order").attr("tpl_header_id")||"";
		if(tpl_header_id!=""){
			json_tpl_list=getTplDetailByHeader(tpl_header_id);
		}else
			json_tpl_list=getBusTplDetail();
		
		drawTplDetailTable("#tplDetailTable",json_tpl_list,true);
	})	
	
	$(document).on("click","#btnCopy",function(){
		$("#create_form").resetForm();
		$("#bus_type").attr("disabled",true);
		$("#order").attr("disabled",false);
		$("#order_config").attr("disabled",false);
		$("#order").attr("tpl_header_id","");
		$("#order").attr("order_id","");
		$("#bus_type").attr("bus_type_id","");
		getOrderNoSelect("#order","#orderId",function(obj){
			//alert(obj.busType);
			$("#bus_type").val(obj.busType).attr("bus_type_id",obj.bus_type_id);
		});
		//$("#bus_type").prop("disabled",true);
		getKeysSelect("CHECK_NODE", "", "#node","请选择","id")
		$("#node").prop("disabled",false); 
		$("#tplDetailTable").html("");
		var dialog = $( "#dialog-config" ).removeClass('hide').dialog({
			width:900,
			height:550,
			modal: true,
			title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i>车型成品记录表模板导入</h4></div>",
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
						ajaxSave(); 
					} 
				}
			]
		});
	})

})

function initPage(){
	getBusNumberSelect('#nav-search-input');
	getBusTypeSelect('','#search_bus_type','全部','id');
	getKeysSelect("CHECK_NODE", "", "#search_node","全部","id") 
	getOrderNoSelect("#search_order_no","#orderId",null,$('#search_bus_type').val());
	ajaxQuery();
}

function ajaxQuery(){
	$("#tableResult").DataTable({
		serverSide: true,
		paiging:true,
		ordering:false,
		searching: false,
		bAutoWidth:false,
		destroy: true,
		sScrollY: $(window).height()-250,
		scrollX: true,
		pageLength: 20,
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
					"bus_type_id":$("#search_bus_type").val(),
					"order_id":$("#search_order_no").attr("order_id"),
					"order_config_id":$("#search_order_config").val(),
					"test_node_id":$("#search_node").val()
				};
            param.length = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;//开始的记录序号
            param.page = (data.start / data.length)+1;//当前页码

            $.ajax({
                type: "post",
                url: "getPrdRcdOrderTplList",
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
		          	{"title":"车型(版本)","class":"center","data":"bus_type","defaultContent": "","render":function(data,type,row){
		          		return data+"("+row.version_cp+")";
		          	}},
		          	{"title":"订单","class":"center","data":"order_desc","defaultContent": ""},
		          	{"title":"配置","class":"center","data":"order_config","defaultContent": ""},
		            {"title":"检验节点","class":"center","data":"test_node","defaultContent": ""},
		            {"title":"版本号","class":"center","data":"version","defaultContent": ""},
		            {"title":"维护人","class":"center","data": "editor","defaultContent": ""},
		            {"title":"维护时间","class":"center","data":"edit_date","defaultContent": ""},		            	            
		            {"title":"操作","class":"center","data":"","render":function(data,type,row){
		            	return "<i class=\"glyphicon glyphicon-search bigger-130 showbus\" title='查看' onclick = 'showInfoPage(" + JSON.stringify(row)+");' style='color:blue;cursor: pointer;'></i>&nbsp;&nbsp;&nbsp;"+ 
		            	"<i class=\"ace-icon fa fa-pencil bigger-130 editorder\" title='编辑' onclick = 'showEditPage(" + JSON.stringify(row)+ ");' style='color:green;cursor: pointer;'></i>";
		            	}
		            }
		          ]
	});
}

function drawTplDetailTable(tableId,data,editable){
	editable=editable||false;
	var tb=$(tableId).DataTable({
		paiging:false,
		 keys: true,
		ordering:false,
		searching: false,
		autoWidth:false,
		destroy: true,
		paginate:false,
		rowsGroup:[0],
		/*//sScrollY: $(window).height()-250,
		scrollX: true,*/
		scrollCollapse: false,
		lengthChange:false,
		orderMulti:false,
		info:false,
		language: {
			emptyTable:"",					     
			infoEmpty:"",
			zeroRecords:"未匹配到车型模板！"
		},
		columnDefs: [{
            "targets": [0,1,2,3],
            "createdCell": function (td, cellData, rowData, row, col) {
            	if(editable){
            		$(td).bind("click",function(){
                		//alert(td.rowSpan);
            			showEditDialog(td, cellData, rowData, row, col);
                	});
            	}          	
             }
        }],
		data:data||{},
		columns: [
		            {"title":"检验项目","class":"center","data":"test_item","defaultContent": ""},
		            {"title":"检验标准","class":"center","width":"40%","data":"test_standard","defaultContent": ""},
		            {"title":"要求","class":"center","data": "test_request","defaultContent": ""},
		            {"title":"是否必录项","class":"center","width":"10%","data":"is_null","defaultContent": ""},		            	            
		          ]	
	});
	
}

function showEditPage(row){
	$("#order").attr("order_id",row.order_id);
	$("#order").val(row.order_no).prop("disabled",true);
	$("#order").attr("tpl_header_id",row.id);
	$("#bus_type").attr("bus_type_id",row.bus_type_id);
	$("#bus_type").val(row.bus_type);
	$("#bus_type").prop("disabled",true);
	getKeysSelect("CHECK_NODE", row.test_node_id, "#node","请选择","id");
	$("#node").prop("disabled",true);
	getOrderConfigSelect(row.order_id||"",row.order_config_id,"#order_config","请选择","id") ;
	$("#order_config").prop("disabled",true);
	var detail_list=getTplDetailByHeader(row.id)
	json_tpl_list=detail_list;
	var version_cp=row.version_cp;
	drawTplDetailTable("#tplDetailTable",detail_list,true);
	
	var dialog = $( "#dialog-config" ).removeClass('hide').dialog({
		width:900,
		height:550,
		modal: true,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i>订单成品记录表模板录入</h4></div>",
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
					ajaxSave(row.id); 
				} 
			}
		]
	});
}

function showInfoPage(row){
	//getBusTypeSelect(row.bus_type_id,'#bus_type','请选择','id');
	$("#order").val(row.order_no).prop("disabled",true);
	$("#bus_type").val(row.bus_type);
	$("#bus_type").prop("disabled",true);
	getKeysSelect("CHECK_NODE", row.test_node_id, "#node","请选择","id");
	$("#node").prop("disabled",true);
	getOrderConfigSelect(row.order_id||"",row.order_config_id,"#order_config","请选择","id") ;
	$("#order_config").prop("disabled",true);
	var detail_list=getTplDetailByHeader(row.id)
	drawTplDetailTable("#tplDetailTable",detail_list,false);
	$("#uploadForm").hide();
	var dialog = $( "#dialog-config" ).removeClass('hide').dialog({
		width:900,
		height:550,
		modal: true,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i>订单成品记录表模板查看</h4></div>",
		title_html: true,
		buttons: [ 
		/*	{
				text: "取消",
				"class" : "btn btn-minier",
				click: function() {
					$( this ).dialog( "close" ); 
				} 
			},*/
			{
				text: "关闭",
				"class" : "btn btn-primary btn-minier",
				click: function() {
					$( this ).dialog( "close" ); 
				} 
			}
		]
	});
}

function getTplDetailByHeader(tpl_header_id){
	var detail_list=null;
	$.ajax({
		url:"getPrdRcdOrderTplDetail",
		type:"post",
		async:false,
		dataType:"json",
		data:{
			tpl_header_id:tpl_header_id
		},
		success:function(response){
			detail_list=response.data;
		}
	})
	return detail_list;
}

function showEditDialog(td, cellData, rowData, row, col){
	$("#edit_content").val(cellData);
	var dialog = $( "#dialog-editTplTable" ).removeClass('hide').dialog({
		width:400,
		height:200,
		modal: true,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i>模板维护</h4></div>",
		title_html: true,
		buttons: [ 
			{
				text: "新增",
				"class" : "btn btn-primary btn-minier",
				click: function() {
					//alert(JSON.stringify(rowData))
					var test_item=col==0?$("#edit_content").val():rowData.test_item;
					var insertData={
							test_item:test_item,
							test_standard:(col==1?$("#edit_content").val():""),
							is_null:(col==3?$("#edit_content").val():"否"),
							test_request:(col==2?$("#edit_content").val():"")
					};
					/*if(col>0){
						 insertData={
									test_item:rowData.test_item,
									test_standard:"",
									is_null:"否",
									test_request:""
							};
					}*/
					var rowSpan=1;
					if(col==0){
						rowSpan=td.rowSpan;
					}
					
					json_tpl_list.splice(row+rowSpan,0,insertData);
					drawTplDetailTable("#tplDetailTable",json_tpl_list,true);
					$( this ).dialog( "close" ); 
				} 
			},
			{
				text: "删除",
				"class" : "btn btn-danger btn-minier",
				click: function() {
					//$(td).parent("tr").remove();
					var rowSpan=td.rowSpan;

					json_tpl_list.splice(row,rowSpan);
					
					drawTplDetailTable("#tplDetailTable",json_tpl_list,true);
					$( this ).dialog( "close" ); 
				} 
			},
			{
				text: "保存",
				"class" : "btn btn-success btn-minier",
				click: function() {
					var rowSpan=1;
					if(col==0){
						rowSpan=td.rowSpan;
					}
					if(col==0){						
						while(rowSpan!=0){
							rowSpan--;
							json_tpl_list[(row+rowSpan)].test_item=$("#edit_content").val();
						}
					}
					if(col==1){
						json_tpl_list[row].test_standard=$("#edit_content").val();
					}
					if(col==2){
						json_tpl_list[row].test_request=$("#edit_content").val();				
					}
					if(col==3){
						if($("#edit_content").val()!='是'&&$("#edit_content").val()!='否'){
							alert("请填写”是“或者”否“！");
							return false;
						}
						json_tpl_list[row].is_null=$("#edit_content").val();
					}
					drawTplDetailTable("#tplDetailTable",json_tpl_list,true);
					$( this ).dialog( "close" );
				} 
			}
		]
	});
}

function ajaxSave(tpl_header_id){
	var bus_type_id=$("#bus_type").attr("bus_type_id");
	var test_node_id=$("#node").val()||"";
	var test_node=$("#node :selected").text();
	var order_id=$("#order").attr("order_id")||"";
	var order_config_id=$("#order_config").val()||"";
	var tpl_header_id=tpl_header_id;
	if(bus_type_id==""){
		alert("请选择车型！");
		return false;
	}
	if(test_node_id==""){
		alert("请选择检验节点！");
		return false;
	}
	if(order_id==""){
		alert("请输入有效订单！");
		return false;
	}
	if(order_config_id==""){
		alert("请选择订单配置！");
		return false;
	}
	if(!json_tpl_list){
		alert("未匹配到车型模板！");
		return false;
	}
	
	$.ajax({
		url:"savePrdRcdOrderTypeTpl",
		type:"post",
		dataType:"json",
		data:{
			bus_type_id:bus_type_id,
			test_node_id:test_node_id,
			test_node:test_node,
			order_id:order_id,
			order_config_id:order_config_id,
			version_cp:json_tpl_list[0].version_cp,
			tpl_list_str:JSON.stringify(json_tpl_list),
			tpl_header_id:tpl_header_id
		},
		success:function(response){
			alert(response.message);
			ajaxQuery();
			$( "#dialog-config" ).dialog("close");
		}
	})
}

function getBusTplDetail(){
	var bus_type_id=$("#bus_type").attr("bus_type_id");
	var test_node_id=$("#node").val();
	var detail_list=null;
	$.ajax({
		url:"getPrdRcdBusTypeTplDetailLatest",
		type:"post",
		async:false,
		dataType:"json",
		data:{
			bus_type_id:bus_type_id,
			test_node_id:test_node_id
		},
		success:function(response){
			detail_list=response.data;
		}
	})
	return detail_list;
}