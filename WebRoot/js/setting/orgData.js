var foreign_id="";
jQuery(function($) {
	getBusNumberSelect('#nav-search-input');

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/BMS/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})
	//if($(window).height() * 0.6 > 350){
		$("#div_tree1").height($(window).height() * 0.8);
		$("#div_tree2").height($(window).height() * 0.8);
	//}
	getKeysSelect("ORG_TYPE", "", $("#new_org_type"),"All","");
	getKeysSelect("ORG_TYPE", "", $("#edit_org_type"),"All",""); 
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

	function showtree2(){
		$("#tree2").removeData();
		$("#tree2").unbind();
		var fun_str = '{';
		var subFun = [];
		var subFun1 = [];// 工厂级别
		var subFun2 = [];// 车间级别
		var subFun3 = [];
		var subFun4 = [];
		var subFun5 = [];

		$.ajax({
		    url: "getOrgDataTreeList",
		    dataType: "json",
			type: "get",
		    data: {},
		    success:function(response){
	
		    	var funs = response.data;
		    	var roles_arr = new Array();
		    	
		    	$.each(funs, function(index, value) {
		    		
		    		if(value.parent_id === '0'){  // 事业部级别
		    			var id=value.id;
		    			if(value.sub_count === 0){
                            var name='<i></i><a  onClick=getWorkgroupListById('+id+','+value.display_name+',0)'+value.display_name+'</a>';
		    				fun_str += '"'+value.id+'" : {"name":"<i></i><a onClick=getWorkgroupListById('+id+','+value.org_kind+',\''+value.org_type+'\')> '
		    				+value.display_name+'</a>","id":"'+value.id+'", "type": "item" ' + ((jQuery.inArray(value.id+'', "") >= 0)?',"additionalParameters" : {"item-selected": false}':'') +'},';
		    			}else{
		    				
		    				fun_str += '"'+value.id+'" : {"name": "<i></i><a onClick=getWorkgroupListById('+id+',\''+value.org_kind+'\',\''+value.org_type+'\')> '+value.display_name+'</a>","id":"'+value.id+'", "type": "folder"},';   				
		    				var subFun_str = '{"children" : {';
		    				var cur_id = value.id + '';
		    				$.each(funs, function(i, v) {  // 工厂级别
		    					
		    					if(v.parent_id === cur_id){
		    						if(v.sub_count === 0){
		    							subFun_str += '"'+v.id+'" : {"name": "<i class=\'blue ace-icon fa fa-folder\'></i><a onClick=getWorkgroupListById('+v.id+',\''+v.org_kind+'\',\''+v.org_type+'\')> '
		    							+v.display_name+'</a>","id":"'+v.id+'", "type": "item" ' + ((jQuery.inArray(v.id+'', "") >= 0)?',"additionalParameters" : {"item-selected": true}':'') +'},';
		    						}else{
		    							subFun_str += '"'+v.id+'" : {"name": "<i></i><a onClick=getWorkgroupListById('+v.id+',\''+v.org_kind+'\',\''+v.org_type+'\')> '+v.display_name+'</a>","id":"'+v.id+'", "type": "folder"},';
		    							var subFun_str1 = '{"children" : {';
		    							var cur_id1 = v.id + '';
		    							$.each(funs, function(i1, v1) { // 车间级别
		    								if(v1.parent_id === cur_id1){
		    									if(v1.sub_count===0){  // 车间级别没有子节点
		    										subFun_str1 += '"'+v1.id+'" : {"name": "<i class=\'blue ace-icon fa fa-folder\'></i> <a href=# onClick=getWorkgroupListById('+v1.id+',\''+v1.org_kind+'\',\''+v1.org_type+'\')> '
		    								        +v1.display_name+'","id":"'+v1.id+'", "type": "item" ' + ((jQuery.inArray(v1.id+'', "") >= 0)?',"additionalParameters" : {"item-selected": true}':'') +'},';
		    									}else{ // 车间级别有子节点
		    										subFun_str1 += '"'+v1.id+'" : {"name": "<i></i><a onClick=getWorkgroupListById('+v1.id+',\''+v1.org_kind+'\',\''+v1.org_type+'\')> '+v1.display_name+'</a>","id":"'+v1.id+'", "type": "folder"},';
		    										var subFun2_str = '{"children" : {';
		    					    				var cur_id2 = v1.id + '';
		    					    				$.each(funs, function(i2, v2) { // 班组级别
		    		    								if(v2.parent_id === cur_id2){
		    		    									if(v2.sub_count===0){  //  班组级别没有子节点
		    		    										subFun2_str+= '"'+v2.id+'" : {"name": "<i class=\'blue ace-icon fa fa-folder\'></i> <a href=# onClick=getWorkgroupListById('+v2.id+',\''+v2.org_kind+'\',\''+v2.org_type+'\')></i> '
		    		    								        +v2.display_name+'","id":"'+v2.id+'", "type": "item" ' + ((jQuery.inArray(v2.id+'', "") >= 0)?',"additionalParameters" : {"item-selected": true}':'') +'},';
		    		    									}else{ //  班组级别有子节点
		    		    										subFun2_str += '"'+v2.id+'" : {"name": "<i></i><a onClick=getWorkgroupListById('+v2.id+',\''+v2.org_kind+'\',\''+v2.org_type+'\')> '+v2.display_name+'</a>","id":"'+v2.id+'", "type": "folder"},';
		    		    										
		    		    										var subFun3_str = '{"children" : {';
		    		    					    				var cur_id3 = v2.id + '';
		    		    					    				$.each(funs, function(i3, v3) { // 小班组级别
		    		    		    								if(v3.parent_id === cur_id3){
		    		    		    									//if(v3.sub_count===0){  
		    		    		    										subFun3_str+= '"'+v3.id+'" : {"name": "<i class=\'blue ace-icon fa fa-folder\'></i> <a href=# onClick=getWorkgroupListById('+v3.id+',\''+v3.org_kind+'\',\''+v3.org_type+'\')></i> '
		    		    		    								        +v3.display_name+'","id":"'+v3.id+'", "type": "item" ' + ((jQuery.inArray(v3.id+'', "") >= 0)?',"additionalParameters" : {"item-selected": false}':'') +'},';
		    		    		    										
		    		    		    		    							//console.log("subFun4_str",subFun4_str);
		    		    		    									}

		    		    		    							})
		    		    					    				subFun3_str = subFun3_str.substring(0,subFun3_str.length-1) + '}}';
		    		    					    				
		    		    		    							subFun3[v2.id] = eval('(' + subFun3_str + ')');
		    		    									}
		    		    									
		    		    								}
		    		    							})
		    					    				subFun2_str = subFun2_str.substring(0,subFun2_str.length-1) + '}}';
		    					    				//console.log("subFun2_str",subFun2_str);
		    		    							subFun2[v1.id] = eval('(' + subFun2_str + ')');
		    									}
		    									
		    								}
		    							})
		    							subFun_str1 = subFun_str1.substring(0,subFun_str1.length-1) + '}}';
		    							subFun1[v.id] = eval('(' + subFun_str1 + ')');
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
	    			if(value.org_type === '0'){
	    				var parent_id1=value.id;
	    				if(value.sub_count !== 0){
	    					fun_data[value.id]['additionalParameters'] = subFun[value.id];
	    				}
	    			}
    				if(value.org_type==='1'){//  工厂
    					if(value.sub_count !== 0){
    						if(fun_data[value.parent_id]!=undefined){
	    					    fun_data[value.parent_id]['additionalParameters']['children'][value.id]['additionalParameters'] = subFun1[value.id];
	    				    }
    					}
    				}
    				if(value.org_type==='2'){ // 车间
    					var pp_id="";  //
    					if(value.sub_count !== 0){
    						var cur_parent_id=value.parent_id; // 
    						
    						$.each(funs, function(index, v) {
	    						if(v.id+""===cur_parent_id){
	    							pp_id=v.parent_id;
	    						}
	    					});
    						if(fun_data[pp_id]!=undefined){
	    					    fun_data[pp_id]['additionalParameters']['children'][value.parent_id]['additionalParameters']['children'][value.id]['additionalParameters'] = subFun2[value.id];
    						}
    					}
    				}
    				if(value.org_type==='3'){ // 班组
    					if(value.sub_count !== 0){
    						var cur_parent_id=value.parent_id; // 车间
    						var pp_id="";  // 工厂
    						var ppp_id="";  // 事业部
    						$.each(funs, function(index, v) {
	    						if(v.id+""===cur_parent_id){
	    							pp_id=v.parent_id;
	    							$.each(funs, function(index, v1) {
			    						if(v1.id+""===pp_id){
			    							ppp_id=v1.parent_id;
			    						}
			    					});
	    						}
	    					});
	    					if(fun_data[ppp_id]!=undefined){
	    						fun_data[ppp_id]['additionalParameters']['children'][pp_id]['additionalParameters']['children'][value.parent_id]['additionalParameters']['children'][value.id]['additionalParameters'] = subFun3[value.id];
	    					}
                       
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
					'selectable' : true,
					'selected-icon' : null, // ace-icon fa fa-check
					'unselected-icon' : null,//'ace-icon fa fa-check'
				});
		    	
		    	$("#tree2").find(".tree-folder-header").each(function(){
		    		//alert($(this).parent().css("display"));
				    if($(this).parent().css("display")=="block"){  
                         $(this).trigger("click");
				    }
				}); 
		    }
		});
		$('#tree2')
		.on('updated', function(e, result) {
		})
		.on('selected', function(e,data) {
		})
		.on('click', function(e) {
		})
		.on('opened', function(e) {
		})
		.on('closed', function(e) {
			//alert('closed');
		});
	}
	
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
		initEditModel();
		var tp=$("#org_type").val();
		var org_kind=$("#org_kind").val();
		fillDepartmentSelect($("#parent_id").val());
    	switch(tp){
    	
    	case "4" :
    		alert('不能为小班组增加子节点！');
    		return false;
    		break;
    	
    	case "0" :
    		var pa = $('#new_name').parent();
    		pa.html('').html('<select id="new_name" class="input-large carType"></select>');
    		//获得工厂
    		getFactorySelect("hrBaseData/orgData",'',"#new_name",null,'id');
    		break;
    	
    	case "1" :
    		var pa = $('#new_name').parent();
    		//获得车间
    		pa.html('').html('<select id="new_name" class="input-large carType"></select>');
    		getWorkshop("");
    		//$("#new_name option[index='1']").remove();
    		break;
    	case "2" :
    		var pa = $('#new_name').parent();
    		//获得班组
    		pa.html('').html('<select id="new_name" class="input-large carType"></select>');
    		id="t"+$("#new_p_id :selected").prop('foreignid');
    		getWorkgroup("t"+foreign_id);
            break;
    	case "3" :
    		var pa = $('#new_name').parent();
    		//获得小班组
    		if(org_kind=='0'){
    			$('#new_org_kind').val("0");
    			pa.html('').html('<input style="height: 30px;width:280px" type="text" class="input-medium revise carType" id="new_name" onkeyup="value=value.replace(/[^\u4E00-\u9FA5]/g,\'\')"  onbeforepaste="clipboardData.setData(\'text\',clipboardData.getData(\'text\').replace(/[^\u4E00-\u9FA5]/g,\'\'))"/>');
    		}else{
    			pa.html('').html('<select id="new_name" class="input-large carType"></select>');
    			getWorkgroup(foreign_id);
    		}
    		break;
    	}
    	var val=parseInt(tp)+1;
    	$("#new_org_type option[keyvalue='"+val+"']").attr("selected",true);
    	$('#new_org_type').attr('disabled', 'disabled');
    	$('#new_p_id').attr('disabled', 'disabled');
        $("#dialog-confirm").removeClass('hide').dialog({
			resizable: false,
			title: '<div class="widget-header"><h4 class="smaller"><i class="ace-icon fa fa-users green"></i> Add Department</h4></div>',
			title_html: true,
			width:650,
			height:570,
			modal: true,
			buttons: [ 
						{
							text: "Cancel",
							"class" : "btn btn-minier",
							click: function() {
								$( this ).dialog( "close" ); 
							} 
						},
						{
							text: "Save",
							"class" : "btn btn-primary btn-minier",
							click: function() {
								if($("#new_org_kind").val()==''){
									$.gritter.add({
    									title: 'Message：',
    									text: '<h5>The organization type model must be maintained ！</h5><br>',
    									class_name: 'gritter-info'
    								});
    					    		return false;
								}
								
            					var add_foreign_id="";
            					if($("#new_name :selected").val()!="" && $("#new_name :selected").val()!=undefined){
            						add_foreign_id=$("#new_name :selected").val();
            					}
            					var name=$("#new_name :selected").text();
            					if($("#new_name").attr("type")=="text"){
            						name=$("#new_name").val();
            					}
            					if(name=='' || name==undefined || name=='--Please Choose--'){
									$.gritter.add({
    									title: 'Message：',
    									text: '<h5>The organization name must be maintained！</h5><br>',
    									class_name: 'gritter-info'
    								});
    					    		return false;
								}
								$.ajax({
								    url: "addOrgData",
								    dataType: "json",
									type: "get",
								    data: {
								    	"name" : name,
								    	"responsibilities" : $("#new_responsibilities").val(),
								    	"manager" : $("#new_manager").val(),
								    	"org_kind" : $("#new_org_kind").val(),
								    	"org_type" :$("#new_org_type :selected").attr('keyvalue'),
								    	"parent_id" : $("#parent_id").val(),
								    	"foreign_id" : add_foreign_id
								    },
								    success:function(response){
                                        if(response.success){
                                        	$("#dialog-confirm").dialog("close");
    								    	showtree2();  
    								    	getWorkgroupListById($("#parent_id").val(),$("#org_kind").val(),$("#org_type").val());
                                        }else{
                                        	$.gritter.add({
            									title: 'Message：',
            									text: '<h5>'+response.message+'</h5><br>',
            									class_name: 'gritter-info'
            								});
                                        }
								    	
								    }
								});
								//$( this ).dialog( "close" ); 
							} 
						}
					]
				});	
	});
	$(document).on("change","#new_org_kind",function() {
		var pa = $('#new_name').parent();
		$("#new_org_type").removeAttr("disabled",false);
		var tp = parseInt($("#new_org_type :selected").attr('keyvalue'));
		$('#new_org_type').prop("disabled","disabled");
		if($("#new_org_kind").val()=='1'){
			switch(tp){
        	case 1 :
        		pa.html('').html('<select id="new_name" class="input-large carType"></select>');
        		//获得工厂
        		getFactorySelect("hrBaseData/orgData",'',"#new_name",null,'id');
        		break;
        	case 2 :
        		//获得车间
        		pa.html('').html('<select id="new_name" class="input-large carType"></select>');
        		getWorkshop("");
        		break;
        	case 3 :
        		//获得班组
        		pa.html('').html('<select id="new_name" class="input-large carType"></select>');
        		getWorkgroup("t"+foreign_id);
        		break;
        	case 4 :
        		//获得小班组
        		pa.html('').html('<select id="new_name" class="input-large carType"></select>');
        		getWorkgroup(foreign_id);
        		break;
        	}
		}else{  //  onkeyup="value=value.replace(/[^\u4E00-\u9FA5]/g,\'\')"  onbeforepaste="clipboardData.setData(\'text\',clipboardData.getData(\'text\').replace(/[^\u4E00-\u9FA5]/g,\'\'))"
			pa.html('').html('<input style="height: 30px;width:280px" type="text" class="input-medium revise carType" id="new_name"/>');
		}
	});
	$(document).on("click",".editWorkgroup",function(){
		$('#p_id').removeAttr("disabled");
		$('#edit_org_type').removeAttr("disabled");
		$('#edit_org_kind').removeAttr("disabled");
		$.ajax({
            url: 'getOrgDataTreeList',
            dataType: 'json',
            data: {
                'id' : $(this).closest('tr').find('td').eq(0).find('input').eq(0).val(),
            },
            error: function () {
            },
            success: function (response) {
            	
                if(response.success) {
            		var option="<option value='"+response.data[0].parent_id+"'>"+response.data[0].parent_name+"</option>";
            		$("#editId").val(response.data[0].id);
            		$('#p_id').html('');
            		$('#p_id').html(option);
            		$('#p_id').prop("disabled","disabled");
                	$("#edit_org_type").find("option[keyvalue="+response.data[0].org_type+"]").prop("selected",true);
                	$("#edit_org_type").prop("disabled","disabled");
                	$("#edit_org_kind").find("option[value="+response.data[0].org_kind+"]").prop("selected",true);
                	$("#edit_org_kind").prop("disabled","disabled");
                	
                	$('#edit_name').val(response.data[0].display_name);
                	$('#edit_manager').val(response.data[0].manager);
                	$('#edit_responsibilities').val(response.data[0].responsibilities);
                	var dialog = $("#dialog-edit").removeClass('hide').dialog({
            			width:650,
            			height:570,
            			modal: true,
            			title: '<div class="widget-header"><h4 class="smaller"><i class="ace-icon fa fa-gear green"></i> Edit Department</h4></div>',
            			title_html: true,
            			buttons: [ 
            				{
            					text: "Cancel",
            					"class" : "btn btn-minier",
            					click: function() {
            						$( this ).dialog( "close" ); 
            					} 
            				},
            				{
            					text: "Save",
            					"class" : "btn btn-primary btn-minier",
            					click: function() {
            					$('#p_id').removeAttr("disabled");
            					$('#edit_org_type').removeAttr("disabled");
            					$('#edit_org_kind').removeAttr("disabled");
            					var org_type = $("#edit_org_type :selected").attr('keyvalue');
            					$.ajax({
            					    url: "editOrgData",
            					    dataType: "json",
            						type: "get",
            					    data: {
            					    	"id" : $("#editId").val(),
            					    	"name" : $("#edit_name").val(),
            					    	"responsibilities" : $("#edit_responsibilities").val(),
            					    	"manager" : $("#edit_manager").val(),
            					    	"org_kind" : $("#edit_org_kind").val(),
            					    	"org_type" :$("#edit_org_type :selected").attr('keyvalue'),
            					    	"parent_id" : $("#p_id").val()
            					    },
            					    success:function(response){
            					    	if(response.success){
	            					    	$.gritter.add({
	            								title: 'Message：',
	            								text: '<h5>Save success！</h5>',
	            								class_name: 'gritter-info'
	            							});
	            					    	getWorkgroupListById($("#p_id").val(),$("#org_kind").val(),$("#org_type").val());

            					    	}else{
            					    		$.gritter.add({
            									title: 'Message：',
            									text: '<h5>Save failed！</h5><br>'+response.message,
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
                	
                } else {
                    //alert(response.message);
                }
            }
        });	
	});
	$("#btn_delete").click(function(){
		var msg = ' Delete the selected node and delete all child nodes of the selected node！';
        if(confirm(msg)) {
        	ajaxDelete();
        }
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
				title: 'Message：',
				text: '<h5>Please select at least one record！</h5>',
				class_name: 'gritter-info'
			});
			return false;
		}
		$.ajax({
		    url: "deleteOrgData",
		    dataType: "json",
			type: "get",
		    data: {
		    	"ids" : ids.substring(0,ids.length-1)
		    },
		    success:function(response){
		    	if(response.success){
			    	$.gritter.add({
						title: 'Message：',
						text: '<h5>Delete success！</h5>',
						class_name: 'gritter-info'
					});
			    	showtree2();
			    	getWorkgroupListById($("#parent_id").val(),$("#org_kind").val(),$("#org_type").val());
		    	}else{
		    		$.gritter.add({
						title: 'Message：',
						text: '<h5>Delete failed！</h5><br>'+response.message,
						class_name: 'gritter-info'
					});
		    	}
		    }
		});
	}
});
function getWorkgroupListById(id,org_kind,org_type){
	var nodeName=getNodeName(id);
	$("#nodeName").text(nodeName+":"+" Checked");
    $("#parent_id").val(id);
    $("#org_type").val(org_type);
    $("#org_kind").val(org_kind);
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
		lengthChange:false,
		orderMulti:false,
		language: {
			processing: "Please wait - loading...",
			emptyTable:"",					     
			infoEmpty:"",
			zeroRecords:"No data available in table！"
		},
		ajax:function (data, callback, settings) {
			var param ={

				"parent_id":id
			};

            $.ajax({
                type: "post",
                url: "getOrgDataByParentId",
                cache: false,  //禁用缓存
                data: param,  //传入组装的参数
                dataType: "json",
                success: function (result) {
                    console.log(result);
                    $("#tableData_info").remove();
                	//封装返回数据
                    var returnData = {};
                    returnData.data = result.data;//返回的数据列表
                    callback(returnData);
                }
            });
		
		},
		columns: [
		          	{"title":"<input type='checkbox' id='selectAll' onclick='selectAll()'/>","class":"center","data":"id","render": function ( data, type, row ) {
	                    return "<input id='id' value='"+data+"' type='hidden' /><input type='checkbox' fid='cb_"+data+"'>";
	                },"defaultContent": ""},
		            {"title":"Org Name","class":"center","data":"display_name","defaultContent": ""},
		            {"title":"Org Type","class":"center","data":"org_type","render": function ( data, type, row ) {
	                    return data=="0" ? "Company" : (data=="1"?"Plant":(data=="2"?"Workshop":(data=="3"?"Workgroup":"Team")))
	                },"defaultContent": ""},
		            {"title":"Org Model","class":"center","data":"org_kind","render": function ( data, type, row ) {
	                    return data=="0" ? "Managed" : "Production"
	                },"defaultContent": ""},
		            {"title":"Responsibilities","class":"center","data":"responsibilities","defaultContent": ""},
		            {"title":"Manager","class":"center","data":"manager","defaultContent": ""},
		            {"title":"Superior Departments","class":"center","data":"parent_name","defaultContent": ""},
		            {"title":"Edit","class":"center","data":null,"defaultContent": "<i class=\"ace-icon fa fa-pencil bigger-130 editWorkgroup\" style='color:green;cursor: pointer;'></i>"}
		          ],
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
function fillDepartmentSelect (id) {
    $.ajax({
        url: 'getOrgDataByParentId',
        dataType: 'json',
        data: {
            'id': id
        },
        async: false,
        error: function () {
        },
        success: function (response) {
            if(response.success) {
            	//console.log("data",response.data);
                $allOpts = $('<div />');
                foreign_id=response.data[0].foreign_id;
                $opt = $('<option foreignid='+response.data[0].foreign_id+' />').val(response.data[0].id).html(response.data[0].display_name).appendTo($allOpts);

                $('#new_p_id').html('').html($allOpts.html());
            } else {
                //alert(response.message);
            }
        }
    });
}
function initEditModel() {
    $('#dialog-confirm').find('.carType').val('');
    $('#dialog-confirm').find('.carType').removeAttr('disabled');
    $('#parent_id').removeAttr('disabled');
    $('.carType').val('');
    $('.carType').removeAttr('disabled');
    $('#parent_id').removeAttr('disabled');
    $('#new_org_type').empty();
    getKeysSelect("ORG_TYPE", "", $("#new_org_type"),"All","");
}
function getNodeName(id){
	var nodeName="";
	$.ajax({
		url: "getOrgDataByParentId",
		dataType: "json",
		async: false,
		data: {
			"id" : id,
			},
		error: function () {},
		success: function (response) {
			
			if(response.data[0]!=null){
				nodeName=response.data[0].display_name;
			}
		}
	})
	return nodeName;
}
function getWorkshop(selectval){
	var strs="<option value=''>--Please Choose--<option>"; // 
	$.ajax({
		url : "../setting/getAllWorkshopList",
		dataType : "json",
		data : {
		},
		error : function(response) {
			alert(response.message)
		},
		success : function(response) {
			$("#new_name").html("");
			$.each(response.data, function(index, value) {
			     
					if (selectval == value.workshopName) {
						strs += "<option value=" + value.id + " selected='selected'" + ">"
								+ value.workshopName + "</option>";
					} else {
						strs += "<option value=" + value.id + ">" + value.workshopName
								+ "</option>";
					}
				
			});
			$("#new_name").append(strs);	
		}
	});
}
function getWorkgroup(parentId){
	
	$.ajax({
		url : "../setting/getWorkgroupList",
		dataType : "json",
		data : {"id":parentId,
		},
		error : function(response) {
			alert(response.message)
		},
		success : function(response) {
			var strs="<option>--Please Choose--<option>"; 
			$("#new_name").html("");
			$.each(response.data, function(index, value) {
			     strs += "<option value=" + value.id + ">" + value.groupName+ "</option>";
			});
			$("#new_name").append(strs);	
		}
	});
}