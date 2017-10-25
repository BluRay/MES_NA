var extArray=['.xls']
$(document).ready(function() {	
	initPage();
	
	//点击Add，弹出“新增”对话框
	$("#btnAdd").click(function(){
		$("#create_form").clearForm();
		var material_table_list=$(".material_table");
		$.each(material_table_list,function(i,material_table){
			if($.fn.dataTable.isDataTable(material_table)){
				$(material_table).DataTable().destroy();
				$(material_table).empty();
			}
		})
		$(".item_name").val("");
		$(".problem_detail").val("");
		
		$('.multiselect-selected-text').html('None selected')	
		
		var dialog = $( "#dialog-config_new" ).removeClass('hide').dialog({
			width:980,
			height:650,
			modal: true,
			title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i>&nbsp;Add ECN</h4></div>",
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
						ajaxAdd();
						//$( this ).dialog( "close" ); 
					} 
				}
			]
		});
	});
	
	/**
	 * 新增技改任务
	 */
	$("#add_tech_detail").click(function(){
		var content_html="";
		var task_item=1;
		var type='new';
		var tab_lis=$("#new_tab").children("li");
		task_item=$(tab_lis).length;
		$("#new_tab").find("li").removeClass("active");
		$("#new_task_list").find("div").removeClass("active");
		var tab_li ="<li role='presentation' class='active'><a href='#new_task"+task_item+"' data-toggle='tab' style='font-size: 14px; color: #333;display:inline-block'><span>Item-"+task_item+"</span>"
			+"&nbsp;&nbsp;<i class='glyphicon glyphicon-remove' style='cursor: pointer;color: rgb(218, 208, 208);display:inline-block' onclick='javascript:{if (confirm(\"确认删除该任务？\"))removeTask(this,\""+type+"\")}'></i></a></li>";
		$("#add_tech_detail").parent("li").before($(tab_li));
		var cp_tab= $('#task_temp').clone(true);
		$(cp_tab).addClass("active");
		$(cp_tab).removeClass("hide");
		$(cp_tab).attr("id","new_task"+task_item);
		$('#new_task_list').append($(cp_tab))
	})
	/**
	 * 编辑界面-新增技改任务
	 */
	$(document).on("click","#edit_add_tech_detail",function(){
		
		var content_html="";
		var task_item=1;
		var type='edit';
		var tab_lis=$("#edit_tab").children("li");
		task_item=$(tab_lis).length;
		$("#edit_tab").find("li").removeClass("active");
		$("#edit_task_list").find("div").removeClass("active");
		var tab_li ="<li role='presentation' class='active'><a href='#edit_task"+task_item+"' data-toggle='tab' style='font-size: 14px; color: #333;display:inline-block'><span>Item-"+task_item+"</span>"
			+"&nbsp;&nbsp;<i class='glyphicon glyphicon-remove' style='cursor: pointer;color: rgb(218, 208, 208);display:inline-block' onclick='javascript:{if (confirm(\"确认删除该任务？\"))removeTask(this,\""+type+"\")}'></i></a></li>";
		$("#edit_add_tech_detail").parent("li").before($(tab_li));
		var cp_tab= $('#task_temp').clone(true);
		$(cp_tab).addClass("active");
		$(cp_tab).removeClass("hide");
		$(cp_tab).attr("id","edit_task"+task_item);
		$('#edit_task_list').append($(cp_tab))
	})

	//点击查询
	$("#btnQuery").click(function(){
		ajaxQuery();
	})
	
	
	
	
})

/**
 * 初始化
 */
