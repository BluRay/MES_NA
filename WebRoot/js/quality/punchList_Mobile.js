	var parts_list;

	$(document).ready(function () {	
		initPage();
	    
		$("#btn_clear").click(function(){
		    resetPage();		
		})
		
		/**
		 * 保存信息
		 */
		$("#btn_save").click(function(){
		   ajaxSave();
		});
	})

	function initPage(){
		getFactorySelect();
	    getDefectCodeType();
		getLocationList();
		$('#new_busNumber').focus();
		resetPage();
		
	};
	
	function resetPage () {       
        $("#new_busNumber").val("");
        $("#new_orientation").val("");
        $("#new_problemDescription").val("");
        $("#new_responsibleleader").val("");
        $("#new_QCinspector").val("");
		$('#new_busNumber').focus();
    }
	

	$("#new_plant").change(function(){
		$("#new_workshop").empty();
		if($("#new_plant").val() !=''){
			getAllNewWorkshopSelect();
		}
	});
	$("#new_defectcodes").change(function(){
		getDefectCodeInfo($("#new_defectcodes").val());
	});
	
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
				getSelects_noall(response.data, "", "#new_plant");
				getAllWorkshopSelect();
			}
		});
	}
	
	function getDefectCodeType(){
		$("#new_defectcodes").empty();
		$.ajax({
			url : "getDefectCodeType",
			dataType : "json",
			data : {},
			async : false,
			error : function(response) {alert(response.message)},
			success : function(response) {
				var strs ="";
				$.each(response.data, function(index, value) {
					strs += "<option value=" + value.defect_type + ">" + value.defect_type + "</option>";
					if(index == 0){
						getDefectCodeInfo(value.defect_type)
					}
				});
				$("#new_defectcodes").append(strs);
			}
		});
	}
	function getDefectCodeInfo(defect_type){
		$("#new_defectcodes_info").empty();
		$.ajax({
			url : "getDefectCodeInfo",
			dataType : "json",
			data : {"defect_type" : defect_type},
			async : false,
			error : function(response) {alert(response.message)},
			success : function(response) {
				var strs ="";
				$.each(response.data, function(index, value) {
					strs += "<option value=" + value.id + ">" + value.defect_code + " " + value.defect_name + "</option>";
				});
				$("#new_defectcodes_info").append(strs);
			}
		});
	}
	
	function getFactorySelect() {
		$.ajax({
			url : "/MES/common/getFactorySelectAuth",
			dataType : "json",
			data : {
				function_url:'quality/punchList'
			},
			async : false,
			error : function(response) {
				alert(response.message)
			},
			success : function(response) {
				getSelects_noall(response.data, "", "#new_plant");
				getAllWorkshopSelect();
			}
		});
	}
	function getAllWorkshopSelect() {
		$("#new_workshop").empty();
		$.ajax({
			url : "/MES/common/getWorkshopSelectAuth",
			dataType : "json",
			data : {
					factory:$("#new_plant :selected").text(),
					function_url:'quality/punchList'
				},
			async : false,
			error : function(response) {
				alert(response.message)
			},
			success : function(response) {
				getSelects(response.data, "", "#new_workshop",null,"id");
				getSelects(response.data, "", "#new_src_workshop",null,"id");
			}
		});
	}
	function getLocationList(){
		$("#new_location").empty();
		$.ajax({
			url : "getLocationList",
			dataType : "json",
			data : {},
			async : false,
			error : function(response) {alert(response.message)},
			success : function(response) {
				var strs ="";
				$.each(response.data, function(index, value) {
					strs += "<option value=" + value.id + ">" + value.main_location + "</option>";
				});
				$("#new_location").append(strs);
			}
		});
	}

	function ajaxSave(){
		if($('#new_busNumber').val() == ""){
			alert("Please input BusNumber ！");
			$('#new_busNumber').focus();
			return false;
		}
		var defectcodes = $('#new_defectcodes_info :selected').text();
        $.ajax({
            type: "get",
            dataType: "json",
            url : "addPunch",
            data: {
            	"factory" : $('#new_plant :selected').text(),
            	"workshop" : $('#new_workshop :selected').text(),
            	"bus_number" : $('#new_busNumber').val(),
            	"src_workshop" : $('#new_src_workshop :selected').text(),
            	"main_location_id" : $('#new_location').val(),
            	"main_location" : $('#new_location :selected').text(),
            	"Orientation" : $('#new_orientation').val(),
            	"ProblemDescription" : $('#new_problemDescription').val(),
            	"defect_codes_id" : $('#new_defectcodes_info').val(),
            	"defect_codes" : defectcodes,
            	"responsible_leader" : $('#new_responsibleleader').val(),
            	"qc_inspector" : $('#new_QCinspector').val(),
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