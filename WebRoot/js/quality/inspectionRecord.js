var detail_list=[];
var plant="";
var project_id="";
$(document).ready(function(){
	initPage();

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("../production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})
	
	//新增记录
	$("#btnAdd").click(function(){
		$("#bus_number").val("");
		$("#remark").val("");
		$("#workshop").html("");
		$("#station").html("");
		$("#process").html("");
		$("#inspection_item").html("");
		var dialog = $( "#dialog-add" ).removeClass('hide').dialog({
			width:700,
			height:500,
			modal: true,
			title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i>Add Inspection Record</h4></div>",
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
						ajaxSave(); 
					} 
				}
			]
		});
	});
	
	$(document).on("change","#workshop",function(e){
		var workshop=$(this).find("option:selected").text();
		if(workshop=='All'){
			$("#station").html("");
			return false;
		}
		getAllstationSelect();
		getAllProcessSelect();
		getAllInspectionItemSelect();
	});
	
	$("#bus_number").blur(function(e){
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
					getWorkshopSelect('',detail[0].plant,"","#workshop","All","id");
				}
			}
		})
	})
	
	$("#btnQuery").click(function(){
		ajaxQuery();
	})
	
});

function initPage(){
	getBusNumberSelect('#nav-search-input');
	getBusNumberSelect('#search_bus_number');
	getOrderNoSelect("#search_project_no","#orderId");
	getFactorySelect("quality/inspectionRecord",'',"#search_plant","All",'id');
}

function drawTplDetailTable(tableId,data,editable){
	
	tb_detail=$(tableId).dataTable({
		paiging:false,
		 keys: true,
		ordering:false,
		searching: false,
		autoWidth:false,
		destroy: true,
		paginate:false,
		rowsGroup:[0],
		sScrollY: 310,
		scrollX: true,
		scrollCollapse: false,
		lengthChange:false,
		orderMulti:false,
		info:false,
		language: {
		},
		data:data||{},
		columns: [
            {"title":"Station","class":"center","data":"station","defaultContent": ""},
            {"title":"Process Name","class":"center","data":"process_name","defaultContent": ""},
            {"title":"Inspection Item","class":"center","data": "inspection_item","defaultContent": ""},
            {"title":"Specification And Standard","class":"center","data": "specification_and_standard","defaultContent": ""},
            {"title":"Self Inspection","class":"center","data": "self_inspection","defaultContent": ""},
            {"title":"Sign & Date","class":"center","data": "self_str","defaultContent": ""},
            {"title":"QC Inspection","class":"center","data": "qc_inspection","defaultContent": ""},
            {"title":"Sign & Date","class":"center","data": "qc_str","defaultContent": ""},
            {"title":"Remark","class":"center","data": "remark","defaultContent": ""},
        ]	
	});
	var head_width=$("#tableDetail_wrapper").width();
	if(head_width>0){
		$("#tableDetail_wrapper .dataTables_scrollHead").css("width",head_width-17);
	}
}
function editDetailTable(tableId,data,type){
	var columns=[
             {"title":"Station","class":"center","data":"station","defaultContent": ""},
             {"title":"Process Name","class":"center","data":"process_name","defaultContent": ""},
             {"title":"Inspection Item","class":"center","data": "inspection_item","defaultContent": ""},
             {"title":"Specification And Standard","class":"center","width":"15%","data": "specification_and_standard","defaultContent": ""},
             {"title":"Self Inspection","class":"center","data": "self_inspection","render": function(data,type,row){
             	return "<input style='border:0;width:100px;text-align:center' class='self_inspection' " +
 				" value='"+(data!=undefined ? data : '')+"'/><input type='hidden' value='"+row.id+"' class='id'/>";
             }},
             {"title":"QC Inspection","class":"center","data": "qc_inspection","defaultContent": ""},
             {"title":"Remark","class":"center","data": "remark","render": function(data,type,row){
             	return "<input style='border:0;width:100px;text-align:center' class='remark' " +
 				" value='"+(data!=undefined ? data : '')+"'/>";
             }},
         ];
	if(type=='qc'){
		columns=[
	             {"title":"Station","class":"center","data":"station","defaultContent": ""},
	             {"title":"Process Name","class":"center","data":"process_name","defaultContent": ""},
	             {"title":"Inspection Item","class":"center","data": "inspection_item","defaultContent": ""},
	             {"title":"Specification And Standard","class":"center","data": "specification_and_standard","defaultContent": ""},
	             {"title":"Self Inspection","class":"center","data": "self_inspection","defaultContent": ""},
	             {"title":"QC Inspection","class":"center","data": "qc_inspection","render": function(data,type,row){
		             	return "<input style='border:0;width:100px;text-align:center' class='qc_inspection' " +
		 				" value='"+(data!=undefined ? data : '')+"'/><input type='hidden' value='"+row.id+"' class='id'/>";
		             }},
	             {"title":"Remark","class":"center","data": "remark","render": function(data,type,row){
	             	return "<input style='border:0;width:100px;text-align:center' class='remark' " +
	 				" value='"+(data!=undefined ? data : '')+"'/>";
	             }}
	         ];
	}
	
	tb_detail=$(tableId).dataTable({
		paiging:false,
		 keys: true,
		ordering:false,
		searching: false,
		autoWidth:false,
		destroy: true,
		paginate:false,
		rowsGroup:[0],
		sScrollY: 310,
		scrollX: true,
		scrollCollapse: false,
		lengthChange:false,
		orderMulti:false,
		info:false,
		language: {
		},
		data:data||{},
		columns: columns
	});
	var head_width=$("#tableDetail_wrapper").width();
	if(head_width>0){
		$("#tableDetail_wrapper .dataTables_scrollHead").css("width",head_width-17);
	}
    
}
/**
 * 查询成品记录表模板明细
 */