function initPage(){
	//文件控件初始化
	$('.material_upload').ace_file_input({
		no_file:'Please Choose xls File...',
		btn_choose:'Choose File',
		btn_change:'Change File',
		droppable:false,
		onchange:null,
		thumbnail:false, //| true | large
		allowExt: ['xls','XLS'],
	}).on('file.error.ace', function(event, info) {
		alert("Please Choose xls File!");
    });
	
	getOrderNoSelect("#new_project","#orderId",function(obj){
		var bus_list=[];
		$.ajax({			
			type : "get",// 使用get方法访问后台
			dataType : "json",// 返回json格式的数据
			async : false,
			url:"/MES/common/getBusListByProject",
			data : {
				"project_id" : obj.id
			},
			success : function(response) {
				bus_list = response.data;
				$('#new_bus_no').html("");
				var strs="";
				$.each(bus_list, function(index, value) {
					strs += "<option value=" + value.bus_number + " selected='selected' >"
					+ value.bus_number + "</option>";
				})
				$('#new_bus_no').append(strs);
				$('#new_bus_no').multiselect('rebuild');	
			}
		})	
		//获取工位下拉列表
		getStationSelect(obj.factory)
		
	});
	
	$('#new_bus_no,#edit_bus_no,#display_bus_no').multiselect({
		 enableFiltering: false,
		 enableHTML: true,
		/* includeSelectAllOption: true,
		 selectAllText: 'Select All',*/
		 maxHeight: 400,
		 buttonClass: 'btn btn-white',
		 selectedClass: null,
		 templates: {
			button: '<button type="button" class="multiselect dropdown-toggle" style="font-size:13px;height:30px;" data-toggle="dropdown"><span class="multiselect-selected-text"></span> &nbsp;<b class="fa fa-caret-down"></b></button>',
			ul: '<ul class="multiselect-container dropdown-menu" style="text-align:left"></ul>',			
			li: '<li><a tabindex="0"><label></label></a></li>',
	        divider: '<li class="multiselect-item divider"></li>',
	        liGroup: '<li class="multiselect-item multiselect-group"><label></label></li>'
		 }
	});
	
	ajaxQuery();
}

/**
 * 上传物料明细
 * @param form
 * @param file
 * @returns {Boolean}
 */
function upload(form,file){
	//alert($(form).attr("name"))
	var tr=$(form).parent("div").parent("td").parent("tr");
	//alert($(tr).html())
	var tb_material=$(tr).next().find(".material_table");
	if (file == "") {
		alert("请选择文件！");
		return false;
	}
	allowSubmit = false;
	if (!file)
		return;
	while (file.indexOf("\\") != -1)
		file = file.slice(file.indexOf("\\") + 1);
		ext = file.slice(file.indexOf(".")).toLowerCase();
	for (var i = 0; i < extArray.length; i++) {
		if (extArray[i] == ext) {
			allowSubmit = true;
			break;
		}
	}
	if (allowSubmit) {
		$(form).ajaxSubmit({
			dataType : "json",
			type : 'post', // 提交方式 get/post
			url : 'uploadEcnMaterial', // 需要提交的 url
			data : {
				
			},
			success : function(response) {
				alert(JSON.stringify(response.data));
				var materialList=response.data;
				$(tb_material).data("materialList",materialList);
				drawMaterialTable(materialList,tb_material);
				
				$(form).resetForm();
			}
		})
		
	}
	
}

/**
 * 新增
 */
function ajaxAdd(){
	var project_id=$("#new_project").attr("order_id");
	var selected_bus = [];
	$('#new_bus_no option:selected').each(function () {
		selected_bus.push($(this).val());
	});
	var ecn_no=$("#new_ecn_no").val();
	var design_people=$("#new_design_people").val();
	if(project_id==undefined||project_id==""){
		alert(Warn.W_08);
		return false;
	}
	if(selected_bus.length==0){
		alert(Warn.W_09);
		return false;
	}
	if(ecn_no.trim().length==0){
		alert(Warn.W_10);
		return false;
	}
	
	var allTaskJson=[];
	var allTaskDiv = $("#new_task_list").children('div');
	allTaskDiv.each(function(index){
		var tb_material=$(this).find(".material_table").eq(0);
		//alert(JSON.stringify($(tb_material).data("materialList")));
		var taskJson={};
		var taskTable = $(this).children('div').eq(0).children('div').eq(0).children('div').eq(0).children('table').children();
		//alert(taskTable.html())
		var item_name=$(taskTable).find(".item_name").eq(0).val();
		var work_station=$(taskTable).find(".work_station").eq(0).val();
		var problem_detail=$(taskTable).find(".problem_detail").eq(0).val();
		var scope_change=$(taskTable).find(".scope_change").eq(0).val();
		if(item_name.trim().length==0){
			alert(Warn.W_11);
			return false;
		}
		if(work_station.trim().length==0){
			alert(Warn.W_12);
			return false;
		}
		if(problem_detail.trim().length==0){
			alert(Warn.W_13);
			return false;
		}
		if(scope_change.trim().length==0){
			alert(Warn.W_14);
			return false;
		}
		
		taskJson.items=item_name;
		taskJson.item_no=index+1;
		taskJson.work_station=work_station;
		taskJson.problem_details=problem_detail;
		taskJson.scope_change=scope_change;
		taskJson.materialList=$(tb_material).data("materialList")==undefined?"":JSON.stringify($(tb_material).data("materialList"));
		
		allTaskJson.push(taskJson);
	});
	
	$("#create_form").ajaxSubmit({
		url:'addEcnItems',
		type:'post',
		dataType:'json',
		data:{
			project_id:$("#new_project").attr("order_id"),
			ecn_no:$("#new_ecn_no").val(),
			design_people:$("#new_design_people").val(),
			bus_list:selected_bus.join(","),
			project:$("#new_project").val(),
			taskList:JSON.stringify(allTaskJson)
		},
		success:function(response){
			alert("Succeed!");
			$( "#dialog-config_new" ).dialog("hide");
		}
	})
	
	
	//alert(selected.join(","))
}

