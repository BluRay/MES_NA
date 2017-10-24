var detail_list=[];
var plant="";
var project_id="";
$(document).ready(function(){
	initPage();
	function initPage(){
		getBusNumberSelect('#nav-search-input');
		getKeysSelect("TESTING_TYPE", "", $("#testing_type_value"),"All",""); 
		getKeysSelect("TESTING_TYPE", "", $("#search_test_type_value"),"All",""); 
		getBusTypeSelect('','#search_bus_type','All','id');
		getOrderNoSelect("#search_project_no","#orderId");
	}
	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("../production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	});
	
	//新增记录
	$("#btnAdd").click(function(){
		$("#bus_number").val("");
		$("#remark").val("");
		$("#workshop").html("");
		$("#station").html("");
		$("#process").html("");
		$("#inspection_item").html("");
		var dialog = $( "#dialog-add" ).removeClass('hide').dialog({
			width:800,
			height:560,
			modal: true,
			title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i>Add Testing Record</h4></div>",
			title_html: true,
			buttons: [ 
				{
					text: "Cancel",
					"class" : "btn btn-minier",
					click: function() {
						project_id="";
						$( this ).dialog( "close" ); 
					} 
				},
				{
					text: "Save",
					"class" : "btn btn-primary btn-minier",
					click: function() {
						project_id="";
						ajaxSave(); 
					} 
				}
			]
		});
	});
	
	$(document).on("change","#testing_type_value",function(e){
		getTestingTemplate();
	});
	
	$("#bus_number").change(function(e){
		if($("#bus_number").val()==''){
			return false;
		}
		$.ajax({
			url:"../production/showBusNumberList",
			async:false,
			type:"post",
			dataType:"json",
			data:{
				"bus_number":$("#bus_number").val()
			},
			success:function(response){
				detail=response.data;
				if(detail.length>0){
					plant=detail[0].plant;
					project_id=detail[0].project_id;
					var testing_type=$("#testing_type_value :selected").attr('keyvalue');
					if(testing_type==undefined || testing_type==''){
						return false;
					}else{
                    	getTestingTemplate();
                    }
				}else{
					$("#bus_number").focus();
					alert(Warn['P_common_01']);
				}
			}
		})
	});
	$('body').on('keydown', ".first_inspection",function(e){
		if (e.keyCode == "13") {
			$(e.target).parent("td").parent("tr").next().children().eq(3).find(".first_inspection").focus();
		}
		if (e.keyCode == "38") { // 向上
			$(e.target).parent("td").parent("tr").prev().children().eq(3).find(".first_inspection").focus();
		}
		if (e.keyCode == "40") { // 向下
			$(e.target).parent("td").parent("tr").next().children().eq(3).find(".first_inspection").focus();
		}
	});
	$('body').on('keydown', ".re_inspection",function(e){
		if (e.keyCode == "13") {
			$(e.target).parent("td").parent("tr").next().children().eq(4).find(".re_inspection").focus();
		}
		if (e.keyCode == "38") { // 向上
			$(e.target).parent("td").parent("tr").prev().children().eq(4).find(".first_inspection").focus();
		}
		if (e.keyCode == "40") { // 向下
			$(e.target).parent("td").parent("tr").next().children().eq(4).find(".first_inspection").focus();
		}
	});
	$("#btnQuery").click(function(){
		ajaxQuery();
	})
});
function ajaxQuery(){
	var test_type_value=$("#search_test_type_value :selected").attr("keyvalue");
	var bus_number=$("#search_bus_number").val();
	var project_no=$("#search_project_no").val();
	var bus_type=$("#search_bus_type :selected").text();
	var tb=$("#tableResult").DataTable({
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
		},
		ajax:function (data, callback, settings) {
			var param ={
				"draw":1,
				"bus_number":bus_number,
				"bus_type":bus_type,
				"test_type_value":test_type_value,
				"project_no":project_no
			};
            param.length = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;//开始的记录序号
            param.page = (data.start / data.length)+1;//当前页码
            $.ajax({
                type: "post",
                url: "getTestingRecordList",
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
            {"title":"Project Name","class":"center","data":"project_name","defaultContent": ""},		            
            {"title":"Bus Type","class":"center","data":"bus_type","defaultContent": ""},
            {"title":"Bus No.","class":"center","data":"bus_number","defaultContent": ""},
            {"title":"Testing Type","class":"center","data": "testing_type","defaultContent": ""},
          //  {"title":"Remark","class":"center","data":"remark","defaultContent": ""},		            
            {"title":"Signature","class":"center","data":"signature","defaultContent": ""},		    
          //  {"title":"Date","class":"center","data":"edit_date","defaultContent": ""},		
            {"title":"First Inspection","class":"center","data":null,"render":function(data,type,row){
            	return "<i class=\"ace-icon fa fa-pencil bigger-130 editorder\" title='Edit' onclick = 'showEditPage(" + JSON.stringify(row)+ ",\"first\");' style='color:green;cursor: pointer;'></i>";
               },
            },
            {"title":"Re Inspection","class":"center","data":null,"render":function(data,type,row){
            	return "<i class=\"ace-icon fa fa-pencil bigger-130 editorder\" title='Edit' onclick = 'showEditPage(" + JSON.stringify(row)+ ",\"repeat\");' style='color:green;cursor: pointer;'></i>";
               },
            },
            {"title":"","class":"center","data":null,"render":function(data,type,row){
            	return "<i class=\"ace-icon fa fa-search bigger-130 editorder\" title='Display' onclick = 'showInfoPage(" + JSON.stringify(row)+ ");' style='color:green;cursor: pointer;'></i>";
               },
            }
        ],
	});
}
function getTestingTemplate(){
	var testing_type=$("#testing_type_value :selected").attr('keyvalue');
	if(testing_type==undefined || testing_type==''){
		return false;
	}
	var tb=$("#tableAddDetail").DataTable({
		paiging:false,
		ordering:false,
		searching: false,
		autoWidth:false,
		destroy: true,
		paginate:false,
		destroy: true,
		sScrollY: $(window).height()-340,
		scrollX: true,
		scrollCollapse: false,
		lengthChange:false,
		orderMulti:false,
		info:false,
		ajax:function (data, callback, settings) {
			var param ={
				"test_type_value":testing_type,
				"project_id":project_id
			};
            $.ajax({
                type: "post",
                url: "getTestingTemplateDetailList",
                cache: false,  //禁用缓存
                data: param,  //传入组装的参数
                dataType: "json",
                success: function (result) {
                	//封装返回数据
                    var returnData = {};
                    returnData.data = result.data;//返回的数据列表
                    callback(returnData);
                }
            });
		},
		columns: [
            {"title":"Item No.","class":"center","data":"item_no","defaultContent": ""},
            {"title":"Inspection Item","class":"center","data":"inspection_item","defaultContent": ""},
            {"title":"Specification Standard","class":"center","data": "specification_standard","defaultContent": ""},
        ],
	});
}
// 根据车号、测试类型查询
function getDetail(bus_number,test_type_value){
	var detail=null;
	$.ajax({
		url:"getTestingRecordDetailList",
		async:false,
		type:"post",
		dataType:"json",
		data:{
			"bus_number":bus_number,
			"test_type_value":test_type_value
		},
		success:function(response){
			detail=response.data;
		}
	})
	return detail;
}
function ajaxSave(){
	if($("#bus_number").val()==''){
		alert(Warn['P_common_02']);
		$("#bus_number").focus();
		return false;
	}
	var test_type_value=$("#testing_type_value :selected").attr('keyvalue');
	if(test_type_value==undefined || test_type_value==''){
		alert(Warn['P_testingRecord_03']);
		return false;
	}
	var trs=$("#tableAddDetail tbody").children("tr");
	var arr=[];
	var flag=true;
	$.each(trs,function(index,tr){
		var tds=$(tr).children("td");
		if(tds.eq(0).text()=='No data available in table'){
			flag=false;
		}
		var item_no=tds.eq(0).text();
		var inspection_item=tds.eq(1).text();
		var specification_standard=tds.eq(2).text();
		var obj={};
		obj.item_no=item_no;
		obj.inspection_item=inspection_item;
		obj.specification_standard=specification_standard;
		arr.push(obj);
	});
	if(!flag){
		alert(Warn['P_common_05']);
		return false;
	}
	$.ajax({
		url:"saveTestingRecord",
		async:false,
		type:"post",
		dataType:"json",
		data:{
			"bus_number":$("#bus_number").val(),
			"test_type_value":test_type_value,
			"list":JSON.stringify(arr)
		},
		success:function(response){
			if(response.success){
				$("#dialog-add").dialog("close");
				$.gritter.add({
					title: 'Message：',
					text: "<h5>"+Warn[response.message]+"</h5>",
					class_name: 'gritter-info'
				});
			}else{
				$.gritter.add({
					title: 'Message：',
					text: "<h5>"+Warn[response.message]+"</h5>",
					class_name: 'gritter-info'
				});
			}
		}
	})	
}
function ajaxUpdate(type){
	var trs=$("#tableDetail tbody").children("tr");
	var arr=[];
	$.each(trs,function(index,tr){
		var tds=$(tr).children("td");
		if(type=='first'){
			var first_inspection=tds.eq(3).find(".first_inspection").val();
			var id=tds.eq(3).find(".id").val();
			var obj={};
			obj.first_inspection=first_inspection;
			obj.id=id;
			obj.type=type;
			arr.push(obj);
		}
		if(type=='repeat'){
			var re_inspection=tds.eq(4).find(".re_inspection").val();
			var id=tds.eq(4).find(".id").val();
			var obj={};
			obj.re_inspection=re_inspection;
			obj.id=id;
			obj.type=type;
			arr.push(obj);
		}
	});
	$.ajax({
		url:"updateTestingRecord",
		async:false,
		type:"post",
		dataType:"json",
		data:{
			"list":JSON.stringify(arr)
		},
		success:function(response){
			if(response.success){
				$("#dialog-config").dialog("close");
				$.gritter.add({
					title: 'Message：',
					text: "<h5>"+Warn['P_common_03']+"</h5>",
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
	})	
}

function showInfoPage(row){
	var detail_list=getDetail(row.bus_number,row.test_type_value);
	$("#show_bus_number").text(row.bus_number);
	var dialog = $( "#dialog-config" ).removeClass('hide').dialog({
		width:945,
		height:550,
		modal: true,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i>Display Testing Record</h4></div>",
		title_html: true,
		buttons: [ 
			{
				text: "Close",
				"class" : "btn btn-minier",
				click: function() {
					$( this ).dialog( "close" ); 
				} 
			}
		]
	});
	if($.fn.dataTable.isDataTable("#tableDetail")){
		$('#tableDetail').DataTable().destroy();
		$('#tableDetail').empty();
	}
	drawDetailTable("#tableDetail",detail_list);
	$(".divLoading").hide();
}
function drawDetailTable(tableId,data){
	var tb_detail=$(tableId).dataTable({
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
		data:data||{},
		columns: [
            {"title":"Item No.","class":"center","data":"item_no","defaultContent": ""},
            {"title":"Inspection Item","class":"center","data": "inspection_item","defaultContent": ""},
            {"title":"Specification Standard","class":"center","data": "specification_standard","defaultContent": ""},
            {"title":"1st Inspection","class":"center","data": "first_inspection","defaultContent": ""},
            {"title":"Sign","class":"center","data": "first_sign","defaultContent": ""},
            {"title":"Re Inspection","class":"center","data": "re_inspection","defaultContent": ""},
            {"title":"Sign","class":"center","data": "re_sign","defaultContent": ""},
        ]	
	});
	var head_width=$("#tableDetail_wrapper").width();
	if(head_width>0){
		$("#tableDetail_wrapper .dataTables_scrollHead").css("width",head_width-17);
	}
}
function showEditPage(row,type){
	$("#show_bus_number").text(row.bus_number);
	$(".divLoading").addClass("fade in").show();
	var detail_list=getDetail(row.bus_number,row.test_type_value);
	var dialog = $( "#dialog-config" ).removeClass('hide').dialog({
		width:945,
		height:550,
		modal: true,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i>Edit Testing Record</h4></div>",
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
					ajaxUpdate(type); 
				} 
			}
		]
	});
	//先destroy datatable，隐藏form
	if($.fn.dataTable.isDataTable("#tableDetail")){
		$('#tableDetail').DataTable().destroy();
		$('#tableDetail').empty();
	}
	editDetailTable("#tableDetail",detail_list,type);
	$(".divLoading").hide();
}
function editDetailTable(tableId,data,type){
	var columns=[
             {"title":"Item No.","class":"center","data":"item_no","defaultContent": ""},
             {"title":"Inspection Item","class":"center","data": "inspection_item","defaultContent": ""},
             {"title":"Specification Standard","class":"center","data": "specification_standard","defaultContent": ""},
             {"title":"1st Inspection","class":"center","data": "first_inspection","render": function(data,type,row){
             	return "<input style='width:120px;text-align:center' class='first_inspection' " +
 				" value='"+(data!=undefined ? data : '')+"'/><input type='hidden' value='"+row.id+"' class='id'/>";
             }},
             {"title":"Re Inspection","class":"center","data": "re_inspection","defaultContent": ""},
         ];
	if(type=='repeat'){
		columns=[
			{"title":"Item No.","class":"center","data":"item_no","defaultContent": ""},
			{"title":"Inspection Item","class":"center","data": "inspection_item","defaultContent": ""},
			{"title":"Specification Standard","class":"center","data": "specification_standard","defaultContent": ""},
			{"title":"1st Inspection","class":"center","data": "first_inspection","defaultContent": ""},
			{"title":"Re Inspection","class":"center","data": "re_inspection","render": function(data,type,row){
				return "<input style='width:120px;text-align:center' class='re_inspection' " +
				" value='"+(data!=undefined ? data : '')+"'/><input type='hidden' value='"+row.id+"' class='id'/>";
			}},
	    ];
	}
	tb_detail=$(tableId).dataTable({
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
		data:data||{},
		columns: columns
	});
	var head_width=$("#tableDetail_wrapper").width();
	if(head_width>0){
		$("#tableDetail_wrapper .dataTables_scrollHead").css("width",head_width-17);
	}
}