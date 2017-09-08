$(document).ready(function(){
	initPage();
	//工厂切换
	$('#search_factory').change(function(){
		getWorkshopSelect('',$("#search_factory :selected").text(),'','#search_workshop','全部','id');
		getLineSelect($("#search_factory :selected").text(),$("#search_workshop :selected").text(),'','#search_line','全部','id');
	})
	$('#factory').change(function(){
		getWorkshopSelect('',$("#factory :selected").text(),'','#workshop','请选择','id');
		//getLineSelect($("#factory :selected").text(),$("#workshop :selected").text(),'','#line','请选择','id');
	})
	//车间切换
	$("#search_workshop").change(function(){
		getLineSelect($("#search_factory :selected").text(),$("#search_workshop :selected").text(),'','#search_line','全部','id');
	});
/*	$("#workshop").change(function(){
		getLineSelect($("#factory :selected").text(),$("#workshop :selected").text(),'','#line','请选择','id');
	});*/
	
	//查询
	$("#btnQuery").click(function(){
		ajaxQuery();
	});
	//新增页面
	$("#btnAdd").click(function(){
		$("#factory").val("");
		$("#workshop").html("<option value=''>请选择</option>");
		//$("#line").html("<option value=''>请选择</option>");
		$("#plan_node").val("");
		$("#process_code").val("");
		$("#process_name").val("");
		$("#monitory_point_flag").prop("checked",false);
		$("#key_process_flag").prop("checked",false);
		$("#memo").val("");
		
		var dialog = $( "#dialog-process" ).removeClass('hide').dialog({
			width:600,
			height:370,
			modal: true,
			title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i>&nbsp;新增工序</h4></div>",
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
	
	//全选反选
	$(document).on("click","#checkall",function(){
		//alert("aa");
		if ($('#checkall').is(":checked")) {
			//alert("选中")
			check_All_unAll("#tableResult",true);
		}
		if($('#checkall').is(":checked")==false){
			
			check_All_unAll("#tableResult",false);
		}
		
	})
	
	//删除
	$("#btnDelete").click(function(){
		var checklist=$("#tableResult tbody").find(":checkbox:checked");
		//alert(checklist.length)
		var ids=[];
		if(checklist.length==0){
			alert("请至少选中一条需要删除的数据！");
			return false;
		}else{
			$.each(checklist,function(index,chkbox){
				var id=$(chkbox).prop("id");
				ids.push(id);
			})
			if(confirm("确认删除？")){
				ajaxDelete(ids);
			}
		}

	});
	
	
});

function initPage(){
	getFactorySelect('','','#search_factory','全部','id');
	ajaxQuery();
	getFactorySelect('','','#factory','请选择','id');
	getKeysSelect("PLAN_CODE", '', '#plan_node','请选择','id');
	getLineSelectStandard('','#line','请选择','id');
	//getWorkshopSelect('',$("#factory :selected").text(),'','#search_workshop','请选择','id');
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
					"workshop":$("#search_workshop :selected").text(),
					"line":$("#search_line :selected").text(),
					"monitoryPoint_flag":$("#input_monitoryPointFlag").is(":checked")?'1':'',
					"keyProcess_flag":$("#input_keyProcessFlag").is(":checked")?'1':'',
					"planNode_flag":$("#input_planNodeFlag").is(":checked")?'1':''
				};
            param.length = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;//开始的记录序号
            param.page = (data.start / data.length)+1;//当前页码

            $.ajax({
                type: "post",
                url: "getProcessList",
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
		          	{"title":"<input type='checkbox' id='checkall' name='check'></input>","class":"center","data":"","defaultContent": "","render":function(data,type,row){
		            	return "<input type='checkbox' name='check' id='"+row.id+"'></input>";		            		
	            	}},
		            {"title":"工厂","class":"center","data":"factory","defaultContent": ""},
		            {"title":"车间","class":"center","data":"workshop","defaultContent": ""},
		            {"title":"线别","class":"center","data":"line","defaultContent": ""},
		            {"title":"编号","class":"center","data":"process_code","defaultContent": ""},
		            {"title":"名称/工位","class":"center","data": "process_name","defaultContent": ""},
		            {"title":"生产监控点","class":"center","data":"monitory_point_flag","defaultContent": "","render":function(data,type,row){
		            	return data==0?'否':'是'
		            }},		            
		            {"title":"关键工序","class":"center","data":"key_process_flag","defaultContent": "","render":function(data,type,row){
		            	return data==0?'否':'是'
		            }},		            
		            {"title":"计划节点","class":"center","data": "plan_node_name","defaultContent": ""},
		            {"title":"备注","class":"center","data": "memo","defaultContent": ""},
		            {"title":"操作","class":"center","data":"","render":function(data,type,row){
		            	return "<i class=\"ace-icon fa fa-pencil bigger-130 editorder\" title='编辑' onclick = 'showEditPage(" + JSON.stringify(row)+ ");' style='color:green;cursor: pointer;'></i>";		            		
		            	}
		            }
		          ]	
	});
}

function showEditPage(row){
	$("#factory").find("option:contains('"+row.factory+"')").prop("selected",true);
	getWorkshopSelect('',$("#factory :selected").text(),row.workshop,'#workshop','请选择','id');
	getLineSelect($("#factory :selected").text(),$("#workshop :selected").text(),row.line,'#line','请选择','id');
	if(row.plan_node_name){
		$("#plan_node").find("option:contains('"+row.plan_node_name+"')").prop("selected",true);
	}else{
		$("#plan_node").find("option:contains('请选择')").prop("selected",true);
	}
	$("#process_code").val(row.process_code);
	$("#process_name").val(row.process_name);
	if(row.monitory_point_flag==1){
		$("#monitory_point_flag").prop("checked",true);
	}else
		$("#monitory_point_flag").prop("checked",false);
	if(row.key_process_flag==1){
		$("#key_process_flag").prop("checked",true);
	}else
		$("#key_process_flag").prop("checked",false);
	$("#memo").val(row.memo);
	$( "#dialog-process" ).removeClass('hide').dialog({
		width:600,
		height:370,
		modal: true,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i>&nbsp;编辑工序</h4></div>",
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
					ajaxEdit(row.id);
				} 
			}
		]
	});

}