/*
 * 删除技改任务
 */
function removeTask(p,type,ecn_item_id){
	var task_div_id=$(p).parent().attr("href");
	var ecn_item_id=ecn_item_id||"";
	// 编辑时，当task id 存在时，删除需要记录task id
	if(ecn_item_id!=""){
		$.ajax({
			url:'deleteEcnItem',
			type:'post',
			dataType:'json',
			data:{
				ecn_item_id:ecn_item_id
			},
			success:function(response){
				
			}
		})
	}
	

	var task_pre=type+"_task";
	// alert(task_div_id);
	var allTabLi = $(p).parent().parent().siblings();	
	$(p).parent().parent().remove();// 删除该tabLi
	$(task_div_id).remove();// 删除对应tab content
	var allTabDiv = $("#"+type+"_task_list").find(".tab-pane");
	// 技改任务tab栏重新排序
	var actived=false;
	allTabLi.each(function(index,li){
		if(index>=0){
			var span = $(li).children('a');
			// alert($(span).attr("href"));
			$(span).attr('href',"#"+task_pre+(index+1));
			$(span).find("span").html("Item-"+(index+1));
			if($(li).hasClass("active")){actived=true}
		}
	});
	// 技改任务DIV id重排
	allTabDiv.each(function(index,div){
		if(index>0){
			var pre_id = $(div).attr('id');
			$("#"+pre_id).attr("id",""+task_pre+(index+1));
		}
	});
	if(!actived){
		$(allTabLi[0]).addClass("active");
		$(allTabDiv[0]).addClass("active");
	}
	
}

function getStationSelect(factory){
	$.ajax({
		url:'getStationSelect',
		type:'post',
		dataType:'json',
		async:false,
		data:{
			factory:factory
		},
		success:function(response){
			var option_str="";
			$.each(response.data,function(i,station){
				option_str+="<option value='"+(station.station_code+" "+station.station_name)+"'>"+station.station_code+"</option>";
			})
			$(".work_station").append(option_str);
		}
	})
}

function drawMaterialTable(materialList,tb_material){
	var t=$(tb_material).dataTable({
		paiging:false,
		ordering:false,
		searching: false,
		autoWidth:false,
		destroy: true,
		paginate:false,
		//sScrollY: $(window).height()-250,
		scrollX: false,
		scrollCollapse: false,
		lengthChange:false,
		orderMulti:false,
		info:false,
		language: {
			emptyTable:"",					     
			infoEmpty:"",
			zeroRecords:"No records searched！"
		},
		data:materialList,
		columns: [
		            {"title":"Item","class":"center","data":"item_no","defaultContent": ""},
		            {"title":"SAP","class":"center","data":"SAP_material","defaultContent": ""},
		            {"title":"BYD P/N","class":"center","data":"BYD_NO","defaultContent": ""},
		            {"title":"Description","class":"center","data":"description","defaultContent": ""},
		            {"title":"Specification","class":"center","data":"specification","defaultContent": ""},
		            {"title":"Qty","class":"center","data":"qty","defaultContent": ""},
		            {"title":"Note","class":"center","data":"note","defaultContent": ""}		            
		          ]	      
	});
	$(".dataTables_wrapper").find(".row").hide();
}

