$(document).ready(function () {	
	initPage();
	function initPage(){
		getBusNumberSelect('#search_bus_number');
		getBusNumberSelect('#nav-search-input');
		$("#divBulkAdd").hide();
		getOrderNoSelect("#search_order_no","#orderId");
		getFactorySelect("plan/generateVin",'',"#search_factory","全部",'id');
		//getFactorySelect("plan/generateVin",'',"#vin_factory",null,'id');
		//生成工厂取全部
		getAllFactorySelect();
		$("#btnPrint").attr("disabled","disabled"); 
	};

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/BMS/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})
	
	function getAllFactorySelect(){
		$.ajax({
			url : "/BMS/common/getAllFactorySelect",
			dataType : "json",
			data : {},
			async : false,
			error : function(response) {
				alert(response.message)
			},
			success : function(response) {
				getSelects(response.data,"","#vin_factory",null, "id");	
			}
		});
	}
	
	$("#btnQuery").click (function () {
		$("#divBulkAdd").hide();
		eachSeries(scripts, getScript, initTable);
		ajaxQuery();
		return false;
	});
	
	$("#btnImport").click (function () {
		$("#divBulkAdd").show();
	});
	
	$("#btnBulkHide").click (function () {
		$("#divBulkAdd").hide();
	});
	
	$("#btn_upload").click (function () {
		$("#uploadMasterPlanForm").ajaxSubmit({
			url:"uploadVin",
			type: "post",
			dataType:"json",
			success:function(response){
				if(response.success){
					$.gritter.add({
						title: '系统提示：',
						text: '<h5>导入成功</h5>',
						class_name: 'gritter-success'
					});
				}else{
					$.gritter.add({
						title: '系统提示：',
						text: '<h5>'+response.message+'</h5>',
						class_name: 'gritter-error'
					});
				}
				ajaxQuery();
			}			
		});
	});
	
	$('#new_area').change(function(){
		$('#new_vinPrefix').val("");
		$("#new_WMI_extension").val("");
		$.ajax({
			url : "getVinPrefix",
			dataType : "json",
			data : {"order_no":$('#new_order_no').val(),"area":$("#new_area :selected").attr('keyvalue')},
			async : false,
			error : function(response) {},
			success : function(response) {
				if(response.data.VIN_prefix == null){
					$('#new_vinPrefix').val("没有配置VIN规则");
					$("#new_WMI_extension").val("");
				}else{
					$('#new_vinPrefix').val(response.data.VIN_prefix);
					$("#new_WMI_extension").val(response.data.WMI_extension);
				}
			}
		});
	});
	
	$("#btnGenVin").click (function () {
		if($("#search_factory").val()==""){
			alert("请选择工厂！");
			return false;
		}else if($("#search_order_no").val()==""){
			alert("生成VIN号请先输入订单编号！");
			return false;
		}
		$("#new_order_no").val($('#search_order_no').val());
		getKeysSelect("ORDER_AREA", "", "#new_area",null,"value");
		$('#new_vinPrefix').val("");$("#new_WMI_extension").val("");
		$.ajax({
			url : "getVinPrefix",
			dataType : "json",
			data : {"order_no":$('#new_order_no').val(),"area":$("#new_area :selected").attr('keyvalue')},
			async : false,
			error : function(response) {},
			success : function(response) {
				if(response.data.VIN_prefix == null){
					$('#new_vinPrefix').val("没有配置VIN规则");
					$("#new_WMI_extension").val("");
				}else{
					$('#new_vinPrefix').val(response.data.VIN_prefix);
					$("#new_WMI_extension").val(response.data.WMI_extension);
				}
			}
		});
		
		$("#dialog-new").removeClass('hide').dialog({
			resizable: false,
			title: '<div class="widget-header"><h4 class="smaller"><i class="ace-icon fa fa-flag green"></i> 生成VIN号</h4></div>',
			title_html: true,
			width:'550px',
			modal: true,
			buttons: [{
						text: "取消",
						"class" : "btn btn-minier",
						click: function() {$( this ).dialog( "close" );} 
					},
					{
						text: "生成",
						id:"btnAddConfirm",
						"class" : "btn btn-success btn-minier",
						click: function() {
							btnAddConfirm();
						} 
					}
				]
		});
		
	});
	
	function btnAddConfirm(){
		//TODO 权限校验
		if($("#new_vinPrefix").val()==""){
			alert('请先维护VIN前8位规则！');
			return false;
		}
		if($("#new_vinCount").val()==""){
			alert('生成数量不能为空！');
			return false;
		}
		if(isNaN($("#new_vinCount").val())){
			alert('生成数量须为数字！');
			return false;
		}
		$("#btnAddConfirm").attr("disabled","disabled");
		
		$.ajax({
			url : "getGenerateVin",
			dataType : "json",
			data : {
				"factory_id":$('#search_factory').val(),
	    		"vin_factory_id": $('#vin_factory').val(),
				"order_no":$('#new_order_no').val(),
				"vinCount":$('#new_vinCount').val(),
				"year":$('#new_year').val(),
				"vin_prefix":$('#new_vinPrefix').val(),
				"WMI_extension":$('#new_WMI_extension').val()
			},
			async : false,
			error : function(response) {},
			success : function(response) {
				$.gritter.add({
					title: '系统提示：',
					text: '<h5>'+response.data.message+'</h5>',
					class_name: 'gritter-info'
				});
				$("#dialog-new").dialog("close");
				ajaxQuery();
			}
		});
		
	}
	
	$("body").on("change",".left_motor",function(e){
		if(confirm("是否确定修改？")){
			var vin = $(this).attr("vin")
			var update_val=$(this).val();
			ajaxUpdateVinMotor(vin,update_val,"left_motor",e);
		}else{
			$(this).val($(this).attr("old_val"))
		}
	});
	$("body").on("change",".right_motor",function(e){
		if(confirm("是否确定修改？")){
			var vin = $(this).attr("vin")
			var update_val=$(this).val();
			ajaxUpdateVinMotor(vin,update_val,"right_motor",e);
		}else{
			$(this).val($(this).attr("old_val"))
		}
	});
	$("body").on("change",".bus_number",function(e){
		if(confirm("是否确定修改？")){
			var vin = $(this).attr("vin")
			var update_val=$(this).val();
			console.log(update_val + "|" + $(this).attr("old_val"));
			if($(this).attr("old_val") !== ""){
				if(update_val !==""){
					alert("如需修改车号，请先删除原车号，保存后再录入新车号绑定！");
					$(this).val($(this).attr("old_val"))
					return false;
				}
			}
			ajaxUpdateVinMotor(vin,update_val,"bus_number",e);
		}else{
			$(this).val($(this).attr("old_val"))
		}
	});
	
});

