var dt;
var factory="";
var workshop="";

$(document).ready(function() {
	//获取系统时间 
	var LSTR_ndate=new Date(); 
	var LSTR_MM=LSTR_ndate.getMonth()+1;
	LSTR_MM=parseInt(LSTR_MM) >= 10?LSTR_MM:("0"+LSTR_MM);
	$("#search_rewards_date").val(LSTR_ndate.getFullYear() + "-" + LSTR_MM);
	
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
			url:"uploadRewards",
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
	getOrgAuthTree($("#workGroupTree"),'production/rewardsIndex',"1,2",'1',1);
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
	
	$("#btnAdd").on('click', function(e) {
		getFactorySelect("production/rewardsIndex",'',"#new_rewards_factory",null,'id');
		getWorkshopSelect("production/rewardsIndex",$("#new_rewards_factory :selected").text(),"","#new_rewards_workshop",null,"id");
		e.preventDefault();
		$("#dialog-add").removeClass('hide').dialog({
			resizable: false,
			title: '<div class="widget-header"><h4 class="smaller"><i class="ace-icon fa fa-users green"></i> 新增奖惩记录</h4></div>',
			title_html: true,
			width:580,
			height:510,
			modal: true,
			buttons: [{
						text: "取消",
						"class" : "btn btn-minier",
						click: function() {$( this ).dialog( "close" );} 
					},
					{
						text: "保存",
						id:"btn_ok",
						"class" : "btn btn-success btn-minier",
						click: function() {
							btnNewConfirm();
						} 
					}
				]
		});
	});
	$("#btnQueryRewards").on('click', function(e) {
		ajaxQuery();
	});
	
	$("#btnDeleteRewards").on('click', function(e) {
		var ids = '';
		$(":checkbox").each(function(){
			if($(this).prop("checked")){
				//alert($(this).attr('fid'));
				if($(this).attr('fid')){
					ids += $(this).attr('fid').split('_')[1] + ',';
				}
			}
		});
		if(ids===''){
			$.gritter.add({
				title: '系统提示：',
				text: '<h5>请至少勾选一个要删除的岗位！</h5>',
				class_name: 'gritter-info'
			});
			return false;
		}
		$.ajax({
		    url: "deleteRewards",
		    dataType: "json",
			type: "get",
		    data: {
		    	"ids" : ids.substring(0,ids.length-1)
		    },
		    success:function(response){
		    	if(response.success){
		    	$.gritter.add({
					title: '系统提示：',
					text: '<h5>删除奖惩成功！</h5>',
					class_name: 'gritter-info'
				});
		    	
		    	ajaxQuery();
		    	}else{
		    		$.gritter.add({
						title: '系统提示：',
						text: '<h5>删除奖惩失败！</h5><br>'+response.message,
						class_name: 'gritter-info'
					});
		    	}
		    }
		});
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
	}	
	if(treeNode.org_type == '2'){
		factory=treeNode.getParentNode().displayName;
		workshop=treeNode.displayName;
	}
	
	ajaxQuery();
};

function ajaxQuery(){
	dt=$("#tableResult").DataTable({
		serverSide: true,
        paging:true,
        bLengthChange: true, //改变每页显示数据数量
        iDisplayLength:20,
		dom: 'Bfrtip',
		lengthMenu: [[20, 30, 50, -1], ['显示20行', '显示30行', '显示50行', "全部"]],
	    buttons: [
	        {extend:'excelHtml5',title:'data_export',className:'black',text:'<i class=\"fa fa-file-excel-o bigger-130\" tooltip=\"导出excel\"></i>'},
	        {extend:'pageLength',text:'显示20行'}
	    ],
		ordering:false,
		searching: false,
		bAutoWidth:false,
		destroy: true,
		sScrollY: document.documentElement.clientHeight-250 + 'px',
		scrollX: "100%",
		/*scrollCollapse: true,*/
		pageLength: 20,
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
				"staff_number":$("#search_staff_number").val(),
				"rewards_date":$("#search_rewards_date").val()
			};
            param.length = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;//开始的记录序号
            param.page = (data.start / data.length)+1;//当前页码

            $.ajax({
                type: "post",
                url: "getRewardsList",
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
			{"title":"<input type='checkbox' id='selectAll' onclick='selectAll()'/>","width":"30","class":"center","data":"id","render": function ( data, type, row ) {
			    return "<input id='id' value='"+data+"' type='hidden' /><input type='checkbox' fid='cb_"+data+"'>";
			},"defaultContent": ""},
            {"title":"工号","class":"center","data":"staff_number","defaultContent": ""},
            {"title":"姓名","class":"center","data":"name","defaultContent": ""},
            {"title":"奖惩工厂","class":"center","data":"rewards_factory","defaultContent": ""},
            {"title":"奖惩车间","class":"center","data":"rewards_workshop","defaultContent": ""},
            {"title":"日期","class":"center","data":"rewards_date","defaultContent": ""},
            {"title":"事由","width":"150","class":"center","data":"reasons","defaultContent": ""},
            {"title":"奖励","class":"center","data":"add","defaultContent": ""},
            {"title":"扣分","class":"center","data":"deduct","defaultContent": ""},
            {"title":"班组长","class":"center","data":"group_leader","defaultContent": ""},
            {"title":"领班","class":"center","data":"gaffer","defaultContent": ""},
            {"title":"处罚建议人","class":"center","data":"proposer","defaultContent": ""}
          ],
	});
	$(".dt-buttons").css("margin-top","-50px").find("a").css("border","1px");
	$(".dt-buttons").css("padding-right","20px");
	//$(".dt-buttons").css("position","absolute");
	
	$("#tableResult_info").addClass('col-xs-6');
	$("#tableResult_paginate").addClass('col-xs-6');
}

function btnNewConfirm(){
	
	//数据验证deduct
	if(($("#new_staff_number").val() == '')||($("#new_rewards_date").val() == '')||($("#new_reasons").val() == '')||($("#new_group_leader").val() == '')){
		alert('请输入完整奖惩数据！');
		$("#btn_ok").removeAttr("disabled");
		return false;
	}else if(isNaN($("#new_add").val())||isNaN($("#new_deduct").val())){
		alert('奖惩扣分必须为数字！');
		$("#btn_ok").removeAttr("disabled");
		return false;
	}else if ($("#new_rewards_factory").val()==''){
		alert('请选择工厂！');
		$("#btn_ok").removeAttr("disabled");
		return false;
	}else if ($("#new_rewards_workshop").val()==''){
		alert('请选择车间！');
		$("#btnAddConfirm").removeAttr("disabled");
		return false;
	}
	$("#btn_ok").attr("disabled","disabled");
	
	$.ajax({
		url: "addRewards",
	    dataType: "json",
	    async: false,
	    type: "get",
	    data: {
	    	"staff_number":$("#new_staff_number").val(),
	    	"rewards_factory":$("#new_rewards_factory").find("option:selected").text(),
	    	"rewards_workshop":$("#new_rewards_workshop").find("option:selected").text(),
	    	"rewards_date":$("#new_rewards_date").val(),
	    	"reasons":$("#new_reasons").val(),
	    	"deduct":$("#new_deduct").val(),
	    	"add":$("#new_add").val(),
	    	"group_leader":$("#new_group_leader").val(),
	    	"gaffer":$("#new_gaffer").val(),
	    	"proposer":$("#new_proposer").val(),
	    },
	    success:function(response){
	    	if (response.data>0) {
		    	$.gritter.add({
					title: '系统提示：',
					text: '<h5>保存成功！</h5>',
					class_name: 'gritter-info'
				});
	    		$("#dialog-add").dialog( "close" ); 
	    		$("#btn_ok").removeAttr("disabled");
	    		
	    		ajaxQuery();
	    	} else {
		    	$.gritter.add({
					title: '系统提示：',
					text: '<h5>保存失败！</h5>',
					class_name: 'gritter-info'
				});
	    	}
	    }
	});
	
}

//复选框全选或反选
function selectAll() {
    if ($("#selectAll").prop("checked")) {
        $(":checkbox").prop("checked", true);
    } else {
        $(":checkbox").prop("checked", false);
    }
}