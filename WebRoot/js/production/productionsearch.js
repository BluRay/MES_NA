$(document).ready(function () {	
	initPage();
	
	function initPage(){
		getBusNumberSelect('#search_busnumber');
		getBusNumberSelect('#nav-search-input');
		
		var d = new Date();
		var eYear = d.getFullYear();
		var eMon = d.getMonth() + 1;
		var eDay = d.getDate();
		cDate = (eYear) + "-" + (eMon < 10 ? "0" + eMon : eMon) + "-" + (eDay < 10 ? "0" + eDay : eDay);
		$("#date_start").val(cDate);
		$("#date_end").val(cDate);
		
		var factoryId=getQueryString("factory");
		if(!factoryId){
			factoryId="";
		}
		var workshop=getQueryString("workshop");
		if(!workshop){
			workshop="";
		}
		var onoff=getQueryString("onoff");
		if(workshop=='焊装'||workshop=='涂装'||workshop=='底盘'||workshop=='总装'||workshop=='调试区'||workshop=='检测线'){
			onoff=onoff||"";
		}
		if(onoff!=undefined){
			$("#onoff_lable").show();
			$("#onoff_td").show();
			$("#on_offline").val(onoff);
			$("#exce_lable").hide();
			$("#exce_td").hide();
			$("#date_lable").show();
			$("#date_td").show();
		}else{
			$("#onoff_lable").hide();
			$("#onoff_td").hide();
			$("#on_offline").val("");
			$("#exce_lable").show();
			$("#exce_td").show();
			$("#date_lable").hide();
			$("#date_td").hide();
		}
		getFactorySelect(factoryId);
		//获取当前用户所属工厂
		getWorkshopSelect(workshop);
		
		getOrderNoSelect("#search_order_no","#orderId");
		
		ajaxQuery();
	}

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/BMS/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})
	
	$('#search_factory').change(function(){
		$("#on_offline").val("");
		getWorkshopSelect();
	})
	
	$("#search_workshop").on("change",function(){
		$("#on_offline").val("");
		var workshop=$(this).find("option:selected").text();
		//if(workshop=='20'||workshop=='22'||workshop=='23'||workshop=='24'||workshop=='25'||workshop=='26'){
		if(workshop=='焊装'||workshop=='涂装'||workshop=='底盘'||workshop=='总装'||workshop=='调试区'||workshop=='检测线'){
			$("#onoff_lable").show();
			$("#onoff_td").show();
		}else{
			$("#onoff_lable").hide();
			$("#onoff_td").hide();
		}
	});
	
	$("#on_offline").change(function(){
		if($(this).val()!=''){
			$("#exce_lable").hide();
			$("#exce_td").hide();
			$("#date_lable").show();
			$("#date_td").show();
		}else{
			$("#exce_lable").show();
			$("#exce_td").show();
			$("#date_lable").hide();
			$("#date_td").hide();
		}
	});
	
	$("#btnQuery").click (function () {
		if($("#search_factory").val()==""){
			alert("请选择生产工厂！");
			return false;
		}		
		ajaxQuery();
		return false;
	});
	
});

function ajaxQuery(){
	$.ajax({
	    url: "getProductionSearch",
	    dataType: "json",
		type: "get",
	    data: {
	    	"factory_id": $('#search_factory').val(),
	    	"workshop_id": $('#search_workshop').val(),
	    	"line_id": $('#search_line').val(),
	    	"exception_type": $('#search_exception').val(),
	    	"order_no": $('#search_order_no').val(),
	    	"onoff":$("#on_offline").val(),
	    	"start_date":$("#date_start").val(),
	    	"end_date":$("#date_end").val()
	    },
	    success:function(response){	
	    	$("#th_count_onoff").hide();
			$("#th_count_cs").hide();
			$("#th_count_other").hide();
			if($("#on_offline").val()!=""){
				$("#th_count_onoff").show();
				$("#count_info").html($("#on_offline").val()+"车辆数量统计：");
				$("#detail_info").html($("#on_offline").val()+"车辆明细：");
			}else if($('#search_factory').val()=='16'){
				$("#th_count_cs").show();
				$("#count_info").html("当前车辆数量统计：");
				$("#detail_info").html("当前车辆位置：");
			}else{
				$("#th_count_other").show();
				$("#count_info").html("当前车辆数量统计：");
				$("#detail_info").html("当前车辆位置：");
			}
			
			$("#tableWorkshopCount tbody").html("");
    		$.each(response.data,function (index,value) {
    			var tr = $("<tr height='30px' id= '"+value.id+"'/>");
    			$("<td style=\"text-align:center;padding:3px\" />").html("车辆数").appendTo(tr);
    			$("<td style=\"text-align:center;padding:3px\" />").html(value.welding_count).appendTo(tr);
    			//目前只有长沙工厂有玻璃钢车间
    			/**
    			if($('#search_factory').val() == '16'&&$("#on_offline").val()==''){
    				$("<td style=\"text-align:center;padding:3px\" />").html(value.fiberglass_count).appendTo(tr);
    			}else{
    				//$("<td style=\"text-align:center;padding:3px\" />").html('-').appendTo(tr);
    			}**/
    			if($("#on_offline").val()==''){
    				$("<td style=\"text-align:center;padding:3px\" />").html("<span style='cursor:pointer;color:blue' onclick='ajaxGetWIP(\"wp\");'>"+value.wp_wpi_count+"</span>").appendTo(tr);
    			}
    			$("<td style=\"text-align:center;padding:3px\" />").html(value.painting_count).appendTo(tr);
    			if($("#on_offline").val()==''){
    				$("<td style=\"text-align:center;padding:3px\" />").html("<span style='cursor:pointer;color:blue' onclick='ajaxGetWIP(\"pc\");'>"+value.pc_wpi_count+"</span>").appendTo(tr);
    			}
    			
    			$("<td style=\"text-align:center;padding:3px\" />").html(value.chassis_count).appendTo(tr);
    			if($("#on_offline").val()==''){
    				$("<td style=\"text-align:center;padding:3px\" />").html("<span style='cursor:pointer;color:blue' onclick='ajaxGetWIP(\"ca\");'>"+value.ca_wpi_count+"</span>").appendTo(tr);
    			}
    			
    			$("<td style=\"text-align:center;padding:3px\" />").html(value.assembly_count).appendTo(tr);
    			$("<td style=\"text-align:center;padding:3px\" />").html(value.debugarea_count).appendTo(tr);
    			$("<td style=\"text-align:center;padding:3px\" />").html(value.testline_count).appendTo(tr);
    			if($("#on_offline").val()==''){
    				$("<td style=\"text-align:center;padding:3px\" />").html(value.warehousing_count).appendTo(tr);
    			}
    			
    			$("#tableWorkshopCount tbody").append(tr);
    		});
    		$("#count_info").show();
    		$("#tableWorkshopCount").show();
			
	    }
	})
	ajaxGetWIP('');
}

