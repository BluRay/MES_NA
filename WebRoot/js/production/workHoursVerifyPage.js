var pageSize=1;
var table;
var table_height = $(window).height()-270;
var status_arr = {"0" : "已评估","1" : "已完成","2" : "已驳回"};
var wh_status_arr={'1':'已审批','2':'已驳回','3':'已锁定'}
var cur_tmpOrderId = 0;
var edit_list = [];
var workhour_list=[];
var ready_hour = 0;

$(document).ready(function () {	
	initPage();
	
	function initPage(){
		getBusNumberSelect('#nav-search-input');
		getFactorySelect("production/workHoursVerifyPage",'',"#q_factory",null,'id');
		getWorkshopSelect("production/workHoursVerifyPage",$("#q_factory :selected").text(),"","#q_workshop",null,"id");
	}

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/BMS/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})
	
	$("#q_factory").change(function() {
		getWorkshopSelect("production/workHoursVerifyPage",$("#q_factory :selected").text(),"","#q_workshop",null,"id");
	})
	
	$("#btnQuery").click (function () {
		ajaxQuery();
		return false;
	});
	
	$("#btnSwhQuery").click (function () {
		var staffNum=$("#edit_cardNumber").val();
		var workDate=$("#edit_workDate").val();
		var conditions="{staffNum:'"+staffNum+"',workMonth:'"+workDate+"',temp_order_id:"+cur_tmpOrderId+"'}";
		if(workDate==''||workDate==null){
			alert("请选择操作月份！");
			return false;
		}
		workhour_list=ajaxGetStaffWorkHours(conditions);
		generateWorkhourTb(workhour_list,true);
	});
	
	$("#checkall").click(function() {
		if ($(this).prop("checked")) {
			check_All_unAll("#work_hour_tb", true);
		} else{
			check_All_unAll("#work_hour_tb", false);
		}
	});
});


