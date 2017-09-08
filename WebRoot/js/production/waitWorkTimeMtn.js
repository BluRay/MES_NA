var factory="";
var workshop="";
var workgroup="";
var team="";
var org = "";
var staff_list=[];
$(document).ready(function() {
    initPage();
	
	function initPage() {
		getBusNumberSelect('#nav-search-input');
		getOrgAuthTree($("#workGroupTree"),'production/pieceWorkhourMod',"1,2,3,4",'1',3);
		$('#workGroupTree').height($(window).height()-110)
		$('#workGroupTree').ace_scroll({
			size:$(this).attr('data-size')|| $(window).height()-110,
			mouseWheelLock: true,
			alwaysVisible : true
		});
		getKeysSelect("WAIT_HOUR_TYPE", "", $("#search_wait_hour_type"),"全部","");
		$("#select_start_date").val("");
		$("#select_finish_date").val("");
	}

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/BMS/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})
	
	$(document).on("input",".workhour",function(){
		var workHour=$(this).val();
		if(!const_float_validate.test(workHour)&&workHour!=""){
			alert("等待工时只能是数字！");
			$(this).val("");
			return false;
		}else if(!const_float_validate_one.test(workHour)){
			alert("等待工时只能保留一位小数！");
			$(this).val("");
			return false;
		}else if(workHour<0||workHour>8){
			alert("等待工时只能位于0到8之间！");
			$(this).val("");return false;
		}else if(workHour*10%5!=0){
			alert("等待工时录入以半小时为单位，例如：1.0,1.5,2.0！");
			$(this).val("");
			return false;
		}
	});
	$(document).on("keydown",".workhour",function(event){
		if (event.keyCode == "13") {								
			$(this).parent().parent().next().find(".workhour").focus();
		}
		var workhourtotal=0;
		$("#tableResult tbody").find(".workhour").each(function(){
			if($(this).val()!=""){
				workhourtotal+=parseFloat($(this).val());
			}
		});
		$("#workhourtotal").text("已录工时："+workhourtotal);
	})
	$(document).on("blur",".workhour",function(event){
		if (event.keyCode == "13") {								
			$(this).parent().parent().next().find(".workhour").focus();
		}
		var workhourtotal=0;
		$("#tableResult tbody").find(".workhour").each(function(){
			if($(this).val()!=""){
				workhourtotal+=parseFloat($(this).val());
			}
		});
		$("#workhourtotal").text("已录工时："+workhourtotal);
	})
	$(document).on("change","#whereabouts",function() {		
		$(".whereabouts").val($(this).val());
	});
	$(document).on("change","#workhour",function() {		
		$(".workhour").val($(this).val());
		var workhourtotal=0;
		$("#tableResult tbody").find(".workhour").each(function(){
			if($(this).val()!=""){
				workhourtotal+=parseFloat($(this).val());
			}
		});
		$("#workhourtotal").text("已录工时："+workhourtotal);
	});
	//等待原因为‘停线’时弹出停线原因查询层
	$("#waitReason").change(function(){
		if($(this).val()=='停线'){
			$("#reason_detail").val("");
			$("#reason_detail").attr("disabled",true);
			$("#duty_unit").attr("readonly",true);
			getReasonTypeSelect();
			getOrderNoSelect("#search_order_no","#orderId");
			$("#dialog-edit").removeClass('hide').dialog({
				resizable: false,
				title: '<div class="widget-header"><h4 class="smaller"><i class="ace-icon fa fa-users green"></i> 选择停线原因</h4></div>',
				title_html: true,
				width:800,
				height:600,
				modal: true,
				buttons: [{
							text: "关闭",
							"class" : "btn btn-minier",
							click: function() {$( this ).dialog( "close" );} 
						},
				        {
					text: "确认",
					"class" : "btn btn-primary btn-minier",
					click: function() {
						var radio=$('input:radio[name="exp_radio"]:checked');		
						var reason=$(radio).val()=='undefined'?'':$(radio).val();
						//alert(reason);
						var tr=$(radio).parent().parent();
						var duty_unit=$(tr).children("td").eq(8).html();
						var start_time=$(tr).children("td").eq(3).html();
						var finish_time="";
						if($(tr).children("td").eq(5).html()!=""){
							var finish_time=$(tr).children("td").eq(5).html();
						}
						
						if(reason==undefined){
							alert("请选择停线原因！");
						}else{
							$( this ).dialog( "close" );
							$("#reason_detail").val(reason);
							$("#duty_unit").val(duty_unit).attr("readonly",true);
							$("#select_start_date").val(start_time);
							$("#select_finish_date").val(finish_time);
							$("#reason_detail").attr("disabled",true);
						}
					} 
				}
					]
        
			});
		}else{
			$("#reason_detail").val("");
			$("#duty_unit").val("");
			$("#reason_detail").attr("disabled",false);
			$("#duty_unit").attr("readonly",false);
			$("#select_start_date").val("");
			$("#select_finish_date").val("");
		}
	});
	$(document).on("click","#addStaff",function() {		
		var tr=$("<tr />");
		$("<td class='center'/>").html("<i class=\"fa fa-times bigger-110\" style=\"cursor: pointer;color: red;\"></i>").appendTo(tr);
		$("<td class='center'/>").html("<input type='text' class='staff_number' style='width:100%;height:28px;margin: 0;font-size:12px;text-align:center;' />").appendTo(tr);
		$("<td class='center'/>").html("").appendTo(tr);
		$("<td class='center'/>").html("").appendTo(tr);
		$("<td class='center'/>").html("<input class='input-small workhour' style='width:60px;height:28px;' type='text'>").appendTo(tr);
		$("<td class='center'/>").html("<input class='input-small whereabouts' style='width:60px;height:28px;' type='text'>").appendTo(tr);
		$("<td class='center'/>").html("").appendTo(tr);
		$("<td class='center'/>").html("").appendTo(tr);
		$("<td class='center'/>").html("").appendTo(tr);
		$("<td class='center'/>").html("").appendTo(tr);
		$("#tableResult tbody").prepend(tr);
	});
	// 工时删除
	$(document).on("click",".fa-times", function(e) {
		$(e.target).closest("tr").remove();
		var workhourtotal=0;
		$("#tableResult tbody").find(".workhour").each(function(){
			if($(this).val()!=""){
				workhourtotal+=parseFloat($(this).val());
			}
		});
		$("#workhourtotal").text("已录工时："+workhourtotal);
	});
	$(document).on("change",".staff_number",function(){
		 var staff=ajaxGetStaffDetail($(this).val());
		 if(!staff){
			 $(this).val("");
		 }
		 var tds=$(this).parent("td").siblings();
		 if(staff){
		     $(tds[1]).html(staff.name);
			 $(tds[2]).html(staff.job);
			 $(tds[5]).html(staff.team_org);
			 $(tds[6]).html(staff.workgroup_org);
			 $(tds[7]).html(staff.workshop_org);
			 $(tds[8]).html(staff.plant_org);
		}
	});
	$("#btnQueryReason").click(function(){
		$("#tableDataDetail").dataTable({
			serverSide: true,
			fixedColumns:   {
	            leftColumns: 0,
	            rightColumns:0
	        },
	        paiging:true,
			ordering:false,
			searching: false,
			bAutoWidth:false,
			destroy: true,
			sScrollY: document.documentElement.clientHeight-300 + 'px',
			scrollX: "100%",
			lengthChange:false,
			orderMulti:false,
			language: {
				emptyTable:"抱歉，未查询到数据！",
				info:"共计 _TOTAL_ 条，当前第 _PAGE_ 页 共 _PAGES_ 页",
				infoEmpty:"",
				paginate: { first:"首页",previous: "上一页",next:"下一页",last:"尾页",loadingRecords: "请稍等,加载中..."}
			
			},
			
			ajax:function (data, callback, settings) {
				var param ={
					"draw":1,
					factory_name: factory,
			    	workshop_name: workshop,
			    	pause_date_start:$('#pause_date_start').val(),//停线开始时间
			    	pause_date_end:$('#pause_date_end').val(),//停线结束时间
			    	exception_type : "1",
			    	reason_type_id: $('#search_reason_type').val(),
			    	order_no: $('#search_order_no').val(), 	
			    	resume_date_start: $('#ok_date_start').val(),//恢复开始时间
			    	resume_date_end: $('#ok_date_end').val(),//恢复结束时间
				};
				param.length = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
	            param.start = data.start;//开始的记录序号
	            param.page = (data.start / data.length)+1;//当前页码

	            $.ajax({
	                type: "post",
	                url: "/BMS/plan/getPauseList",
	                cache: false,  //禁用缓存
	                data: param,  //传入组装的参数
	                dataType: "json",
	                success: function (result) {
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
			          {"title":"","width":"30","class":"center","data":"","defaultContent": "","render":function(data,type,row){
			            	return "<input name='exp_radio' value='"+row.reason_type+"' type='radio'>";
			            }},
			            {"title":"生产订单","class":"center","data":"order_list","defaultContent": ""},
			            {"title":"线别","class":"center","data":"line","defaultContent": ""},
			            {"title":"停线时间","class":"center","data":"start_time","defaultContent": ""},
			            {"title":"预计恢复时间","class":"center","data": "pend_time","defaultContent": ""},
			            {"title":"实际恢复时间","class":"center","data":"end_time","defaultContent":""},
			            {"title":"异常原因","class":"center","data":"reason_type","defaultContent":""},
			            {"title":"详细原因","class":"center","data":"detailed_reason","defaultContent": ""},
			            {"title":"责任部门","class":"center","data":"duty_department","defaultContent": ""},
	          ],
		});
	});
	//保存
	$("#btnSave").click(function(){
		var org ="";
		var factory="";
		var dept="";
		var workshop ="";	
		var workgroup="";
		var team="";
		var staffNumlist="";
		
		var wait_date=$("#wait_date").val();
		var dutyUnit=$("#duty_unit").val();
		var stafflist = [];
		var saveFlag=true;
		var start_time=$("#select_start_date").val();
		var finish_time=$("#select_finish_date").val();
		var reasonDetail=$("#reason_detail").val();
		var curDate=getCurDate();
		if(finish_time==undefined||finish_time==""){
			finish_time=curDate;
		}else{
			finish_time=finish_time.substring(0,10);
		}
		if(start_time==undefined||start_time==""){
			start_time=curDate;			
		}else{
			start_time=start_time.substring(0,10);
		}
		var nodes = zTreeObj.getSelectedNodes();	
		var treeNode = nodes[0];
		if(treeNode.org_type == '4'){
			org = treeNode.id;
			workshop=treeNode.getParentNode().getParentNode().displayName;
			factory=treeNode.getParentNode().getParentNode().getParentNode().displayName;
			workgroup=treeNode.getParentNode().displayName;
			team=treeNode.displayName;
		}
		if(checkSalarySubmit(factory,workshop,wait_date.substring(0,7))=='true'){
			alert("车间工资已提交/结算，不允许再维护工时信息！");
			return false;
		}
		
		if(org==""){
			alert("请选择小班组！");
		}else if($("#waitReason").val().trim().length==0){
			alert("请选择等待原因！");
		}else if(wait_date.trim().length==0){
			alert("请填写等待日期！");
		}else if($("#waitReason").val()=='停线'&&(compareTime(wait_date,start_time)==-1||compareTime(wait_date,finish_time)==1)){
			alert("等待日期必须在‘"+start_time+"’与 ‘"+finish_time+"’之间！");
		}else if(reasonDetail.trim().length==0){
			alert("请填写具体原因！");
		}else if(dutyUnit.trim().length==0){
			alert("请填写责任部门！");
			return false;
		}
		else{
			var standard_price=ajaxGetStandardPrice();
			if(standard_price==0){
				saveFlag=false;
				var type=$("#search_wait_hour_type :selected").text();
				alert("未维护【"+type+"】等待工时单价！");
				return false;
			}		
			$("#tableResult tbody").find("tr").each(function() {						
						var tr = $(this);
						
						var staff_number="";
						if(tr.find(".staff_number").val()==''){
							staff_number=tr.find(".staff_number").html();
						}else{
							staff_number=tr.find(".staff_number").val();
						}		
						
						var workHour=tr.find(".workhour").val();
						var whereabouts=tr.find(".whereabouts").val();
						var staff_name=tr.find(".staff_name").html();
						var job=tr.find(".job").html();
						var team_org=tr.find(".team_org").html();
						var workgroup_org=tr.find(".workgroup_org").html();
						var workshop_org=tr.find(".workshop_org").html();
						var plant_org=tr.find(".plant_org").html();
						var skill_parameter=tr.find(".skill_parameter").val();
						if(staff_number !=undefined &&staff_number.trim().length>0&&workHour!=0){
							var staff = {};
							staff.factory=factory;
							staff.workshop = workshop;
							staff.workgroup=workgroup;
							staff.team=team;
							staff.work_date=wait_date;
							staff.staff_number=staff_number;
							staff.staff_name=staff_name;
							staff.skill_parameter=skill_parameter;
							staff.job=job;
							staff.plant_org=plant_org;
							staff.workshop_org=workshop_org;
							staff.workgroup_org=workgroup_org;
							staff.team_org=team_org;
							staff.work_hour=workHour;
							staff.wait_reason=$("#waitReason").val();
							staff.wait_type=$("#search_wait_hour_type").find("option:selected").text();
							staff.detail_reason=reasonDetail;
							staff.whereabouts=whereabouts;
							staff.duty_unit=dutyUnit;
							staff.price=standard_price;
							staff.status='0';
							if(!isContain(staff,stafflist)){
								stafflist.push(staff);
							}else{
								saveFlag=false;
								alert(staff.staff_number+" 不能重复维护工时！");
								return false;
							}			
						}

						if(workHour==''|| workHour.trim().length==0){
							saveFlag=false;
							alert("等待工时不能为空！");
							return false;
						}
						if(whereabouts==''||whereabouts.trim().length==0){
							saveFlag=false;
							alert("人员去向不能为空！");
							return false;
						}
					var staffNum=staff_number;
					staffNumlist+=staffNum+","
					/*var conditions="{staffNum:'"+staffNum+"',workDate:'"+ $("#mta_wdate").val()+"'}";
					var sfwlist=ajaxGetStaffWorkHours(conditions);
					if(sfwlist.length>0){														
							//$(tr).remove();
							saveFlag=false;
							alert("不能重复维护工时！");
							return false;
						}	*/
				});
			if(!saveFlag){
				return false;
			}
			var conditions = "{staff_number:'"+ staffNumlist + "',workDate:'"+ $("#wait_date").val()+ "'}";	
			var sfwlist = ajaxGetStaffWorkHours(conditions);
			if (sfwlist.length > 0) {
				//$(tr).remove();
				saveFlag = false;
				alert("不能重复维护工时！");
				return false;
			}

			console.log(stafflist);
			if(saveFlag&&stafflist.length>0){
				ajaxSave(JSON.stringify(stafflist));
			}else{
				alert("无数据保存！");
			}
		}
	});
})

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
	if(treeNode.org_type != '4'){
		alert("请选择小班组！");
		return false;
	}
	
	ajaxQueryTeamStaffDetail();
	
};
function ajaxQueryTeamStaffDetail(){
	if($.fn.dataTable.isDataTable("#tableResult")){
		$('#tableResult').DataTable().destroy();
		$('#tableResult').empty();
	}
	$("#tableResult").dataTable({
		paiging:false,
		ordering:false,
		processing:true,
		searching: false,
		autoWidth:false,
		paginate:false,
		sScrollY: document.documentElement.clientHeight-250 + 'px',
		scrollX: true,
		scrollCollapse: true,
		lengthChange:false,
		orderMulti:false,
		info:false,
		language: {
			processing: "正在查询，请稍后...",
			emptyTable:"",					     
			infoEmpty:"",
			zeroRecords:"未查询到人员数据！"
		},
		ajax:function (data, callback, settings) {
			var param ={
				factory:factory,
				workshop:workshop,
				workgroup:workgroup,
				team:team,
//				org_id:org_id,
//				work_date:$("#work_date").val()
			};

            $.ajax({
                type: "post",
                url: "getTeamStaffDetail",
                cache: true,  //禁用缓存
                data: param,  //传入组装的参数
                dataType: "json",
                success: function (result) {
                	$("#tableResult_info").remove();
                	//封装返回数据
                    var returnData = {};
                    returnData.data = result.staff_list;//返回的数据列表
                    callback(returnData);
                }
            });
		
		},
		columns: [
		          {"title":"<i id=\"addStaff\" class=\"fa fa-plus bigger-110\" style=\"cursor: pointer;color: blue;\"></i>","width":"30","class":"center","data":"","defaultContent": "","render":function(data,type,row){
		            	return "<i class=\"fa fa-times bigger-110\" style=\"cursor: pointer;color: red;\"></i>";
		            }},
		            {"title":"工号","class":"center staff_number","data":"staff_number","defaultContent": ""},
		            {"title":"姓名","class":"center staff_name","data":"name","defaultContent": ""},
		            {"title":"岗位","class":"center job","data": "job","defaultContent": ""},
		            {"title":"工时","class":"center","render":function(data,type,row){
		            	return "<input type='text' class='input-small workhour' style='width:60px;height:28px;'><input type='hidden' class='skill_parameter'>";
		            }},
		            {"title":"人员去向","class":"center","render":function(data,type,row){
		            	return "<input type='text' class='input-small whereabouts' style='width:60px;height:28px;'>";
		            }},
		            {"title":"小班组","class":"center team_org","data":"team_org","defaultContent":""},
		            {"title":"班组","class":"center workgroup_org","data":"workgroup_org","defaultContent": ""},	
		            {"title":"车间","class":"center workshop_org","data":"workshop_org","defaultContent":""},
		            {"title":"工厂","class":"center plant_org","data":"plant_org","defaultContent": ""},
          ],
	});
}
function ajaxSave(conditions) {
	$.ajax({
		url : "saveWaitWorkTimeInfo",
		dataType : "json",
		type : "post",
		data : {
			"conditions" : conditions
		},
		success : function(response) {
			if (response.success) {				
				alert(response.message);
				$("#wait_date").val("");
				$("#reason_detail").val("");
				$("#duty_unit").val("");
				$("#workhour").val("");
				$("#whereabouts").val("");
				$("#workhourtotal").html("&nbsp;&nbsp;已录工时：");
				//$("#waitReason option[value='']").attr("selected","selected");
				$("#waitReason option[index='0']").attr("selected","selected");
				$("#search_wait_hour_type option[index='0']").attr("selected","selected");
				$("#tableResult tbody").remove();
				$("#duty_unit").attr("readonly",false);
				$("#select_start_date").val("");
				$("#select_finish_date").val("");
			} else {
				alert(response.message);
			}

		}
	});
}
function checkSalarySubmit(factory,workshop,month){
	var submit_flg="";
	$.ajax({
		url : "/BMS/common/getSubmitSalary",
		dataType : "json",
		data : {
			"factory":factory,
			"workshop":workshop,
			"month":month
		},
		type:"post",
		async:false,
		error : function(response) {
			//alert(response.message)
		},
		success : function(response) {
			if(response.length>0){
				submit_flg= "true";
			}else{
				submit_flg= "false";
			}
		}
	})
	return submit_flg;
}
function ajaxGetStandardPrice(){
	var price=0;
	var factory = "";
	var workDate=$("#wait_date").val();
	var nodes = zTreeObj.getSelectedNodes();
	var treeNode = nodes[0];
	while (treeNode!=null){
		if(treeNode.org_type == '1'||treeNode.org_type == '2'){
			factory = treeNode.displayName;
		}		
		treeNode = treeNode.getParentNode();
	}
	var type=$("#search_wait_hour_type :selected").attr('keyvalue');
	$.ajax({
		type : "get",// 使用get方法访问后台
		dataType : "json",// 返回json格式的数据
		url : "/BMS/common/getBasePrice",
		async :false,
		data : {
			"factory" : factory,
			"workDate":workDate,
			"type":type
		},
		success : function(response) {	
			console.log("response.data",response.data);
			price = response.length==0?0:response.data[0].price;
		}
	})
	return price;
}
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
function ajaxGetStaffDetail(staff_number){
	var staff={};
	$.ajax({
		url:'getTeamStaffDetail',
		type:'post',
		dataType:'json',
		async:false,
		data:{
			factory:factory,
			workshop:workshop,
			workgroup:workgroup,
			team:team,
			staff_number:staff_number,
			work_date:$("#work_date").val()
		},
		success:function(response){
			if(response.staff_list.length==0){
				alert("请输入有效员工号！");
			}
			staff=response.staff_list[0];				
		}
	})
	return staff;
}
function getCurDate() {
	var now = new Date()
	y = now.getFullYear()
	m = now.getMonth() + 1
	d = now.getDate()
	m = m < 10 ? "0" + m : m
	d = d < 10 ? "0" + d : d
	return y + "-" + m + "-" + d
}
function isContain(staff,staffarr){
	var flag=false;
	$.each(staffarr,function(index,obj){
		if(obj.staff_number==staff.staff_number){
			flag=true;
			return;
		}
	})
	return flag;
}
function getReasonTypeSelect() {
	$("#search_reason_type").empty();
	$.ajax({
		url : "../common/getReasonTypeSelect",
		dataType : "json",
		data : {},
		async : false,
		error : function(response) {
			alert(response.message)
		},
		success : function(response) {
			var strs = "";
		    $("#search_reason_type").html("<option value=\'\'>全部</option>");
		    $.each(response.data, function(index, value) {
		    	strs += "<option value=" + value.value + ">" + value.key_name + "</option>";
		    });
		    $("#search_reason_type").append(strs);
		}
	});
}
function compareTime(beginTime,endTime){  
	
    var startDateTemp = beginTime.split(" ");  
    var endDateTemp = endTime.split(" ");  
    var arrStartDate = startDateTemp[0].split("-");  
    var arrEndDate = endDateTemp[0].split("-");  
    arrStartTime=[0,0,0];
    arrEndTime=[0,0,0];
    if(startDateTemp[1]!=undefined){
    	var timearr=startDateTemp[1].split(":");
    	arrStartTime[0] = timearr[0]==undefined?0:timearr[0];  
    	arrStartTime[1] = timearr[1]==undefined?0:timearr[1]; 
    	arrStartTime[2] = timearr[2]==undefined?0:timearr[2]; 
    }
    if(endDateTemp[1]!=undefined){
    	var timearr=endDateTemp[1].split(":");
    	arrEndTime[0] = timearr[0]==undefined?0:timearr[0];  
    	arrEndTime[1] = timearr[1]==undefined?0:timearr[1]; 
    	arrEndTime[2] = timearr[2]==undefined?0:timearr[2]; 
    }

    var allStartDate = new Date(arrStartDate[0], arrStartDate[1], arrStartDate[2], arrStartTime[0], arrStartTime[1], arrStartTime[2]);  
    var allEndDate = new Date(arrEndDate[0], arrEndDate[1], arrEndDate[2], arrEndTime[0], arrEndTime[1], arrEndTime[2]);   
 
    if (allStartDate.getTime() > allEndDate.getTime()) {    
        return 1;  
    } else if(allStartDate.getTime() == allEndDate.getTime()){  
    	return 0;
    } else {   
    	return -1;  
      }   
} 