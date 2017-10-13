var pageSize=1;
var dt;
$(document).ready(function(){
	initPage();
	function initPage(){
		getBusNumberSelect('#nav-search-input');
		getOrderNoSelect("#search_project_no","#orderId");
	}
	$("#btnQuery").on("click",function(){
		ajaxQuery();
	}); 
	
	ajaxQuery();
	$(":radio").click(function(){
    	var type=$(this).val();
    	if(type=='0'){
    		ajaxQuery(); // 查询当前版本
    	}else if(type=='1'){
    		ajaxCompareQuery(); // 与前一版本比较
    	}else if(type=='2'){
    		ajaxCompareQuery('difference');  // 显示两版本不同数据
    	}
    });
	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/BMS/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})
	$('#btnBack').click(function(event) {
		window.open("../project/getProjectBomInfo","_parent");
	});
});
function ajaxQuery(){
	if($.fn.dataTable.isDataTable("#tableResult")){
		$('#tableResult').DataTable().destroy();
		$('#tableResult').empty();
	}
	if($("#search_project_no").val()==''){
		alert("Project No. cannot be null");
		$("#search_project_no").focus();
		return false;
	}
	$(".divLoading").addClass("fade in").show();
    $.ajax({
        type: "post",
        url: "getBomItemList",
        cache: false,  //禁用缓存
        data: {
        	"sapNo":$("#search_sap_no").val(),
			"projectNo":$("#search_project_no").val(),
			"stationCode":$("#search_station_code").val()
        },  //传入组装的参数
        dataType: "json",
        success: function (result) {
        	$(".divLoading").hide();
            var datalist=result.data;
            var columns=[
	            {"title":"item No.","class":"center","width":"45px","data":"item_no","defaultContent": ""},
	            {"title":"SAP_material","class":"center","data":"SAP_material","defaultContent": ""},
	            {"title":"BYD_P/N","class":"center","data":"BYD_NO","defaultContent": ""},
	            {"title":"Part Name","class":"center","data": "part_name","defaultContent": ""},
	            {"title":"Specification","class":"center","width":"160px","data":"specification","defaultContent": ""},
	            {"title":"Unit","class":"center","width":"45px","data": "unit","defaultContent": ""},
	            {"title":"Quantity","class":"center","width":"60px","data": "quantity","defaultContent": ""},
	            {"title":"English Description","class":"center","data": "en_description","defaultContent": ""},
	            {"title":"Vendor","class":"center","data": "vendor","defaultContent": ""},
	            {"title":"Station Code","class":"center","width":"80px","data": "station_code","defaultContent": ""},
	            {"title":"Note","class":"center","data": "note","defaultContent": ""},
	        ];

 					$("#tableResult").DataTable({
 						paiging:false,
// 						fixedColumns:   { //固定列，行有错位现象
// 				            leftColumns: 1,
// 				            rightColumns:0
// 				        },
 						ordering:false,
 						processing:true,
 						searching: false,
 						autoWidth:false,
 						paginate:false,
 						sScrollY: $(window).height()-250,
 						scrollX: true,
 						scrollCollapse: true,
 						lengthChange:false,
 						orderMulti:false,
 						info:false,
 						language: {
 						},
 						data:datalist,
 						columns:columns
 					});
 				var head_width=$(".dataTables_scrollHead").width();
                $(".dataTables_scrollHead").css("width",head_width-15);
 				$(".divLoading").hide();
        }

    });
}

function ajaxCompareQuery(type){
	if($.fn.dataTable.isDataTable("#tableResult")){
		$('#tableResult').DataTable().destroy();
		$('#tableResult').empty();
	}
	if($("#search_project_no").val()==''){
		alert("Project No. cannot be null");
		$("#search_project_no").focus();
		return false;
	}
	$(".divLoading").addClass("fade in").show();
    $.ajax({
        type: "post",
        url: "getBomCompareList",
        cache: false,  //禁用缓存
        data: {
        	"sapNo":$("#search_sap_no").val(),
			"projectNo":$("#search_project_no").val(),
			"stationCode":$("#search_station_code").val(),
			"compareType":type
        },  //传入组装的参数
        dataType: "json",
        success: function (result) {
        	$(".divLoading").hide();
        	if(result.error!='' && result.error!=undefined){
        		$.gritter.add({
					title: 'Message：',
					text: "<h5>"+result.error+"！</h5>",
					class_name: 'gritter-info'
				});
        	}
            var datalist=result.data;
            var columns=[
                        {"title":"","class":"center","width":"45px","data":"version","defaultContent": ""},
 			            {"title":"item No.","class":"center","width":"45px","data":"item_no","defaultContent": ""},
 			            {"title":"SAP_material","class":"center","data":"SAP_material","defaultContent": ""},
 			            {"title":"BYD_P/N","class":"center","data":"BYD_NO","defaultContent": ""},
 			            {"title":"Part Name","class":"center","data": "part_name","defaultContent": ""},
 			            {"title":"Specification","class":"center","width":"160px","data":"specification","defaultContent": ""},
 			            {"title":"Unit","class":"center","width":"45px","data": "unit","defaultContent": ""},
 			            {"title":"Quantity","class":"center","width":"60px","data": "quantity","defaultContent": ""},
 			            {"title":"English Description","class":"center","data": "en_description","defaultContent": ""},
 			            {"title":"Vendor","class":"center","data": "vendor","defaultContent": ""},
 			            {"title":"Station Code","class":"center","width":"80px","data": "station_code","defaultContent": ""},
 			            {"title":"Note","class":"center","data": "note","defaultContent": ""},
 			        ];

 					$("#tableResult").DataTable({
 						paiging:false,
// 						fixedColumns:   { //固定列，行有错位现象
// 				            leftColumns: 1,
// 				            rightColumns:0
// 				        },
 						ordering:false,
 						processing:true,
 						searching: false,
 						autoWidth:false,
 						paginate:false,
 						sScrollY: $(window).height()-250,
 						scrollX: true,
 						scrollCollapse: true,
 						lengthChange:false,
 						orderMulti:false,
 						info:false,
 						language: {
 							processing: "",
 							emptyTable:"",					     
 							infoEmpty:"",
 							zeroRecords:""
 						},
 						aoColumnDefs : [
 			                {
 			                "aTargets" :[0],
 			                "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) { 
 			                	if($(nTd).text()=='prev'){
 			                		//数据格式错误 整行用红色字体标示
 			                		$(nTd).text("-");
 			                		$(nTd).parent().css('color', 'blue');
 				                	$(nTd).css('font-weight', 'bold');
 			                	}else if($(nTd).text()=='current'){
 			                		//数据格式错误 整行用红色字体标示
 			                		$(nTd).text("+");
 			                		$(nTd).parent().css('color', 'red');
 				                	$(nTd).css('font-weight', 'bold');
 			                	}else{
 			                		$(nTd).text("");
 			                	}
 			                }   
 			                },
 			            ],
 						data:datalist,
 						columns:columns
 					});
 				var head_width=$(".dataTables_scrollHead").width();
                 $(".dataTables_scrollHead").css("width",head_width-15);
 				$(".divLoading").hide();
        }

    });
}




