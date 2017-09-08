$(document).ready(function(){
	initPage();
	$('#search_factory').change(function(){ 
		getWorkshopSelect("production/createTmpOrder",$("#search_factory :selected").text(),"","#search_workshop",null,"id");
	});
	//新增
	$(document).on("click","#btnAdd",function(e){
		
		$("#order_type").removeAttr("disabled");
		$("#is_cost_transfer").removeAttr("disabled");
		getOrderType($("#order_type"));
		$("#order_type option:first").prop("selected",'selected');
		var cost_transfer=$("#order_type").find("option:selected").prop("cost_transfer");
		$("#is_cost_transfer option[value='"+cost_transfer+"']").prop("selected","selected");
		clear();
		var dialog = $("#dialog-add").removeClass('hide').dialog({
			width:800,
			height:580,
			modal: true,
			title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i> 创建临时派工单</h4></div>",
			title_html: true,
			buttons: [ 
				{
					text: "取消",
					"class" : "btn btn-minier",
					click: function() {
						$( this ).dialog( 'close' ); 
					} 
				},
				{
					text: "确定",
					"class" : "btn btn-primary btn-minier",
					click: function() {
						ajaxAdd(); 
					} 
				}
			]
		});
	})

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/BMS/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})
	
	//点击查询
	$("#btnQuery").click(function(){
		ajaxQuery();
	});
	
	$("#btnQueryExtra").click(function(){
		queryExtraWorkHourManager();
	});
	$('#new_factory').change(function(){ 
		getWorkshopSelect("production/createTmpOrder",$("#new_factory :selected").text(),"","#new_workshop",null,"id");
	});
	$('#edit_factory').change(function(){ 
		getWorkshopSelect("production/createTmpOrder",$("#edit_factory :selected").text(),"","#edit_workshop",null,"id");
	});
	$('#order_type').change(function(){ 
		$("#is_cost_transfer").removeAttr("selected");
		var ops=document.getElementById("is_cost_transfer");
        for(var i=0;i<ops.options.length;i++){
            ops.options[i].removeAttribute("selected");
        }
		var cost_transfer=$("#order_type").find("option:selected").attr("cost_transfer");
		$("#is_cost_transfer option[value='"+cost_transfer+"']").attr("selected","selected");
	});
});

function initPage(){
	getBusNumberSelect('#nav-search-input');
	getFactorySelect("production/createTmpOrder",'',"#new_factory","--请选择--",'id');
	getWorkshopSelect("",$("#new_factory :selected").text(),"","#new_workshop",null,"id");
	getFactorySelect("production/createTmpOrder",'',"#edit_factory","--请选择--",'id');
	getFactorySelect("production/createTmpOrder","","#search_factory",null,"id")	
	getWorkshopSelect("production/createTmpOrder",$("#search_factory :selected").text(),"","#search_workshop",null,"id");
	ajaxQuery();
}

