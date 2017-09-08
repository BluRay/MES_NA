var pageSize=1;
var table;
var select_str = "";
var select_str1 = "";
var select_str2 = "";
var cur_year="";
var original = "";
var reduce_series_list=new Array();
var max_num = 0;		var sum_num = 0;
var edit_max_num = 0;	var edit_sum_num = 0;
var del_order_list=new Array();
var dt;
/*$.extend( true, $.fn.dataTable.defaults, {
    "searching": false,
    "ordering": false,
    "rowsGroup":[0,1,2,3,4,5]
} );*/
$(document).ready(function(){
	getBusNumberSelect('#nav-search-input');
	cur_year = new Date().getFullYear();
	$("#search_productive_year").val(cur_year);
	/*cur_year = new Date().getFullYear();
	$("#search_productive_year").html('<option value="'+cur_year+'">'+cur_year+'</option><option value="'+(cur_year-1)+'">'+(cur_year-1)+'</option><option value="'+(cur_year+1)+'">'+(cur_year+1)+'</option><option value="'+(cur_year+2)+'">'+(cur_year+2)+'</option>');	
	$("#new_productive_year").html('<option value="'+cur_year+'">'+cur_year+'</option><option value="'+(cur_year-1)+'">'+(cur_year-1)+'</option><option value="'+(cur_year+1)+'">'+(cur_year+1)+'</option><option value="'+(cur_year+2)+'">'+(cur_year+2)+'</option>');	
	$("#edit_productive_year").html('<option value="'+cur_year+'">'+cur_year+'</option><option value="'+(cur_year-1)+'">'+(cur_year-1)+'</option><option value="'+(cur_year+1)+'">'+(cur_year+1)+'</option><option value="'+(cur_year+2)+'">'+(cur_year+2)+'</option>');	*/
	getOrderNoSelect("#search_order_no","#orderId");
	getFactorySelect();
	getBusType();
	ajaxQuery();
	//获取订单类型下拉列表
	getKeysSelect("ORDER_TYPE", "标准订单", "#newOrderType","请选择","keyName");
	getKeysSelect("ORDER_AREA", "订单区域", "#newOrderArea","请选择","keyName");
	
	$(".btnQuery").on("click",function(){
		ajaxQuery();
	}); 

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/BMS/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})
	
	$(document).on("click","#btnAdd",function(){
		$("#dialog-order_new").data("bus_num_start","");
		$("#new_factoryOrder_parameters").html("");
		//$("#dialog-order_new").modal("show");
		//获取cur_year下的最新流水起始号（最大流水号+1）
		var bus_num_start=getLatestSeris(cur_year);
		$("#dialog-order_new").data("bus_num_start",bus_num_start);
		$("#newPlanAmount").focus();
		
		var dialog = $( "#dialog-order_new" ).removeClass('hide').dialog({
			width:600,
			height:500,
			modal: true,
			title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i>订单新增</h4></div>",
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
						ajaxAdd();
						//$( this ).dialog( "close" ); 
					} 
				}
			]
		});
	});

	
	$(document).on("click",".close.add",function(e){
		prod_year=$("#new_productive_year").val();
		$(e.target).closest("tr").remove();		
		//var latest_num_start=Number($("#newModal").data("bus_num_start"));
		//获取cur_year下的最新流水起始号（最大流水号+1）
		var order_type=$("#newOrderType").val();
		var latest_num_start=0;
		if(order_type !='KD件'){
			latest_num_start=getLatestSeris(prod_year);
		}
		$("#dialog-order_new").data("bus_num_start",latest_num_start);
		//alert(latest_num_start);
		//更新流水号
		var maxOrderNo = latest_num_start;	
		var factoryOrder_parameters=$("#new_factoryOrder_parameters").find("tr");
		$.each(factoryOrder_parameters,function(index,param){
			var tds=$(param).children("td");
			$(tds[3]).find("input").val(maxOrderNo);
			$(tds[4]).find("input").val(Number(maxOrderNo) + Number($(tds[2]).find("input").val()) - 1);
			maxOrderNo = Number(maxOrderNo) + Number($(tds[2]).find("input").val());
		});
	});
	
	$(document).on("click",".close.edit",function(e){
		var order_type=$("#editOrderType").val();
		var tr=$(e.target).closest("tr");
		if(order_type !='KD件'){
			/**判断该工厂订单下是否已经产生了车号，是则不能删除
			 */
			if($(tr).data("min_busnum")!='0'&&$(tr).data("min_busnum")!=undefined){
				alert("该工厂订单下已生成了车号，不能删除！");
			}else /*if($(tr).data("production_qty")==undefined)*/{//新增的产地分配，删除后，合并剩余可用流水段列表;//已存在的产地分配，删除后，合并剩余可用流水段列表
				var series={};
				series.num_start=$(tr).find("td").eq(3).find("input").val();
				series.num_end=$(tr).find("td").eq(4).find("input").val();
				mergeReduceSeriesList(series);
				if($(tr).data("factory_order_id")!=undefined){
					var obj={};
					obj.factory_order_id=$(tr).data("factory_order_id");
					//obj.order_detail_id=$(tr).data("order_detail_id");
					obj.production_qty=$(tr).data("production_qty");
					del_order_list.push(obj);
				}
				$(tr).remove();	
			}
		}else{
			if($(tr).data("factory_order_id")!=undefined){
				var obj={};
				obj.factory_order_id=$(tr).data("factory_order_id");
				//obj.order_detail_id=$(tr).data("order_detail_id");
				obj.production_qty=$(tr).data("production_qty");
				del_order_list.push(obj);
			}
			$(tr).remove();	
			var maxOrderNo = 0;	
			var factoryOrder_parameters=$("#edit_factoryOrder_parameters").find("tr");
			$.each(factoryOrder_parameters,function(index,param){
				var tds=$(param).children("td");
				$(tds[3]).find("input").val(maxOrderNo);
				$(tds[4]).find("input").val(Number(maxOrderNo) + Number($(tds[2]).find("input").val()) - 1);
				maxOrderNo = Number(maxOrderNo) + Number($(tds[2]).find("input").val());
			});
		}
		
		
	});
	
	$(document).on("keyup",".busNum",function(e){
		//校验数据：总数及流水最大值需等于订单总数
		max_num = 0;		sum_num = 0;
		edit_max_num = 0;	edit_sum_num = 0;
		var factoryOrder_parameters=$("#new_factoryOrder_parameters").find("tr");
		$.each(factoryOrder_parameters,function(index,param){
			var tds=$(param).children("td");
			$(tds[2]).find("input").val($(tds[4]).find("input").val() - $(tds[3]).find("input").val() + 1);
			if (parseInt($(tds[4]).find("input").val()) > parseInt(max_num)) max_num = $(tds[4]).find("input").val();
			sum_num += parseInt($(tds[2]).find("input").val());
		})
		var edit_factoryOrder_parameters=$("#edit_factoryOrder_parameters").find("tr");
		$.each(edit_factoryOrder_parameters,function(index,param){
			var tds=$(param).children("td");
			$(tds[2]).find("input").val($(tds[4]).find("input").val() - $(tds[3]).find("input").val() + 1);
			if (parseInt($(tds[4]).find("input").val()) > parseInt(edit_max_num)) edit_max_num = $(tds[4]).find("input").val();
			edit_sum_num += parseInt($(tds[2]).find("input").val());
		})
		//$("#memo").val(sum_num);
	});
	
	$(document).on("keyup",".orderNum.add",function(e){
		//alert($(e.target).val());
		prod_year=$("#new_productive_year").val();
		//获取cur_year下的最新流水起始号（最大流水号+1）
		var order_type=$("#newOrderType").val();
		var latest_num_start=0;
		if(order_type !='KD件'){
			latest_num_start=getLatestSeris(prod_year);
		}		
		//alert(latest_num_start);
		$("#dialog-order_new").data("bus_num_start",latest_num_start);
		//更新流水号
		var maxOrderNo = latest_num_start;	
		//alert(maxOrderNo);
		var factoryOrder_parameters=$("#new_factoryOrder_parameters").find("tr");
		$.each(factoryOrder_parameters,function(index,param){
			var tds=$(param).children("td");
			$(tds[3]).find("input").val(maxOrderNo);
			$(tds[4]).find("input").val(Number(maxOrderNo) + Number($(tds[2]).find("input").val()) - 1);
			maxOrderNo = Number(maxOrderNo) + Number($(tds[2]).find("input").val());
		});

	});
	
	$(document).on("change",".orderNum.edit",function(e){
		var order_type=$("#editOrderType").val();
		if(order_type !='KD件'){
			var tr=$(e.target).closest("tr");
			var production_qty=parseInt($(e.target).attr("old_value"))||0;
			var cur_factory=$(tr).find("td").eq(1).find("select").val();
			var minbusnum=$(tr).data("min_busnum")||0;
			var maxbusnum=$(tr).data("max_busnum")||0;
			var tr_next=$(tr).next();
			var tr_busnum_start=parseInt($(tr).find("td").eq(3).find("input").val());
			var tr_busnum_end=parseInt($(tr).find("td").eq(4).find("input").val());
			var reduce_num=production_qty-parseInt($(e.target).val());
			var factoryOrder_parameters=$("#edit_factoryOrder_parameters").find("tr");
			var totleNum = $("#edit_order_qty").val();
			var factoryNum = 0;			   
			$.each(factoryOrder_parameters,function(index,param){
				  var tds=$(param).children("td");
				  factoryNum += Number($(tds[2]).find("input").val());
			})
			var addflg=false;
			if(factoryNum<=totleNum){
				addflg=true;
			}
			if(!addflg){
				alert("产地分配数量之和不能超过订单总数量！");
				$(this).val(production_qty);
				/*$(tr).find("td").eq(3).find("input").val(0);
				$(tr).find("td").eq(4).find("input").val(0);
				reduce_num=0;*/
				return false;
			}
			/**
			 * 产地分配数量不能改大，要增加数量只能新加一行相同产地的分配数据，如果reduce_series_list（剩余流水段）中
			 * 有流水可用，则从reduce_series_list中取，不够再提示不够，然后重新计算，计算后得到的流水起始号如果和
			 * 该工厂订单的流水号是接续的则在保存时合成一条工厂订单数据
			 */
			if(reduce_num<0&&addflg){
				//alert($(e.target).attr("old_value"))
			   var rise_num=0-reduce_num;
			   if($(e.target).attr("old_value")=='0'||$(e.target).attr("old_value")==undefined){//新增的产地分配，从reduce_series_list中取，没有可用流水则重新计算
				   if(reduce_series_list.length>0){//有空余流水可用使用
						//$.each(reduce_series_list,function(i,series){
							//var rise_num=parseInt($(e.target).val())-production_qty;
							var series=getMatchSeries(rise_num);
							if(series.message=="超出"){//数量不够，提示是否使用空余流水段，从reduce_series_list中删除该段流水
								if(confirm("目前有空余流水段："+series.num_start+"-"+series.num_end+"可用使用，是否使用？")){
									$(e.target).val(production_qty+series.num_end-series.num_start+1);
									$(tr).find("td").eq(3).find("input").val(series.num_start);
									$(tr).find("td").eq(4).find("input").val(series.num_end);
									reduce_series_list.splice(series.index,1);
								}else{
									$(e.target).val(production_qty);
								}
							}else if(series.message=="相等"){//数量相等，使用空余流水段，从reduce_series_list中删除该段流水
								$(e.target).val(production_qty+series.num_end-series.num_start+1);
								$(tr).find("td").eq(3).find("input").val(series.num_start);
								$(tr).find("td").eq(4).find("input").val(series.num_end);
								reduce_series_list.splice(series.index,1);
							}else{//数量小于空余流水，使用空余流水段，修改reduce_series_list中该段流水
								$(tr).find("td").eq(3).find("input").val(series.num_start);
								$(tr).find("td").eq(4).find("input").val(series.num_end);
								reduce_series_list[series.index].num_end=series.num_end-rise_num;
							}
						//})				
					}else{
						//获取cur_year下的最新流水起始号（最大流水号+1）
						var latest_num_start=getLatestSeris($("#edit_productive_year").val());
						$(tr).find("td").eq(3).find("input").val(latest_num_start);
						$(tr).find("td").eq(4).find("input").val(parseInt(latest_num_start)+parseInt($(e.target).val())-1);	
					}
			   }else{
				   if(addflg){
					   $(e.target).val(production_qty);
					   alert("请增加一行产地分配,或者删除该行重新分配！"); 
				   }			   
			   }
			   
			}
			/**
			 * 产地分配数量减少：
			 * （1）如果该工厂订单下未生成车号，可以直接改小，结束流水相应减小;
			 * （2）如果该工厂订单下已经生成了车号，且最大车号流水在需要减少的流水范围内，则可以减，否则不允许减少，且提示只能减少正确的数量
			 *	{如果后面一个工厂订单未生成车号，且流水起始号是和该工厂订单流水接续的，则后面这个工厂订单的流水相应的往前移	}
			 */
			else{
				if(minbusnum=='0'){//无车号产生时，直接减少流水，将减少的流水段添加到剩余流水段列表中
					$(tr).find("td").eq(4).find("input").val(tr_busnum_end-reduce_num);
					/**
					 * 分配数量减少后，把剩下的流水段记下，给本订单新增的产地分配使用，以免流水浪费
					 */
					var series_reduce={};
					series_reduce.num_start=(tr_busnum_end-reduce_num+1);
					series_reduce.num_end=tr_busnum_end;	
					mergeReduceSeriesList(series_reduce);//往剩余流水段列表中增加流水段
				}else{
					if(parseInt(maxbusnum)>=tr_busnum_end){
						alert("该段流水已全部生成车号，工厂分配数量不能减少！");
						$(e.target).val(production_qty);
						reduce_num=0;
						return false;
					}else{
						reduce_num=tr_busnum_end-parseInt(maxbusnum);
						if((production_qty-parseInt($(e.target).val()))<=reduce_num){
							reduce_num=production_qty-parseInt($(this).val());
							/**
							 * 分配数量减少后，把剩下的流水段记下，给本订单新增的产地分配使用，以免流水浪费
							 */
							var series_reduce={};
							series_reduce.num_start=(tr_busnum_end-reduce_num+1);
							series_reduce.num_end=tr_busnum_end;							
							mergeReduceSeriesList(series_reduce);//往剩余流水段列表中增加流水段					
							$(tr).find("td").eq(4).find("input").val(tr_busnum_end-reduce_num);
						}else{							
							if(confirm("该段流水已生成部分车号，工厂分配数量最多可以减少"+reduce_num+"。是否确认减少？")){
								//$(tr).find("td").eq(3).find("input").val(production_qty-parseInt($(this).val()));
								$(e.target).val(production_qty-reduce_num)
								$(tr).find("td").eq(4).find("input").val(tr_busnum_end-reduce_num);
								/**
								 * 分配数量减少后，把剩下的流水段记下，给本订单新增的产地分配使用，以免流水浪费
								 */
								var series_reduce={};
								series_reduce.num_start=(tr_busnum_end-reduce_num+1);
								series_reduce.num_end=tr_busnum_end;							
								mergeReduceSeriesList(series_reduce);//往剩余流水段列表中增加流水段	
							}else{
								reduce_num=0;
								$(e.target).val(production_qty);
								return false;
							}
						}					
					}
				}
			}
			
			$(e.target).attr("old_value",$(e.target).val())			
		}else{
			var maxOrderNo = 0;	
			var factoryOrder_parameters=$("#edit_factoryOrder_parameters").find("tr");
			$.each(factoryOrder_parameters,function(index,param){
				var tds=$(param).children("td");
				$(tds[3]).find("input").val(maxOrderNo);
				$(tds[4]).find("input").val(Number(maxOrderNo) + Number($(tds[2]).find("input").val()) - 1);
				maxOrderNo = Number(maxOrderNo) + Number($(tds[2]).find("input").val());
			});
		}
		
	});
	
	
	$("#editFactoryOrder").click( function (argument) {
		//alert("123");
		var paramHtml="<tr><td><button type=\"button\" class=\"close edit\" aria-label=\"Close\" ><span aria-hidden=\"true\">&times;</span></button></td>" +
		//"<td>" + select_str1 + "<option value='"+ value.factory_id + "'> "+ value.factory_name + "</option>" + select_str2 + "</td>" +
		"<td>" + select_str + "</td>" +
		"<td><input type='text' style='width:60px'  class='input-small orderNum edit' value='0' id='production_qty2'/></td>" +
		"<td><input type='text' style='width:60px' disabled='disabled' class='input-small busNum' value='0' id='busnum_start2'/></td>" +
		"<td><input type='text' style='width:60px' disabled='disabled' class='input-small busNum' value='0' id='busnum_end2'/></td>" +
		"<td><input type='text' style='width:60px;display:none' class='input-small' value='0' id='minbusnum'/></td>" +
		"<td><input type='text' style='width:60px;display:none' class='input-small' value='0' id='maxbusnum'/></td>" +
		"</tr>";
		$(paramHtml).appendTo("#edit_factoryOrder_parameters");
		
		return false;
	});

	$("#newFactoryOrder").click( function (argument) {
		var paramHtml="<tr><td><button type=\"button\" class=\"close add\" aria-label=\"Close\" ><span aria-hidden=\"true\">&times;</span></button></td>" +
		"<td>" + select_str + "</td>" +
		"<td><input type='text' style='width:60px'  class='input-small orderNum add' value='0' id='production_qty1'/></td>" +
		"<td><input type='text' style='width:60px' class='input-small busNum' disabled='disabled' value='0' id='busnum_start1'/></td>" +
		"<td><input type='text' style='width:60px' class='input-small busNum' disabled='disabled' value='0' id='busnum_end1'/></td>" +
		"</tr>";
		$(paramHtml).appendTo("#new_factoryOrder_parameters");
		
		return false;
	});
	
	/**
	 * 改变生产年份后重新获取起始流水号，重新分配
	 */
