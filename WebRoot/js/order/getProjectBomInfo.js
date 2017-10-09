var pageSize=1;
var cur_year="";
var dt;

$(document).ready(function(){
	getBusNumberSelect('#nav-search-input');
	cur_year = new Date().getFullYear();
	$("#search_productive_year").val(cur_year)
	//getFactorySelect("project/getProjectBomInfo",'',"#search_factory","全部",'id');
	//getOrderNoSelect("#search_project_no","#orderId");
	$("#btnQuery").on("click",function(){
		ajaxQuery();
	}); 
	
	ajaxQuery();

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/BMS/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})
});


function ajaxQuery(){
	dt=$("#tableResult").DataTable({
		serverSide: true,
//		fixedColumns:   {
//            leftColumns: 3,
//            rightColumns:3
//        },
       // rowsGroup:[0,1,2,3,4,5],
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
				"projectNo":$("#search_project_no").val(),
				"status":$("#search_status").val(),
				"actYear":$("#search_productive_year").val(),
				"factory":getAllFromOptions("#search_factory","val")
			};
            param.length = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;//开始的记录序号
            param.page = (data.start / data.length)+1;//当前页码

            $.ajax({
                type: "post",
                url: "getProjectBomList",
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
		            {"title":"Project No.","class":"center","data":"project_no","defaultContent": ""},
		            {"title":"Project Name","class":"center","data":"project_name","defaultContent": ""},
		            {"title":"Year","class":"center","data":"product_year","defaultContent": ""},
		            {"title":"Delivery Date","class":"center","data": "delivery_date","defaultContent": ""},
		            {"title":"Quantity","class":"center","data":"quantity","defaultContent": ""},
		            {"title":"Plant","class":"center","data": "plant","defaultContent": ""},
		            {"title":"Status","class":"center","data":"status","render":function(data,type,row){
		            	return data=="0"?"Created":(data=="1"?"In Process":"Completed")},"defaultContent":""
		            },
		            {"title":"Sales Manager","class":"center","data": "sales_manager","defaultContent": ""},
		            {"title":"Project Manager","class":"center","data": "project_manager","defaultContent": ""},
		            {"title":"Version","class":"center","data": "version","defaultContent": ""},
		            {"title":"DCN","class":"center","data": "DCN","defaultContent": ""},
		            {"title":"Editor","class":"center","data": "username","defaultContent": ""},
		            {"title":"Edit Date","class":"center","data": "edit_date","defaultContent": ""},
		            {"title":"","class":"center","data":null,"render":function(data,type,row){
		                var  str="<i class=\"glyphicon glyphicon-search bigger-130\" title=\"查看详情\" onclick=\"javascript:window.location = ('showBomInfo?version="+row['version']+"&projectNo="+row['project_no']+"')\" style='color:blue;cursor: pointer;'></i>&nbsp;"+
		                  "&nbsp;<i class=\"ace-icon fa fa-pencil bigger-130\" title=\"导入\" onclick=\"javascript:window.location = ('importBomInfo?projectNo="+row['project_no']+"&projectId="+row['id']+"')\" style='color:blue;cursor: pointer;'></i>&nbsp;";
		            	return str;
		                },
		            }
		        ],
		
	});
}





