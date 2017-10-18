var dt="";
$(document).ready(function () {	
	initPage();
	function initPage(){
		getBusNumberSelect('#search_bus_number');
//		getBusNumberSelect('#nav-search-input');
		getOrderNoSelect("#search_project_no","#orderId");
		getFactorySelect("production/printBusNumber",'',"#search_plant","All",'id');
//		getFactorySelect("production/printVin",'',"#vin_factory",null,'id');
	};

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/BMS/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})
	
	$("#btnQuery").click (function () {
		ajaxQuery();
	});
	
	window.onafterprint=function(){
		 ajaxUpdatePrint(vinList);
	}
	//打印后更新打印信息
	function ajaxUpdatePrint(busNoList){
		$.ajax({
			type : "get",// 使用get方法访问后台
			dataType : "json",// 返回json格式的数据
			url : "afterVinPrint",
			data : {
				"conditions" : vinList
			},
			success:function(response){
				if(response.success){
//					//alert("打印成功！");
//					 setTimeout(function (){
//						 ajaxQuery();				
//						},1000);
				}
			}
		});
	}
	//打印
	$(document).on('click', '#btnPrint',function(){
		$("#printarea").html("");
		var printFlag=true;
		vinList="";//获取要打印的车号列表
		var count=0;
		var printhtml="";
		var flag=true;
		$("#tableResult tbody :checkbox").each(function(){
			
			if($(this).prop("checked")){
				if($(this).parents("tr").children().eq(4).text()==''){
					flag=false;
					return false;
				}
				vinList+=$(this).parents("tr").children().eq(4).text()+",";
				printhtml+="<div class=\"printConfigure printable toPrint\" style=\"padding-top:10px;padding-bottom:10px;line-height:40px;\" ><table border=0>"
					+"<tr ><td style=\"text-align:right; font-size:26px;font-weight:bold; height:35px; padding-left:0px\">Project No.：</td>" +
							"<td style=\"text-align:left; font-size:22px;font-weight:bold; width:270px;height:35px \">"+$(this).parents("tr").children().eq(2).text()+"</td></tr>"+
					"<tr><td style=\"text-align:right; font-size:26px; font-weight:bold;height:35px; padding-left:0px;\">Bus Number：</td>"
					+"<td style=\"text-align:left; font-size:26px; font-weight:bold;width:270px;height:35px;\">"+$(this).parents("tr").children().eq(3).text()+"</td></tr>"+
					"<tr><td style=\"text-align:right; font-size:26px;font-weight:bold;height:35px;padding-left:0px\">VIN：</td>"
					+"<td style=\"text-align:left; font-size:26px;font-weight:bold ;width:270px;height:35px; \">"+$(this).parents("tr").children().eq(4).text()+"</td></tr></table>"
					+"<div id=\"bcTarget"+count+"\" style=\"width:300px; height:60px;margin-top:10px;text-align:center;margin:0 auto\"></div></div>";
				count++;
			}
		});
		if(flag==false){
			alert("请先导入VIN号在打印");
			return false;
		}
		if(printhtml==""){
			alert("请选择一条记录");
			return false;
		}
		$("#printarea").append(printhtml);
		vinList=vinList.substring(0,vinList.length-1);
		for(var i=0;i<count;i++){
			var arr=vinList.split(",");
			$("#bcTarget"+i).barcode(arr[i], "code128",{barWidth:2, barHeight:70,showHRI:false});
		}
		
		if(vinList.length==0){
			printFlag=false;
		}else
		 setTimeout(function (){
			 if(printFlag){
				 window.print();
			 }else{
				 alert("VIN为空，请先绑定车号和VIN!");
			 }
						       				
			},0);
	});
	$(document).on('change', '.selectAll',function(){
	    $('#table tbody :checkbox').prop("checked",this.checked); 
	}); 



});

