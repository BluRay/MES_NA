var busNoArray = new Array();
var busCount = 0;
$(document).ready(function () {	
	initPage();
	
	function initPage(){
		getBusNumberSelect('#nav-search-input');
		getKeysSelect("ABNORMAL_REASON", "", "#reason_type");
		getFactorySelect();
	};

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/MES/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	});
	
	var tag_input = $('#form-field-tags');
	try{
		tag_input.tag(
		  {
			placeholder:tag_input.attr('placeholder'),
			source: '',//ace.vars['US_STATES'],//defined in ace.js >> ace.enable_search_ahead
		  }
		)
		var $tag_obj = $('#form-field-tags').data('tag');
		//$tag_obj.add('Programmatically Added');
	}
	catch(e) {
		tag_input.after('<textarea id="'+tag_input.attr('id')+'" name="'+tag_input.attr('name')+'" rows="3">'+tag_input.val()+'</textarea>').remove();
	}
	
	function resetPage () {
		$("#vinText").removeAttr("disabled");
        $("#vinText").val("");
        for (var i=0;i<=busCount;i++){
            $('#form-field-tags').data('tag').remove(0);
        }
       	$('#vinText').data("vin","");
    	$('#vinText').data("order_id","");
    	$('#vinText').data("order_config_id","");
    	$('#vinText').data("bus_type_id","");
        $("#vinText").focus();
        toggleVinHint(true);
        $("#btnSubmit").attr("disabled","disabled");
        busNoArray.length = 0;
        busCount = 0;
    }
	
	function ajaxEnter(){	
		//数据验证
		if($('#reason_type').val() == ""){
			alert("请选择异常类别！");
			$("#btnSubmit").removeAttr("disabled");
			return false;
		}
		
        $.ajax({
            type: "get",
            dataType: "json",
            url : "enterException",
            data: {
            	"factory" : $('#exec_factory :selected').text(),
            	"workshop" : $('#exec_workshop :selected').text(),
            	"line" : $('#exec_line :selected').text(),
            	"process" : $('#exec_processname').val(),
            	"process_name" : $('#exec_processname:selected').text(),
                "bus_list":$('#form-field-tags').val(),
                "reason_type_id":$('#reason_type :selected').attr("keyvalue")||"0",
            	"reason_type" : $('#reason_type :selected').text(),
                "start_time":$('#start_time').val(),
                "detailed_reasons":$('#detailed_reasons').val(),                
                "editor_id":$('#exec_user').val(),
            },
            success: function(response){
                if(response.success){ 
                    fadeMessageAlert(null,"SUCCESS","gritter-info");
                    //resetPage();
                }
                else{
                    fadeMessageAlert(null,"ERROR","agritter-error");
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
                "bus_number": $('#vinText').val()
            },
            success: function(response){
                if(response.businfo == null){
                	alert("没有对应车号的车辆信息！");
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
                    
            		var $tag_obj = $('#form-field-tags').data('tag');
					$tag_obj.add($('#vinText').val().trim());	
					busCount++;
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
	
	//输入回车，发ajax进行校验；成功则显示并更新车辆信息
    $('#vinText').bind('keydown', function(event) {
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
			url : "/MES/common/getFactorySelectAuth",
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
		url : "/MES/common/getWorkshopSelectAuth",
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
		    	strs += "<option value=" + value.id + " process='"+value.process_name+"' plan_node='"+(value.plan_node_name||"")
		    	+"' field_name='" +(value.field_name||"")+ "'>" + value.process_code + "</option>";
		    });
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
