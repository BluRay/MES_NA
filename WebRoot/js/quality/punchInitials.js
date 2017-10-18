var pageSize=1;
var table;
var table_height = $(window).height()-250;
$(document).ready(function () {	
	initPage();
	
	function initPage(){
		getBusNumberSelect('#nav-search-input');
		getKeysSelect("ABNORMAL_REASON", "", "#new_abnormal_cause");
		getFactorySelect();
		ajaxQuery();
	};

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/MES/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	});
	
	$("#btnQuery").click(function () {
		ajaxQuery();
	});
	
	$("#btnAdd").on('click', function(e) {
		getDefectCode();
		getLocationList();
		$("#new_busNumber").val("");
		$("#new_orientation").val("");
		$("#new_problemDescription").val("");
		$("#new_responsibleleader").val("");
		e.preventDefault();
		$("#dialog-add").removeClass('hide').dialog({
			resizable: false,
			title: '<div class="widget-header"><h4 class="smaller"><i class="ace-icon fa fa-users green"></i> Add Punch</h4></div>',
			title_html: true,
			width:'600px',
			modal: true,
			buttons: [{
						text: "Close",
						"class" : "btn btn-minier",
						click: function() {$( this ).dialog( "close" );} 
					},
					{
						text: "Add",
						id:"btn_ok",
						"class" : "btn btn-success btn-minier",
						click: function() {
							btnAddConfirm();
						} 
					}
				]
		});
	});
	
	function btnAddConfirm(){	
		//数据验证
		if($('#new_busNumber').val() == ""){
			alert("Please input BusNumber ！");
			$('#new_busNumber').focus();
			return false;
		}
		console.log($('#new_defectcodes :selected').text());
		var defectcodes = $('#new_defectcodes :selected').text();
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
            	"defect_codes_id" : $('#new_defectcodes').val(),
            	"defect_codes" : defectcodes,
            	"responsible_leader" : $('#new_responsibleleader').val(),
            	"qc_inspector" : $('#new_QCinspector').val(),
            },
            success: function(response){
            	fadeMessageAlert(null,"SUCCESS","gritter-info");
            	$("#dialog-add").dialog( "close" );
        		ajaxQuery();
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
	
	$("#search_factory").change(function(){
		$("#search_workshop").empty();
		if($("#search_factory").val() !=''){
			getAllWorkshopSelect();
		}
	});
	$("#new_plant").change(function(){
		$("#new_workshop").empty();
		if($("#new_plant").val() !=''){
			getAllNewWorkshopSelect();
		}
	});
	$("#edit_plant").change(function(){
		$("#edit_workshop").empty();
		if($("#edit_plant").val() !=''){
			getAllEditWorkshopSelect();
		}
	});
	
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
				getSelects_noall(response.data, "", "#search_factory");
				getSelects_noall(response.data, "", "#new_plant");
				getSelects_noall(response.data, "", "#edit_plant");
				getAllWorkshopSelect();
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
				factory:$("#search_factory :selected").text(),
				function_url:'quality/punchList'
			},
		async : false,
		error : function(response) {
			alert(response.message)
		},
		success : function(response) {
			getSelects(response.data, "", "#search_workshop",null,"id");
			getSelects(response.data, "", "#new_workshop",null,"id");
			getSelects(response.data, "", "#new_src_workshop",null,"id");
		}
	});
}
function getAllNewWorkshopSelect() {
	$("#exec_workshop").empty();
	$("#new_src_workshop").empty();
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

function getAllEditWorkshopSelect() {
	$("#edit_workshop").empty();
	$("#edit_src_workshop").empty();
	$.ajax({
		url : "/MES/common/getWorkshopSelectAuth",
		dataType : "json",
		data : {
				factory:$("#edit_plant :selected").text(),
				function_url:'quality/punchList'
			},
		async : false,
		error : function(response) {
			alert(response.message)
		},
		success : function(response) {
			getSelects(response.data, "", "#edit_workshop",null,"id");
			getSelects(response.data, "", "#edit_src_workshop",null,"id");
		}
	});
}

function ajaxQuery(){
	$("#tableData").dataTable({
		serverSide: true,paiging:true,ordering:false,searching: false,bAutoWidth:false,
		destroy: true,sScrollY: table_height,scrollX: "100%",orderMulti:false,
		pageLength: 25,pagingType:"full_numbers",lengthChange:false,
		fixedColumns:   {
            leftColumns: 0,
            rightColumns:1
        },
		ajax:function (data, callback, settings) {
			var param ={
				"draw":1,
				"plant":$('#search_factory :selected').text(),
				"workshop":$('#search_workshop :selected').text(),
				"status":$('#search_status').val(),
				"bus_number":$("#search_busno").val()
			};
            param.length = data.length;					//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;					//开始的记录序号
            param.page = (data.start / data.length)+1;	//当前页码

            $.ajax({
                type: "post",
                url: "getPunchList",
                cache: false,  //禁用缓存
                data: param,  //传入组装的参数
                dataType: "json",
                success: function (result) {
                	//封装返回数据
                    var returnData = {};
                    returnData.draw = data.draw;						//这里直接自行返回了draw计数器,应该由后台返回
                    returnData.recordsTotal = result.recordsTotal;		//返回数据全部记录
                    returnData.recordsFiltered = result.recordsTotal;	//后台不实现过滤功能，每次查询均视作全部结果
                    returnData.data = result.data;						//返回的数据列表
                    callback(returnData);
                }
            });
		},
		columns: [
		            {"title":"Plant","class":"center","data":"plant","defaultContent": ""},
		            {"title":"Workshop","class":"center","data":"workshop","defaultContent": ""},
		            {"title":"Bus_Number","class":"center","data":"bus_number","defaultContent": ""},
		            {"title":"SourceWorkshop","class":"center","data":"source_workshop","defaultContent": ""},
		            {"title":"Location","class":"center","data":"main_location","defaultContent": ""},
		            {"title":"Orientation","class":"center","data":"orientation","defaultContent": ""},
		            {"title":"ProblemDescription","class":"center","data":"problem_description","defaultContent": ""},
		            {"title":"DefectCodes","class":"center","data":"defect_codes","defaultContent": ""},
		            {"title":"ResponsibleLeader","class":"center","data":"responsible_leader","defaultContent": ""},
		            {"title":"QC_Inspector","class":"center","data":"qc_inspector","defaultContent": ""},
		            {"title":"DateFound","class":"center","data":"date_found","defaultContent": ""},
		            {"title":"LeadInitials","class":"center","data":"lead_initials","defaultContent": ""},
		            {"title":"LeadInitialsDate","class":"center","data":"lead_initials_date","defaultContent": ""},
		            {"title":"QualityInitials","class":"center","data":"quality_initials","defaultContent": ""},
		            {"title":"QualityInitialsDate","class":"center","data":"quality_initials_date","defaultContent": ""},
		            {"title":"Operation","class":"center","data": null,"id":"staff_number",
		            	"render": function ( data, type, row ) {
		            		if(typeof(row.lead_initials) == "undefined"){
		            			return "<i class=\"glyphicon glyphicon-check bigger-130 \" title=\"LeadInitials\" onclick=\"leadInitials("+row.id+")\" style='color:blue;cursor: pointer;'></i>&nbsp;&nbsp;";
		            		}else{
		            			return "<i class=\"glyphicon glyphicon-edit bigger-130 \" title=\"QualityInitials\" onclick=\"qualityInitials("+row.id+")\" style='color:blue;cursor: pointer;'></i>&nbsp;";
		            		}
		                    //return "<i class=\"glyphicon glyphicon-check bigger-130 \" title=\"LeadInitials\" onclick=\"leadInitials("+row.id+")\" style='color:blue;cursor: pointer;'></i>&nbsp;&nbsp;" + 
		                    //"<i class=\"glyphicon glyphicon-edit bigger-130 \" title=\"QualityInitials\" onclick=\"qualityInitials("+row.id+")\" style='color:blue;cursor: pointer;'></i>&nbsp;";
		                },
		            }
		          ],
	});
}

function leadInitials(id){
	$.ajax({
		url : "getPunchInfoByid",
		dataType : "json",
		data : {
	    	"id": id
		},
		success : function(response) {
			//console.log('-->' + response.data[0].plant);
			$("#lead_busNumber").val(response.data[0].bus_number);
			$("#lead_plant").val(response.data[0].plant);
			$("#lead_workshop").val(response.data[0].workshop);
			$("#lead_src_workshop").val(response.data[0].source_workshop);
			$("#lead_location").val(response.data[0].main_location);
			$("#lead_orientation").val(response.data[0].orientation);
			$("#lead_problemDescription").val(response.data[0].problem_description);
			$("#lead_defectcodes").val(response.data[0].defect_codes);
			$("#lead_responsibleleader").val(response.data[0].responsible_leader);		
			$("#lead_QCinspector").val(response.data[0].qc_inspector);	
		}
	});
	
	$("#dialog-lead").removeClass('hide').dialog({
		resizable: false,
		title: '<div class="widget-header"><h4 class="smaller"><i class="ace-icon fa fa-users green"></i> LeadInitials</h4></div>',
		title_html: true,
		width:'800px',
		modal: true,
		buttons: [{
					text: "Close",
					"class" : "btn btn-minier",
					click: function() {$( this ).dialog( "close" );} 
				},
				{
					text: "Save",
					id:"btn_ok",
					"class" : "btn btn-success btn-minier",
					click: function() {
						btnLeadConfirm(id);
					} 
				}
			]
	});
}
function qualityInitials(id){
	$.ajax({
		url : "getPunchInfoByid",
		dataType : "json",
		data : {
	    	"id": id
		},
		success : function(response) {
			$("#qc_busNumber").val(response.data[0].bus_number);
			$("#qc_plant").val(response.data[0].plant);
			$("#qc_workshop").val(response.data[0].workshop);
			$("#qc_src_workshop").val(response.data[0].source_workshop);
			$("#qc_location").val(response.data[0].main_location);
			$("#qc_orientation").val(response.data[0].orientation);
			$("#qc_problemDescription").val(response.data[0].problem_description);
			$("#qc_defectcodes").val(response.data[0].defect_codes);
			$("#qc_responsibleleader").val(response.data[0].responsible_leader);		
			$("#qc_QCinspector").val(response.data[0].qc_inspector);	
		}
	});
	
	$("#dialog-qc").removeClass('hide').dialog({
		resizable: false,
		title: '<div class="widget-header"><h4 class="smaller"><i class="ace-icon fa fa-users green"></i> QualityInitials</h4></div>',
		title_html: true,
		width:'800px',
		modal: true,
		buttons: [{
					text: "Close",
					"class" : "btn btn-minier",
					click: function() {$( this ).dialog( "close" );} 
				},
				{
					text: "Save",
					id:"btn_ok",
					"class" : "btn btn-success btn-minier",
					click: function() {
						btnQcConfirm(id);
					} 
				}
			]
	});
}

function btnLeadConfirm(id){
	$.ajax({
		type : "get",
		dataType : "json",
		async : false,
		url : "leadInitialsPunch",
		data : {
			"id" : id
		},
		success : function(response) {
			fadeMessageAlert(null,"SUCCESS","gritter-info");
        	$("#dialog-lead").dialog( "close" );
    		ajaxQuery();
		}
	});
}
function btnQcConfirm(id){
	$.ajax({
		type : "get",
		dataType : "json",
		async : false,
		url : "qcInitialsPunch",
		data : {
			"id" : id
		},
		success : function(response) {
			fadeMessageAlert(null,"SUCCESS","gritter-info");
        	$("#dialog-qc").dialog( "close" );
    		ajaxQuery();
		}
	});
}

function getDefectCode(){
	$("#new_defectcodes").empty();
	$("#edit_defectcodes").empty();
	$.ajax({
		url : "getDefectCode",
		dataType : "json",
		data : {},
		async : false,
		error : function(response) {alert(response.message)},
		success : function(response) {
			var strs ="";
			$.each(response, function(index, value) {
				strs += "<option value=" + value.id + ">" + value.defect_code + " " + value.defect_name + "</option>";
			});
			$("#new_defectcodes").append(strs);
			$("#edit_defectcodes").append(strs);
		}
	});
}
function getLocationList(){
	$("#new_location").empty();
	$("#edit_location").empty();
	$.ajax({
		url : "getLocationList",
		dataType : "json",
		data : {},
		async : false,
		error : function(response) {alert(response.message)},
		success : function(response) {
			var strs ="";
			$.each(response, function(index, value) {
				strs += "<option value=" + value.id + ">" + value.main_location + "</option>";
			});
			$("#new_location").append(strs);
			$("#edit_location").append(strs);
		}
	});
}
