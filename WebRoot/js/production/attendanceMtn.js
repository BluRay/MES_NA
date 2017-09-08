var dt;
var factory="";
var workshop="";
var workgroup="";
var team="";

$(document).ready(function() {
	//获取系统时间 
	var LSTR_ndate=new Date(); 
	var LSTR_MM=LSTR_ndate.getMonth()+1;
	LSTR_MM=parseInt(LSTR_MM) >= 10?LSTR_MM:("0"+LSTR_MM);
	$("#search__date").val(LSTR_ndate.getFullYear() + "-" + LSTR_MM);
	
	initPage();

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/BMS/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})
	
	$("#btnBulkAdd").click (function () {
		$(".dt-buttons").css("margin-top","-120px");
		$("#divBulkAdd").show();
	});
	
	$("#btnBulkHide").click (function () {
		$("#divBulkAdd").hide();
		$(".dt-buttons").css("margin-top","-50px");
	});
	
	$("#btn_upload").click (function () {
		$("#uploadRewardsForm").ajaxSubmit({
			url:"uploadAttendance",
			type: "post",
			dataType:"json",
			success:function(response){
		    	$.gritter.add({
					title: '系统提示：',
					text: '<h5>'+response.message+'！</h5>',
					class_name: 'gritter-info'
				});
				ajaxQuery();
			}			
		});
	});
})

function initPage() {
	getBusNumberSelect('#nav-search-input');
	getOrgAuthTree($("#workGroupTree"),'production/attendanceIndex',"1,2,3,4",'1',3);
	
	$('#workGroupTree').height($(window).height()-110)
	$('#workGroupTree').ace_scroll({
		size:$(this).attr('data-size')|| $(window).height()-110,
		mouseWheelLock: true,
		alwaysVisible : true
	});
	
	var nodes = zTreeObj.getSelectedNodes();
	if(nodes.length>0){
		var treeNode = nodes[0];
		if(treeNode.org_type=='1'){
			factory=treeNode.displayName;
			workshop="";
			workgroup="";
			team="";
		}	
		if(treeNode.org_type == '2'){
			factory=treeNode.getParentNode().displayName;
			workshop=treeNode.displayName;
			workgroup="";
			team="";
		}
		if(treeNode.org_type == '3'){
			factory=treeNode.getParentNode().getParentNode().displayName;
			workshop=treeNode.getParentNode().displayName;
			workgroup=treeNode.displayName;
			team="";
		}
		if(treeNode.org_type == '4'){
			factory=treeNode.getParentNode().getParentNode().getParentNode().displayName;
			workshop=treeNode.getParentNode().getParentNode().displayName;
			workgroup=treeNode.getParentNode().displayName;
			team=treeNode.displayName;
		}
	}
	
	$("#btnQueryRewards").on('click', function(e) {
		ajaxQuery();
	});
	
	$("#new_staff_number").blur(function(){
		$.ajax({
			url: "/BMS/common/getStaffNameByNumber",
		    dataType: "json",
		    async: false,
		    type: "get",
		    data: {
		    	"staff_number":$("#new_staff_number").val(),
		    },
		    success:function(response){
		    		if(response.data==null){
		    			alert("员工不存在，请重新输入");
		    			$("#new_staff_number").val("");
		    		}else{
		    			$("#new_staff_name").html(response.data);
		    		}
		    		
		    }
		});
	});
}	

function zTreeBeforeClick(treeId, treeNode, clickFlag) {
}

function zTreeOnClick(event, treeId, treeNode) {
	
	if(treeNode.org_type=='1'){
		factory=treeNode.displayName;
		workshop="";
		workgroup="";
		team="";
	}	
	if(treeNode.org_type == '2'){
		factory=treeNode.getParentNode().displayName;
		workshop=treeNode.displayName;
		workgroup="";
		team="";
	}
	if(treeNode.org_type == '3'){
		factory=treeNode.getParentNode().getParentNode().displayName;
		workshop=treeNode.getParentNode().displayName;
		workgroup=treeNode.displayName;
		team="";
	}
	if(treeNode.org_type == '4'){
		factory=treeNode.getParentNode().getParentNode().getParentNode().displayName;
		workshop=treeNode.getParentNode().getParentNode().displayName;
		workgroup=treeNode.getParentNode().displayName;
		team=treeNode.displayName;
		org_id=treeNode.id;
	}
	ajaxQuery();
};

