$(document).ready(function(){
	initPage();

	//点击查询
	$("#btnQuery").click(function(){
		ajaxQuery();
	});
	$('#search_factory').change(function(){ 
		getWorkshopSelect("production/queryTmpOrder",$("#search_factory :selected").text(),"","#search_workshop",null,"id");
	});

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/BMS/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})
});

function initPage(){
	getBusNumberSelect('#nav-search-input');
	//ajaxQuery();
	getFactorySelect("production/queryTmpOrder","","#search_factory",null,"id")	
	getWorkshopSelect("production/queryTmpOrder",$("#search_factory :selected").text(),"","#search_workshop",null,"id");
	
}
function ajaxQuery(){
	$("#tableResult").DataTable({
		serverSide: true,
		paiging:true,
		ordering:false,
		searching: false,
		bAutoWidth:false,
		fixedColumns:   {
			leftColumns:1,
            rightColumns:0
        },
		destroy: true,
		sScrollY: $(window).height()-250,
		scrollX: true,
		pageLength: 20,
		pagingType:"full_numbers",
		lengthChange:false,
		orderMulti:false,
		language: {
			emptyTable:"抱歉，未查询到数据！",
			info:"共计 _TOTAL_ 条，当前第 _PAGE_ 页 共 _PAGES_ 页",
			infoEmpty:"抱歉，未查询到数据！",
			paginate: {
			  first:"首页",
		      previous: "上一页",
		      next:"下一页",
		      last:"尾页",
		      loadingRecords: "请稍等,加载中...",		     
			}
		},
		ajax:function (data, callback, settings) {
			var factory="",workshop="";
			if($("#search_factory :selected").text()!="全部"){
				factory=$("#search_factory :selected").text();
			}
			if($("#search_workshop :selected").text()!="全部" && $("#search_workshop :selected").text()!=undefined){
				workshop=$("#search_workshop :selected").text();
			}
			var param ={
					"draw":1,
					"tmp_order_no":$("#search_tmp_order_no").val(),
					"status":$("#search_status").val(),
					"factory":factory,
					"workshop":workshop,
					"reason_content":$("#search_reason_content").val(),
					"apply_date_start":$("#search_date_start").val(),
					"apply_date_end":$("#search_date_end").val()
					};
            param.length = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;//开始的记录序号
            param.page = (data.start / data.length)+1;//当前页码

            $.ajax({
                type: "post",
                url: "queryTmpOrderList",
                cache: false,  //禁用缓存
                data: param,  //传入组装的参数
                dataType: "json",
                success: function (result) {
                    //console.log(result);
                	//封装返回数据
                    var returnData = {};
                    returnData.draw = data.draw;//这里直接自行返回了draw计数器,应该由后台返回
                    returnData.recordsTotal = result.recordsTotal;//返回数据全部记录
                    returnData.recordsFiltered = result.recordsTotal;//后台不实现过滤功能，每次查询均视作全部结果
                    returnData.data = result.data;//返回的数据列表
                    callback(returnData);
                    var head_width=$(".dataTables_scrollHead").width();
                    $(".dataTables_scrollHead").css("width",head_width-20);
                }
            });
		
		},
		columns: [
		            {"title":"派工流水号","class":"center","data":"tmp_order_no","defaultContent": "","render":function(data,type,row){
		            	return "<a style=\"cursor:pointer\" onclick=show(\'"+data+"\',\'"+row.id+"\')>"+data+"</a>";
		            }},
		            {"title":"作业原因/内容","class":"center","width":"500px","data": "reason_content","defaultContent": ""},
		            {"title":"工单号","class":"center","data": "sap_order","defaultContent": ""},
		            {"title":"总数量","class":"center","data":"total_qty","defaultContent": ""},		 
		            {"title":"已完成","class":"center","data": "finished_qty","defaultContent": ""},		  
		            {"title":"工时","class":"center","data": "single_hour","defaultContent": ""},		  
		            {"title":"所需人力","class":"center","data": "labors","defaultContent": ""},		
		            {"title":"总工时","class":"center","data": "total_hours","defaultContent": ""},	
		            {"title":"制作工厂","class":"center","data":"factory","defaultContent": ""},
		            {"title":"制作车间","class":"center","data":"workshop","defaultContent": ""},
		            {"title":"责任单位","class":"center","data":"duty_unit","defaultContent": ""},
		            {"title":"状态","class":"center","data":"workshop","defaultContent": "","render":function(data,type,row){
		            	var status_arr={"0":"已评估","1":"已审核","2":"已驳回"};
		        		var stauts=row.status==undefined?"":status_arr[row.status];
		        		return stauts;
		            }},
		          ]
	});
}
function getExtraWorkHourManager(flag){
	$("#order_type").removeAttr("disabled");
	$("#is_cost_transfer").removeAttr("disabled");
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
				
			};
			param.length = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;//开始的记录序号
            param.page = (data.start / data.length)+1;//当前页码

            $.ajax({
                type: "post",
                url: "getExtraWorkHourManagerList",
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
		            {"title":"派工类型","class":"center","data":"order_type","defaultContent": ""},
		            {"title":"作业原因/内容","class":"center","data":"reason_content","defaultContent": ""},
		            {"title":"单工时","class":"center","data":"single_hour","defaultContent": ""},
		            {"title":"工时评估人","class":"center","data":"assesor","defaultContent": ""},
		            {"title":"工时评估负责人","class":"center","data": "assess_verifier","defaultContent": ""},
		            {"title":"责任部门","class":"center","data": "duty_unit","defaultContent": ""}
          ],
	});
	$("#div-dialog").removeClass('hide').dialog({
		resizable: false,
		title: '<div class="widget-header"><h4 class="smaller"><i class="ace-icon fa fa-users green"></i> 选择额外工时库</h4></div>',
		title_html: true,
		width:900,
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
				var tr=$(radio).parent().parent();
				var order_type=$(tr).children("td").eq(1).html();
				var reason_content=$(tr).children("td").eq(2).html();
				var single_hour=$(tr).children("td").eq(3).html();
				var assesor=$(tr).children("td").eq(4).html();
				var assess_verifier=$(tr).children("td").eq(5).html();
				var duty_unit=$(tr).children("td").eq(6).html();
				if(flag=="add"){
					var ops=document.getElementById("order_type");
			        for(var i=0;i<ops.options.length;i++){
			            ops.options[i].removeAttribute("selected");
			        }
					$("#order_type option[value='"+order_type+"']").prop("selected",true);
					$("#reason_content").val(reason_content);
					$("#single_hour").val(single_hour);
					$("#assesor").val(assesor);
					$("#assess_verifier").val(assess_verifier);
					$("#duty_unit").val(duty_unit);
					var ops=document.getElementById("is_cost_transfer");
			        for(var i=0;i<ops.options.length;i++){
			            ops.options[i].removeAttribute("selected");
			        }
					var cost_transfer=$("#order_type").find("option:selected").attr("cost_transfer");
					$("#is_cost_transfer option[value='"+cost_transfer+"']").prop("selected",true);
					$("#order_type").attr("disabled","disabled");
					$("#is_cost_transfer").attr("disabled","disabled");
				}
				if(flag=="edit"){
					var ops=document.getElementById("edit_order_type");
			        for(var i=0;i<ops.options.length;i++){
			            ops.options[i].removeAttribute("selected");
			        }
					$("#edit_order_type option[value='"+order_type+"']").prop("selected",true);
					$("#edit_reason_content").val(reason_content);
					$("#edit_single_hour").val(single_hour);
					$("#edit_assesor").val(assesor);
					$("#edit_assess_verifier").val(assess_verifier);
					$("#edit_duty_unit").val(duty_unit);
					var ops=document.getElementById("edit_is_cost_transfer");
			        for(var i=0;i<ops.options.length;i++){
			            ops.options[i].removeAttribute("selected");
			        }
					var cost_transfer=$("#edit_order_type").find("option:selected").attr("cost_transfer");
					$("#edit_is_cost_transfer option[value='"+cost_transfer+"']").prop("selected",true);
					$("#edit_order_type").attr("disabled","disabled");
					$("#edit_is_cost_transfer").attr("disabled","disabled");
				}
				$( this ).dialog( "close" );
				}
			} 
		//}
			]

	});

}

