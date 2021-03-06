var pageSize=1;
var table;
var table_height = $(window).height()-250;
var query_data;
var req_arr = [];
$(document).ready(function () {	
	initPage();
	
	function initPage(){
		var now = new Date();
		$("#search_start_date").val(formatDate(now));
		$("#search_end_date").val(formatDate(now));
		getBusNumberSelect('#nav-search-input');
		getFactorySelect();
		//ajaxQuery();
	};

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/MES/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	});
	
	$("#btnQuery").click(function () {
		ajaxQuery();
	});
	
	Array.prototype.remove = function(val) {  
	    var index = this.indexOf(val);  
	    if (index > -1) {  
	        this.splice(index, 1);  
	    }  
	}; 
	
	$("#search_factory").change(function(){
		$("#search_workshop").empty();
		if($("#search_factory").val() !=''){
			getAllWorkshopSelect();
			getAllLineSelect();
			getAllProcessSelect();
		}
	});
	
	$("#search_workshop").change(function(){
		$("#search_station").empty();
		if($("#exec_workshop").val() !=''){
			getAllLineSelect();
			getAllProcessSelect();
		}
	});

	$("#search_line").change(function(){
		$("#search_station").empty();
		if($("#search_line").val() !=''){
			getAllProcessSelect();
		}
	});
	
	function getFactorySelect() {
		$.ajax({
			url : "/MES/common/getFactorySelectAuth",
			dataType : "json",
			data : {
				function_url:'production/materialRequirement'
			},
			async : false,
			error : function(response) {
				alert(response.message)
			},
			success : function(response) {
				getSelects_noall(response.data, "", "#search_factory");
				getAllWorkshopSelect();
				getAllLineSelect();
				getAllProcessSelect();
			}
		});
	}
	
	function getAllLineSelect() {
		$("#search_line").empty();
		$.ajax({
			url : "/MES/common/getLineSelectAuth",
			dataType : "json",
			data : {
					factory:$("#search_factory :selected").text(),
					workshop:$("#search_workshop :selected").text()
				},
			async : false,
			error : function(response) {
				alert(response.message)
			},
			success : function(response) {
				line_selects_data=response.data;
				getSelects(response.data, "", "#search_line",null,"name"); 
			}
		});
	}
	
	function getAllProcessSelect(order_type) {
		order_type=order_type||'Standard order';
		$("#search_station").empty();
		$.ajax({
			url : "getProcessMonitorSelect",
			dataType : "json",
			data : {
				factory:$("#search_factory :selected").text(),
				workshop:$("#search_workshop :selected").text(),
				line:$("#search_line").val(),
				order_type:order_type
				},
			async : false,
			error : function(response) {
				alert(response.message)
			},
			success : function(response) {
				var strs = "";
			    $("#exec_process").html("");
			    var process_id_default="";
			    var process_name_default="";   
			    $.each(response.data, function(index, value) {
			    	if (index == 0) {
			    		process_id_default=value.id;
				    	process_name_default=value.process_name;
			    	}
			    	
			    	if(getQueryString("process_id")==value.id){
			    	 	process_id_default=value.id;
				    	process_name_default=value.process_name;
			    	}
			    	strs += "<option value=" + value.id + " process='"+value.station_name+"' plan_node='"+(value.plan_node_name||"")
			    	+"' field_name='" +(value.field_name||"")+ "'>" + value.station_code + "</option>";
			    });
			    $("#search_station").append(strs);
			    $("#search_station").val(process_id_default+"");
			}
		});
	}
	
})

function getAllWorkshopSelect() {
	$("#exec_workshop").empty();
	$.ajax({
		url : "/MES/common/getWorkshopSelectAuth",
		dataType : "json",
		data : {
				factory:$("#search_factory :selected").text(),
				function_url:'quality/punchList'
			},
		async : false,
		error : function(response) {
			alert(response.message)
		},
		success : function(response) {
			getSelects(response.data, "", "#search_workshop",null,"id");
		}
	});
}



