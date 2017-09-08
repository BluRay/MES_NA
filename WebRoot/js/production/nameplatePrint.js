var busNoList;
$(document).ready(function(){
	initPage();
	window.onafterprint=function(){
		 ajaxUpdatePrint(busNoList);
	}
	$("#btnQuery").click(function(){
		ajaxQuery();
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
	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/BMS/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})

	//打印
	$("#btnPrint").click(function(){
		var printFlag=true;
		$("#printarea").html("");		
		busNoList="";//获取要打印的车号列表
		var cboxlist=$("#tableResult tbody :checked");
		var printhtml="<tr><td>车身号</td><td>VIN</td><td>品牌</td><td>电机型号</td>"+
					"<td>底盘型号</td><td>电机最大功率</td><td>最大允许总质量</td>"+
					"<td>电池型号</td><td>电池容量</td><td>额定电压</td><td>整车生产日期</td></tr>";
		/*var productDate=$("#input_product_date").val();*/
		if(cboxlist.length==0){
			alert("请至少选中一行！");
			printFlag=false;
		}
		$.each(cboxlist,function(index,cbox){
			var tr=$(cbox).closest("tr");
			var tds=$(cbox).parent("td").siblings();
			busNoList+=$(tds[0]).html()+",";	
			var prod_date=$(tds[10]).html();

			var tbhtml="<tr><td>"+$(tds[0]).html()+"</td>"
				+"<td>"+$(tds[1]).html()+"</td>"+"<td>"+$(tds[2]).html()+"</td>"
				+"<td>"+$(tds[3]).html()+"</td>"+"<td>"+$(tds[4]).html()+"</td>"
				+"<td>"+$(tds[5]).html()+"</td>"+"<td>"+$(tds[6]).html()+"</td>"
				+"<td>"+$(tds[7]).html()+"</td>"+"<td>"+$(tds[8]).html()+"</td>"
				+"<td>"+$(tds[9]).html()+"</td>"+"<td>"+prod_date+"</td></tr>"
				printhtml+=tbhtml;

		});
		//alert(printhtml);
		$("#printarea").append(printhtml);
		busNoList=busNoList.substring(0,busNoList.length-1);
		 setTimeout(function (){
			 if(printFlag){
				 window.print();	
			 }				 			       				
			},500);
	});
});
//初始化页面
function initPage(){
	getBusNumberSelect('#nav-search-input');
	getOrderNoSelect("#input_order_no","","","");
	ajaxQuery();
	$("#checkall").attr("checked",false);
}

//ajax 查询
function ajaxQuery(){
	$("#checkall").attr("checked",false);
	var orderNo=$("#input_order_no").val();
	var busNoStart=$("#input_busno_start").val();
	var busNoEnd=$("#input_busno_end").val();
	
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
			pageLength: 11,
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
						"orderNo":orderNo,
						"busNoStart":busNoStart,
						"busNoEnd":busNoEnd
					};
	            param.length = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
	            param.start = data.start;//开始的记录序号
	            param.page = (data.start / data.length)+1;//当前页码

	            $.ajax({
	                type: "post",
	                url: "getNameplatePrintList",
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
		            	return "<input type='checkbox' name='check' id='"+row.id+"'></input>";		            		
			          	 }},
			            {"title":"车身号","class":"center","data":"bus_number","defaultContent": ""},
			            {"title":"VIN","class":"center","data":"vin","defaultContent": ""},
			            {"title":"品牌","class":"center","data":"brand","defaultContent": ""},
			            {"title":"电机型号","class":"center","data":"motor_model","defaultContent": ""},
			            {"title":"底盘型号","class":"center","data": "chassis_model","defaultContent": ""},
			            {"title":"电机最<br/>大功率","class":"center","data":"motor_power","defaultContent": ""},		            
			            {"title":"最大允许<br/>总质量","class":"center","data":"max_weight","defaultContent": ""},		            
			            {"title":"电池型号","class":"center","data": "battery_model","defaultContent": ""},
			            {"title":"电池容量","class":"center","data":"battery_capacity","defaultContent": ""},
			            {"title":"额定电压","class":"center","data":"rated_voltage","defaultContent": ""},
			            {"title":"整车<br/>生产日期","class":"center","data": "productive_date","defaultContent": ""},
			            {"title":"打印人","class":"center","data":"printer","defaultContent": ""},		            
			            {"title":"打印日期","class":"center","data":"print_date","defaultContent": ""},		            
			            {"title":"","class":"center","data": "print_flag","defaultContent": ""}
			          ]		
		});
}
//打印后更新打印信息
function ajaxUpdatePrint(busNoList){
	var conditions="{'busNoList':'"+busNoList+"'}";
	$.ajax({
		type : "get",// 使用get方法访问后台
		dataType : "json",// 返回json格式的数据
		url : "afterNameplatePrint",
		data : {
			"conditions" : conditions
		},
		success:function(response){
			if(response.success){
				//alert("打印成功！");
				 //setTimeout(function (){
					 var oSettings =  $('#tableResult').dataTable().fnSettings();
					 var page=Math.floor((oSettings._iDisplayStart)/20)
					 ajaxQuery();	
			         // 获取页码值
					//alert(page);
					 setTimeout(function (){
						 $('#tableResult').dataTable().fnPageChange(page);
					 },200);
					//},100);
			}
		}
	});
}