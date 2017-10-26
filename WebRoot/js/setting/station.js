$(document).ready(function(){
	initPage();
	//工厂切换
	$('#search_factory').change(function(){
		getWorkshopSelect('',$("#search_factory :selected").text(),'','#search_workshop','All','id');
		getLineSelect($("#search_factory :selected").text(),$("#search_workshop :selected").text(),'','#search_line','All','id');
	})
	$('#factory').change(function(){
		getWorkshopSelect('',$("#factory :selected").text(),'','#workshop','Please Choose','id');
		//getLineSelect($("#factory :selected").text(),$("#workshop :selected").text(),'','#line','请选择','id');
	})
	//车间切换
	$("#search_workshop").change(function(){
		getLineSelect($("#search_factory :selected").text(),$("#search_workshop :selected").text(),'','#search_line','All','id');
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
		$("#workshop").html("<option value=''>Please Choose</option>");
		//$("#line").html("<option value=''>请选择</option>");
		$("#plan_node").val("");
		$("#station_code").val("");
		$("#station_name").val("");
		$("#monitory_point_flag").prop("checked",false);
		$("#key_station_flag").prop("checked",false);
		$("#memo").val("");
		
		var dialog = $( "#dialog-process" ).removeClass('hide').dialog({
			width:720,
			height:450,
			modal: true,
			title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i>&nbsp;Add Station</h4></div>",
			title_html: true,
			buttons: [ 
				{
					text: "Cancel",
					"class" : "btn btn-minier",
					click: function() {
						$( this ).dialog( "close" ); 
					} 
				},
				{
					text: "Save",
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
			alert("At least one station must be checked！");
			return false;
		}else{
			$.each(checklist,function(index,chkbox){
				var id=$(chkbox).prop("id");
				ids.push(id);
			})
			if(confirm("Confirm delete？")){
				ajaxDelete(ids);
			}
		}

	});
	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/MES/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	});
	
});

function initPage(){
	getFactorySelect('','','#search_factory','All','id');
	ajaxQuery();
	getFactorySelect('','','#factory','Please Choose','id');
	getKeysSelect("PLAN_CODE", '', '#plan_node','Please Choose','id');
	getLineSelectStandard('','#line','Please Choose','id');
	getBusNumberSelect('#nav-search-input');
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
		},
		ajax:function (data, callback, settings) {
			var param ={
					"draw":1,
					"factory":$("#search_factory :selected").text(),
					"workshop":$("#search_workshop :selected").text(),
					"line":$("#search_line :selected").text(),
					"monitoryPoint_flag":$("#input_monitoryPointFlag").is(":checked")?'1':'',
					"keyStation_flag":$("#input_keyStationFlag").is(":checked")?'1':'',
					"planNode_flag":$("#input_planNodeFlag").is(":checked")?'1':''
				};
            param.length = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;//开始的记录序号
            param.page = (data.start / data.length)+1;//当前页码

            $.ajax({
                type: "post",
                url: "getStationList",
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
		            {"title":"Plant","class":"center","data":"factory","defaultContent": ""},
		            {"title":"Workshop","class":"center","data":"workshop","defaultContent": ""},
		            {"title":"Line","class":"center","data":"line","defaultContent": ""},
		            {"title":"Station Code","class":"center","data":"station_code","defaultContent": ""},
		            {"title":"Station","class":"center","data": "station_name","defaultContent": ""},
		            {"title":"Monitory Station","class":"center","data":"monitory_point_flag","defaultContent": "","render":function(data,type,row){
		            	return data==0?'No':'Yes'
		            }},		            
		            {"title":"Key Station","class":"center","data":"key_station_flag","defaultContent": "","render":function(data,type,row){
		            	return data==0?'No':'Yes'
		            }},		            
		            {"title":"Plan Node","class":"center","data": "plan_node_name","defaultContent": ""},
		            {"title":"Memo","class":"center","data": "memo","defaultContent": ""},
		            {"title":"","class":"center","data":"","render":function(data,type,row){
		            	return "<i class=\"ace-icon fa fa-pencil bigger-130 editorder\" title='Edit' onclick = 'showEditPage(" + JSON.stringify(row)+ ");' style='color:green;cursor: pointer;'></i>";		            		
		            	}
		            }
		          ]	
	});
}

