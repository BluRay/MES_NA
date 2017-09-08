var cur_year="";
var pageSize=10;
var configlist_table=null;
$(document).ready(function(){
	initPage();
	
	$("#btnQuery").on("click",function(){
		ajaxQuery();
	}); 
	
	$("#btnAdd").on("click",function(){
		getOrderNoSelect("#order","#order_id");
		
	})

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/BMS/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})
	
	
});

function initPage(){
	getBusNumberSelect('#nav-search-input');
	cur_year = new Date().getFullYear();
	$("#search_productive_year").val(cur_year)
/*	cur_year = new Date().getFullYear();
	$("#search_productive_year").html('<option value="'+cur_year+'">'+cur_year+'</option><option value="'+(cur_year-1)+'">'+(cur_year-1)+'</option><option value="'+(cur_year+1)+'">'+(cur_year+1)+'</option><option value="'+(cur_year+2)+'">'+(cur_year+2)+'</option>');	
	*/
	getOrderNoSelect("#search_order_no","#orderId");
	getFactorySelect("order/configAllot","","#search_factory","全部","id")
	// 通过top页面任务栏进入，设置查询条件
	var orderNo = getParamValue("orderNo");
	var factory = getParamValue("factory");
	$("#search_factory").find("option[value='"+factory+"']").attr("selected",true);
	$("#search_order_no").val(orderNo);
	ajaxQuery();
	
}
function ajaxQuery(){
	configlist_table=$("#tableOrder").DataTable({
		columnDefs: [{
            "searchable": false,
            "orderable": false,
            "targets": 0
        }],
		serverSide: true,
/*		fixedColumns:   {
            leftColumns: 1,
            rightColumns:1
        },*/
		paiging:true,
		ordering:false,
		searching: false,
		bAutoWidth:false,
		destroy: true,
		sScrollY: $(window).height()-250,
		scrollX: "1500px",
		/*scrollCollapse: true,*/
		pageLength: pageSize,
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
					"factory":/*$("#search_factory").val(),*/getAllFromOptions("#search_factory","val"),
					"orderColumn":"order_no"
				};
            param.length = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;//开始的记录序号
            param.page = (data.start / data.length)+1;//当前页码

            $.ajax({
                type: "post",
                url: "getConfigAllotList",
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
                }
            });
		
		},
		columns: [
		            {"title":"订单编号","class":"center","data":"order_no","defaultContent": ""},
		            {"title":"订单描述","class":"center","data":"order_name_str","defaultContent": ""},
		            {"title":"生产工厂","class":"center","data":"factory_name","defaultContent": ""},
		            {"title":"生产数量","class":"center","data":"production_qty","defaultContent": ""},
		            {"title":"配置","class":"center","data": "order_config_name","defaultContent": ""},
		            {"title":"配置数量","class":"center","data":"product_qty","defaultContent": ""},		            
		            {"title":"生产顺序","class":"center","data":"sequence","defaultContent": ""},		            
		            {"title":"客户","class":"center","data": "customer","defaultContent": ""},
		            {"title":"操作","class":"center","data":"order_id","render":function(data,type,row){
		            	return "<i class=\"ace-icon fa fa-pencil bigger-130 editorder\" title='编辑' onclick = 'showEditPage(" + JSON.stringify(row)+ ");' style='color:green;cursor: pointer;'></i>";		            		
		            	}
		            }
		          ],
		rowsGroup:[0,1,2,3,8]
		
	});
}

function showEditPage(data){
	var CheckOrder = true;
	$("#configStr").val("");
	//填充订单基本信息
	$("#order").val(data.order_no+" "+data.order_name_str);
	$("#factory").val(data.factory_name);
	$("#productionQty").val(data.production_qty);
	$("#order_id").val(data.order_id);
	$("#factory_id").val(data.factory_id);
	$.ajax({
		//url: "order!showOrderReviewList.action",
		url: "getConfigListByOrder",
		dataType: "json",
		data: {"order_id" : data.order_id,
			"factory_id" : data.factory_id},
		async: false,
		error: function () {alertError();},
		success: function (response) {
			drawConfigListTable(response.data);
			
			var dialog = $( "#dialog-config" ).removeClass('hide').dialog({
				width:600,
				height:400,
				modal: true,
				title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i> 配置产地分配</h4></div>",
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
							ajaxEdit(data.order_id,data.factory_id); 
						} 
					}
				]
			});
		}
	})
}

