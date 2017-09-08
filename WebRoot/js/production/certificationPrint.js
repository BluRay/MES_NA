var buslist=[];
$(document).ready(function () {
	initPage();
	function initPage(){
		getBusNumberSelect('#nav-search-input');
		getFactorySelect("production/certificationPrint","","#search_factory",null,"id")
		$("#search_factory").attr("disabled","disabled");
		getOrderNoSelect("#search_order_no","#orderId");
	}

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/BMS/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})
	
	$("#btnQuery").click (function () {
		//alert($("#search_bus_number").val().trim().length);
		if(($("#search_order_no").val()=='')&&($("#search_bus_number").val().trim().length==0)){
			alert("请输入订单编号或者指定车号！");
			return false;
		}
		ajaxQuery();
		return false;
	});
	
	$("#btnBuslist").click(function(){
		var dialog = $( "#dialog-config" ).removeClass('hide').dialog({
			width:400,
			height:280,
			modal: true,
			title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i> 指定车号</h4></div>",
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
						if($("#search_bus_number").val().trim().length>0){
							ajaxQuery();
						}						
						$("#search_bus_number").val("");
						$( this ).dialog( "close" ); 
					} 
				}
			]
		});
	});
	
	//全选反选
	$(document).on("click","#checkall",function(){
		//alert("aa");
		if ($('#checkall').is(":checked")) {
			//alert("选中")
			check_All_unAll("#tableResult",true);
		}
		if($('#checkall').is(":checked")==false){
			
			check_All_unAll("#tableResult",false);
		}
		
	})
	
	$("#btnImport").click(function(){
		
		var datalist=getCheckedBus();
		if(datalist.length>0){
			$(".divLoading").addClass("fade in").show();
			$.ajax({
			    url: "certificatePrint",
			    dataType: "json",
				type: "post",
			    data: {
			    	"conditions":JSON.stringify(datalist)
			    },
			    success:function(){
			    	$(".divLoading").hide();
			    	alert("传输成功！");		    	
			    },
			    error:function(){
			    	$(".divLoading").hide();
			    	alert("系统异常！");
			    }
			    })
		}else{
			alert("请选择需要传输打印的车号！");
		}
		
	});
	
	
})

function ajaxQuery(){
	$("#checkall").attr("checked",false);
	
		$("#tableResult").DataTable({
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
			sScrollY: $(window).height()-255,
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
						"factory_id": $('#search_factory').val(),
				    	"order_no": $('#search_order_no').val(),
				    	"bus_number":$('#search_bus_number').val(),
					};
	            param.length = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
	            param.start = data.start;//开始的记录序号
	            param.page = (data.start / data.length)+1;//当前页码

	            $.ajax({
	                type: "post",
	                url: "getCertificationList",
	                cache: false,  //禁用缓存
	                aysnc:false,
	                data: {conditions:JSON.stringify(param)},  //传入组装的参数
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
			          	 {"title":"<input type='checkbox' id='checkall' name='check'></input>","class":"center","data":"","defaultContent": "","render":function(data,type,row){
		            	var check_html="";		 
		            	if((row.productive_date == null)||(row.vin == null)||(row.productive_date == "")||(row.vin == "")){
		            		check_html="<input id=\"check_"+row.bus_number+"\" disabled=\"disabled\" type=\"checkbox\">";
		            	}else{
		            		check_html="<input id=\"check_"+row.bus_number+"\" type=\"checkbox\">";
		        		}
		            	return check_html;
			          	 }},
			            {"title":"车号","class":"center","data":"bus_number","defaultContent": ""},
			            {"title":"VIN","class":"center","data":"vin","defaultContent": ""},
			            {"title":"底盘型号","class":"center","data":"chassis_model","defaultContent": ""},
			            {"title":"整车型号","class":"center","data":"vehicle_model","defaultContent": ""},
			            {"title":"电机型号","class":"center","data": "motor_model","defaultContent": ""},
			            {"title":"底盘生产日期","class":"center","data":"dp_production_date","defaultContent": "","render":function(data,type,row){
			            	return (!data||data.trim().length==0)?"<a href='busInfoMtn?bus_number="+row.bus_number+"'>请维护底盘生产日期</a>":data;
			            }},		            
			            {"title":"整车生产日期","class":"center","data":"productive_date","defaultContent": "","render":function(data,type,row){
			            	return (!data||data.trim().length==0)?"<a href='busInfoMtn?bus_number="+row.bus_number+"'>请维护整车生产日期</a>":data;
			            }},		            
			            {"title":"电机号（左/右）","class":"center","data": "motor_number","defaultContent": ""},
			            {"title":"颜色","class":"center","data":"bus_color","defaultContent": ""},
			            {"title":"轮胎规格","class":"center","data":"tire_type","defaultContent": ""},
			            {"title":"座位数","class":"center","data": "bus_seats","defaultContent": ""},
			            {"title":"核定载<br>客人数","class":"center","data":"passengers","defaultContent": ""},		            
			            {"title":"弹簧片数","class":"center","data":"spring_num","defaultContent": ""},		            
			            {"title":"备注项","class":"center","data": "hgz_note","defaultContent": ""},
			            {"title":"整车<br>资质地","class":"center","data":"zc_zzd","defaultContent": ""},		            
			            {"title":"底盘<br>资质地","class":"center","data": "dp_zzd","defaultContent": ""}
			          ]		
		});
}


function getCheckedBus(){
	var arrChk=$("#tableResult tbody input[type='checkbox']:checked");
	//alert(arrChk.length)
	var checked_buslist=[];
    $(arrChk).each(function(){
    	var tr=$(this).parent("td").parent("tr");
    	var bus_obj=$("#tableResult").dataTable().fnGetData($(tr));
    	
    	checked_buslist.push(bus_obj); 
    	
    }); 
    return checked_buslist;
}
