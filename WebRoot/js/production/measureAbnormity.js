var pageSize=1;
var table;
var table_height = $(window).height()-270;
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
		e.preventDefault();
		$("#dialog-add").removeClass('hide').dialog({
			resizable: false,
			title: '<div class="widget-header"><h4 class="smaller"><i class="ace-icon fa fa-users green"></i> Add Abnormity</h4></div>',
			title_html: true,
			width:'720px',
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

        $.ajax({
            type: "get",
            dataType: "json",
            url : "enterException",
            data: {
            	"factory" : $('#new_plant option:selected').text(),
            	"workshop" : $('#new_workshop option:selected').text(),
            	"line" : $('#new_line option:selected').text(),
            	"process" : $('#new_abnormalStation').val(),
            	"process_name" : $('#new_abnormalStation option:selected').text(),
                "bus_list":$('#new_busNumber').val(),
                "reason_type_id":$('#new_abnormal_cause option:selected').attr("keyvalue")||"0",
            	"reason_type" : $('#new_abnormal_cause option:selected').text(),
                "start_time":$('#new_opendate').val(),
                "detailed_reasons":$('#new_detailed_reason').val()
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
    
    $("#btnSubmit").click(function() {
        if(!($("#btnSubmit").hasClass("disabled"))){
            $("#btnSubmit").attr("disabled","disabled");
            ajaxEnter();
        }
        return false;
    });
	
	$("#search_factory").change(function(){
		$("#search_workshop").empty();
		if($("#search_factory").val() !=''){
			getAllWorkshopSelect();
			getAllLineSelect();
			//getAllProcessSelect();
		}
	});
	$("#new_plant").change(function(){
		$("#new_workshop").empty();
		if($("#new_plant").val() !=''){
			getAllNewWorkshopSelect();
			getAllNewLineSelect();
			getAllNewProcessSelect();
		}
	});
	$("#search_workshop").change(function(){
		$("#search_line").empty();
		if($("#search_workshop").val() !=''){
			getAllLineSelect();
		}
	});
	$("#new_workshop").change(function(){
		$("#new_line").empty();
		if($("#new_workshop").val() !=''){
			getAllNewLineSelect();
			getAllNewProcessSelect();
		}
	});
	$("#new_line").change(function(){
		$("#new_abnormalStation").empty();
		if($("#new_line").val() !=''){
			getAllNewProcessSelect();
		}
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
				getSelects_noall(response.data, "", "#search_factory");
				getSelects_noall(response.data, "", "#new_plant");
				getAllWorkshopSelect();
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
				factory:$("#search_factory :selected").text(),
				function_url:'production/measureAbnormity'
			},
		async : false,
		error : function(response) {
			alert(response.message)
		},
		success : function(response) {
			getSelects(response.data, "", "#search_workshop",null,"id");
			getSelects(response.data, "", "#new_workshop",null,"id");
			getAllLineSelect();
		}
	});
}
function getAllNewWorkshopSelect() {
	$("#exec_workshop").empty();
	$.ajax({
		url : "/MES/common/getWorkshopSelectAuth",
		dataType : "json",
		data : {
				factory:$("#new_plant :selected").text(),
				function_url:'production/measureAbnormity'
			},
		async : false,
		error : function(response) {
			alert(response.message)
		},
		success : function(response) {
			getSelects(response.data, "", "#new_workshop",null,"id");
		}
	});
}

function getAllLineSelect() {
	$("#exec_line").empty();
	$.ajax({
		url : "/MES/common/getLineSelectAuth",
		dataType : "json",
		data : {
				factory:$("#search_factory :selected").text(),
				workshop:$("#search_workshop :selected").text()
			},
		async : false,
		error : function(response) {
			alert(response.message)
		},
		success : function(response) {
			line_selects_data=response.data;
			getSelects(response.data, "", "#search_line",null,"name");
			getSelects(response.data, "", "#new_line",null,"name");
			getAllNewProcessSelect();
		}
	});
}
function getAllNewLineSelect() {
	$("#exec_line").empty();
	$.ajax({
		url : "/MES/common/getLineSelectAuth",
		dataType : "json",
		data : {
				factory:$("#new_plant :selected").text(),
				workshop:$("#new_workshop :selected").text()
			},
		async : false,
		error : function(response) {
			alert(response.message)
		},
		success : function(response) {
			line_selects_data=response.data;
			getSelects(response.data, "", "#new_line",null,"name"); 
		}
	});
}
function getAllNewProcessSelect(order_type) {
	order_type=order_type||'Standard order';
	$("#new_abnormalStation").empty();
	$.ajax({
		url : "getProcessMonitorSelect",
		dataType : "json",
		data : {
			factory:$("#new_plant :selected").text(),
			workshop:$("#new_workshop :selected").text(),
			line:$("#new_line").val(),
			order_type:order_type
			},
		async : false,
		error : function(response) {
			alert(response.message)
		},
		success : function(response) {
			var strs = "";
		    $("#new_abnormalStation").html("");
		    var process_id_default="";
		    var process_name_default="";   
		    $.each(response.data, function(index, value) {
		    	if (index == 0) {
		    		process_id_default=value.id;
			    	process_name_default=value.station_code+"  "+value.station_name;
		    	}
		    	
		    	if(getQueryString("process_id")==value.id){
		    	 	process_id_default=value.id;
			    	process_name_default=value.station_code+"  "+value.station_name;
		    	}
		    	strs += "<option value=" + value.id + " process='"+value.station_code+"  "+value.station_name+"' plan_node='"+(value.plan_node_name||"")
		    	+"' field_name='" +(value.field_name||"")+ "'>" + value.station_code+"  "+value.station_name + "</option>";
		    });
		    $("#new_abnormalStation").append(strs);
		    $("#new_abnormalStation").val(process_id_default);
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

function ajaxQuery(){
	$("#tableData").dataTable({
		serverSide: true,
		fixedColumns:   {
            leftColumns: 0,
            rightColumns:1
        },
		dom: 'Bfrtip',
		lengthMenu: [
		             [ 20, 30, 50, -1 ],
		             [ 'Show 20 rows', 'Show 30 rows', 'Show 50 rows', 'Show all rows' ]
		         ],
	    buttons: [
	        {extend:'excelHtml5',title:'data_export',className:'black',text:'<i class=\"fa fa-file-excel-o bigger-130\" tooltip=\"export excel\"></i>'},
	        {extend:'pageLength',/*text:'显示行'*/}
	       
	    ],
		paiging:true,ordering:false,searching: false,bAutoWidth:false,
		destroy: true,sScrollY: table_height,scrollX: "100%",orderMulti:false,
		pageLength: 20,pagingType:"full_numbers",lengthChange:false,
		language: {
		},
		ajax:function (data, callback, settings) {
			var param ={
				"draw":1,
				"plant":$('#search_factory :selected').text(),
				"workshop":$('#search_workshop :selected').text(),
				"line":$('#search_line :selected').text(),
				"bus_number":$("#search_busno").val(),
				"status":$("#search_status").val(),
				"start_time":$("#start_time").val(),
				"end_time":$("#end_time").val()
			};
            param.length = data.length;					//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;					//开始的记录序号
            param.page = (data.start / data.length)+1;	//当前页码

            $.ajax({
                type: "post",
                url: "getExceptionList",
                cache: false,  //禁用缓存
                data: param,  //传入组装的参数
                dataType: "json",
                success: function (result) {
                    //console.log(result);
                	//封装返回数据
                    var returnData = {};
                    returnData.draw = data.draw;						//这里直接自行返回了draw计数器,应该由后台返回
                    returnData.recordsTotal = result.recordsTotal;		//返回数据全部记录
                    returnData.recordsFiltered = result.recordsTotal;	//后台不实现过滤功能，每次查询均视作全部结果
                    returnData.data = result.data;						//返回的数据列表
                    //console.log(returnData);
                    //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                    //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                    callback(returnData);
                }
            });
		},
		columns: [
		            {"title":"Plant","class":"center","data":"plant","defaultContent": ""},
		            {"title":"Workshop","class":"center","data":"workshop","defaultContent": ""},
		            {"title":"Line","class":"center","data":"line","defaultContent": ""},
		            {"title":"Abnormal Station","class":"center","data":"abnormal_station","defaultContent": ""},
		            {"title":"Bus Number","class":"center","data":"bus_number","defaultContent": ""},
		            {"title":"Abnormal Cause","class":"center","data":"abnormal_cause","defaultContent": ""},
		            {"title":"Detailed Reason","class":"center","data":"detailed_reason","defaultContent": ""},
		            {"title":"Open Date","class":"center","data":"open_date","defaultContent": ""},
		            {"title":"Responsible Department","width":"200","class":"center","data":"responsible_department","defaultContent": ""},
		            {"title":"measures","class":"center","width":"300","data":"measures","defaultContent": ""},
		            {"title":"Measures Time","class":"center","data":"measure_date","defaultContent": ""},
		            {"title":"Status","class":"center","data":"open_date","defaultContent": "",
		            	"render": function ( data, type, row ) {
		            		var status = "Open"
		            		if(undefined!=row['responsible_department_id'] && row['responsible_department_id']!=''){
		            			status = "Closed"
		            		}
		            		return status;
		            	}
		            },
		            {"title":"","width":"50","class":"center","data": null,"id":"staff_number",
		            	"render": function ( data, type, row ) {
		            		if(undefined==row['responsible_department_id'] || row['responsible_department_id']==''){
		                    return "<i class=\"ace-icon glyphicon glyphicon-ok bigger-130\" title=\"处理\" onclick='editPause(" +
		                    row['id'] + ",\"" + row['plant'] + "\",\"" + row['workshop'] + "\",\"" + row['line'] + "\",\"" + row['abnormal_station'] + "\",\"" + 
		                    row['bus_number'] + "\",\"" + row['abnormal_cause'] + "\",\"" + row['detailed_reason'].replace(/\r/ig, "").replace(/\n/ig, "") + "\",\"" + 
		                    row['open_date'] + "\")' style='color:blue;cursor: pointer;'></i>";
		            		}else{
		            			return "";
		            		}
		                },
		            }
		          ],
	});
	$("#tableData_info").addClass('col-xs-6');
	$("#tableData_paginate").addClass('col-xs-6');
	$(".dt-buttons").css("margin-top","-50px").find("a").css("border","0px");
}

function editPause(id,plant,workshop,line,abnormal_station,bus_number,abnormal_cause,detailed_reason,open_date){
	getKeysSelect("RESPONSIBLE_UNITS", "", "#edit_responsibleDepartment");
	$("#edit_plant").val(plant);
	$("#edit_workshop").val(workshop);
	$("#edit_id").val(id);
	$("#edit_line").val(line);
	$("#edit_abnormalStation").val(abnormal_station);
	$("#edit_busnumber").val(bus_number);
	$("#edit_abnormalCause").val(abnormal_cause);
	$("#edit_opendate").val(open_date);
	$("#edit_detailed_reason").val(detailed_reason);
	$("#edit_measures").val("");
	$("#edit_measuresTime").val("");
	
	$("#dialog-edit").removeClass('hide').dialog({
		resizable: false,
		title: '<div class="widget-header"><h4 class="smaller"><i class="ace-icon fa fa-users green"></i> Add Abnormity</h4></div>',
		title_html: true,
		width:'800px',
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
						btnEditConfirm(id);
					} 
				}
			]
	});
	
}

function btnEditConfirm(id){
	if($("#edit_measuresTime").val()==""){
		alert(Warn['P_measureAbnormity_01']);
		$("#edit_measuresTime").focus();
		return false;
	}
	if($("#measures").val()==""){
		alert(Warn['P_measureAbnormity_02']);
		$("#measures").focus();
		return false;
	}
	
	$.ajax({
		type : "get",
		dataType : "json",
		async : false,
		url : "measuresAbnormity",
		data : {
			"id" : id,
			"responsible_department_id": $("#edit_responsibleDepartment").val(),
			"responsible_department" : $('#edit_responsibleDepartment option:selected').text(),
			"measures" : $("#edit_measures").val(),
			"measure_date" : $("#edit_measuresTime").val(),
		},
		success : function(response) {
			fadeMessageAlert(null,"SUCCESS","gritter-info");
        	$("#dialog-edit").dialog( "close" );
    		ajaxQuery();
		}
	});
}
