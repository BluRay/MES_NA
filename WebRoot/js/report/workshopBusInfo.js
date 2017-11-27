$(document).ready(function(){
	
	initPage();

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/MES/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	});
	$(document).on("change","#search_index",function(){
		var now = new Date(); 				//当前日期
		var nowDayOfWeek = now.getDay(); 	//今天本周的第几天 
		if($(this).val() == "0"){
			$("#start_date").val(formatDate(now));
			$("#end_date").val(formatDate(now));
		}else if($(this).val() == "1"){

			var startDate=new Date(now.getTime()-(nowDayOfWeek-1)*24*3600*1000);

			$("#start_date").val(formatDate(startDate));
			$("#end_date").val(formatDate(now));
		}else if($(this).val() == "2"){
			$("#start_date").val(ChangeDateToString(now).substring(0,7) + "-01");
			$("#end_date").val(formatDate(now));
		}
//    	$(".fixed-table-body-columns").css("top","35px");
	});
	$("#btnQuery").click(function(){
		
		if($.fn.dataTable.isDataTable("#tableResult")){
			$('#tableResult').DataTable().destroy();
			$('#tableResult').empty();
		}
		$("#tableResult").DataTable({
			serverSide: true,
			rowsGroup:[0,1],
			dom: 'Bfrtip',
		    buttons: [
		        {extend:'excelHtml5',title:'workshop_bus_info',className:'black',text:'<i class=\"fa fa-file-excel-o bigger-130\" tooltip=\"Export Excel\"></i>'},
		    ],
		    paginate:false,
			paiging:false,
			ordering:false,
			searching: false,
			bAutoWidth:false,
			destroy: true,
			sScrollY: $(window).height()-220,
			scrollX: true,
			pagingType:"full_numbers",
			lengthChange:true,
			info:false,
			orderMulti:false,
			aoColumnDefs : [
                {
                    "aTargets" :[1],
                    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) { 
                    	if($(nTd).text()=='H-Zone'){
                    		$(nTd).parent().css('color', '#ff0000');
                    	}
    	             }   
                }
            ],
            
			ajax:function (data, callback, settings) {
				var param ={
					"plant":$("#search_factory :selected").text(),
					"current":$("#start_date").val()
				};

	            $.ajax({
	                type: "post",
	                url: "getWorkshopBusInfoData",
	                cache: false,  //禁用缓存
	                data: param,  //传入组装的参数
	                dataType: "json",
	                success: function (result) {
	                	//封装返回数据
	                	var returnData = {};
	                    returnData.data = result.data;//返回的数据列表
	                    callback(returnData);
	                }
	            });
			},
			columns: [
                {"title":"Plant","class":"center","width":"80","data":"plant","defaultContent": ""},
	            {"title":"Workshop","class":"center","data":"workshop","defaultContent": ""},
	            {"title":"Station","class":"center","data":"station","defaultContent": ""},
	            {"title":nextdate(new Date($("#start_date").val()),6),"class":"center","data":"prev_six","defaultContent": ""},
	            {"title":nextdate(new Date($("#start_date").val()),5),"class":"center","data":"prev_five","defaultContent": ""},
	            {"title":nextdate(new Date($("#start_date").val()),4),"class":"center","data":"prev_four","defaultContent": ""},
	            {"title":nextdate(new Date($("#start_date").val()),3),"class":"center","data":"prev_three","defaultContent": ""},
	            {"title":nextdate(new Date($("#start_date").val()),2),"class":"center","data":"prev_two","defaultContent": ""},
	            {"title":nextdate(new Date($("#start_date").val()),1),"class":"center","data":"prev_one","defaultContent": ""},
	            {"title":nextdate(new Date($("#start_date").val()),0),"class":"center","data":"current","defaultContent": ""},
	         ]
		});
		$(".dt-buttons").css("margin-top","-50px").find("a").css("border","0px");
	});
})

function initPage(){
	getBusNumberSelect('#nav-search-input');
	//$("#search_date").val(formatDate());
	getFactorySelect("report/onlineAndOfflineReport",'',"#search_factory",null,'id');
	var now = new Date(); //当前日期
	//var startDate=new Date(now.getTime()-6*24*3600*1000);
	$("#search_index").val("0");
	$("#start_date").val(formatDate(now));
	$("#end_date").val(formatDate(now));
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
function nextdate(date,val){ 
	var b = date.getDate(); 
	b =b - val; 
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
