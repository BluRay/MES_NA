$(document).ready(function(){
	initPage();
	$("#btnQuery").on("click",function(){
		ajaxQuery();
	}); 
	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("../production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	});
	$(document).on("input","#search_project_no",function(){
		$("#search_project_no").attr("order_id","");
	});
	$("#btnAdd").click(function(){
		if($.fn.dataTable.isDataTable("#tplDetailTable")){
			$('#tplDetailTable').DataTable().destroy();
			$('#tplDetailTable').empty();
		}
		$("#add_project_no").removeAttr("readonly");
		$("#add_project_no").val("");
		$("#importDiv").show();
		var dialog = $( "#dialog-config" ).removeClass('hide').dialog({
			width:947,
			height:550,
			modal: true,
			title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i>Import Inspection Record Template</h4></div>",
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
						if($("#add_project_no").val()==""){
							alert(Warn['P_common_08']);
							$("#add_project_no").focus();
							return ;
						}
						$.ajax({
				            type: "post",
				            url: "getProjectByNo",
				            cache: false,  //禁用缓存
				            data: {
				            	"project_no": $("#add_project_no").val()
				            },  //传入组装的参数
				            dataType: "json",
				            success: function (result) {
				            	var data=result.data;
				            	if(data==null){
				            		alert(Warn['P_common_09']);
				            		$("#add_project_no").focus();
				            		return ;
				            	}else{
				            		var project_id=data.id;
				            		save(project_id); 
				            	}
				            }
				        });
					} 
				}
			]
		});
	});
	$("#btn_upload").click (function () {
		if($("#file").val()==''){
			alert(Warn['P_common_07']);
			return false;
		}
		$("#uploadForm").ajaxSubmit({
			url:"uploadPrdRcdOrderTplFile",
			type: "post",
			dataType:"json",
			success:function(response){
				if(response.success){	
					if($.fn.dataTable.isDataTable("#tplDetailTable")){
						$('#tplDetailTable').DataTable().destroy();
						$('#tplDetailTable').empty();
					}
					var datalist=response.data;
					var columns=[
			            {"title":"Item No.","class":"center","data":"item_no","defaultContent": ""},
			            {"title":"Station","class":"center","data":"station","defaultContent": ""},
			            {"title":"Process Name","class":"center","data": "process_name","defaultContent": ""},
			            {"title":"Inspection Item","class":"center","data":"inspection_item","defaultContent": ""},
			            {"title":"Specification And Standard","class":"center","data": "specification_and_standard","defaultContent": ""},
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
					$("#tplDetailTable").DataTable({
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
						aoColumnDefs : [
			                {
			                "aTargets" :[5],
			                "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) { 
				                	if($(nTd).text()!=''){
				                		//数据格式错误 整行用红色字体标示
				                		$(nTd).parent().css('color', '#ff0000');
					                	$(nTd).css('color', '#ff0000').css('font-weight', 'bold').css('width','200px');
				                	}
			                    }   
			                },
			            ],
						data:datalist,
						columns:columns
					});
				}
			},
			complete:function(){
				$(".remove").click();
			}				
		});
	});
})
function initPage(){
	getBusNumberSelect('#nav-search-input');
	getBusTypeSelect('','#search_bus_type','All','id');
	getOrderNoSelect("#search_project_no","#orderId");
	getOrderNoSelect("#add_project_no","#orderId");
	ajaxQuery();
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
}
function ajaxQuery(){
	$("#tableResult").DataTable({
		serverSide: true,
		rowsGroup:[0,1],
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
		},
		ajax:function (data, callback, settings) {
			var param ={
					"draw":1,
					"bus_type":$("#search_bus_type").find("option:selected").text(),
					"project_no":$("#search_project_no").val()
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
            {"title":"Project No.","class":"center","data":"order_desc","defaultContent": ""},
          	{"title":"Bus Type","class":"center","data":"bus_type","defaultContent": ""},
            {"title":"Version Number","class":"center","data":"version","defaultContent": ""},
            {"title":"Editor","class":"center","data":"editor","defaultContent": ""},
            {"title":"Edit Date","class":"center","data": "edit_date","defaultContent": ""},
            {"title":"","class":"center","data":"order_id","render":function(data,type,row){
            	return "<i class=\"glyphicon glyphicon-search bigger-130 showbus\" title='Display' onclick = 'showInfoPage(" + JSON.stringify(row)+");' style='color:blue;cursor: pointer;'></i>&nbsp;&nbsp;&nbsp;" 
            	}
            },{"title":"","class":"center","data":"order_id","render":function(data,type,row){
            	return "<i class=\"ace-icon fa fa-upload bigger-130\" title='Import' onclick = 'showEditPage(" + JSON.stringify(row)+ ");' style='color:green;cursor: pointer;'></i>";
            	}
            }
        ]
	});
}
function save(project_id,version) {
	var save_flag=true;
	var trs=$("#tplDetailTable tbody").find("tr");
	if(trs.length==0){
		save_flag=false;
		alert(Warn['P_common_05']);
		return false;
	}
	var addList=[];
	$.each(trs,function(i,tr){
		var tds=$(tr).children("td");
		var error = $(tds).eq(5).html();
		if(error!=''){
			var item_no = $(tds).eq(0).html();
			save_flag=false;
			alert(item_no+Warn['P_common_06']);
			return false;
		}
		var item_no = $(tds).eq(0).html();
		var station = $(tds).eq(1).html();
		var process_name = $(tds).eq(2).html();
		var inspection_item = $(tds).eq(3).html();
		var specification_and_standard = $(tds).eq(4).html();
		var keyparts={};
		keyparts.item_no=item_no;
		keyparts.specification_and_standard=specification_and_standard;
		keyparts.inspection_item=inspection_item;
		keyparts.process_name=process_name;
		keyparts.station=station;
		addList.push(keyparts);
	});
	if(save_flag){
		$.ajax({
			url:'savePrdRcdOrderTplInfo',
			method:'post',
			dataType:'json',
			async:false,
			data:{
				"addList":JSON.stringify(addList),
				"project_id":project_id,
				"version":version
			},
			success:function(response){
	            if(response.success){
	            	$( "#dialog-config" ).dialog("close");
	            	$.gritter.add({
						title: 'Message：',
						text: "<h5>"+Warn['P_common_03']+"</h5>",
						class_name: 'gritter-info'
					});
	            }else{
	            	if(response.message!=''){
	            		$.gritter.add({
							title: 'Message：',
							text: "<h5>"+Warn[response.message]+"</h5>",
							class_name: 'gritter-info'
						});
	            	}else{
	            		$.gritter.add({
							title: 'Message：',
							text: "<h5>"+Warn['P_common_04']+"</h5>",
							class_name: 'gritter-info'
						});
	            	}
	            }
			}
		});
	}
}
function drawTplDetailTable(tableId,data,project_no,version){
	$("#add_project_no").val(project_no);
	var tb=$(tableId).DataTable({
		paiging:false,
		 keys: true,
		ordering:false,
		searching: false,
		autoWidth:false,
		destroy: true,
		paginate:false,
		//rowsGroup:[0],
		sScrollY: $(window).height()-280,
		scrollX: true,
		scrollCollapse: false,
		lengthChange:false,
		orderMulti:false,
		info:false,
		data:data||{},
		columns: [
            {"title":"No.","class":"center","data":"","width":"45px","defaultContent": ""
            	,"render":function(data,type,row,meta){
				return (meta.row + meta.settings._iDisplayStart) + 1; // 序号值
	        }
            },
            {"title":"Station","class":"center","width":"120px","data":"station","defaultContent": ""},
            {"title":"Process Name","class":"center","width":"120px","data": "process_name","defaultContent": ""},
            {"title":"Inspection Item","class":"center","width":"155px","data":"inspection_item","defaultContent": ""},		
            {"title":"Specification And Standard","class":"center","width":"465px","data":"specification_and_standard","defaultContent": ""}	            	          
       ]	
	});
}
function showEditPage(row){
	if($.fn.dataTable.isDataTable("#tplDetailTable")){
		$('#tplDetailTable').DataTable().destroy();
		$('#tplDetailTable').empty();
	}
	$("#importDiv").show();
	$("#file").val("");
	$("#add_project_no").attr("readonly","readonly");
	$("#add_project_no").val(row.project_no);
	var dialog = $( "#dialog-config" ).removeClass('hide').dialog({
		width:947,
		height:550,
		modal: true,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i>Import Inspection Record Template</h4></div>",
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
					if($("#add_project_no").val()==""){
						alert(Warn['P_common_08']);
						$("#add_project_no").focus();
						return ;
					}
					$.ajax({
			            type: "post",
			            url: "getProjectByNo",
			            cache: false,  //禁用缓存
			            data: {
			            	"project_no": $("#add_project_no").val()
			            },  //传入组装的参数
			            dataType: "json",
			            success: function (result) {
			            	var data=result.data;
			            	var project_id=data.id;
			            	if(data==null){
			            		alert(Warn['P_common_09']);
			            		$("#add_project_no").focus();
			            		return ;
			            	}else{
			            		save(row.id,row.version); 
								$( this ).dialog( "close" ); 
			            	}
			            }
			        });
				} 
			}
		]
	});
}
function showInfoPage(row){
	if($.fn.dataTable.isDataTable("#tplDetailTable")){
		$('#tplDetailTable').DataTable().destroy();
		$('#tplDetailTable').empty();
	}
	var detail_list=getTplDetailByHeader(row.id,row.version)
	drawTplDetailTable("#tplDetailTable",detail_list,row.project_no,row.version);
	$("#importDiv").hide();
	var dialog = $( "#dialog-config" ).removeClass('hide').dialog({
		width:947,
		height:550,
		modal: true,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i>Display Inspection Record Template</h4></div>",
		title_html: true,
		buttons: [ 
			{
				text: "Close",
				"class" : "btn btn-primary btn-minier",
				click: function() {
					$( this ).dialog( "close" ); 
				} 
			}
		]
	});
}
function getTplDetailByHeader(project_id,version){
	var detail_list=null;
	$.ajax({
		url:"getPrdRcdOrderTplDetailList",
		type:"post",
		async:false,
		dataType:"json",
		data:{
			"project_id":project_id,
			"version":version
		},
		success:function(response){
			detail_list=response.data;
		}
	})
	return detail_list;
}