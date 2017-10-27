var pageSize=1;
var table;
var table_height = $(window).height()-250;
var query_data;
var req_arr = [];
$(document).ready(function () {	
	initPage();
	
	function initPage(){
		getBusNumberSelect('#nav-search-input');
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
			getAllLineSelect();
			getAllProcessSelect();
		}
	});
	
	$("#search_workshop").change(function(){
		$("#search_station").empty();
		if($("#exec_workshop").val() !=''){
			getAllLineSelect();
			getAllProcessSelect();
		}
	});

	$("#search_line").change(function(){
		$("#search_station").empty();
		if($("#search_line").val() !=''){
			getAllProcessSelect();
		}
	});
	
	function getFactorySelect() {
		$.ajax({
			url : "/MES/common/getFactorySelectAuth",
			dataType : "json",
			data : {
				function_url:'production/materialRequirement'
			},
			async : false,
			error : function(response) {
				alert(response.message)
			},
			success : function(response) {
				getSelects_noall(response.data, "", "#search_factory");
				getAllWorkshopSelect();
				getAllLineSelect();
				getAllProcessSelect();
			}
		});
	}
	
	function getAllLineSelect() {
		$("#search_line").empty();
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
			}
		});
	}
	
	function getAllProcessSelect(order_type) {
		order_type=order_type||'Standard order';
		$("#search_station").empty();
		$.ajax({
			url : "getProcessMonitorSelect",
			dataType : "json",
			data : {
				factory:$("#search_factory :selected").text(),
				workshop:$("#search_workshop :selected").text(),
				line:$("#search_line").val(),
				order_type:order_type
				},
			async : false,
			error : function(response) {
				alert(response.message)
			},
			success : function(response) {
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
			    	strs += "<option value=" + value.id + " process='"+value.station_name+"' plan_node='"+(value.plan_node_name||"")
			    	+"' field_name='" +(value.field_name||"")+ "'>" + value.station_code + "</option>";
			    });
			    $("#search_station").append(strs);
			    $("#search_station").val(process_id_default+"");
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
				"factory_id": $('#search_factory').val(),
				"factory_name": $("#search_factory :selected").text(),
				"workshop_id": $('#search_workshop').val(),
				"workshop_name": $("#search_workshop :selected").text(),
				"line": $('#search_line').val(),
				"station_id": $('#search_station').val(),
				"station_name": $("#search_station :selected").attr('process'),
				"station": $("#search_station :selected").text(),
				"sap_material": $('#search_sap_material').val()
			};
            param.length = data.length;					//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;					//开始的记录序号
            param.page = (data.start / data.length)+1;	//当前页码

            $.ajax({
                type: "post",
                url: "getLineInventoryMatList",
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
		            {"title":"SapMaterial","class":"center","data":"sap_material","defaultContent": ""},
		            {"title":"BusNumber","class":"center","data":"bus_number","defaultContent": ""},
		            {"title":"BYD_NO","class":"center","data":"byd_no","defaultContent": ""},
		            {"title":"PartName","class":"center","data":"part_name","defaultContent": ""},
		            {"title":"Specification","class":"center","data":"specification","defaultContent": ""},
		            {"title":"RequiredQuantity","class":"center","data":"required_quantity","defaultContent": ""},
		            {"title":"LineQuantity","class":"center","data":"line_quantity","defaultContent": ""},
		            {"title":"Unit","class":"center","data":"unit","defaultContent": ""},
		            {"title":"Vendor","class":"center","data":"vendor","defaultContent": ""}
		          ],
	});
}
