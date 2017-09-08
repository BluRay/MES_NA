var busNoArray = new Array();
$(document).ready(function () {	
	initPage();
	
	function initPage(){
		getBusNumberSelect('#nav-search-input');
		//getBusNumberSelect('#vinText2');
		//alert(location.href.substr(location.href.indexOf("action?")+7,location.href.length));
		//$('#rightlink').attr('href','production!execution.action?' + location.href.substr(location.href.indexOf("action?")+7,location.href.length)); 
		getKeysSelect("ABNORMAL_REASON", "", "#reason_type"); 
		getKeysSelect("LACK_REASON", "", "#lack_reason"); 
		$('#TodayWaxPlanTable2 tr').find('th:eq(1)').hide();
		if($("#exec_type").children('option:selected').val() == "正常"){
			$("#exec_onoff").hide();
		}else{
			$("#exec_onoff").show();
		}		
		getFactorySelect();
	};

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/BMS/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})
	
	function resetPage () {
		$("#vinText").removeAttr("disabled");
        $("#vinText").val("");
       	$('#vinText').data("vin","");
    	$('#vinText').data("order_id","");
    	$('#vinText').data("order_config_id","");
    	$('#vinText').data("bus_type_id","");
        $("#vinText").focus();
        toggleVinHint(true);
        $("#btnSubmit").attr("disabled","disabled");
        busNoArray.length = 0;
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
		
		var busNoStr = busNoArray.join("|");;
		var trs=$("#dispatchDetail tbody").find("tr");
		var busList=[];
		//var orderDescList=[];
		$.each(trs,function(index,tr){
			var bus={};
			bus.bus_number=$(tr).data("busNo");
			bus.order_no=$(tr).data("orderNo");
			bus.order_desc=$(tr).data("orderDesc");
			busList.push(bus);

		});
		//alert(busNoStr);
		
        $.ajax({
            type: "get",
            dataType: "json",
            url : "enterException",
            data: {
            	"factory" : $('#exec_factory :selected').text(),
            	"workshop" : $('#exec_workshop :selected').text(),
            	"line" : $('#exec_line :selected').text(),
            	"process" : $('#exec_processname').val(),
                //"bus_number":busNoStr,					//$('#vinText').val(),
                "bus_list":JSON.stringify(busList),
                "reason_type_id":$('#reason_type :selected').attr("keyvalue")||"0",
                "lack_reason_id":$('#lack_reason :selected').attr("keyvalue")||"0",
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
	
	function ajaxValidate (){
		$.ajax({
            type: "get",
            dataType: "json",
            url : "getBusInfo",
            data: {
                "bus_number": $('#vinText').val(),
                "factory_id":$("#exec_factory").val(),
                "exec_process_name":$("#exec_processname").val(),
                "workshop_name":$('#exec_workshop').find("option:selected").text()
            },
            success: function(response){
                    $("#vinText").attr("disabled","disabled");
                    //show car infomation
                    if(response.businfo == ""){
                    	fadeMessageAlert("没有对应车号的车辆信息！","alert-error");
                    }else{
                    	toggleVinHint(false);
                    	var bus = response.businfo;
                    	$("#infoColor").html(bus.bus_color);
                		$("#infoSeats").html(bus.bus_seats);
                		$("#infoWorkShop").html(bus.workshop);
                		$("#infoLine").html(bus.line);
                		$("#infoProcess").html(bus.process_name);
                		$("#infoOrder").html(bus.order_desc);
                		$("#infoStatus").html(bus.status=='0'?'正常':'冻结');
                		$("#btnSubmit").removeAttr("disabled");
                        
                        //alert($('#vinText').attr("value"));
                        if(busNoArray.indexOf($('#vinText').attr("value")) < 0){
	                        var trindex=$("#dispatchDetail").find("tr").length-1;
	                        var tr = $("<tr />");
							var busNumberInput = "<input style='border:0;width:100%;background-color:white;' " +
									"name='dispatchRecordList["+trindex+"].bus_number' value='"
									+ $('#vinText').val() + "' readonly/>";
							$("<td style='width:70%' />").html(busNumberInput).appendTo(tr);
							$("<td />").html("<i name='edit' class=\"fa fa-times\" style=\"cursor: pointer\" ></i>").appendTo(tr);
							$(tr).data("busNo",$('#vinText').val());
							$(tr).data("orderNo",bus.order_no);
							$(tr).data("orderDesc",bus.order_desc);
							$("#dispatchDetail tbody").append(tr);
							busNoArray.push($('#vinText').val());
                        }else{
            				//alert("此车已经录入！");
            				setTimeout(function(){
            					 alert("此车已经录入！");
            					 $("#busNo").focus();
            			        },0);
            				return false;
            			}
                    }
            },
            error:function(){alertError();}
       });
	}
	
	Array.prototype.remove = function(val) {  
	    var index = this.indexOf(val);  
	    if (index > -1) {  
	        this.splice(index, 1);  
	    }  
	}; 
	$(document).on("click",".fa-times", function() {
		busNoArray.remove($(this).parent().parent().data("busNo"));
		$(this).parent().parent().remove();
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
    
    $("#btnSubmit").click(function() {
        if(!($("#btnSubmit").hasClass("disabled"))){
            $("#btnSubmit").attr("disabled","disabled");
            ajaxEnter();
        }
        return false;
    });
    
    $("#reset").click(function() {
        resetPage();
        return false;
    });
    
    $("#reason_type").change(function(){
    	
		if($(this).children('option:selected').text() == "缺料"){
			$('#TodayWaxPlanTable2 tr').find('td:eq(1)').show();
		}else{
			//alert($(this).children('option:selected').text())
			$('#TodayWaxPlanTable2 tr').find('td:eq(1)').hide();
			//$("#lack_reason").val("");
		}
	});
	
	$("#exec_type").change(function(){
		if($(this).children('option:selected').val() == "正常"){
			$("#exec_onoff").hide();
		}else{
			$("#exec_onoff").show();
		}
	});
	
	$("#exec_factory").change(function(){
		$("#exec_workshop").empty();
		if($("#exec_factory").val() !=''){
			getAllWorkshopSelect();
			getAllLineSelect();
			getAllProcessSelect();
		}
	});
	
	$("#exec_workshop").change(function(){
		$("#exec_line").empty();
		if($("#exec_workshop").val() !=''){
			getAllLineSelect();
			getAllProcessSelect();
		}
	});
	
	$("#exec_line").change(function(){
		$("#exec_process").empty();
		if($("#exec_line").val() !=''){
			getAllProcessSelect();
		}
	});
	
	$("#exec_process").change(function(){
		$("#exec_processname").val('');
		var process_code=$("#exec_process :selected").text();
		var process_name=$(this).find("option:contains('"+process_code+"')").attr("process");
		$("#exec_processname").val(process_name);
	});
	
	
	function getFactorySelect() {
		$.ajax({
			url : "/BMS/common/getFactorySelectAuth",
			dataType : "json",
			data : {
				function_url:'production/exception'
			},
			async : false,
			error : function(response) {
				alert(response.message)
			},
			success : function(response) {
				getSelects_noall(response.data, "", "#exec_factory");
				getAllWorkshopSelect();
				getAllLineSelect();
				getAllProcessSelect();
				//$("#exec_process").val(getQueryString("process_id"));
				//getProcessInfo($("#exec_process").val());
			}
		});
	}
	   
	
})

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

function getAllWorkshopSelect() {
	$("#exec_workshop").empty();
	$.ajax({
		url : "/BMS/common/getWorkshopSelectAuth",
		dataType : "json",
		data : {
				factory:$("#exec_factory :selected").text(),
				function_url:'production/exception'
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
			getSelects(response.data, "", "#exec_line",null,"name"); 
		}
	});
}

function getAllProcessSelect(order_type) {
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
		    $.each(response.data, function(index, value) {
		    	if (index == 0) {
		    		process_id_default=value.id;
			    	process_name_default=value.process_name;
		    	}
		    	
		    	if(getQueryString("process_id")==value.id){
		    	 	process_id_default=value.id;
			    	process_name_default=value.process_name;
		    	}
/*		    	if (index == 0) {
		    		$("#exec_processname").val(value.process_name);
		    	}*/
		    	strs += "<option value=" + value.id + " process='"+value.process_name+"' plan_node='"+(value.plan_node_name||"")
		    	+"' field_name='" +(value.field_name||"")+ "'>" + value.process_code + "</option>";
		    });
		  //  alert(process_id_default);
		    $("#exec_process").append(strs);
		    $("#exec_process").val(process_id_default+"");
		    $("#exec_processname").val(process_name_default);
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
