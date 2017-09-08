var factory="";
var workshop="";
var workgroup="";
var team="";
var salary_model="技能系数";
var staff_hour_list=[];
var org_id="";
var is_customer="0";
$(document).ready(function() {
	initPage();

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/BMS/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})
	
	$(document).on("click","#btnQuery",function(){
		if(!team){
			alert("请选择小班组！");
			return false;
		}
		//先destroy datatable，隐藏form
		if($.fn.dataTable.isDataTable("#tableResult")){
			$('#tableResult').DataTable().destroy();
			$('#tableResult').empty();
		}
		
		//显示选择的小班组人员列表
		ajaxGetStaffHoursDetail();
		if(staff_hour_list.length>0){
			showStaffList(staff_hour_list);
		}
	});
	
	$(document).on("input","#bus_number",function(){
		//alert("aa");
		$("#bus_number").attr("order_id","");
	});
	
	//全选反选
	$(document).on("click","#checkall",function(){
		//alert("aa");
		if ($('#checkall').is(":checked")) {
			//alert("选中")
			check_All_unAll("#tableResult",true);
		}
		if($('#checkall').is(":checked")==false){
			
			check_All_unAll("#tableResult",false);
		}
		
	})

	
	//驳回工时工资信息
	$(document).on("click","#btnSave",function(){
		var cboxlist=$("#tableResult tbody :checked");
		var bus_list=[];
		var work_date_list=[];
		if(cboxlist.length==0){
			alert("请选择需要审核的工时信息！");
			return false;
		}
		$.each(cboxlist,function(i,cbox){
			var td=$(cbox).parent("td");
			if(td.css("display")!='none'){
				if(salary_model=='技能系数' ||salary_model=='承包制' ){
					var bus_number=$(td).next().html();
					bus_list.push(bus_number)
				}
				if(salary_model=='辅助人力' ||salary_model=='底薪模式' ){
					var work_date=$(td).next().html();
					work_date_list.push(work_date);
				}

			}
		})
		//alert(bus_list.join(",")+"/"+work_date_list.join(","))
	
		ajaxSave(bus_list.join(","),work_date_list.join(","),salary_model);
	})
});

function initPage() {
	getBusNumberSelect('#nav-search-input');
	getOrgAuthTree($("#workGroupTree"),'production/pieceWorkhourMtn',"1,2,3,4",'1',3);
	$('#workGroupTree').height($(window).height()-110)
	$('#workGroupTree').ace_scroll({
		size:$(this).attr('data-size')|| $(window).height()-110,
		mouseWheelLock: true,
		alwaysVisible : true
	});
	
	getBusNumberSelect("#bus_number", "", null);
	
}	

function zTreeBeforeClick(treeId, treeNode, clickFlag) {
}

function zTreeOnClick(event, treeId, treeNode) {
	factory=null;
	workshop=null;
	workgroup=null;
	team=null;
	if(treeNode.org_type=='1'){
		factory=treeNode.displayName;
	}	
	if(treeNode.org_type == '2'){
		factory=treeNode.getParentNode().displayName;
		workshop=treeNode.displayName;
	}
	if(treeNode.org_type == '3'){
		factory=treeNode.getParentNode().getParentNode().displayName;
		workshop=treeNode.getParentNode().displayName;
		workgroup=treeNode.displayName;
	}
	if(treeNode.org_type == '4'){
		factory=treeNode.getParentNode().getParentNode().getParentNode().displayName;
		workshop=treeNode.getParentNode().getParentNode().displayName;
		workgroup=treeNode.getParentNode().displayName;
		team=treeNode.displayName;
		org_id=treeNode.id;
	}
	
	//先destroy datatable，隐藏form
	if($.fn.dataTable.isDataTable("#tableResult")){
		$('#tableResult').DataTable().destroy();
		$('#tableResult').empty();
	}
	
	if(treeNode.org_type != '4'){
		alert("请选择小班组！");
		return false;
	}

	
	//显示选择的小班组人员列表
	ajaxGetStaffHoursDetail();
	if(staff_hour_list.length>0){
		showStaffList(staff_hour_list);
	}else{
		alert("抱歉，未查询到工时信息!");
	}
	
};