function ajaxQuery(){
	dt=$("#tableResult").DataTable({
		serverSide: true,
		fixedColumns:   {
            leftColumns: 2,
            rightColumns:1
        },
		dom: 'Bfrtip',
		lengthMenu: [
		             [ 20, 30, 50, -1 ],
		             [ 'Show 20 rows', 'Show 30 rows', 'Show 50 rows', 'Show all rows' ]
		         ],
	    buttons: [
	        {extend:'excelHtml5',title:'data_export',className:'black',text:'<i class=\"fa fa-file-excel-o bigger-130\" tooltip=\"导出excel\"></i>'},
	        {extend:'pageLength',/*text:'显示行'*/}
	       
	    ],
        /*rowsGroup:[0,1,2,3,4,5],*/
		paiging:true,
		ordering:false,
		searching: false,
		autoWidth:false,
		destroy: true,
		scrollY: $(window).height()-250,
		scrollX: true,
		/*scrollCollapse: true,*/
		pageLength: 20,
		pagingType:"full_numbers",
		lengthChange:true,
		orderMulti:false,
		language: {
			emptyTable:"Sorry,There's no records searched！",
			//info:"Total _TOTAL_ records,page _PAGE_ to _PAGES_ pages",
			infoEmpty:"",
		/*	paginate: {
			  first:"first page",
		      previous: "previous page",
		      next:"next page",
		      last:"last page",
		      loadingRecords: "Hold on please,processing...",		     
			}*/
		},
		ajax:function (data, callback, settings) {
			var param ={
				"draw":1,
				"ecn_no":$("#search_ecn_no").val(),
				"status":$("#search_status").val(),
				"start_date":$("#search_date_start").val(),
				"end_date":$("#search_date_end").val(),
			};
            param.length = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;//开始的记录序号
            param.page = (data.start / data.length)+1;//当前页码

            $.ajax({
                type: "post",
                url: "getEcnItemList",
                cache: true,  //禁用缓存
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
                    //console.log(returnData);
                    //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                    //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                 // settings.rowsGroup=[0,1,2,3,4,5];
                   //alert("分页调用");
                    callback(returnData);
                    var head_width=$(".dataTables_scrollHead").width();
                    //alert(head_width)
                    $(".dataTables_scrollHead").css("width",head_width-20);
                }
            });
		
		},
		columns: [
		            
		            {"title":"ECN No","class":"center","data":"ecn_no","defaultContent": ""},
		            {"title":"Items","class":"center","data":"items","defaultContent": ""},
		            {"title":"Problem Detail","class":"center","data":"problem_details","defaultContent": ""},
		            {"title":"Design People","class":"center","data":"design_people","defaultContent": ""},
		            {"title":"Project","class":"center","data":"project_name","defaultContent": ""},
		            {"title":"Work Station","class":"center","data": "work_station","defaultContent": ""},
		            {"title":"Status","class":"center","data":"project_status","defaultContent": "","render":function(data,type,row){
		            	return data=="1"?"Created":(data=="2"?"In Process":"Completed");
		            }},		            		          
		            {"title":"","class":"center","data":'ecn_id',"render":function(data,type,row){
		            	return "<i title='Change' class=\"ace-icon fa fa-pencil bigger-130\" onclick = 'showEdit(" + JSON.stringify(row)+ ");' style='color:green;cursor: pointer;'></i>"+
		            	"&nbsp;&nbsp;<i title='Display' class=\"ace-icon fa fa-search bigger-130\" onclick = 'showDisplay(" + JSON.stringify(row)+ ");' style='color:blue;cursor: pointer;'></i>"
		            	},
		            	"defaultContent": "<i class=\"ace-icon fa fa-pencil bigger-130 editorder\" style='color:green;cursor: pointer;'></i>"}
		          ],
		
	});

	$("#tableResult_info").addClass('col-xs-6');
	$("#tableResult_paginate").addClass('col-xs-6');
	$(".dt-buttons").css("margin-top","-50px").find("a").css("border","0px");
}
/**
 * 展示修改界面
 */
