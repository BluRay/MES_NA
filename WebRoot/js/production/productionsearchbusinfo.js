var cur_tab = "01";
$(document).ready(function () {	
	initPage();
	
	function initPage(){
		getBusNumberSelect('#search_busnumber');
		getBusNumberSelect('#nav-search-input');
		cur_tab = "01";
		if(Request("bus_number")!=""){
			$("#search_busnumber").val(Request("bus_number"));
			ajaxQuery();
		}
	}

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("../production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})
	
	$("li").on('click',function(e){
		if(this.id == "div1"){			//基本信息
			cur_tab = "01";
			ajaxQuery();
		}else if(this.id == "div2"){	//生产信息
			cur_tab = "02";
			ajaxQueryTab02();
		}else if(this.id == "div3"){ // Bus Trace
			cur_tab = "03";
			ajaxQueryTab03();
		}else if(this.id == "div4"){
			cur_tab = "04";
			ajaxQueryTab04();
		}else if(this.id == "div5"){ // 生产扫描
			cur_tab = "05";
			ajaxQueryTab05();
		}else if(this.id == "div6"){	//技改
			cur_tab = "06";
			ajaxQueryTab06();
		}
//		else if(this.id == "div7"){
//			cur_tab = "07";
//			ajaxQueryTab07();
//		}else if(this.id == "div8"){
//			cur_tab = "08";
//			ajaxQueryTab08();
//		}else if(this.id == "div9"){
//			cur_tab = "09";
//			ajaxQueryTab09();
//		}else if(this.id == "div10"){
//			cur_tab = "10";
//			ajaxQueryTab10();
//		}
	});
	
	$("#btnQuery").click (function () {
		if(cur_tab == "01")ajaxQuery();
		if(cur_tab == "02")ajaxQueryTab02();
		if(cur_tab == "03")ajaxQueryTab03();
		if(cur_tab == "04")ajaxQueryTab04();
		if(cur_tab == "05")ajaxQueryTab05();
		if(cur_tab == "06")ajaxQueryTab06();
//		if(cur_tab == "07")ajaxQueryTab07();
//		if(cur_tab == "08")ajaxQueryTab08();
//		if(cur_tab == "09")ajaxQueryTab09();
//		if(cur_tab == "10")ajaxQueryTab10();
	});
	
});

function ajaxQuery(){
	if($("#search_busnumber").val()==""){
		alert(Warn['P_common_02']);
		return false;
	}
	clear_baseinfo();
	if($("#search_busnumber").val()!=""){
		clear_baseinfo();
		$.ajax({
		    url: "getProductionSearchBusInfo",
		    dataType: "json",
			type: "get",
		    data: {
		    	"bus_number": $('#search_busnumber').val()
		    },
		    success:function(response){
		    	$.each(response.data,function (index,value) {
		    		$("#tab01_order_no").html(value.project_no + " " + value.project_name);
		    		$("#tab01_bus_number").html(value.bus_number);
		    		$("#tab01_vin").html(value.vin);
		    		$("#tab01_factory_name").html(value.factory_name);
		    		$("#tab01_customer").html(value.customer);
		    		var production_status="";
		    		if(value.delivery!=null && value.delivery!=''){
		    			production_status="Completed";
		    		}else if(convert(value.welding_online)=='' && convert(value.welding_offline)==''
		    			&& convert(value.painting_online)=='' && convert(value.painting_offline)=='' 
		    				&& convert(value.chassis_online)=='' && convert(value.chassis_offline)==''
		    					&& convert(value.painting_online)=='' && convert(value.painting_offline)==''
		    						&& convert(value.testing)=='' && convert(value.outgoing)==''){
		    			production_status = "Not Started";
		    		}else{
		    			production_status="In Process";
		    			$("#tab01_current_station").html(value.current_station);
		    		}
		    		$("#tab01_production_status").html(production_status);
		    		$("#tab01_welding_online_date").html(value.welding_online);
		    		$("#tab01_welding_offline_date").html(value.welding_offline);
		    		$("#tab01_painting_online_date").html(value.painting_online);
		    		$("#tab01_painting_offline_date").html(value.painting_offline);
		    		$("#tab01_chassis_online_date").html(value.chassis_online);
		    		$("#tab01_chassis_offline_date").html(value.chassis_offline);
		    		$("#tab01_assembly_online_date").html(value.assembly_online);
		    		$("#tab01_assembly_offline_date").html(value.assembly_offline);
		    		$("#tab01_testing").html(value.testing);
		    		$("#tab01_outgoing").html(value.outgoing);	
		    		$("#tab01_delivery").html(value.delivery);	
		    	})
		    }
		});
	}
}

function ajaxQueryTab02(){
	if($("#search_busnumber").val()==""){
		alert(Warn['P_common_02']);
		return false;
	}
	$.ajax({
	    url: "../quality/getPunchList",
	    dataType: "json",
		type: "get",
	    data: {
	    	"bus_number": $('#search_busnumber').val()
	    },
	    success:function(response){
	    	if($.fn.dataTable.isDataTable("#table02")){
	    		$('#table02').DataTable().destroy();
	    		$('#table02').empty();
	    	}
	    	var datalist=response.data;
            var columns=[
	            {"title":"No.","class":"center","width":"3%","data":"item_no","defaultContent": "","render":function(data,type,row,meta){
					return meta.row + meta.settings._iDisplayStart + 1;
		        }},
	            {"title":"Plant","class":"center","width":"5%","data":"plant","defaultContent": ""},
	            {"title":"Workshop","class":"center","width":"5%","data":"workshop","defaultContent": ""},
	            {"title":"Source Workshop","class":"center","width":"5%","data": "source_workshop","defaultContent": ""},
	            {"title":"Location","class":"center","width":"5%","data":"main_location","defaultContent": ""},
	            {"title":"Orientation","class":"center","width":"5%","data": "orientation","defaultContent": ""},
	            {"title":"Problem Description","class":"center","width":"15%","data": "problem_description","defaultContent": ""},
	            {"title":"Defect Codes","class":"center","width":"5%","data":"defect_codes","defaultContent": ""},
	            {"title":"Responsible Leader","class":"center","width":"5%","data":"responsible_leader","defaultContent": ""},
	            {"title":"QC Inspector","class":"center","width":"5%","data":"qc_inspector","defaultContent": ""},
	            {"title":"Date Found","class":"center","width":"5%","data": "date_found","defaultContent": ""},
	            {"title":"Lead Initials","class":"center","width":"5%","data":"lead_initials","defaultContent": ""},
	            {"title":"Lead Initials Date","class":"center","width":"10%","data": "lead_initials_date","defaultContent": ""},
	            {"title":"Quality Initials","class":"center","width":"5%","data": "quality_initials","defaultContent": ""},
	            {"title":"Quality Initials Date","class":"center","width":"10%","data": "quality_initials_date","defaultContent": ""}
	        ];
			var t=$("#table02").DataTable({
				paiging:false,
				ordering:false,
				processing:true,
				searching: false,
				autoWidth:false,
				paginate:false,
				sScrollY: $(window).height()-300,
				scrollX: "100%",
				scrollCollapse: true,
				lengthChange:false,
				orderMulti:false,
				info:false,
				data:datalist,
				columns:columns
			});
			if(datalist.length>0){
				var head_width=$("#table02_wrapper").width();
				if(head_width>0){
					$("#table02_wrapper .dataTables_scrollHead").css("width",head_width-17);
				}
			}
	    }
	});
}

function ajaxQueryTab03(){
	if($("#search_busnumber").val()==""){
		alert(Warn['P_common_02']);
		return false;
	}
	$.ajax({
	    url: "../quality/getBusNumberDetailList",
	    dataType: "json",
		type: "get",
	    data: {
	    	"bus_number": $('#search_busnumber').val()
	    },
	    success:function(response){
	    	if($.fn.dataTable.isDataTable("#table03")){
	    		$('#table03').DataTable().destroy();
	    		$('#table03').empty();
	    	}
	    	var datalist=response.data;
            var columns=[
                 {"title":"No.","class":"center","width":"5%","data":"item_no","defaultContent": "","render":function(data,type,row,meta){
 					return meta.row + meta.settings._iDisplayStart + 1;
 		        }},	           
         		{"title":"Bus No.","class":"center","width":"10%","data":"bus_number","defaultContent": ""},
	            {"title":"SAP Material","class":"center","width":"15%","data":"SAP_material","defaultContent": ""},
	            {"title":"Parts Name","class":"center","width":"15%","data": "parts_name","defaultContent": ""},
	            {"title":"BYD P/N","class":"center","width":"10%","data":"BYD_NO","defaultContent": ""},
	            {"title":"Vendor","class":"center","width":"15%","data": "vendor","defaultContent": ""},
	            {"title":"Workshop","class":"center","width":"10%","data": "workshop","defaultContent": ""},
	            {"title":"Station","class":"center","width":"10%","data": "station","defaultContent": ""},
	            {"title":"Batch","class":"center","width":"10%","data": "batch","defaultContent": ""}
	        ];
			var t=$("#table03").DataTable({
				paiging:false,
				ordering:false,
				processing:true,
				searching: false,
				autoWidth:false,
				paginate:false,
				sScrollY: $(window).height()-300,
				scrollX: true,
				scrollCollapse: true,
				lengthChange:false,
				orderMulti:false,
				info:false,
				data:datalist,
				columns:columns
			});
			if(datalist.length>0){
				var head_width=$("#table03_wrapper").width();
				if(head_width>0){
					$("#table03_wrapper .dataTables_scrollHead").css("width",head_width-17);
				}
			}
	    }
	});
}

function ajaxQueryTab04(){  // 成品记录
	if($("#search_busnumber").val()==""){
		alert(Warn['P_common_02']);
		return false;
	}
	$.ajax({
	    url: "../quality/getInspectionRecordDetail",
	    dataType: "json",
		type: "get",
	    data: {
	    	"bus_number": $('#search_busnumber').val()
	    },
	    success:function(response){
	    	if($.fn.dataTable.isDataTable("#table04")){
	    		$('#table04').DataTable().destroy();
	    		$('#table04').empty();
	    	}
	    	var datalist=response.data;
            var columns=[
                 {"title":"No.","class":"center","width":"5%","data":"item_no","defaultContent": "","render":function(data,type,row,meta){
 					return meta.row + meta.settings._iDisplayStart + 1;
 		        }},	           
         		{"title":"Bus No.","class":"center","width":"10%","data":"bus_number","defaultContent": ""},
	            {"title":"Inspection Item","class":"center","width":"10%","data":"inspection_item","defaultContent": ""},
	            {"title":"Specification And Standard","class":"center","width":"25%","data": "specification_and_standard","defaultContent": ""},
	            {"title":"Workshop","class":"center","width":"10%","data":"workshop","defaultContent": ""},
	            {"title":"Station","class":"center","width":"10%","data": "station","defaultContent": ""},
	            {"title":"Process Name","class":"center","width":"10%","data": "process_name","defaultContent": ""},
	            {"title":"Supervisor","class":"center","width":"10%","data": "supervisor","defaultContent": ""},
	            {"title":"Supervisor Date","class":"center","width":"10%","data": "supervisor_date","defaultContent": ""}
	        ];
			var t=$("#table04").DataTable({
				paiging:false,
				ordering:false,
				processing:true,
				searching: false,
				autoWidth:false,
				paginate:false,
				sScrollY: $(window).height()-300,
				scrollX: true,
				scrollCollapse: true,
				lengthChange:false,
				orderMulti:false,
				info:false,
				data:datalist,
				columns:columns
			});
			if(datalist.length>0){
				var head_width=$("#table04_wrapper").width();
				if(head_width>0){
					$("#table04_wrapper .dataTables_scrollHead").css("width",head_width-17);
				}
			}
	    }
	});
}

function ajaxQueryTab05(){ // 扫描信息
	if($("#search_busnumber").val()==""){
		alert(Warn['P_common_02']);
		return false;
	}
	$.ajax({
	    url: "getBusNumberScanList",
	    dataType: "json",
		type: "get",
	    data: {
	    	"bus_number": $('#search_busnumber').val()
	    },
	    success:function(response){
	    	if($.fn.dataTable.isDataTable("#table05")){
	    		$('#table05').DataTable().destroy();
	    		$('#table05').empty();
	    	}
	    	var datalist=response.data;
            var columns=[
                 {"title":"No.","class":"center","width":"3%","data":"item_no","defaultContent": "","render":function(data,type,row,meta){
 					return meta.row + meta.settings._iDisplayStart + 1;
 		        }},	           
         		{"title":"Plant","class":"center","width":"15%","data":"plant","defaultContent": ""},
	            {"title":"Workshop","class":"center","width":"15%","data":"workshop","defaultContent": ""},
	            {"title":"Station","class":"center","width":"15%","data": "station","defaultContent": ""},
	            {"title":"Status","class":"center","width":"10%","data":"on_offline","defaultContent": ""},
	            {"title":"Scanner","class":"center","width":"10%","data": "scanner","defaultContent": ""},
	            {"title":"Scan Date","class":"center","width":"25%","data": "scan_date","defaultContent": ""}
	        ];

			var t=$("#table05").DataTable({
				paiging:false,
				ordering:false,
				processing:true,
				searching: false,
				autoWidth:false,
				paginate:false,
				sScrollY: $(window).height()-300,
				scrollX: true,
				scrollCollapse: true,
				lengthChange:false,
				orderMulti:false,
				info:false,
				data:datalist,
				columns:columns
			});
			if(datalist.length>0){
				var head_width=$("#table05_wrapper").width();
				if(head_width>0){
					$("#table05_wrapper .dataTables_scrollHead").css("width",head_width-17);
				}
			}
	    }
	});
}
function ajaxQueryTab06(){
	if($("#search_busnumber").val()==""){
		alert(Warn['P_common_02']);
		return false;
	}
	$.ajax({
	    url: "getEcnBusListByBusNo",
	    dataType: "json",
		type: "get",
	    data: {
	    	"bus_number": $('#search_busnumber').val()
	    },
	    success:function(response){
	    	if($.fn.dataTable.isDataTable("#table06")){
	    		$('#table06').DataTable().destroy();
	    		$('#table06').empty();
	    	}
	    	var datalist=response.data;
            var columns=[
                 {"title":"No.","class":"center","width":"5%","data":"item_no","defaultContent": "","render":function(data,type,row,meta){
 					return meta.row + meta.settings._iDisplayStart + 1;
 		        }},	           
         		{"title":"Items","class":"center","width":"10%","data":"items","defaultContent": ""},
	            {"title":"Problem Details","class":"center","width":"20%","data":"problem_details","defaultContent": ""},
	            {"title":"Station","class":"center","width":"10%","data":"production_people","defaultContent": ""},
	            {"title":"Supervisor Date","class":"center","width":"15%","data": "confirmed_date","defaultContent": ""},
	            {"title":"QC Inspection","class":"center","width":"10%","data": "qc","defaultContent": ""},
	            {"title":"QC Inspection Date","class":"center","width":"15%","data": "qc_date","defaultContent": ""}
	        ];
			var t=$("#table06").DataTable({
				paiging:false,
				ordering:false,
				processing:true,
				searching: false,
				autoWidth:false,
				paginate:false,
				sScrollY: $(window).height()-300,
				scrollX: true,
				scrollCollapse: true,
				lengthChange:false,
				orderMulti:false,
				info:false,
				data:datalist,
				columns:columns
			});
			if(datalist.length>0){
				var head_width=$("#table06_wrapper").width();
				if(head_width>0){
					$("#table06_wrapper .dataTables_scrollHead").css("width",head_width-17);
				}
			}
	    }
	});
}

function Request(strName){  
	var strHref = location.href; 
	var intPos = strHref.indexOf("?");  
	var strRight = strHref.substr(intPos + 1);  
	var arrTmp = strRight.split("&");  
	for(var i = 0; i < arrTmp.length; i++) {  
		var arrTemp = arrTmp[i].split("=");  
		if(arrTemp[0].toUpperCase() == strName.toUpperCase()) return arrTemp[1];  
	}  
	return "";  
}

function clear_baseinfo(){
	$("#tab01_order_no").html("");
	$("#tab01_bus_number").html("");
	$("#tab01_vin").html("");
	$("#tab01_factory_name").html("");
	$("#tab01_customer").html("");
	$("#tab01_production_status").html("");
	$("#tab01_dispatch_date").html("");
	$("#tab01_welding_online_date").html("");
	$("#tab01_welding_offline_date").html("");
	$("#tab01_fiberglass_offline_date").html("");
	$("#tab01_painting_online_date").html("");
	$("#tab01_painting_offline_date").html("");
	$("#tab01_chassis_online_date").html("");
	$("#tab01_chassis_offline_date").html("");
	$("#tab01_assembly_online_date").html("");
	$("#tab01_assembly_offline_date").html("");
	$("#tab01_debugarea_online_date").html("");
	$("#tab01_debugarea_offline_date").html("");
	$("#tab01_testline_online_date").html("");
	$("#tab01_testline_offline_date").html("");
	$("#tab01_warehousing_date").html("");	    			
}
function convert(str){
	var ret="";
	if(str!=null && str!=''){
		ret=str;
	}
	return ret;
}