/*	$(document).on("change","#new_productive_year",function(e){
	alert("aa");
	var latest_num_start=getLatestSeris($(this).val());	
	$("#newModal").data("bus_num_start",latest_num_start);
	//更新流水号
	var maxOrderNo = latest_num_start;	
	var factoryOrder_parameters=$("#new_factoryOrder_parameters").find("tr");
	$.each(factoryOrder_parameters,function(index,param){
		var tds=$(param).children("td");
		//$(tds[1]).find("select");
		//alert($(tds[2]).find("input").val());
		//maxOrderNo = $(tds[2]).find("input").val();
		$(tds[3]).find("input").val(maxOrderNo);
		$(tds[4]).find("input").val(Number(maxOrderNo) + Number($(tds[2]).find("input").val()) - 1);
		maxOrderNo = Number(maxOrderNo) + Number($(tds[2]).find("input").val());
		});
	});
	*/
});
/**
 * 改变生产年份后重新获取起始流水号，重新分配
 */
function changeProductionYear(e){
	//alert("aa");
	var element_id=$(e).attr("id");
	var dialog_type=element_id.substring(0,element_id.indexOf("_"));
	//alert(dialog_type);
	var latest_num_start=getLatestSeris($(e).val());	
	//$("#newModal").data("bus_num_start",latest_num_start);
	//更新流水号
	var maxOrderNo = latest_num_start;	
	var factoryOrder_parameters=$("#"+dialog_type+"_factoryOrder_parameters").find("tr");
	$.each(factoryOrder_parameters,function(index,param){
		var tds=$(param).children("td");
		//$(tds[1]).find("select");
		//alert($(tds[2]).find("input").val());
		//maxOrderNo = $(tds[2]).find("input").val();
		$(tds[3]).find("input").val(maxOrderNo);
		$(tds[4]).find("input").val(Number(maxOrderNo) + Number($(tds[2]).find("input").val()) - 1);
		maxOrderNo = Number(maxOrderNo) + Number($(tds[2]).find("input").val());
	});
}

