var factory="";
var workshop="";
var workgroup="";
var team="";
var org = "";
var swhlist=[];
var swhupdatelist=[];
var swhdelids="";
$(document).ready(function() {
    initPage();
	
	function initPage() {
		getBusNumberSelect('#nav-search-input');
		getOrgAuthTree($("#workGroupTree"),'production/pieceWorkhourMtn',"1,2,3,4",'1',3);
		$('#workGroupTree').height($(window).height()-110)
		$('#workGroupTree').ace_scroll({
			size:$(this).attr('data-size')|| $(window).height()-110,
			mouseWheelLock: true,
			alwaysVisible : true
		});
		// 通过top页面任务栏进入，设置查询条件
		factory =getParamValue("factory");
		workshop = getParamValue("workshop");
		if(factory!="" && workshop!="" && factory!=null && workshop!=null){
			ajaxQuery();
		}
	}

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/BMS/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})
	
	$(document).on("input",".workhour",function(){
//		if(isNaN(Number($(this).val()))){
//			alert("参与度/工时只能为数字！");
//			$(this).val("");
//			return false;
//		}
	});
	$(document).on("keydown",".workhour",function(event){
		if (event.keyCode == "13") {								
			$(this).parent().parent().next().find(".workhour").focus();
		}
	})
	$(document).on("change",".workhour",function(e){
		var tr=$(e.target).closest("tr");
		var workHour=$(this).val();
		var workdateId=$(tr).data("workdateId");
		var index=parseInt($(tr).data("swhlist_index"));
		var old_value=$(this).attr("old_value");
		if(!const_float_validate.test(workHour) && workHour!=""){
			alert("等待工时只能是数字！");
			$(this).val(old_value);
			return false;
		}else if(!const_float_validate_one.test(workHour)){
			alert("等待工时只能保留一位小数！");
			$(this).val(old_value);
			return false;
		}else if(workHour<0||workHour>8){
			alert("等待工时只能位于0到8之间！");
			$(this).val(old_value);
			return false;
		}else if(workHour*10%5!=0){
			alert("等待工时录入以半小时为单位，例如：1.0,1.5,2.0！");
			$(this).val(old_value);
			return false;
		}else if(old_value!=workHour){
			swhlist[index].work_hour=workHour;
			swhlist[index].wpay=parseFloat(workHour)*parseFloat(swhlist[index].price);
			if(workdateId!=""){
				var rows=$(workdateId).attr("rowspan");
				var first_tr=$(workdateId).parent("tr");
				var first_index=parseInt($(first_tr).data("swhlist_index"));
				for(var i=first_index;i<(first_index+rows);i++){
					swhlist[i].status='0';
				}	
			}
		}
	})
	//修改人员去向
	$(document).on("change",".whereabouts",function(e){
		var tr=$(e.target).closest("tr");
		var whereabouts=$(this).val();
		var workdateId=$(tr).data("workdateId");
		var index=parseInt($(tr).data("swhlist_index"));
		var old_value=$(this).attr("old_value");
		if(old_value!=whereabouts){
			swhlist[index].whereabouts=whereabouts;
			if(workdateId!=""){
				var rows=$(workdateId).attr("rowspan");
				var first_tr=$(workdateId).parent("tr");
				var first_index=parseInt($(first_tr).data("swhlist_index"));
				for(var i=first_index;i<(first_index+rows);i++){
					swhlist[i].status='0';
				}	
			}
		}
	});
	
	// 工时删除
	$(document).on("click",".close", function(e) {
		var tr=$(e.target).closest("tr");
		var index=parseInt($(e.target).attr("swhlist_index"));
		var swhid=$(tr).data("swhid");
		var ids=$(this).attr("ids");
		var workdateId="";
		var conditions={};
		if(swhid && !ids){
			conditions.swhid=swhid;		
			workdateId=$(tr).data("workdateId");
			swhdelids+=swhid+",";
		}
		if(confirm("确认删除该条数据？")){
			if(ids){
				conditions.ids=ids;
				ajaxDelete(JSON.stringify(conditions));
				ajaxQuery();
			}else{
				swhlist.splice(index,1);
				generateTb(swhlist);
				if(workdateId!=""){
					var rows=$(workdateId).attr("rowspan");
					var first_tr=$(workdateId).parent("tr");
					var first_index=parseInt($(first_tr).data("swhlist_index"));
					for(var i=first_index;i<(first_index+rows);i++){
						swhlist[i].status='0';
					}	
				}
			}
		
		}

	});
	
	$("#btnQuery").click(function(){
		ajaxQuery();
	});
	//修改
	$("#btnModify").click(function(){
		if($("#status :selected").val()!='2'){
			alert($("#status :selected").text()+" 状态无法修改数据");
			return false;
		}
		var updateFlag=false;
		var update_swhlist=[];
		var index=0;
		for(var i=0;i<swhlist.length;i++){
			if(swhlist[i].status=='0'){
				updateFlag=true;
				update_swhlist[index]=swhlist[i];
				index++;
			}
		}
		if(!updateFlag &&swhdelids==""){
			alert("未修改数据,无法保存");
			return false;
		}
		if(swhlist.length>0){
			ajaxUpdate(JSON.stringify(update_swhlist));
		}
		if(swhdelids!=""){
			var conditions={};
			conditions.ids=swhdelids;
			ajaxDelete(JSON.stringify(conditions));
		}
	});
})
function ajaxUpdate(conditions) {
	$.ajax({
		url : "updateWaitWorkTimeInfo",
		dataType : "json",
		type : "post",
		data : {
			"conditions" : conditions,
			"flag" : "modify"
		},
		success : function(response) {
			if (response.success) {
				alert(response.message);
				ajaxQuery();
			} else {
				alert(response.message);
			}

		}
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
	}
	
	ajaxQuery();
	
};
function ajaxQuery(){
	swhlist=[];
	swhupdatelist=[];
	swhdelids="";
	var returnData = {};
	if($.fn.dataTable.isDataTable("#tableResult")){
		$('#tableResult').DataTable().destroy();
		$('#tableResult').empty();
	}
	$("#tableResult").dataTable({
		paiging:false,
		ordering:false,
		searching: false,
		autoWidth:false,

		paginate:false,
		sScrollY: $(window).height()-210,
		scrollX: true,
		scrollCollapse: true,
		lengthChange:false,
		orderMulti:false,
		info:false,
		language: {
			emptyTable:"",					     
			infoEmpty:"",
			zeroRecords:"未查询到数据！"
		},
		ajax:function (data, callback, settings) {
			var status=$("#status").val();
			var wait_reason=$("#wait_reason").val();
			var date_start=$("#date_start").val();
			var date_end=$("#date_end").val();
			var staff_number=$("#staff_number").val();
			var conditions = "{factory:'"+ factory + "',workshop:'"+workshop+ "'," +
			        "wait_reason:'"+wait_reason+"',staff_number:'"+staff_number+"',"+
			        "date_start:'"+date_start+"',date_end:'"+date_end+"',"+
					"team:'"+team+ "',status:'"+status+"'}";	
			var param ={
				conditions:conditions
			};
			
            $.ajax({
                type: "post",
                url: "getWaitWorkTimeList",
                cache: false,  //禁用缓存
                data: param,  //传入组装的参数
                dataType: "json",
                async :false,
                success: function (result) {
                	$("#tableResult_info").remove();
                	//封装返回数据
                	swhlist = result.data;
                    returnData.data = result.data;//返回的数据列表
                    
                    callback(returnData);
                }
            });
		
		},
		
		columns: [
            {"title":"","width":"25px","class": "firsttd center","data":"","defaultContent": ""},
            {"title":"等待日期","class":"center","width":"80px","data":"","defaultContent": ""},
            {"title":"等待类别","class":"center","width":"80px","data":"","defaultContent": ""},
            {"title":"等待原因","class":"center","data": "","defaultContent": ""},
            {"title":"详细原因","class":"center","data":"detail_reason","defaultContent":""},
            {"title":"工号","class":"center","width":"60px","data":"staff_number","defaultContent": ""},	
            {"title":"姓名","class":"center","width":"60px","data":"staff_name","defaultContent":""},
            {"title":"岗位","class":"center","width":"60px","data":"job","defaultContent": ""},
            {"title":"工时","class":"center","width":"60px","data":"work_hour","render":function(data,type,row){
            	return "<input type='text' class='input-small workhour' value='"+data+"' style='width:60px;height:28px;'>";
            }},
            {"title":"人员去向","class":"center","data":"whereabouts","width":"100px","render":function(data,type,row){
            	return "<input type='text' class='input-small whereabouts' value='"+data+"' style='width:100px;height:28px;'>";
            }},
            {"title":"小班组","class":"center","width":"60px","data":"","defaultContent":""},
            {"title":"班组","class":"center","width":"60px","data":"","defaultContent": ""},	
            {"title":"状态","class":"center","width":"60px","data":"","defaultContent": ""},
//            {"title":"驳回人","class":"center","data":"","defaultContent": ""},
//            {"title":"驳回时间","class":"center","data":"","defaultContent": ""},
            {"title":"","width":"25px","class":"center lasttd","data":"","defaultContent": ""}
        ],
	});
	for(var i=0;i<swhlist.length;i++){
		swhlist[i].STATUS=swhlist[i].status;
	}
	generateTb(swhlist);
}
function generateTb(swhlist){
	if(swhlist.length>0){
		$("#tableResult").find('tbody').find('tr').remove();
	}
	var last_workdate="";
	var last_detail_reason="";
	var last_wait_reason="";
	var last_wait_type="";
	var workdateId="";
	var delTdId="";
	var delbuttonId="";
	var waitReasonId="";
	var waitTypeId="";
	var detailReasonId="";
	$.each(swhlist,function(index,swh){
		//var disabled = (status_arr[swh.STATUS] != '已驳回') ? 'disabled' : "";
		var disabled=swh.STATUS!='2' ? 'disabled' : "";
		var tr=$("<tr />");	
		//操作日期合并单元格
		if(swh.work_date==last_workdate){
			var rowspan=parseInt($(workdateId).attr("rowspan"));
			$(workdateId).attr("rowspan",rowspan+1);			
			$(delTdId).attr("rowspan",rowspan+1);
			var ids=$(delbuttonId).attr("ids");
			ids+=","+swh.id;
			$(delbuttonId).attr("ids",ids);
		}else{
			 workdateId="#wd_"+index;
			 delbuttonId="#del_"+index;
			 delTdId="#delTd_"+index;
			if(disabled!='disabled'){
					$("<td class=\"center\" style=\"width:25px\" id='delTd_"+index+"' rowspan=1/>").html("<button id='del_"+index+"' type=\"button\" class=\"close\" aria-label=\"Close\"  rel=\"tooltip\" title='删除该日期下工时信息' ids='"+swh.id+"'><span aria-hidden=\"true\" class=\"center\">×</span></button>").appendTo(tr);
				}
			else{
//				$("#tableResult thead tr")find("td").find(".firsttd").remove();
				$("<td style=\"width:25px\" id='delTd_"+index+"' rowspan=1/>").html("").appendTo(tr);
			}
			$("<td class=\"center\" id='wd_"+index+"' rowspan=1/>").html(swh.work_date).appendTo(tr);
		
		}
		//等待原因合并单元格
		if(swh.work_date==last_workdate&&swh.wait_type==last_wait_type){
			var rowspan=parseInt($(waitTypeId).attr("rowspan"));
			$(waitTypeId).attr("rowspan",rowspan+1);
		}else{
			waitTypeId="#rt_"+index;
			$("<td class=\"center\" id='rt_"+index+"' rowspan=1/>").html(swh.wait_type).appendTo(tr);
		}
		//等待原因合并单元格
		if(swh.work_date==last_workdate&&swh.wait_type==last_wait_type&&swh.wait_reason==last_wait_reason){
			var rowspan=parseInt($(waitReasonId).attr("rowspan"));
			$(waitReasonId).attr("rowspan",rowspan+1);
		}else{
			waitReasonId="#rs_"+index;
			$("<td class=\"center\" id='rs_"+index+"' rowspan=1/>").html(swh.wait_reason).appendTo(tr);
		}
		//详细原因合并单元格
		if(swh.work_date==last_workdate&&swh.wait_type==last_wait_type&&swh.wait_reason==last_wait_reason&&swh.detail_reason==last_detail_reason){
			var rowspan=parseInt($(detailReasonId).attr("rowspan"));
			$(detailReasonId).attr("rowspan",rowspan+1);
		}else{
			detailReasonId="#drs_"+index;
			$("<td class=\"center\" id='drs_"+index+"' rowspan=1/>").html(swh.detail_reason).appendTo(tr);
		}
		
		$("<td class=\"center\" />").html(swh.staff_number).appendTo(tr);
		$("<td class=\"center\" />").html(swh.staff_name).appendTo(tr);
		$("<td class=\"center\"/>").html(swh.job).appendTo(tr);
		if(disabled=="disabled"){
			$("<td class=\"center\" />").html("<input class=\"workhour \" disabled=\"disabled\" type='text' style=\"border:1;width:98%;text-align:center;font-size: 12px\" value='"+swh.work_hour+
					"' old_value='"+swh.work_hour+"'>").appendTo(tr);
			$("<td class=\"center\" />").html("<input class=\"whereabouts \" disabled=\"disabled\" type='text' style=\"border:1;width:98%;text-align:center;font-size: 12px\" value='"+swh.whereabouts+
					"' old_value='"+swh.whereabouts+"'>").appendTo(tr);
		}else{
			$("<td class=\"center\" />").html("<input class=\"workhour \" type='text' style=\"border:1;width:98%;text-align:center;font-size: 12px\" value='"+swh.work_hour+
					"' old_value='"+swh.work_hour+"'>").appendTo(tr);
			$("<td class=\"center\" />").html("<input class=\"whereabouts \" type='text' style=\"border:1;width:98%;text-align:center;font-size: 12px\" value='"+swh.whereabouts+
					"' old_value='"+swh.whereabouts+"'>").appendTo(tr);
		}
		
		$("<td class=\"center\" />").html(swh.team_org).appendTo(tr);
		$("<td class=\"center\" />").html(swh.workgroup_org).appendTo(tr);
		$("<td class=\"center\" />").html(swh.status=='0' ? '已维护' : (swh.status=='1' ? '已审核' :(swh.status=='2' ? '已驳回' :'已锁定'))).appendTo(tr);
//		$("<td class=\"center\" />").html(swh.editor).appendTo(tr);
//		$("<td class=\"center\" />").html(swh.edit_date).appendTo(tr);
		if(disabled=='disabled'){
			$("<td style=\"width:25px\" />").html("").appendTo(tr);
			
		}else{
		    $("<td class=\"center\" style=\"width:25px\"/>").html("<button type=\"button\" class=\"close\" aria-label=\"Close\"  rel=\"tooltip\" title='删除' swhlist_index='"+index+"'><span aria-hidden=\"true\">×</span></button>").appendTo(tr);
		}
		//alert(tr);
		$("#tableResult tbody").append(tr);
		$(tr).data("swhid",swh.id);
		$(tr).data("swhlist_index",index);
		$(tr).data("workdateId",workdateId);
		last_workdate=swh.work_date;
		last_wait_reason=swh.wait_reason;
		last_wait_type=swh.wait_type;
		last_detail_reason=swh.detail_reason;
		
	});
}
//function ajaxUpdate(conditions) {
//	$.ajax({
//		url : "updateWaitWorkTimeInfo",
//		dataType : "json",
//		type : "post",
//		data : {
//			"conditions" : conditions
//		},
//		success : function(response) {
//			if (response.success) {				
//				alert(response.message);
//				
//			} else {
//				alert(response.message);
//			}
//
//		}
//	});
//}

function ajaxGetStaffWorkHours(conditions) {
	var swhlist;
	$.ajax({
		url : "getWaitWorkTimeList",
		dataType : "json",
		async:false,
		type : "get",
		data : {
			"conditions" : conditions
		},
		success : function(response) {
			swhlist = response.data;
		}
	});
	return swhlist;
}

function isContain(staff,staffarr){
	var flag=false;
	$.each(staffarr,function(index,obj){
		if(obj.id==staff.id){
			flag=true;
			return;
		}
	})
	return flag;
}
//复选框全选或反选
function selectAll() {
    if ($("#selectAll").prop("checked")) {
        $(":checkbox").prop("checked", true);
    } else {
        $(":checkbox").prop("checked", false);
    }
}
//删除
function ajaxDelete(conditions){
	$.ajax({
		url : "deleteWaitWorkTimeInfo",
		dataType : "json",
		async:false,
		type : "get",
		data : {
			"conditions" : conditions
		},
		success : function(response) {
			if(response.success){
		    	$.gritter.add({
					title: '系统提示：',
					text: '<h5>删除成功！</h5>',
					class_name: 'gritter-info'
				});
		    	
		    	ajaxQuery();
		    	}else{
		    		$.gritter.add({
						title: '系统提示：',
						text: '<h5>删除失败！</h5><br>'+response.message,
						class_name: 'gritter-info'
					});
		    	}
		},
		error:function(response){
			alert(response.message);
		}
	})	
}