function showEdit(row){
	var project_id=row.project_id;
	var project=row.project;
	var ecn_no=row.ecn_no;
	var pictures=row.pictures;
	var design_people=row.design_people;
	var bus_list=row.bus_list;
	$('#edit_project').val(project).attr("order_id",project_id).attr("disabled",true);
	var strs="";
	$.each(bus_list.split(','),function(i,bus){
		strs += "<option value=" + bus + " selected='selected' >"
		+ bus + "</option>";
	})
	$("#edit_bus_no").html("").append(strs);
	
	$("#edit_bus_no").multiselect('rebuild');	
	$("#edit_bus_no").multiselect('disable');
	
	$("#edit_ecn_no").val(ecn_no);
	if(pictures.trim().length>0){
		var td_display=$("#edit_ecn_pictures").parent("td").next("td");
		//alert(td_display.length)
		if(td_display.length>0){
			$(td_display).html("<td><a href='"+pictures+"'>查看</a></td>");
		}else
			$("#edit_ecn_pictures").parent("td").after("<td><a href='"+pictures+"'>查看</a></td>");
	}
	$("#edit_design_people").val(design_people);
	
	//根据ecn_id 查询技改任务
	var item_list=getItemList(row.ecn_id);
	$('#edit_task_list').html("");
	$("#edit_tab").html("<li><i id=\"edit_add_tech_detail\" class=\"glyphicon glyphicon-plus bigger-110\" style=\"cursor: pointer; padding-top: 10px;padding-left:5px;color: blue;\"></i></li>");
	
	$.each(item_list,function(index,item){
		var task_item=index+1;
		var active='';
		if(task_item==row.item_no){
			active='active';
		}
		var tab_li ="<li role='presentation' class='"+active+"'><a href='#edit_task"+(index+1)+"' data-toggle='tab' style='font-size: 14px; color: #333;display:inline-block'><span>Item-"+(index+1)+"</span>";
		if(item.status=='1'){
			tab_li+="&nbsp;&nbsp;<i class='glyphicon glyphicon-remove' style='cursor: pointer;color: rgb(218, 208, 208);display:inline-block' onclick='javascript:{if (confirm(\"确认删除该任务？\"))removeTask(this,\"edit\",\""+item.id+"\")}'></i></a></li>";
		}	
	$("#edit_add_tech_detail").parent("li").before($(tab_li));
	//任务内容
	var type='edit';
	var tab_lis=$("#edit_tab").children("li");
	
	
	var cp_tab= $('#task_temp').clone(true);
	if(task_item==row.item_no){
		$(cp_tab).addClass("active");
	}	
	$(cp_tab).removeClass("hide");
	$(cp_tab).attr("id","edit_task"+task_item);
	$(cp_tab).attr("ecn_item_id",item.id);
	//alert($(cp_tab).attr("class"))
	$('#edit_task_list').append($(cp_tab));
	
	getStationSelect(row.factory);
	$("#edit_task"+task_item).find(".item_name").eq(0).val(item.items);
	$("#edit_task"+task_item).find(".work_station").eq(0).val(item.work_station);
	$("#edit_task"+task_item).find(".problem_detail").eq(0).val(item.problem_details);
	$("#edit_task"+task_item).find(".scope_change").eq(0).val(item.scope_change);
	
	var tb_material=$("#edit_task"+task_item).find(".material_table").eq(0);
	$(tb_material).data("materialList",item.material_list);
	drawMaterialTable(item.material_list,tb_material);
	
	})
	
	
	$("#dialog-config_edit").removeClass("hide").dialog({
		width:980,
		height:650,
		modal: true,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i>&nbsp;Change ECN</h4></div>",
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
					ajaxEdit(row.ecn_id);
					//$( this ).dialog( "close" ); 
				} 
			}
		]
	});
	
}

function getItemList(ecn_id){
	var item_list=[];
	$.ajax({
		url:'getItemListByEcn',
		type:'post',
		dataType:'json',
		async:false,
		data:{
			ecn_id:ecn_id
		},
		success:function(response){
			item_list=response.data
		}
	})
	//alert(JSON.stringify(item_list))
	return item_list;
}

function ajaxEdit(ecn_id){
	var project_id=$("#eidt_project").attr("order_id");
	var selected_bus = [];
	$('#edit_bus_no option:selected').each(function () {
		selected_bus.push($(this).val());
	});
	var ecn_no=$("#edit_ecn_no").val();
	var design_people=$("#edit_design_people").val();

	if(ecn_no.trim().length==0){
		alert(Warn.W_10);
		return false;
	}
	
	var allTaskJson=[];
	var allTaskDiv = $("#edit_task_list").children('div');
	allTaskDiv.each(function(index,itemDiv){
		var tb_material=$(this).find(".material_table").eq(0);
		alert(JSON.stringify($(tb_material).data("materialList")));
		var taskJson={};
		var taskTable = $(this).children('div').eq(0).children('div').eq(0).children('div').eq(0).children('table').children();
		//alert(taskTable.html())
		var item_name=$(taskTable).find(".item_name").eq(0).val();
		var work_station=$(taskTable).find(".work_station").eq(0).val();
		var problem_detail=$(taskTable).find(".problem_detail").eq(0).val();
		var scope_change=$(taskTable).find(".scope_change").eq(0).val();
		if(item_name.trim().length==0){
			alert(Warn.W_11);
			return false;
		}
		if(work_station.trim().length==0){
			alert(Warn.W_12);
			return false;
		}
		if(problem_detail.trim().length==0){
			alert(Warn.W_13);
			return false;
		}
		if(scope_change.trim().length==0){
			alert(Warn.W_14);
			return false;
		}
		taskJson.id=$(itemDiv).attr('ecn_item_id')||"";
		taskJson.items=item_name;
		taskJson.item_no=index+1;
		taskJson.work_station=work_station;
		taskJson.problem_details=problem_detail;
		taskJson.scope_change=scope_change;
		taskJson.materialList=JSON.stringify($(tb_material).data("materialList"))||"";
		
		allTaskJson.push(taskJson);
	});
	
	$("#edit_form").ajaxSubmit({
		url:'updateEcnItems',
		type:'post',
		dataType:'json',
		data:{
			project_id:$("#edit_project").attr("order_id"),
			ecn_no:$("#edit_ecn_no").val(),
			ecn_id:ecn_id,
			design_people:$("#edit_design_people").val(),
			bus_list:selected_bus.join(","),
			project:$("#edit_project").val(),
			taskList:JSON.stringify(allTaskJson)
		},
		success:function(response){
			alert("Succeed!");
			ajaxQuery();
			$( "#dialog-config_edit" ).dialog("close");
		}
	})
	
}

