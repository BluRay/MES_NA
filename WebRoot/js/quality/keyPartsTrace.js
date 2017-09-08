var pageSize=1;
var table;
var table_height = $(window).height()-300;
$(document).ready(function(){
	initPage();
	$("#breadcrumbs").resize(function() {
		//ajaxQuery();
	});
	function initPage(){
		getBusNumberSelect('#nav-search-input');
		getBusNumberSelect('#search_busNumber');
		getFactorySelect("quality/keyPartsTrace",'',"#search_factory","全部",'id');
		getBusTypeSelect("","#search_bus_type","全部","id");
		getWorkshopSelect("",$("#search_factory :selected").text(),"","#search_workshop",null,"id");
		getOrderNoSelect("#search_order","#orderId");
		ajaxQuery();
	}

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/BMS/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})
	
	$("#btnQuery").click (function () {
		ajaxQuery();
	});
	
	$('#search_factory').change(function(){ 
		getWorkshopSelect("quality/keyPartsTrace",$("#search_factory :selected").text(),"","#search_workshop",null,"id");
	});
	$('#search_order').change(function(){ 
		$("#search_config").html("");
		if($(this).val()==""){
			return false;
		}
		$.ajax({
			url: "/BMS/order/getOrderByNo",
			dataType: "json",
			data: {
				"order_no":$(this).val()
			},
			async: false,
			error: function () {},
			success: function (response) {
				if(response.data!=null && response.data!=undefined){
					getOrderConfigSelect(response.data.id,"","#search_config","全部","id");
				}
			}
		})
		//getOrderConfigSelect("quality/keyPartsTrace",$("#search_factory :selected").text(),"","#search_workshop",null,"id");
	});
});



function getBusType(){
	$(".busType").empty();
	$.ajax({
		url: "/BMS/common/getBusType",
		dataType: "json",
		data: {},
		async: false,
		error: function () {alertError();},
		success: function (response) {
			options = $.templates("#tmplBusTypeSelect").render(response.data);
			$(".busType").append(options);
		}
	})
}