function showStaffList(staff_hour_list){
	var columns=[];
	var fixedColumns={};
	var rowsGroup=[];
	if(salary_model=='技能系数'){
		fixedColumns={
	            leftColumns: 5,
	            rightColumns:0
	        };
		rowsGroup=[0,1,2,3,4];
		columns= [
		            {"title":"<input id=\"checkall\" type=\"checkbox\" />","width":"30","class":"center","data":"","defaultContent": "","render":function(data,type,row){
		            	return "<input  type=\"checkbox\" bus='"+row.bus_number+"'/>";
		            }},
		            {"title":"车号","class":"center","data":"bus_number","defaultContent": ""},
		            {"title":"操作日期","class":"center","data":"work_date","defaultContent": ""},
		            {"title":"单价","class":"center","data":"standard_price","defaultContent": ""},
		            {"title":"补贴车","class":"center","data":"bonus","defaultContent": ""/*,"render":function(data,type,row){
		            	return "<input type='text' class='input-medium bonus' style='width:60px;height:28px;text-align:center' value='"+data+"' />";
		            }*/},
		            {"title":"工号","class":"center","data":"staff_number","defaultContent": ""},
		            {"title":"姓名","class":"center","data":"staff_name","defaultContent": ""},
		            {"title":"岗位","class":"center","data": "job","defaultContent": ""},		            
		            {"title":"技能系数","width":"80","class":"center","data":"skill_parameter","defaultContent": ""},		            
		            {"title":"参与度/工时","width":"100","class":"center","data": "work_hour","defaultContent": ""/*,"render":function(data,type,row){
		            	return "<input type='text' class='input-medium work_hour' style='width:60px;height:28px;text-align:center' value='"+data+"' />";
		            }*/},
		            {"title":"计件工资","class":"center","data": "ppay","defaultContent": ""},	
		            {"title":"车间","class":"center","data":"workshop_org","defaultContent":""},
		            {"title":"工厂","class":"center","data":"plant_org","defaultContent": ""},
		          
		          ]	;
	}
	if(salary_model=='承包制'){
		fixedColumns={
	            leftColumns: 5,
	            rightColumns:0
	        };
		rowsGroup=[0,1,2,3,4];
		columns= [
		            {"title":"<input id=\"checkall\" type=\"checkbox\" />","width":"30","class":"center","data":"bus_number","defaultContent": "","render":function(data,type,row){
		            	return "<input  type=\"checkbox\" bus='"+row.bus_number+"'/>";
		            }},
		            {"title":"车号","class":"center","data":"bus_number","defaultContent": ""},
		            {"title":"操作日期","class":"center","data":"work_date","defaultContent": ""},
		            {"title":"单价","class":"center","data":"standard_price","defaultContent": ""},
		            {"title":"补贴车","class":"center","data":"bonus","defaultContent": ""/*,"render":function(data,type,row){
		            	return "<input type='text' class='input-medium bonus' style='width:60px;height:28px;text-align:center' value='"+data+"' />";
		            }*/},
		            {"title":"工号","class":"center","data":"staff_number","defaultContent": ""},
		            {"title":"姓名","class":"center","data":"staff_name","defaultContent": ""},
		            {"title":"岗位","class":"center","data": "job","defaultContent": ""},         	            
		            {"title":"分配金额","width":"100","class":"center","data": "distribution","defaultContent": ""/*,"render":function(data,type,row){
		            	return "<input type='text' class='input-medium distribution' style='width:60px;height:28px;text-align:center'  value='"+data+"'/>"
		            }*/},
		            {"title":"计件工资","class":"center","data": "ppay","defaultContent": ""},
		            {"title":"车间","class":"center","data":"workshop_org","defaultContent":""},
		            {"title":"工厂","class":"center","data":"plant_org","defaultContent": ""},
		         
		          ]	;
	}
	if(salary_model=='辅助人力'||salary_model=='底薪模式'){
		fixedColumns={
	            leftColumns: 2,
	            rightColumns:0
	        };
		rowsGroup=[0,1];
		columns= [
		            {"title":"<input id=\"checkall\" type=\"checkbox\" />","width":"30","class":"center","data":"work_date","defaultContent": "","render":function(data,type,row){
		            	return "<input  type=\"checkbox\" />";
		            }},
		            {"title":"操作日期","class":"center","data":"work_date","defaultContent": ""},
		            {"title":"工号","class":"center","data":"staff_number","defaultContent": ""},
		            {"title":"姓名","class":"center","data":"staff_name","defaultContent": ""},
		            {"title":"岗位","class":"center","data": "job","defaultContent": ""},	  
		            {"title":"技能系数","width":"80","class":"center","data":"skill_parameter","defaultContent": ""},		
		            {"title":"参与度/工时","width":"100","class":"center","data": "work_hour","defaultContent": ""/*,"render":function(data,type,row){
		            	return "<input type='text' class='input-medium work_hour' style='width:60px;height:28px;text-align:center'  value='"+data+"'/>";
		            }*/},	
		            {"title":"计件工资(月)","class":"center","data": "ppay","defaultContent": ""},
		            {"title":"车间","class":"center","data":"workshop_org","defaultContent":""},
		            {"title":"工厂","class":"center","data":"plant_org","defaultContent": ""},
		          ]	;
	}
	
	$("#tableResult").DataTable({
		paiging:false,
		ordering:false,
		searching: false,
		autoWidth:false,
		/*fixedColumns:fixedColumns,*/
		rowsGroup:rowsGroup,
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
			zeroRecords:"未查询到人员数据！"
		},
		data:staff_hour_list,
		columns:columns
	});
	
	
