
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
	})
	
	$(document).on("input","#search_project_no",function(){
		$("#search_project_no").attr("order_id","");
	});
	
	$("#btnAdd").click(function(){
		if($.fn.dataTable.isDataTable("#tplDetailTable")){
			$('#tplDetailTable').DataTable().destroy();
			$('#tplDetailTable').empty();
		}
		$("#importDiv").show();
		$("#add_project_no").val("");
		$("#initiated").val("");
		$("#approved").val("");
		$("#remarks").val("");
		var dialog = $( "#dialog-config" ).removeClass('hide').dialog({
			width:900,
			height:600,
			modal: true,
			title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i>Import Testing Template</h4></div>",
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
		//$(".divLoading").addClass("fade in").show();
		$("#uploadForm").ajaxSubmit({
			url:"uploadTestingTemplateFile",
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
			            {"title":"Inspection Item","class":"center","data":"inspection_item","defaultContent": ""},
			            {"title":"Specification And Standard","class":"center","data": "specification_standard","defaultContent": ""},
			        ];

					$("#tplDetailTable").DataTable({
						paiging:false,
						ordering:false,
						processing:true,
						searching: false,
						autoWidth:false,
						paginate:false,
						sScrollY: $(window).height()-380,
//						scrollX: true,
						scrollCollapse: true,
						lengthChange:false,
						orderMulti:false,
						info:false,
						aoColumnDefs : [
			            ],
						data:datalist,
						columns:columns
					});
				}
				//$(".divLoading").hide();
			}			
		});
	});
})

function initPage(){
	getBusNumberSelect('#nav-search-input');
	getKeysSelect("TESTING_TYPE", "", $("#testing_type_value"),"All",""); 
	getKeysSelect("TESTING_TYPE", "", $("#search_testing_type_value"),"All",""); 
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
		ajax:function (data, callback, settings) {
			var param ={
				"draw":1,
				"bus_type":$("#search_bus_type").find("option:selected").text(),
				"project_no":$("#search_project_no").val(),
		        "test_type_value":$("#search_testing_type_value :selected").attr('keyvalue')
			};
            param.length = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;//开始的记录序号
            param.page = (data.start / data.length)+1;//当前页码

            $.ajax({
                type: "post",
                url: "getPrdRcdTestingTplList",
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
          	{"title":"Bus Type","class":"center","data":"bus_type","defaultContent": ""},
          	{"title":"Project No.","class":"center","data":"order_desc","defaultContent": ""},
            {"title":"Testing Type","class":"center","data":"test_type_value","render":function(data,type,row){
            	return convert(data);
	        	}
	        },
            {"title":"Remarks","class":"center","data":"remarks","defaultContent": ""},
            {"title":"Editor","class":"center","data":"editor","defaultContent": ""},
            {"title":"Edit Date","class":"center","data": "edit_date","defaultContent": ""},
            {"title":"","class":"center","data":"","render":function(data,type,row){
            	return "<i class=\"glyphicon glyphicon-search bigger-130\" title='Display' onclick = 'showInfoPage(" + JSON.stringify(row)+");' style='color:blue;cursor: pointer;'></i>&nbsp;&nbsp;&nbsp;" 
            	}
            },{"title":"","class":"center","data":"","render":function(data,type,row){
            	return "<i class=\"ace-icon fa fa-upload bigger-130\" title='Import' onclick = 'showEditPage(" + JSON.stringify(row)+ ");' style='color:green;cursor: pointer;'></i>";
            	}
            }
       ]
	});
}
function save(project_id,header_id) {
	var save_flag=true;
	var trs=$("#tplDetailTable tbody").find("tr");
	if(trs.length==0){
		save_flag=false;
		alert(Warn['P_common_05']);
		return false;
	}
	var testing_type_value=$("#testing_type_value :selected").attr('keyvalue');
	if(testing_type_value=='' || testing_type_value==undefined){
		alert(Warn['P_testingRecord_03']);
		return false;
	}
	var addList=[];
	$.each(trs,function(i,tr){
		var tds=$(tr).children("td");
		var item_no = $(tds).eq(0).html();
		var inspection_item = $(tds).eq(1).html();
		var specification_standard = $(tds).eq(2).html();
		var testing={};
		testing.item_no=item_no;
		testing.specification_standard=specification_standard;
		testing.inspection_item=inspection_item;
		addList.push(testing);
	});
	if(save_flag){
		$.ajax({
			url:'savePrdRcdTestingTplInfo',
			method:'post',
			dataType:'json',
			async:false,
			data:{
				"addList":JSON.stringify(addList),
				"project_id":project_id,
				"header_id":header_id,
				"initiated":$("#initiated").val(), 
				"approved":$("#approved").val(),
				"test_type_value":$("#testing_type_value :selected").attr('keyvalue'),
				"remarks":$("#remarks").val()
			},
			success:function(response){
	            if(response.success){
	            	$( "#dialog-config" ).dialog("close");
	            	$.gritter.add({
						title: 'Message：',
						text: "<h5>"+alert(Warn['P_common_03'])+"</h5>",
						class_name: 'gritter-info'
					});
	            }else{
	            	$.gritter.add({
						title: 'Message：',
						text: "<h5>"+alert(Warn['P_common_04'])+"</h5>",
						class_name: 'gritter-info'
					});
	            }
			}
		});
	}
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
		//sScrollY: $(window).height()-340,
		//scrollX: true,
		scrollCollapse: false,
		lengthChange:false,
		orderMulti:false,
		info:false,
		language: {
		},
		data:data||{},
		columns: [
	        {"title":"Item No.","class":"center","data":"item_no","width":"30px","defaultContent": ""},
	        {"title":"Inspection Item","class":"center","data":"inspection_item","defaultContent": ""},		
	        {"title":"Specification And Standard","class":"center","data":"specification_standard","defaultContent": ""}	            	          
	    ]	
	});
}

