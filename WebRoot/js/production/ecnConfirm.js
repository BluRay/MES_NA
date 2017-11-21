$(document).ready(function() {	
	ajaxQuery();
	getBusNumberSelect('#nav-search-input');
	//点击查询
	$("#btnQuery").click(function(){
		ajaxQuery();
	})
	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/MES/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	});
	$(document).on("click","#selectAll",function() {
		var cur_date=new Date();
		var year=cur_date.getFullYear();
		var month=cur_date.getMonth()+1;
		var day=cur_date.getDate();
		cur_date=year+"-"+(month<10?("0"+month):month)+"-"+(day<10?("0"+day):day)
		
		if ($(this).prop("checked")) {
			check_All_unAll("#tb_bus_list", true);
			$(".confirm_date").val(cur_date);
			$(".production").val($("#user_name").val());
			$(".qc").val($("#user_name").val());
		} else{
			check_All_unAll("#tb_bus_list", false);
			$(".confirm_date").val("");
			$(".production").val("");
			$(".qc").val("");
		}
		
	});
	
	$(document).on("click","input:checkbox",function(e) {
		var tr=$(e.target).parent("td").parent("tr").eq(0);
		var cur_date=new Date();
		var year=cur_date.getFullYear();
		var month=cur_date.getMonth()+1;
		var day=cur_date.getDate();
		cur_date=year+"-"+(month<10?("0"+month):month)+"-"+(day<10?("0"+day):day)
		
		if ($(this).prop("checked")) {
			$(tr).find(".confirm_date").eq(0).val(cur_date);
			$(tr).find(".production").eq(0).val($("#user_name").val());
			$(tr).find(".qc").eq(0).val($("#user_name").val());
		} else{
			$(tr).find(".confirm_date").eq(0).val("");
			$(tr).find(".production").eq(0).val("");
			$(tr).find(".qc").eq(0).val("");
		}
		
	});
})

