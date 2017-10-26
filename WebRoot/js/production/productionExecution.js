var cur_key_name = "";
var vin="";
var left_motor_number="";
var right_motor_number="";
var bus_production_status="0";
var bus_color;
var bus_seats;
var workshop_name;
var station_name;
var order_name;
var order_area;
var bus_type_code;
var order_qty;
var orderType;
var status;
var line_selects_data;
var parts_list;
var parts_update_list=new Array();//非车间上下线工序提交该零部件信息
 
$(document).ready(function () {	
	initPage();
	
	function initPage(){
		getBusNumberSelect('#nav-search-input');
		//alert(location.href.substr(location.href.indexOf("action?")+7,location.href.length));
		$('#rightlink').attr('href','production!exception.action?' + location.href.substr(location.href.indexOf("action?")+7,location.href.length)); 
		getFactorySelect();
		$('#vinText').focus();
		//alert(getQueryString("factory_name"));
	};

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/MES/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})
	
	function resetPage () {
        $("#vinText").removeAttr("disabled");
        $("#vinText").val("");
       	$('#vinText').data("vin","");
    	$('#vinText').data("project_id","");
    	$('#vinText').data("bus_type","");
        $("#vinText").focus();
        toggleVinHint(true);
        $("#btnSubmit").attr("disabled","disabled");
        $("#partsListTable tbody").html("");
        $("#configListTable tbody").html("");
    }
	
	function ajaxEnter(){
		var enterflag=true;
		
		var plan_node=$('#exec_station').find("option:selected").attr("plan_node");
		var field_name=$('#exec_station').find("option:selected").attr("field_name");
		
		/*if($('#exec_workshop :selected').text()=='底盘'||$('#exec_workshop :selected').text()=='检测线'){

			$.each(parts_list,function(i,parts){
				if(parts.station==$("#exec_stationname").val()&&(parts.parts_name=='VIN编码'||parts.parts_name=='左电机号'||parts.parts_name=='右电机号')){
					if(parts.batch==undefined||parts.batch.trim().length==0){
						enterflag=false;
						alert(plan_node+"扫描前，请将零部件信息录入完整！");
						return false;
					}
				}

				if(parts.parts_name=='VIN编码'&&parts.batch!=vin&&parts.station==$("#exec_stationname").val()){
					alert("VIN编码校验失败，请核对该车的VIN编码！");
					enterflag=false;
					return false;
				}
				if(parts.parts_name=='左电机号'&&parts.batch!=left_motor_number&&parts.station==$("#exec_stationname").val()){
					alert("左电机号校验失败，请核对该车的左电机号！");
					enterflag=false;
					return false;
				}
				if(parts.parts_name=='右电机号'&&parts.batch!=right_motor_number&&parts.station==$("#exec_stationname").val()){
					alert("右电机号校验失败，请核对该车的右电机号！");
					enterflag=false;
					return false;
				}
			});
			if(!enterflag){
				//alert(cur_key_name+"扫描前，请将零部件信息录入完整！");
				$("#btnSubmit").attr("disabled",false);
				 return false;
			 }
		}

		if(plan_node.indexOf("下线")>=0&&$('#exec_workshop :selected').text()=='检测线'){
			//alert(cur_key_name);
			$.each(parts_list,function(i,parts){
				if(parts.parts_id !=undefined&&parts.parts_id!=0){
					if(parts.batch==undefined||parts.batch.trim().length==0){
						enterflag=false;
						return false;
					}
				}
			});
			if(!enterflag){
				alert(cur_key_name+"扫描前，请将零部件信息录入完整！");
				$("#btnSubmit").attr("disabled",false);
				 return false;
			 }
		}
		*/
		if(enterflag){
			 $.ajax({
		            type: "post",
		            dataType: "json",
		            url : "enterExecution",
		            data: {
		            	"factory_id" : $('#exec_factory').val(),
		                "bus_number":$('#vinText').val(),
		                "project_id":$('#vinText').data("project_id"),
		                "station_id":$('#exec_station').val(),
		                "factory_name":$('#exec_factory').find("option:selected").text(),
		                "workshop_name":$('#exec_workshop').find("option:selected").text(),
		                "line_name":$('#exec_line').find("option:selected").text(),
		                "station_name":$('#exec_station :selected').attr("station"),
		                "station_id":$('#exec_station').val(),
		                "scanner_id":$('#exec_user').val(),
		                "field_name":field_name,
		                "order_type":orderType,
		                "plan_node_name":plan_node,
		                "rework":$("#exec_type").val(),
		                "on_offline":$("#on_offline").val(),
		                "parts_list":JSON.stringify(parts_list)
		            },
		            success: function(response){
		                resetPage();
		                if(response.success){ 
		                	fadeMessageAlert(null,"Succeed !",'gritter-success');
		                }
		                else{
		                	fadeMessageAlert(null,Warn[response.message],'gritter-error');
		                }

		                //setTimeout(function() {
		                    $("#vinHint").hide().html("");
		                    toggleVinHint(true);
		               // },6000);
		            },
		            error:function(){alertError(); resetPage();}
		        });
		}
       
    }
	
	function ajaxValidate (){
		var plan_node=$('#exec_station').find("option:selected").attr("plan_node");
		$.ajax({
            type: "post",
            dataType: "json",
            url : "getBusInfo",
            async:false,
            data: {
            	"bus_number": $('#vinText').val(),
                "factory_id":$("#exec_factory").val(),
                "station_name":$("#exec_station :selected").attr("station"),
                "workshop":$('#exec_workshop').find("option:selected").text()
            },
            success: function(response){
                    $("#vinText").attr("disabled","disabled");
                    //show car infomation
                    if(response.businfo == ""||response.businfo==null){
                    	fadeMessageAlert(null,'Sorry,no information searched for the entered bus！','gritter-error');
                    	return false;
                    }else if(response.businfo.factory !=$("#exec_factory :selected").text()){
                    	fadeMessageAlert(null,response.businfo.bus_number+'不属于'+$("#exec_factory :selected").text()+'！','gritter-error');
                    	return false;
                    }else{                	
                    	var bus = response.businfo;
                    	$('#vinText').data("vin",bus.VIN);
                    	$('#vinText').data("project_id",bus.project_id);
                    	$('#vinText').data("bus_type",bus.bus_type);
                    	var next_station=response.nextStation;
                    	
                    	bus_production_status=bus.production_status;
                    	orderType=bus.order_type;
                    	vin=bus.VIN;
                		toggleVinHint(false);
                		$("#infoVIN").html(vin);
                		$("#infoWorkShop").html(bus.workshop);
                		$("#infoLine").html(bus.line);
                		$("#infoStation").html(bus.station_name);
                		$("#infoOrder").html(bus.order_desc);
                		$("#infoStatus").html(bus.on_offline);
                		$("#btnSubmit").removeAttr("disabled");
 
                		var cur_line=$("#exec_line option:selected").text();
                		if(bus.order_type!='Standard order'){
                			getAllstationSelect(bus.order_type);
                		}
                		//alert(cur_line);
                		if(bus.line !=$("#exec_line option:selected").text()&&bus.workshop==$("#exec_workshop option:selected").text()){
                			fadeMessageAlert(null,'该车辆已在'+bus.line+'扫描，不能跨线扫描！','gritter-error');
                			//added by xjw 20160513 根据车号查出当前线别锁定线别，不允许跨线扫描,带出相应工序
                    		getSelects(line_selects_data, bus.line, "#exec_line",null,"name"); 
                    		getAllstationSelect(bus.order_type);
                		}   
                		//added by xjw 20160513 根据车号查出当前线别锁定线别，不允许跨线扫描                    		
                		$("#exec_line").attr("disabled",true);
                    		
                		//$("#exec_station").val(next_station.station_id)
                		$("#exec_station option:contains("+next_station.station_name+")").attr("selected",true)
                		$("#on_offline").val(next_station.on_offline)
                    }
            },
            error:function(){alertError();}
       });
	}
	
	function ajaxGetPartsList(){
		$.ajax({
            type: "get",
            dataType: "json",
            url : "getKeyParts",
            async:false,
            data: {
            	"factory_id":$("#exec_factory").val(),
                "bus_number": $('#vinText').val(),
                "station_name":$("#exec_station :selected").attr("station")||"",
                "workshop":$('#exec_workshop').find("option:selected").text(),
                "project_id":$('#vinText').data("project_id")||0,
                "bus_type":$('#vinText').data("bus_type")||""
            },
            success: function(response){
            	$("#partsListTable tbody").html("");
            	parts_list=response.partsList;
            	$.each(parts_list,function(index,parts){
            		var tr=$("<tr />");
            		$("<td />").html(parts.SAP_material).appendTo(tr);
            		$("<td />").html(parts.BYD_NO).appendTo(tr);
            		$("<td />").html(parts.parts_name).appendTo(tr);
            		$("<td />").html(parts.vendor).appendTo(tr);
            	
            		$("<td />").html("<input class='batch' type='text' style='border:1;background:transparent;text-align:center;width:100%' value='"+(parts.batch||'')+"'>").appendTo(tr);
            		$(tr).data("parts_index",index);
            		$("#partsListTable tbody").append(tr);
            	});
            }
		}) 
	}
	
	
	$(document).on("change",".batch",function(e){
		$(this).focus();
		var tr=$(e.target).parent("td").parent("tr");
		var batchInput=$(tr).find(".batch");
		var parts_index=$(tr).data("parts_index");
		parts_list[parts_index].batch=$(batchInput).val();	
		//alert(JSON.stringify(parts_list))
	});
	
	//输入回车，发ajax进行校验；成功则显示并更新车辆信息
    $('#vinText').bind('keydown', function(event) {
        //if vinText disable,stop propogation
        if($(this).attr("disabled") == "disabled")
            return false;
        if($("#exec_station :selected").text().trim().length==0){
        	$("#btnSubmit").attr("disabled","disabled");
        	  return false;
        }
        if (event.keyCode == "13"){	
            if(jQuery.trim($('#vinText').val()) != ""){
                ajaxValidate();
                ajaxGetPartsList();
            }
            return false;
        }
      
    });

    $("#btnSubmit").click(function() {
        if(!($("#btnSubmit").hasClass("disabled"))){
            $("#btnSubmit").attr("disabled","disabled");
            ajaxEnter();          
        }
        return false;
    });
    
    $("#clientValidate").click(function(){
    	ajaxEnter();
    });
    
    $("#reset").click(function() {
        resetPage();
        return false;
    });
	
