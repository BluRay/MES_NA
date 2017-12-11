	var parts_list;

	$(document).ready(function () {	
		initPage();
		
		$("#bus_number").bind("input",function(){
	    	parts_list=[];
			$("#key_parts").empty();
	       	$('#bus_number').data("vin","");
	    	$('#bus_number').attr("project_id","");
	        $("#bus_number").focus();       
	        $("#parts_no").val("");
	        $("#sap_mat").val("");
	        $("#vendor").val("");
	        $("#batch").val("");
		})
		
		//输入回车，发ajax进行校验；成功则显示并更新车辆信息
	    $('#bus_number').bind('keydown', function(event) {    
	        if (event.keyCode == "13"){	
	            if(jQuery.trim($('#bus_number').val()) != ""){
	                ajaxGetPartsList();
	            }
	            return false;
	        }  
	    });
	    
	    $("#exec_workshop").change(function(){
			$("#exec_station").empty();
			if($("#exec_workshop").val() !=''){
				getAllstationSelect();
				if(project_id!="" && project_id!=undefined){		
					ajaxGetPartsList();
				}
			}
		});
	    
		$("#btn_clear").click(function(){
		    resetPage();		 
		})
    
		$(document).on("change","#batch",function(e){
			$(this).focus();		
			var parts_index=$(this).data("parts_index");
			//alert(parts_index)
			parts_list[parts_index].batch=$(this).val();	
			//alert(JSON.stringify(parts_list))
		});
		
		$("#key_parts").change(function(){
			var parts_index=$(this).find("option:selected").attr("parts_index");
			$("#parts_no").val(parts_list[parts_index].BYD_NO);
			$("#sap_mat").val(parts_list[parts_index].SAP_material);
			$("#vendor").val(parts_list[parts_index].vendor);
			var batch=parts_list[parts_index].batch;
			$("#batch").val(batch);
			$("#batch").data("parts_index",parts_index);
		})

		$("#exec_station").change(function(){
			var project_id=$("#bus_number").attr("project_id");
			var station_code=$("#exec_station :selected").attr("station_code");
			var station_name=$("#exec_station").val();
			if(project_id!="" && project_id!=undefined){		
				ajaxGetPartsList();
			}
		});
		
		/**
		 * 保存信息
		 */
		$("#btn_save").click(function(){
		   ajaxSave();
		});
	})

	function initPage(){
		getFactorySelect();
		getBusNumberSelect('#bus_number');
		$('#bus_number').focus();
		resetPage();
		
	};
	
	function resetPage () {   
		parts_list=[];
		$("#key_parts").empty();
        $("#bus_number").val("");
       	$('#bus_number').data("vin","");
    	$('#bus_number').attr("project_id","");
        $("#bus_number").focus();       
        $("#parts_no").val("");
        $("#sap_mat").val("");
        $("#vendor").val("");
        $("#batch").val("");
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
	
	function getAllstationSelect(order_type) {
		order_type=order_type||'Standard order';
		$("#exec_station").empty();
		$.ajax({
			url : "/MES/common/getStationSelect",
			dataType : "json",
			data : {
				factory:$("#exec_factory :selected").text(),
				workshop:$("#exec_workshop :selected").text(),
				//line:$("#exec_line").val(),
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
			    	fadeMessageAlert(null,"该车间未配置工位信息！","agritter-error");
			    	return false;
			    }	 
			    $.each(response.data, function(index, value) {
			    	if (index == 0) {
			    		station_id_default=value.id;
				    	station_name_default=value.name;
			    	}

			    	strs += "<option value='" + value.id + "' station_code='"+value.station_code+
			    	 "'>" + (value.name) + "</option>";
			    });
			    
			    $("#exec_station").append(strs);
			    $("#exec_station").val(station_id_default+"");
			}
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
                "bus_number": $('#bus_number').val(),
                "station_name":$("#exec_station :selected").attr("station_code")||"",
                "workshop":$('#exec_workshop').find("option:selected").text(),
                "project_id":$('#bus_number').attr("project_id")||0,
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
            			batch_default=value.batch||"";
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

	function ajaxSave(){
		$.ajax({
            type: "post",
            dataType: "json",
            url : "saveBusTraceDetail",
            data: {
            	"factory_id" : $('#exec_factory').val(),
                "bus_number":$('#bus_number').val(),
                "project_id":$('#bus_number').attr("project_id"),        
                "workshop_name":$('#exec_workshop').find("option:selected").text(),
                "station_name":$("#exec_station :selected").attr("station_code"),                
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

            },
            error:function(){alertError(); resetPage();}
        });
	}