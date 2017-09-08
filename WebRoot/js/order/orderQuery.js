var cur_year="";
var pageSize=20;

$(document).ready(function(){
	initPage();
	
	$("#btnQuery").click(function () {
		/*$("#btnQuery").attr("disabled","disabled");*/
		/*eachSeries(scripts, getScript, initTable);*/
		ajaxQuery();
    });

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/BMS/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})

});

function initPage(){
	getBusNumberSelect('#nav-search-input');
	var cur_year = new Date().getFullYear();
	var factory_default=getQueryString("factory_id");
	$("#search_productive_year").val(cur_year);
	getOrderNoSelect("#search_order_no","#orderId");
	getFactorySelect("",factory_default,"#search_factory","全部","id")
	ajaxQuery();
	
}

function ajaxQuery(){
	/*$table.bootstrapTable('refresh', {url: 'getOrderDetailList'});
	$("#btnQuery").removeAttr("disabled");*/

	var tb=$("#tableOrder").DataTable({
		serverSide: true,
		fixedColumns:   {
            leftColumns: 0,
            rightColumns:2
        },
		dom: 'Bfrtip',
		lengthMenu: [
		             [ 20, 50,100, -1 ],
		             [ '显示20行', '显示50行', '显示100行', '全部' ]
		         ],
	    buttons: [
	        {extend:'excelHtml5',title:'data_export',className:'black',text:'<i class=\"fa fa-file-excel-o bigger-130\" tooltip=\"导出excel\"></i>'},
	        {extend:'colvis',text:'<i class=\"fa fa-list bigger-130\" tooltip=\"选择展示列\"></i>'},
	        {extend:'pageLength',/*text:'显示行'*/}
	       
	    ],
        rowsGroup:[0,1,2,3,4,5,6],
		paiging:true,
		ordering:false,
		searching: false,
		bAutoWidth:false,
		destroy: true,
		sScrollY: $(window).height()-250,
		scrollX: true,
		/*scrollCollapse: true,*/
		pageLength: pageSize,
		pagingType:"full_numbers",
		lengthChange:true,
		orderMulti:false,
		language: {
			emptyTable:"抱歉，未查询到数据！",
			info:"共计 _TOTAL_ 条，当前第 _PAGE_ 页 共 _PAGES_ 页",
			lengthMenu:"显示 _MENU_ 行",
			infoEmpty:"",
			paginate: {
			  first:"首页",
		      previous: "上一页",
		      next:"下一页",
		      last:"尾页",
		      loadingRecords: "请稍等,加载中...",		     
			}
		},
		ajax:function (data, callback, settings) {
			$(".divLoading").addClass("fade in").show();
			var param ={
				"draw":1,
				"order_no":$("#search_order_no").val(),
				"factory":getAllFromOptions("#search_factory","val"),
				"actYear":$("#search_productive_year").val(),
				"status":$("#search_status").val()
			};
            param.length = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;//开始的记录序号
            param.page = (data.start / data.length)+1;//当前页码

            $.ajax({
                type: "post",
                url: "getOrderDetailList",
                cache: false,  //禁用缓存
                data: param,  //传入组装的参数
                dataType: "json",
                success: function (result) {
                    //console.log(result);
                	//封装返回数据
                    var returnData = {};
                    returnData.draw = data.draw;//这里直接自行返回了draw计数器,应该由后台返回
                    returnData.recordsTotal = result.recordsTotal;//返回数据全部记录
                    returnData.recordsFiltered = result.recordsTotal;//后台不实现过滤功能，每次查询均视作全部结果
                    returnData.data = result.data;//返回的数据列表
                    //console.log(returnData);
                    //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                    //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                    callback(returnData);
                    var head_width=$(".dataTables_scrollHead").width();
                    //alert(head_width)
                    $(".dataTables_scrollHead").css("width",head_width-20);
                    
                    $(".divLoading").hide();
                }
            });
		
		},
		columns: [
		            {"title":"订单","width":"230","class":"center","data":"order_desc","defaultContent": ""},
		            {"title":"订单类型","class":"center","data":"order_type","defaultContent": ""},
		            {"title":"订单区域","class":"center","data":"order_area","defaultContent": ""},
		            {"title":"订单交期","class":"center","data":"delivery_date","defaultContent": ""},
		            {"title":"客户","class":"center","data":"customer","defaultContent":""},
		            {"title":"生产工厂","class":"center","data": "factory_name","defaultContent": ""},
		            {"title":"生产数量","class":"center","data":"production_qty","defaultContent": ""},		            
		            {"title":"配置","class":"center","data":"order_config_name","defaultContent": ""},		            
		            {"title":"配置数量","class":"center","data": "config_qty","defaultContent": ""},		            
		            {"title":"生产顺序","class":"center","data":"sequence","defaultContent": ""},
		            
		            {"title":"自制件下线","class":"center","data":"zzj_offline_count","defaultContent": ""},
		            {"title":"部件上线","class":"center","data":"parts_online_count","defaultContent": ""},
		            {"title":"部件下线","class":"center","data":"parts_offline_count","defaultContent": ""},
		            {"title":"焊装上线","class":"center","data": "welding_online_count","defaultContent": ""},
		            {"title":"焊装下线","class":"center","data":"welding_offline_count","defaultContent": ""},		            
		            {"title":"涂装上线","class":"center","data":"painting_online_count","defaultContent": ""},		            
		            {"title":"涂装下线","class":"center","data": "painting_offline_count","defaultContent": ""},
		            {"title":"底盘上线","class":"center","data":"chassis_online_count","defaultContent":""},
		            {"title":"底盘下线","class":"center","data":"chassis_offline_count","defaultContent": ""},
		            
		            {"title":"总装上线","class":"center","data": "assembly_online_count","defaultContent": ""},
		            {"title":"总装下线","class":"center","data":"assembly_offline_count","defaultContent": ""},		            
		            {"title":"入库","class":"center","data":"warehousing_count","defaultContent": ""},		            
		            {"title":"发车","class":"center","data": "dispatch_count","defaultContent": ""},
		            {"title":"车辆详情","class":"center","data":"","defaultContent":"","render":function(data,type,row){
		            	return "<i class=\"ace-icon fa fa-search bigger-130 editorder\" onclick = 'ajaxShowBusNumber(" + row.id+ ","+row.factory_id+","+row.order_config_id+");' style='color:blue;cursor: pointer;'></i>";
		            }},
		            
		            {"title":"评审结果",width:'80',"class":"center","data":"review_result","render":function(data,type,row){
		            	return data=="2"?"已评审":(data=="1"?"评审中":"未评审")},"defaultContent":""
		            },
		            ],
	});
	$("#tableOrder_info").addClass('col-xs-6');
	$("#tableOrder_paginate").addClass('col-xs-6');
	$(".dt-buttons").css("margin-top","-50px").find("a").css("border","0px");
}