/*	$("#exec_type").change(function(){
		if($(this).children('option:selected').val() == "正常"){
			$("#exec_onoff").hide();
		}else{
			$("#exec_onoff").show();
		}
	});*/
	
	$("#exec_factory").change(function(){
		$("#exec_workshop").empty();
		if($("#exec_factory").val() !=''){
			getAllWorkshopSelect();
		}
	});
	
	$("#exec_workshop").change(function(){
		$("#exec_line").empty();
		if($("#exec_workshop").val() !=''){
			getAllLineSelect();
		}
	});
	
	$("#exec_line").change(function(){
		$("#exec_station").empty();
		if($("#exec_line").val() !=''){
			getAllstationSelect();
		}
	});
	
	$("#exec_station").change(function(){
		if($("#exec_line").val() !=''&&$("#vinText").data("project_id")!=0){		
			ajaxGetPartsList();
		}
	});
	
	function getFactorySelect() {
		$.ajax({
			url : "/MES/common/getFactorySelectAuth",
			dataType : "json",
			data : {"function_url":"production/executionindex"},
			async : false,
			error : function(response) {
				alert(response.message)
			},
			success : function(response) {
				getSelects_noall(response.data, "", "#exec_factory");
				$("#exec_factory").val(getQueryString("factory_id"));
				//$("#exec_factory option:contains('武汉工厂')").attr("selected", true);
				getAllWorkshopSelect();
				$("#exec_workshop").val(getQueryString("workshop_id"));
				getAllLineSelect();
				$("#exec_line").val(getQueryString("line"));		
				getAllstationSelect();
				//$("#exec_station").val(getQueryString("station_id"));
				//getstationInfo($("#exec_station").val());
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
				factory:$("#exec_factory :selected").text()
			},
		async : false,
		error : function(response) {
			alert(response.message)
		},
		success : function(response) {
			getSelects(response.data, "", "#exec_workshop",null,"id");
		}
	});
}

