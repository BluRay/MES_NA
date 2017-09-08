$(document).ready(function(){
	initPage();

	//新增
	$("#btnAdd").click(function(e){
		$("#create_form")[0].reset();
		getKeysSelect("BASE_PARTS", "", "#parts","请选择","id");
		$("#factory").prop("disabled",false);
		$("#order").prop("disabled",false);
		getFactorySelect("production/workshopSupply","","#factory","请选择","id");
		
		var dialog = $( "#dialog-config" ).removeClass('hide').dialog({
			width:450,
			height:380,
			modal: true,
			title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i> 部件上下线登记</h4></div>",
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
					} 
				}
			]
		});
	})
	
	//点击查询
	$("#btnQuery").click(function(){
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
	getFactorySelect("production/workshopSupply","","#search_factory",null,"id");
	getOrderNoSelect("#search_order_no","",null,null,"#search_factory");
	getOrderNoSelect("#order","#order_id",function(obj){
		$("#order").attr("order_qty",obj.orderQty);
	},null,"#factory","copy");
	getKeysSelect("BASE_PARTS", "", "#search_parts","全部","id");
}

function ajaxQuery(){
	$("#tableResult").DataTable({
		serverSide: true,
		paiging:true,
		ordering:false,
		searching: false,
		bAutoWidth:false,
		fixedColumns:   {
			leftColumns:0,
            rightColumns:1
        },
		 rowsGroup:[0,1,2,3,4],
		destroy: true,
		sScrollY: $(window).height()-250,
		scrollX: true,
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
					"factory_id":$("#search_factory").val(),
					"order_no":$("#search_order_no").val(),
					"search_date_start":$("#search_date_start").val(),
					"search_date_end":$("#search_date_end").val(),
					"parts_id":$("#search_parts :selected").attr("keyvalue"),
					"orderColumn":"factory_id,order_id,parts_id"
				};
            param.length = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;//开始的记录序号
            param.page = (data.start / data.length)+1;//当前页码

            $.ajax({
                type: "post",
                url: "getPartsOnOffList",
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
                }
            });
		
		},
		columns: [
		            {"title":"生产工厂","class":"center","data":"factory_name","defaultContent": ""},
		            {"title":"生产订单","class":"center","data":"order_desc","defaultContent": ""},
		            {"title":"部件","class":"center","data":"parts_name","defaultContent": ""},
		            {"title":"上线累计","class":"center","data":"online_total","defaultContent": ""},
		            {"title":"下线累计","class":"center","data": "offline_total","defaultContent": ""},
		            {"title":"日期","class":"center","data":"prod_date","defaultContent": ""},		            
		            {"title":"上线计划","class":"center","data":"online_plan_qty","defaultContent": ""},		            
		            {"title":"上线数量","class":"center","data": "online_real_qty","defaultContent": ""},		  
		            {"title":"下线计划","class":"center","data": "offline_plan_qty","defaultContent": ""},		
		            {"title":"下线数量","class":"center","data": "offline_real_qty","defaultContent": ""},	
		            {"title":"维护时间","class":"center","data":"edit_date","defaultContent": ""},
		            {"title":"维护人","class":"center","data":"editor","defaultContent": ""},
		            {"title":"操作","class":"center","data":"","render":function(data,type,row){
		            	return "<i class=\"ace-icon fa fa-pencil bigger-130 editorder\" title='编辑' onclick = 'showEditPage(" + JSON.stringify(row)+ ");' style='color:green;cursor: pointer;'></i>";		            		
		            	}
		            }
		          ]
	});
}


function showEditPage(row){
	$("#create_form")[0].reset();
	getFactorySelect("",row.factory_id,"#factory","","id");
	$("#order_id").val(row.order_id);
	$("#order").val(row.order_no);
	getKeysSelect("BASE_PARTS", row.parts_id, "#parts","请选择","id");
	$("#prod_date").val(row.prod_date);
	//$("#parts").val(row.parts_id);
	$("#parts option:contains('"+row.parts_name+"')").prop("selected", true);
	$("#online_num").val(row.online_real_qty);
	$("#offline_num").val(row.offline_real_qty);
	
	var dialog = $( "#dialog-config" ).removeClass('hide').dialog({
		width:400,
		height:380,
		modal: true,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i> 编辑部件上下线</h4></div>",
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
					ajaxEdit(row.id); 
				} 
			}
		]
	});
}

