var pageSize=1;
var table;
var table_height = $(window).height()-240;
$(document).ready(function () {	
	initPage();
	function initPage(){
		getFactorySelect();
		ajaxQuery();
		getBusNumberSelect('#nav-search-input');
	}
	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/MES/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	});

	
	$.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
		_title: function(title) {
			var $title = this.options.title || '&nbsp;'
			if( ("title_html" in this.options) && this.options.title_html == true )
				title.html($title);
			else title.text($title);
		}
	}));
	
	$("#btnQuery").on('click', function(e) {	
		ajaxQuery();
	});
	
	$("#btnAdd").on('click', function(e) {	
		e.preventDefault();
		$("#dialog-confirm").removeClass('hide').dialog({
			resizable: false,
			title: '<div class="widget-header"><h4 class="smaller"><i class="ace-icon fa fa-users green"></i> Add User</h4></div>',
			title_html: true,
			width:'500px',
			modal: true,
			buttons: [{
						text: "Cancel",
						"class" : "btn btn-minier",
						click: function() {$( this ).dialog( "close" );} 
					},
					{
						text: "Add",
						id:"btn_ok",
						"class" : "btn btn-success btn-minier",
						click: function() {
							//$( this ).dialog( "close" ); 
							if($("#new_username").val()===""){
								alert("Username can't be blank！");
								$("#new_username").focus();
								return false;
							}
							if($("#new_staff_number").val()===""){
								alert("Staff number can't be blank！");
								$("#new_staff_number").focus();
								return false;
							}
							$.ajax({
							    url: "addUser",
							    dataType: "json",
								type: "get",
							    data: {
							    	"staff_number" : $("#new_staff_number").val(),
							    	"username" : $("#new_username").val(),
							    	"email" : $("#new_email").val(),
							    	"telephone" : $("#new_telephone").val(),
							    	"cellphone" : $("#new_cellphone").val(),
							    	"password" : $("#new_staff_number").val(),
							    	"display_name" : $("#new_username").val(),
							    	"factory_id" : $("#new_factory_id").val(),
							    	"admin" : $("#new_admin").val()
							    },
							    success:function(response){
							    	$.gritter.add({
										title: 'Message：',
										text: '<h5>Success！</h5>',
										class_name: 'gritter-info'
									});
							    	$("#new_staff_number").val("");
							    	$("#new_username").val("");
							    	$("#new_email").val("");
							    	$("#new_telephone").val("");
							    	$("#new_cellphone").val("");
							    	$("#new_username").focus();
							    	ajaxQuery();
							    }
							});
						} 
					}
				]
		});
	});
	
	
	function getFactorySelect(){
		$.ajax({
			url : "/MES/common/getFactorySelect",
			dataType : "json",
			data : {},
			async : false,
			error : function(response) {
				alert(response.message)
			},
			success : function(response) {
				getSelects_noall(response.data, "", "#new_factory_id");
				getSelects_noall(response.data, "", "#edit_factory_id");
			}
		});
	}
	


});