function ajaxQuery(){
	//alert("调用");
	dt=$("#tableOrder").DataTable({
		serverSide: true,
		fixedColumns:   {
            leftColumns: 2,
            rightColumns:1
        },
		dom: 'Bfrtip',
		lengthMenu: [
		             [ 20, 30, 50, -1 ],
		             [ '显示20行', '显示30行', '显示50行', '全部' ]
		         ],
	    buttons: [
	        {extend:'excelHtml5',title:'data_export',className:'black',text:'<i class=\"fa fa-file-excel-o bigger-130\" tooltip=\"导出excel\"></i>'},
	        {extend:'pageLength',/*text:'显示行'*/}
	       
	    ],
        rowsGroup:[0,1,2,3,4,5],
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
			paginate: {
			  first:"首页",
		      previous: "上一页",
		      next:"下一页",
		      last:"尾页",
		      loadingRecords: "请稍等,加载中...",		     
			}
		},
		ajax:function (data, callback, settings) {
			var param ={
				"draw":1,
				"orderNo":$("#search_order_no").val(),
				"orderName":$("#search_order_name").val(),
				"actYear":$("#search_productive_year").val(),
				"factory":getAllFromOptions("#search_factory","val"),/*$("#search_factory").val(),*/
				"orderColumn":"order_no"
			};
            param.length = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;//开始的记录序号
            param.page = (data.start / data.length)+1;//当前页码

            $.ajax({
                type: "post",
                url: "showOrderList",
                cache: true,  //禁用缓存
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
                 // settings.rowsGroup=[0,1,2,3,4,5];
                   //alert("分页调用");
                    callback(returnData);
                    var head_width=$(".dataTables_scrollHead").width();
                    //alert(head_width)
                    $(".dataTables_scrollHead").css("width",head_width-20);
                }
            });
		
		},
		columns: [
		            {"title":"订单编号","class":"center","data":"order_no",/*"render": function ( data, type, row ) {
	                    return "<input style='border:0;width:100%;height:100%;background-color:transparent;text-align:center;' value='"+data+"' />";
	                },*/"defaultContent": ""},
		            {"title":"订单描述","class":"center","data":"order_name_str","defaultContent": ""},
		            {"title":"订单类型","class":"center","data":"order_type","defaultContent": ""},
		            {"title":"订单区域","class":"center","data":"order_area","defaultContent": ""},
		            {"title":"客户","class":"center","data":"customer","defaultContent": ""},
		            {"title":"生产年份","class":"center","data":"productive_year","defaultContent": ""},
		            {"title":"订单交期","class":"center","data": "delivery_date","defaultContent": ""},
		            {"title":"订单数量","class":"center","data":"order_qty","defaultContent": ""},		            
		            {"title":"生产工厂","class":"center","data":"factory_name","defaultContent": ""},		            
		            {"title":"生产数量","class":"center","data": "production_qty","defaultContent": ""},
		            {"title":"订单状态","class":"center","data":"status","render":function(data,type,row){
		            	return data=="0"?"未开始":(data=="1"?"生产中":"已完成")},"defaultContent":""
		            },
		            {"title":"车号信息","class":"center","data":null,"render":function(data,type,row){
		            	return "<i class=\"glyphicon glyphicon-search bigger-110 showbus\" onclick = 'ajaxShowBusNumber(" + row.id+ ","+row.factory_id+");' style='color:blue;cursor: pointer;'></i>";
		            },"defaultContent": "<i class=\"glyphicon glyphicon-search bigger-110 showbus\" title=\"车辆详情\" style='color:blue;cursor: pointer;'></i>"},
		            {"title":"起始车号流水","class":"center","data":"bus_number_start","defaultContent": ""},
		            {"title":"结束车号流水","class":"center","data":"bus_number_end","defaultContent": ""},		            
		            {"title":"编辑者","class":"center","data": "user_name","defaultContent": ""},
		            {"title":"编辑时间","class":"center","data":"edit_date","defaultContent": ""},
		            {"title":"分配","class":"center","data":null,"render":function(data,type,row){
		            	return "<i class=\"ace-icon fa fa-pencil bigger-130 editorder\" onclick = 'ajaxEdit(" + row.id+ ");' style='color:green;cursor: pointer;'></i>"},
		            	"defaultContent": "<i class=\"ace-icon fa fa-pencil bigger-130 editorder\" style='color:green;cursor: pointer;'></i>"}
		          ],
		
	});
