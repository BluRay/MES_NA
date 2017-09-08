var detaillist=[];

$(document).ready(function(){
	initPage();
	
	$("#btnQuery").click(function(){
		ajaxQuery();
	});
	$("#btnAdd").click(function(){
		$("#factory").val("");
		$("#order_type").find("option :contains('标准订单')").attr("selected",true);
		$("#import_new").prop("checked",false);
		var tr=$("<tr />");
		$("<td width='50px'/>").html("1").appendTo(tr);
		$("<td />").html("<select class=\"input-medium workshop\" style=\"width:100%;border:0px;padding:0px;text-align:center\">"+
									"<option value=''>请选择</option></select>").appendTo(tr);
		$("<td />").html("<select class=\"input-medium process\" style=\"width:100%;border:0px;padding:0px;text-align:center\">"+
									"<option value=''>请选择</option></select>").appendTo(tr);
		$("<td />").appendTo(tr);
		$("<td />").appendTo(tr);
		$("<td />").appendTo(tr);
		var last_td="<i  class=\"fa fa-arrow-up\" style=\"cursor: pointer;color:blue\"></i> " +
		"<i class=\"fa fa-arrow-down\" style=\"cursor: pointer;color:blue\"></i> " +
		"<i class=\"fa fa-plus\" style=\"cursor: pointer;color:green\"></i> ";
		$("<td style=\"text-align: left;\" />").html(last_td).appendTo(tr);
		
		$("#processConfigTable tbody").html("").append(tr);
		var dialog = $( "#dialog-processConfig-new" ).removeClass('hide').dialog({
			width:800,
			height:470,
			modal: true,
			title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i>&nbsp;工序配置-新增</h4></div>",
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
						//$( this ).dialog( "close" ); 
					} 
				}
			]
		});
	});	
	
	//切换配置工厂、获取车间下拉框、重置工序下拉框
	$(document).on("change","#factory,#factory_edit",function(e){
		var tr=$("<tr />");
		$("<td width='50px'/>").html("1").appendTo(tr);
		$("<td />").html("<select class=\"input-medium workshop\" style=\"width:100%;border:0px;padding:0px;text-align:center\">"+
									"<option value=''>请选择</option></select>").appendTo(tr);
		$("<td />").html("<select class=\"input-medium process\" style=\"width:100%;border:0px;padding:0px;text-align:center\">"+
									"<option value=''>请选择</option></select>").appendTo(tr);
		$("<td />").appendTo(tr);
		$("<td />").appendTo(tr);
		$("<td />").appendTo(tr);
		var last_td="<i  class=\"fa fa-arrow-up\" style=\"cursor: pointer;color:blue\"></i> " +
		"<i class=\"fa fa-arrow-down\" style=\"cursor: pointer;color:blue\"></i> " +
		"<i class=\"fa fa-plus\" style=\"cursor: pointer;color:green\"></i> ";
		$("<td style=\"text-align: left;\" />").html(last_td).appendTo(tr);
		
		if($(this).attr("id")=='factory'){
			$("#processConfigTable tbody").html("").append(tr);
			getWorkshopSelect('',$("#factory :selected").text(),'','.workshop','请选择','id');
		}
		if($(this).attr("id")=='factory_edit'){
			$("#processConfigTable_edit tbody").html("").append(tr);
			getWorkshopSelect('',$("#factory_edit :selected").text(),'','.workshop','请选择','id');
		}
		
		$(".process").html("<option value=\"\">请选择</option>");

	})
	//切换配置车间获取工序下拉框
	 $(document).on("change",".workshop",function(e){
		 var workshop=$(this).find("option:selected").text();
		 var table=$(e.target).closest("table");
		 var table_id=$(table).attr("id");
		 //alert($(table).attr("id"))
		 var process_element=$(e.target).parent("td").next().find(".process");
		 var factory="";
		 if(table_id=='processConfigTable_edit'){			 
			 factory=$("#factory_edit :selected").text();
		 }
		 if(table_id=='processConfigTable'){			 
			 factory=$("#factory :selected").text();
		 }
		 process_element=$(e.target).parent("td").next().find(".process");
		 var process_list=getProcessListNoLine(factory,workshop);
		
		 getProcessList(process_list,process_element[0],'');
	 });
	//切换工序获取计划节点等信息
	$(document).on("change",".process",function(e){
		var select_option=$(this).find("option:selected");
		var monitory_point_flag=$(select_option).attr("monitory_point_flag")||"";
		var key_process_flag=$(select_option).attr("key_process_flag")||"";
		var plan_node=$(select_option).attr("plan_node")||"";
		var td=$(e.target).parent("td");
		var tds=$(td).siblings();
		
		$(tds[2]).html(monitory_point_flag);
		$(tds[3]).html(key_process_flag);
		$(tds[4]).html(plan_node);
	});
	
	
	//上移
	$(document).on("click",".fa-arrow-up",function(e){
		var tr_prev=$(e.target).parent("td").parent("tr").prev();
		if(tr_prev.length==0){
			alert("已经是第一行，无法上移！");
			return false;
		}
		var tr=$(e.target).parent("td").parent("tr");
		var tds=$(e.target).parent("td").siblings();
		var c_workshop_select=$(tds[1]).html();
		var c_workshop=$(tds[1]).find("select").val();
		var c_process_select=$(tds[2]).html();
		var c_process=$(tds[2]).find("select").val();
		var c_monitory_flag=$(tds[3]).html();
		var c_key_flag=$(tds[4]).html();	
		var c_plan_node=$(tds[5]).html();	
		
		var tr_prev=$(tr).prev();
		var tds_prev=$(tr_prev).children("td");
		var prev_workshop_select=$(tds_prev[1]).html();
		var prev_workshop=$(tds_prev[1]).find("select").val();
		var prev_process_select=$(tds_prev[2]).html();
		var prev_process=$(tds_prev[2]).find("select").val();
		var prev_monitory_flag=$(tds_prev[3]).html();
		var prev_key_flag=$(tds_prev[4]).html();	
		var prev_plan_node=$(tds_prev[5]).html();	
		
		$(tr_prev).children("td").eq(1).html(c_workshop_select);
		$(tr).children("td").eq(1).html(prev_workshop_select);
		$(tds_prev[1]).find("select").val(c_workshop);
		$(tds[1]).find("select").val(prev_workshop);
		$(tr_prev).children("td").eq(2).html(c_process_select);
		$(tr).children("td").eq(2).html(prev_process_select);
		$(tds_prev[2]).find("select").val(c_process);
		$(tds[2]).find("select").val(prev_process);
		$(tr_prev).children("td").eq(3).html(c_monitory_flag);
		$(tr).children("td").eq(3).html(prev_monitory_flag);
		$(tr_prev).children("td").eq(4).html(c_key_flag);
		$(tr).children("td").eq(4).html(prev_key_flag);
		$(tr_prev).children("td").eq(5).html(c_plan_node);
		$(tr).children("td").eq(5).html(prev_plan_node);
			
	});
	//下移
	$(document).on("click",".fa-arrow-down",function(e){
		var tr_next=$(e.target).parent("td").parent("tr").next();
		if(tr_next.length==0){
			alert("已经是最后一行，无法下移！");
			return false;
		}
		var tr=$(e.target).parent("td").parent("tr");
		var tds=$(e.target).parent("td").siblings();
		var c_workshop_select=$(tds[1]).html();
		var c_workshop=$(tds[1]).find("select").val();
		var c_process_select=$(tds[2]).html();
		var c_process=$(tds[2]).find("select").val();
		var c_monitory_flag=$(tds[3]).html();
		var c_key_flag=$(tds[4]).html();	
		var c_plan_node=$(tds[5]).html();	
		
		var tr_next=$(tr).next();
		var tds_next=$(tr_next).children("td");
		var nx_workshop_select=$(tds_next[1]).html();
		var nx_workshop=$(tds_next[1]).find("select").val();
		var nx_process_select=$(tds_next[2]).html();
		var nx_process=$(tds_next[2]).find("select").val();
		var nx_monitory_flag=$(tds_next[3]).html();
		var nx_key_flag=$(tds_next[4]).html();	
		var nx_plan_node=$(tds_next[5]).html();	
		
		$(tr_next).children("td").eq(1).html(c_workshop_select);
		$(tr).children("td").eq(1).html(nx_workshop_select);
		$(tds_next[1]).find("select").val(c_workshop);
		$(tds[1]).find("select").val(nx_workshop);
		$(tr_next).children("td").eq(2).html(c_process_select);
		$(tr).children("td").eq(2).html(nx_process_select);
		$(tds_next[2]).find("select").val(c_process);
		$(tds[2]).find("select").val(nx_process);
		$(tr_next).children("td").eq(3).html(c_monitory_flag);
		$(tr).children("td").eq(3).html(nx_monitory_flag);
		$(tr_next).children("td").eq(4).html(c_key_flag);
		$(tr).children("td").eq(4).html(nx_key_flag);
		$(tr_next).children("td").eq(5).html(c_plan_node);
		$(tr).children("td").eq(5).html(nx_plan_node);
	});
	//新增一行
	$(document).on("click",".fa-plus",function(e){
		var tr=$(e.target).parent("td").parent(tr);
		var trs=$(tr).nextAll();
		$.each(trs,function(i,tr){
			var index=Number($(tr).children("td").eq(0).html());
			$(tr).children("td").eq(0).html(index+1);
		})
		var tds=$(e.target).parent("td").siblings();
		var c_index=$(tds[0]).html();
		var workshop_select=$(tds[1]).html();
		var process_select=$(tds[2]).html();
		//var last_td=$(e.target).parent("td").html()+"<i class=\"fa fa-times\" style=\"cursor: pointer;color:red\"></i>";
		var last_td="<i  class=\"fa fa-arrow-up\" style=\"cursor: pointer;color:blue\"></i> " +
				"<i class=\"fa fa-arrow-down\" style=\"cursor: pointer;color:blue\"></i> " +
				"<i class=\"fa fa-plus\" style=\"cursor: pointer;color:green\"></i> "+
				"<i class=\"fa fa-times\" style=\"cursor: pointer;color:red\"></i> ";
		var tr_new=$("<tr />");
		$("<td />").html(Number(c_index)+1).appendTo(tr_new);
		$("<td />").html(workshop_select).appendTo(tr_new);
		$("<td />").html(process_select).appendTo(tr_new);
		$("<td />").html("").appendTo(tr_new);
		$("<td />").html("").appendTo(tr_new);
		$("<td />").html("").appendTo(tr_new);
		$("<td style=\"text-align: left;\" />").html(last_td).appendTo(tr_new);
		
		$(tr).after(tr_new);
	
		//alert(c_index);
	})
	//删除一行
	$(document).on("click","#processConfigTable  .fa-times,#processConfigTable_edit .fa-times",function(e){
		var tr=$(e.target).parent("td").parent(tr);
		var trs=$(tr).nextAll();
		$.each(trs,function(i,tr){
			var index=Number($(tr).children("td").eq(0).html());
			$(tr).children("td").eq(0).html(index-1);
		})
		$(e.target).parent("td").parent("tr").remove();
		
	})
	
	//导入标准工序
	$("#import_new,#import_edit").click(function(e){
		var tableId="";
		var factory="";
		if($(this).attr("id")=='import_new'){
			tableId="#processConfigTable";
			factory=$("#factory :selected").text();
		}else{
			tableId="#processConfigTable_edit";
			factory=$("#factory_edit :selected").text();
		}
		 $(tableId).find("tbody").html("");
		 
		 var process_list=getProcessListNoLine(factory,null);
		 //循环标准工序列表，填充表格
		 var workshop_process=getProcessListByFactory(factory);
		 var workshop_options=getWorkshopOptions(factory);
		 workshop_options = $.templates("#tmplWorkshopSelect").render(workshop_options);
		 
		if ($(this).is(":checked")) {
			if(factory=='请选择'){
				alert("请选择工厂!");
				return false;
			}
			
			 $.each(process_list,function(index,value){
				 var last_td="<i  class=\"fa fa-arrow-up\" style=\"cursor: pointer;color:blue\"></i> " +
					"<i class=\"fa fa-arrow-down\" style=\"cursor: pointer;color:blue\"></i> " +
					"<i class=\"fa fa-plus\" style=\"cursor: pointer;color:green\"></i> "+
					"<i class=\"fa fa-times\" style=\"cursor: pointer;color:red\"></i> ";
					if(index==0){
						last_td="<i  class=\"fa fa-arrow-up\" style=\"cursor: pointer;color:blue\"></i> " +
						"<i class=\"fa fa-arrow-down\" style=\"cursor: pointer;color:blue\"></i> " +
						"<i class=\"fa fa-plus\" style=\"cursor: pointer;color:green\"></i> ";
					}
				 var tr=$("<tr />");
					$("<td />").html(index+1).appendTo(tr);
					var workshop_select=$("<select class='input-medium workshop' style=\"width:100%;border:0px;padding:0px;text-align:center\" />")
					.append(workshop_options);			
					$("<td />").html(workshop_select).appendTo(tr);
					$(workshop_select).find("option:contains('"+value.workshop+"')").attr("selected",true);
					
					var process_select=$("<select class='input-medium process' style=\"width:100%;border:0px;padding:0px;text-align:center\" />");						
					$("<td />").html(process_select).appendTo(tr);
					getProcessList(workshop_process[value.workshop],process_select,value.process_name)
					
					$("<td />").html(value.monitory_point_flag).appendTo(tr);
					$("<td />").html(value.key_process_flag).appendTo(tr);
					$("<td />").html(value.plan_node).appendTo(tr);
					$("<td style=\"text-align: left;width:80px\"/>").html(last_td).appendTo(tr);
					$(tableId).find("tbody").append(tr);
		
			 })
			 
		}else{
			var tr=$("<tr />");
			$("<td width='50px'/>").html("1").appendTo(tr);
			var workshop_select=$("<select class='input-medium workshop' style=\"width:100%;border:0px;padding:0px;text-align:center\" />")
			.append("<option value=''>请选择</option>"+workshop_options);	
			$("<td />").html(workshop_select).appendTo(tr);
			$("<td />").html("<select class=\"input-medium process\" style=\"width:100%;border:0px;padding:0px;text-align:center\">"+
										"<option value=''>请选择</option></select>").appendTo(tr);
			$("<td />").appendTo(tr);
			$("<td />").appendTo(tr);
			$("<td />").appendTo(tr);
			var last_td="<i  class=\"fa fa-arrow-up\" style=\"cursor: pointer;color:blue\"></i> " +
			"<i class=\"fa fa-arrow-down\" style=\"cursor: pointer;color:blue\"></i> " +
			"<i class=\"fa fa-plus\" style=\"cursor: pointer;color:green\"></i> ";
			$("<td style=\"text-align: left;\" />").html(last_td).appendTo(tr);
			$(tableId).find("tbody").append(tr);
		}	
	})
	
	
})

