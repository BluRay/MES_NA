var cur_key_name = "";
var vin="";
var left_motor_number="";
var right_motor_number="";
var bus_production_status="0";
var bus_color;
var bus_seats;
var workshop_name;
var process_name;
var order_name;
var bus_type_code;
var order_qty;
var orderType;
var status;
var line_selects_data;
var parts_list;
var parts_update_list=new Array();//非车间上下线工序提交该零部件信息
var bus;
 
$(document).ready(function () {	
	initPage();
	
	//输入回车，发ajax进行校验；成功则显示并更新车辆信息
    $('#vinText').bind('keydown', function(event) {

        if($(this).prop("disabled") == "disabled")
            return false;      
        if (event.keyCode == "13"){	
            if(jQuery.trim($('#vinText').val()) != ""){
                ajaxValidate();
                ajaxGetPartsList();
            }
            return false;
        }  
    });
    
    $("#btn_clear").click(function(){
    	resetPage();
    })

    $("#btn_save").click(function(){
    	ajaxEnter();
    });
    
    $("#exec_type").change(function(){
    	if($("#exec_type").val()=='0'){//normal
    		$("#exec_line").val(bus.line);
    		//alert(bus.workshop);
   		 	$("#exec_factory option:contains("+bus.factory+")").prop("selected",true)
   		 	$("#exec_workshop option:contains("+bus.workshop+")").prop("selected",true)
   		 	$("#exec_factory").prop("disabled","disabled");
   		 	$("#exec_workshop").prop("disabled","disabled");
   		 	$("#exec_line").prop("disabled","disabled");
   		 	
    	}else{//rework
    		$("#exec_factory").removeAttr("disabled");
  	     	$("#exec_workshop").removeAttr("disabled");
  	     	$("#exec_line").removeAttr("disabled");
    	}
    })
    
	$(document).on("change","#batch",function(e){
		$(this).focus();		
		var parts_index=$(this).data("parts_index");
		//alert(parts_index)
		parts_list[parts_index].batch=$(this).val();	
		//alert(JSON.stringify(parts_list))
	});
    
    
    $("#clientValidate").click(function(){
    	ajaxEnter();
    });
	
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
		$("#exec_process").empty();		
		$("#exec_processname").val('');
		if($("#exec_line").val() !=''){
			if(bus.line !=$("#exec_line option:selected").text()&&bus.workshop==$("#exec_workshop option:selected").text()){
    			//fadeMessageAlert(null,'该车辆已在'+bus.line+'扫描，不能跨线扫描！','gritter-error');
    			//added by xjw 20160513 根据车号查出当前线别锁定线别，不允许跨线扫描,带出相应工序
        		getSelects(line_selects_data, bus.line, "#exec_line",null,"name"); 
        		getAllstationSelect(bus.order_type);
    		}   
    		//added by xjw 20160513 根据车号查出当前线别锁定线别，不允许跨线扫描  
			getAllstationSelect(bus.order_type);
			ajaxGetPartsList();
		}
	});
	
	$("#exec_station").change(function(){
		
		var station_code=$("#exec_station :selected").attr("station_code");
		var station_name=$("#exec_station :selected").attr("station");
		if($("#exec_line").val() !=''&&$("#vinText").data("project_id")!=0){		
			ajaxGetPartsList();
		}
	});
	
	$("#key_parts").change(function(){
		var parts_index=$(this).find("option:selected").attr("parts_index");
		$("#parts_no").val(parts_list[parts_index].BYD_NO);
		$("#sap_mat").val(parts_list[parts_index].SAP_material);
		$("#vendor").val(parts_list[parts_index].vendor);
		var batch=parts_list[parts_index].batch;
		/*if(parts_list[parts_index]['3C_no'].trim().length>0){
			batch=parts_list[parts_index]['3C_no'];
		}    */
		$("#batch").val(batch);
		$("#batch").data("parts_index",parts_index);
	})

})

	function initPage(){
		getFactorySelect();
		getBusNumberSelect('#vinText');
		$('#vinText').focus();
		resetPage();
		workshop_name=$("#exec_workshop :selected").text();
		if(workshop_name=='Outgoing'){
			$("#exec_type").prop("disabled",true);
			$("#on_offline").prop("disabled",true);
		}else{
			$("#exec_type").prop("disabled",false);
			$("#on_offline").prop("disabled",false);
		}
	};
	
	function resetPage () {
        $("#vinText").removeAttr("disabled");
        $("#exec_factory").removeAttr("disabled");
        $("#exec_workshop").removeAttr("disabled");
        $("#exec_line").removeAttr("disabled");
        $("#vinText").val("");
       	$('#vinText').data("vin","");
    	$('#vinText').data("project_id","");
    	$('#vinText').data("bus_type","");
        $("#vinText").focus();
        toggleVinHint(true);
        $("#btnSubmit").prop("disabled","disabled");
        $("#partsListTable tbody").html("");
        $("#configListTable tbody").html("");
        $("#exec_line").prop("disabled",false);
    }
	
	function ajaxEnter(){
		var enterflag=true;
		
		var plan_node=$('#exec_station').find("option:selected").attr("plan_node");
		var field_name=$('#exec_station').find("option:selected").attr("field_name");
		
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
		                "station_name":$("#exec_station :selected").attr("station"),
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
                    $("#vinText").prop("disabled","disabled");
                    //show car infomation
                    if(response.businfo == ""||response.businfo==null){
                    	fadeMessageAlert(null,'Sorry,no information searched for the entered bus！','gritter-error');
                    	$("#vinText").removeAttr("disabled").val("");
                    	return false;
                    }else if(response.businfo.factory !=$("#exec_factory :selected").text()){
                    	fadeMessageAlert(null,response.businfo.bus_number+'不属于'+$("#exec_factory :selected").text()+'！','gritter-error');
                    	return false;
                    }else{                	
                    	bus = response.businfo;
                    	$('#vinText').data("vin",bus.VIN);
                    	$('#vinText').data("project_id",bus.project_id);
                    	$('#vinText').data("bus_type",bus.bus_type);
                    	$("#vinText").prop("disabled","disabled");                   	
                    	
                        $("#btn_save").show();
                        $("#btn_clear").show();
                    	var next_station=response.nextStation;
                    	
                    	bus_production_status=bus.production_status;
                    	orderType=bus.order_type;
                    	vin=bus.VIN;
                		toggleVinHint(false);
                		
                		
                		/**
                		 * 选中工厂、车间、线别
                		 */            		
                		$("#exec_factory option:contains("+bus.factory+")").prop("selected",true)
                		$("#exec_workshop option:contains("+bus.workshop+")").prop("selected",true)
 
                		var cur_line=$("#exec_line option:selected").text();
                		if(bus.order_type!='Standard order'){
                			getAllstationSelect(bus.order_type);
                		}
                		//alert(cur_line);
                		if(bus.line !=$("#exec_line option:selected").text()&&bus.workshop==$("#exec_workshop option:selected").text()){
                			//fadeMessageAlert(null,Warn['Scan_passline'],'gritter-error');
                			//added by xjw 20160513 根据车号查出当前线别锁定线别，不允许跨线扫描,带出相应工序
                    		getSelects(line_selects_data, bus.line, "#exec_line",null,"name"); 
                    		getAllstationSelect(bus.order_type);
                		}   
                		//added by xjw 20160513 根据车号查出当前线别锁定线别，不允许跨线扫描                    		
                		if(bus.latest_station_id>0){
                			$("#exec_line").prop("disabled",true);
                		}
                		
                    		
                		//$("#exec_station").val(next_station.station_id)
                		$("#exec_station option:contains("+next_station.station_name+")").prop("selected",true);
                		
                		if($('#exec_workshop').find("option:selected").text()!='Outgoing'){
                			$("#on_offline").val(next_station.on_offline)
                		}else{
                			$("#on_offline").val('online')
                		}
                		
                		
                		if($("#exec_type").val()=='0'){//normal
                   		 	$("#exec_factory").prop("disabled","disabled");
                   		 	$("#exec_workshop").prop("disabled","disabled");
                   		 	$("#exec_line").prop("disabled","disabled");
                		}else{//rework
                			$("#exec_factory").removeAttr("disabled");
                  	     	$("#exec_workshop").removeAttr("disabled");
                  	     	$("#exec_line").removeAttr("disabled");
                   		}
                    }
            },
            error:function(){alertError();}
       });
	}
	
	function ajaxGetPartsList(){
		$("#key_parts").html("");
		$.ajax({
            type: "get",
            dataType: "json",
            url : "getKeyParts",
            async:false,
            data: {
            	"factory_id":$("#exec_factory").val(),
                "bus_number": $('#vinText').val(),
                "station_name":$("#exec_station :selected").attr("station_code")||"",
                "workshop":$('#exec_workshop').find("option:selected").text(),
                "project_id":$('#vinText').data("project_id")||0,
                "bus_type":$('#vinText').data("bus_type")||""
            },
            success: function(response){
            	parts_list=response.partsList;
            	strs = "";
            	var parts_no_default="";
            	var sap_mat_default="";
            	var vendor_default="";
            	var batch_default="";
            	
            	$.each(parts_list, function(index, value) {
            		if(index==0){
            			strs += "<option value=" + value.id   + " selected='selected'"+" parts_index="+index + ">" + value.parts_name + "</option>";
            			parts_no_default=value.BYD_NO;
            			sap_mat_default=value.SAP_material;
            			vendor_default=value.vendor;
            			$("#batch").prop("disabled",false);
                 			
            		}else
            		 strs += "<option value=" + value.id +" parts_index="+index+">"  + value.parts_name + "</option>";
            	})
            	$("#key_parts").append(strs);
            	$("#parts_no").val(parts_no_default);
            	$("#sap_mat").val(sap_mat_default);
            	$("#vendor").val(vendor_default);
            	$("#batch").val(batch_default);
            	$("#batch").data("parts_index",0);
            }
		}) 
	}
	
	function getFactorySelect() {
		$.ajax({
			url : "/MES/common/getFactorySelectAuth",
			dataType : "json",
			data : {},
			async : false,
			error : function(response) {
				alert(response.message)
			},
			success : function(response) {
				getSelects_noall(response.data, "", "#exec_factory",null);
				getAllWorkshopSelect();
				getAllLineSelect();
				getAllstationSelect();
			}
		});
	}

function getAllWorkshopSelect(workshop) {
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
			getSelects(response.data, workshop, "#exec_workshop",null,"id");
		}
	});
}

function getAllLineSelect(line) {
	line=line||'I';
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
			getSelects(response.data, line, "#exec_line",null,"name"); 
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
		    	strs += "<option value=" + value.id + " station_code='"+value.station_code+"' station='"+value.station_name+"' plan_node='"+(value.plan_node_name||"")
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

function initEditModel() {
    $('#vin').val('');
    $('#left_motor_number').val('');
    $('#right_motor_number').val('');
}

function checkVinMotor(){
	if(vin===$("#vin").val() && left_motor_number===$("#left_motor_number").val() && right_motor_number===$("#right_motor_number").val()){
		toggleVinHint(false);
		$("#btnSubmit").removeAttr("disabled");
		
		$( "#dialog-config" ).dialog("close");
	}else{
		
		alert("校验失败！");
	}
	return false;
}
