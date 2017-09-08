$(document).ready(function(){
	
	initPage();
	
	$("#btnQuery").click(function(){
		ajaxQuery();
	})

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/BMS/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})
})

function initPage(){
	getBusNumberSelect('#nav-search-input');
	var factory_default=getQueryString("factory_id");
	getFactorySelect("",factory_default,"#search_factory","全部","id");
	var year=new Date().getFullYear();
	$("#search_year").val(year);
	ajaxQuery()
}

function ajaxQuery(){
	$(".divLoading").addClass("fade in").show();
	//先destroy datatable，隐藏form
	if($.fn.dataTable.isDataTable("#tableResult")){
		$('#tableResult').DataTable().destroy();
		$('#tableResult').empty();
	}
	
	var columns= [
	          	{"title":"车间","class":"center","data":"workshop","defaultContent": ""},
	          	{"title":"产量小计","class":"center","data":"","defaultContent": "","render":function(data,type,row){
	          		var total=0;
	          		total+=Number(row.output_1)+Number(row.output_2)+Number(row.output_3)+Number(row.output_4);
	          		total+=Number(row.output_5)+Number(row.output_6)+Number(row.output_7)+Number(row.output_8);
	          		total+=Number(row.output_9)+Number(row.output_10)+Number(row.output_11)+Number(row.output_12);
	          		return total;
	          	}},
	          	{"title":"1月","class":"center","data":"output_1","defaultContent": ""},
	            {"title":"2月","class":"center","data":"output_2","defaultContent":""},
	            {"title":"3月","class":"center","data":"output_3","defaultContent": ""},
	          	{"title":"4月","class":"center","data":"output_4","defaultContent": ""},
	          	{"title":"5月","class":"center","data":"output_5","defaultContent": ""},
	            {"title":"6月","class":"center","data":"output_6","defaultContent":""},
	            {"title":"7月","class":"center","data":"output_7","defaultContent": ""},
	          	{"title":"8月","class":"center","data":"output_8","defaultContent": ""},
	          	{"title":"9月","class":"center","data":"output_9","defaultContent": ""},
	            {"title":"10月","class":"center","data":"output_10","defaultContent":""},
	            {"title":"11月","class":"center","data":"output_11","defaultContent": ""},
	            {"title":"12月","class":"center","data":"output_12","defaultContent":""}
	          ]  
	
	var tb=$("#tableResult").DataTable({
		serverSide: true,
		fixedColumns:   {
            leftColumns: 2,
            rightColumns:2
        },
		dom: 'Bfrtip',
	    buttons: [
	        {extend:'excelHtml5',title:'data_export',className:'black',text:'<i class=\"fa fa-file-excel-o bigger-130\" tooltip=\"导出excel\"></i>'},
	        {extend:'colvis',text:'<i class=\"fa fa-list bigger-130\" tooltip=\"选择展示列\"></i>'},
	       
	    ],
	    paginate:false,
		paiging:false,
		ordering:false,
		searching: false,
		bAutoWidth:false,
		destroy: true,
		sScrollY: $(window).height()-220,
		scrollX: true,
		pagingType:"full_numbers",
		lengthChange:true,
		info:false,
		orderMulti:false,
		language: {
			emptyTable:"抱歉，未查询到数据！",
			zeroRecords:"抱歉，未查询到数据！",
			loadingRecords:"正在查询，请稍后..." 
		},
		ajax:function (data, callback, settings) {
			
			var param ={
				"draw":1,
				"factory_id":$("#search_factory").val(),
				"year":$("#search_year").val()
			};

            $.ajax({
                type: "post",
                url: "getFactoryOutputYearData",
                cache: false,  //禁用缓存
                data: param,  //传入组装的参数
                dataType: "json",
                success: function (result) {
                	$(".divLoading").hide();
                	staff_salary_list=result.data;
                    //console.log(result);
                	//封装返回数据
                    var returnData = {};
                    returnData.draw = result.draw;//这里直接自行返回了draw计数器,应该由后台返回
                    returnData.data = result.data;//返回的数据列表
                    //console.log(returnData);
                    //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                    //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                    callback(returnData);
                }
            });
		
		},
		columns: columns,
	});

	$(".dt-buttons").css("margin-top","-50px").find("a").css("border","0px");
}