var searchDateArray="";
var dateArray = new Array(31);
var dateCount = 0;
var factoryids = "";
$(document).ready(function(){
	initPage();
	
	function initPage(){
		getBusNumberSelect('#nav-search-input');
		getFactorySelect("report/factoryOutputReport",'',"#search_factory","全部",'id');
		var now = new Date(); //当前日期
		//var startDate=new Date(now.getTime()-6*24*3600*1000);
		$("#search_index").val("0");
		$("#start_date").val(formatDate(now));
		$("#end_date").val(formatDate(now));
	}

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/BMS/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})
	
	$(document).on("change","#search_index",function(){
		var now = new Date(); 				//当前日期
		var nowDayOfWeek = now.getDay(); 	//今天本周的第几天 
		if($(this).val() == "0"){
			$("#start_date").val(formatDate(now));
			$("#end_date").val(formatDate(now));
		}else if($(this).val() == "1"){
			var startDate=new Date(now.getTime()-nowDayOfWeek*24*3600*1000);
			$("#start_date").val(formatDate(startDate));
			$("#end_date").val(formatDate(now));
		}else if($(this).val() == "2"){
			$("#start_date").val(ChangeDateToString(now).substring(0,7) + "-01");
			$("#end_date").val(formatDate(now));
		}

    	$(".fixed-table-body-columns").css("top","35px");
	});
	
	$("#btnQuery").click (function () {
		dateArray = new Array(31);
		if($("#start_date").val()==""){
			alert("请选择生产开始日期！");
			$("#start_date").focus();
			return false;
		}
		if($("#end_date").val()==""){
			alert("请选择生产结束日期！");
			$("#end_date").focus();
			return false;
		}
		var start_date = StringToDate($('#start_date').val());
		var end_date = StringToDate($('#end_date').val());
		dateCount = DateDiff('d',start_date,end_date);
		if(dateCount<0||dateCount>30){
			alert("请输入正确的日期区间，最长不能超过31天！");
			return false;
		}
		searchDateArray="";
		for(var i=0;i<=dateCount;i++){
			searchDateArray += ChangeDateToString(start_date) + ',';
			//$("#D"+(i+1)).html(start_date.getDate());
			dateArray[i] = ChangeDateToString(start_date);
			start_date = StringToDate(nextdate(start_date));
		}
		//factoryid_array
		factoryids = $("#search_factory").val();
		if(factoryids==""){
			$("#search_factory option").each(function() {
				var op = $(this).val();
				if(op!="") factoryids += (op + ",");
			});
		}
		console.log('-->dateArray = ',dateArray);
		eachSeries(scripts, getScript, initTable);
		ajaxQuery();
	});
	
});

function ajaxQuery(){
	$("#btnQuery").prop("disabled","disabled");
	$("#btnQuery").val("查询中...");
	$table.bootstrapTable('destroy');
	$table.bootstrapTable('refresh', {url: 'showFactoryOutputReportData'});
}

function StringToDate(DateStr){     
    var converted = Date.parse(DateStr);  
    var myDate = new Date(converted);  
    if (isNaN(myDate))  
    {
        var arys= DateStr.split('-');  
        myDate = new Date(arys[0],--arys[1],arys[2]);  
    }  
    return myDate;  
}  
function DateDiff(strInterval,dtStart,dtEnd){
	switch (strInterval) {   
    case 's' :return parseInt((dtEnd - dtStart) / 1000);  
    case 'n' :return parseInt((dtEnd - dtStart) / 60000);  
    case 'h' :return parseInt((dtEnd - dtStart) / 3600000);  
    case 'd' :return parseInt((dtEnd - dtStart) / 86400000);  
    case 'w' :return parseInt((dtEnd - dtStart) / (86400000 * 7));  
    case 'm' :return (dtEnd.getMonth()+1)+((dtEnd.getFullYear()-dtStart.getFullYear())*12) - (dtStart.getMonth()+1);  
    case 'y' :return dtEnd.getFullYear() - dtStart.getFullYear();  
	}
}
function nextdate(date){ 
	var b = date.getDate(); 
	b += 1; 
	date.setDate(b); 
	var year = date.getFullYear(); //取得当前年份命令 
	var month = date.getMonth()+1; 
	var day = date.getDate(); 
	if(month < 10){ month ='0'+ month ; } 
	if(day < 10){ day ='0'+ day ; } 
	return year+ "-"+ month+"-"+day ; 
} 
function ChangeDateToString(DateIn){
	var Year = 0;
	var Month = 0;
	var Day = 0;
	var CurrentDate = "";
	// 初始化时间
	Year = DateIn.getFullYear();
	Month = DateIn.getMonth() + 1;
	Day = DateIn.getDate();
	CurrentDate = Year + "-";
	if (Month >= 10){
		CurrentDate = CurrentDate + Month + "-";
	}else {
		CurrentDate = CurrentDate + "0" + Month + "-";
	}
	if (Day >= 10) {
		CurrentDate = CurrentDate + Day;
	} else {
		CurrentDate = CurrentDate + "0" + Day;
	}
	return CurrentDate;
}