/*	dt.on('page.dt', function ( e, settings) {
		new $.fn.dataTable.RowsGroup( dt.datatable, [0,1,2,3,4,5] );
	})*/
	$("#tableOrder_info").addClass('col-xs-6');
	$("#tableOrder_paginate").addClass('col-xs-6');
	$(".dt-buttons").css("margin-top","-50px").find("a").css("border","0px");
}
function setInput(value){
	var input="<input type='text' value='"+value+"' />";
	return input;
} 

function getFactorySelect() {
	$.ajax({
		url : "/BMS/common/getFactorySelectAuth",
		dataType : "json",
		data : {"function_url":"order/maintain"},
		async : false,
		error : function(response) {
			alert(response.message)
		},
		success : function(response) {
			getSelects(response.data, "", "#search_factory","全部");
			getSelects_noall(response.data, "", "#factory_id1");
			
			select_str = "<select name='' id='factory_id1' class='input-small'>";
			select_str1 = "<select name='' id='factory_id2' class='input-small'>";
			$.each(response.data, function(index, value){
				select_str += "<option value=" + value.id + ">" + value.name + "</option>";
				select_str2 += "<option value=" + value.id + ">" + value.name + "</option>";
			});
			select_str += "</select>";
			select_str2 += "</select>";
			
			var paramHtml="<tr><td><button disabled=\"disabled\" type=\"button\" class=\"close add\" aria-label=\"Close\" ><span aria-hidden=\"true\">&times;</span></button></td>" +
			"<td>" + select_str + "</td>" +
			"<td><input type='text' style='width:60px' class='input-small orderNum add' value='0' id='production_qty1'/></td>" +
			"<td><input type='text' style='width:60px' disabled='disabled' class='input-small busNum' value='0' id='busnum_start1'/></td>" +
			"<td><input type='text' style='width:60px' disabled='disabled' class='input-small busNum' value='0' id='busnum_end1'/></td>" +
			"</tr>";
			$(paramHtml).appendTo("#factoryOrder_parameters");
		}
	});
}

