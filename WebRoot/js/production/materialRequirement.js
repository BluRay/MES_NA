var pageSize=1;
var table;
var table_height = $(window).height()-250;
var query_data;
var req_arr = [];
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
	
	$(document).on('click', '#btnPrint',function(){
		var tr_count = 0;
		var vali_data = 0;
		req_arr = [];
		$("#tableDataPrint tbody").html("");
		$("#tableData tbody :checkbox").each(function(){
			if($(this).prop("checked")){
				//console.log("-->tableData checkbox " + tr_count + ":" + query_data[tr_count].item_no);
				if($("#des_" + tr_count).val() == ""){
					vali_data = -1;
				}
				var tr = $("<tr/>");
	    		$("<td style=\"text-align:center;\" />").html(query_data[tr_count].item_no).appendTo(tr);
	    		$("<td style=\"text-align:center;\" />").html(query_data[tr_count].bus_number).appendTo(tr);
	    		$("<td style=\"text-align:center;\" />").html(query_data[tr_count].SAP_material).appendTo(tr);
	    		$("<td style=\"text-align:center;\" />").html(query_data[tr_count].part_name).appendTo(tr);
	    		$("<td style=\"text-align:center;\" />").html(query_data[tr_count].quantity).appendTo(tr);
	    		$("<td style=\"text-align:center;\" />").html(query_data[tr_count].unit).appendTo(tr);
	    		$("<td style=\"text-align:center;\" />").html($("#des_" + tr_count).val()).appendTo(tr);
	    		$("<td style=\"text-align:center;\" />").html(query_data[tr_count].vendor).appendTo(tr);
	    		$("#tableDataPrint tbody").append(tr);
				req_arr.push(tr_count);
			}
			tr_count++;
		});

		tr_count = 0;
		$("#tableDataShow tbody").html("");
		$("#tableData tbody :checkbox").each(function(){
			if($(this).prop("checked")){
				var tr = $("<tr/>");
	    		$("<td style=\"text-align:center;\" />").html(query_data[tr_count].item_no).appendTo(tr);
	    		$("<td style=\"text-align:center;\" />").html(query_data[tr_count].bus_number).appendTo(tr);
	    		$("<td style=\"text-align:center;\" />").html(query_data[tr_count].SAP_material).appendTo(tr);
	    		$("<td style=\"text-align:center;\" />").html(query_data[tr_count].part_name).appendTo(tr);
	    		$("<td style=\"text-align:center;\" />").html(query_data[tr_count].quantity).appendTo(tr);
	    		$("<td style=\"text-align:center;\" />").html(query_data[tr_count].unit).appendTo(tr);
	    		$("<td style=\"text-align:center;\" />").html($("#des_" + tr_count).val()).appendTo(tr);
	    		$("<td style=\"text-align:center;\" />").html(query_data[tr_count].vendor).appendTo(tr);
	    		query_data[tr_count].dis_num=$("#des_" + tr_count).val();
	    		query_data[tr_count].station_id=$("#search_station").val();
	    		$("#tableDataShow tbody").append(tr);
			}
			tr_count++;
		});
		if(req_arr.length == 0){
			alert(Warn['P_materialRequirement_02']);
			return false;
		}
		
		if(vali_data == -1){
			alert(Warn['P_materialRequirement_01']);
			return false;
		}else{
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
							text: "Save",
							id:"btn_ok",
							"class" : "btn btn-success btn-minier",
							click: function() {
								btnPrintConfirm();
							} 
						}
					]
			});
		}
		
	});

	function btnPrintConfirm(){
		$("#dialog-print").dialog( "close" );
		
		var req_data = [];
		for(var i=0;i<req_arr.length;i++){
			req_data.push(query_data[req_arr[i]]);
		}
		console.log("req_data = ",req_data);
		$.ajax({
			url : "printMaterialRequirement",
			dataType : "json",
			data : {
				conditions:JSON.stringify(req_data)
			},
			async : false,
			error : function(response) {
				alert(response.message)
			},
			success : function(response) {
				$("#dis_no").html("Distribution No. " + response.message);
				window.print();
				ajaxQuery();
			}
		});
		
	}
	
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
	    	query_data = response.data;
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
		    	$("<td style=\"text-align:center;\" />").html(value.dis_qty).appendTo(tr);
		    	$("<td style=\"text-align:center;\" />").html(value.unit).appendTo(tr);
		    	$("<td style=\"text-align:center;\" />").html(value.line_quantity).appendTo(tr);
		    	var des_num = value.quantity - value.dis_qty - value.line_quantity;
		    	$("<td style=\"text-align:center;\" />").html("<input style='width:60px' id='des_"+index+"' value='"+((des_num<0)?0:des_num)+"' onkeyup=\"value=value.replace(/[^\\d]/g,'')\" type='text'/>").appendTo(tr);
		    	$("<td style=\"text-align:center;\" />").html(value.vendor).appendTo(tr);		    			    	
		    	$("#tableData tbody").append(tr);
	    	})
	    }
	});
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

