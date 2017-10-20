var pageSize=1;
var table;
var table_height = $(window).height()-250;
$(document).ready(function () {	
	initPage();
	
	function initPage(){
		getBusNumberSelect('#nav-search-input');
		getFactorySelect();
		ajaxQuery();
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
	    url: "getMaterialRequirement",
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
	    	"bus_number": $('#search_busno').val()
	    },
	    success:function(response){
	    	$("#tableData tbody").html("");
	    	$.each(response.data,function (index,value) {
	    		var tr = $("<tr/>");
	    		$("<td style=\"text-align:center;\" />").html("<input id='data_"+index+"' type='checkbox'/>").appendTo(tr);
	    		$("<td style=\"text-align:center;\" />").html(value.item_no).appendTo(tr);
		    	$("<td style=\"text-align:center;\" />").html(value.station).appendTo(tr);
		    	$("<td style=\"text-align:center;\" />").html(value.bus_number).appendTo(tr);
		    	$("<td style=\"text-align:center;\" />").html(value.SAP_material).appendTo(tr);
		    	$("<td style=\"text-align:center;\" />").html(value.BYD_NO).appendTo(tr);
		    	$("<td style=\"text-align:center;\" />").html(value.part_name).appendTo(tr);
		    	$("<td style=\"text-align:center;\" />").html(value.specification).appendTo(tr);
		    	$("<td style=\"text-align:center;\" />").html(value.quantity).appendTo(tr);
		    	$("<td style=\"text-align:center;\" />").html(value.unit).appendTo(tr);
		    	$("<td style=\"text-align:center;\" />").html("0").appendTo(tr);
		    	$("<td style=\"text-align:center;\" />").html("<input style='width:60px' id='des_"+index+"' type='text'/>").appendTo(tr);
		    	$("<td style=\"text-align:center;\" />").html(value.vendor).appendTo(tr);		    	
		    	
		    	$("#tableData tbody").append(tr);
	    	})
	    }
	});
}

function leadInitials(id){
	$.ajax({
		url : "getPunchInfoByid",
		dataType : "json",
		data : {
	    	"id": id
		},
		success : function(response) {
			//console.log('-->' + response.data[0].plant);
			$("#lead_busNumber").val(response.data[0].bus_number);
			$("#lead_plant").val(response.data[0].plant);
			$("#lead_workshop").val(response.data[0].workshop);
			$("#lead_src_workshop").val(response.data[0].source_workshop);
			$("#lead_location").val(response.data[0].main_location);
			$("#lead_orientation").val(response.data[0].orientation);
			$("#lead_problemDescription").val(response.data[0].problem_description);
			$("#lead_defectcodes").val(response.data[0].defect_codes);
			$("#lead_responsibleleader").val(response.data[0].responsible_leader);		
			$("#lead_QCinspector").val(response.data[0].qc_inspector);	
		}
	});
	
	$("#dialog-lead").removeClass('hide').dialog({
		resizable: false,
		title: '<div class="widget-header"><h4 class="smaller"><i class="ace-icon fa fa-users green"></i> LeadInitials</h4></div>',
		title_html: true,
		width:'800px',
		modal: true,
		buttons: [{
					text: "Close",
					"class" : "btn btn-minier",
					click: function() {$( this ).dialog( "close" );} 
				},
				{
					text: "Save",
					id:"btn_ok",
					"class" : "btn btn-success btn-minier",
					click: function() {
						btnLeadConfirm(id);
					} 
				}
			]
	});
}
function qualityInitials(id){
	$.ajax({
		url : "getPunchInfoByid",
		dataType : "json",
		data : {
	    	"id": id
		},
		success : function(response) {
			$("#qc_busNumber").val(response.data[0].bus_number);
			$("#qc_plant").val(response.data[0].plant);
			$("#qc_workshop").val(response.data[0].workshop);
			$("#qc_src_workshop").val(response.data[0].source_workshop);
			$("#qc_location").val(response.data[0].main_location);
			$("#qc_orientation").val(response.data[0].orientation);
			$("#qc_problemDescription").val(response.data[0].problem_description);
			$("#qc_defectcodes").val(response.data[0].defect_codes);
			$("#qc_responsibleleader").val(response.data[0].responsible_leader);		
			$("#qc_QCinspector").val(response.data[0].qc_inspector);	
		}
	});
	
	$("#dialog-qc").removeClass('hide').dialog({
		resizable: false,
		title: '<div class="widget-header"><h4 class="smaller"><i class="ace-icon fa fa-users green"></i> QualityInitials</h4></div>',
		title_html: true,
		width:'800px',
		modal: true,
		buttons: [{
					text: "Close",
					"class" : "btn btn-minier",
					click: function() {$( this ).dialog( "close" );} 
				},
				{
					text: "Save",
					id:"btn_ok",
					"class" : "btn btn-success btn-minier",
					click: function() {
						btnQcConfirm(id);
					} 
				}
			]
	});
}

function btnQcConfirm(id){
	$.ajax({
		type : "get",
		dataType : "json",
		async : false,
		url : "qcInitialsPunch",
		data : {
			"id" : id
		},
		success : function(response) {
			fadeMessageAlert(null,"SUCCESS","gritter-info");
        	$("#dialog-qc").dialog( "close" );
    		ajaxQuery();
		}
	});
}