function ajaxUpdateVinMotor(vin,update_val,update,e){
	var e_id=$(e.target).attr("id");
	$.ajax({
		url : "BingingVinMotor",
		dataType : "json",
		data : {"vin":vin,"update_val":update_val,"update":update},
		async : false,
		error : function(response) {},
		success : function(response) {
			if(response.message == '-1'){
				$.gritter.add({
					title: '系统提示：',
					text: '<h5>绑定失败，此车号的订单与VIN号的订单不配置或已经被绑定！</h5>',
					class_name: 'gritter-error'
				});
				$("#"+e_id).val($("#"+e_id).attr("old_val"));
			}else if(response.message == '-2'){
				$.gritter.add({
					title: '系统提示：',
					text: '<h5>绑定失败，此号码已经被绑定！</h5>',
					class_name: 'gritter-error'
				});
				$("#"+e_id).val($("#"+e_id).attr("old_val"));
			}else{
				$.gritter.add({
					title: '系统提示：',
					text: '<h5>操作成功！</h5>',
					class_name: 'gritter-info'
				});
			}
			ajaxQuery();
		}
	});
}

function ajaxQuery(){
	$table.bootstrapTable('refresh', {url: 'showPlanVinList'});
}


//----------START bootstrap initTable ----------
function initTable() {
    $table.bootstrapTable({
        height: getHeight(),
        url:'showPlanVinList',
        striped:true,
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
    	        formatter:function(value, row, index){
    	        	var left_motor_number = (row.left_motor_number===null)?"":row.left_motor_number;
	        		return "<span style='display:none'>"+left_motor_number+"</span><input id='left_motor_"+index+"' class='left_motor' style='font-size: 12px;color: #333333;border:0;width:100%' value='"+left_motor_number+"' old_val='"+left_motor_number+"' vin='"+row.vin+"'>";
	        	 }
            },{
            	field: 'right_motor_number',title: '&nbsp;右电机号&nbsp;',align: 'center',valign: 'middle',align: 'center',
                sortable: false,visible: true,footerFormatter: totalTextFormatter,
                cellStyle:function cellStyle(value, row, index, field) {
    	        	return {css: {"padding-left": "1px", "padding-right": "1px","font-size":"13px"}};
    	        	},
    	        formatter:function(value, row, index){
    	        	var right_motor_number = (row.right_motor_number===null)?"":row.right_motor_number;
	        		return "<span style='display:none'>"+right_motor_number+"</span><input id='right_motor_"+index+"' class='right_motor' style='font-size: 12px;color: #333333;border:0;width:100%' value='"+right_motor_number+"' old_val='"+right_motor_number+"' vin='"+row.vin+"'>";
	        	 }
            },{
            	field: 'bus_number',title: '&nbsp;&nbsp;车号&nbsp;&nbsp;',align: 'center',valign: 'middle',align: 'center',
                sortable: false,visible: true,footerFormatter: totalTextFormatter,
                cellStyle:function cellStyle(value, row, index, field) {
    	        	return {css: {"padding-left": "1px", "padding-right": "1px","font-size":"13px"}};
    	        	},
    	        formatter:function(value, row, index){
    	        	var bus_number = (row.bus_number===null)?"":row.bus_number;
	        		return "<span style='display:none'>"+bus_number+"</span><input id='bus_number_"+index+"' class='bus_number' style='font-size: 12px;color: #333333;border:0;width:100%' value='"+bus_number+"' old_val='"+bus_number+"' vin='"+row.vin+"'>";
	        	 }
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