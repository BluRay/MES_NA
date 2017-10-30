$(document).ready(function() {	
	ajaxQuery();
	getBusNumberSelect('#nav-search-input');
	//点击查询
	$("#btnQuery").click(function(){
		ajaxQuery();
	});
	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("../production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	});
})

function ajaxQuery(){
	dt=$("#tableResult").DataTable({
		serverSide: true,
	/*	fixedColumns:   {
            leftColumns: 2,
            rightColumns:2
        },*/
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
			infoEmpty:"",
		},
		ajax:function (data, callback, settings) {
			var param ={
				"draw":1,
				"ecn_no":$("#search_ecn_no").val(),
				"status":$("#search_status").val(),
				"items":$("#search_items").val()
			};
            param.length = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;//开始的记录序号
            param.page = (data.start / data.length)+1;//当前页码

            $.ajax({
                type: "post",
                url: "../production/getEcnItemList",
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
                    callback(returnData);
//                    var head_width=$(".dataTables_scrollHead").width();
//                    //alert(head_width)
//                    $(".dataTables_scrollHead").css("width",head_width-20);
                }
            });
		},
		columns: [
		            
            {"title":"ECN No","width":"120px","class":"center","data":"ecn_no","defaultContent": ""},
            {"title":"Items","width":"170px","class":"center","data":"items","defaultContent": "","render":function(data,row,type){
            	var html=""
                	if(data.length>20){
                		html="<i title='"+data+"' style='font-style: normal'>"+data.substring(1,20)+"...</i>"
                	}else{
                		html=data;
                	}
                	return html;
                }},
            {"title":"Problem Detail","width":"200px","class":"center","data":"problem_details","defaultContent": "","render":function(data,row,type){
            	var html=""
            	if(data.length>50){
            		html="<i title='"+data+"' style='font-style: normal'>"+data.substring(1,30)+"...</i>"
            	}else{
            		html=data;
            	}
            	return html;
            }},
            {"title":"Design People","class":"center","data":"design_people","defaultContent": ""},
            {"title":"Project","class":"center","data":"project_name","defaultContent": ""},
            {"title":"Work Station","class":"center","data": "work_station","defaultContent": ""},
            {"title":"Signed Time#1","class":"center","data": "signed_time_first","defaultContent": ""},
            {"title":"Finished Time","class":"center","data": "finished_time","defaultContent": ""},		            
            {"title":"Status","class":"center","data":"status","defaultContent": "","render":function(data,type,row){
            	return data=="1"?"Created":(data=="2"?"In Process":"Completed");
            }},		            		          
            {"title":"","class":"center","width":"50px","data":'ecn_id',"render":function(data,type,row){
            	return "&nbsp;&nbsp;<i title='Display' class=\"glyphicon glyphicon-search bigger-130\" onclick = 'show(" + JSON.stringify(row)+ ",\"QC\");' style='color:blue;cursor: pointer;'></i>"
        	},
        	"defaultContent": ""
            }
        ],
	});

	$("#tableResult_info").addClass('col-xs-6');
	$("#tableResult_paginate").addClass('col-xs-6');
	$(".dt-buttons").css("margin-top","-50px").find("a").css("border","0px");
}


function show(row,flag){
	//var url=flag=="QC"?"":"production/"
	//检验是否有跟进权限
//	if(!validateUserAuth(url)){
//		alert(Warn.W_15);
//		return false;
//	}
	$("#ecn_no").val(row.ecn_no);
	$("#items").val(row.items);
	
	var bus_list=getBusList(row.ecn_item_id);
	
	drawConfirmTable(bus_list,"#tb_bus_list",flag);
	
	$("#dialog-config_confirm").removeClass("hide").dialog({
		width:880,
		height:550,
		modal: true,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i>&nbsp;Confirm ECN</h4></div>",
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

function drawConfirmTable(bus_list,tb,flag){
	//先destroy datatable，隐藏form
	if($.fn.dataTable.isDataTable(tb)){
		$(tb).DataTable().destroy();
		$(tb).empty();
	}
	var columns=[
         	
        {"title":"Bus No.","class":"center","data":"bus_number","defaultContent": ""},
        {"title":"Plant","class":"center","data":"plant","defaultContent": ""},
        {"title":"Work Station","class":"center","data":"work_station","defaultContent": ""},
        {"title":"Finished Time","class":"center","data":"confirmed_date","defaultContent": ""},
        {"title":"Production People","class":"center","data":"production_people","defaultContent": ""},		            
        {"title":"QC","class":"center","data":"qc","defaultContent": ""},		            
      ];
	
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
		url:'../production/getEcnBusList',
		type:'post',
		dataType:'json',
		async:false,
		data:{
			ecn_item_id:ecn_item_id
		},
		success:function(response){
			bus_list=response.data;
		}
	});
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