function initPage(){
	getFactorySelect('','','#search_factory','全部','id');
	ajaxQuery();
	getKeysSelect("ORDER_TYPE", '', '#search_orderType','全部','name');
	getKeysSelect("ORDER_TYPE", '标准订单', '#order_type,#order_type_edit',null,'name');
	getFactorySelect('','','#factory,#factory_edit','请选择','id');
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
		/*scrollCollapse: true,*/
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
					"factory":$("#search_factory :selected").text(),
					"order_type":$("#search_orderType :selected").text(),
				};
            param.length = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;//开始的记录序号
            param.page = (data.start / data.length)+1;//当前页码

            $.ajax({
                type: "post",
                url: "getProcessConfigList",
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
                    //$('#checkall').prop("checked",false);//翻页后全选复选框复位
                }
            });
		
		},
		columns: [
/*		          	{"title":"<input type='checkbox' id='checkall' name='check'></input>","class":"center","data":"","defaultContent": "","render":function(data,type,row){
		            	return "<input type='checkbox' name='check' id='"+row.id+"'></input>";		            		
	            	}},*/
		            {"title":"工厂","class":"center","data":"factory","defaultContent": ""},
		            {"title":"订单类型","class":"center","data":"order_type","defaultContent": ""},
		            {"title":"维护人","class":"center","data":"editor","defaultContent": ""},
		            {"title":"维护时间","class":"center","data":"edit_date","defaultContent": ""},
		            {"title":"操作","class":"center","data":"","render":function(data,type,row){
		            	return "<i class=\"ace-icon fa fa-search bigger-130 editorder\" title='查看' onclick = 'showInfoPage(" + JSON.stringify(row)+ ");' style='color:green;cursor: pointer;'></i>&nbsp;&nbsp;&nbsp;&nbsp;"+
		            	"<i class=\"ace-icon fa fa-pencil bigger-130 editorder\" title='编辑' onclick = 'showEditPage(" + JSON.stringify(row)+ ");' style='color:blue;cursor: pointer;'></i>&nbsp;&nbsp;&nbsp;&nbsp;"+
		            	"<i class=\"ace-icon fa fa-times bigger-130 editorder\" title='删除' onclick = 'deleteProcessConfig(" + JSON.stringify(row)+ ");' style='color:red;cursor: pointer;'></i>&nbsp;&nbsp;&nbsp;&nbsp;";		            		
		            	}
		            }
		          ]	
	});
}