function ajaxQuery(){
	$("#tableData").dataTable({
		serverSide: true,
		paiging:true,
		ordering:false,
		searching: false,
		autoWidth:false,
		destroy: true,
		scrollY: $(window).height()-245,
		scrollX: true,
		/*scrollCollapse: true,*/
		pageLength: 20,
		pagingType:"full_numbers",
		lengthChange:false,
		orderMulti:false,
		language: {
			emptyTable:"抱歉，未查询到数据！",
			info:"共计 _TOTAL_ 条，当前第 _PAGE_ 页 共 _PAGES_ 页",
			infoEmpty:"",
			paginate: { first:"首页",previous: "上一页",next:"下一页",last:"尾页",loadingRecords: "请稍等,加载中..."}
		},
		ajax:function (data, callback, settings) {
			var param ={
				"draw":1,
				"factoryId":$("#search_factory").val(),
				"bustypeId" : $("#search_bus_type").val(),
				"busNumber" : $("#search_busNumber").val(),
				"orderNo" : $("#search_order").val(),
				"workshop" : $("#search_workshop").find("option:selected").text(),
				"orderconfigId" : $("#search_config").val()
			};
            param.length = data.length;					//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;					//开始的记录序号
            param.page = (data.start / data.length)+1;	//当前页码

            $.ajax({
                type: "post",
                url: "getKeyPartsTraceList",
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
		          	{"title":"车号","class":"center","data":"bus_number","defaultContent": ""},
		            {"title":"工厂","class":"center","data":"factory_name","defaultContent": ""},
		            {"title":"车间","class":"center","data":"workshop","defaultContent": ""},
		            {"title":"订单","class":"center","data":"order_no","defaultContent": ""},
		            {"title":"订单配置","class":"center","data":"order_config_name","defaultContent": ""},
		            {"title":"录入人","class":"center","data":"username","defaultContent": ""},
		            {"title":"录入时间","class":"center","data":"edit_date","defaultContent": ""},
//		            {"title":"操作",width:'80',"class":"center","data":null,"defaultContent": "",
//		            	"render": function ( data, type, row ) {
//		            		return  "<i class=\"glyphicon glyphicon-edit bigger-130 showbus\" title=\"编辑\" onclick='showBusNumberDetail(" 
//		            		+ row['bus_number'] + ")' style='color:blue;cursor: pointer;'></i>"
//		            	},
//		            }
		            {"title":"操作","class":"center","data":"order_id","render":function(data,type,row){
		            	return "<i class=\"ace-icon fa fa-pencil bigger-130 editorder\" title='编辑' onclick = 'showBusNumberDetail(" + JSON.stringify(row)+ ");' style='color:green;cursor: pointer;'></i>";		            		
		            	}
		            }
		          ],
	});
}

function showBusNumberDetail(json){
	$("#tableDataDetail").dataTable({
		paiging:false,
		showRowNumber:true,
		ordering:false,
		searching: false,
		bAutoWidth:false,
		destroy: true,
		paginate:false,
		scrollCollapse: true,
		lengthChange:false,
		orderMulti:false,
		info:false,
		sScrollY: table_height,sScrollX:true,
		language: {
			emptyTable:"",					     
			infoEmpty:"",
			zeroRecords:"暂无数据"
		},
		ajax:function (data, callback, settings) {
			var param ={
				"bus_number":json.bus_number,
				"workshop":json.workshop,
				"key_components_template_id":json.key_components_template_id
			};
           
            $.ajax({
                type: "post",
                url: "getBusNumberDetailList",
                cache: false,  //禁用缓存
                data: param,  //传入组装的参数
                dataType: "json",
                success: function (result) {
                	console.log("json",json);
                	$("#busNumber").text(json.bus_number);
                	$("#workshop").text(json.workshop);
                	$("#factory").text(json.factory_name);
                	$("#factoryId").val(json.factory_id);
                	$("#busType").text(json.bus_type_code);
                	$("#orderName").text(json.order_no+" "+json.order_name);
                	$("#configTable").text(json.order_config_name);
                	$("#dialog-edit").removeClass('hide').dialog({
        				resizable: false,
        				title: '<div class="widget-header"><h4 class="smaller"><i class="ace-icon fa fa-users green"></i> 关键零部件编辑</h4></div>',
        				title_html: true,
        				width:1200,
        				height:600,
        				modal: true,
        				buttons: [{
        							text: "关闭",
        							"class" : "btn btn-minier",
        							click: function() {$( this ).dialog( "close" );} 
        						},
        				        {
    						text: "保存",
    						"class" : "btn btn-primary btn-minier",
    						click: function() {
    							ajaxEdit(); 
    						} 
    					}
        					]
                
        			});
                	//封装返回数据
                    var returnData = {};
                    returnData.data = result.data;						
                    //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                    //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                    callback(returnData);
                }
            });
		},
		columns: [
					{"title":"序号","class":"center","data":"id","defaultContent": "","render":function(data,type,row,meta){
						return meta.row + meta.settings._iDisplayStart + 1;
			        }},
					{"title":"零部件编号","class":"center","data":"parts_no","defaultContent": ""},
					{"title":"零部件名称","class":"center","data":"parts_name","defaultContent": ""},
					{"title":"材料/规格","class":"center","data":"size","defaultContent": ""},
					{"title":"供应商名称","class":"center","data":"vendor","defaultContent": ""},
					{"title":"装配车间","class":"center","data":"workshop","defaultContent": ""},
					{"title":"工序","class":"center","data":"process","defaultContent": ""},
					{"title":"3C件","class":"center","data":"3C_components","defaultContent": ""},					
					{"title":"批次","class":"center","data":"batch","defaultContent": "","render":function(data,type,row){
						if(row.CCC_components=='是'){
							return "<input style='border:0;width:100px;text-align:center' disabled='disabled' class='batch' " +
							" value='"+(data!=undefined ? data : '')+"'/><input type='hidden' class='keypartsId' " +
							" value='"+(row.keypartsId!=undefined ? row.keypartsId : '')+"'/><input type='hidden' class='id' " +
							" value='"+row.id+"'/>";
						}else{
							return "<input style='border:0;width:100px;text-align:center' class='batch' " +
							" value='"+(data!=undefined ? data : '')+"'/><input type='hidden' class='keypartsId' " +
							" value='"+(row.keypartsId!=undefined ? row.keypartsId : '')+"'/><input type='hidden' class='id' " +
							" value='"+row.id+"'/>";
						}

					}
					},
		          ],
	});
}
/**
 * 车型下拉列表
 * @param selectval
 * @param selectId
 * @param selectType
 * @param valName
 */
function getBusTypeSelect(selectval,selectId,selectType,valName){
	$.ajax({
		url : "/BMS/common/getBusType",
		dataType : "json",
		data : {},
		async : false,
		error : function(response) {
			alert(response.message)
		},
		success : function(response) {
			getSelects(response.data,selectval,selectId,selectType, valName);	
		}
	});
}
function getOrderConfigSelect(order_id,selectval,selectId,selectType,valName){
	$.ajax({
		url : "/BMS/common/getOrderConfigSelect",
		dataType : "json",
		data : {"order_id":order_id},
		async : false,
		error : function(response) {
			alert(response.message)
		},
		success : function(response) {
			getSelects(response.data,selectval,selectId,selectType, valName);	
		}
	});
}
/**
 * 车间选择下拉列表（包括权限控制）
 * url:权限控制url
 * selectval:选中的值
 * selectId:下拉框组件id
 * selectType:下拉框组件类型：==全部==、==请选择==、== ==
 * valName:option value值:id/name
 */

function getWorkshopSelect(url,factory,selectval,selectId,selectType,valName){
	$.ajax({
		url : "/BMS/common/getWorkshopSelectAuth",
		dataType : "json",
		data : {"function_url":url,"factory":factory},
		async : false,
		error : function(response) {
			alert(response.message)
		},
		success : function(response) {
			getSelects(response.data,selectval,selectId,selectType, valName);	
		}
	});
}

function ajaxEdit(){

	var trs=$("#tableDataDetail tbody").children("tr");
	var arr=[];
	var busNumber=$("#busNumber").text();
	var factoryId=$("#factoryId").val();
	$.each(trs,function(index,tr){
		var tds=$(tr).children("td");
		var parts_no=tds.eq(1).text();
		var parts_name=tds.eq(2).text();
		var size=tds.eq(3).text();
		var vendor=tds.eq(4).text();
		var workshop=tds.eq(5).text();
		var process_name=tds.eq(6).text();
		var id=tds.eq(8).find(".id").val();
		var keypartsId=tds.eq(8).find(".keypartsId").val();
		var batch=tds.eq(8).find(".batch").val();
		var obj={};
		obj.key_parts_template_detail_id=id;
		obj.key_parts_id=keypartsId;
		obj.batch=batch;
		obj.parts_no=parts_no;
		obj.parts_name=parts_name;
		obj.size=size;
		obj.vendor=vendor;
		obj.workshop=workshop;
		obj.process_name=process_name;
		obj.factory_id=factoryId;
		obj.bus_number=busNumber;
		arr.push(obj);
	});
    console.log("param",JSON.stringify(arr));
   // return false;
	$.ajax({
		type:"post",
		url: "addKeyParts",
		dataType: "json",
		data: {
			"key_parts_list":JSON.stringify(arr)
		},
		async: false,
		error: function () {alertError();},
		success: function (response) {
			if(response.success){
		    	$.gritter.add({
					title: '系统提示：',
					text: '<h5>保存成功！</h5>',
					class_name: 'gritter-info'
				});
		    	ajaxQuery();
		    	}else{
		    		$.gritter.add({
						title: '系统提示：',
						text: '<h5>保存失败！</h5><br>'+response.message,
						class_name: 'gritter-info'
					});
		    	}
			$( "#dialog-edit" ).dialog("close");
			
		}
	})
	
;	
}