function ajaxQuery(){
	$("#tableData").dataTable({
		serverSide: true,paiging:true,ordering:false,searching: false,bAutoWidth:false,
		destroy: true,sScrollY: table_height,sScrollX:true,orderMulti:false,
		pageLength: 25,pagingType:"full_numbers",lengthChange:false,
		fixedColumns: {
            leftColumns:0,
            rightColumns:1
        },
		language: {
			emptyTable:"抱歉，未查询到数据！",
			info:"共计 _TOTAL_ 条，当前第 _PAGE_ 页 共 _PAGES_ 页",
			infoEmpty:"",
			paginate: { first:"首页",previous: "上一页",next:"下一页",last:"尾页",loadingRecords: "请稍等,加载中..."}
		},
		ajax:function (data, callback, settings) {
			var orderNo = $('#tmp_order_no').val();
			var applyDateStart = $('#start_date').val();
			var applyDateEnd = $('#end_date').val();
			var status = $('#status').val();
			var factory = $("#q_factory :selected").text();
			var workshopAll = "";
			$("#q_workshop option").each(function() {
				if($(this).text()!=="全部") workshopAll += $(this).text() + ",";
			});
			var workshop = $("#q_workshop :selected").text() == "全部" ? workshopAll : $("#q_workshop :selected").text();
			var conditions = "{orderNo:'" + orderNo + "',applyDateStart:'"
			+ applyDateStart + "',applyDateEnd:'" + applyDateEnd + "',hourstatus:'"
			+ status + "',factory:'" + factory + "',workshop:'" + workshop
			+ "'}";
			console.log('-->conditions = ' + conditions);
			
			$.ajax({
                type: "post",
                url: "getTmpOrderListForVerify",
                cache: false,  //禁用缓存
                data: {"conditions":conditions},  //传入组装的参数
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
		            {"title":"临时派工单号",width:'150',"class":"center","data":"tmp_order_no","defaultContent": ""},
		            {"title":"工单号",width:'100',"class":"center","data":"sap_order","defaultContent": ""},
		            {"title":"作业原因/内容",width:'200',"class":"center","data":"reason_content","defaultContent": ""},
		            {"title":"总数量",width:'100',"class":"center","data":"total_qty","defaultContent": ""},
		            {"title":"已完成数量",width:'100',"class":"center","data":"finished_qty","defaultContent": "0"},
		            {"title":"工时",width:'50',"class":"center","data":"single_hour","defaultContent": ""},
		            {"title":"所需人力",width:'100',"class":"center","data":"labors","defaultContent": ""},
		            {"title":"总工时",width:'100',"class":"center","data":"-","defaultContent": "",
		            	"render": function ( data, type, row ) {
		            		var totalHour = parseFloat(row.single_hour)*parseFloat(row.total_qty);	            		
		            		return totalHour.toFixed(2);
		            	},
		            },
		            {"title":"录入总工时",width:'100',"class":"center","data":"-","defaultContent": "",
		            	"render": function ( data, type, row ) {
		            		var workhourTotal=row.workhour_total==undefined?0:row.workhour_total;
		            		return workhourTotal.toFixed(2);
		            	},
		            },
		            {"title":"申请人",width:'100',"class":"center","data":"applier_name","defaultContent": ""},
		            {"title":"申请时间",width:'100',"class":"center","data":"apply_date","defaultContent": ""},
		            {"title":"工单状态",width:'100',"class":"center","data":"status","defaultContent": "",
		            	"render": function ( data, type, row ) {
		            		return status_arr[data];
		            	},
		            },
		            {"title":"操作",width:'100',"class":"center","data":null,"defaultContent": "",
		            	"render": function ( data, type, row ) {
		            		return "<i class=\"glyphicon glyphicon-check bigger-130 showbus\" title=\"审核\" onclick='verifyWorkTime(\"" + row['id'] + "\",\"" + row['tmp_order_no'] + "\",\"" + row['labors'] + "\",\""+ row['reason_content'] +"\",\""+ row['single_hour'] +"\",\""+ row['total_qty'] +"\",\""+ row['finished_qty'] +"\",\""+ row['workhour_total'] +"\",\""+ row['factory'] +"\",\""+ row['workshop'] +"\",\""+ row['tech_list'] +"\")' style='color:blue;cursor: pointer;'></i>&nbsp;&nbsp;";
		            	},
		            }
		          ],
	});
	
}

function verifyWorkTime(id,tmp_order_no,labors,reason_content,single_hour,total_qty,finished_qty,workhour_total,factory,workshop,tech_list){
	var d = new Date();
	var eYear = d.getFullYear();
	var eMon = d.getMonth() + 1;
	var workMonth=eYear+"-"+(eMon<10?"0"+eMon:eMon);
	cur_tmpOrderId = id;
	$("#edit_workDate").val(workMonth);
	$("#edit_orderNo").html(tmp_order_no);
	$("#edit_reason").html(reason_content);
	
	var conditions = "{temp_order_id:'" + id +"',workMonth:'"+workMonth+ "'}";
	console.log("-->conditions = " + conditions);
	workhour_list = ajaxGetStaffWorkHours(conditions);
	generateWorkhourTb(workhour_list,true);

	$("#edit_workDate").val(workMonth);
	$("#edit_orderNo").html(tmp_order_no);
	$("#edit_reason").html(reason_content);
	$("#edit_totalQty").html(total_qty);
	$("#edit_singleHour").html(single_hour);
	$("#edit_labors").html(labors);
	$("#edit_totalHour").html(parseFloat(single_hour)*parseFloat(total_qty));
	
	$("#dialog-edit").removeClass('hide').dialog({
		resizable: false,
		title: '<div class="widget-header"><h4 class="smaller"><i class="ace-icon fa fa-flag green"></i> 工时审核</h4></div>',
		title_html: true,
		width:'750px',
		modal: true,
		buttons: [{
					text: "取消",
					"class" : "btn btn-minier",
					click: function() {$( this ).dialog( "close" );} 
				},
				{
					text: "驳回",
					id:"btn_del",
					"class" : "btn btn-info btn-minier",
					click: function() {
						btnRejectConfirm(id,factory,workshop);
					} 
				},
				{
					text: "批准",
					id:"btn_ok",
					"class" : "btn btn-success btn-minier",
					click: function() {
						btnVerifyConfirm(id,factory,workshop);
					} 
				}
			]
	});
}

function btnVerifyConfirm(id,factory,workshop){
	var edit_list=getSelectList();
	var orderStaus="verify";
	var workDate=$("#edit_workDate").val();
	var conditions={};
	conditions.factory=factory;
	conditions.workshop=workshop;
	conditions.workMonth=workDate;
	var trs=$("#workhour_list").children("tr");
	$.each(trs,function(index,tr){
		var c_checkbox=$(tr).find('input[type=checkbox]');
		var status=$(tr).data("status");
		var ischecked=$(c_checkbox).is(":checked");
		if(status=='已驳回'&&!ischecked){
			orderStaus="reject";
		}
	});
	if(workDate==''||workDate==null){
		alert("请选择操作月份！");
		return false;
	}
	if(edit_list.length>0){
		ajaxUpdate(JSON.stringify(edit_list),JSON.stringify(conditions),"verify",id,orderStaus);
	}else{
		alert("请选择工时信息！");
	}	
	
}

function btnRejectConfirm(id,factory,workshop){
	var workDate=$("#edit_workDate").val();
	var conditions={};
	conditions.factory=factory;
	conditions.workshop=workshop;
	conditions.workMonth=workDate;
	var edit_list=getSelectList();
	if(workDate==''||workDate==null){
		alert("请选择操作月份！");
		return false;
	}
	console.log("-->edit_list.length = " + edit_list.length);
	if(edit_list.length>0){
		ajaxUpdate(JSON.stringify(edit_list),JSON.stringify(conditions),"reject",id,"reject");
	}else{
		alert("请选择操作数据！");
		return false;
	}
}

function ajaxUpdate(swhlist,conditions,whflag,tempOrderId,orderStatus) {
	$.ajax({
		url : "updateStaffTmpHourInfo",
		dataType : "json",
		async:false,
		type : "post",
		data : {
			"conditions" : swhlist,
			"whflag":whflag,
			"tempOrderId":tempOrderId,
			"tempOrderStaus":orderStatus
		},
		success : function(response) {
			ajaxCaculateSalary(conditions);
			if (response.success) {
				$("#dialog-edit").dialog( "close" );
				$.gritter.add({
					title: '系统提示：',
					text: '<h5>操作成功！</h5>',
					class_name: 'gritter-info'
				});
				ajaxQuery();
			} else {
				alert(response.message);
			}
		}
	});
}

//批准、驳回时重新计算临时派工单工资
function ajaxCaculateSalary(conditions) {
	$.ajax({
		url : "caculateSalary",
		dataType : "json",
		type : "post",
		data : {
			"conditions" : conditions
		},
		success : function(response) {
			if (response.success) {
				
			} else {
				alert(response.message);
			}
		}
	});
}

function getSelectList(){
	var boxList=$("#workhour_list :checked");
	var swhList=[];
	$.each(boxList,function(index,box){
		var obj={};
		var tr=$(box).closest("tr");
		var listindex=parseInt($(tr).data("swhlist_index"));
		//alert(workhour_list[listindex].staff_name);
		var swhid=$(tr).data("id");
		obj=workhour_list[listindex];
		swhList.push(obj);
	});
	return swhList;
}

function ajaxGetStaffWorkHours(conditions) {
	var swhlist;
	$.ajax({
		url : "getStaffTmpHours",
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

function generateWorkhourTb(swhlist,caculate) {
	ready_hour=0;
	caculate=caculate||false;
	$("#workhour_list").html("");
	$.each(swhlist, function(index, swh) {
		var tr = $("<tr style='padding:5px'/>");
		if (swh.status == "已锁定") {
			$("<td />").html(swh.status).appendTo(tr);
		} else {
			$("<td />").html("<input type='checkbox' >").appendTo(tr);
		}
		$("<td />").html(swh.staff_number).appendTo(tr);
		$("<td />").html(swh.staff_name).appendTo(tr);
		$("<td />").html(swh.job).appendTo(tr);
		$("<td />").html(swh.work_hour).appendTo(tr);
		$("<td />").html(swh.team_org).appendTo(tr);
		$("<td />").html(swh.workgroup_org).appendTo(tr);
		$("<td />").html(swh.workshop_org).appendTo(tr);
		$("<td />").html(swh.plant_org).appendTo(tr);
		$("<td />").html(swh.status).appendTo(tr);
		$("<td />").html(swh.work_date).appendTo(tr);
		$("#workhour_list").append(tr);
		$(tr).data("id", swh.id);
		$(tr).data("swhlist_index", index);
		$(tr).data("email", swh.email);
		$(tr).data("status", swh.status);
		if(caculate){
			ready_hour += parseFloat(swh.work_hour);
		}
		
	});
	var tr = $("<tr style='padding:5px'/>");
	$("<td />").html("").appendTo(tr);
	$("<td />").html("").appendTo(tr);
	$("<td />").html("").appendTo(tr);
	$("<td />").html("").appendTo(tr);
	$("<td />").html("").appendTo(tr);
	$("<td />").html("").appendTo(tr);
	$("<td />").html("").appendTo(tr);
	$("<td />").html("").appendTo(tr);
	$("<td colspan=2 style='text-align:right'/>").html("合计工时：").appendTo(tr);
	$("<td />").html(ready_hour.toFixed(2)).appendTo(tr);
	$("#workhour_list").append(tr);
}

