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
	
	function getDefectCode(){
		$("#new_defectcodes").empty();
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
				$.each(response, function(index, value) {
					strs += "<option value=" + value.id + ">" + value.main_location + "</option>";
				});
				$("#new_location").append(strs);
			}
		});
	}
	
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
            	"src_workshop" : $('#new_src_workshop:selected').text(),
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
		}
	});
	$("#new_plant").change(function(){
		$("#new_workshop").empty();
		if($("#new_plant").val() !=''){
			getAllNewWorkshopSelect();
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
			getSelects(response.data, "", "#new_src_workshop",null,"id");
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
			getSelects(response.data, "", "#new_src_workshop",null,"id");
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
		serverSide: true,paiging:true,ordering:false,searching: false,bAutoWidth:false,
		destroy: true,sScrollY: table_height,scrollX: "100%",orderMulti:false,
		pageLength: 25,pagingType:"full_numbers",lengthChange:false,
		language: {
			emptyTable:"抱歉，未查询到数据！",
			info:"共计 _TOTAL_ 条，当前第 _PAGE_ 页 共 _PAGES_ 页",
			infoEmpty:"",
			paginate: { first:"首页",previous: "上一页",next:"下一页",last:"尾页",loadingRecords: "请稍等,加载中..."}
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
		            {"title":"Status","class":"center","data":"open_date","defaultContent": "",
		            	"render": function ( data, type, row ) {
		            		var status = "Processing"
		            		if(row['responsible_department_id']==''){
		            			status = "Closed"
		            		}
		            		return status;
		            	}
		            },
		            {"title":"Operation","class":"center","data": null,"id":"staff_number",
		            	"render": function ( data, type, row ) {
		            		if(row['responsible_department_id']!=''){
		                    return "<i class=\"glyphicon glyphicon-edit bigger-130 showbus\" title=\"处理\" onclick='editPause(" +
		                    row['id'] + ",\"" + row['plant'] + "\",\"" + row['workshop'] + "\",\"" + row['line'] + "\",\"" + row['abnormal_station'] + "\",\"" + 
		                    row['bus_number'] + "\",\"" + row['abnormal_cause'] + "\",\"" + row['detailed_reason'].replace(/\r/ig, "").replace(/\n/ig, "") + "\",\"" + 
		                    row['open_date'] + "\")' style='color:blue;cursor: pointer;'></i>&nbsp;";
		            		}else{
		            			return "";
		            		}
		                },
		            }
		          ],
	});
}

function editPause(id,plant,workshop,line,abnormal_station,bus_number,abnormal_cause,detailed_reason,open_date){
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
	$("#measure_date").val("");
	
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
			"responsible_department" : $('#edit_responsibleDepartment :selected').text(),
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