function showInfoPage(row){
	$("#factory_view").html(row.factory);
	$("#order_type_view").html(row.order_type);
	$("#processConfigTable_view tbody").html("");
	$.ajax({
		url : "getProcessConfigDetailList",
		dataType : "json",
		data : {
				factory:row.factory,
				order_type:row.order_type
			},
		async : false,
		error : function(response) {
			alert(response.message)
		},
		success : function(response) {
			$.each(response.data,function(index,value){
				var tr=$("<tr />");
				$("<td />").html(value.sequence).appendTo(tr);
				$("<td />").html(value.workshop).appendTo(tr);
				$("<td />").html(value.process_name).appendTo(tr);
				$("<td />").html(value.monitory_point_flag).appendTo(tr);
				$("<td />").html(value.key_process_flag).appendTo(tr);
				$("<td />").html(value.plan_node).appendTo(tr);
				$("#processConfigTable_view tbody").append(tr);
			})
		}
	});
	
	var dialog = $( "#dialog-processConfig-view" ).removeClass('hide').dialog({
		width:800,
		height:470,
		modal: true,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i>&nbsp;工序配置-查看</h4></div>",
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
}

function showEditPage(row){
	$("#factory_edit").find("option:contains('"+row.factory+"')").attr("selected",true);
	$("#factory_edit").prop("disabled",true);
	$("#order_type_edit").find("option:contains('"+row.order_type+"')").attr("selected",true);	
	$("#order_type_edit").prop("disabled",true);
	$("#import_edit").prop("checked",false);
	
	$("#processConfigTable_edit tbody").html("");
	var workshop_process=getProcessListByFactory(row.factory);
	//alert(JSON.stringify(workshop_process));
	var workshop_options=getWorkshopOptions(row.factory);
	workshop_options = $.templates("#tmplWorkshopSelect").render(workshop_options);
	
	$.ajax({
		url : "getProcessConfigDetailList",
		dataType : "json",
		data : {
				factory:row.factory,
				order_type:row.order_type
			},
		async : false,
		error : function(response) {
			alert(response.message)
		},
		success : function(response) {
			$.each(response.data,function(index,value){
				var last_td="<i  class=\"fa fa-arrow-up\" style=\"cursor: pointer;color:blue\"></i> " +
				"<i class=\"fa fa-arrow-down\" style=\"cursor: pointer;color:blue\"></i> " +
				"<i class=\"fa fa-plus\" style=\"cursor: pointer;color:green\"></i> "+
				"<i class=\"fa fa-times\" style=\"cursor: pointer;color:red\"></i> ";
				if(index==0){
					last_td="<i  class=\"fa fa-arrow-up\" style=\"cursor: pointer;color:blue\"></i> " +
					"<i class=\"fa fa-arrow-down\" style=\"cursor: pointer;color:blue\"></i> " +
					"<i class=\"fa fa-plus\" style=\"cursor: pointer;color:green\"></i> ";
				}
				var tr=$("<tr />");
				$("<td />").html(value.sequence).appendTo(tr);
				var workshop_select=$("<select class='input-medium workshop' style=\"width:100%;border:0px;padding:0px;text-align:center\" />")
				.append(workshop_options);			
				$("<td />").html(workshop_select).appendTo(tr);
				$(workshop_select).find("option:contains('"+value.workshop+"')").attr("selected",true);
				
				var process_select=$("<select class='input-medium process' style=\"width:100%;border:0px;padding:0px;text-align:center\" />");						
				$("<td />").html(process_select).appendTo(tr);
				getProcessList(workshop_process[value.workshop],process_select,value.process_name)
				
				$("<td />").html(value.monitory_point_flag).appendTo(tr);
				$("<td />").html(value.key_process_flag).appendTo(tr);
				$("<td />").html(value.plan_node).appendTo(tr);
				$("<td style=\"text-align: left;width:80px\"/>").html(last_td).appendTo(tr);
				$("#processConfigTable_edit tbody").append(tr);
			})
		}
	});
	
	
	var dialog = $( "#dialog-processConfig-edit" ).removeClass('hide').dialog({
		width:800,
		height:470,
		modal: true,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i>&nbsp;工序配置-修改</h4></div>",
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
					//$( this ).dialog( "close" ); 
				} 
			}
		]
	});
}