//----------START bootstrap initTable ----------
function initTable() {
	var columns=[
		         [
		            {
		            	field: 'order_desc',title: '订单',align: 'center',width:'250',valign: 'middle',align: 'center',
		                sortable: false,visible: true,footerFormatter: totalTextFormatter,
		                cellStyle:function cellStyle(value, row, index, field) {
			        	return {css: {"padding-left": "3px", "padding-right": "2px","font-size":"12px"}};
			        	}
		            },{
		            	field: 'order_type',title: '订单类型',align: 'center',width:'90',valign: 'middle',align: 'center',
		                sortable: false,visible: true,footerFormatter: totalTextFormatter,
		                cellStyle:function cellStyle(value, row, index, field) {
		    	        	return {css: {"padding-left": "2px", "padding-right": "2px","font-size":"12px"}};
		    	        	}
		            },{
		            	field: 'delivery_date',title: '订单交期',align: 'center',width:'100',valign: 'middle',align: 'center',
		                sortable: false,visible: true,footerFormatter: totalTextFormatter,
		                cellStyle:function cellStyle(value, row, index, field) {
		    	        	return {css: {"padding-left": "2px", "padding-right": "2px","font-size":"12px"}};
		    	        	}
		            },{
		            	field: 'factory_name',title: '生产工厂',align: 'center',width:'150',valign: 'middle',align: 'center',
		                sortable: false,visible: true,footerFormatter: totalTextFormatter,
		                cellStyle:function cellStyle(value, row, index, field) {
		    	        	return {css: {"padding-left": "2px", "padding-right": "2px","font-size":"12px"}};
		    	        	},
		    	      
		            },{
		            	field: 'production_qty',title: '生产<br/>数量',align: 'center',width:'60',valign: 'middle',align: 'center',
		                sortable: false,visible: true,footerFormatter: totalTextFormatter,
		                cellStyle:function cellStyle(value, row, index, field) {
		    	        	return {css: {"padding-left": "2px", "padding-right": "2px","font-size":"12px"}};
		    	        	}
		            },{
		            	field: 'order_config_name',title: '配置',align: 'center',width:'150',valign: 'middle',align: 'center',
		                sortable: false,visible: true,footerFormatter: totalTextFormatter,
		                cellStyle:function cellStyle(value, row, index, field) {
		    	        	return {css: {"padding-left": "2px", "padding-right": "2px","font-size":"12px"}};
		    	        	}
		            },{
		            	field: 'config_qty',title: '配置<br/>数量',align: 'center',width:'60',valign: 'middle',align: 'center',
		                sortable: false,visible: true,footerFormatter: totalTextFormatter,
		                cellStyle:function cellStyle(value, row, index, field) {
		    	        	return {css: {"padding-left": "2px", "padding-right": "2px","font-size":"12px"}};
		    	        	}
		            },{
		            	field: 'customer',title: '客户',align: 'center',width:'150',valign: 'middle',align: 'center',
		                sortable: false,visible: true,footerFormatter: totalTextFormatter,
		                cellStyle:function cellStyle(value, row, index, field) {
		    	        	return {css: {"padding-left": "2px", "padding-right": "2px","font-size":"12px"}};
		    	        	}
		            },{
		            	field: 'sequence',title: '生产<br/>顺序',align: 'center',width:'60',valign: 'middle',align: 'center',
		                sortable: false,visible: true,footerFormatter: totalTextFormatter,
		                cellStyle:function cellStyle(value, row, index, field) {
		    	        	return {css: {"padding-left": "2px", "padding-right": "2px","font-size":"12px"}};
		    	        	}
		            },{
		            	field: 'zzj_offline_count',title: '自制件<br/>下线',align: 'center',width:'80',valign: 'middle',align: 'center',
		                sortable: false,visible: true,footerFormatter: totalTextFormatter,
		                cellStyle:function cellStyle(value, row, index, field) {
		    	        	return {css: {"padding-left": "2px", "padding-right": "2px","font-size":"12px"}};
		    	        	}
		            },{
		            	field: 'parts_online_count',title: '部件<br/>上线',align: 'center',width:'80',valign: 'middle',align: 'center',
		                sortable: false,visible: true,footerFormatter: totalTextFormatter,
		                cellStyle:function cellStyle(value, row, index, field) {
		    	        	return {css: {"padding-left": "2px", "padding-right": "2px","font-size":"12px"}};
		    	        	}
		            },{
		            	field: 'parts_offline_count',title: '部件<br/>下线',align: 'center',width:'80',valign: 'middle',align: 'center',
		                sortable: false,visible: true,footerFormatter: totalTextFormatter,
		                cellStyle:function cellStyle(value, row, index, field) {
		    	        	return {css: {"padding-left": "2px", "padding-right": "2px","font-size":"12px"}};
		    	        	}
		            },{
		            	field: 'welding_online_count',title: '焊装<br/>上线',align: 'center',width:'80',valign: 'middle',align: 'center',
		                sortable: false,visible: true,footerFormatter: totalTextFormatter,
		                cellStyle:function cellStyle(value, row, index, field) {
		    	        	return {css: {"padding-left": "2px", "padding-right": "2px","font-size":"12px"}};
		    	        	}
		            },{
		            	field: 'welding_offline_count',title: '焊装<br/>下线',align: 'center',width:'80',valign: 'middle',align: 'center',
		                sortable: false,visible: true,footerFormatter: totalTextFormatter,
		                cellStyle:function cellStyle(value, row, index, field) {
		    	        	return {css: {"padding-left": "2px", "padding-right": "2px","font-size":"12px"}};
		    	        	}
		            },{
		            	field: 'painting_online_count',title: '涂装<br/>上线',align: 'center',width:'80',valign: 'middle',align: 'center',
		                sortable: false,visible: true,footerFormatter: totalTextFormatter,
		                cellStyle:function cellStyle(value, row, index, field) {
		    	        	return {css: {"padding-left": "2px", "padding-right": "2px","font-size":"12px"}};
		    	        	}
		            },{
		            	field: 'painting_offline_count',title: '涂装<br/>下线',align: 'center',width:'80',valign: 'middle',align: 'center',
		                sortable: false,visible: true,footerFormatter: totalTextFormatter,
		                cellStyle:function cellStyle(value, row, index, field) {
		    	        	return {css: {"padding-left": "2px", "padding-right": "2px","font-size":"12px"}};
		    	        	}
		            },{
		            	field: 'chassis_online_count',title: '底盘<br/>上线',align: 'center',width:'80',valign: 'middle',align: 'center',
		                sortable: false,visible: true,footerFormatter: totalTextFormatter,
		                cellStyle:function cellStyle(value, row, index, field) {
		    	        	return {css: {"padding-left": "2px", "padding-right": "2px","font-size":"12px"}};
		    	        	}
		            },{
		            	field: 'chassis_offline_count',title: '底盘<br/>下线',align: 'center',width:'80',valign: 'middle',align: 'center',
		                sortable: false,visible: true,footerFormatter: totalTextFormatter,
		                cellStyle:function cellStyle(value, row, index, field) {
		    	        	return {css: {"padding-left": "2px", "padding-right": "2px","font-size":"12px"}};
		    	        	}
		            },{
		            	field: 'assembly_online_count',title: '总装<br/>上线',align: 'center',width:'80',valign: 'middle',align: 'center',
		                sortable: false,visible: true,footerFormatter: totalTextFormatter,
		                cellStyle:function cellStyle(value, row, index, field) {
		    	        	return {css: {"padding-left": "2px", "padding-right": "2px","font-size":"12px"}};
		    	        	}
		            },{
		            	field: 'assembly_offline_count',title: '总装<br/>下线',align: 'center',width:'80',valign: 'middle',align: 'center',
		                sortable: false,visible: true,footerFormatter: totalTextFormatter,
		                cellStyle:function cellStyle(value, row, index, field) {
		    	        	return {css: {"padding-left": "2px", "padding-right": "2px","font-size":"12px"}};
		    	        	}
		            },{
		            	field: 'warehousing_count',title: '入库',align: 'center',width:'80',valign: 'middle',align: 'center',
		                sortable: false,visible: true,footerFormatter: totalTextFormatter,
		                cellStyle:function cellStyle(value, row, index, field) {
		    	        	return {css: {"padding-left": "2px", "padding-right": "2px","font-size":"12px"}};
		    	        	}
		            },{
		            	field: 'dispatch_count',title: '发车',align: 'center',width:'80',valign: 'middle',align: 'center',
		                sortable: false,visible: true,footerFormatter: totalTextFormatter,
		                cellStyle:function cellStyle(value, row, index, field) {
		    	        	return {css: {"padding-left": "2px", "padding-right": "2px","font-size":"12px"}};
		    	        	}
		            },{
		            	field: '',title: '车辆<br/>详情',align: 'center',width:'80',valign: 'middle',align: 'center',
		                sortable: false,visible: true,footerFormatter: totalTextFormatter,
		                cellStyle:function cellStyle(value, row, index, field) {
		    	        	return {css: {"padding-left": "2px", "padding-right": "2px","font-size":"12px"}};
		    	        },
		    	        formatter:function(value,row,index){
		    	        		return "<i class=\"ace-icon fa fa-search bigger-130 editorder\" onclick = 'ajaxShowBusNumber(" + row.id+ ","+row.factory_id+","+row.order_config_id+");' style='color:blue;cursor: pointer;'></i>";
		    	        }
		            },{
		            	field: '',title: '评审<br/>结果',align: 'center',width:'80',valign: 'middle',align: 'center',
		                sortable: false,visible: true,footerFormatter: totalTextFormatter,
		                cellStyle:function cellStyle(value, row, index, field) {
		    	        	return {css: {"padding-left": "2px", "padding-right": "2px","font-size":"12px"}};
		    	        	}
		            }
		        ]
		    ];
	
    $table.bootstrapTable({
        height: getHeight(),
        width:'1500px',
        url:"getOrderDetailList",
        striped:true,
        paginationVAlign:'bottom',
        searchOnEnterKey:true,
        fixedColumns: false,			//冻结列
        fixedNumber: 0,				//冻结列数
        sidePagination : "client",
        responseHandler: function(res){
             return res.rows;
        },
        queryParams:function() {
        	
        	var conditions={};
        	conditions.order_no=$("#search_order_no").val();
        	conditions.factory=/*$("#search_factory").val();*/getAllFromOptions("#search_factory","val")
        	conditions.actYear=$("#search_productive_year").val();
        	conditions.status=$("#search_status").val();        
/*        	params["conditions"] = JSON.stringify(conditions); */
        	return conditions;
        },
        columns: columns
    });
    
    
/*    $(window).resize(function () {
        $table.bootstrapTable('resetView', {height:getHeight()});
    });*/
    
    
    $table.on('load-success.bs.table',function(){
    	$("#btnQuery").removeAttr("disabled");
    });
    $table.on('page-change.bs.table',function(){
    	//$("#btnQuery").attr("disabled","disabled");
    });
/*    $(window).resize(function () {
        $table.bootstrapTable('resetView', {height: getHeight()});
    });*/
}
//----------END bootstrap initTable ----------
function ajaxShowBusNumber(order_id,factory_id,order_config_id){
	$.ajax({
		url: "/BMS/order/showBusNumber",
		dataType: "json",
		data: {"order_id" : order_id,"factory_id":factory_id,"order_config_id":order_config_id},
		async: false,
		error: function () {alertError();},
		success: function (response) {
			var dialog = $( "#dialog-message" ).removeClass('hide').dialog({
				width:1000,
				height:500,
				modal: true,
				title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i> 车辆明细</h4></div>",
				title_html: true,
				buttons: [ 
					{
						text: "取消",
						"class" : "btn btn-minier",
						click: function() {
							$( this ).dialog( "close" ); 
						} 
					},
					{
						text: "确定",
						"class" : "btn btn-primary btn-minier",
						click: function() {
							$( this ).dialog( "close" ); 
						} 
					}
				]
			});
			if(response.success){
				drawBusInfoTable(response.data)
			} else {
				alert(response.message);
			}
		}
	})
}

