var pageSize=1;
var cur_year="";
var dt;
$(document).ready(function(){
	getBusNumberSelect('#nav-search-input');
	getFactorySelect("production/vinInfo",'',"#search_factory","All",'id');
	getOrderNoSelect("#search_project_no","#orderId");
	$("#btnQuery").on("click",function(){
		ajaxQuery();
	}); 
	$('#file').ace_file_input({
		no_file:'Please Choose xls File...',
		btn_choose:'Choose File',
		btn_change:'Change File',
		droppable:false,
		onchange:null,
		thumbnail:false, //| true | large
		allowExt: ['xlsx','xls'],
	}).on('file.error.ace', function(event, info) {
		alert("Please Choose xls File!");
    });
	ajaxQuery();

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("../production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})
	$("#btn_upload").click (function () {
		if($("#file").val()==''){
			alert(Warn['P_common_07']);
			return false;
		}
		$(".divLoading").addClass("fade in").show();
		$("#uploadForm").ajaxSubmit({
			url:"uploadProjectVinInfo",
			type: "post",
			dataType:"json",
			data:{"project_id":$("#project_id").val()},
			success:function(response){
				if(response.success){	
					if($.fn.dataTable.isDataTable("#tableVinImport")){
						$('#tableVinImport').DataTable().destroy();
						$('#tableVinImport').empty();
					}
					var datalist=response.data;
					var columns=[
			            {"title":"No.","class":"center","data":"no","defaultContent": ""},
			            {"title":"Bus No.","class":"center","data": "bus_number","defaultContent": ""},
			            {"title":"VIN","class":"center","data": "vin","defaultContent": ""},
			            {"title":"","class":"center","data": "error","defaultContent": "","render":function(data,type,row){
			            	var desc="";
			            	if(data!=''){
			            		var messageArr=data.split(";");
			            		for(var i=0;i<messageArr.length;i++){
			            			if(messageArr[i]!=''){
			            			    desc+=Warn[messageArr[i]]+";";
			            			}
			            		}
			            	}
			            	return desc;
			            }}
			        ];
					$("#tableVinImport").DataTable({
						paiging:false,
						ordering:false,
						processing:true,
						searching: false,
						autoWidth:false,
						paginate:false,
						sScrollY: $(window).height()-320,
						scrollX: true,
						scrollCollapse: true,
						lengthChange:false,
						orderMulti:false,
						info:false,
						language: {},
						aoColumnDefs : [
							{  
			                "aTargets" :[3], // 错误信息不为空， 该行用红色字体标示
			                "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) { 
			                	if($(nTd).text()!=''){
			                		//数据格式错误 整行用红色字体标示
			                		$(nTd).parent().css('color', '#ff0000');
				                	$(nTd).css('color', '#ff0000').css('font-weight', 'bold').css('width','200px');
			                	}
			                }   
			                },
			            ],
			            buttons: [
		          	        {extend:'excelHtml5',title:'data_export',className:'black',text:'<i class=\"fa fa-file-excel-o bigger-130\" tooltip=\"excel\"></i>'},
		          	    ],
						data:datalist,
						columns:columns
					});
				}
				$(".divLoading").hide();
			},
			complete:function(){
				$(".remove").click();
			}	
		});
		$(".save").show();
	});
});

function ajaxQuery(){
	dt=$("#tableResult").DataTable({
		serverSide: true,
		dom: 'Bfrtip',
		lengthMenu: [
	        [ 20, 50,100, -1 ],
	        [ 'Show 20 rows', 'Show 30 rows', 'Show 50 rows', 'Show all rows' ]
	    ],
	    buttons: [
	        {extend:'excelHtml5',title:'data_export',className:'black',text:'<i class=\"fa fa-file-excel-o bigger-130\" tooltip=\"excel\"></i>'},
	        {extend:'pageLength',/*text:'显示行'*/}      
	    ],
		paiging:true,
		ordering:false,
		searching: false,
		autoWidth:false,
		destroy: true,
		scrollY: $(window).height()-250,
		scrollX: $(window).width(),
		pageLength: 20,
		pagingType:"full_numbers",
		lengthChange:false,
		orderMulti:false,
		ajax:function (data, callback, settings) {
			var param ={
				"draw":1,
				"project_no":$("#search_project_no").val(),
				"status":$("#search_status").val(),
				"factory":getAllFromOptions("#search_factory","val")
			};
            param.length = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;//开始的记录序号
            param.page = (data.start / data.length)+1;//当前页码
            $.ajax({
                type: "post",
                url: "getProjectBusNumberList",
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
                    callback(returnData);
                }
            });
		},
		columns: [
            {"title":"Project No.","class":"center","data":"project_no","defaultContent": ""},
            {"title":"Project Name","class":"center","data":"project_name","defaultContent": ""},
            {"title":"Delivery Date","class":"center","data": "delivery_date","defaultContent": ""},
            {"title":"Quantity","class":"center","data":"quantity","defaultContent": ""},
            {"title":"Plant","class":"center","data": "plant","defaultContent": ""},
            {"title":"Status","class":"center","data":"project_status","render":function(data,type,row){
            	return data=="1"?"Created":(data=="2"?"In Process":"Completed")},"defaultContent":""
            },
            {"title":"Sales Manager","class":"center","data": "sales_manager","defaultContent": ""},
            {"title":"Project Manager","class":"center","data": "project_manager","defaultContent": ""},
            {"title":"Editor","class":"center","data": "username","defaultContent": ""},
            {"title":"Edit Date","class":"center","data": "edit_date","defaultContent": ""},
            {"title":"VIN","class":"center","data":null,"render":function(data,type,row){
                var  str="&nbsp;<i class=\"ace-icon fa fa-upload bigger-130\" title=\"Import\" onclick='importVinInfo("+JSON.stringify(row)+")' style='color:green;cursor: pointer;'></i>&nbsp;";
            	return str;
                },
            }
        ],
	});
	$("#tableResult_info").addClass('col-xs-6');
	$("#tableResult_paginate").addClass('col-xs-6');
	$(".dt-buttons").css("margin-top","-50px").find("a").css("border","0px");
}