function getBusType(){
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

function getLatestSeris(cur_year){
	var bus_num=0;
	$.ajax({
		url: "/BMS/order/getLatestBusSeries",
		dataType: "json",
		data: {"productive_year" : cur_year},
		async: false,
		error: function () {alertError();},
		success: function (response) {
			bus_num= response.latest_num_start;
		}
	})
	return bus_num;	
}

/**
 * 使用剩余流水段时，判断剩余流水段，优先使用数量相等的流水段，其次使用数量有余的流水段，最后提示使用不足的流水段
 */
function getMatchSeries(riseNum){
	var series={};		
	$.each(reduce_series_list,function(i,s){//可用流水段等于增加数量	
		var seriesNum=(s.num_end-s.num_start+1);
		if(seriesNum==riseNum){
			series.index=i;
			series.num_start=s.num_start;
			series.num_end=s.num_end;
			series.message="相等";
			return false;
		}
	})
	if(series.index==undefined){
		$.each(reduce_series_list,function(i,s){//可用流水段超出增加数量
			var seriesNum=(s.num_end-s.num_start+1);
			if(seriesNum>riseNum){
				series.index=i;
				series.num_start=s.num_end-riseNum+1;
				series.num_end=s.num_end;
				series.message="未超出";
				return false;
			}
		})
	}
	if(series.index==undefined){
		$.each(reduce_series_list,function(i,s){//可用流水段小于增加数量
			var seriesNum=(s.num_end-s.num_start+1);
			if(seriesNum<riseNum){
				series.index=i;
				series.num_start=s.num_start;
				series.num_end=s.num_end;
				series.message="超出";
				return false;
			}
		})
	}
	//alert("匹配的流水段："+series.num_start+"-"+series.num_end);
	return series;
}

/**
 * 往剩余流水段列表中增加流水段，判断是否有接续的流水，有的话合并，没有
 */
function mergeReduceSeriesList(series){
	var s_merge={};
	$.each(reduce_series_list,function(i,s){			
		if(series.num_end==parseInt(s.num_start)-1){
			s.num_start=series.num_start;
			s_merge.index=i;
			s_merge.num_start=s.num_start;
			s_merge.num_end=s.num_end;
			reduce_series_list[i].num_start=s_merge.num_start;
			reduce_series_list[i].num_end=s_merge.num_end;
			return false;
		}
		if(series.num_start==parseInt(s.num_end)+1){
			s.num_end=series.num_end;
			//alert(s.num_end);
			s_merge.index=i;
			s_merge.num_start=s.num_start;
			s_merge.num_end=s.num_end;
			reduce_series_list[i].num_start=s_merge.num_start;
			reduce_series_list[i].num_end=s_merge.num_end;
			//alert(reduce_series_list[i].num_start+"-"+reduce_series_list[i].num_end)
			return false;
		}
	});
	if(s_merge.index==undefined){
		reduce_series_list.push(series);
	}
}

function ajaxEditConfirm (argument){
	//alert(original);
	
	$("#btnEditConfirm").attr("disabled","disabled");
	//数据验证
	var factoryOrder_parameters=$("#edit_factoryOrder_parameters").find("tr");
	var totleNum = $("#edit_order_qty").val();
	var factoryNum = 0;
	var factoryOrderDetail = [];
	var factoryOrderNum="";
	var arrStart = new Array();
	var arrEnd = new Array();
	$.each(factoryOrder_parameters,function(index,param){
		var tds=$(param).children("td");
		//$(tds[1]).find("select");
		arrStart[index] = Number($(tds[3]).find("input").val());
		arrEnd[index]   = Number($(tds[4]).find("input").val());
		var fod={};
		fod.factory_id=$(tds[1]).find("select").val();
		//fod.order_id=$("#editModal").data("order_id");
		fod.factory_order_id=$(param).data("factory_order_id")||"0";
		//fod.order_detail_id=$(param).data("order_detail_id")||"0";
		fod.production_qty=$(tds[2]).find("input").val()||0;
		fod.old_production_qty=$(param).data("production_qty")||"0";
		fod.busnum_start=$(tds[3]).find("input").val();
		fod.busnum_end=$(tds[4]).find("input").val();
		if(Number(fod.production_qty)>0){
			factoryOrderDetail.push(fod);
		}
	
		factoryOrderNum += $(tds[1]).find("select").val() + ":" + $(tds[2]).find("input").val() + "_" + $(tds[3]).find("input").val() + "|" + $(tds[4]).find("input").val() + "," ;
		factoryNum += Number($(tds[2]).find("input").val());
		
	});
	if(original==factoryOrderNum){
		factoryOrderNum = "";
	}
	if (factoryNum != totleNum){
		alert("产地分配数量之和与订单总数量不相等！");
		$("#btnEditConfirm").removeAttr("disabled");
		return false;
	}

	$.ajax({
		type: "get",
		dataType: "json",
		url: "/BMS/order/editOrder",
	    data: {
			"data_order_id":$("#dialog-order").data("order_id"),
			"color":$("#edit_color").val(),
			"seats":$("#edit_seats").val(),
			"delivery_date":$("#edit_delivery_date").val(),
			"memo":$("#edit_memo").val(),
			"customer":$("#edit_customer").val(),
			"factoryOrderDetail":JSON.stringify(factoryOrderDetail),
			"productive_year":$("#edit_productive_year").val(),
			"del_order_list":JSON.stringify(del_order_list)
		},
		async: false,
	    success:function (response) {
	    	$("#btnEditConfirm").removeAttr("disabled");
	    	
    		if(factoryOrderDetail==""){
    			alert("订单数据编辑成功！");
    		}else{
    			alert("订单数据编辑成功，请重新发布该订单今天及以后的计划！");
    		}
    		$( "#dialog-order" ).dialog( "close" );
    		ajaxQuery();
	     
	    },
	    error:function(){alertError();$("#btnEditConfirm").removeAttr("disabled");}
	});
	
}

function ajaxAdd (argument) {
	//数据验证
	if(($("#newOrderName").val() == '')||($("#newOrderCode").val() == '')
			||($("#new_order_qty").val() == '')||($("#new_delivery_date").val() == ''
				||($("#new_customer").val() == ''))){
		alert('请输入完整订单数据！');
		$("#btnAddConfirm").removeAttr("disabled");
		return false;
	}else if(isNaN($("#new_order_qty").val())){
		alert('订单数量须为数字！');
		$("#btnAddConfirm").removeAttr("disabled");
		return false;
	}

	$("#btnAddConfirm").attr("disabled","disabled");
	var factoryOrder_parameters=$("#new_factoryOrder_parameters").find("tr");
	var totleNum = $("#new_order_qty").val();
	var factoryNum = 0;
	var factoryOrderNum = "";
	//校验：结束号（最大值除外）+1 必需存在于起始号 中
	var arrStart = new Array();
	var arrEnd = new Array();
	
	$.each(factoryOrder_parameters,function(index,param){
		var tds=$(param).children("td");
		//$(tds[1]).find("select");
		arrStart[index] = Number($(tds[3]).find("input").val());
		arrEnd[index]   = Number($(tds[4]).find("input").val());
		
		factoryOrderNum += $(tds[1]).find("select").val() + ":" + $(tds[2]).find("input").val() + ",";
		factoryNum += Number($(tds[2]).find("input").val());
	});
	
	
	if (factoryNum != totleNum){
		alert("产地分配数量之和与订单总数量不相等！");
		$("#btnAddConfirm").removeAttr("disabled");
		return false;
	}

	$.ajax({
		type: "get",
		dataType: "json",
		url: "/BMS/order/addOrder",
	    data: {
			"data_order_name":$("#newOrderName").val(),
			"data_order_code":$("#newOrderCode").val().toUpperCase(),
			"data_order_type":$("#newOrderType").val(),
			"data_bus_type_id":$("#newBusType").val(),
			"data_order_qty":$("#new_order_qty").val(),
			"data_customer":$("#new_customer").val(),
			"data_order_area":$("#newOrderArea").val(),
			"data_productive_year":$("#new_productive_year").val(),
			"delivery_date":$("#new_delivery_date").val(),
			"status":"0",
			"memo":$("#new_memo").val(),
			"factoryOrderNum":factoryOrderNum,
		},
		async: false,
	    success:function (response) {
	    	
	    	if (response.success) {
	    		$( "#dialog-order_new" ).dialog( "close" ); 
	    		ajaxQuery();
	    	} else {
	    		alert(response.message);
	    	}
	    },
	    error:function(){alertError();}
	});
	
}

function ajaxEdit(order_id){
	original="";

	reduce_series_list=new Array();//重置减少分配数量时剩余流水段
	//查询订单信息
	$.ajax({
		url: "/BMS/order/showOrderDetailList",
		dataType: "json",
		data: {"order_id" : order_id},
		async: false,
		error: function () {alertError();},
		success: function (response) {			
				$("#edit_factoryOrder_parameters").html("");
				$.each(response.data,function(index,value){
					if(index == 0){
						//填充订单基本信息
						$("#editOrderID").val(value.id);
						$("#editOrderNo").val(value.order_no);
						$("#editOrderName").val(value.order_name);
						$("#editOrderCode").val(value.order_code);
						$("#editOrderType").val(value.order_type);
						$("#editOrderArea").val(value.order_area);
						$("#edit_customer").val(value.customer);
						//$("#editBusType").val(value.bus_type_code);
						select_selectOption("#editBusType",value.bus_type_code)
						$("#edit_order_qty").val(value.order_qty);
						$("#edit_order_descriptive").val(value.order_name + value.bus_type_code + " " + value.order_qty + "台");
						$("#edit_productive_year").val(value.productive_year).attr("disabled",true);
						$("#edit_delivery_date").val(value.delivery_date);
						$("#edit_memo").val(value.memo);
						$("#dialog-order").data("bus_num_start",value.busnum_start);
					}
					if(index==response.data.length-1){
						$("#dialog-order").data("bus_num_end",value.busnum_end);
					}
					//填充生产工厂信息
					var close_btn = "";
					var factory_selectable=false;
					if(value.minbusnum == 0) {
						close_btn = "<button type=\"button\" class=\"close edit\" aria-label=\"Close\" ><span aria-hidden=\"true\">&times;</span></button>";
						factory_selectable=true;
					}
					
					var tr=$("<tr/>");
					var paramHtml="<td>"+close_btn+"</td>" +
					//"<td>" + select_str + "</td>" +
					"<td>" + select_str1 + "<option value='"+ value.factory_id + "'> "+ value.factory_name + "</option>" + select_str2 + "</td>" +
					"<td><input type='text' style='width:60px' class='input-small orderNum edit' value='"+value.production_qty+"' old_value="+value.production_qty+" id='production_qty2'/></td>" +
					"<td><input type='text' style='width:60px' disabled='disabled' class='input-small busNum' value='"+value.busnum_start+"' id='busnum_start2'/></td>" +
					"<td><input type='text' style='width:60px' disabled='disabled' class='input-small busNum' value='"+value.busnum_end+"' id='busnum_end2'/></td>" +
					/*"<td ><input type='text' style='width:0px;display:none' class='input-small' value='"+value.minbusnum+"' id='minbusnum'/></td>" +
					"<td ><input type='text' style='width:0px;display:none' class='input-small' value='"+value.maxbusnum+"' id='maxbusnum'/></td>" +*/
					"";
					$(tr).html(paramHtml).appendTo("#edit_factoryOrder_parameters");
					$(tr).data("min_busnum",value.minbusnum);
					$(tr).data("max_busnum",value.maxbusnum);
					$(tr).data("production_qty",value.production_qty);
					$(tr).data("factory_order_id",value.factory_order_id);
					//$(tr).data("order_detail_id",value.id);
					$(tr).data("busnum_start",value.busnum_start);
					$(tr).data("busnum_end",value.busnum_end);
					
					if(!factory_selectable){
						$(tr).find("select").attr("disabled",true);
					}
	
					original += value.factory_id + ":" + value.production_qty + "_" + value.busnum_start + "|" + value.busnum_end + "," ;
					
				})
				$("#dialog-order").data("order_id",order_id);				
				
				var dialog = $( "#dialog-order" ).removeClass('hide').dialog({
					width:600,
					height:500,
					modal: true,
					title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i> 订单分配</h4></div>",
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
								//$( this ).dialog( "close" );
								ajaxEditConfirm();
							} 
						}
					]
				});
				$("#editOrderNo").focus();
		}
	})
}

function ajaxShowBusNumber(order_id,factory_id){
	$.ajax({
		url: "/BMS/order/showBusNumber",
		dataType: "json",
		data: {"order_id" : order_id,"factory_id":factory_id},
		async: false,
		error: function () {alertError();},
		success: function (response) {
			if(response.success){
				$("#tableBusNumber tbody").html("");
	    		/*$.each(response.data,function (index,value) {
	    			var tr = $("<tr />");
	    			$("<td style=\"text-align:center;\" />").html(index+1).appendTo(tr);
	    			$("<td style=\"text-align:center;\" />").html(value.bus_number).appendTo(tr);
	    			$("<td style=\"text-align:center;\" />").html(value.factory_name).appendTo(tr);
	    			$("<td style=\"text-align:center;\" />").html(value.workshop).appendTo(tr);
	    			$("<td style=\"text-align:center;\" />").html(value.process_name).appendTo(tr);
	    			$("#tableBusNumber tbody").append(tr);
	    			
	    		});*/
				drawBusInfoTable(response.data)
			} else {
				alert(response.message);
			}
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
		            {"title":"当前工序","class":"center","data":"process_name","defaultContent": ""},
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