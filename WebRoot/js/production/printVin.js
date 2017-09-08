$(document).ready(function () {	
	initPage();
	function initPage(){
		getBusNumberSelect('#search_bus_number');
		getBusNumberSelect('#nav-search-input');
		getOrderNoSelect("#search_order_no","#orderId");
		getFactorySelect("production/printVin",'',"#search_factory","全部",'id');
//		getFactorySelect("production/printVin",'',"#vin_factory",null,'id');
	};

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/BMS/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})
	
	$("#btnQuery").click (function () {
		eachSeries(scripts, getScript, initTable);
		ajaxQuery();
		return false;
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
		$("#table tbody :checkbox").each(function(){
			
			if($(this).prop("checked")){
				if($(this).parents("tr").children().eq(3).text()==''){
					alert("请先绑定VIN号在打印");
					return false;
				}
				vinList+=$(this).parents("tr").children().eq(3).text()+",";
				printhtml+="<div class=\"printConfigure printable toPrint\" style=\"padding-top:10px;padding-bottom:10px;line-height:40px;\" ><table border=0>"
					+"<tr ><td style=\"text-align:right; font-size:26px;font-weight:bold; height:35px; padding-left:0px\">订单：</td>" +
							"<td style=\"text-align:left; font-size:22px;font-weight:bold; width:270px;height:35px \">"+$(this).parents("tr").children().eq(2).text()+"</td></tr>"+
					"<tr><td style=\"text-align:right; font-size:26px; font-weight:bold;height:35px; padding-left:0px;\">车号：</td>"
					+"<td style=\"text-align:left; font-size:26px; font-weight:bold;width:270px;height:35px;\">"+$(this).parents("tr").children().eq(6).text()+"</td></tr>"+
					"<tr><td style=\"text-align:right; font-size:26px;font-weight:bold;height:35px;padding-left:0px\">VIN：</td>"
					+"<td style=\"text-align:left; font-size:26px;font-weight:bold ;width:270px;height:35px; \">"+$(this).parents("tr").children().eq(3).text()+"</td></tr></table>"
					+"<div id=\"bcTarget"+count+"\" style=\"width:300px; height:60px;margin-top:10px;text-align:center;margin:0 auto\"></div></div>";
				count++;
			}
			
		});
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
	$table.bootstrapTable('refresh', {url: '../plan/showPlanVinList'});
}


//----------START bootstrap initTable ----------
function initTable() {
    $table.bootstrapTable({
        height: getHeight(),
        url:'../plan/showPlanVinList',
        striped:false,
        paginationVAlign:'bottom',
        searchOnEnterKey:true,
        fixedColumns: false,				//冻结列
        fixedNumber: 0,		//冻结列数
        queryParams:function(params) {
        	params["factory_id"] = $("#search_factory").val(); 
        	params["order_no"] = $("#search_order_no").val(); 
        	params["bus_vin"] = $("#search_bus_vin").val(); 
        	params["bus_number"] = $("#search_bus_number").val();
        	return params;
        },
        columns: [
        [
			{
				field: 'id',title: "&nbsp;<input type='checkbox' class='selectAll'/>&nbsp;",align: 'center',valign: 'middle',align: 'center',
			    sortable: false,visible: true,footerFormatter: totalTextFormatter,
			    cellStyle:function cellStyle(value, row, index, field) {
				return {css: {"padding-left": "3px", "padding-right": "2px","font-size":"13px"}};
				},
			    formatter:function(value, row, index){
	        		return "<input type='checkbox' value='"+value+"'>";
	        	 }
			},
            {
            	field: 'factory_name',title: '&nbsp;&nbsp;生产工厂&nbsp;&nbsp;',align: 'center',valign: 'middle',align: 'center',
                sortable: true,visible: true,footerFormatter: totalTextFormatter,
                cellStyle:function cellStyle(value, row, index, field) {
	        	return {css: {"padding-left": "3px", "padding-right": "2px","font-size":"13px"}};
	        	}
            },{
            	field: 'order_no',title: '&nbsp;&nbsp;生产订单&nbsp;&nbsp;',align: 'center',valign: 'middle',align: 'center',
                sortable: false,visible: true,footerFormatter: totalTextFormatter,
                cellStyle:function cellStyle(value, row, index, field) {
    	        	return {css: {"padding-left": "2px", "padding-right": "2px","font-size":"13px"}};
    	        	}
            },{
            	field: 'vin',title: '&nbsp;&nbsp;VIN号&nbsp;&nbsp;',align: 'center',valign: 'middle',align: 'center',
                sortable: false,visible: true,footerFormatter: totalTextFormatter,
                cellStyle:function cellStyle(value, row, index, field) {
    	        	return {css: {"padding-left": "2px", "padding-right": "2px","font-size":"13px"}};
    	        	}
            },{
            	field: 'left_motor_number',title: '&nbsp;左电机号&nbsp;',align: 'center',valign: 'middle',align: 'center',
                sortable: false,visible: true,footerFormatter: totalTextFormatter,
                cellStyle:function cellStyle(value, row, index, field) {
    	        	return {css: {"padding-left": "1px", "padding-right": "1px","font-size":"13px"}};
    	        	},
//    	        formatter:function(value, row, index){
//    	        	var left_motor_number = (row.left_motor_number===null)?"":row.left_motor_number;
//	        		return "<input id='left_motor_"+index+"' class='left_motor' style='font-size: 12px;color: #333333;border:0;width:100%' value='"+left_motor_number+"' old_val='"+left_motor_number+"' vin='"+row.vin+"'>";
//	        	 }
            },{
            	field: 'right_motor_number',title: '&nbsp;右电机号&nbsp;',align: 'center',valign: 'middle',align: 'center',
                sortable: false,visible: true,footerFormatter: totalTextFormatter,
                cellStyle:function cellStyle(value, row, index, field) {
    	        	return {css: {"padding-left": "1px", "padding-right": "1px","font-size":"13px"}};
    	        	},
//    	        formatter:function(value, row, index){
//    	        	var right_motor_number = (row.right_motor_number===null)?"":row.right_motor_number;
//	        		return "<input id='right_motor_"+index+"' class='right_motor' style='font-size: 12px;color: #333333;border:0;width:100%' value='"+right_motor_number+"' old_val='"+right_motor_number+"' vin='"+row.vin+"'>";
//	        	 }
            },{
            	field: 'bus_number',title: '&nbsp;&nbsp;车号&nbsp;&nbsp;',align: 'center',valign: 'middle',align: 'center',
                sortable: false,visible: true,footerFormatter: totalTextFormatter,
                cellStyle:function cellStyle(value, row, index, field) {
    	        	return {css: {"padding-left": "1px", "padding-right": "1px","font-size":"13px"}};
    	        	},
//    	        formatter:function(value, row, index){
//    	        	var bus_number = (row.bus_number===null)?"":row.bus_number;
//	        		return "<input id='bus_number_"+index+"' class='bus_number' style='font-size: 12px;color: #333333;border:0;width:100%' value='"+bus_number+"' old_val='"+bus_number+"' vin='"+row.vin+"'>";
//	        	 }
            },{
            	field: 'creator_name',title: '&nbsp;&nbsp;生成者&nbsp;&nbsp;',align: 'center',valign: 'middle',align: 'center',
                sortable: false,visible: true,footerFormatter: totalTextFormatter,
                cellStyle:function cellStyle(value, row, index, field) {
    	        	return {css: {"padding-left": "2px", "padding-right": "2px","font-size":"13px"}};
    	        	}
            },{
            	field: 'creat_date',title: '&nbsp;&nbsp;生成日期&nbsp;&nbsp;',align: 'center',valign: 'middle',align: 'center',
                sortable: false,visible: true,footerFormatter: totalTextFormatter,
                cellStyle:function cellStyle(value, row, index, field) {
    	        	return {css: {"padding-left": "2px", "padding-right": "2px","font-size":"13px"}};
    	        	}
            },{
            	field: 'print_sign',title: '&nbsp;打印标志&nbsp;',align: 'center',valign: 'middle',align: 'center',
                sortable: false,visible: true,footerFormatter: totalTextFormatter,
                cellStyle:function cellStyle(value, row, index, field) {
    	        	return {css: {"padding-left": "1px", "padding-right": "1px","font-size":"13px"}};
    	        	},
	        	formatter:function(value, row, index){
	        		return (value == "1")?"已打印":"未打印";
	        	}
            }
        ]
    ]
    });
    $table.on('load-success.bs.table',function(){
    	$("#btnQuery").removeAttr("disabled");
    });
    $table.on('page-change.bs.table',function(){
    	$("#btnQuery").attr("disabled","disabled");
    });
    $(window).resize(function () {
        $table.bootstrapTable('resetView', {height: getHeight()});
    });
    function getHeight() {return $(window).height()-45;}
    function getWidth() {return $(window).width()-220;}
}
//----------END bootstrap initTable ----------

//----------START Bootstrap Script ----------
var scripts = [
        '../js/bootstrap-table.js','../js/bootstrap-table-fixed-columns.js',
        '../js/bootstrap-table-export.js','../js/tableExport.js',
        '../js/bootstrap-table-editable.js','../js/bootstrap-editable.js'
    ],
    eachSeries = function (arr, iterator, callback) {
    	//console.log("---->arr.length=" + arr.length);
        callback = callback || function () {};
        if (!arr.length) {return callback();}
        var completed = 0;
        var iterate = function () {
            iterator(arr[completed], function (err) {
                if (err) {callback(err);callback = function () {};}
                else {completed += 1;if (completed >= arr.length) {callback(null);}else {iterate();}}
            });
        };
        iterate();
    };
    function getIdSelections() {
        return $.map($table.bootstrapTable('getSelections'), function (row) {return row.id});
    }
    function responseHandler(res) {
        $.each(res.rows, function (i, row) {row.state = $.inArray(row.id, selections) !== -1;});return res;
    }
    function detailFormatter(index, row) {
        var html = [];
        $.each(row, function (key, value) {html.push('<p><b>' + key + ':</b> ' + value + '</p>');});
        return html.join('');
    }
    function operateFormatter(value, row, index) {
        return ['<a class="remove" href="javascript:void(0)" title="Remove">','<i class="glyphicon glyphicon-remove"></i>','</a>'].join('');
    }
    window.operateEvents = {
        'click .like': function (e, value, row, index) {alert('You click like action, row: ' + JSON.stringify(row));},
        'click .remove': function (e, value, row, index) {ajaxDel(row.id);}
    };
    function totalTextFormatter(data) {return 'Total';}
    function totalNameFormatter(data) {return data.length;}
    function totalPriceFormatter(data) {
        var total = 0;
        $.each(data, function (i, row) {total += +(row.price.substring(1));});
        return '$' + total;
    }
    function getScript(url, callback) {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.src = url;
        var done = false;
        script.onload = script.onreadystatechange = function() {
            if (!done && (!this.readyState ||this.readyState == 'loaded' || this.readyState == 'complete')) {
                done = true;
                if (callback)
                	callback();
                	script.onload = script.onreadystatechange = null;
            }
        };
        head.appendChild(script);
        return undefined;
    } 
  //复选框全选或反选
//    function selectAll() {
//    	//alert($("#selectAll").prop("checked"));
//        if ( $("#table thead tr").find("#selectAll").prop("checked")) {
//            $("#table tbody :checkbox").prop("checked", true);
//        } else {
//            $("#table tbody :checkbox").prop("checked", false);
//        }
//    }