function ajaxQuery(){
	
    dt=$("#tableResult").DataTable({
		serverSide: true,
		dom: 'Bfrtip',
		lengthMenu: [
		             [ 20, 50,100, -1 ],
		             [ 'Show 20 rows', 'Show 30 rows', 'Show 50 rows', 'Show all rows' ]
		         ],
	    buttons: [
	        {extend:'excelHtml5',title:'data_export',className:'black',text:'<i class=\"fa fa-file-excel-o bigger-130\" tooltip=\"导出excel\"></i>'},
	        {extend:'pageLength',/*text:'显示行'*/}
	       
	    ],
		paiging:true,
		ordering:false,
		searching: false,
		autoWidth:false,
		destroy: true,
		scrollY: $(window).height()-250,
		scrollX: $(window).width(),
		/*scrollCollapse: true,*/
		pageLength: 20,
		pagingType:"full_numbers",
		lengthChange:false,
		orderMulti:false,
		language: {
			
		},
		ajax:function (data, callback, settings) {
			var param ={
				"draw":1,
				"project_no":$("#search_project_no").val(),
				"bus_number":$("#search_bus_number").val(),
				"print_flag":$("#search_print_flag").val(),
				"plant":$("#search_plant").val()
			};
            param.length = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;//开始的记录序号
            param.page = (data.start / data.length)+1;//当前页码

            $.ajax({
                type: "post",
                url: "showBusNumberList",
                data: param,  //传入组装的参数
                dataType: "json",
                success: function (result) {
                    console.log(result);
                	//封装返回数据
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
			{"title":"<input type='checkbox' id='selectAll' onclick='selectAll()'/>","class":"center","data":"id","render": function ( data, type, row ) {
			    return "<input id='id' value='"+data+"' type='hidden' /><input type='checkbox' fid='cb_"+data+"'>";
			},"defaultContent": ""},
            {"title":"Plant","class":"center","data":"plant","defaultContent": ""},
            {"title":"Project No.","class":"center","data":"project_no","defaultContent": ""},
            {"title":"Bus No.","class":"center","data":"bus_number","defaultContent": ""},
            {"title":"VIN","class":"center","data": "VIN","defaultContent": ""},
            {"title":"Print Flag","class":"center","data":"print_flag","render":function(data, type, row){
            	return (data=="1") ? "Printed" : "Not Print";
            },"defaultContent": ""},
            {"title":"Number of Prints","class":"center","data":"print_times","defaultContent": ""},
            {"title":"Printer","class":"center","data": "username","defaultContent": ""},
            {"title":"Print Date","class":"center","data": "print_date","defaultContent": ""},
        ],
		
	});
	$("#tableResult_info").addClass('col-xs-6');
	$("#tableResult_paginate").addClass('col-xs-6');
	$(".dt-buttons").css("margin-top","-50px").find("a").css("border","0px");
}


//----------START bootstrap initTable ----------
//function initTable() {
//    $table.bootstrapTable({
//        height: getHeight(),
//        url:'showBusNumberList',
//        striped:false,
//        paginationVAlign:'bottom',
//        searchOnEnterKey:true,
//        fixedColumns: false,				//冻结列
//        fixedNumber: 0,		//冻结列数
//        queryParams:function(params) {
//        	params["plant"] = $("#search_plant").val(); 
//        	params["project_no"] = $("#search_project_no").val(); 
//        	params["bus_number"] = $("#search_bus_number").val();
//        	return params;
//        },
//        columns: [
//        [
//			{
//				field: 'id',title: "&nbsp;<input type='checkbox' class='selectAll'/>&nbsp;",align: 'center',valign: 'middle',align: 'center',
//			    sortable: false,visible: true,footerFormatter: totalTextFormatter,
//			    cellStyle:function cellStyle(value, row, index, field) {
//				return {css: {"padding-left": "3px", "padding-right": "2px","font-size":"13px"}};
//				},
//			    formatter:function(value, row, index){
//	        		return "<input type='checkbox' value='"+value+"'>";
//	        	 }
//			},
//            {
//            	field: 'factory_name',title: '&nbsp;&nbsp;Plant&nbsp;&nbsp;',align: 'center',valign: 'middle',align: 'center',
//                sortable: true,visible: true,footerFormatter: totalTextFormatter,
//                cellStyle:function cellStyle(value, row, index, field) {
//	        	return {css: {"padding-left": "3px", "padding-right": "2px","font-size":"13px"}};
//	        	}
//            },{
//            	field: 'project_no',title: '&nbsp;&nbsp;Project No.&nbsp;&nbsp;',align: 'center',valign: 'middle',align: 'center',
//                sortable: false,visible: true,footerFormatter: totalTextFormatter,
//                cellStyle:function cellStyle(value, row, index, field) {
//    	        	return {css: {"padding-left": "2px", "padding-right": "2px","font-size":"13px"}};
//    	        	}
//            },{
//            	field: 'bus_number',title: '&nbsp;&nbsp;Bus No.&nbsp;&nbsp;',align: 'center',valign: 'middle',align: 'center',
//                sortable: false,visible: true,footerFormatter: totalTextFormatter,
//                cellStyle:function cellStyle(value, row, index, field) {
//    	        	return {css: {"padding-left": "2px", "padding-right": "2px","font-size":"13px"}};
//    	        	}
//            },{
//            	field: 'vin',title: '&nbsp;&nbsp;VIN&nbsp;&nbsp;',align: 'center',valign: 'middle',align: 'center',
//                sortable: false,visible: true,footerFormatter: totalTextFormatter,
//                cellStyle:function cellStyle(value, row, index, field) {
//    	        	return {css: {"padding-left": "1px", "padding-right": "1px","font-size":"13px"}};
//    	        	},
////    	        formatter:function(value, row, index){
////    	        	var bus_number = (row.bus_number===null)?"":row.bus_number;
////	        		return "<input id='bus_number_"+index+"' class='bus_number' style='font-size: 12px;color: #333333;border:0;width:100%' value='"+bus_number+"' old_val='"+bus_number+"' vin='"+row.vin+"'>";
////	        	 }
//            },{
//            	field: 'print_flag',title: '&nbsp;&nbsp;Number of Prints&nbsp;&nbsp;',align: 'center',valign: 'middle',align: 'center',
//                sortable: false,visible: true,footerFormatter: totalTextFormatter,
//                cellStyle:function cellStyle(value, row, index, field) {
//    	        	return {css: {"padding-left": "2px", "padding-right": "2px","font-size":"13px"}};
//    	        	}
//            },{
//            	field: 'print_date',title: '&nbsp;&nbsp;Print Date&nbsp;&nbsp;',align: 'center',valign: 'middle',align: 'center',
//                sortable: false,visible: true,footerFormatter: totalTextFormatter,
//                cellStyle:function cellStyle(value, row, index, field) {
//    	        	return {css: {"padding-left": "2px", "padding-right": "2px","font-size":"13px"}};
//    	        	}
//            }
////            ,{
////            	field: 'print_sign',title: '&nbsp;打印标志&nbsp;',align: 'center',valign: 'middle',align: 'center',
////                sortable: false,visible: true,footerFormatter: totalTextFormatter,
////                cellStyle:function cellStyle(value, row, index, field) {
////    	        	return {css: {"padding-left": "1px", "padding-right": "1px","font-size":"13px"}};
////    	        	},
////	        	formatter:function(value, row, index){
////	        		return (value == "1")?"已打印":"未打印";
////	        	}
////            }
//        ]
//    ]
//    });
//    $table.on('load-success.bs.table',function(){
//    	$("#btnQuery").removeAttr("disabled");
//    });
//    $table.on('page-change.bs.table',function(){
//    	$("#btnQuery").attr("disabled","disabled");
//    });
//    $(window).resize(function () {
//        $table.bootstrapTable('resetView', {height: getHeight()});
//    });
//    function getHeight() {return $(window).height()-45;}
//    function getWidth() {return $(window).width()-220;}
//}
////----------END bootstrap initTable ----------
//
////----------START Bootstrap Script ----------
//var scripts = [
//        '../js/bootstrap-table.js','../js/bootstrap-table-fixed-columns.js',
//        '../js/bootstrap-table-export.js','../js/tableExport.js',
//        '../js/bootstrap-table-editable.js','../js/bootstrap-editable.js'
//    ],
//    eachSeries = function (arr, iterator, callback) {
//    	//console.log("---->arr.length=" + arr.length);
//        callback = callback || function () {};
//        if (!arr.length) {return callback();}
//        var completed = 0;
//        var iterate = function () {
//            iterator(arr[completed], function (err) {
//                if (err) {callback(err);callback = function () {};}
//                else {completed += 1;if (completed >= arr.length) {callback(null);}else {iterate();}}
//            });
//        };
//        iterate();
//    };
//    function getIdSelections() {
//        return $.map($table.bootstrapTable('getSelections'), function (row) {return row.id});
//    }
//    function responseHandler(res) {
//        $.each(res.rows, function (i, row) {row.state = $.inArray(row.id, selections) !== -1;});return res;
//    }
//    function detailFormatter(index, row) {
//        var html = [];
//        $.each(row, function (key, value) {html.push('<p><b>' + key + ':</b> ' + value + '</p>');});
//        return html.join('');
//    }
//    function operateFormatter(value, row, index) {
//        return ['<a class="remove" href="javascript:void(0)" title="Remove">','<i class="glyphicon glyphicon-remove"></i>','</a>'].join('');
//    }
//    window.operateEvents = {
//        'click .like': function (e, value, row, index) {alert('You click like action, row: ' + JSON.stringify(row));},
//        'click .remove': function (e, value, row, index) {ajaxDel(row.id);}
//    };
//    function totalTextFormatter(data) {return 'Total';}
//    function totalNameFormatter(data) {return data.length;}
//    function totalPriceFormatter(data) {
//        var total = 0;
//        $.each(data, function (i, row) {total += +(row.price.substring(1));});
//        return '$' + total;
//    }
//    function getScript(url, callback) {
//        var head = document.getElementsByTagName('head')[0];
//        var script = document.createElement('script');
//        script.src = url;
//        var done = false;
//        script.onload = script.onreadystatechange = function() {
//            if (!done && (!this.readyState ||this.readyState == 'loaded' || this.readyState == 'complete')) {
//                done = true;
//                if (callback)
//                	callback();
//                	script.onload = script.onreadystatechange = null;
//            }
//        };
//        head.appendChild(script);
//        return undefined;
//    } 
  //复选框全选或反选
//    function selectAll() {
//    	//alert($("#selectAll").prop("checked"));
//        if ( $("#table thead tr").find("#selectAll").prop("checked")) {
//            $("#table tbody :checkbox").prop("checked", true);
//        } else {
//            $("#table tbody :checkbox").prop("checked", false);
//        }
//    }
    
  //复选框全选或反选
function selectAll() {
    if ($("#selectAll").prop("checked")) {
        $(":checkbox").prop("checked", true);
    } else {
        $(":checkbox").prop("checked", false);
    }
}