function getBusNumberDetail(bus_number){
	var detail=null;
	$.ajax({
		url:"getInspectionRecordDetail",
		async:false,
		type:"post",
		dataType:"json",
		data:{
			"bus_number":bus_number
		},
		success:function(response){
			detail=response.data;
		}
	})
	return detail;
}

function ajaxSave(){
	if($("#bus_number").val()==''){
		alert("Bus No. cannot be null");
		$("#bus_number").focus();
		return false;
	}
	if($("#workshop").find("option:selected").text()=='All'){
		alert("Workshop. cannot be null");
		$("#workshop").focus();
		return false;
	}
	if($("#station").find("option:selected").text()=='All'){
		alert("Station. cannot be null");
		$("#station").focus();
		return false;
	}
	if($("#process").find("option:selected").text()=='All'){
		alert("Process. cannot be null");
		$("#process").focus();
		return false;
	}
	if($("#inspection_item").find("option:selected").text()=='All'){
		alert("Inspection Item. cannot be null");
		$("#inspection_item").focus();
		return false;
	}
	$.ajax({
		url:"saveInspectionRecord",
		async:false,
		type:"post",
		dataType:"json",
		data:{
			"bus_number":$("#bus_number").val(),
			"workshop":$("#workshop").find("option:selected").text(),
			"station":$("#station").find("option:selected").text(),
			"process":$("#process").find("option:selected").text(),
			"inspection_item":$("#inspection_item").find("option:selected").text(),
			"specification_and_standard":$("#inspection_item").val(),
			"remark":$("#remark").val(),
		},
		success:function(response){
			if(response.success){
				$("#dialog-add").dialog("close");
				$.gritter.add({
					title: 'Message：',
					text: "<h5>Success！</h5>",
					class_name: 'gritter-info'
				});
			}else{
				$.gritter.add({
					title: 'Message：',
					text: "<h5>Failure！</h5>",
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
		if(type=='self'){
			var self_inspection=tds.eq(4).find(".self_inspection").val();
			var id=tds.eq(4).find(".id").val();
			var remark=tds.eq(6).find(".remark").val();
			var obj={};
			obj.self_inspection=self_inspection;
			obj.id=id;
			obj.remark=remark;
			obj.type="self";
			arr.push(obj);
		}
		if(type=='qc'){
			var qc_inspection=tds.eq(5).find(".qc_inspection").val();
			var id=tds.eq(5).find(".id").val();
			var remark=tds.eq(6).find(".remark").val();
			var obj={};
			obj.qc_inspection=qc_inspection;
			obj.id=id;
			obj.remark=remark;
			obj.type="qc";
			arr.push(obj);
		}
	});
	$.ajax({
		url:"updateInspectionRecord",
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
					text: "<h5>Success！</h5>",
					class_name: 'gritter-info'
				});
			}else{
				$.gritter.add({
					title: 'Message：',
					text: "<h5>Failure！</h5>",
					class_name: 'gritter-info'
				});
			}
		}
	})	
}