function getProcessList(data,element,selectval){
	var strs="<option value=\"\">请选择</option>";
	$(element).html("");
	$.each(data, function(index, value) {
		if (selectval == value.process_name) {
			strs += "<option value='" + value.process_name + "' selected='selected' plan_node='" +
			value.plan_node+"' monitory_point_flag='"+value.monitory_point_flag+"' key_process_flag='"+
			value.key_process_flag+ "' >"+ value.process_name + "</option>";
		} else {
			strs += "<option value='" + value.process_name +"' plan_node='" +
				value.plan_node+"' monitory_point_flag='"+value.monitory_point_flag+"' key_process_flag='"+
				value.key_process_flag+ "' >" + value.process_name + "</option>";
		}
	});
	$(element).append(strs);
	
}

/**
 * 根据工厂获取各个车间下的标准工序列表
 */
function getProcessListByFactory(factory){
	var process_workshop={};
	$.ajax({
		url : "getProcessListByFactory",
		dataType : "json",
		data : {
				factory:factory
			},
		async : false,
		error : function(response) {
			alert(response.message)
		},
		success : function(response) {
			$.each(response.data,function(index,value){
				var workshop=value.workshop
				var process_str=value.process_list;
				var processList=JSON.parse(process_str);
				process_workshop[workshop]=processList.process_list;			
			})
		}
	});
	return process_workshop;
}