function importVinInfo(row){
	var project_id=row.id;
	$("#project_no").text("  "+row.project_no+" "+row.project_name);
	if($.fn.dataTable.isDataTable("#tableVinImport")){
		$('#tableVinImport').DataTable().destroy();
		$('#tableVinImport').empty();
	}
	var dt=$("#tableVinImport").DataTable({
		serverSide: true,
		dom: 'Bfrtip',
	    buttons: [
	        {extend:'excelHtml5',title:row.project_no,className:'btn btn-sm btn-success black vinDetail',text:'Download Template'},
	    ],
	    paiging:false,
		ordering:false,
		searching: false,
		autoWidth:false,
		destroy: true,
		paginate:false,
		sScrollY: 310,
		scrollX: true,
		scrollCollapse: false,
		lengthChange:false,
		orderMulti:false,
		info:false,
		language: {
		},
		ajax:function (data, callback, settings) {
			var param ={
				 "project_id" : project_id
			};
            $.ajax({
                type: "post",
                url: "getVinListByProject",
                data: param,  //传入组装的参数
                dataType: "json",
                success: function (result) {
                    var returnData = {};
                    returnData.data = result.data;//返回的数据列表
                    callback(returnData);
                }
            });
		},
		columns: [
            {"title":"No.","class":"center","data":"","defaultContent": "","render":function(data,type,row,meta){
				return meta.row + meta.settings._iDisplayStart + 1;
	        }},
            {"title":"Bus No.","class":"center","data":"bus_number","defaultContent": ""},
            {"title":"VIN","class":"center","data": "VIN","defaultContent": ""}
        ],
	});
	$(".vinDetail").parent().css("margin-top","-40px").css("margin-left","-225px");
	$(".vinDetail").css("margin-top","-40px").css("margin-left","-225px").find("a").css("border","0px");
	var dialog = $("#dialog-import").removeClass('hide').dialog({
		width:700,
		height:580,
		modal: true,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i> Import VIN </h4></div>",
		title_html: true,
		buttons: [ 
			{
				text: "Close",
				"class" : "btn btn-minier",
				click: function() {
					$("#project_id").val("");
					$( this ).dialog( "close" ); 
				} 
			},
			{
				text: "Save",
				"class" : "btn btn-primary btn-minier save",
				click: function() {
					save(project_id);
				} 
			},
		]
	});
	$(".save").hide();
}

function save(project_id) {
	var save_flag=true;
	var trs=$("#tableVinImport tbody").find("tr");
	if(trs.length==0){
		save_flag=false;
		alert(Warn['P_common_05']);
		return false;
	}
	//var project_id=$("#project_id").val();
	var addList=[];
	$.each(trs,function(i,tr){
		var tds=$(tr).children("td");
		var error = $(tds).eq(3).html();
		if(error!='' && error!=undefined){
			var item_no = $(tds).eq(0).html();
			save_flag=false;
			alert(item_no+Warn['P_common_06']);
			return false;
		}
		var bus_number = $(tds).eq(1).html();
		var vin = $(tds).eq(2).html();
		var vinArr={};
		vinArr.bus_number=bus_number;
		vinArr.vin=vin;
		vinArr.project_id=project_id;
		addList.push(vinArr);
	});
	if(save_flag){
		$.ajax({
			url:'saveVinInfo',
			method:'post',
			dataType:'json',
			async:false,
			data:{
				"addList":JSON.stringify(addList)
			},
			success:function(response){
	            if(response.success){
	            	$.gritter.add({
						title: 'Message：',
						text: "<h5>"+Warn['P_common_03']+"</h5>",
						class_name: 'gritter-info'
					});
	            }else{
	            	$.gritter.add({
						title: 'Message：',
						text: "<h5>"+Warn['P_common_04']+"！</h5>",
						class_name: 'gritter-info'
					});
	            }
			}
		});
	}
}
