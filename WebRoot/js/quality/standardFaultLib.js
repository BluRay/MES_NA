var lineStr = '';
var pageSize=1;
var table;
var table_height = $(window).height()-250;
$(document).ready(function(){
	initPage();
	
	function initPage(){
		getKeysSelect("DEFECT_TYPE", "品质故障类型", "#search_defect_type","All","keyName");
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
		getKeysSelect("DEFECT_TYPE", "品质故障类型", "#new_defect_type","Please Choose","keyName");
		e.preventDefault();
		$("#dialog-add").removeClass('hide').dialog({
			resizable: false,
			title: '<div class="widget-header"><h4 class="smaller"><i class="ace-icon fa fa-users green"></i> Add Defect</h4></div>',
			title_html: true,
			width:'550px',
			modal: true,
			buttons: [{
						text: "Cancel",
						"class" : "btn btn-minier",
						click: function() {$( this ).dialog( "close" );} 
					},
					{
						text: "Save",
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
	var defect_type = $("#new_defect_type :selected").text();
	if(defect_type=='Please Choose'){
		alert("Please choose defect type！");
		return false;
	}
	if($("#new_defect_code").val()==''||($("#new_defect_code").val().trim()).length==0){
		alert("Defect code can't be blank！");
		$("#new_defect_code").focus();
		return false;
	}
	if($("#new_defect_name").val()==''||($("#new_defect_name").val().trim()).length==0){
		alert("Defect description can't be blank！");
		$("#new_defect_name").focus();
		return false;
	}
	
	$.ajax({
		url: "addFaultLib",
		dataType: "json",
		type: "get",
		data: {
				"defect_type":defect_type,
				"faultLevel" : $("#new_faultlevel").val(),
				"defect_code" : $("#new_defect_code").val(),
				"defect_name" : $("#new_defect_name").val(),
		},
		async: false,
		error: function () {alert(response.message);},
		success: function (response) {
			if(response.success){
				$.gritter.add({
					title: 'Message：',
					text: '<h5>Saved successfully！</h5>',
					class_name: 'gritter-info'
				});
				$("#dialog-add").dialog( "close" );
				ajaxQuery();
			}else{
				$.gritter.add({
					title: 'Error：',
					text: '<h5>Save failed！</h5>',
					class_name: 'gritter-info'
				});
			}
		}
	});
}

function ajaxQuery(){
	//var parts=$("#input_parts").val();
	var defect_type = $("#search_defect_type :selected").text();
	var defect_name=$("#search_defect_name").val();
	var faultLevel=[];
	$('input[name="faultlevel"]:checked').each(function(){
		faultLevel.push($(this).val());
	});
	var conditions={'defect_type':defect_type,'defect_name':defect_name,'faultLevel':faultLevel};
	
	
	$("#tableData").dataTable({
		serverSide: true,paiging:true,ordering:false,searching: false,bAutoWidth:false,
		destroy: true,sScrollY: table_height,sScrollX:true,orderMulti:false,
		pageLength: 25,pagingType:"full_numbers",lengthChange:false,
		language: {
			emptyTable:"No data available in table！",
			info:"Got a total of _TOTAL_ entries to show _PAGE_ of _PAGES_ pages",
			infoEmpty:"",
			paginate: {
			  first:"First",
		      previous: "Previous",
		      next:"Next",
		      last:"Last",
		      loadingRecords: "Please wait - loading...",		     
			}
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
		            {"title":"Defect Type",width:'80',"class":"center","data":"defect_type","defaultContent": ""},
		            {"title":"Defect Code",width:'80',"class":"center","data":"defect_code","defaultContent": ""},
		            {"title":"Defect Name",width:'80',"class":"center","data":"defect_name","defaultContent": ""},
		            {"title":"Serious Level",width:'80',"class":"center","data":"serious_level","defaultContent": ""},
		            {"title":"Editor",width:'80',"class":"center","data":"username","defaultContent": ""},
		            {"title":"Edit Date",width:'80',"class":"center","data":"edit_date","defaultContent": ""},
		            {"title":"",width:'60',"class":"center","data":null,"defaultContent": "",
		            	"render": function ( data, type, row ) {
		            		return "<i class=\"glyphicon glyphicon-edit bigger-130 showbus\" title=\"Edit\" onclick='editFault(" 
		            		+ row['id'] + ",\"" + row['defect_type'] + "\",\"" + row['defect_code'] + "\",\""
		            		+ row['serious_level'] + "\",\"" + row['defect_name'] + "\")' style='color:blue;cursor: pointer;'></i>"
		            	},
		            }
		          ],
	});
	
}

function editFault(id,defect_type,defect_code,serious_level,defect_name){
	$("#edit_id").val(id);
	$("#edit_defect_type").val(defect_type);
	$("#edit_defect_code").val(defect_code);
	$("#edit_faultlevel").val(serious_level);
	$("#edit_defect_name").val(defect_name);
	
	$("#dialog-edit").removeClass('hide').dialog({
		resizable: false,
		title: '<div class="widget-header"><h4 class="smaller"><i class="ace-icon fa fa-users green"></i> Edit Defect </h4></div>',
		title_html: true,
		width:'550px',
		modal: true,
		buttons: [{
					text: "Cancel",
					"class" : "btn btn-minier",
					click: function() {$( this ).dialog( "close" );} 
				},
				{
					text: "Save",
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
	
	if($("#edit_defect_name").val()==''||($("#edit_defect_name").val().trim()).length==0){
		alert("质量缺陷不能为空！");
		return false;
	}
	$.ajax({
		url: "updateFaultLib",
		dataType: "json",
		type: "get",
		data: {
				"defect_type":$("#edit_defect_type").val(),
				"defect_code" : $("#edit_defect_code").val(),
				"faultLevel" : $("#edit_faultlevel").val(),
				"defect_name" : $("#edit_defect_name").val(),
				"id": $("#edit_id").val()
		},
		async: false,
		error: function () {alert(response.message);},
		success: function (response) {
			if(response.success){
				$.gritter.add({
					title: 'Message：',
					text: '<h5>Saved successfully！</h5>',
					class_name: 'gritter-info'
				});
				$("#dialog-edit").dialog( "close" );
				ajaxQuery();
			}else{
	    		$.gritter.add({
					title: 'Error：',
					text: '<h5>Save failed！</h5><br>'+response.message,
					class_name: 'gritter-info'
				});
			}

		}
	});
	
}

