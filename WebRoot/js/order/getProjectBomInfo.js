var pageSize=1;
var cur_year="";
var dt;

$(document).ready(function(){
	getBusNumberSelect('#nav-search-input');
	cur_year = new Date().getFullYear();
	$("#search_productive_year").val(cur_year)
	getFactorySelect("project/getProjectBomInfo",'',"#search_factory","All",'id');
	getOrderNoSelect("#search_project_no","#orderId");
	$("#btnQuery").on("click",function(){
		ajaxQuery();
	}); 
	
	ajaxQuery();

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("../production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})
});

function ajaxQuery(){
	dt=$("#tableResult").DataTable({
		serverSide: true,
		fixedColumns:   {
            leftColumns: 2,
            rightColumns:2
        },
		dom: 'Bfrtip',
		lengthMenu: [
		             [ 20, 30, 50, -1 ],
		             [ 'Show 20 rows', 'Show 30 rows', 'Show 50 rows', 'Show all rows' ]
		         ],
	    buttons: [
	        {extend:'pageLength',/*text:'显示行'*/}
	    ],
        rowsGroup:[0,1,2,3,4,5,6,7],
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
            //{"title":"Year","class":"center","data":"product_year","defaultContent": ""},
            {"title":"Delivery Date","class":"center","data": "delivery_date","defaultContent": ""},
            {"title":"Quantity","class":"center","data":"quantity","width":"75px","defaultContent": ""},
            {"title":"Plant","class":"center","data": "production_plant","defaultContent": ""},
            {"title":"Status","class":"center","data":"project_status","width":"85px","render":function(data,type,row){
            	return data=="1"?"Created":(data=="2"?"In Process":"Completed")},"defaultContent":""
            },
            {"title":"Sales Manager","class":"center","data": "sales_manager","defaultContent": ""},
            {"title":"Project Manager","class":"center","data": "project_manager","defaultContent": ""},
            {"title":"Version","class":"center","data": "version","defaultContent": ""},
            {"title":"DCN","class":"center","data": "DCN","defaultContent": ""},
            {"title":"Editor","class":"center","data": "username","defaultContent": ""},
            {"title":"Edit Date","class":"center","data": "bom_edit_date","width":"160px","defaultContent": ""},
            {"title":"","class":"center","data":null,"width":"60px","render":function(data,type,row){
            	var dcn=row.DCN!=undefined ? row.DCN : "";
            	var document_no=row.document_no!=undefined ? row.document_no : "";
            	var version=row.document_no!=undefined ? row.version : "";
                var  str="<i class=\"glyphicon glyphicon-search bigger-130\" title=\"Display\" " +
                		"onclick=\"javascript:window.location = " +
                		"('showBomInfo?version="+version+"&projectNo="+row['project_no']+"&document_no="+document_no+"&dcn="+dcn+"')\" " +
                				"style='color:blue;cursor: pointer;'></i>&nbsp;";
            	return str;
                },
            },
            {"title":"","class":"center","data":null,"width":"60px","render":function(data,type,row){
            	var dcn=row.DCN!=undefined ? row.DCN : "";
            	var document_no=row.document_no!=undefined ? row.document_no : "";
            	var version=row.document_no!=undefined ? row.version : "";
                var  str="&nbsp;<i class=\"ace-icon fa fa-upload bigger-130\" title=\"Import\" " +
                  "onclick=\"javascript:window.location = " +
                  "('importBomInfo?projectNo="+row['project_no']+"&projectId="+row['id']+"&version="+version+"&document_no="+document_no+"&dcn="+dcn+"')\" " +
                  		"style='color:green;cursor: pointer;'></i>&nbsp;";
            	return str;
                },
            }
        ],
	});
	$("#tableResult_info").addClass('col-xs-6');
	$("#tableResult_paginate").addClass('col-xs-6');
	$(".dt-buttons").css("margin-top","-50px").find("a").css("border","0px");
}





