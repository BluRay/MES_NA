var pageSize=1;
var table;
var table_height = $(window).height()-340;
$(document).ready(function () {	
	initPage();
	
	function initPage(){
		getBusNumberSelect('#nav-search-input');
		getOrderNoSelect("#search_order_no","#orderId");
		ajaxQuery();
	}

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/BMS/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})
	
	$("#btnQuery").click(function(){
		ajaxQuery();
	});
	
});

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
				"order_no":$("#search_order_no").val(),
				"dispatchStart":$("#start_date").val(),
				"dispatchEnd":$("#end_date").val(),
				"orderColumn":"id"
			};
            param.length = data.length;					//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;					//开始的记录序号
            param.page = (data.start / data.length)+1;	//当前页码

            $.ajax({
                type: "post",
                url: "busDispatchQuery",
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
		            {"title":"生产订单","class":"center","data":"order_no","defaultContent": ""},	            
		            {"title":"订单描述","class":"center","data":"order_desc","defaultContent": ""},
		            {"title":"订单数量","class":"center","data":"order_qty","defaultContent": ""},
		            {"title":"计划发车数量","class":"center","data": "order_dispatch","defaultContent": ""},
		            {"title":"实际发车数量","class":"center","data": "order_done_qty","defaultContent": ""},                
		            {"title":"剩余数量","class":"center","data": "order_left","defaultContent": "-"},
		            {"title":"车辆详情","class":"center","data": null,"id":"staff_number",
		            	"render": function ( data, type, row ) {
		                    return "<i class=\"glyphicon glyphicon-zoom-in bigger-130 showbus\" title=\"车辆详情\" onclick='fun_dispatch(\""+row['order_no']+"\")' style='color:blue;cursor: pointer;'></i>&nbsp;&nbsp;";
		                },
		            }
		          ],
	});
	
}

function fun_dispatch(order_no){
	
	$("#patchModal").removeClass('hide').dialog({
		resizable: false,
		title: '<div class="widget-header"><h4 class="smaller"><i class="ace-icon fa fa-users green"></i> 车辆详情</h4></div>',
		title_html: true,
		width:'1000px',top:'200px',height:500,
		modal: true,
		buttons: [{
					text: "取消",
					"class" : "btn btn-minier",
					click: function() {$( this ).dialog( "close" );} 
				}
			]
	});
	
	$("#tableData2").dataTable({
		serverSide: true,paiging:true,ordering:false,searching: false,bAutoWidth:false,
		destroy: true,sScrollY: "310",scrollX: "100%",orderMulti:false,width:"1200px",height:500,
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
				"orderNo":order_no,
				"dispatchStart":'',
				"dispatchEnd":'',
				"orderColumn":"id"
			};
            param.length = data.length;					//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;					//开始的记录序号
            param.page = (data.start / data.length)+1;	//当前页码

            $.ajax({
                type: "post",
                url: "busDispatchDescQuery",
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
		            {"title":"VIN号","class":"center","data":"vin","defaultContent": ""},
		            {"title":"电机号","class":"center","data":"motor_number","defaultContent": ""},
		            {"title":"3C认证标贴","class":"center","data": "flag_3c","defaultContent": ""},
		            {"title":"随车附件清单","class":"center","data": "batch_desc","defaultContent": ""},                
		            {"title":"自编号","class":"center","data": "customer_number","defaultContent": "-"},             
		            {"title":"发车人","class":"center","data": "dispatcher","defaultContent": "-"},             
		            {"title":"接收人","class":"center","data": "receiver","defaultContent": "-"},             
		            {"title":"发车日期","class":"center","data": "dispatch_date","defaultContent": "-"}
		          ],
	});
}
