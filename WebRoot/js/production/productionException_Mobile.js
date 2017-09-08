$(document).ready(function () {	
	initPage();
	
	$("#btn_clear").click(function(){
    	resetPage();
    })

    $("#btn_save").click(function(){
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
			getAllLineSelect(bus.line);
			$("#exec_processname").val('');
			getAllProcessSelect(bus.order_type);
		}
	});
	
	$("#exec_line").change(function(){
		$("#exec_process").empty();		
		$("#exec_processname").val('');
		if($("#exec_line").val() !=''){
			if(bus.line !=$("#exec_line option:selected").text()&&bus.workshop==$("#exec_workshop option:selected").text()){
    			fadeMessageAlert(null,'该车辆已在'+bus.line+'扫描，不能跨线扫描！','gritter-error');
    			//added by xjw 20160513 根据车号查出当前线别锁定线别，不允许跨线扫描,带出相应工序
        		getSelects(line_selects_data, bus.line, "#exec_line",null,"name"); 
        		getAllProcessSelect(bus.order_type);
    		}   
    		//added by xjw 20160513 根据车号查出当前线别锁定线别，不允许跨线扫描  
			getAllProcessSelect(bus.order_type);
		}
	});
	
	$("#exec_process").change(function(){
		$("#exec_processname").val('');
		var process_code=$("#exec_process :selected").text();
		var process_name=$(this).find("option:contains('"+process_code+"')").attr("process");
		$("#exec_processname").html(process_name);
	});
	
	//输入回车，发ajax进行校验；成功则显示并更新车辆信息
    $('#vinText').bind('keydown', function(event) {
        //if vinText disable,stop propogation
        if($(this).attr("disabled") == "disabled")
            return false;
        if (event.keyCode == "13"){
            if(jQuery.trim($('#vinText').val()) != ""){
                ajaxValidate();
            }
            return false;
        }
    });

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/BMS/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})
    
    $("#reason_type").change(function(){
    	
		if($(this).children('option:selected').text() == "缺料"){
			$("#lack_reason_div").show();
		}else{
			$("#lack_reason_div").hide();
		}
	});
})

function initPage(){
	getBusNumberSelect('#nav-search-input');
	getKeysSelect("ABNORMAL_REASON", "", "#reason_type"); 
	getKeysSelect("LACK_REASON", "", "#lack_reason"); 
	getFactorySelect();
}

function getFactorySelect() {
	$.ajax({
		url : "/BMS/common/getFactorySelectAuth",
		dataType : "json",
		data : {},
		async : false,
		error : function(response) {
			alert(response.message)
		},
		success : function(response) {
			getSelects_noall(response.data, "", "#exec_factory",null);
			//getAllWorkshopSelect();
			//getAllLineSelect();
			//getAllProcessSelect();
		}
	});
}

