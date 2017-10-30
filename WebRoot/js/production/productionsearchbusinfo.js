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
			ajaxQueryTab03("Tab");
		}else if(this.id == "div4"){
			cur_tab = "04";
			ajaxQueryTab04();
		}else if(this.id == "div5"){ // 生产扫描
			cur_tab = "05";
			ajaxQueryTab05();
        }else if(this.id == "div6"){	//技改
			cur_tab = "06";
			ajaxQueryTab06("Tab");
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
		if(cur_tab == "03")ajaxQueryTab03("Button");
		if(cur_tab == "04")ajaxQueryTab04();
		if(cur_tab == "05")ajaxQueryTab05();
		if(cur_tab == "06")ajaxQueryTab06("Button");
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
//	    	if($.fn.dataTable.isDataTable("#table02")){
//	    		$('#table02').DataTable().destroy();
//	    		$('#table02').empty();
//	    	}
//	    	var datalist=response.data;
//            var columns=[
//	            {"title":"No.","class":"center","width":"3%","data":"item_no","defaultContent": "","render":function(data,type,row,meta){
//					return meta.row + meta.settings._iDisplayStart + 1;
//		        }},
//	            {"title":"Plant","class":"center","width":"5%","data":"plant","defaultContent": ""},
//	            {"title":"Workshop","class":"center","width":"5%","data":"workshop","defaultContent": ""},
//	            {"title":"Source Workshop","class":"center","width":"5%","data": "source_workshop","defaultContent": ""},
//	            {"title":"Location","class":"center","width":"5%","data":"main_location","defaultContent": ""},
//	            {"title":"Orientation","class":"center","width":"5%","data": "orientation","defaultContent": ""},
//	            {"title":"Problem Description","class":"center","width":"15%","data": "problem_description","defaultContent": ""},
//	            {"title":"Defect Codes","class":"center","width":"5%","data":"defect_codes","defaultContent": ""},
//	            {"title":"Responsible Leader","class":"center","width":"5%","data":"responsible_leader","defaultContent": ""},
//	            {"title":"QC Inspector","class":"center","width":"5%","data":"qc_inspector","defaultContent": ""},
//	            {"title":"Date Found","class":"center","width":"5%","data": "date_found","defaultContent": ""},
//	            {"title":"Lead Initials","class":"center","width":"5%","data":"lead_initials","defaultContent": ""},
//	            {"title":"Lead Initials Date","class":"center","width":"10%","data": "lead_initials_date","defaultContent": ""},
//	            {"title":"Quality Initials","class":"center","width":"5%","data": "quality_initials","defaultContent": ""},
//	            {"title":"Quality Initials Date","class":"center","width":"10%","data": "quality_initials_date","defaultContent": ""}
//	        ];
//			var t=$("#table02").DataTable({
//				paiging:false,
//				ordering:false,
//				processing:true,
//				searching: false,
//				autoWidth:false,
//				paginate:false,
//				sScrollY: $(window).height()-335,
//				scrollX: "100%",
//				scrollCollapse: true,
//				lengthChange:false,
//				orderMulti:false,
//				info:false,
//				data:datalist,
//				columns:columns
//			});
//			if(datalist.length>0){
//				var head_width=$("#table02_wrapper").width();
//				if(head_width>0){
//					$("#table02_wrapper .dataTables_scrollHead").css("width",head_width-17);
//				}
//			}
	    	$("#table02 tbody").html("");
	    	$.each(response.data,function(index,value){
	    		var tr = $("<tr height='30px' id= '"+value.id+"'/>");
    			$("<td style=\"text-align:center;padding:3px\" />").html(index + 1).appendTo(tr);
    			$("<td style=\"text-align:center;padding:3px\" />").html(value.plant).appendTo(tr);
    			$("<td style=\"text-align:center;padding:3px\" />").html(value.workshop).appendTo(tr);
    			$("<td style=\"text-align:center;padding:3px\" />").html(value.source_workshop).appendTo(tr);
    			$("<td style=\"text-align:center;padding:3px\" />").html(value.main_location).appendTo(tr);
    			$("<td style=\"text-align:center;padding:3px\" />").html(value.orientation).appendTo(tr);
    			$("<td style=\"text-align:center;padding:3px\" />").html(value.problem_description).appendTo(tr);
    			$("<td style=\"text-align:center;padding:3px\" />").html(value.defect_codes).appendTo(tr);
    			$("<td style=\"text-align:center;padding:3px\" />").html(value.responsible_leader).appendTo(tr);
    			$("<td style=\"text-align:center;padding:3px\" />").html(value.qc_inspector).appendTo(tr);
    			$("<td style=\"text-align:center;padding:3px\" />").html(value.date_found).appendTo(tr);
    			$("<td style=\"text-align:center;padding:3px\" />").html(value.lead_initials).appendTo(tr);
    			$("<td style=\"text-align:center;padding:3px\" />").html(value.lead_initials_date).appendTo(tr);
    			$("<td style=\"text-align:center;padding:3px\" />").html(value.quality_initials).appendTo(tr);
    			$("<td style=\"text-align:center;padding:3px\" />").html(value.quality_initials_date).appendTo(tr);
    			$("#table02 tbody").append(tr);
	    	});
	    }
	});
}