function getWorkshopOptions(factory){
	var options=[];
	$.ajax({
		url : "/IMMS/common/getWorkshopSelectAuth",
		dataType : "json",
		data : {"function_url":'',"factory":factory},
		async : false,
		error : function(response) {
			alert(response.message)
		},
		success : function(response) {
			options=response.data
		}
	});
	return options;
}

function getProcessListNoLine(factory,workshop){
	var process_list=[];
	$.ajax({
		url : "getProcessListNoLine",
		dataType : "json",
		data : {
				factory:factory,
				workshop:workshop
			},
		async : false,
		error : function(response) {
			alert(response.message)
		},
		success : function(response) {
			process_list=response.data;
		}
	});
	return process_list;
}

/**
 * 新增工序配置
 */
function ajaxAdd(){
	var factory=$("#factory :selected").text();
	var order_type=$("#order_type :selected").text();
	if(factory=='请选择'){
		alert("请选择工厂!");
		return false;
	}

	var process_list=[];
	var trs=$("#processConfigTable tbody").children("tr");
	var flag=true;
	$.each(trs,function(index,tr){
		var tds=$(tr).children("td");
		var sequence=$(tds[0]).html();
		var workshop=$(tds[1]).find(".workshop").find("option:selected").text();
		var process_name=$(tds[2]).find(".process").find("option:selected").text();
		if(process_name=='请选择'){
			alert("请选择工序！");
			return false;
			flag=false;
		}
		
		var obj={};
		obj.sequence=sequence;
		obj.workshop=workshop;
		obj.process_name=process_name;
		obj.factory=factory;
		obj.order_type=order_type;
		process_list.push(obj);
	})
	if(process_list.length==0){
		alert("请配置工序列表！");
		flag=false;
	}
	if(flag){
		$.ajax({
			url : "addProcessConfig",
			type:"post",
			dataType : "json",
			data : {
					"process_list":JSON.stringify(process_list)
				},
			async : false,
			error : function(response) {
				alert(response.message)
			},
			success : function(response) {
				alert(response.message);
				ajaxQuery();
				$("#dialog-processConfig-new").dialog("close");
			}
		})
	}
	
}