function getAllLineSelect() {
	$("#exec_line").empty();
	$.ajax({
		url : "/MES/common/getLineSelectAuth",
		dataType : "json",
		data : {
				factory:$("#exec_factory :selected").text(),
				workshop:$("#exec_workshop :selected").text()
			},
		async : false,
		error : function(response) {
			alert(response.message)
		},
		success : function(response) {
			line_selects_data=response.data;
			getSelects(response.data, "", "#exec_line",null,"name"); 
		}
	});
}

function getAllstationSelect(order_type) {
	order_type=order_type||'Standard order';
	$("#exec_station").empty();
	$.ajax({
		url : "getStationMonitorSelect",
		dataType : "json",
		data : {
			factory:$("#exec_factory :selected").text(),
			workshop:$("#exec_workshop :selected").text(),
			line:$("#exec_line").val(),
			order_type:order_type
			},
		async : false,
		error : function(response) {
			alert(response.message)
		},
		success : function(response) {
			//getSelects_noall(response.data, "", "#exec_station"); 
			var strs = "";
		    $("#exec_station").html("");
		    var station_id_default="";
		    var station_name_default="";
		    if(response.data==null){
		    	fadeMessageAlert(null,"未配置扫描逻辑！","agritter-error");
		    	return false;
		    }	 
		    $.each(response.data, function(index, value) {
		    	if (index == 0) {
		    		station_id_default=value.id;
			    	station_name_default=value.station_name;
		    	}
		    	
		    	if(getQueryString("station_id")==value.id){
		    	 	station_id_default=value.id;
			    	station_name_default=value.station_name;
		    	}
/*		    	if (index == 0) {
		    		$("#exec_stationname").val(value.station_name);
		    	}*/
		    	strs += "<option value=" + value.id + " station='"+value.station_name+"' plan_node='"+(value.plan_node_name||"")
		    	+"' field_name='" +(value.field_name||"")+ "'>" + (value.station_code+" "+value.station_name) + "</option>";
		    });
		  //  alert(station_id_default);
		    $("#exec_station").append(strs);
		    $("#exec_station").val(station_id_default+"");
		    $("#exec_stationname").val(station_name_default);
		}
	});
}

function toggleVinHint (showVinHint) {
    if(showVinHint){
        $("#carInfo").hide();
        $("#vinHint").fadeIn(1000);

    }else{
        $("#vinHint").hide();
        $("#carInfo").fadeIn(1000);
    }
}