function ajaxQuery(){
	dt=$("#tableResult").DataTable({
		serverSide: true,
        paging:true,
        bLengthChange: true, //改变每页显示数据数量
        iDisplayLength:30,
		dom: 'Bfrtip',
		lengthMenu: [[30, 50, 100, -1], ['显示30行', '显示50行', '显示100行', "全部"]],
	    buttons: [
	        {extend:'excelHtml5',title:'data_export',className:'black',text:'<i class=\"fa fa-file-excel-o bigger-130\" tooltip=\"导出excel\"></i>'},
	        {extend:'pageLength',text:'显示30行'}
	    ],
		ordering:false,
		searching: false,
		bAutoWidth:false,
		destroy: true,
		sScrollY: document.documentElement.clientHeight-250 + 'px',
		scrollX: "100%",
		/*scrollCollapse: true,*/
		pageLength: 30,
		pagingType:"full_numbers",
		lengthChange:true,
		orderMulti:false,
		language: {
			lengthMenu: "每页显示_MENU_",
			emptyTable:"抱歉，未查询到数据！",
			info:"共计 _TOTAL_ 条，当前第 _PAGE_ 页 共 _PAGES_ 页",
			infoEmpty:"",
			paginate: {
			  first:"首页",
		      previous: "上一页",
		      next:"下一页",
		      last:"尾页",
		      loadingRecords: "请稍等,加载中...",		     
			},
			
		},
		ajax:function (data, callback, settings) {
			var param ={
				"draw":1,
				"factory":factory,
				"workshop":workshop,
				"workgroup":workgroup,
				"team":team,				
				"staff_number":$("#search_staff_number").val(),
				"month":$("#search__date").val()
			};
            param.length = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;//开始的记录序号
            param.page = (data.start / data.length)+1;//当前页码

            $.ajax({
                type: "post",
                url: "getAttendanceList",
                cache: true,  //禁用缓存
                data: param,  //传入组装的参数
                dataType: "json",
                success: function (result) {
                    //console.log(result);
                	//封装返回数据
                    var returnData = {};
                    returnData.draw = data.draw;//这里直接自行返回了draw计数器,应该由后台返回
                    returnData.recordsTotal = result.total;//返回数据全部记录
                    returnData.recordsFiltered = result.total;//后台不实现过滤功能，每次查询均视作全部结果
                    returnData.data = result.rows;//返回的数据列表
                    callback(returnData);
                }
            });
		
		},
		columns: [
            {"title":"工号","width":"60","class":"center","data":"staff_number","defaultContent": ""},
            {"title":"姓名","width":"70","class":"center","data":"name","defaultContent": ""},
            {"title":"出勤天数","width":"65","class":"center","data":"attendance_days","defaultContent": ""},
            {"title":"总出勤","width":"50","class":"center","data":"attendance_hours","defaultContent": ""},
            {"title":"1","class":"center","data":"D1","defaultContent": ""},
            {"title":"2","class":"center","data":"D2","defaultContent": ""},
            {"title":"3","class":"center","data":"D3","defaultContent": ""},
            {"title":"4","class":"center","data":"D4","defaultContent": ""},
            {"title":"5","class":"center","data":"D5","defaultContent": ""},
            {"title":"6","class":"center","data":"D6","defaultContent": ""},
            {"title":"7","class":"center","data":"D7","defaultContent": ""},
            {"title":"8","class":"center","data":"D8","defaultContent": ""},
            {"title":"9","class":"center","data":"D9","defaultContent": ""},
            {"title":"10","class":"center","data":"D10","defaultContent": ""},
            {"title":"11","class":"center","data":"D11","defaultContent": ""},
            {"title":"12","class":"center","data":"D12","defaultContent": ""},
            {"title":"13","class":"center","data":"D13","defaultContent": ""},
            {"title":"14","class":"center","data":"D14","defaultContent": ""},
            {"title":"15","class":"center","data":"D15","defaultContent": ""},
            {"title":"16","class":"center","data":"D16","defaultContent": ""},
            {"title":"17","class":"center","data":"D17","defaultContent": ""},
            {"title":"18","class":"center","data":"D18","defaultContent": ""},
            {"title":"19","class":"center","data":"D19","defaultContent": ""},
            {"title":"20","class":"center","data":"D20","defaultContent": ""},
            {"title":"21","class":"center","data":"D21","defaultContent": ""},
            {"title":"22","class":"center","data":"D22","defaultContent": ""},
            {"title":"23","class":"center","data":"D23","defaultContent": ""},
            {"title":"24","class":"center","data":"D24","defaultContent": ""},
            {"title":"25","class":"center","data":"D25","defaultContent": ""},
            {"title":"26","class":"center","data":"D26","defaultContent": ""},
            {"title":"27","class":"center","data":"D27","defaultContent": ""},
            {"title":"28","class":"center","data":"D28","defaultContent": ""},
            {"title":"29","class":"center","data":"D29","defaultContent": ""},
            {"title":"30","class":"center","data":"D30","defaultContent": ""},
            {"title":"31","class":"center","data":"D31","defaultContent": ""}
          ],
	});
	$(".dt-buttons").css("margin-top","-50px").find("a").css("border","1px");
	$(".dt-buttons").css("padding-right","20px");
	//$(".dt-buttons").css("position","absolute");
	
	$("#tableResult_info").addClass('col-xs-5');
	$("#tableResult_paginate").addClass('col-xs-7');
}
