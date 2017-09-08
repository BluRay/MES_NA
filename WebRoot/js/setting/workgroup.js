jQuery(function($) {
	//if($(window).height() * 0.6 > 350){
		$("#div_tree1").height($(window).height() * 0.8);
		$("#div_tree2").height($(window).height() * 0.8);
	//}
	var DataSourceTree = function(options) {
		this._data 	= options.data;
		this._delay = options.delay;
	}
	DataSourceTree.prototype.data = function(options, callback) {
		var self = this;
		var $data = null;
		if (!("name" in options) && !("type" in options)) {
			$data = this._data;
			callback({data : $data});
			return;
		} else if ("type" in options && options.type == "folder") {
			if ("additionalParameters" in options && "children" in options.additionalParameters)
				$data = options.additionalParameters.children;
			else
				$data = {}
		}
		if ($data != null)
			setTimeout(function() {
				callback({data : $data});
			}, parseInt(Math.random() * 500) + 200);
	};
	
	showtree2();

	function showtree1(){
		$("#tree1").removeData();
		$("#tree1").unbind();
		$("#tree2").removeData();
		$("#tree2").unbind();
		$.ajax({
		    url: "getAllWorkshopList",
		    dataType: "json",
			type: "get",
		    data: {},
		    success:function(response){
		    	var role_str = '{';
		    	$.each(response.data, function(index, value) {
		    		role_str += '"role_'+value.id+'" : {"name": "<i class=\'fa fa-users blue\'></i> '+value.workshopName+'","id":"'+value.id+'","type": "item"},'
		    	});
		    	role_str = role_str.substring(0,role_str.length-1) + '}';
		    	var role_data = eval('(' + role_str + ')');
		    	var treeDataSource = new DataSourceTree({data: role_data});
		    	$('#tree1').ace_tree({
		    		dataSource: treeDataSource,
		    		multiSelect : false,
		    		cacheItems: true,
		    		loadingHTML : '<div class="tree-loading"><i class="ace-icon fa fa-refresh fa-spin blue"></i></div>',
		    		'open-icon' : 'ace-icon tree-minus',
		    		'close-icon' : 'ace-icon tree-plus',
		    		'selectable' : true,
		    		'selected-icon' : 'ace-icon fa fa-check',
		    		'unselected-icon' : 'ace-icon fa fa-times'
		    	});

		    }
		});
		$('#tree1')
		.on('updated', function(e, result) {
		})
		.on('selected', function(e,data) {
			showtree1(data.info[0].id);
		})
		.on('click', function(e) {
		})
		.on('opened', function(e) {
		})
		.on('closed', function(e) {
		});
	}
	
	function showtree2(){
		$("#tree2").removeData();
		$("#tree2").unbind();
		var fun_str = '{';
		var subFun = [];
		var subFun2 = [];
		$.ajax({
		    url: "getWorkshopTreeList",
		    dataType: "json",
			type: "get",
		    data: {},
		    success:function(response){
	
		    	var funs = response.data;
		    	var roles_arr = new Array();
		    	
		    	$.each(funs, function(index, value) {
		    		
		    		if(value.parent_id === '0'){
		    			var id=value.id.substring(1,value.id.length);
		    			if(value.sub_count === 0){
                            var name='<i></i><a class=\'a\' onClick=getWorkgroupListById('+id+','+id+',0)'+value.workshop_name+'</a>';
		    				fun_str += '"'+value.id+'" : {"name":"<i class=\'\'></i><a class=\'a\' onClick=getWorkgroupListById('+id+','+id+',0)> '+value.workshop_name+'</a>","id":"'+value.id+'", "type": "item" ' + ((jQuery.inArray(value.id+'', "") >= 0)?',"additionalParameters" : {"item-selected": false}':'') +'},';
                           // console.log("fun_str",fun_str);
		    			}else{
		    				fun_str += '"'+value.id+'" : {"name": "<i class=\'\'></i><a class=\'a\' onClick=getWorkgroupListById('+id+','+id+',0)> '+value.workshop_name+'</a>","id":"'+value.id+'", "type": "folder"},';   				
		    				var subFun_str = '{"children" : {';
		    				var cur_id = value.id + '';
		    				$.each(funs, function(i, v) {
		    					if(v.parent_id === cur_id){
		    						if(v.sub_count === 0){
		    							subFun_str += '"'+v.id+'" : {"name": "<i class=\'\'></i><a class=\'a\' onClick=getWorkgroupListById('+v.id+','+id+',1)> '+v.workshop_name+'</a>","id":"'+v.id+'", "type": "item" ' + ((jQuery.inArray(v.id+'', "") >= 0)?',"additionalParameters" : {"item-selected": false}':'') +'},';
		    						}else{
		    							subFun_str += '"'+v.id+'" : {"name": "<i class=\'\'></i><a class=\'a\' onClick=getWorkgroupListById('+v.id+','+id+',1)> '+v.workshop_name+'</a>","id":"'+v.id+'", "type": "folder"},';
		    							var subFun_str2 = '{"children" : {';
		    							var cur_id2 = v.id + '';
		    							$.each(funs, function(i2, v2) {
		    								if(v2.parent_id === cur_id2)subFun_str2 += '"'+v2.id+'" : {"name": "<i class=\'fa fa-pencil-square-o blue\' <a href=# onClick=getWorkgroupListById('+v2.id+','+id+',2)></i> '+v2.workshop_name+'","id":"'+v2.id+'", "type": "item" ' + ((jQuery.inArray(v2.id+'', "") >= 0)?',"additionalParameters" : {"item-selected": false}':'') +'},';
		    							})
		    							subFun_str2 = subFun_str2.substring(0,subFun_str2.length-1) + '}}';
		    							subFun2[v.id] = eval('(' + subFun_str2 + ')');
		    						}
		    					}
		    				});
		    				subFun_str = subFun_str.substring(0,subFun_str.length-1) + '}}';
	    					//console.log('---->subFun_str = ' + subFun_str);
		    				subFun[value.id] = eval('(' + subFun_str + ')'); 				
		    			}
		    		}
		    	});
		    	fun_str = fun_str.substring(0,fun_str.length-1) + '}';
	    		var fun_data = eval('(' + fun_str + ')');
	    		
	    		$.each(funs, function(index, value) {
	    			if(value.parent_id === '0'){
	    				if(value.sub_count !== 0){
	    					fun_data[value.id]['additionalParameters'] = subFun[value.id];
	    				}
	    			}else{
	    				if(value.sub_count !== 0){
	    					fun_data[value.parent_id]['additionalParameters']['children'][value.id]['additionalParameters'] = subFun2[value.id];
	    				}
	    			}
	    		});

		    	var treeDataFun = new DataSourceTree({data: fun_data});
		    	$('#tree2').ace_tree({
					dataSource: treeDataFun,
					multiSelect : false,
					cacheItems: true,
					loadingHTML : '<div class="tree-loading"><i class="ace-icon fa fa-refresh fa-spin blue"></i></div>',
					'open-icon' : 'blue ace-icon fa fa-folder-open',
					'close-icon' : 'blue ace-icon fa fa-folder',
					'selectable' : false,
					'selected-icon' : 'ace-icon fa fa-check',
					'unselected-icon' : 'ace-icon fa fa-check'
				});
//		    	$("#tree2").find(".tree-folder-header").each(function(){  
//				    if($(this).parent().css("display")=="block"){  
//
//				        $(this).trigger("click");
//				    }
//				}); 



		    }
		});
		$('#tree2')
		.on('updated', function(e, result) {
		})
		.on('selected', function(e,data) {

		})
		.on('click', function(e) {
			//console.log('object',e);
		})
		.on('opened', function(e) {
		})
		.on('closed', function(e) {
		});
	}
	$(".a").on('mousedown', function(e) {
		alert("a");
	});
	$.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
		_title: function(title) {
			var $title = this.options.title || '&nbsp;'
			if( ("title_html" in this.options) && this.options.title_html == true )
				title.html($title);
			else title.text($title);
		}
	}));
	$("#btn_add").on('click', function(e) {	
		e.preventDefault();
		$("#new_workgroupId").val("");
		$("#new_groupName").val("");
		$("#new_responsibility").val("");
		$("#new_memo").val("");
		$("#dialog-confirm").removeClass('hide').dialog({
			resizable: false,
			title: '<div class="widget-header"><h4 class="smaller"><i class="ace-icon fa fa-users green"></i> 新增班组</h4></div>',
			title_html: true,
			width:'500px',
			modal: true
		});
		
	});
	
	$(document).on("click",".editWorkgroup",function(){
		
		$('#editId').val($(this).closest('tr').find('td').eq(0).find('input').eq(0).val());
		$('#edit_workgroupId').val($(this).closest('tr').find('td').eq(1).html());
		$('#edit_groupName').val($(this).closest('tr').find('td').eq(2).html());
		$('#edit_responsibility').val($(this).closest('tr').find('td').eq(3).html());
		$('#edit_memo').val($(this).closest('tr').find('td').eq(4).html());
		var dialog = $("#dialog-edit").removeClass('hide').dialog({
			width:600,
			/*height:500,*/
			modal: true,
			title: '<div class="widget-header"><h4 class="smaller"><i class="ace-icon fa fa-gear green"></i> 编辑班组</h4></div>',
			title_html: true,
			buttons: [ 
				{
					text: "取消",
					"class" : "btn btn-minier",
					click: function() {
						$( this ).dialog( "close" ); 
						$("#editForm")[0].reset();
					} 
				},
				{
					text: "确定",
					"class" : "btn btn-primary btn-minier",
					click: function() {
						if($("#edit_workgroupId").val()===""){
							alert("班组编号不能为空！");
							$("#edit_workgroupId").focus();
							return false;
						}
						if($("#edit_groupName").val()===""){
							alert("班组名称不能为空！");
							$("#edit_groupName").focus();
							return false;
						}
						
						
					$.ajax({
					    url: "updateWorkgroup",
					    dataType: "json",
						type: "get",
					    data: {
					    	"id" : $("#editId").val(),
					    	"workgroupId" : $("#edit_workgroupId").val(),
					    	"groupName" : $("#edit_groupName").val(),
					    	"responsibility" : $("#edit_responsibility").val(),
					    	"memo" : $("#edit_memo").val()
					    },
					    success:function(response){
					    	if(response.success){
					    	$.gritter.add({
								title: '系统提示：',
								text: '<h5>编辑成功！</h5>',
								class_name: 'gritter-info'
							});
					    	showtree2();
					    	getWorkgroupListById($("#new_parentId").val(),$("#new_workshopId").val());

					    	}else{
					    		$.gritter.add({
									title: '系统提示：',
									text: '<h5>编辑失败！</h5><br>'+response.message,
									class_name: 'gritter-info'
								});
					    	}
					    }
					});
					$( this ).dialog( "close" ); 
					} 
				}
			]
		});
	});
	$("#btn_delete").click(function(){
		ajaxDelete();
	});
	$("#btn_ok").on('click', function(e) {
		if(""===$("#new_workgroupId").val()){
			alert("班组编号不能为空！");
			$("#new_workgroupId").focus();
			return false
		}
		if(""===$("#new_groupName").val()){
			alert("班组名称不能为空！");
			$("#new_groupName").focus();
			return false
		}
		$.ajax({
		    url: "addWorkgroup",
		    dataType: "json",
			type: "get",
		    data: {
		    	"workgroupId" : $("#new_workgroupId").val(),
		    	"groupName" : $("#new_groupName").val(),
		    	"responsibility" : $("#new_responsibility").val(),
		    	"parentId":$("#new_parentId").val(),
		    	"workshopId":$("#new_workshopId").val(),
		    	"memo" : $("#new_memo").val()
		    },
		    success:function(response){

		    	$("#dialog-confirm").dialog("close");
		    	showtree2();  
		    	getWorkgroupListById($("#new_parentId").val(),$("#new_workshopId").val());
		    }
		});
	});
	
	$("#btn_cancel").on('click', function(e) {
		$("#dialog-confirm").dialog("close");
	});
	function ajaxDelete(){
		var ids = '';
		$(":checkbox").each(function(){
			if($(this).prop("checked")){
				if($(this).attr('fid')){
					ids += $(this).attr('fid').split('_')[1] + ',';
				}
			}
		});
		if(ids===''){
			$.gritter.add({
				title: '系统提示：',
				text: '<h5>请至少勾选一条记录！</h5>',
				class_name: 'gritter-info'
			});
			return false;
		}
		$.ajax({
		    url: "deleteWorkgroup",
		    dataType: "json",
			type: "get",
		    data: {
		    	"ids" : ids.substring(0,ids.length-1)
		    },
		    success:function(response){
		    	if(response.success){
			    	$.gritter.add({
						title: '系统提示：',
						text: '<h5>删除成功！</h5>',
						class_name: 'gritter-info'
					});
			    	showtree2();
			    	getWorkgroupListById($("#new_parentId").val(),$("#new_workshopId").val());
		    	}else{
		    		$.gritter.add({
						title: '系统提示：',
						text: '<h5>删除失败！</h5><br>'+response.message,
						class_name: 'gritter-info'
					});
		    	}
		    }
		});
	}
});
function getWorkgroupListById(id,workshopId,nodeLayer){
	if(nodeLayer===0){
		id="t"+id;
	}
//	alert("id="+id+"; workshopId="+workshopId);
	var nodeName=getNodeName(id);
    $("#new_parentId").val(id);
    $("#new_workshopId").val(workshopId);
    $("#nodeName").text("班组："+nodeName);
	$("#tableData").dataTable({
		serverSide: true,
		fixedColumns:   {
            leftColumns: 0,
            rightColumns:0
        },
        paging:false,
		ordering:false,
		searching: false,
		bAutoWidth:false,
		destroy: true,
		sScrollY: document.documentElement.clientHeight-250 + 'px',
		scrollX: "100%",
		/*scrollCollapse: true,*/
//		pageLength: 10,
//		pagingType:"full_numbers",
		lengthChange:false,
		orderMulti:false,
		language: {
			//emptyTable:"抱歉，未查询到数据！",
			//info:"共计 _TOTAL_ 条，当前第 _PAGE_ 页 共 _PAGES_ 页",
			//infoEmpty:"",
//			paginate: {
//			  first:"首页",
//		      previous: "上一页",
//		      next:"下一页",
//		      last:"尾页",
//		      loadingRecords: "请稍等,加载中...",		     
//			}
		},
		ajax:function (data, callback, settings) {
			var param ={

				"id":id
			};
//            param.length = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
//            param.start = data.start;//开始的记录序号
//            param.page = (data.start / data.length)+1;//当前页码

            $.ajax({
                type: "post",
                url: "getWorkgroupList",
                cache: false,  //禁用缓存
                data: param,  //传入组装的参数
                dataType: "json",
                success: function (result) {
                    console.log(result);
                    $("#tableData_info").remove();
                	//封装返回数据
                    var returnData = {};
                   // returnData.draw = data.draw;//这里直接自行返回了draw计数器,应该由后台返回
                    //returnData.recordsTotal = result.recordsTotal;//返回数据全部记录
                   // returnData.recordsFiltered = result.recordsTotal;//后台不实现过滤功能，每次查询均视作全部结果
                    returnData.data = result.data;//返回的数据列表
                    //console.log(returnData);
                    //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                    //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                    callback(returnData);
                }
            });
		
		},
		columns: [
		          	{"title":"<input type='checkbox' id='selectAll' onclick='selectAll()'/>","class":"center","data":"id","render": function ( data, type, row ) {
	                    return "<input id='id' value='"+data+"' type='hidden' /><input type='checkbox' fid='cb_"+data+"'>";
	                },"defaultContent": ""},
		            {"title":"班组编号","class":"center","data":"workgroupId","defaultContent": ""},
		            {"title":"班组名称","class":"center","data":"groupName","defaultContent": ""},
		            {"title":"工作内容","class":"center","data":"responsibility","defaultContent": ""},
		            {"title":"备注","class":"center","data":"memo","defaultContent": ""},
		            {"title":"编辑","class":"center","data":null,"defaultContent": "<i class=\"ace-icon fa fa-pencil bigger-130 editWorkgroup\" style='color:green;cursor: pointer;'></i>"}
		          ],
		
		
	});
}

function getNodeName(id){
	var nodeName="";
	$.ajax({
		url: "/IMMS/setting/getWorkgroupNodeName",
		dataType: "json",
		async: false,
		data: {
			"id" : id,
			},
		error: function () {},
		success: function (response) {
			
			if(response.nodeName!=null){
				nodeName=response.nodeName;
			}
		}
	})
	return nodeName;
}
//复选框全选或反选
function selectAll() {
    if ($("#selectAll").prop("checked")) {
        $(":checkbox").prop("checked", true);
    } else {
        $(":checkbox").prop("checked", false);
    }
}