function ajaxAdd(){
	var param={};
	param.factory=$("#factory :selected").text();
	param.workshop=$("#workshop :selected").text();
	param.line=$("#line :selected").text();
	param.plan_node_id=$("#plan_node").val()==''?0:$("#plan_node").val();
	param.process_code=$("#process_code").val();
	param.process_name=$("#process_name").val();
	param.monitory_point_flag=$("#monitory_point_flag").is(":checked")?'1':'0';
	param.key_process_flag=$("#key_process_flag").is(":checked")?'1':'0';
	param.memo=$("#memo").val();
	if(param.factory=='请选择'){
		alert("请选择工厂！");
		return false;
	}
	if(param.workshop=='请选择'){
		alert("请选择车间！");
		return false;
	}
	if(param.line=='请选择'){
		alert("请选择线别！");
		return false;
	}
	if(param.process_code.trim().length==0){
		alert("请填写工序编号！");
		return false;
	}
	if(param.process_name.trim().length==0){
		alert("请填写工序名称！");
		return false;
	}
	
	$.ajax({
        type: "post",
        url: "addProcess",
        cache: false,  //禁用缓存
        data: param,  //传入组装的参数
        dataType: "json",
        success: function (response) {
        	alert(response.message);
        	ajaxQuery();
        	$( "#dialog-process" ).dialog("close");
        },
        error:function(){
        	alert("系统异常，操作失败！");
        }
	});
}

function ajaxEdit(id){
	var param={};
	param.id=id;
	param.factory=$("#factory :selected").text();
	param.workshop=$("#workshop :selected").text();
	param.line=$("#line :selected").text();
	param.plan_node_id=$("#plan_node").val()||0;
	param.process_code=$("#process_code").val();
	param.process_name=$("#process_name").val();
	param.monitory_point_flag=$("#monitory_point_flag").is(":checked")?'1':'0';
	param.key_process_flag=$("#key_process_flag").is(":checked")?'1':'0';
	param.memo=$("#memo").val();
	
	if(param.factory=='请选择'){
		alert("请选择工厂！");
		return false;
	}
	if(param.workshop=='请选择'){
		alert("请选择车间！");
		return false;
	}
	if(param.line=='请选择'){
		alert("请选择线别！");
		return false;
	}
	if(param.process_code.trim().length==0){
		alert("请填写工序编号！");
		return false;
	}
	if(param.process_name.trim().length==0){
		alert("请填写工序名称！");
		return false;
	}
	
	$.ajax({
        type: "post",
        url: "editProcess",
        cache: false,  //禁用缓存
        data: param,  //传入组装的参数
        dataType: "json",
        success: function (response) {
        	alert(response.message);
        	ajaxQuery();
        	$( "#dialog-process" ).dialog("close");
        },
        error:function(){
        	alert("系统异常，操作失败！");
        }
	});
}

function ajaxDelete(ids){
	$.ajax({
        type: "post",
        url: "deleteProcess",
        cache: false,  //禁用缓存
        data: {
        	"ids":ids.toString()  //传入组装的参数
        },
        dataType: "json",
        success: function (response) {
        	alert(response.message);
        	ajaxQuery();
        },
        error:function(){
        	alert("系统异常，操作失败！");
        }
	});
}