function show(tmp_order_no,id){
  
	var dialog = $("#dialog-show").removeClass('hide').dialog({
		width:800,
		height:600,
		modal: true,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i> 临时派工单查看</h4></div>",
		title_html: true,
		buttons: [ 
			{
				text: "取消",
				"class" : "btn btn-minier",
				click: function() {
					$( this ).dialog( "close" ); 
				} 
			}
		]
	});
	$("#baseinfo").addClass("active");
	$("#div1").addClass("active");
	$("#productiondetailmtn").removeClass("active");
	$("#workhourdetail").removeClass("active");
	$("#workhourallot").removeClass("active");
	$("#div2").removeClass("active");
	$("#div3").removeClass("active");
	$("#div4").removeClass("active");
	var param ={
			"tmp_order_no":tmp_order_no,
			"temp_order_id":id
			};
    $.ajax({
        type: "post",
        url: "showTmpOrderDetail",
        cache: false,  //禁用缓存
        data: param,  //传入组装的参数
        dataType: "json",
        success: function (result) {
        	clearText();
        	$("#show_order_launcher").text(result.tmpOrderMap.data[0].order_launcher);
        	$("#show_factory").text(result.tmpOrderMap.data[0].factory);
        	$("#show_workshop").text(result.tmpOrderMap.data[0].workshop);
        	$("#show_head_launch_unit").text(result.tmpOrderMap.data[0].head_launch_unit);
        	$("#show_acceptor").text(result.tmpOrderMap.data[0].acceptor);
        	var reason_content=result.tmpOrderMap.data[0].reason_content;
        	$("#show_reason_content").html('<div title=\''+reason_content+'\'>'+reason_content.substring(0,8)+'...</div>');
        	$("#show_total_qty").text(result.tmpOrderMap.data[0].total_qty);
        	$("#show_order_type").text(result.tmpOrderMap.data[0].order_type);
        	$("#show_duty_unit").text(result.tmpOrderMap.data[0].duty_unit);
        	$("#show_labors").text(result.tmpOrderMap.data[0].labors);
        	$("#show_single_hour").text(result.tmpOrderMap.data[0].single_hour);
        	$("#show_assesor").text(result.tmpOrderMap.data[0].assesor);
        	$("#show_assess_verifier").text(result.tmpOrderMap.data[0].assess_verifier);
        	$("#show_is_cost_transfer").text(result.tmpOrderMap.data[0].is_cost_transfer=='0' ? '否':'是');
        	$("#show_cost_unit_signer").text(result.tmpOrderMap.data[0].cost_unit_signer);
        	$("#show_tmp_order_no").text(result.tmpOrderMap.data[0].tmp_order_no);
        	$("#show_sap_order").text(result.tmpOrderMap.data[0].sap_order);
        	$("#show_acceptor_sign").text(result.tmpOrderMap.data[0].acceptor);
        	var columns=[];
        	var tmpOrderProcedureList = result.tmpOrderProcedureList;
        	var assignList = result.assignList;
        	var staffTmpHoursList = result.staffTmpHoursList;
            columns=[
    		            {"title":"产量","class":"center","data":"output","defaultContent": ""},
    		            {"title":"维护人","class":"center","data":"recorder","defaultContent": ""},
    		            {"title":"维护时间","class":"center","data":"record_date","defaultContent": ""},
              ];
            //先destroy datatable，隐藏form
          	if($.fn.dataTable.isDataTable("#productiondetailmtnResult")){
          		$('#productiondetailmtnResult').DataTable().destroy();
          		$('#productiondetailmtnResult').empty();
          	}
            $("#productiondetailmtnResult").DataTable({
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
        		data:tmpOrderProcedureList,
        		columns:columns
        	});
            columns=[
                    {"title":"操作日期","class":"center","data":"work_date","defaultContent": ""},
  		            {"title":"工号","class":"center","data":"staff_number","defaultContent": ""},
  		            {"title":"姓名","class":"center","data":"staff_name","defaultContent": ""},
  		            {"title":"岗位","class":"center","data":"job","defaultContent": ""},
  		            {"title":"工时","class":"center","data":"work_hour","defaultContent": ""},
  		            {"title":"记录人","class":"center","data":"editor","defaultContent": ""},
  		            {"title":"记录时间","class":"center","data":"edit_date","defaultContent": ""},
  		            {"title":"审核人","class":"center","data":"approver","defaultContent": ""},
		            {"title":"审核时间","class":"center","data":"approve_date","defaultContent": ""}
  		      ];
 
          	 if($.fn.dataTable.isDataTable("#workhourdetailResult")){
          		 $('#workhourdetailResult').DataTable().destroy();
          		 $('#workhourdetailResult').empty();
          	 }
  		     $("#workhourdetailResult").DataTable({
          		paiging:false,
          		ordering:false,
          		searching: false,
          		rowsGroup:[0],
          		autoWidth:false,
          		paginate:false,
          		sScrollY: $(window).height()-250,
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
          		data:staffTmpHoursList,
          		columns:columns
          	});
            columns=[
 		            {"title":"工号","class":"center","data":"staff_number","defaultContent": ""},
 		            {"title":"姓名","class":"center","data":"staff_name","defaultContent": ""},
 		            {"title":"车间","class":"center","data":"workshop","defaultContent": ""},
 		            {"title":"班组","class":"center","data":"workgroup","defaultContent": ""},
 		            {"title":"岗位","class":"center","data":"job","defaultContent": ""},
 		            {"title":"个人总工时","class":"center total_hour","data":"total_real_hour","defaultContent": ""},
 		            {"title":"工时分配","class":"center total_hour_allot","data":"total_hour","defaultContent": ""}
 		      ];
             if($.fn.dataTable.isDataTable("#workhourallotResult")){
         		 $('#workhourallotResult').DataTable().destroy();
         		 $('#workhourallotResult').empty();
         	 }
 		     $("#workhourallotResult").DataTable({
         		paiging:false,
         		ordering:false,
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
         			emptyTable:"",					     
         			infoEmpty:"",
         			zeroRecords:"未查询到数据！"
         		},
         		data:assignList,
         		columns:columns
         	});
 		     // 合计处理
 		     if(assignList.length>0){
 		    	var workhourtotal=0;
 	 			$("#workhourallotResult tbody").find(".total_hour").each(function(){
 	 				if($(this).text()!=""){
 	 					workhourtotal+=parseFloat($(this).text());
 	 				}
 	 			});
 	 			var workhourallottotal=0;
 	 			$("#workhourallotResult tbody").find(".total_hour_allot").each(function(){
 	 				if($(this).text()!=""){
 	 					workhourallottotal+=parseFloat($(this).text());
 	 				}
 	 			});
 	 			var tr=$("<tr />");
 	 			$("<td class='center'/>").html("").appendTo(tr);
 	 			$("<td class='center'/>").html("").appendTo(tr);
 	 			$("<td class='center'/>").html("").appendTo(tr);
 	 			$("<td class='center'/>").html("").appendTo(tr);
 	 			$("<td class='center'/>").html("合计").appendTo(tr);
 	 			$("<td class='center'/>").html(workhourtotal).appendTo(tr);
 	 			$("<td class='center'/>").html(workhourallottotal).appendTo(tr);
 	 			$("#workhourallotResult tbody").append(tr);
 		     }
        }
    }); 
}
function clearText(){
	$("#show_order_launcher").text("");
	$("#show_factory").text("");
	$("#show_workshop").text("");
	$("#show_head_launch_unit").text("");
	$("#show_acceptor").text("");
	$("#show_reason_content").text("");
	$("#show_total_qty").text("");
	$("#show_order_type").text("");
	$("#show_duty_unit").text("");
	$("#show_labors").text("");
	$("#show_single_hour").text("");
	$("#show_assesor").text("");
	$("#show_assess_verifier").text("");
	$("#show_is_cost_transfer").text("");
	$("#show_cost_unit_signer").text("");
	$("#show_tmp_order_no").text("");
	$("#show_sap_order").text("");
	$("#show_acceptor_sign").text("");
}