function ajaxQuery(){
	dt=$("#tableResult").DataTable({
		serverSide: true,
		fixedColumns:   {
            leftColumns: 2,
            rightColumns:2
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
		            {"title":"Items","width":"200","class":"center","data":"items","defaultContent": "","render":function(data,row,type){
		            	var html=""
		            	data=data.replace(/'/g,"&apos;").replace(/\r/ig, "&nbsp;").replace(/\n/ig, "&nbsp;");
		            	if(data.length>50){
		            		html="<i title='"+data+"' style='font-style: normal'>"+data.substring(1,45)+"...</i>"
		            	}else{
		            		html=data;
		            	}
		            	return html;
			         }},
		            {"title":"Problem Detail","width":"300","class":"center","data":"problem_details","defaultContent": "","render":function(data,row,type){
		            	var html=""
		            	data=data.replace(/'/g,"&apos;").replace(/\r/ig, "&nbsp;").replace(/\n/ig, "&nbsp;");
		            	if(data.length>50){
		            		html="<i title='"+data+"' style='font-style: normal'>"+data.substring(1,45)+"...</i>"
		            	}else{
		            		html=data;
		            	}
		            	return html;
		            }},
		            {"title":"Design People","class":"center","data":"design_people","defaultContent": ""},
		            {"title":"Project","class":"center","data":"project_name","defaultContent": ""},
		            {"title":"Work Station","class":"center","data": "work_station","defaultContent": ""},
		            {"title":"Signed  Time#1","class":"center","data": "signed_time_first","defaultContent": ""},
		            {"title":"Finished Time","class":"center","data": "finished_time","defaultContent": ""},		            
		            {"title":"Status","class":"center","data":"status","defaultContent": "","render":function(data,type,row){
		            	return data=="1"?"Created":(data=="2"?"In Process":"Completed");
		            }},		            		          
		            {"title":"Production","class":"center","data":'ecn_id',"render":function(data,type,row){
		            	var obj={};
		            	obj.ecn_no=row.ecn_no;
		            	obj.items=row.items;
		            	obj.ecn_item_id=row.ecn_item_id;
		            	var jsonStr=JSON.stringify(obj).replace(/'/g,"&apos;").replace(/\r/ig, "&nbsp;").replace(/\n/ig, "&nbsp;");
		            	return "<i title='Confirm' class=\"ace-icon glyphicon glyphicon-ok bigger-130\" onclick = 'showConfirm(" + jsonStr+ ");' style='color:green;cursor: pointer;'></i>"
		            	},
		            	"defaultContent": ""
		            },
		            {"title":"QC","class":"center","data":'ecn_id',"render":function(data,type,row){
		            	var obj={};
		            	obj.ecn_no=row.ecn_no;
		            	obj.items=row.items;
		            	obj.ecn_item_id=row.ecn_item_id;
		            	var jsonStr=JSON.stringify(obj).replace(/'/g,"&apos;").replace(/\r/ig, "&nbsp;").replace(/\n/ig, "&nbsp;");
		            	return "&nbsp;&nbsp;<i title='Confirm' class=\"ace-icon glyphicon glyphicon-ok bigger-130\" onclick = 'showConfirm(" +jsonStr + ",\"QC\");' style='color:blue;cursor: pointer;'></i>"
	            	},
	            	"defaultContent": ""
		            }
		            
		          ],
		
	});

	$("#tableResult_info").addClass('col-xs-6');
	$("#tableResult_paginate").addClass('col-xs-6');
	$(".dt-buttons").css("margin-top","-50px").find("a").css("border","0px");
}


function showConfirm(row,flag){
	var url=flag=="QC"?"production/confirmEcnItem_QC":"production/confirmEcnItem"
	//检验是否有跟进权限
	if(!validateUserAuth(url)){
		alert(Warn.W_15);
		return false;
	}
	
	
	$("#ecn_no").val(row.ecn_no);
	$("#items").val(row.items);
	
	var bus_list=getBusList(row.ecn_item_id);
	
	drawConfirmTable(bus_list,"#tb_bus_list",flag);
	
	$("#dialog-config_confirm").removeClass("hide").dialog({
		width:780,
		height:550,
		modal: true,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i>&nbsp;Confirm ECN</h4></div>",
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
					ajaxConfirm(row.ecn_item_id,flag);
					//$( this ).dialog( "close" ); 
				} 
			}
		]
	});
}


function drawConfirmTable(bus_list,tb,flag){
	//先destroy datatable，隐藏form
	if($.fn.dataTable.isDataTable(tb)){
		$(tb).DataTable().destroy();
		$(tb).empty();
	}
	
	var columns=[
	             	{"title":"<input type='checkbox' id='selectAll' />","class":"center","data":"bus_number","render": function ( data, type, row ) {
	             		var html="";
	             		if(row.confirmed_date==undefined||row.confirmed_date.trim().length==0){
	             			html="<input value='"+data+"' type='hidden' /><input type='checkbox' fid='cb_"+data+"'>";
	             		}
	             		return html;
	                },"defaultContent": ""},
		            {"title":"Bus No.","class":"center","data":"bus_number","defaultContent": ""},
		            {"title":"Plant","class":"center","data":"plant","defaultContent": ""},
		            {"title":"Work Station","class":"center","data":"work_station","defaultContent": ""},
		            {"title":"Finished Time","class":"center","data":"confirmed_date","defaultContent": "","render":function(data,type,row){
		            	var html="<input class=\"input-medium confirm_date\" style=\"width:100%;margin: 0 0;\" onclick=\"WdatePicker({language:'en_us',dateFmt:'yyyy-MM-dd'})\" type=\"text\">";
		            	if(data!=undefined && data.trim().length>0 ){
		            		html=data;
		            	}
		            	return html;
		            }},
		            {"title":"Production People","class":"center","data":"production_people","defaultContent": "","render":function(data,type,row){
		            	var html="<input type='text' style='width:100%;margin: 0 0;' class='input-medium production' />";
		            	if(data!=undefined && data.trim().length>0){
		            		html=data;
		            	}
		            	return html;
		            }},		            
		          ]	 ;
	if(flag=="QC"){
		columns=[
					{"title":"<input type='checkbox' id='selectAll' />","class":"center","data":"id","render": function ( data, type, row ) {
						var html="";
	             		if(row.qc_date==undefined||row.qc_date.trim().length==0){
	             			html="<input value='"+data+"' type='hidden' /><input type='checkbox' fid='cb_"+data+"'>";
	             		}
	             		return html;
					},"defaultContent": ""},
					{"title":"Bus No.","class":"center","data":"bus_number","defaultContent": ""},
					{"title":"Plant","class":"center","data":"plant","defaultContent": ""},
					{"title":"Work Station","class":"center","data":"work_station","defaultContent": ""},
					{"title":"Finished Time","class":"center","data":"confirmed_date","defaultContent": ""},
					{"title":"Production People","class":"center","data":"production_people","defaultContent": ""/*,"render":function(data,type,row){
						var html="<input type='text' style='width:100%;margin: 0 0;' class='input-medium production' />";
		            	return html;
		            }*/},
					{"title":"QC","class":"center","data":"qc","defaultContent": "","render":function(data,type,row){
						var html="<input type='text' style='width:100%;margin: 0 0;' class='input-medium qc' />";
						if(data!=undefined && data.trim().length>0){
		            		html=data;
		            	}
		            	return html;
		            }},		            
		          ]	 ;
	}
	
	var t=$(tb).dataTable({
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
		data:bus_list,
		columns: columns     
	});
	$(".dataTables_wrapper").find(".row").hide();
}

function getBusList(ecn_item_id){
	var bus_list=[];
	$.ajax({
		url:'getEcnBusList',
		type:'post',
		dataType:'json',
		async:false,
		data:{
			ecn_item_id:ecn_item_id
		},
		success:function(response){
			bus_list=response.data;
		}
	})
	return bus_list;
}

function validateUserAuth(url){
	var flag=true;
	$.ajax({
		url:'/MES/common/validateUserAuth',
		type:"post",
		dataType:"json",
		async:false,
		data:{
			staff_number:$("#staff_number").val(),
			url:url
		},
		success:function(response){
			if(!response.success){
				flag=false;
			}
		}
	})
	return flag;
}

function ajaxConfirm(ecn_item_id,flag){
	var cxed_cbx=$("#tb_bus_list tbody").find("input:checkbox:checked");
	//alert($(cxed_cbx).length)
	var submit_flag=true;
	var confirm_bus_list=[];
	var url="confirmEcnItem"
	if(flag=="QC"){
		url="confirmEcnItem_QC";
	}
	
	$.each(cxed_cbx,function(index,cbx){
		var bus={};
		bus.ecn_item_id=ecn_item_id;
		
		var tr=$(cbx).parent("td").parent("tr").eq(0);
		bus.bus_number=$(tr).children("td").eq(1).html();
		if(flag=="QC"){
			var qc=$(tr).find(".qc").eq(0).val();
			if(qc.trim().length==0){
				alert(Warn.W_16);
				submit_flag=false;
				return false;
			}
			bus.qc=qc;
		}else{
			var confirm_date=$(tr).find(".confirm_date").eq(0).val();
			var production_people=$(tr).find(".production").eq(0).val();
			if(confirm_date.trim().length==0){
				alert(Warn.W_17);
				submit_flag=false;
				return false;
			}
			if(production_people.trim().length==0){
				alert(Warn.W_18);
				submit_flag=false;
				return false;
			}
			bus.confirmed_date=confirm_date;
			bus.production_people=production_people;
		}
		
		confirm_bus_list.push(bus);
	})
	if(confirm_bus_list.length==0){
		alert(Warn.W_19);
		submit_flag=false;
		return false;
	}
	
	if(submit_flag)
	$.ajax({
		url:url,
		type:"post",
		dataType:"json",
		async:false,
		data:{
			bus_list:JSON.stringify(confirm_bus_list),
			ecn_item_id:ecn_item_id
		},
		success:function(response){
			alert(response.message);
			ajaxQuery();
			$("#dialog-config_confirm").removeClass("hide").dialog("close")
		}
	})
}







