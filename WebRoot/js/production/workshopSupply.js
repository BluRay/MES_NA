$(document).ready(function(){
	initPage();
	//切换工厂、更新车间下拉列表
	$(document).on("change","#search_factory",function(e){
		getWorkshopSelect("production/workshopSupply",$("#search_factory :selected").text(),"","#search_supply_workshop","全部","id")
		getWorkshopSelect("",$("#search_factory :selected").text(),"","#search_receive_workshop","全部","id");
	});
	
	$(document).on("change","#factory",function(e){
		getWorkshopSelect("production/workshopSupply",$("#factory :selected").text(),"","#supply_workshop","请选择","id")
		getWorkshopSelect("",$("#factory :selected").text(),"","#receive_workshop","请选择","id")
		//getSupplyInfo();
		$("#supply_num").next("span").html("");
		$("#supply_num").val("");
	});

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/BMS/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})
	
	//车间切换
	$(document).on("change","#supply_workshop",function(e){
		//getSupplyInfo();
		$("#supply_num").next("span").html("");
		$("#supply_num").val("");
	})
	$(document).on("change","#receive_workshop",function(e){
		//getSupplyInfo();
		$("#supply_num").next("span").html("");
		$("#supply_num").val("");
	})
	//订单编号切换
	$(document).on("change","#order",function(e){
		//getSupplyInfo();
		$("#supply_num").next("span").html("");
		$("#supply_num").val("");
	})
	

	$("#supply_num").click(function(){
		getSupplyInfo();
	});
	
	//新增
	$("#btnAdd").click(function(e){
		$("#create_form")[0].reset();
		$("#factory").prop("disabled",false);
		$("#order").prop("disabled",false);
		getFactorySelect("production/workshopSupply","","#factory","请选择","id");
		
		var dialog = $( "#dialog-config" ).removeClass('hide').dialog({
			width:450,
			height:380,
			modal: true,
			title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i> 车间供货登记</h4></div>",
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
	
});

function initPage(){
	getBusNumberSelect('#nav-search-input');
	getFactorySelect("production/workshopSupply","","#search_factory",null,"id");
	getWorkshopSelect("production/workshopSupply",$("#search_factory :selected").text(),"","#search_supply_workshop","全部","id")
	getWorkshopSelect("",$("#search_factory :selected").text(),"","#search_receive_workshop","全部","id")
	getOrderNoSelect("#search_order_no","",null,null,"#search_factory");
	getOrderNoSelect("#order","#order_id",null,null,"#factory","copy");
}

function ajaxQuery(){
	$("#tableResult").DataTable({
		serverSide: true,
		paiging:true,
		ordering:false,
		searching: false,
		bAutoWidth:false,
/*		fixedColumns:   {
            rightColumns:1
        },*/
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
					"supply_workshop":$("#search_supply_workshop :selected").text(),
					"receive_workshop":$("#search_receive_workshop :selected").text(),
					"orderColumn":"order_no"
				};
            param.length = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;//开始的记录序号
            param.page = (data.start / data.length)+1;//当前页码

            $.ajax({
                type: "post",
                url: "getWorkshopSupplyList",
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
		            {"title":"生产工厂","class":"center","data":"factory_name","defaultContent": ""},
		            {"title":"供货车间","class":"center","data":"supply_workshop","defaultContent": ""},
		            {"title":"接收车间","class":"center","data":"receive_workshop","defaultContent": ""},
		            {"title":"生产订单","class":"center","data":"order_desc","defaultContent": ""},
		            {"title":"数量","class":"center","data": "quantity","defaultContent": ""},
		            {"title":"累计供应数","class":"center","data":"supply_total","defaultContent": ""},		            
		            {"title":"日期","class":"center","data":"supply_date","defaultContent": ""},		            
		            {"title":"维护人","class":"center","data": "editor","defaultContent": ""},		            
		            {"title":"维护时间","class":"center","data":"edit_date","defaultContent": ""},
		            {"title":"操作","class":"center","data":"","render":function(data,type,row){
		            	return "<i class=\"ace-icon fa fa-pencil bigger-130 editorder\" title='编辑' onclick = 'showEditPage(" + JSON.stringify(row)+ ");' style='color:green;cursor: pointer;'></i>";		            		
		            	}
		            }
		          ]
	});
}


function showEditPage(row){
	$("#supply_num").next("span").html("");
	$("#create_form")[0].reset();
	getFactorySelect("",row.factory_id,"#factory","","id");
	$("#order_id").val(row.order_id);
	$("#order").val(row.order_no);
	getWorkshopSelect("production/workshopSupply",$("#factory :selected").text(),row.supply_workshop,"#supply_workshop","请选择","id")
	getWorkshopSelect("",$("#factory :selected").text(),row.receive_workshop,"#receive_workshop","请选择","id")
	$("#supply_num").val(row.quantity);
	$("#supply_date").val(row.supply_date);
	
	var dialog = $( "#dialog-config" ).removeClass('hide').dialog({
		width:450,
		height:380,
		modal: true,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i> 编辑车间供货</h4></div>",
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
	if($("#factory").val()==""){
		alert("请选择生产工厂！");
		return false;
	}
	if($("#order_id").val()==undefined||$("#order_id").val()==""){
		alert("请输入有效订单编号！");
		return false;
	}
	if($("#supply_workshop").val()==""){
		alert("请选择供货车间！");
		return false;
	}
	if($("#receive_workshop").val()==""){
		alert("请选择接收车间！");
		return false;
	}
	if(isNaN($("#supply_num").val())){
		alert('供应车付必须为数字！');
		return false;
	}
	if($("#supply_num").val()>$("#supply_num").data("left_qty")){
		alert("可供应数量不够！");
		return false;
	}
	if($("#supply_num").val()==0){
		alert("可供应数量必须大于0！");
		return false;
	}
	if($("#supply_date").val()==""){
		alert("请选择交付日期！");
		return false;
	}
	$.ajax({
		type:"post",
		url:"saveUpdateWorkshopSupply",
		dataType:"json",
		data:{
			factory_id:$("#factory").val(),
			order_id:$("#order_id").val(),
			supply_workshop:$("#supply_workshop :selected").text(),
			receive_workshop:$("#receive_workshop :selected").text(),
			quantity:$("#supply_num").val(),
			supply_date:$("#supply_date").val()
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
	if($("#factory").val()==""){
		alert("请选择生产工厂！");
		return false;
	}
	if($("#order_id").val()==undefined||$("#order_id").val()==""){
		alert("请输入有效订单编号！");
		return false;
	}
	if($("#supply_workshop").val()==""){
		alert("请选择供货车间！");
		return false;
	}
	if($("#receive_workshop").val()==""){
		alert("请选择接收车间！");
		return false;
	}
	if(isNaN($("#supply_num").val())){
		alert('供应车付必须为数字！');
		return false;
	}
	if($("#supply_num").val()>$("#supply_num").data("left_qty")){
		alert("可供应数量不够！");
		return false;
	}
	if($("#supply_num").val()==0){
		alert("可供应数量必须大于0！");
		return false;
	}
	if($("#supply_date").val()==""){
		alert("请选择交付日期！");
		return false;
	}
	$.ajax({
		type:"post",
		url:"saveUpdateWorkshopSupply",
		dataType:"json",
		data:{
			factory_id:$("#factory").val(),
			order_id:$("#order_id").val(),
			supply_workshop:$("#supply_workshop :selected").text(),
			receive_workshop:$("#receive_workshop :selected").text(),
			quantity:$("#supply_num").val(),
			supply_date:$("#supply_date").val(),
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

function getSupplyInfo(){
	var factory=$("#factory").val();
	var supply_workshop=$("#supply_workshop :selected").text();
	var receive_workshop=$("#receive_workshop :selected").text();
	var order_no=$("#order").val();
	if(factory&&supply_workshop!=''&&receive_workshop!='请选择'&&order_no!=''){
		$.ajax({
			type:"post",
			dataType:"json",
			url: "getSupplyTotalCount",
			async:false,
			data:{
				"factory_id":factory,
				"supply_workshop":supply_workshop,
				"receive_workshop":receive_workshop,
				"order_no":order_no,
			},
			success:function (response) {
				var data=response.data;
	    		$("#supply_num").next("span").html("已供应："+data.supply_total+"；可供应："+data.left_qty);
	    		$("#supply_num").data("left_qty",data.left_qty);
		    }			
		})	
		$(this).next("span").show();
		
	}

}