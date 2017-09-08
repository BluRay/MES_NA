var lineStr = '';
var pageSize=1;
var table;
var table_height = $(window).height()-250;
$(document).ready(function(){
	initPage();
	
	function initPage(){
		getBusNumberSelect('#nav-search-input');
		ajaxQuery();
	}

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/BMS/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})
	
	$("#btnQuery").click (function () {
		ajaxQuery();
		return false;
	});
	
	$("#btnAdd").on('click', function(e) {
		getPartsSelect("#new_parts");
		e.preventDefault();
		$("#dialog-add").removeClass('hide').dialog({
			resizable: false,
			title: '<div class="widget-header"><h4 class="smaller"><i class="ace-icon fa fa-users green"></i> 增加标准故障库</h4></div>',
			title_html: true,
			width:'550px',
			modal: true,
			buttons: [{
						text: "取消",
						"class" : "btn btn-minier",
						click: function() {$( this ).dialog( "close" );} 
					},
					{
						text: "增加",
						id:"btn_ok",
						"class" : "btn btn-success btn-minier",
						click: function() {
							btnNewConfirm();
						} 
					}
				]
		});
	});
	
});

function btnNewConfirm(){
	
	/**if($("#new_parts").val()==''){
		alert("请输入有效的零部件！");
		$("#new_parts").focus();
		return false;
	}
	var partsId=getPartsId($("#new_parts").val());
	//console.log("-->partsId = " + partsId);
	if(partsId=='0'){
		alert("请输入有效的零部件！");
		return false;
	}**/
	
	if($("#new_bug_type").val()==''||($("#new_bug_type").val().trim()).length==0){
		alert("缺陷类别不能为空");
		$("#new_bug_type").focus();
		return false;
	}
	if($("#new_bug").val()==''||($("#new_bug").val().trim()).length==0){
		alert("缺陷名称不能为空");
		return false;
	}
	
	$.ajax({
		url: "addParamRecord",
		dataType: "json",
		type: "get",
		data: {
				"bug":$("#new_bug").val(),
				"bugType" : $("#new_bug_type").val(),
				"faultLevel" : $("#new_faultlevel").val(),
				"faultType" : $("#new_faulttype").val()
		},
		async: false,
		error: function () {alert(response.message);},
		success: function (response) {
			if(response.success){
				$.gritter.add({
					title: '系统提示：',
					text: '<h5>增加成功！</h5>',
					class_name: 'gritter-info'
				});
			}
			$("#dialog-add").dialog( "close" );
			ajaxQuery();
		}
	});
}

function ajaxQuery(){
	//var parts=$("#input_parts").val();
	var bug=$("#input_bug").val();
	var bugType=$("#input_bug_type").val();
	var faultLevel=[];
	$('input[name="faultlevel"]:checked').each(function(){
		faultLevel.push($(this).val());
	});
	var conditions={'parts':'','bugType':bugType,'bug':bug,'faultLevel':faultLevel,'faultType':""};
	
	
	$("#tableData").dataTable({
		serverSide: true,paiging:true,ordering:false,searching: false,bAutoWidth:false,
		destroy: true,sScrollY: table_height,sScrollX:true,orderMulti:false,
		pageLength: 25,pagingType:"full_numbers",lengthChange:false,
		language: {
			emptyTable:"抱歉，未查询到数据！",
			info:"共计 _TOTAL_ 条，当前第 _PAGE_ 页 共 _PAGES_ 页",
			infoEmpty:"",
			paginate: { first:"首页",previous: "上一页",next:"下一页",last:"尾页",loadingRecords: "请稍等,加载中..."}
		},
		ajax:function (data, callback, settings) {
			var param ={
				"draw":1,
				"orderColumn":"id",
				"conditions":JSON.stringify(conditions)
			};
            param.length = data.length;					//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;					//开始的记录序号
            param.page = (data.start / data.length)+1;	//当前页码

            $.ajax({
                type: "post",
                url: "getFaultLibList",
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
		            {"title":"缺陷类别",width:'80',"class":"center","data":"bug_type","defaultContent": ""},
		            {"title":"缺陷名称",width:'80',"class":"center","data":"bug","defaultContent": ""},
		            {"title":"严重等级",width:'80',"class":"center","data":"serious_level","defaultContent": ""},
		            {"title":"缺陷分类",width:'80',"class":"center","data":"fault_type","defaultContent": ""},
		            {"title":"维护人",width:'80',"class":"center","data":"display_name","defaultContent": ""},
		            {"title":"维护时间",width:'80',"class":"center","data":"edit_date","defaultContent": ""},
		            {"title":"操作",width:'60',"class":"center","data":null,"defaultContent": "",
		            	"render": function ( data, type, row ) {
		            		return "<i class=\"glyphicon glyphicon-edit bigger-130 showbus\" title=\"编辑\" onclick='editFault(" 
		            		+ row['id'] + ",\"" + row['parts'] + "\",\"" + row['bug_type'] + "\",\"" + row['bug'] + "\",\""
		            		+ row['serious_level'] + "\",\"" + row['fault_type'] + "\")' style='color:blue;cursor: pointer;'></i>"
		            	},
		            }
		          ],
	});
	
}

function editFault(id,parts,bug_type,bug,serious_level,fault_type){
	$("#edit_id").val(id);
	$("#edit_bug_type").val(bug_type);
	$("#edit_bug").val(bug);
	$("#edit_faultlevel").val(serious_level);
	$("#edit_faulttype").val(fault_type);
	
	$("#dialog-edit").removeClass('hide').dialog({
		resizable: false,
		title: '<div class="widget-header"><h4 class="smaller"><i class="ace-icon fa fa-users green"></i> 编辑标准故障库</h4></div>',
		title_html: true,
		width:'550px',
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
						btnEditConfirm();
					} 
				}
			]
	});
}

function btnEditConfirm(){

	if($("#edit_bug").val()==''||($("#edit_bug").val().trim()).length==0){
		alert("质量缺陷不能为空！");
		return false;
	}
	$.ajax({
		url: "updateParamRecord",
		dataType: "json",
		type: "get",
		data: {
				"bug":$("#edit_bug").val(),
				"bugType" : $("#edit_bug_type").val(),
				"faultLevel" : $("#edit_faultlevel").val(),
				"faultType" : $("#edit_faulttype").val(),
				"id": $("#edit_id").val()
		},
		async: false,
		error: function () {alert(response.message);},
		success: function (response) {
			if(response.success){
				$.gritter.add({
					title: '系统提示：',
					text: '<h5>编辑成功！</h5>',
					class_name: 'gritter-info'
				});
			}
			$("#dialog-edit").dialog( "close" );
			ajaxQuery();
		}
	});
	
}

