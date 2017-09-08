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

        if($(this).attr("disabled") == "disabled")
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
			getAllLineSelect(bus.line);
			$("#exec_processname").val('');
			getAllProcessSelect(bus.order_type);
			ajaxGetPartsList();
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
			ajaxGetPartsList();
		}
	});
	
	$("#exec_process").change(function(){
		$("#exec_processname").val('');
		var process_code=$("#exec_process :selected").text();
		var process_name=$(this).find("option:contains('"+process_code+"')").attr("process");
		$("#exec_processname").html(process_name);
		if($("#exec_line").val() !=''&&$("#vinText").data("order_id")!=0){		
			ajaxGetPartsList();
		}
	});
	
	$("#key_parts").change(function(){
		var parts_index=$(this).find("option:selected").attr("parts_index");
		$("#parts_no").val(parts_list[parts_index].parts_no);
		$("#sap_mat").val(parts_list[parts_index].sap_mat);
		$("#vendor").val(parts_list[parts_index].vendor);
		var batch="";
		if(parts_list[parts_index]['3C_no'].trim().length>0){
			batch=parts_list[parts_index]['3C_no'];
		}    
		$("#batch").val(batch);
		$("#batch").attr("parts_index",parts_index);
	})

})

function initPage(){
		getFactorySelect();
		$('#vinText').focus();
		//alert(getQueryString("factory_name"));
		//$(".page-content").css("height",document.body.clientHeight-10);
		//$(".page-content").css("overflow","auto");
/*		
		Quagga.init({
		    inputStream : {
		      name : "Live",
		      type : "LiveStream",
		      target: document.querySelector('#vin_text')    // Or '#yourElement' (optional)
		    },
		    decoder : {
		      readers : ["code_128_reader"]
		    }
		  }, function(err) {
		      if (err) {
		          console.log(err);
		          return
		      }
		      console.log("Initialization finished. Ready to start");
		      Quagga.start();
		  });*/
		
		
	};
	
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
        $("#key_parts").html("");
        $("#btn_save").hide();
        $("#btn_clear").hide();
        
    }
	
	function ajaxEnter(){
		var enterflag=true;
		cur_key_name=$("#exec_processname").val();
		var plan_node=$('#exec_process').find("option:selected").attr("plan_node");
		var field_name=$('#exec_process').find("option:selected").attr("field_name");
		
		if($('#exec_workshop :selected').text()=='底盘'||$('#exec_workshop :selected').text()=='检测线'){

			$.each(parts_list,function(i,parts){
				if(parts.parts_id !=undefined&&parts.process==$("#exec_processname").val()&&(parts.parts_name=='VIN编码'||parts.parts_name=='左电机号'||parts.parts_name=='右电机号')){
					if(parts.batch==undefined||parts.batch.trim().length==0){
						enterflag=false;
						alert(plan_node+"扫描前，请将VIN编码和左右点击号信息录入完整！");
						return false;
					}
				}
				if(parts.parts_name=='VIN编码'&&parts.batch!=vin&&parts.process==$("#exec_processname").val()){
					alert("VIN编码校验失败，请核对该车的VIN编码！");
					enterflag=false;
					return false;
				}
				if(parts.parts_name=='左电机号'&&parts.batch!=left_motor_number&&parts.process==$("#exec_processname").val()){
					alert("左电机号校验失败，请核对该车的左电机号！");
					enterflag=false;
					return false;
				}
				if(parts.parts_name=='右电机号'&&parts.batch!=right_motor_number&&parts.process==$("#exec_processname").val()){
					alert("右电机号校验失败，请核对该车的右电机号！");
					enterflag=false;
					return false;
				}
			});
			if(!enterflag){
				//alert(cur_key_name+"扫描前，请将零部件信息录入完整！");
				//$("#btn-save").hide();
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
				//$("#btn-save").hide();
				 return false;
			 }
		}
		
		if(enterflag){
			 $.ajax({
		            type: "post",
		            dataType: "json",
		            url : "enterExecution",
		            data: {
		            	"factory_id" : $('#exec_factory').val(),
		                "bus_number":$('#vinText').val(),
		                "order_id":$('#vinText').data("order_id"),
		                "process_id":$('#exec_process').val(),
		                "factory_name":$('#exec_factory').find("option:selected").text(),
		                "workshop_name":$('#exec_workshop').find("option:selected").text(),
		                "line_name":$('#exec_line').find("option:selected").text(),
		                "process_id":$('#exec_process').val(),
		                "process_number":$('#exec_process :selected').text(),
		                "process_name":$('#exec_processname').html(),
		                "field_name":field_name,
		                "order_type":orderType,
		                "plan_node_name":plan_node,
		                "parts_list":JSON.stringify(parts_list)
		            },
		            success: function(response){
		                resetPage();
		                if(response.success){ 
		                	fadeMessageAlert(null,response.message,'gritter-success');
		                }
		                else{
		                	fadeMessageAlert(null,response.message,'gritter-error');
		                }

		                setTimeout(function() {
		                    $("#vinHint").hide().html("未输入车号");
		                    toggleVinHint(true);
		                },60000);
		            },
		            error:function(){alertError(); resetPage();}
		        });
		}
       
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
                    }else if(response.businfo.factory_name.indexOf(getAllFromOptions("#exec_factotry","name"))<0){
                    	fadeMessageAlert(null,'抱歉，该车辆属于'+response.businfo.factory_name+'，您没有扫描权限！','gritter-error');
                    	$("#vinText").val("");
                    	return false;
                    }else{        
                    	var nextProcess=response.nextProcess;
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
                		getAllWorkshopSelect(nextProcess==null?bus.workshop:nextProcess.workshop);
                		getAllLineSelect(bus.line)
                		
                		var cur_line=$("#exec_line option:selected").text();
                		getAllProcessSelect(bus.order_type,nextProcess==null?bus.process_name:nextProcess.process_name);

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
            data: {
            	"factory_id":$("#exec_factory").val(),
                "bus_number": $('#vinText').val(),
                "process_name":$("#exec_processname").html(),
                "workshop":$('#exec_workshop').find("option:selected").text(),
                "order_id":$('#vinText').data("order_id")||0,
                "order_config_id":$('#vinText').data("order_config_id")||0,
                "bus_type_id":$('#vinText').data("bus_type_id")||0
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
            			parts_no_default=value.parts_no;
            			sap_mat_default=value.spa_mat;
            			vendor_default=value.vendor;
            			$("#batch").attr("disabled",false);
            			if(value['3C_no'].trim().length>0){
            				batch_default=value['3C_no'];
            				parts_list[index].batch=batch_default;
            				$("#batch").attr("disabled",true);
            			}          			
            		}else
            		 strs += "<option value=" + value.id  + ">"+" parts_index="+index  + value.parts_name + "</option>";
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
