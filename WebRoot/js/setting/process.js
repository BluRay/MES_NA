$(document).ready(function(){
	initPage();
	//工厂切换
	$('#search_factory').change(function(){
		getWorkshopSelect('',$("#search_factory :selected").text(),'','#search_workshop','All','id');
	})
	$('#factory').change(function(){
		getWorkshopSelect('',$("#factory :selected").text(),'','#workshop','Please Choose','id');
	})
	//车间切换
	$("#workshop").change(function(){
		getStationSelect($("#factory :selected").text(),$("#workshop :selected").text(),'','#station','Please Choose','id');
	});
	
	//查询
	$("#btnQuery").click(function(){
		ajaxQuery();
	});
	//新增页面
	$("#btnAdd").click(function(){
		$("#factory").val("");
		$("#workshop").html("<option value=''>Please Choose</option>");
		$("#station").html("<option value=''>Please Choose</option>");
		$("#process_code").val("");
		$("#process_name").val("");
		$("#memo").val("");
		
		var dialog = $( "#dialog-process" ).removeClass('hide').dialog({
			width:680,
			height:370,
			modal: true,
			title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i>&nbsp;Add Process</h4></div>",
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
			alert("At least one process must be checked！");
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
	getBusNumberSelect('#nav-search-input');
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
					"station":$("#search_station :selected").val(),
					"process":$("#search_process :selected").val()
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
		            {"title":"Plant","class":"center","data":"factory","defaultContent": ""},
		            {"title":"Workshop","class":"center","data":"workshop","defaultContent": ""},
		            {"title":"Station","class":"center","data":"station","defaultContent": ""},
		            {"title":"Process Code","class":"center","data":"process_code","defaultContent": ""},
		            {"title":"Process Name","class":"center","data": "process_name","defaultContent": ""},
		            {"title":"Process Description","class":"center","data": "memo","defaultContent": ""},
		            {"title":"","class":"center","data":"","render":function(data,type,row){
		            	return "<i class=\"ace-icon fa fa-pencil bigger-130 editorder\" title='edit' onclick = 'showEditPage(" + JSON.stringify(row)+ ");' style='color:green;cursor: pointer;'></i>";		            		
		            	}
		            }
		          ]	
	});
}

function showEditPage(row){
	$("#factory").find("option:contains('"+row.factory+"')").prop("selected",true);
	getWorkshopSelect('',$("#factory :selected").text(),row.workshop,'#workshop','Please Choose','id');
	getStationSelect($("#factory :selected").text(),$("#workshop :selected").text(),row.station,'#station','Please Choose','id');
	$("#process_code").val(row.process_code);
	$("#process_name").val(row.process_name);
	$("#memo").val(row.memo);
	$( "#dialog-process" ).removeClass('hide').dialog({
		width:680,
		height:370,
		modal: true,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i>&nbsp;Edit Process</h4></div>",
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
	param.station=$("#station :selected").text();
	param.process_code=$("#process_code").val();
	param.process_name=$("#process_name").val();
	param.memo=$("#memo").val();
	if(param.factory=='Please Choose'){
		alert("Please choose factory！");
		return false;
	}
	if(param.workshop=='Please Choose'){
		alert("Please choose workshop！");
		return false;
	}
	if(param.station=='Please Choose'){
		alert("Please choose station！");
		return false;
	}
	if(param.process_code.trim().length==0){
		alert("Process code can't be blank！");
		return false;
	}
	if(param.process_name.trim().length==0){
		alert("Process name can't be blank！");
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
        	alert("System exception, operation failed！");
        }
	});
}

function ajaxEdit(id){
	var param={};
	param.id=id;
	param.factory=$("#factory :selected").text();
	param.workshop=$("#workshop :selected").text();
	param.station=$("#station :selected").text();
	param.process_code=$("#process_code").val();
	param.process_name=$("#process_name").val();
	param.memo=$("#memo").val();
	
	if(param.factory=='Please Choose'){
		alert("Please choose factory！");
		return false;
	}
	if(param.workshop=='Please Choose'){
		alert("Please choose workshop！");
		return false;
	}
	if(param.station=='Please Choose'){
		alert("Please choose station！");
		return false;
	}
	if(param.process_code.trim().length==0){
		alert("Process code can't be blank！");
		return false;
	}
	if(param.process_name.trim().length==0){
		alert("Process name can't be blank！");
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
        	alert("System exception, operation failed！");
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
        	alert("System exception, operation failed！");
        }
	});
}