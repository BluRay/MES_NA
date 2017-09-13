var pageSize=1;
var table;
var table_height = $(window).height()-250;
$(document).ready(function () {	
	initPage();
	
	function initPage(){
		getBusNumberSelect('#nav-search-input');
		$("#file").val("");
		getOrderNoSelect("#search_project_name","#orderId");
		getFactorySelect("plan/planRevision",'',"#search_factory",null,'id');
		//ajaxQuery();
	}

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/BMS/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})
	
	//文件控件初始化
	$('#file').ace_file_input({
		no_file:'Please Choose xls File...',
		btn_choose:'Choose File',
		btn_change:'Change File',
		droppable:false,
		onchange:null,
		thumbnail:false, //| true | large
		allowExt: ['xls','XLS'],
	}).on('file.error.ace', function(event, info) {
		alert("Please Choose xls File!");
    });
	
	$("#btnBulkAdd").click (function () {
		$("#divBulkAdd").show();
	});
	
	$("#btnBulkHide").click (function () {
		$("#divBulkAdd").hide();
	});
	
	$("#btnQuery").click (function () {
		ajaxQuery();
	});
	
	$("#btn_upload").click (function () {
		$("#btn_upload").attr("disabled","disabled");
		$("#uploadMasterPlanForm").ajaxSubmit({
			url:"uploadMasterPlan",
			type: "post",
			dataType:"json",
			success:function(response){
				alert(response.message);
				ajaxQuery();
				if(response.success){
					$("#btn_upload").removeAttr("disabled");
				}
			}			
		});
	});
});

function ajaxQuery(){
	$("#tableData").dataTable({
		serverSide: true,paiging:true,ordering:false,searching: false,bAutoWidth:false,
		destroy: true,sScrollY: table_height,scrollX: "100%",orderMulti:false,
		pageLength: 25,pagingType:"full_numbers",lengthChange:false,
		language: {
			emptyTable:"Nothing found",
			info:"Total _TOTAL_，Showing page _PAGE_ of _PAGES_",
			infoEmpty:"",
			paginate: { first:"First",previous: "Previous",next:"Next",last:"Last",loadingRecords: "Loading..."}
		},
		ajax:function (data, callback, settings) {
			var param ={
				"draw":1,
				"production_plant":$("#search_factory :selected").text(),
				"project_no":$("#search_project_no").val()
			};
            param.length = data.length;					//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;					//开始的记录序号
            param.page = (data.start / data.length)+1;	//当前页码

            $.ajax({
                type: "post",
                url: "showPlanMasterIndex",
                cache: false,  //禁用缓存
                data: param,  //传入组装的参数
                dataType: "json",
                success: function (result) {
                    //console.log(result);
                	//封装返回数据
                    var returnData = {};
                    returnData.draw = data.draw;						//这里直接自行返回了draw计数器,应该由后台返回
                    returnData.recordsTotal = result.recordsTotal;		//返回数据全部记录
                    returnData.recordsFiltered = result.recordsTotal;	//后台不实现过滤功能，每次查询均视作全部结果
                    returnData.data = result.data;						//返回的数据列表
                    //console.log(returnData);
                    //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                    //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                    callback(returnData);
                }
            });
		},
		columns: [
		            {"title":"Plan Version","class":"center","data":"version","defaultContent": ""},
		            {"title":"Production Plant","class":"center","data":"factory_name","defaultContent": ""},
		            {"title":"Project no","class":"center","data":"project_no","defaultContent": ""},
		            {"title":"Plan Month","class":"center","data":"month","defaultContent": ""},
		            {"title":"Edit User","class":"center","data":"display_name","defaultContent": ""},
		            {"title":"Edit Time","class":"center","data":"create_date","defaultContent": ""},
		            {"title":"Operation","class":"center","data": null,"id":"staff_number",
		            	"render": function ( data, type, row ) {
		                    return "<i class=\"glyphicon glyphicon-search bigger-130 showbus\" title=\"查看详情\" onclick=\"javascript:window.location = ('planPreview?version="+row['version'] + "&plan_month="+row['plan_month'] + "&factory_id=" +$("#search_factory").val()+"')\" style='color:blue;cursor: pointer;'></i>&nbsp;";
		                },
		            }
		          ],
	});
}