function drawBusInfoTable(data){

	var t=$("#tableBusNumber").dataTable({
		paiging:false,
		showRowNumber:true,
		ordering:false,
		searching: false,
		autoWidth:false,
		destroy: true,
		paginate:false,
		fixedColumns: {
            leftColumns:1,
            rightColumns:1
        },
/*		sScrollY: $("#dialog-message").height()-30,
		scrollX: true,*/
/*		createdRow: function ( row, data, index ) {
			//alert(index)
			 $('td', row).	eq(1).find("input").data("allot_config_id",data.allot_config_id||0);
			 $('td', row).	eq(1).find("input").data("order_config_id",data.order_config_id);
        },*/
		scrollCollapse: false,
		lengthChange:false,
		orderMulti:false,
		info:false,
		language: {
			emptyTable:"",					     
			infoEmpty:"",
			zeroRecords:"未查询到车辆信息！"
		},
		data:data,
		columns: [
		            {"title":"车号","class":"center","data":"bus_number","defaultContent": ""},
		            {"title":"VIN","class":"center","data":"vin","defaultContent": ""},
		            {"title":"生产工厂","class":"center","data":"factory_name","defaultContent": ""},
		            {"title":"当前车间","class":"center","data":"workshop","defaultContent": ""},
		            {"title":"当前工序","width":"200","class":"center","data":"process_name","defaultContent": ""},
		            {"title":"焊装上线","class":"center","data":"welding_online_date","defaultContent": ""},
		            {"title":"焊装下线","class":"center","data":"welding_offline_date","defaultContent": ""},
		            {"title":"涂装上线","class":"center","data":"painting_online_date","defaultContent": ""},
		            {"title":"涂装下线","class":"center","data":"painting_offline_date","defaultContent": ""},
		            {"title":"底盘上线","class":"center","data":"chassis_online_date","defaultContent": ""},
		            {"title":"底盘下线","class":"center","data":"chassis_offline_date","defaultContent": ""},
		            {"title":"总装上线","class":"center","data":"assembly_online_date","defaultContent": ""},
		            {"title":"总装下线","class":"center","data":"assembly_offline_date","defaultContent": ""},
		            {"title":"入库","class":"center","data":"warehousing_date","defaultContent": ""},
		            {"title":"发车","class":"center","data":"dispatch_date","defaultContent": ""}
		          ]	      
	});
}
