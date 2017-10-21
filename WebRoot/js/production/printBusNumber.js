var dt="";
$(document).ready(function () {	
	initPage();
	function initPage(){
		getBusNumberSelect('#search_bus_number');
		getOrderNoSelect("#search_project_no","#orderId");
		getFactorySelect("production/printBusNumber",'',"#search_plant","All",'id');
	};

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("../production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	});
	
	$("#btnQuery").click (function () {
		ajaxQuery();
	});
	
	window.onafterprint=function(){
		 ajaxUpdatePrint(vinList);
	}
	//打印后更新打印信息
	function ajaxUpdatePrint(busNoList){
		$.ajax({
			type : "get",// 使用get方法访问后台
			dataType : "json",// 返回json格式的数据
			url : "afterVinPrint",
			data : {
				"conditions" : vinList
			},
			success:function(response){
				if(response.success){
//					//alert("打印成功！");
//					 setTimeout(function (){
//						 ajaxQuery();				
//						},1000);
				}
			}
		});
	}
	//打印
	$(document).on('click', '#btnPrint',function(){
		$("#printarea").html("");
		var printFlag=true;
		vinList="";//获取要打印的车号列表
		var count=0;
		var printhtml="";
		var flag=true;
		$("#tableResult tbody :checkbox").each(function(){
			if($(this).prop("checked")){
				if($(this).parents("tr").children().eq(4).text()==''){
					flag=false;
					return false;
				}
				vinList+=$(this).parents("tr").children().eq(4).text()+",";
				printhtml+="<div class=\"printConfigure printable toPrint\" style=\"padding-top:10px;padding-bottom:10px;line-height:40px;\" ><table border=0>"
					+"<tr ><td style=\"text-align:right; font-size:26px;font-weight:bold; height:35px; padding-left:0px\">Project No.：</td>" +
							"<td style=\"text-align:left; font-size:22px;font-weight:bold; width:270px;height:35px \">"+$(this).parents("tr").children().eq(2).text()+"</td></tr>"+
					"<tr><td style=\"text-align:right; font-size:26px; font-weight:bold;height:35px; padding-left:0px;\">Bus Number：</td>"
					+"<td style=\"text-align:left; font-size:26px; font-weight:bold;width:270px;height:35px;\">"+$(this).parents("tr").children().eq(3).text()+"</td></tr>"+
					"<tr><td style=\"text-align:right; font-size:26px;font-weight:bold;height:35px;padding-left:0px\">VIN：</td>"
					+"<td style=\"text-align:left; font-size:26px;font-weight:bold ;width:270px;height:35px; \">"+$(this).parents("tr").children().eq(4).text()+"</td></tr></table>"
					+"<div id=\"bcTarget"+count+"\" style=\"width:300px; height:60px;margin-top:10px;text-align:center;margin:0 auto\"></div></div>";
				count++;
			}
		});
		if(flag==false){
			alert(Warn['P_printBusNumber_01']);
			return false;
		}
		if(printhtml==""){
			alert(Warn['P_printBusNumber_02']);
			return false;
		}
		$("#printarea").append(printhtml);
		vinList=vinList.substring(0,vinList.length-1);
		for(var i=0;i<count;i++){
			var arr=vinList.split(",");
			$("#bcTarget"+i).barcode(arr[i], "code128",{barWidth:2, barHeight:70,showHRI:false});
		}
		
		if(vinList.length==0){
			printFlag=false;
		}else
		 setTimeout(function (){
			 if(printFlag){
				 window.print();
			 }else{
				 alert(Warn['P_printBusNumber_02']);
			 }
		},0);
	});
	$(document).on('change', '.selectAll',function(){
	    $('#table tbody :checkbox').prop("checked",this.checked); 
	}); 
});

function ajaxQuery(){
	
    dt=$("#tableResult").DataTable({
		serverSide: true,
		dom: 'Bfrtip',
		lengthMenu: [
            [ 20, 50,100, -1 ],
            [ 'Show 20 rows', 'Show 30 rows', 'Show 50 rows', 'Show all rows' ]
        ],
	    buttons: [
	        {extend:'excelHtml5',title:'data_export',className:'black',text:'<i class=\"fa fa-file-excel-o bigger-130\" tooltip=\"导出excel\"></i>'},
	        {extend:'pageLength',/*text:'显示行'*/}
	    ],
		paiging:true,
		ordering:false,
		searching: false,
		autoWidth:false,
		destroy: true,
		scrollY: $(window).height()-250,
		scrollX: $(window).width(),
		/*scrollCollapse: true,*/
		pageLength: 20,
		pagingType:"full_numbers",
		lengthChange:false,
		orderMulti:false,
		language: {
			
		},
		ajax:function (data, callback, settings) {
			var param ={
				"draw":1,
				"project_no":$("#search_project_no").val(),
				"bus_number":$("#search_bus_number").val(),
				"print_flag":$("#search_print_flag").val(),
				"plant":$("#search_plant").val()
			};
            param.length = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;//开始的记录序号
            param.page = (data.start / data.length)+1;//当前页码

            $.ajax({
                type: "post",
                url: "showBusNumberList",
                data: param,  //传入组装的参数
                dataType: "json",
                success: function (result) {
                    console.log(result);
                	//封装返回数据
                    var returnData = {};
                    returnData.draw = data.draw;//这里直接自行返回了draw计数器,应该由后台返回
                    returnData.recordsTotal = result.recordsTotal;//返回数据全部记录
                    returnData.recordsFiltered = result.recordsTotal;//后台不实现过滤功能，每次查询均视作全部结果
                    returnData.data = result.data;//返回的数据列表
                    callback(returnData);
                }
            });
		
		},
		columns: [
			{"title":"<input type='checkbox' id='selectAll' onclick='selectAll()'/>","class":"center","data":"id","render": function ( data, type, row ) {
			    return "<input id='id' value='"+data+"' type='hidden' /><input type='checkbox' fid='cb_"+data+"'>";
			},"defaultContent": ""},
            {"title":"Plant","class":"center","data":"plant","defaultContent": ""},
            {"title":"Project No.","class":"center","data":"project_no","defaultContent": ""},
            {"title":"Bus No.","class":"center","data":"bus_number","defaultContent": ""},
            {"title":"VIN","class":"center","data": "VIN","defaultContent": ""},
            {"title":"Print Flag","class":"center","data":"print_flag","render":function(data, type, row){
            	return (data=="1") ? "Printed" : "Not Print";
            },"defaultContent": ""},
            {"title":"Number of Prints","class":"center","data":"print_times","defaultContent": ""},
            {"title":"Printer","class":"center","data": "username","defaultContent": ""},
            {"title":"Print Date","class":"center","data": "print_date","defaultContent": ""},
        ],
		
	});
	$("#tableResult_info").addClass('col-xs-6');
	$("#tableResult_paginate").addClass('col-xs-6');
	$(".dt-buttons").css("margin-top","-50px").find("a").css("border","0px");
}
  //复选框全选或反选
function selectAll() {
    if ($("#selectAll").prop("checked")) {
        $(":checkbox").prop("checked", true);
    } else {
        $(":checkbox").prop("checked", false);
    }
}