/**
 * 展示页面
 * @param row
 */
function showDisplay(row){
	var project_id=row.project_id;
	var project=row.project;
	var ecn_no=row.ecn_no;
	var pictures=row.pictures;
	var design_people=row.design_people;
	var bus_list=row.bus_list;
	$('#display_project').val(project).attr("order_id",project_id).attr("disabled",true);
	var strs="";
	$.each(bus_list.split(','),function(i,bus){
		strs += "<option value=" + bus + " selected='selected' >"
		+ bus + "</option>";
	})
	$("#display_bus_no").html("").append(strs);
	
	$("#display_bus_no").multiselect('rebuild');	
	$("#display_bus_no").multiselect('disable');
	
	$("#display_ecn_no").val(ecn_no).attr("disabled",true);
	if(pictures.trim().length>0){
		$("#display_ecn_pictures").html("<a href='"+pictures+"'>查看</a>");
	}
	$("#display_design_people").val(design_people).attr("disabled",true);
	
	//根据ecn_id 查询技改任务
	var item_list=getItemList(row.ecn_id);
	$('#display_task_list').html("");
	$("#display_tab").html("");
	
	$.each(item_list,function(index,item){
		var task_item=index+1;
		var active='';
		if(task_item==row.item_no){
			active='active';
		}
		var tab_li ="<li role='presentation' class='"+active+"'><a href='#display_task"+(index+1)+"' data-toggle='tab' style='font-size: 14px; color: #333;display:inline-block'><span>Item-"+(index+1)+"</span>";

	$("#display_tab").append($(tab_li));
	//任务内容
	var type='display';
	var tab_lis=$("#display_tab").children("li");
	
	
	var cp_tab= $('#task_temp').clone(true);
	if(task_item==row.item_no){
		$(cp_tab).addClass("active");
	}	
	$(cp_tab).removeClass("hide");
	$(cp_tab).attr("id","display_task"+task_item);
	$(cp_tab).attr("ecn_item_id",item.id);
	//alert($(cp_tab).attr("class"))
	$('#display_task_list').append($(cp_tab));
	
	getStationSelect(row.factory);
	$("#display_task"+task_item).find(".item_name").eq(0).val(item.items).attr("disabled",true);
	$("#display_task"+task_item).find(".work_station").eq(0).val(item.work_station).attr("disabled",true);
	$("#display_task"+task_item).find(".problem_detail").eq(0).val(item.problem_details).attr("disabled",true);
	$("#display_task"+task_item).find(".scope_change").eq(0).val(item.scope_change).attr("disabled",true);
	
	var tb_material=$("#display_task"+task_item).find(".material_table").eq(0);
	$(tb_material).data("materialList",item.material_list);
	drawMaterialTable(item.material_list,tb_material);
	$(".td_material_upload").hide();
	})
	
	
	$("#dialog-config_display").removeClass("hide").dialog({
		width:980,
		height:650,
		modal: true,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i>&nbsp;Change ECN</h4></div>",
		title_html: true,
		buttons: [ 
			{
				text: "Close",
				"class" : "btn btn-minier",
				click: function() {
					$( this ).dialog( "close" ); 
				} 
			},
			
		]
	});
	
}