function drawConfigListTable(data){
	var t=$("#configAllot_table").DataTable({
		paiging:false,
		showRowNumber:true,
		ordering:false,
		searching: false,
		bAutoWidth:false,
		destroy: true,
		paginate:false,
		//sScrollY: $(window).height()-250,
		/*scrollX: "1200px",*/
		createdRow: function ( row, data, index ) {
			//alert(index)
			 $('td', row).	eq(1).find("input").data("allot_config_id",data.allot_config_id||0);
			 $('td', row).	eq(1).find("input").data("order_config_id",data.order_config_id);
        },
		scrollCollapse: true,
		lengthChange:false,
		orderMulti:false,
		info:false,
		language: {
			emptyTable:"",					     
			infoEmpty:"",
			zeroRecords:"请导入配置明细！"
		},
		data:data,
		columns: [
		            {"title":"配置简称","class":"center","data":"order_config_name","defaultContent": ""},
		            {"title":"生产序号","class":"center","data":null,"defaultContent": "","render":function(data,type,row){
		            	return "<input style='border:0;width:50px;text-align:center' class='sequence'  value='"+(row.sequence||"")+"'/>";
		            }
		            },
		            {"title":"生产数量","class":"center","data": "product_qty","defaultContent": "","render":function(data,type,row){
		            	return "<input style='border:0;width:50px;text-align:center' class='product_qty' old_val='"+(data||0)+"'value='"+(data||"")+"'/>";
		            }},
		            {"title":"配置数量","class":"center","data":"config_qty","defaultContent": ""},		            
		            {"title":"已分配数量","class":"center","data":"already_qty","defaultContent": ""},
		            {"title":"已生成车号数","class":"center","data":"allot_bus_qty","defaultContent": "0"}  
		          ]	      
	});
}

function ajaxEdit(order_id,factory_id){
	var trs=$("#configAllot_table tbody").children("tr");
	var arr_config_allot=[];
	var total_allot_qty=0;
	var save_flag=true;
	var sequence_arr=[];
	$.each(trs,function(index,tr){
		var tds=$(tr).children("td");
		var config_qty=Number($(tds[3]).html()||0);//配置数量
		var already_qty=Number($(tds[4]).html()||0);//已配置分配的数量
		var allot_bus_qty=Number($(tds[5]).html()||0);//已生成车号数量
		var seq_input=$(tds[1]).find("input");
		var product_qty_input=$(tds[2]).find("input");
		var allot_config_id=$(seq_input).data("allot_config_id");
		var order_config_id=$(seq_input).data("order_config_id");
		var sequence=$(seq_input).val();
		var product_qty=Number($(product_qty_input).val()||0);
		var old_product_qty=Number($(product_qty_input).attr("old_val")||0);
		if(isNaN(product_qty)){
			alert("生产数量必须为数字！");
			save_flag=false;
			return false;
		}
		if(product_qty>(config_qty-already_qty+old_product_qty)){
			alert("生产数量不能超过配置数量减已分配数量！");
			save_flag=false;
			return false;
		}
		if(product_qty<allot_bus_qty){
			alert("生产数量必须大于等于已生成的车号数量！");
			save_flag=false;
			return false;
		}
		
		var obj={};
		obj.id=allot_config_id;
		obj.order_config_id=order_config_id;
		obj.sequence=sequence;
		obj.product_qty=product_qty;
		obj.order_id=order_id;
		obj.factory_id=factory_id;
		
		arr_config_allot.push(obj);	
		
		total_allot_qty+=product_qty;//所有配置分配数量之和
		//alert($(seq_input).data("allot_config_id"))	
		
		//判断生产序号是否重复
		if(Array.indexOf(sequence_arr,sequence)>=0){
			alert("生产序号不能重复！");
			save_flag=false;
			return false;
		}
		sequence_arr.push(sequence);
	});
	if(total_allot_qty>Number($("#productionQty").val())){
		alert("各配置生产数量之和不能超过订单生产数量！");
		save_flag=false;
		return false;
	}
	
	if(save_flag){
		$.ajax({
			//url: "order!showOrderReviewList.action",
			url: "updateConfigAllot",
			dataType: "json",
			data: {
				"allot_config_list":JSON.stringify(arr_config_allot)
			},
			async: false,
			error: function () {alertError();},
			success: function (response) {
				$( "#dialog-config" ).dialog("close");
				ajaxQuery();
			}
		})
	}
;	
}