function ajaxQuery(){
	$("#tableResult").DataTable({
		serverSide: true,
		paiging:true,
		ordering:false,
		searching: false,
		bAutoWidth:false,
		fixedColumns:   {
			leftColumns:3,
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
					"apply_date_start":$("#search_date_start").val(),
					"apply_date_end":$("#search_date_end").val(),
					"factory":factory,
					"workshop":workshop
					};
            param.length = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;//开始的记录序号
            param.page = (data.start / data.length)+1;//当前页码

            $.ajax({
                type: "post",
                url: "getCreateTmpOrderList",
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
		            {"title":"接收工厂","class":"center","data":"factory","defaultContent": ""},
		            {"title":"接收车间","class":"center","data":"workshop","defaultContent": ""},
		            {"title":"发起人","class":"center","data":"order_launcher","defaultContent": ""},
		            {"title":"派工描述","class":"center","width":"500px","data": "reason_content","defaultContent": ""},
		            {"title":"总数量","class":"center","data":"total_qty","defaultContent": ""},		            
		            {"title":"工时","class":"center","data": "single_hour","defaultContent": ""},		  
		            {"title":"所需人力","class":"center","data": "labors","defaultContent": ""},		
		            {"title":"总工时","class":"center","data": "total_hours","defaultContent": ""},	
		            {"title":"工单号","class":"center","data":"sap_order","defaultContent": ""},
		            {"title":"工时评估人","class":"center","data":"assesor","defaultContent": ""},
		            {"title":"工时评估负责人","class":"center","data":"assess_verifier","defaultContent": ""},
		            {"title":"指定验收人","class":"center","data":"acceptor","defaultContent": ""},
		            {"title":"派工类型","class":"center","data":"order_type","defaultContent": ""},
		            {"title":"责任部门","class":"center","data":"duty_unit","defaultContent": ""},
		            // 已评估【0】 ：可编辑、删除 ； 已驳回【2】：可编辑；其他：不能操作
		            {"title":"操作","class":"center","data":"status","render":function(data,type,row){
		            	return data=='0' ? "<i class=\"ace-icon fa fa-pencil bigger-130 editorder\" title='编辑' onclick = 'showEditPage(" + JSON.stringify(row)+ ");' style='color:green;cursor: pointer;'></i>&nbsp;&nbsp;"+
		            	"<i class=\"ace-icon glyphicon glyphicon-trash delete\" onclick=\'deleteData("+row.id+")\' style='color:green;cursor: pointer;'></i>"		            		
		            	:(data=='2' ? "<i class=\"ace-icon fa fa-pencil bigger-130 editorder\" title='编辑' onclick = 'showEditPage(" + JSON.stringify(row)+ ");' style='color:green;cursor: pointer;'></i>" : "")
		            }
		            }
		          ]
	});
}


function showEditPage(row){
	clear();
	getOrderType($("#edit_order_type"));
	$("#edit_order_launcher").val(row.order_launcher);
	$("#edit_factory option:contains('"+row.factory+"')").attr("selected", true);
	getWorkshopSelect("",$("#edit_factory :selected").text(),"","#edit_workshop",null,"id");
	$("#edit_workshop option:contains('"+row.workshop+"')").attr("selected", true);
	$("#edit_head_launch_unit").val(row.head_launch_unit);
	$("#edit_acceptor").val(row.acceptor);
	$("#edit_reason_content").val(row.reason_content);
	$("#edit_total_qty").val(row.total_qty),
	$("#edit_order_type option[value='"+row.order_type+"']").prop("selected",true);
	$("#edit_duty_unit").val(row.duty_unit);
	$("#edit_labors").val(row.labors);
	$("#edit_single_hour").val(row.single_hour);
	$("#edit_assesor").val(row.assesor);
	$("#edit_assess_verifier").val(row.assess_verifier);
	$("#edit_acceptor_sign").val(row.acceptor);
	var ops=document.getElementById("edit_is_cost_transfer");
    for(var i=0;i<ops.options.length;i++){
        ops.options[i].removeAttribute("selected");
    }
    
	$("#edit_is_cost_transfer option[value='"+row.is_cost_transfer+"']").prop("selected",true),
	$("#edit_cost_unit_signer").val(row.cost_unit_signer),
	$("#edit_order_serial_no").val(row.order_serial_no),
	$("#edit_tmp_order_no").val(row.tmp_order_no),
	$("#edit_sap_order").val(row.sap_order);
	var dialog = $( "#dialog-edit" ).removeClass('hide').dialog({
		width:800,
		height:580,
		modal: true,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i> 编辑临时派工单</h4></div>",
		title_html: true,
		zIndex: 1, 
		buttons: [ 
			{
				text: "取消",
				"class" : "btn btn-minier",
				click: function() {
					$( this ).dialog( 'close' ); 
				} 
			},
			{
				text: "确定",
				"class" : "btn btn-primary btn-minier",
				click: function() {
					ajaxEdit(row.id); 
				} 
			}
		]
	}).dialog({ zIndex: 1999 });
}

function ajaxAdd(){
	$("#order_type").removeAttr("disabled");
	$("#is_cost_transfer").removeAttr("disabled");
	//数据验证
	if($("#tmp_order_no").val()==undefined||$("#tmp_order_no").val().trim().length==0){
		alert('派工流水号不能为空！');
		$("#tmp_order_no").focus();
		return false;
	}else{
		if(!validateOrderSerialNo($("#tmp_order_no").val())){
			alert("你输入的派工流水号不符合工厂简码+四位年+两位月+四位流水的规则，如CS2017120001！");
			return false;
		}
	}
	if($("#order_launcher").val()==undefined||$("#order_launcher").val().trim().length==0){
		alert('派工发起人不能为空！');
		$("#order_launcher").focus();
		return false;
	}
	if($("#new_factory").val()==undefined||$("#new_factory").val()==""){
		alert("派工接收工厂不能为空！");
		$("#new_factory").focus();
		return false;
	}
	if($("#new_workshop").val()==undefined||$("#new_workshop").val().trim().length==0){
		alert('派工接收车间不能为空！');
		$("#new_workshop").focus();
		return false;
	}
	if($("#head_launch_unit").val()==undefined||$("#head_launch_unit").val().trim().length==0){
		alert('发起部门主管不能为空！');
		$("#head_launch_unit").focus();
		return false;
	}
	
	if($("#acceptor").val()==undefined||$("#acceptor").val().trim().length==0){
		alert('验收人不能为空！');
		$("#acceptor").focus();
		return false;
	}
	var acceptor=$("#acceptor").val();
	if($("#reason_content").val()==undefined||$("#reason_content").val().trim().length==0){
		alert('作业内容不能为空！');
		$("#reason_content").focus();
		return false;
	}
	if($("#labors").val()==undefined||$("#labors").val().trim().length==0){
		alert('所需人力不能为空！');
		$("#labors").focus();
		return false;
	}
	
	if($("#total_qty").val()==undefined||$("#total_qty").val().trim()==''){
		alert('总数量不能为空！');
		$("#total_qty").focus();
		return false;
	}else{
		if(!const_float_validate.test($("#total_qty").val())){
			alert("总数量只能是数字！");
			$("#total_qty").val("");
			return false;
		}
	}
	if($("#single_hour").val()==undefined||$("#single_hour").val().trim()==''){
		alert('单工时不能为空！');
		$("#single_hour").focus();
		return false;
	}else{
		if(!const_float_validate.test($("#single_hour").val())){
			alert("单工时只能是数字！");
			$("#single_hour").val("");
			return false;
		}
	}
	if($("#sap_order").val()==undefined||$("#sap_order").val().trim().length==0){
		alert('工单号不能为空！');
		$("#sap_order").focus();
		return false;
	}
	if($("#cost_unit_signer").val()==undefined||$("#cost_unit_signer").val().trim().length==0){
		alert('成本科签字不能为空！');
		$("#cost_unit_signer").focus();
		return false;
	}
	if($("#sap_order").val()==undefined||$("#sap_order").val().trim().length==0){
		alert('工单号不能为空！');
		$("#sap_order").focus();
		return false;
	}
	if($("#new_acceptor_sign").val()==undefined||$("#new_acceptor_sign").val().trim().length==0){
		alert('验收人签字不能为空！');
		$("#new_acceptor_sign").focus();
		return false;
	}else if(acceptor!=$("#new_acceptor_sign").val()){
		alert("验收人和验收人签字不一致！");
		return false;
	}
	
	$.ajax({
		type:"post",
		url:"getCreateTmpOrderList",
		dataType:"json",
		data:{
			tmp_order_no:$("#tmp_order_no").val(),
			"draw":'1',
			"start":0,
			"length":1000,
		},
		success:function(response){
			if(response.data.length>0){
				alert("该派工流水号已经存在");
				return false;
			}else{
				$.ajax({
					type:"post",
					url:"addCreateTmpOrder",
					dataType:"json",
					data:{
						order_launcher:$("#order_launcher").val(),
						factory:$("#new_factory").find("option:selected").text(),
						workshop:$("#new_workshop").find("option:selected").text(),
						head_launch_unit:$("#head_launch_unit").val(),
						acceptor:$("#acceptor").val(),
						reason_content:$("#reason_content").val(),
						total_qty:$("#total_qty").val(),
						order_type:$("#order_type").val(),
						duty_unit:$("#duty_unit").val(),
						labors:$("#labors").val(),
						single_hour:$("#single_hour").val(),
						total_hours:parseFloat($("#single_hour").val())*parseFloat($("#total_qty").val()),
						assesor:$("#assesor").val(),
						assess_verifier:$("#assess_verifier").val(),
						is_cost_transfer:$("#is_cost_transfer").val(),
						cost_unit_signer:$("#cost_unit_signer").val(),
						tmp_order_no:$("#tmp_order_no").val(),
						order_serial_no:$("#order_serial_no").val(),
						sap_order:$("#sap_order").val()
					},
					success:function(response){
						$("#dialog-add").dialog( 'close' ); 
						if(response.success){
							$.gritter.add({
								title: '系统提示：',
								text: '<h5>'+response.message+'！</h5>',
								class_name: 'gritter-info'
							});
							ajaxQuery();
						}else{
							$.gritter.add({
								title: '系统提示：',
								text: '<h5>'+response.message+'</h5><br>',
								class_name: 'gritter-info'
							});
						}
					},
					error:function(response){
						alert("保存失败");
					}
				})
			}
		}
	});
	
}
/**
 * 单车编辑
 * @param bus_number
 */
function ajaxEdit(id){
	$("#edit_order_type").removeAttr("disabled");
	$("#edit_is_cost_transfer").removeAttr("disabled");
	//数据验证
	if($("#edit_factory").val()==undefined||$("#edit_factory").val().trim().length==0){
		alert('请选择接收工厂！');
		return false;
	}
	if($("#edit_reason_content").val()==undefined||$("#edit_reason_content").val().trim().length==0){
		alert('作业原因/内容不能为空！');
		$("#edit_reason_content").focus();
		return false;
	}
	
	if($("#edit_acceptor").val()==undefined||$("#edit_acceptor").val().trim().length==0){
		alert('请输入验收人！');
		$("#edit_acceptor").focus();
		return false;
	}
	var acceptor=$("#edit_acceptor").val();
	if($("#edit_tmp_order_no").val()==undefined||$("#edit_tmp_order_no").val()==""){
		alert("请输入派工流水号！");
		$("#edit_tmp_order_no").focus();
		return false;
	}else{
		if(!validateOrderSerialNo($("#edit_tmp_order_no").val())){
			alert("你输入的派工流水号不符合工厂简码+四位年+两位月+四位流水的规则，如CS2017120001！");
			return false;
		}
	}
	if($("#edit_labors").val()==undefined||$("#edit_labors").val().trim().length==0){
		alert('所需人力不能为空！');
		$("#edit_labors").focus();
		return false;
	}
	if($("#edit_total_qty").val()==undefined||$("#edit_total_qty").val().trim()==''){
		alert('总数量不能为空！');
		$("#edit_total_qty").focus();
		return false;
	}else{
		if(!const_float_validate.test($("#edit_total_qty").val())){
			alert("总数量只能是数字！");
			$("#edit_total_qty").val("");
			return false;
		}
	}
	if($("#edit_cost_unit_signer").val()==undefined||$("#edit_cost_unit_signer").val().trim().length==0){
		alert('成本科签字不能为空！');
		$("#edit_cost_unit_signer").focus();
		return false;
	}
	
	if($("#edit_sap_order").val()==undefined||$("#edit_sap_order").val().trim().length==0){
		alert('工单号不能为空！');
		$("#edit_sap_order").focus();
		return false;
	}
	if($("#edit_acceptor_sign").val()==undefined||$("#edit_acceptor_sign").val().trim().length==0){
		alert('验收人签字不能为空！');
		$("#edit_acceptor_sign").focus();
		return false;
	}else if(acceptor!=$("#edit_acceptor_sign").val()){
		alert("验收人和验收人签字不一致！");
		return false;
	}
	
	$.ajax({
		type:"post",
		url:"editCreateTmpOrder",
		dataType:"json",
		data:{
			order_launcher:$("#edit_order_launcher").val(),
			factory:$("#edit_factory").find("option:selected").text(),
			workshop:$("#edit_workshop").find("option:selected").text(),
			head_launch_unit:$("#edit_head_launch_unit").val(),
			acceptor:$("#edit_acceptor").val(),
			reason_content:$("#edit_reason_content").val(),
			total_qty:$("#edit_total_qty").val(),
			order_type:$("#edit_order_type").val(),
			duty_unit:$("#edit_duty_unit").val(),
			labors:$("#edit_labors").val(),
			single_hour:$("#edit_single_hour").val(),
			total_hours:parseFloat($("#edit_single_hour").val())*parseFloat($("#edit_total_qty").val()),
			assesor:$("#edit_assesor").val(),
			assess_verifier:$("#edit_assess_verifier").val(),
			is_cost_transfer:$("#edit_is_cost_transfer").val(),
			cost_unit_signer:$("#edit_cost_unit_signer").val(),
			tmp_order_no:$("#edit_tmp_order_no").val(),
			sap_order:$("#edit_sap_order").val(),
			id:id
		},
		success:function(response){
			$("#dialog-edit" ).dialog( 'close' ); 
			if(response.success){
				$.gritter.add({
					title: '系统提示：',
					text: '<h5>'+response.message+'！</h5>',
					class_name: 'gritter-info'
				});
				ajaxQuery();
			}else{
				$.gritter.add({
					title: '系统提示：',
					text: '<h5>'+response.message+'</h5><br>',
					class_name: 'gritter-info'
				});
			}
		}
	})
}

function getExtraWorkHourManager(flag){
	$("#order_type").removeAttr("disabled");
	$("#is_cost_transfer").removeAttr("disabled");
	getBusTypeSelect("","#search_bus_type","全部","id");
	getOrderNoSelect("#search_order_no","#orderId");
	queryExtraWorkHourManager(flag);
}
function queryExtraWorkHourManager(flag){
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
				"order_no":$("#search_order_no").val(),
				"bus_type":$("#search_bus_type").val(),
				"order_type":$("#search_order_type").val(),
				"reason_content":$("#search_reason_content").val()
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
		            {"title":"车型","class":"center","data":"bus_type","defaultContent": ""},
		            {"title":"订单编号","class":"center","data":"order_no","defaultContent": ""},
		            {"title":"派工类型","class":"center","data":"tmp_order_type","defaultContent": ""},
		            {"title":"作业原因/内容","class":"center","data":"reason_content","defaultContent": ""},
		            {"title":"单工时","class":"center","data":"single_hour","defaultContent": ""},
		            {"title":"工时评估人","class":"center","data":"assesor","defaultContent": ""},
		            {"title":"评估审核人","class":"center","data": "assess_verifier","defaultContent": ""},
		            {"title":"责任部门","class":"center","data": "duty_unit","defaultContent": ""}
          ],
	});
	
	$("#div-dialog").removeClass('hide').dialog({
		resizable: false,
		title: '<div class="widget-header editDiv"><h4 class="smaller"><i class="ace-icon fa fa-users green"></i> 选择额外工时库</h4></div>',
		title_html: true,
		width:900,
		height:600,
		modal: true,
		zIndex: 2, 
		buttons: [{
					text: "关闭",
					"class" : "btn btn-minier",
					click: function() {$( this ).dialog( 'destroy' );} 
				},
		        {
			text: "确认",
			"class" : "btn btn-primary btn-minier",
			click: function() {
				
				var radio=$('input:radio[name="exp_radio"]:checked');		
				var tr=$(radio).parent().parent();
				var order_type=$(tr).children("td").eq(3).html();
				var reason_content=$(tr).children("td").eq(4).html();
				var single_hour=$(tr).children("td").eq(5).html();
				var assesor=$(tr).children("td").eq(6).html();
				var assess_verifier=$(tr).children("td").eq(7).html();
				var duty_unit=$(tr).children("td").eq(8).html();
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
				$( this ).dialog('destroy');
				}
			} 
        ]
    }).dialog({ zIndex: 3999 });
}
function getOrderType(elment){
	
	$.ajax({
        type: "post",
        url: "getTmpOrderTypeList",
        cache: false,  //禁用缓存
        data: {
        	draw: 1,
		    start:0,
		    length:100
        },  //传入组装的参数
        dataType: "json",
        success: function (result) {
        	var str="";
        	$.each(result.data, function(index, value) {
        		str+="<option value='"+value.name+"' cost_transfer='"+value.cost_transfer+"'>"+value.name+"</option>";
        	})
			$(elment).html(str);
        }
	});
}
function deleteData(id){
	if(!confirm("确认删除该条数据？")){
		return false;
	}
	$.ajax({
        type: "post",
        url: "delCreateTmpOrder",
        cache: false,  //禁用缓存
        data: {id:id},  //传入组装的参数
        dataType: "json",
        success: function (response) {
        	if(response.success){
				$.gritter.add({
					title: '系统提示：',
					text: '<h5>'+response.message+'！</h5>',
					class_name: 'gritter-info'
				});
				ajaxQuery();
			}else{
				$.gritter.add({
					title: '系统提示：',
					text: '<h5>'+response.message+'</h5><br>',
					class_name: 'gritter-info'
				});
			}
        }
	});
}