function ajaxQuery(){
	$.ajax({
	    url: "getLineInventoryList",
	    dataType: "json",
		type: "get",
	    data: {
	    	"factory_id": $('#search_factory').val(),
	    	"factory_name": $("#search_factory :selected").text(),
	    	"workshop_id": $('#search_workshop').val(),
	    	"workshop_name": $("#search_workshop :selected").text(),
	    	"line": $('#search_line').val(),
	    	"station_id": $('#search_station').val(),
	    	"station_name": $("#search_station :selected").attr('process'),
	    	"station": $("#search_station :selected").text(),
	    	"bus_number": $('#search_busno').val(),
	    	"dis_no": $('#search_disno').val(),
	    	"start_date": $('#search_start_date').val(),
	    	"end_date": $('#search_end_date').val(),
	    	"status": $('#search_status').val()
	    	
	    },
	    success:function(response){
	    	$("#tableData tbody").html("");
	    	if(response.data.length == 0){
	    		alert(Warn['P_lineInventory_01']);
	    	}
	    	$.each(response.data,function (index,value) {
	    		var tr = $("<tr/>");
	    		$("<td style=\"text-align:center;\" />").html(value.dis_no).appendTo(tr);
		    	$("<td style=\"text-align:center;\" />").html(value.station).appendTo(tr);
		    	$("<td style=\"text-align:center;\" />").html(value.bus_number).appendTo(tr);
		    	$("<td style=\"text-align:center;\" />").html(value.dis_num).appendTo(tr);
		    	$("<td style=\"text-align:center;\" />").html(value.create_user).appendTo(tr);
		    	$("<td style=\"text-align:center;\" />").html(value.create_time).appendTo(tr);
		    	$("<td style=\"text-align:center;\" />").html(value.reception_user).appendTo(tr);
		    	$("<td style=\"text-align:center;\" />").html(value.reception_time).appendTo(tr);
		    	var str = "<i class=\"glyphicon glyphicon-search bigger-130 \" title=\"ShowDetail\" onclick=\"showDetai("+value.dis_no+")\" style='color:green;cursor: pointer;'></i>";
		    	str += " <i class=\"glyphicon glyphicon-print bigger-130 \" title=\"rePrint\" onclick=\"rePrint("+value.dis_no+")\" style='color:green;cursor: pointer;'></i>"
		    	if(typeof(value.reception_user) == "undefined"){
		    		str += " <i class=\"glyphicon glyphicon-remove bigger-130 \" title=\"Remove\" onclick=\"remove("+value.dis_no+")\" style='color:green;cursor: pointer;'></i>"
		    	}
		    	$("<td style=\"text-align:center;\" />").html(str).appendTo(tr);		    			    	
		    	$("#tableData tbody").append(tr);
	    	})
	    }
	});
}

function showDetai(dis_no){
	$.ajax({
	    url: "getDistributionDetail",
	    dataType: "json",
		type: "get",
	    data: {
	    	"dis_no": dis_no
	    },
	    success:function(response){
	    	$("#tableDataShow tbody").html("");
	    	$.each(response.data,function (index,value) {
	    		var tr = $("<tr/>");
	    		$("<td style=\"text-align:center;\" />").html(index+1).appendTo(tr);
	    		$("<td style=\"text-align:center;\" />").html(value.bus_number).appendTo(tr);
	    		$("<td style=\"text-align:center;\" />").html(value.sap_material).appendTo(tr);
	    		$("<td style=\"text-align:center;\" />").html(value.part_name).appendTo(tr);
	    		$("<td style=\"text-align:center;\" />").html(value.required_quantity).appendTo(tr);
	    		$("<td style=\"text-align:center;\" />").html(value.unit).appendTo(tr);
	    		$("<td style=\"text-align:center;\" />").html(value.dis_quantity).appendTo(tr);
	    		$("<td style=\"text-align:center;\" />").html(value.vendor).appendTo(tr);
	    		$("#tableDataShow tbody").append(tr);	    		
	    	});
	    	$("#dialog-print").removeClass('hide').dialog({
				resizable: false,
				title: '<div class="widget-header"><h4 class="smaller"><i class="ace-icon fa fa-users green"></i> Distribution Info</h4></div>',
				title_html: true,
				width:'1200px',
				modal: true,
				buttons: [{
							text: "Close",
							"class" : "btn btn-minier",
							click: function() {$( this ).dialog( "close" );} 
						}
					]
			});
	    }
	});
}