function ajaxGetWIP(wip_flg){
	$.ajax({
	    url: "getProductionSearchCarinfo",
	    dataType: "json",
		type: "get",
	    data: {
	    	"factory_id": $('#search_factory').val(),
	    	"workshop": $('#search_workshop').find("option:selected").text(),
	    	"line": $('#search_line').find("option:selected").text(),
	    	"exception_type": $('#search_exception').val(),
	    	"order_no": $('#search_order_no').val(),
	    	"bus_number": $('#search_busnumber').val(),
	    	"onoff":$("#on_offline").val(),
	    	"start_date":$("#date_start").val(),
	    	"end_date":$("#date_end").val(),
	    	"wip_flg":wip_flg,
	    },
	    success:function(response){	
	    	$("#tableWorkshopCarinfo tbody").html("");
    		var count = 1;
    		$.each(response.data,function (index,value) {
    			var tr = $("<tr height='30px' id= '"+value.id+"'/>");
    			var workshop = value.workshop;var carstatus = "正常";
    			if(value.workshop == "welding") workshop = "焊装";
    			if(value.workshop == "fiberglass") workshop = "玻璃钢";
    			if(value.workshop == "painting") workshop = "涂装";
    			if(value.workshop == "chassis") workshop = "底盘";
    			if(value.workshop == "assembly") workshop = "总装";
    			if(value.workshop == "debugarea") workshop = "调试区";
    			if(value.workshop == "testline") workshop = "检测线";
    			if(value.workshop == "warehousing") workshop = "成品库";
    			if(value.production_status == "1")carstatus = "返修";
    			if(value.production_status == "2")carstatus = "技改";
    			//目前只有长沙工厂有玻璃钢车间
    			if(!(($('#search_factory').val() != '16')&&(workshop == "玻璃钢"))){
        			$("<td style=\"text-align:center;padding:3px\" />").html(count).appendTo(tr);
        			$("<td style=\"text-align:center;padding:3px\" />").html(value.order_no + " " + value.order_name + value.bus_type_code +" "+ value.order_qty + "辆").appendTo(tr);
        			$("<td style=\"text-align:center;padding:3px\" />").html('<a href = "productionsearchbusinfo?bus_number='+value.bus_number+'">'+value.bus_number+'</a>').appendTo(tr);
        			$("<td style=\"text-align:center;padding:3px\" />").html(workshop).appendTo(tr);
        			$("<td style=\"text-align:center;padding:3px\" />").html(value.line).appendTo(tr);
        			$("<td style=\"text-align:center;padding:3px\" />").html(value.process).appendTo(tr);
        			$("<td style=\"text-align:center;padding:3px\" />").html(value.enterdate).appendTo(tr);
        			$("<td style=\"text-align:center;padding:3px\" />").html(carstatus).appendTo(tr);
        			$("#tableWorkshopCarinfo tbody").append(tr);	
        			count++;
    			}
    		});
    		$("#detail_info").show();
    		$("#tableWorkshopCarinfo").show();
	    }
	})
	
}

function getFactorySelect(factoryId) {
	$.ajax({
		url : "../common/getFactorySelect",
		dataType : "json",
		data : {},
		async : false,
		error : function(response) {
			alert(response.message)
		},
		success : function(response) {
			getSelects(response.data, factoryId, "#search_factory");
			getSelects_noall(response.data, "", "#new_factory");
			getSelects_noall(response.data, "", "#edit_factory");
			getWorkshopSelect();
		}
	});
}

function getWorkshopSelect(workshop) {
	workshop=workshop||"";
	$.ajax({
		url : "../common/getWorkshopSelect",
		dataType : "json",
		data : {"factoryId": $('#search_factory').val()},
		async : false,
		error : function(response) {
			alert(response.message)
		},
		success : function(response) {
			getSelects(response.data, workshop, "#search_workshop","全部");			
		}
	});
}