function showEditPage(row){
	if($.fn.dataTable.isDataTable("#tplDetailTable")){
		$('#tplDetailTable').DataTable().destroy();
		$('#tplDetailTable').empty();
	}
	$("#importDiv").show();
	$("#add_project_no").val(row.project_no);
	$("#initiated").val(row.initiated);
	$("#approved").val(row.approved);
	$("#testing_type_value").find("option[keyvalue='"+row.test_type_value+"']").attr("selected",true);
	$("#remarks").val(row.remarks);
	var dialog = $( "#dialog-config" ).removeClass('hide').dialog({
		width:900,
		height:550,
		modal: true,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i>Import Testing Template</h4></div>",
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
			            		save(row.id,row.header_id); 
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
	$("#add_project_no").val(row.project_no);
	$("#initiated").val(row.initiated);
	$("#approved").val(row.approved);
	$("#testing_type_value").find("option[keyvalue='"+row.test_type_value+"']").attr("selected",true);
	$("#remarks").val(row.remarks);
	var detail_list=getTplDetailByHeader(row.header_id);
	drawTplDetailTable("#tplDetailTable",detail_list,false);
	$("#importDiv").hide();
	var dialog = $( "#dialog-config" ).removeClass('hide').dialog({
		width:900,
		height:550,
		modal: true,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i>Display Testing Template</h4></div>",
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

function getTplDetailByHeader(header_id){
	var detail_list=null;
	$.ajax({
		url:"getTestingTemplateDetailList",
		type:"post",
		async:false,
		dataType:"json",
		data:{
			"header_id":header_id
		},
		success:function(response){
			detail_list=response.data;
		}
	})
	return detail_list;
}
// 转换test_type_value
function convert(value) {
    var returnValue="";
    var readValue="";
    var changeValue="";
    $("#search_testing_type_value option").map(function(){
        readValue=$(this).attr("keyvalue");
        changeValue=$(this).text();
        if(readValue==value){
        	returnValue=changeValue;
        	return false;
        }
    });
    return returnValue;
}