function clear(){
	$("#order_launcher").val(""),
	$("#new_factory option[value='']").attr("selected","selected");
	$("#new_workshop").html("");
	$("#head_launch_unit").val("");
	$("#acceptor").val("");
	$("#reason_content").val("");
	$("#total_qty").val("");
	$("#order_type").val("");
	$("#duty_unit").val("");
	$("#labors").val("");
	$("#single_hour").val("");
	$("#assesor").val("");
	$("#assess_verifier").val("");
	$("#is_cost_transfer").val("");
	$("#cost_unit_signer").val("");
	$("#tmp_order_no").val("");
	$("#sap_order").val("");
	$("#edit_order_launcher").val(""),
	$("#edit_factory option[value='']").attr("selected","selected");
	$("#edit_workshop").html("");
	$("#edit_head_launch_unit").val("");
	$("#edit_acceptor").val("");
	$("#edit_reason_content").val("");
	$("#edit_total_qty").val("");
	$("#edit_order_type").val("");
	$("#edit_duty_unit").val("");
	$("#edit_labors").val("");
	$("#edit_single_hour").val("");
	$("#edit_assesor").val("");
	$("#edit_assess_verifier").val("");
	$("#edit_is_cost_transfer").val("");
	$("#edit_cost_unit_signer").val("");
	$("#edit_tmp_order_no").val("");
	$("#edit_sap_order").val("");
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
					$( this ).dialog( 'close' ); 
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
function validateOrderSerialNo(tmp_order_no){
	var flag=true;
	var factory_code=tmp_order_no.substring(0,2);
	var series=tmp_order_no.substring(2,12);
	
	var reg_num=/^\d{10}$/
	var reg_char=/^[A-Z]{2}$/;
	if(!reg_char.test(factory_code)||!reg_num.test(series)){
		//alert("你输入的派工流水号不符合工厂简码+四位年+两位月+四位流水的规则，如CS2016120001！");
		flag=false;
	}
	return flag;
	
}