function showEditPage(row){
	$("#factory").find("option:contains('"+row.factory+"')").prop("selected",true);
	getWorkshopSelect('',$("#factory :selected").text(),row.workshop,'#workshop','Please Choose','id');
	getLineSelectStandard(row.line,'#line','Please Choose','id');
	if(row.plan_node_name){
		$("#plan_node").find("option:contains('"+row.plan_node_name+"')").prop("selected",true);
	}else{
		$("#plan_node").find("option:contains('Please Choose')").prop("selected",true);
	}
	$("#station_code").val(row.station_code);
	$("#station_name").val(row.station_name);
	if(row.monitory_point_flag==1){
		$("#monitory_point_flag").prop("checked",true);
	}else
		$("#monitory_point_flag").prop("checked",false);
	if(row.key_station_flag==1){
		$("#key_station_flag").prop("checked",true);
	}else
		$("#key_station_flag").prop("checked",false);
	$("#memo").val(row.memo);
	$( "#dialog-process" ).removeClass('hide').dialog({
		width:720,
		height:450,
		modal: true,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i>&nbsp;Edit Station</h4></div>",
		title_html: true,
		buttons: [ 
			{
				text: "Cancel",
				"class" : "btn btn-minier",
				click: function() {
					$( this ).dialog( "close" ); 
				} 
			},
			{
				text: "Save",
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
	param.station_code=$("#station_code").val();
	param.station_name=$("#station_name").val();
	param.monitory_point_flag=$("#monitory_point_flag").is(":checked")?'1':'0';
	param.key_station_flag=$("#key_station_flag").is(":checked")?'1':'0';
	param.memo=$("#memo").val();
	if(param.factory=='Please Choose'){
		alert("Please choose factory！");
		return false;
	}
	if(param.workshop=='Please Choose'){
		alert("Please choose workshop！");
		return false;
	}
	if(param.line=='Please Choose'){
		alert("Please choose line！");
		return false;
	}
	if(param.station_code.trim().length==0){
		alert("Station no. can't be blank！");
		return false;
	}
	if(param.station_name.trim().length==0){
		alert("Station name can't be blank！");
		return false;
	}
	
	$.ajax({
        type: "post",
        url: "addStation",
        cache: false,  //禁用缓存
        data: param,  //传入组装的参数
        dataType: "json",
        success: function (response) {
        	alert(response.message);
        	ajaxQuery();
        	$( "#dialog-process" ).dialog("close");
        },
        error:function(){
        	alert("System exception, operation failed！");
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
	param.station_code=$("#station_code").val();
	param.station_name=$("#station_name").val();
	param.monitory_point_flag=$("#monitory_point_flag").is(":checked")?'1':'0';
	param.key_station_flag=$("#key_station_flag").is(":checked")?'1':'0';
	param.memo=$("#memo").val();
	
	if(param.factory=='Please Choose'){
		alert("Please choose factory！");
		return false;
	}
	if(param.workshop=='Please Choose'){
		alert("Please choose workshop！");
		return false;
	}
	if(param.line=='Please Choose'){
		alert("Please choose line！");
		return false;
	}
	if(param.station_code.trim().length==0){
		alert("Station no. can't be blank！");
		return false;
	}
	if(param.station_name.trim().length==0){
		alert("Station name can't be blank！");
		return false;
	}
	
	$.ajax({
        type: "post",
        url: "editStation",
        cache: false,  //禁用缓存
        data: param,  //传入组装的参数
        dataType: "json",
        success: function (response) {
        	alert(response.message);
        	ajaxQuery();
        	$( "#dialog-process" ).dialog("close");
        },
        error:function(){
        	alert("System exception, operation failed！");
        }
	});
}

function ajaxDelete(ids){
	$.ajax({
        type: "post",
        url: "deleteStation",
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
        	alert("System exception, operation failed！");
        }
	});
}