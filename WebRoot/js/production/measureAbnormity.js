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
		e.preventDefault();
		$("#dialog-add").removeClass('hide').dialog({
			resizable: false,
			title: '<div class="widget-header"><h4 class="smaller"><i class="ace-icon fa fa-users green"></i> Add Abnormity</h4></div>',
			title_html: true,
			width:'550px',
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
            	"factory" : $('#new_plant :selected').text(),
            	"workshop" : $('#new_workshop :selected').text(),
            	"line" : $('#new_line :selected').text(),
            	"process" : $('#new_abnormalStation').val(),
            	"process_name" : $('#new_abnormalStation:selected').text(),
                "bus_list":$('#new_busNumber').val(),
                "reason_type_id":$('#new_abnormal_cause :selected').attr("keyvalue")||"0",
            	"reason_type" : $('#new_abnormal_cause :selected').text(),
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
				getAllLineSelect();
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
	order_type=order_type||'标准订单';
	$("#exec_process").empty();
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
			    	process_name_default=value.process_name;
		    	}
		    	
		    	if(getQueryString("process_id")==value.id){
		    	 	process_id_default=value.id;
			    	process_name_default=value.process_name;
		    	}
		    	strs += "<option value=" + value.id + " process='"+value.process_name+"' plan_node='"+(value.plan_node_name||"")
		    	+"' field_name='" +(value.field_name||"")+ "'>" + value.process_code + "</option>";
		    });
		    $("#new_abnormalStation").append(strs);
		    $("#new_abnormalStation").val(process_id_default+"");
		    $("#new_abnormalStation").val(process_name_default);
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
		            {"title":"Operation","class":"center","data": null,"id":"staff_number",
		            	"render": function ( data, type, row ) {
		                    return "<i class=\"glyphicon glyphicon-search bigger-130 showbus\" title=\"查看详情\" onclick=\"javascript:window.location = ('planPreview?version="+row['version'] + "&plan_month="+row['plan_month'] + "&factory_id=" +$("#search_factory").val()+"')\" style='color:blue;cursor: pointer;'></i>&nbsp;";
		                },
		            }
		          ],
	});
}
