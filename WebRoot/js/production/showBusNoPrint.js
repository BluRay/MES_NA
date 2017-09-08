var pageSize=1;
var table;
var table_height = $(window).height()-250;
var busNoList;
var changed_config_id;
$(document).ready(function(){
	window.onafterprint=function(){
		ajaxUpdatePrint(busNoList,changed_config_id);
	}
	initPage();
	function initPage(){
		getBusNumberSelect('#nav-search-input');
		getOrderNoSelect("#search_order","#orderId");
		getBusNumberSelect("#bus_no");
		var buslist=[];
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
	$('body').on('click', '.btnPrint',function(e){
		$("#printarea").html("");
		busNoList="";//获取要打印的车号列表
		var tr=$(this).closest("tr");
		var configSelect=$(tr).find("select")[0];
		var configId=$(configSelect).val();
	
		var config_qty=$(configSelect).find("option:selected").attr("config_qty");
		var config_selected=$(configSelect).find("option:selected").text();
		var config_done_qty=0;
		//查询订单配置是否超过当前配置的分配总数
		var conditions="{factoryId:"+$(tr).find(".factoryId").val()+",orderId:"+$(tr).find(".orderId").val()+",configId:"+configId+"}";
		$.ajax({
			url:"getOrderConfigDoneQty",
			type:"post",
			async:false,
			dataType:"json",
			data:{
				"conditions":conditions				
			},
			success:function(response){
				config_done_qty=response.configDoneQty
			}
		})
		
		if(parseInt(config_done_qty)<=parseInt(config_qty)){
			var tbhtml="<div class=\"printConfigure printable toPrint\" style=\"padding-top:10px;padding-bottom:10px;line-height:40px;\" ><table border=0><tr ><td style=\"text-align:right; font-size:26px;font-weight:bold; height:35px; padding-left:0px\">订单：</td>"
    			+"<td style=\"text-align:left; font-size:26px;font-weight:bold; width:270px;height:35px \">"+$(tr).find(".bus_type_code").val()+"-"+$(tr).find(".order_no").text()+"-"+$(tr).find(".order_qty").text()+"</td></tr>"+
    			"<tr><td style=\"text-align:right; font-size:26px; font-weight:bold;height:35px; padding-left:0px;\">客户名称：</td>"
    			+"<td style=\"text-align:left; font-size:26px; font-weight:bold;width:270px;height:35px;\">"+$(tr).find(".customer").val()+"-"+config_selected+"</td></tr>"+
    			"<tr><td style=\"text-align:right; font-size:26px;font-weight:bold;height:35px;padding-left:0px\">车号：</td>"
    			+"<td style=\"text-align:left; font-size:26px;font-weight:bold ;width:270px;height:35px; \">"+$(tr).find(".busNo").text()+"</td></tr></table>"
    			+"<div id=\"bcTarget"+"\" style=\"width:300px; height:70px;margin-left:10px;margin-top:10px\"></div></div>";
			$("#printarea").append(tbhtml);
			$("#bcTarget").barcode($(tr).find(".busNo").text(), "code128",{barWidth:2, barHeight:70,showHRI:false});
			busNoList=$(tr).find(".busNo").text();
			changed_config_id=configId;
			window.print();
		}else{
			alert("配置 "+$(tr).find(".order_config_name").val()+"分配车号数不能大于该配置计划总数！");
		}
	});
	
});
function ajaxQuery(){
	$("#tableData").dataTable({
		serverSide: true,paiging:true,ordering:false,searching: false,bAutoWidth:false,
		destroy: true,sScrollY: table_height,sScrollX:true,orderMulti:false,
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
				"busNumber" : $("#search_busNumber").val(),
				"orderNo" : $("#search_order").val(),
				"planStart" : $("#plan_date_start").val(),
				"planEnd" : $("#plan_date_end").val()
			};
            param.length = data.length;					//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;					//开始的记录序号
            param.page = (data.start / data.length)+1;	//当前页码

            $.ajax({
                type: "post",
                url: "getBusNoPrintList",
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
                    callback(returnData);
                }
            });
		},
		columns: [
            {"title":"车身号","class":"center busNo","data":"bus_number","defaultContent": ""},
            {"title":"订单编号","class":"center order_no","data":"order_no","defaultContent": ""},
			{"title":"订单名称","class":"center","data":"order_name","defaultContent": ""},
			{"title":"订单配置","class":"center","data":"order_config_name","defaultContent": "","render":function(data,type,row,meta){ // margin-top:-2000px
				return row.print_sign=="未打印" ? "<select id='config_select_"+(meta.row + meta.settings._iDisplayStart + 1)+"'" +
						"onclick=getOrderConfigSelect_2(\'#config_select_"+(meta.row + meta.settings._iDisplayStart + 1)+"\',"+row.factory_id+",\'"+row.order_no+"\',\'"+data+"\') class='input-medium order_config_name'>" +
								"<option value='"+row.order_config_id+"' selected='selected' config_qty='"+row.allot_qty+"'>"+data+"</option></select>" :
									"<select disabled='disabled' id='config_select_"+(meta.row + meta.settings._iDisplayStart + 1)+"' class='input-medium order_config_name'>" +
								"<option value='"+row.order_config_id+"' selected='selected' config_qty='"+row.allot_qty+"'>"+data+"</option></select>";
	        }},
            {"title":"订单数量","class":"center order_qty","data":"order_qty","defaultContent": ""},
            {"title":"计划生产日期","class":"center","data":"plan_date","defaultContent": ""},
            {"title":"打印标记","class":"center","data":"print_sign","defaultContent": ""},
            {"title":"最近打印人","class":"center","data":"username","defaultContent": ""},
            {"title":"最近打印日期","class":"center","data":"print_date","defaultContent": ""},
            {"title":"打印次数","class":"center","data":"print_times","defaultContent": ""},
            {"title":"操作","class":"center","data":"","render":function(data,type,row){
            	return "<i class=\"glyphicon glyphicon-print bigger-130 btnPrint\" title=\"打印\" style='color:blue;cursor: pointer;'></i>" +
            			"<input type='hidden' class='factoryId' value="+row.factory_id+"><input type='hidden' class='orderId' value="+row.order_id+">"+
            			"<input type='hidden' class='bus_type_code' value="+row.bus_type_code+"><input type='hidden' class='customer' value="+row.customer+">";		            		
            	} 
            }
          ],
	});
}
//打印后更新打印信息
function ajaxUpdatePrint(busNoList,changedConfigId){
	var conditioins="{busNoList:'"+busNoList+"',changedConfigId:'"+changedConfigId+"'}";
	$.ajax({
		type : "get",// 使用get方法访问后台
		dataType : "json",// 返回json格式的数据
		url : "afterBusNoPrint",
		data : {
			"conditions" : conditioins
		},
		success:function(response){
			if(response.success){
				//alert("打印成功！");
				 setTimeout(function (){
					 ajaxQuery();				
					},1000);
			}
		}
	});
}
/**
 * 根据工厂、订单编号查询订单配置
 * 
 * @param parts
 * @returns {String}
 */
function getOrderConfigSelect_2(elementId, factoryId, orderNo, selectVal) {
	$.ajax({
		url : "getOrderConfigList",
		dataType : "json",
		data : {
			'search_order_no' : orderNo,
			'factory_id' : factoryId
		},
		async : false,
		error : function() {
		},
		success : function(response) {
			var strs = "";
			$(elementId).html("");
			$.each(response.data, function(index, value) {
				if (selectVal == value.id
						|| selectVal == value.order_config_name) {
					strs += "<option value=" + value.id
							+ " selected='selected'" + " config_qty="
							+ value.allot_qty + ">" + value.order_config_name
							+ "</option>";
				} else {
					strs += "<option value=" + value.id + " config_qty="
							+ value.allot_qty + ">" + value.order_config_name
							+ "</option>";
				}
			});
			$(elementId).append(strs);
		}
	})
}