function rePrint(dis_no){
	$.ajax({
	    url: "getDistributionDetail",
	    dataType: "json",
		type: "get",
	    data: {
	    	"dis_no": dis_no
	    },
	    success:function(response){
	    	$("#tableDataShow tbody").html("");
	    	$.each(response.data,function (index,value) {
	    		var tr = $("<tr/>");
	    		$("<td style=\"text-align:center;\" />").html(index+1).appendTo(tr);
	    		$("<td style=\"text-align:center;\" />").html(value.bus_number).appendTo(tr);
	    		$("<td style=\"text-align:center;\" />").html(value.sap_material).appendTo(tr);
	    		$("<td style=\"text-align:center;\" />").html(value.part_name).appendTo(tr);
	    		$("<td style=\"text-align:center;\" />").html(value.required_quantity).appendTo(tr);
	    		$("<td style=\"text-align:center;\" />").html(value.unit).appendTo(tr);
	    		$("<td style=\"text-align:center;\" />").html(value.dis_quantity).appendTo(tr);
	    		$("<td style=\"text-align:center;\" />").html(value.vendor).appendTo(tr);
	    		$("#tableDataShow tbody").append(tr);	    		
	    	});
	    	$("#tableDataPrint tbody").html("");
	    	$.each(response.data,function (index,value) {
	    		var tr = $("<tr/>");
	    		$("<td style=\"text-align:center;\" />").html(index+1).appendTo(tr);
	    		$("<td style=\"text-align:center;\" />").html(value.bus_number).appendTo(tr);
	    		$("<td style=\"text-align:center;\" />").html(value.sap_material).appendTo(tr);
	    		$("<td style=\"text-align:center;\" />").html(value.part_name).appendTo(tr);
	    		$("<td style=\"text-align:center;\" />").html(value.required_quantity).appendTo(tr);
	    		$("<td style=\"text-align:center;\" />").html(value.unit).appendTo(tr);
	    		$("<td style=\"text-align:center;\" />").html(value.dis_quantity).appendTo(tr);
	    		$("<td style=\"text-align:center;\" />").html(value.vendor).appendTo(tr);
	    		$("#tableDataPrint tbody").append(tr);	    		
	    	});
	    	$("#dialog-print").removeClass('hide').dialog({
				resizable: false,
				title: '<div class="widget-header"><h4 class="smaller"><i class="ace-icon fa fa-users green"></i> Distribution Info</h4></div>',
				title_html: true,
				width:'1200px',
				modal: true,
				buttons: [{
							text: "Close",
							"class" : "btn btn-minier",
							click: function() {$( this ).dialog( "close" );} 
						},
						{
							text: "rePrint",
							id:"btn_ok",
							"class" : "btn btn-success btn-minier",
							click: function() {
								btnPrintConfirm(dis_no);
							} 
						}
					]
			});
	    }
	});
}

function remove(dis_no){
	if(confirm(Warn['P_lineInventory_02'])){
		$.ajax({
		    url: "removeDistribution",
		    dataType: "json",
			type: "get",
		    data: {
		    	"dis_no": dis_no
		    },
		    success:function(response){
		    	alert(Warn['P_lineInventory_03'])
		    	ajaxQuery();
		    }
		});
	}
}

function btnPrintConfirm(dis_no){
	$("#dialog-print").dialog( "close" );
	$("#dis_no").html("Distribution No. " + dis_no);
	window.print();
}

function selectAll(){
	//$("#tableData tbody :checkbox").prop("checked", true);
	//console.log($("#selectAll").prop("checked"));
	if ($("#selectAll").prop("checked") == true) {
		check_All_unAll("#tableData", true);
	} else {
		check_All_unAll("#tableData", false);
	}
}

