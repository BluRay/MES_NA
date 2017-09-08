$(document).ready(function(){
	initPage();
	
	//新增
	$("#btnAdd").click(function(e){
		$("#create_form")[0].reset();
		$("#factory").prop("disabled",false);
		$("#order").prop("disabled",false);
		$("#specify_order_lable").show();
		getFactorySelect("production/busInfoMtn","","#factory","请选择","id");
		getOrderNoSelect("#order","#order_id",null,null,"#factory","copy");
		
		var dialog = $( "#dialog-config" ).removeClass('hide').dialog({
			width:750,
			height:500,
			modal: true,
			title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i> 批量编辑</h4></div>",
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
	
	$("#bus_list").change(function(){
		if($(this).val().trim().length>0){
			$("#factory").val("").attr("disabled",true);
			$("#order").val("").attr("order_id","").attr("disabled",true);
		}else{
			$("#factory").attr("disabled",false);
			$("#order").attr("disabled",false);
		}
	});
	
});

function initPage(){
	getBusNumberSelect('#nav-search-input');
	getBusNumberSelect('#search_bus_number');
	$("#search_bus_number").val(getQueryString("bus_number"));
	getFactorySelect("production/busInfoMtn","","#search_factory","全部","id");
	getBusTypeSelect("","#search_bus_type","全部","id");
	getOrderNoSelect("#search_order_no","",null,null,"#search_factory");
	ajaxQuery();
}

function ajaxQuery(){
	$("#tableResult").DataTable({
		serverSide: true,
		paiging:true,
		ordering:false,
		searching: false,
		bAutoWidth:false,
		fixedColumns:   {
            leftColumns: 1,
            rightColumns:1
        },
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
					"order_no":$("#search_order_no").val(),
					"bus_type":$("#search_bus_type :selected").text(),
					"bus_number":$("#search_bus_number").val(),
					"factory_id":getAllFromOptions("#search_factory","val"),
					"orderColumn":"order_no"
				};
            param.length = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;//开始的记录序号
            param.page = (data.start / data.length)+1;//当前页码

            $.ajax({
                type: "post",
                url: "getBusInfoList",
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
		          	{"title":"车号","class":"center","data":"bus_number","defaultContent": ""},
		            {"title":"生产工厂","class":"center","data":"factory_name","defaultContent": ""},
		            {"title":"订单描述","class":"center","data":"order_desc","defaultContent": ""},
		            {"title":"颜色","class":"center","data":"bus_color","defaultContent": ""},
		            {"title":"座位数","class":"center","data":"bus_seats","defaultContent": ""},
		            {"title":"额定载客人数","class":"center","data": "passenger_num","defaultContent": ""},
		            {"title":"轮胎规格","class":"center","data":"tire_type","defaultContent": ""},		            
		            {"title":"电池容量","class":"center","data":"battery_capacity","defaultContent": ""},		            
		            {"title":"额定电压","class":"center","data": "rated_voltage","defaultContent": ""},		            
		            {"title":"弹簧片数","class":"center","data":"spring_num","defaultContent": ""},
		            {"title":"底盘生产日期","class":"center","data":"dp_production_date","defaultContent": ""},
		            {"title":"底盘资质地","class":"center","data":"dp_zzd","defaultContent": ""},
		            {"title":"整车生产日期","class":"center","data":"zc_production_date","defaultContent": ""},
		            {"title":"整车资质地","class":"center","data": "zc_zzd","defaultContent": ""},
		            {"title":"合格证备注","class":"center","data":"hgz_note","defaultContent": ""},		            
		            {"title":"CCC证书签发日期","class":"center","data":"ccczs_date","defaultContent": ""},		            
		            {"title":"底盘公告生效日期","class":"center","data": "dpgg_date","defaultContent": ""},
		            {"title":"整车公告生效日期","class":"center","data": "zcgg_date","defaultContent": ""},
		            {"title":"操作","class":"center","data":"order_id","render":function(data,type,row){
		            	return "<i class=\"ace-icon fa fa-pencil bigger-130 editorder\" title='编辑' onclick = 'showEditPage(" + JSON.stringify(row)+ ");' style='color:green;cursor: pointer;'></i>";		            		
		            	}
		            }
		          ]
	});
}

function specifyBus(){
	/*$("#bus_list").val("");*/
	
	var dialog = $( "#dialog-config-bus" ).removeClass('hide').dialog({
		width:400,
		height:250,
		modal: true,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i> 指定车号</h4></div>",
		title_html: true,
		buttons: [ 
		/*	{
				text: "取消",
				"class" : "btn btn-minier",
				click: function() {
					$( this ).dialog( "close" ); 
				} 
			},*/
			{
				text: "确定",
				"class" : "btn btn-primary btn-minier",
				click: function() {
					//alert($("#bus_list").val().replace(/\n/g,','))
					$( this ).dialog( "close" ); 
				} 
			}
		]
	});
}

function showEditPage(row){
	$("#create_form")[0].reset();
	getFactorySelect("",row.factory_id,"#factory","","id");
	$("#factory").prop("disabled",true);
	$("#order").val(row.order_no).prop("disabled",true);
	$("#specify_order_lable").hide();
	$("#bus_color").val(row.bus_color);
	$("#bus_seats").val(row.bus_seats);
	$("#passenger_num").val(row.passenger_num);
	$("#tire_type").val(row.tire_type);
	$("#battery_capacity").val(row.battery_capacity);
	$("#rated_voltage").val(row.rated_voltage);
	$("#spring_num").val(row.spring_num);
	$("#dp_production_date").val(row.dp_production_date);
	$("#dp_zzd").val(row.dp_zzd);
	$("#zc_production_date").val(row.zc_production_date);
	$("#zc_zzd").val(row.zc_zzd);
	$("#hgz_note").val(row.hgz_note);
	$("#ccczs_date").val(row.ccczs_date);
	$("#dpgg_date").val(row.dpgg_date);
	$("#zcgg_date").val(row.zcgg_date);
	
	var dialog = $( "#dialog-config" ).removeClass('hide').dialog({
		width:750,
		height:500,
		modal: true,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i> 修改—"+row.bus_number+"</h4></div>",
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
					ajaxEdit(row.bus_number); 
				} 
			}
		]
	});
}
/**
 * 批量编辑
 */
function ajaxAdd(){
	if($("#factory").val()==""&&$("#bus_list").val().trim().length==0){
		alert("请选择生产工厂！");
		return false;
	}
	if(($("#order_id").val()==undefined||$("#order_id").val()=="")&&$("#bus_list").val().trim().length==0){
		alert("请输入有效订单编号！");
		return false;
	}
	var flag=validateDates();
	if(flag)	
	$.ajax({
		type:"post",
		url:"updateBusInfo",
		dataType:"json",
		data:{
			factory_id:$("#factory").val(),
			order_id:$("#order_id").val(),
			bus_list:$("#bus_list").val().replace(/\n/g,','),
			bus_color:$("#bus_color").val(),
			bus_seats:$("#bus_seats").val(),
			passenger_num:$("#passenger_num").val(),
			tire_type:$("#tire_type").val(),
			battery_capacity:$("#battery_capacity").val(),
			rated_voltage:$("#rated_voltage").val(),
			spring_num:$("#spring_num").val(),
			dp_production_date:$("#dp_production_date").val(),
			dp_zzd:$("#dp_zzd").val(),
			zc_production_date:$("#zc_production_date").val(),
			zc_zzd:$("#zc_zzd").val(),
			hgz_note:$("#hgz_note").val(),
			ccczs_date:$("#ccczs_date").val(),
			dpgg_date:$("#dpgg_date").val(),
			zcgg_date:$("#zcgg_date").val(),
		},
		success:function(response){
			alert(response.message);
			$("#dialog-config" ).dialog( "close" ); 
			$("#bus_list").val("");
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
function ajaxEdit(bus_number){
	var flag=validateDates();
	if(flag)
	$.ajax({
		type:"post",
		url:"updateBusInfo",
		dataType:"json",
		data:{
			bus_number:bus_number,
			bus_color:$("#bus_color").val(),
			bus_seats:$("#bus_seats").val(),
			passenger_num:$("#passenger_num").val(),
			tire_type:$("#tire_type").val(),
			battery_capacity:$("#battery_capacity").val(),
			rated_voltage:$("#rated_voltage").val(),
			spring_num:$("#spring_num").val(),
			dp_production_date:$("#dp_production_date").val(),
			dp_zzd:$("#dp_zzd").val(),
			zc_production_date:$("#zc_production_date").val(),
			zc_zzd:$("#zc_zzd").val(),
			hgz_note:$("#hgz_note").val(),
			ccczs_date:$("#ccczs_date").val(),
			dpgg_date:$("#dpgg_date").val(),
			zcgg_date:$("#zcgg_date").val(),
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

function validateDates(){
	var dp_production_date=$("#dp_production_date").val();
	var dpgg_date=$("#dpgg_date").val();
	var ccczs_date=$("#ccczs_date").val();
	var zcgg_date=$("#zcgg_date").val();
	var zc_production_date=$("#zc_production_date").val();
	var flag=true;
	
	if(dp_production_date.trim().length>0&&dpgg_date.trim().length>0){
		if(dp_production_date<=dpgg_date){
			alert("底盘生产日期需在底盘公告日期之后！")
			flag=false;
			return false;
		}
	}
	
	if(dp_production_date.trim().length>0&&zc_production_date.trim().length>0){
		if(dp_production_date>=zc_production_date){
			alert("整车生产日期需在底盘生产日期之后！")
			flag=false;
			return false;
		}
	}
	
	if(zcgg_date.trim().length>0&&zc_production_date.trim().length>0){
		if(zcgg_date>=zc_production_date){
			alert("整车生产日期需在整车公告日期之后！")
			flag=false;
			return false;
		}
	}
	
	if(ccczs_date.trim().length>0&&zc_production_date.trim().length>0){
		if(ccczs_date>=zc_production_date){
			alert("整车生产日期需在CCC证书签发日期日期之后！")
			flag=false;
			return false;
		}
	}
	
	return flag;
	
}