/**
 * 编辑工序配置
 */
function ajaxEdit(){
	var factory=$("#factory_edit :selected").text();
	var order_type=$("#order_type_edit :selected").text();
	if(factory=='请选择'){
		alert("请选择工厂!");
		return false;
	}

	var process_list=[];
	var trs=$("#processConfigTable_edit tbody").children("tr");
	var flag=true;
	$.each(trs,function(index,tr){
		var tds=$(tr).children("td");
		var sequence=$(tds[0]).html();
		var workshop=$(tds[1]).find(".workshop").find("option:selected").text();
		var process_name=$(tds[2]).find(".process").find("option:selected").text();
		if(process_name=='请选择'){
			alert("请选择工序！");
			return false;
			flag=false;
		}
		
		var obj={};
		obj.sequence=sequence;
		obj.workshop=workshop;
		obj.process_name=process_name;
		obj.factory=factory;
		obj.order_type=order_type;
		process_list.push(obj);
	})
	if(process_list.length==0){
		alert("请配置工序列表！");
		flag=false;
	}
	if(flag){
		$.ajax({
			url : "editProcessConfig",
			type:"post",
			dataType : "json",
			data : {
					"process_list":JSON.stringify(process_list)
				},
			async : false,
			error : function(response) {
				alert(response.message)
			},
			success : function(response) {
				alert(response.message);
				ajaxQuery();
				$("#dialog-processConfig-edit").dialog("close");
			}
		})
	}
	
}

function deleteProcessConfig(row){
	if(confirm("确认删除该工序配置？")){
		$.ajax({
			type:"post",
			url : "deleteProcessConfig",
			dataType : "json",
			data : {
					"factory":row.factory,
					"order_type":row.order_type
				},
			async : false,
			error : function(response) {
				alert(response.message)
			},
			success : function(response) {
				alert(response.message);
				ajaxQuery();
			}
		})
	}
}