function ajaxQueryTab03(trigger){
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
//	    	if($.fn.dataTable.isDataTable("#table03")){
//	    		$('#table03').DataTable().destroy();
//	    		$('#table03').empty();
//	    	}
//	    	var datalist=response.data;
//            var columns=[
//                 {"title":"No.","class":"center","width":"5%","data":"item_no","defaultContent": "","render":function(data,type,row,meta){
// 					return meta.row + meta.settings._iDisplayStart + 1;
// 		        }},	           
//         		{"title":"Bus No.","class":"center","width":"10%","data":"bus_number","defaultContent": ""},
//	            {"title":"SAP Material","class":"center","width":"15%","data":"SAP_material","defaultContent": ""},
//	            {"title":"Parts Name","class":"center","width":"15%","data": "parts_name","defaultContent": ""},
//	            {"title":"BYD P/N","class":"center","width":"10%","data":"BYD_NO","defaultContent": ""},
//	            {"title":"Vendor","class":"center","width":"15%","data": "vendor","defaultContent": ""},
//	            {"title":"Workshop","class":"center","width":"10%","data": "workshop","defaultContent": ""},
//	            {"title":"Station","class":"center","width":"10%","data": "station","defaultContent": ""},
//	            {"title":"Batch","class":"center","width":"10%","data": "batch","defaultContent": ""}
//	        ];
//			var t=$("#table03").DataTable({
//				paiging:false,
//				ordering:false,
//				processing:true,
//				searching: false,
//				autoWidth:false,
//				paginate:false,
//				sScrollY: $(window).height()-335,
//				scrollX: true,
//				scrollCollapse: true,
//				lengthChange:false,
//				orderMulti:false,
//				info:false,
//				data:datalist,
//				columns:columns
//			});
//			if(trigger=="Tab"){
//				if(datalist.length==0){
//					$("#table03_wrapper").find(".table").css("width","100%");
//				}else{
//					$("#table03_wrapper").find(".table").css("width","98.5%");
//				}
//				$("#table03").css("width","100%");
//			}
	    	$("#table03 tbody").html("");
	    	$.each(response.data,function(index,value){
	    		var tr = $("<tr height='30px' id= '"+value.id+"'/>");
    			$("<td style=\"text-align:center;padding:3px\" />").html(index + 1).appendTo(tr);
    			$("<td style=\"text-align:center;padding:3px\" />").html(value.bus_number).appendTo(tr);
    			$("<td style=\"text-align:center;padding:3px\" />").html(value.SAP_material).appendTo(tr);
    			$("<td style=\"text-align:center;padding:3px\" />").html(value.parts_name).appendTo(tr);
    			$("<td style=\"text-align:center;padding:3px\" />").html(value.BYD_NO).appendTo(tr);
    			$("<td style=\"text-align:center;padding:3px\" />").html(value.vendor).appendTo(tr);
    			$("<td style=\"text-align:center;padding:3px\" />").html(value.workshop).appendTo(tr);
    			$("<td style=\"text-align:center;padding:3px\" />").html(value.station).appendTo(tr);
    			$("<td style=\"text-align:center;padding:3px\" />").html(value.batch).appendTo(tr);
    			$("#table03 tbody").append(tr);
	    	});
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
//	    	if($.fn.dataTable.isDataTable("#table04")){
//	    		$('#table04').DataTable().destroy();
//	    		$('#table04').empty();
//	    	}
//	    	var datalist=response.data;
//            var columns=[
//                 {"title":"No.","class":"center","width":"5%","data":"item_no","defaultContent": "","render":function(data,type,row,meta){
// 					return meta.row + meta.settings._iDisplayStart + 1;
// 		        }},	           
//         		{"title":"Bus No.","class":"center","width":"10%","data":"bus_number","defaultContent": ""},
//	            {"title":"Inspection Item","class":"center","width":"10%","data":"inspection_item","defaultContent": ""},
//	            {"title":"Specification And Standard","class":"center","width":"25%","data": "specification_and_standard","defaultContent": ""},
//	            {"title":"Workshop","class":"center","width":"10%","data":"workshop","defaultContent": ""},
//	            {"title":"Station","class":"center","width":"10%","data": "station","defaultContent": ""},
//	            {"title":"Process Name","class":"center","width":"10%","data": "process_name","defaultContent": ""},
//	            {"title":"Supervisor","class":"center","width":"10%","data": "supervisor","defaultContent": ""},
//	            {"title":"Supervisor Date","class":"center","width":"10%","data": "supervisor_date","defaultContent": ""}
//	        ];
//			var t=$("#table04").DataTable({
//				paiging:false,
//				ordering:false,
//				processing:true,
//				searching: false,
//				autoWidth:false,
//				paginate:false,
//				sScrollY: $(window).height()-335,
//				scrollX: true,
//				scrollCollapse: true,
//				lengthChange:false,
//				orderMulti:false,
//				info:false,
//				data:datalist,
//				columns:columns
//			});
//			if(datalist.length>0){
//				var head_width=$("#table04_wrapper").width();
//				if(head_width>0){
//					$("#table04_wrapper .dataTables_scrollHead").css("width",head_width-17);
//				}
//			}
	    	$("#table04 tbody").html("");
	    	$.each(response.data,function(index,value){
	    		var tr = $("<tr height='30px' id= '"+value.id+"'/>");
    			$("<td style=\"text-align:center;padding:3px\" />").html(index + 1).appendTo(tr);
    			$("<td style=\"text-align:center;padding:3px\" />").html(value.bus_number).appendTo(tr);
    			$("<td style=\"text-align:center;padding:3px\" />").html(value.inspection_item).appendTo(tr);
    			$("<td style=\"text-align:center;padding:3px\" />").html(value.specification_and_standard).appendTo(tr);
    			$("<td style=\"text-align:center;padding:3px\" />").html(value.workshop).appendTo(tr);
    			$("<td style=\"text-align:center;padding:3px\" />").html(value.station).appendTo(tr);
    			$("<td style=\"text-align:center;padding:3px\" />").html(value.process_name).appendTo(tr);
    			$("<td style=\"text-align:center;padding:3px\" />").html(value.supervisor).appendTo(tr);
    			$("<td style=\"text-align:center;padding:3px\" />").html(value.supervisor_date).appendTo(tr);
    			$("#table04 tbody").append(tr);
	    	});
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
//	    	if($.fn.dataTable.isDataTable("#table05")){
//	    		$('#table05').DataTable().destroy();
//	    		$('#table05').empty();
//	    	}
//	    	var datalist=response.data;
//            var columns=[
//                 {"title":"No.","class":"center","width":"3%","data":"item_no","defaultContent": "","render":function(data,type,row,meta){
// 					return meta.row + meta.settings._iDisplayStart + 1;
// 		        }},	           
//         		{"title":"Plant","class":"center","width":"15%","data":"plant","defaultContent": ""},
//	            {"title":"Workshop","class":"center","width":"15%","data":"workshop","defaultContent": ""},
//	            {"title":"Station","class":"center","width":"15%","data": "station","defaultContent": ""},
//	            {"title":"Status","class":"center","width":"10%","data":"on_offline","defaultContent": ""},
//	            {"title":"Scanner","class":"center","width":"10%","data": "scanner","defaultContent": ""},
//	            {"title":"Scan Date","class":"center","width":"25%","data": "scan_date","defaultContent": ""}
//	        ];
//
//			var t=$("#table05").DataTable({
//				//serverSide : false,
//				paiging:false,
//				ordering:false,
//				processing:true,
//				searching: false,
//				autoWidth:false,
//				paginate:false,
//				sScrollY: $(window).height()-335,
//				scrollX: true,
//				scrollCollapse: true,
//				lengthChange:false,
//				orderMulti:false,
//				info:false,
//				data:datalist,
//				columns:columns
//			});
////			if(trigger=="Tab"){
////				if(datalist.length==0){
////				    $("#table05_wrapper").find(".table").css("width","100%");
////				}else{
////					$("#table05_wrapper").find(".table").css("width","98.5%");
////				}
////				$("#table05").css("width","100%");
////			}
	    	$("#table05 tbody").html("");
	    	$.each(response.data,function(index,value){
	    		var tr = $("<tr height='30px' id= '"+value.id+"'/>");
    			$("<td style=\"text-align:center;padding:3px\" />").html(index + 1).appendTo(tr);
    			$("<td style=\"text-align:center;padding:3px\" />").html(value.plant).appendTo(tr);
    			$("<td style=\"text-align:center;padding:3px\" />").html(value.workshop).appendTo(tr);
    			$("<td style=\"text-align:center;padding:3px\" />").html(value.station).appendTo(tr);
    			$("<td style=\"text-align:center;padding:3px\" />").html(value.on_offline).appendTo(tr);
    			$("<td style=\"text-align:center;padding:3px\" />").html(value.scanner).appendTo(tr);
    			$("<td style=\"text-align:center;padding:3px\" />").html(value.scan_date).appendTo(tr);
    			$("#table05 tbody").append(tr);
	    	});
	     }
	});
}
function ajaxQueryTab06(trigger){
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
//	    	if($.fn.dataTable.isDataTable("#table06")){
//	    		$('#table06').DataTable().destroy();
//	    		$('#table06').empty();
//	    	}
//	    	var datalist=response.data;
//            var columns=[
//                 {"title":"No.","class":"center","width":"5%","data":"item_no","defaultContent": "","render":function(data,type,row,meta){
// 					return meta.row + meta.settings._iDisplayStart + 1;
// 		        }},	           
//         		{"title":"Items","class":"center","width":"20%","data":"items","defaultContent": "","render":function(data,row,type){
//                	var html=""
//                	if(data.length>15){
//                		html="<i title='"+data+"' style='font-style: normal'>"+data.substring(1,20)+"...</i>"
//                	}else{
//                		html=data;
//                	}
//                	return html;
//                }},
//	            {"title":"Problem Details","class":"center","width":"20%","data":"problem_details","defaultContent": "","render":function(data,row,type){
//	            	var html=""
//                	if(data.length>20){
//                		html="<i title='"+data+"' style='font-style: normal'>"+data.substring(1,20)+"...</i>"
//                	}else{
//                		html=data;
//                	}
//                	return html;
//                }},
//	            {"title":"Station","class":"center","width":"10%","data":"station","defaultContent": ""},
//	            {"title":"Supervisor Date","class":"center","width":"10%","data": "confirmed_date","defaultContent": ""},
//	            {"title":"QC Inspection","class":"center","width":"10%","data": "qc","defaultContent": ""},
//	            {"title":"QC Inspection Date","class":"center","width":"10%","data": "qc_date","defaultContent": ""}
//	        ];
//			var t=$("#table06").DataTable({
//				paiging:false,
//				ordering:false,
//				processing:true,
//				searching: false,
//				autoWidth:false,
//				paginate:false,
//				sScrollY: $(window).height()-335,
//				scrollX: true,
//				scrollCollapse: true,
//				lengthChange:false,
//				orderMulti:false,
//				info:false,
//				data:datalist,
//				columns:columns
//			});
//			if(trigger=="Tab"){
//				$("#table06_wrapper").find(".table").css("width","100%");
//				$("#table06").css("width","100%");
//			}
	    	$("#table06 tbody").html("");
	    	$.each(response.data,function(index,value){
	    		var tr = $("<tr height='30px' id= '"+value.id+"'/>");
    			$("<td style=\"text-align:center;padding:3px\" />").html(index + 1).appendTo(tr);
    			var html=""
            	if(value.items.length>20){
            		html="<i title='"+value.items+"' style='font-style: normal'>"+value.items.substring(0,15)+"...</i>"
            	}else{
            		html=value.items;
            	}
    			$("<td style=\"text-align:center;padding:3px\" />").html(html).appendTo(tr);
    			html=""
            	if(value.problem_details.length>20){
            		html="<i title='"+value.problem_details+"' style='font-style: normal'>"+value.problem_details.substring(0,18)+"...</i>"
            	}else{
            		html=value.problem_details;
            	}
    			$("<td style=\"text-align:center;padding:3px\" />").html(html).appendTo(tr);
    			$("<td style=\"text-align:center;padding:3px\" />").html(value.station).appendTo(tr);
    			$("<td style=\"text-align:center;padding:3px\" />").html(value.production_people).appendTo(tr);
    			$("<td style=\"text-align:center;padding:3px\" />").html(value.confirmed_date).appendTo(tr);
    			$("<td style=\"text-align:center;padding:3px\" />").html(value.qc).appendTo(tr);
    			$("<td style=\"text-align:center;padding:3px\" />").html(value.qc_date).appendTo(tr);
    			$("#table06 tbody").append(tr);
	    	});
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