function getAllWorkshopSelect(workshop) {
$("#exec_workshop").empty();
$.ajax({
	url : "/BMS/common/getWorkshopSelectAuth",
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
$("#exec_line").empty();
$.ajax({
	url : "/BMS/common/getLineSelectAuth",
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

function getAllProcessSelect(order_type,process_default) {
order_type=order_type||'标准订单';
$("#exec_process").empty();
$.ajax({
	url : "getProcessMonitorSelect",
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
		//getSelects_noall(response.data, "", "#exec_process"); 
		var strs = "";
	    $("#exec_process").html("");
	    var process_id_default="";
	    var process_name_default="";
	    if(response.data==null){
	    	fadeMessageAlert(null,"未配置扫描逻辑！","agritter-error");
	    	return false;
	    }	 
	    $.each(response.data, function(index, value) {
	    	if (process_default == value.process_name) {
	    		process_id_default=value.id;
		    	process_name_default=value.process_name;
	    	}		
	    	strs += "<option value=" + value.id + " process='"+value.process_name+"' plan_node='"+(value.plan_node_name||"")
	    	+"' field_name='" +(value.field_name||"")+ "'>" + value.process_code + "</option>";
	    });
	  //  alert(process_id_default);
	    $("#exec_process").append(strs);
	    $("#exec_process").val(process_id_default+"");
	    $("#exec_processname").html(process_name_default);
	}
});
}

function ajaxValidate (){
	$.ajax({
        type: "post",
        dataType: "json",
        url : "getBusInfo",
        async:false,
        data: {
        	"bus_number": $('#vinText').val(),
            "factory_id":$("#exec_factory").val(),
            "exec_process_name":$("#exec_processname").val(),
            "workshop_name":$('#exec_workshop').find("option:selected").text()
        },
        success: function(response){               
                //show car infomation
        	//alert(response.businfo.factory.indexOf(getAllFromOptions("#exec_factotry","name")));
                if(response.businfo == ""||response.businfo==null){
                	fadeMessageAlert(null,'没有对应车号的车辆信息！','gritter-error');
                	$("#vinText").val("");
                	return false;
                }else if(response.businfo.factory.indexOf(getAllFromOptions("#exec_factotry","name"))<0){
                	fadeMessageAlert(null,'抱歉，该车辆属于'+response.businfo.factory+'，您没有扫描权限！','gritter-error');
                	$("#vinText").val("");
                	return false;
                }else{        
                    $("#vinText").attr("disabled","disabled");
                    $("#btn_save").show();
                    $("#btn_clear").show();
                	bus = response.businfo;
                	$('#vinText').data("vin",bus.vin);
                	$('#vinText').data("order_id",bus.order_id);
                	$('#vinText').data("order_config_id",bus.order_config_id);
                	$('#vinText').data("bus_type_id",bus.bus_type_id);
                	
                	var configList=response.configList;  	
                	
                	bus_production_status=bus.production_status;
                	orderType=bus.order_type;
                	vin=bus.vin;
            		left_motor_number=bus.left_motor_number;
            		right_motor_number=bus.right_motor_number;
            		
            		toggleVinHint(false);
            		
            		//选中工厂、车间、线别、工序
            		$("#exec_factory").val(bus.factory_id).attr("disabled",true);
            		getAllWorkshopSelect(bus.workshop);
            		getAllLineSelect(bus.line)
            		
            		var cur_line=$("#exec_line option:selected").text();
            		getAllProcessSelect(bus.order_type,bus.process_name);

                }
        },
        error:function(){alertError();}
   });
}

function ajaxEnter(){	
	//数据验证
	if($('#reason_type').val() == ""){
		alert("请选择异常类别！");
		$("#btnSubmit").removeAttr("disabled");
		return false;
	}
	if(($('#reason_type :selected').text() == "缺料") && ($('#lack_reason').val() == "")){
		alert("请选择缺料原因！");
		$("#btnSubmit").removeAttr("disabled");
		return false;
	}
	
	var busList=[];

	busList.push(bus);
	
    $.ajax({
        type: "get",
        dataType: "json",
        url : "enterException",
        data: {
        	"factory" : $('#exec_factory :selected').text(),
        	"workshop" : $('#exec_workshop :selected').text(),
        	"line" : $('#exec_line :selected').text(),
        	"process" : $('#exec_processname').html(),
            //"bus_number":busNoStr,					//$('#vinText').val(),
            "bus_list":JSON.stringify(busList),
            "reason_type_id":$('#reason_type').attr("keyvalue")||"0",
            "lack_reason_id":$('#reason_type :selected').text()=="缺料"?$('#lack_reason').attr("keyvalue"):"",
            "start_time":$('#start_time').val(),
            "severity_level":$('#severity_level').val(),
            "detailed_reasons":$('#detailed_reasons').val(),                
            "editor_id":$('#exec_user').val(),
        },
        success: function(response){
            resetPage();
            if(response.success){ 
                fadeMessageAlert(null,response.message,"gritter-success");
                resetPage();
            }
            else{
                fadeMessageAlert(null,response.message,"agritter-error");
            }

            setTimeout(function() {
                $("#vinHint").hide().html("未输入车号");
                toggleVinHint(true);
            },60000);
        },
        error:function(){alertError();}
    });
    
}

function resetPage () {
	$("#scan_form").resetForm();
    $("#vinText").removeAttr("disabled");
    $("#vinText").val("");
   	$('#vinText').data("vin","");
	$('#vinText').data("order_id","");
	$('#vinText').data("order_config_id","");
	$('#vinText').data("bus_type_id","");
    $("#vinText").focus();
    toggleVinHint(true);
    $("#exec_workshop").html("");
    $("#exec_line").html("");
    $("#exec_process").html("");
    $("#exec_processname").html("");
    $("#lack_reason_div").show();
    $("#btn_save").hide();
    $("#btn_clear").hide();
    
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