function ajaxAdd(){
	//数据验证
	if($("#factory").val()==undefined||$("#factory").val().trim().length==0){
		alert('请选择生产工厂！');
		return false;
	}
	if($("#order_id").val()==undefined||$("#order_id").val()==""){
		alert("请输入有效订单编号！");
		return false;
	}
	if($("#parts").val()==undefined||$("#parts").val().trim().length==0){
		alert('请选择生产部件！');
		return false;
	}
	if(isNaN(parseFloat($("#online_num").val()))){
		alert('上线数量须为数字！');
		return false;
	}
	if(isNaN(parseFloat($("#offline_num").val()))){
		alert('下线数量须为数字！');
		return false;
	}
	//查询生产部件、订单下 上下线总数
	var info=getPartsFinishCount();
	
	if($("#online_num").val()>(info.production_qty-info.online_total)){
		alert("上线不能超出工厂订单数！");
		return false;
	}
	if($("#offline_num").val()>(info.production_qty-info.offline_total)){
		alert("下线不能超出工厂订单数！");
		return false;
	}
	//alert($("#parts :selected").attr("keyvalue"));
	$.ajax({
		type:"post",
		url:"saveUpdatePartsOnOffRecord",
		dataType:"json",
		data:{
			factory_id:$("#factory").val(),
			order_id:$("#order_id").val(),
			parts_id:$("#parts :selected").attr("keyvalue")||"",
			online_num:$("#online_num").val(),
			offline_num:$("#offline_num").val(),
			prod_date:$("#prod_date").val()
		},
		success:function(response){
			alert(response.message);
			$("#dialog-config" ).dialog( "close" ); 
			ajaxQuery();
		},
		error:function(response){
			alert(response.message);
		}
	})
}
/**
 * 单车编辑
 * @param bus_number
 */
function ajaxEdit(id){
	//数据验证
	if($("#factory").val()==undefined||$("#factory").val().trim().length==0){
		alert('请选择生产工厂！');
		return false;
	}
	if($("#order_id").val()==undefined||$("#order_id").val()==""){
		alert("请输入有效订单编号！");
		return false;
	}
	if($("#parts").val()==undefined||$("#parts").val().trim().length==0){
		alert('请选择生产部件！');
		return false;
	}
	if(isNaN(parseFloat($("#online_num").val()))){
		alert('上线数量须为数字！');
		return false;
	}
	if(isNaN(parseFloat($("#offline_num").val()))){
		alert('下线数量须为数字！');
		return false;
	}
	//查询生产部件、订单下 上下线总数
	var info=getPartsFinishCount();
	
	if($("#online_num").val()>info.online_left_qty){
		alert("上线数不能超出工厂订单数！");
		return false;
	}
	if($("#offline_num").val()>info.offline_left_qty){
		alert("下线数不能超出工厂订单数！");
		return false;
	}
	$.ajax({
		type:"post",
		url:"saveUpdatePartsOnOffRecord",
		dataType:"json",
		data:{
			factory_id:$("#factory").val(),
			order_id:$("#order_id").val(),
			parts_id:$("#parts :selected").attr("keyvalue")||"",
			online_num:$("#online_num").val(),
			offline_num:$("#offline_num").val(),
			prod_date:$("#prod_date").val(),
			id:id
		},
		success:function(response){
			alert(response.message);
			$("#dialog-config" ).dialog( "close" ); 
			ajaxQuery();
		},
		error:function(response){
			alert(response.message);
		}
	})
}

function getPartsFinishCount(){
	var factory=$("#factory").val();
	var parts_id=$("#parts :selected").attr("keyvalue")||"";
	var order_no=$("#order").val();
	var info={};
	$.ajax({
		type:"post",
		dataType:"json",
		url: "getPartsFinishCount",
		async:false,
		data:{
			"factory_id":factory,
			"parts_id":parts_id,
			"order_no":order_no
		},
		success:function (response) {
			info=response.data; 		
	    }			
	})	
	return info;
}