function ajaxQuery(){
	var plant=$("#search_plant").val();
	var bus_number=$("#search_bus_number").val();
	var project_no=$("#search_project_no").val();
	
	var tb=$("#tableResult").DataTable({
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
				"bus_number":bus_number,
				"plant":plant,
				"project_no":project_no
			};
            param.length = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;//开始的记录序号
            param.page = (data.start / data.length)+1;//当前页码

            $.ajax({
                type: "post",
                url: "getInspectionRecordList",
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
            {"title":"Plant","class":"center","data":"plant","defaultContent": ""},
            {"title":"Bus No.","class":"center","data":"bus_number","defaultContent": ""},
            {"title":"Project No.","class":"center","data": "project_name","defaultContent": ""},
            {"title":"Production Supervisor","class":"center","data":"supervisor","defaultContent": ""},		            
            {"title":"Supervisor Date","class":"center","data":"supervisor_date","defaultContent": ""},		    
            {"title":"QC Supervisor","class":"center","data":"qc_sign","defaultContent": ""},		
            {"title":"QC Supervisor Date","class":"center","qc_sign_date": "editor","defaultContent": ""},
            {"title":"QC Inspection","class":"center","data":null,"render":function(data,type,row){
            	return "<i class=\"ace-icon fa fa-pencil bigger-130 editorder\" title='Edit' onclick = 'showEditPage(" + JSON.stringify(row)+ ",\"qc\");' style='color:green;cursor: pointer;'></i>";
               },
            },
            {"title":"Self Inspection","class":"center","data":null,"render":function(data,type,row){
            	return "<i class=\"ace-icon fa fa-pencil bigger-130 editorder\" title='Edit' onclick = 'showEditPage(" + JSON.stringify(row)+ ",\"self\");' style='color:green;cursor: pointer;'></i>";
               },
            },
            {"title":"","class":"center","data":null,"render":function(data,type,row){
            	return "<i class=\"ace-icon fa fa-search bigger-130 editorder\" title='Display' onclick = 'showInfoPage(" + JSON.stringify(row)+ ");' style='color:green;cursor: pointer;'></i>";
               },
            }
        ],
	});
	
}

function showInfoPage(row){
	var detail_list=getBusNumberDetail(row.bus_number);
	$("#show_bus_number").text(row.bus_number);
	$("#show_plant").text(row.plant);
	var dialog = $( "#dialog-config" ).removeClass('hide').dialog({
		width:1100,
		height:550,
		modal: true,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i>Display Inspection Record</h4></div>",
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
	drawTplDetailTable("#tableDetail",detail_list,false);
	$(".divLoading").hide();
}

function showEditPage(row,type){
	$("#show_bus_number").text(row.bus_number);
	$("#show_plant").text(row.plant);
	$(".divLoading").addClass("fade in").show();
	var detail_list=getBusNumberDetail(row.bus_number);
	
	var dialog = $( "#dialog-config" ).removeClass('hide').dialog({
		width:1100,
		height:550,
		modal: true,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i>Edit Inspection Record</h4></div>",
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
function getAllstationSelect() {
	$.ajax({
		url : "../setting/getStationList",
		dataType : "json",
		data : {
			factory:plant,
			workshop:$("#workshop").find("option:selected").text(),
		//	line:$("#line").val(),
			start:0,
			length:-1
			},
		async : false,
		error : function(response) {
			//alert(response.message)
		},
		success : function(response) {
			var strs = "<option value=''>All</option>";
		    $("#station").html("");
		   
		    $.each(response.data, function(index, value) {
		    	strs += "<option value='" + value.station_name + "'>" + value.station_name + "</option>";
		    });
		    $("#station").append(strs);
		}
	});
}
function getAllProcessSelect() {
	$.ajax({
		url : "../setting/getProcessList",
		dataType : "json",
		data : {
			factory:plant,
			workshop:$("#workshop").find("option:selected").text(),
			start:0,
			length:-1
			},
		async : false,
		error : function(response) {
			//alert(response.message)
		},
		success : function(response) {
			var strs = "<option value=''>All</option>";
		    $("#process").html("");
		   
		    $.each(response.data, function(index, value) {
		    	strs += "<option value='" + value.process_name + "'>" + value.process_name + "</option>";
		    });
		    $("#process").append(strs);
		}
	});
}
function getAllInspectionItemSelect() {
	$.ajax({
		url : "getPrdRcdOrderTplDetailList",
		dataType : "json",
		data : {
			project_id:project_id
			},
		async : false,
		error : function(response) {
			//alert(response.message)
		},
		success : function(response) {
			var strs = "<option value=''>All</option>";
		    $("#inspection_item").html("");
		   
		    $.each(response.data, function(index, value) {
		    	strs += "<option value='" + value.specification_and_standard + "'>" + value.inspection_item + "</option>";
		    });
		    $("#inspection_item").append(strs);
		}
	});
}