/*	$('#tableReusltDiv').ace_scroll({
		size:$(this).attr('data-size')|| $(window).height()-210,
		mouseWheelLock: true,
		alwaysVisible : false
	});*/
}

function ajaxGetStaffHoursDetail(staff_number){
	var order_id=$("#bus_number").attr("order_id")||$("#order_no").attr("order_id");
		$.ajax({
			url:'getStaffHoursDetail',
			type:'post',
			dataType:'json',
			async:false,
			data:{
				org_id:org_id,
				bus_number:$("#bus_number").val(),
				wdate_start:$("#wdate_start").val(),
				wdate_end:$("#wdate_end").val(),
				status:'1'
			},
			success:function(response){
				if(response.salary_model){
					salary_model=response.salary_model.salary_model;
					is_customer=response.salary_model.customer_no_flag;
				}
				staff_hour_list=response.staff_hour_list;				
			}
		})
}

function ajaxSave(bus_number_list,work_date_list,salary_model){
	$.ajax({
		url:'verifyStaffHours',
		method:'post',
		dataType:'json',
		async:false,
		data:{
			factory:factory,
			workshop:workshop,
			workgroup:workgroup,
			team:team,
			bus_number_list:bus_number_list,
			work_date_list:work_date_list,
			salary_model:salary_model
		},
		success:function(response){
			fadeMessageAlert("",response.message, "gitter-success")
			//先destroy datatable，隐藏form
			if($.fn.dataTable.isDataTable("#tableResult")){
				$('#tableResult').DataTable().destroy();
				$('#tableResult').empty();
			}
			
			//显示选择的小班组人员列表
			ajaxGetStaffHoursDetail();
			if(staff_hour_list.length>0){
				showStaffList(staff_hour_list);
			}
		}
	});

}
//限制开始和结束时间为同一个月
function limitMonthDate(e) {
	var DateString;
	if (e == 2) {
		var beginDate = $dp.$("wdate_start").value;
		if (beginDate != "" && beginDate != null) {
			var limitDate = new Date(beginDate);
			limitDate.setDate(new Date(limitDate.getFullYear(), limitDate
					.getMonth() + 1, 0).getDate()); //获取此月份的天数
			DateString = limitDate.getFullYear() + '-'
					+ (limitDate.getMonth() + 1) + '-'
					+ limitDate.getDate();
			return DateString;
		}
	}
	if (e == 1) {
		var endDate = $dp.$("wdate_end").value;
		if (endDate != "" && endDate != null) {
			var limitDate = new Date(endDate);
			limitDate.setDate("1"); //设置闲置时间为月初
			DateString = limitDate.getFullYear() + '-'
					+ (limitDate.getMonth() + 1) + '-'
					+ limitDate.getDate();
			return DateString;
		}
	}
	
}