function ajaxQuery(){
	$("#tableData").dataTable({
		serverSide: true,paiging:true,ordering:false,searching: false,bAutoWidth:false,
		destroy: true,sScrollY: table_height,scrollX: "100%",orderMulti:false,
		pageLength: 25,pagingType:"full_numbers",lengthChange:false,
		language: {
		},
		ajax:function (data, callback, settings) {
			var param ={
				"draw":1,
				"search_key":$("#search_key").val(),
				"orderColumn":"id"
			};
            param.length = data.length;					//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;					//开始的记录序号
            param.page = (data.start / data.length)+1;	//当前页码

            $.ajax({
                type: "post",
                url: "getUserList",
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
		            {"title":"Staff Number","class":"center","data":"staff_number","defaultContent": ""},
		            {"title":"Username","class":"center","data":"display_name","defaultContent": ""},
		            {"title":"Email","class":"center","data":"email","defaultContent": ""},
		            {"title":"Cellphone","class":"center","data": "cellphone","defaultContent": ""},
		            {"title":"Telephone","class":"center","data":"telephone","defaultContent": ""},		            
		            {"title":"Plant","class":"center","data":"factory_name","defaultContent": ""},		            
		            {"title":"Department","class":"center","data": "department","defaultContent": ""},         
		            {"title":"Admin","class":"center","data": "admin","defaultContent": "","render":function(data,type,row){
		            	return data=="0"?"no":"yes"}}, 
		            {"title":"Login Count","class":"center","data": "login_count","defaultContent": ""}, 
		            {"title":"Last Login Time","class":"center","data": "last_login_time","defaultContent": ""},
		            {"title":" ","class":"center","data": null,"id":"staff_number",
		            	"render": function ( data, type, row ) {
		                    return "<i class=\"glyphicon glyphicon-remove bigger-130 showbus\" title=\"Delete\" onclick='delUser(" + row['staff_number'] + 
		                    ")' style='color:blue;cursor: pointer;'></i>&nbsp;&nbsp;" + 
		                    "<i class=\"glyphicon glyphicon-edit bigger-130 showbus\" title=\"Modify\" onclick='editUser(\"" + 
		                    row['staff_number'] + "\",\"" + row['display_name'] + "\",\"" + row['email'] + "\",\"" + row['cellphone'] +
		                    "\",\"" + row['telephone'] + "\",\"" + row['factory_id'] + "\",\"" + row['department_id'] + "\",\"" + row['admin'] +
		                    "\")' style='color:blue;cursor: pointer;'></i>&nbsp;&nbsp;" + 
		                    "<i class=\"glyphicon glyphicon-refresh bigger-130 showbus\" title=\"Reset password\" onclick='resetUserPass(\"" + row['staff_number'] + 
		                    "\")' style='color:blue;cursor: pointer;'></i>";
		                },
		            }
		          ],
	});
}

function resetUserPass(staff_number){
	var r=confirm("Reset the password for the user："+staff_number+"？")
	if (r==true){
		$.ajax({
		    url: "resetUserPass",
		    dataType: "json",
			type: "get",
		    data: {
		    	"staff_number" : staff_number,
		    },
		    success:function(response){
		    	ajaxQuery();
		    	$.gritter.add({
					title: 'Message：',
					text: '<h5>Password reseted！</h5>',
					class_name: 'gritter-info'
				});
		    }
		});
	}
	
}

function delUser(staff_number){
	var r=confirm("Delete user："+staff_number+"？")
	if (r==true){
		$.ajax({
		    url: "delUser",
		    dataType: "json",
			type: "get",
		    data: {
		    	"staff_number" : staff_number,
		    },
		    success:function(response){
		    	ajaxQuery();
		    	$.gritter.add({
					title: 'Message：',
					text: '<h5>Susscess！</h5>',
					class_name: 'gritter-info'
				});
		    }
		});
	}
}

function editUser(staff_name,display_name,email,cellphone,telephone,factory_id,dep_id,admin){
	$("#edit_staff_number").val(staff_name);
	$("#edit_username").val(display_name);
	$("#edit_email").val(email);
	$("#edit_cellphone").val(cellphone);
	$("#edit_telephone").val(telephone);
	$("#edit_factory_id").val(factory_id);
	$("#edit_admin").val(admin);
	$("#dialog-edit").removeClass('hide').dialog({
		resizable: false,
		title: '<div class="widget-header"><h4 class="smaller"><i class="ace-icon fa fa-users green"></i> Modify User Info</h4></div>',
		title_html: true,
		width:'500px',
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
						if($("#edit_username").val()===""){
							alert("Username can't be blank！");
							$("#edit_username").focus();
							return false;
						}
						$( this ).dialog( "close" ); 
						$.ajax({
						    url: "editUser",
						    dataType: "json",
							type: "get",
						    data: {
						    	"staff_number" : $("#edit_staff_number").val(),
						    	"username" : $("#edit_username").val(),
						    	"email" : $("#edit_email").val(),
						    	"telephone" : $("#edit_telephone").val(),
						    	"cellphone" : $("#edit_cellphone").val(),
						    	"display_name" : $("#edit_username").val(),
						    	"factory_id" : $("#edit_factory_id").val(),
						    	"admin" : $("#edit_admin").val()
						    },
						    success:function(response){
						    	ajaxQuery();
						    	$.gritter.add({
									title: 'Message：',
									text: '<h5>Success！</h5>',
									class_name: 'gritter-info'
								});
						    }
						});
					} 
				}
			]
	});
}