//----------START bootstrap initTable ----------
function initTable() {
	console.log('---->dateCount = ',dateCount);
	var columnsArray = new Array(dateCount + 4);
	
	columnsArray[0] = {
        	field: 'factory_name',title: '工厂',align: 'center',valign: 'middle',align: 'center',width:"100px",
            sortable: false,visible: true,footerFormatter: totalTextFormatter,
            cellStyle:function cellStyle(value, row, index, field) {
            	if(row.WORKSHOP == "汇总"){
            		return {css: {"background-color":"darkcyan","padding-left": "3px", "padding-right": "2px","font-size":"13px"}};
            	}else{
            		return {css: {"padding-left": "3px", "padding-right": "2px"}};
            	}
        	}
        };
	columnsArray[1] = {
        	field: 'WORKSHOP',title: '车间',align: 'center',valign: 'middle',align: 'center',width:"100px",
            sortable: false,visible: true,footerFormatter: totalTextFormatter,
            cellStyle:function cellStyle(value, row, index, field) {
            	if(row.WORKSHOP == "汇总"){
            		return {css: {"background-color":"darkcyan","padding-left": "3px", "padding-right": "2px","font-size":"13px"}};
            	}else{
            		return {css: {"padding-left": "3px", "padding-right": "2px"}};
            	}
            }
        };
	columnsArray[2] = {
        	field: 'SUM',title: '合计',align: 'center',valign: 'middle',align: 'center',width:"100px",
            sortable: false,visible: true,footerFormatter: totalTextFormatter,
            cellStyle:function cellStyle(value, row, index, field) {
            	if(row.WORKSHOP == "汇总"){
            		return {css: {"background-color":"darkcyan","padding-left": "3px", "padding-right": "2px","font-size":"13px"}};
            	}else{
            		return {css: {"padding-left": "3px", "padding-right": "2px"}};
            	}
            }
        };
	for(i=0;i<=dateCount;i++){
		columnsArray[i+3] = {
	        	field: dateArray[i],title: dateArray[i],align: 'center',valign: 'middle',align: 'center',width:"100px",
	            sortable: false,visible: true,footerFormatter: totalTextFormatter,
	            cellStyle:function cellStyle(value, row, index, field) {
	            	if(row.WORKSHOP == "汇总"){
	            		return {css: {"background-color":"darkcyan","padding-left": "3px", "padding-right": "2px","font-size":"13px"}};
	            	}else{
	            		return {css: {"padding-left": "3px", "padding-right": "2px"}};
	            	}
	            }
	        };
	}
	columnsArray[dateCount+4] = {
        	field: 'MEMO',title: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;备注&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',align: 'center',valign: 'middle',align: 'center',
            sortable: false,visible: true,footerFormatter: totalTextFormatter,width:"200px",
            cellStyle:function cellStyle(value, row, index, field) {
            	if(row.WORKSHOP == "汇总"){
            		return {css: {"background-color":"darkcyan","padding-left": "3px", "padding-right": "2px","font-size":"13px"}};
            	}else{
            		return {css: {"padding-left": "3px", "padding-right": "2px"}};
            	}
            },
        	formatter:function(value, row, index){
        		if (value != undefined){
        			if(value.length >10){
        				return "<span title="+value+" >" + value.substring(0,8) + "...</span>";
        			}else{
        				return value;
        			}
        		}
        	}
        };
	
    $table.bootstrapTable({
        height: getHeight(),
        //width:800+dateCount*60,
        url:'showFactoryOutputReportData',
        striped:true,
        paginationVAlign:'none',
        searchOnEnterKey:true,
        fixedColumns: (dateCount > 7)?true:false,
        fixedNumber: 3,
        onLoadSuccess: function (data) {
        	$("#btnQuery").removeAttr("disabled");
        	$("#btnQuery").val("查询");
        },
        onResetView: function (data) {
        	$(".fixed-table-body-columns").css("top","35px");
        },
        queryParams:function(params) {
        	
        	params["factory_id"] = factoryids;
        	params["date_array"] = searchDateArray;
        	params["draw"] = 1;
        	return params;
        	return params;
        },
        columns: columnsArray
    });
    
    $table.on('load-success.bs.table',function(){
    	$("#btnQuery").removeAttr("disabled");
    });
    $table.on('page-change.bs.table',function(){
    	$("#btnQuery").prop("disabled","disabled");
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
