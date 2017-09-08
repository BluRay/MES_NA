$(document).ready(function(){
	
	initPage();

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/BMS/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
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
			fixedColumns:   {
	            leftColumns: 2,
	            rightColumns:2
	        },
			dom: 'Bfrtip',
		    buttons: [
		        {extend:'excelHtml5',title:'data_export',className:'black',text:'<i class=\"fa fa-file-excel-o bigger-130\" tooltip=\"导出excel\"></i>'},
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
			language: {
				emptyTable:"抱歉，未查询到数据！",
				zeroRecords:"抱歉，未查询到数据！",
				loadingRecords:"正在查询，请稍后..." 
			},
			aoColumnDefs : [
                {
                    "aTargets" :[3,6],
                    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) { 
                    	if(parseFloat($(nTd).text())>0){
                    		$(nTd).css('color', '#ff0000');
                    	}
    	             }   
                }
            ],
            
			ajax:function (data, callback, settings) {
				var param ={
						"factory":$("#search_factory :selected").text(),
						"start_date":$("#start_date").val(),
						"end_date":$("#end_date").val()
						};

	            $.ajax({
	                type: "post",
	                url: "getOnlineAndOfflineData",
	                cache: false,  //禁用缓存
	                data: param,  //传入组装的参数
	                dataType: "json",
	                success: function (result) {
	                	//封装返回数据
	                	var welding_onlinetotal=0;
	            	    var welding_offlinetotal=0;
	            		var chassis_onlinetotal=0;
	            		var chassis_offlinetotal=0;
	                    var returnData = {};
	                    returnData.data = result.data;//返回的数据列表
	                    var addTotalJson={};
	                    var addFinishRaioJson={};
	            		$.each(result.data,function(index,value){
	            			welding_onlinetotal+=parseFloat(value.welding_online);
	            			welding_offlinetotal+=parseFloat(value.welding_offline);
	            			chassis_onlinetotal+=parseFloat(value.chassis_online);
	            			chassis_offlinetotal+=parseFloat(value.chassis_offline);
	            		});
	            		var weldingFinishRadio=Math.round(welding_offlinetotal / (welding_onlinetotal!=0 ? welding_onlinetotal : 1) * 10000) / 100.00 + "%";// 小数点后两位百分比
	            		var chassisFinishRadio=Math.round(chassis_offlinetotal / (chassis_onlinetotal!=0 ? chassis_onlinetotal : 1 ) * 10000) / 100.00 + "%";// 小数点后两位百分比
	            		addTotalJson={"factory_name":"合计",
	            				"welding_online":welding_onlinetotal,"welding_offline":welding_offlinetotal,
	            				"chassis_online":chassis_onlinetotal,"chassis_offline":chassis_offlinetotal};
	            		addFinishRaioJson={"factory_name":"达成率",
	            				"welding_online":'',"welding_offline":weldingFinishRadio,
	            				"chassis_online":'',"chassis_offline":chassisFinishRadio};
	            		returnData.data.push(addTotalJson);
	            		returnData.data.push(addFinishRaioJson);
	                    callback(returnData);
	                }
	            });
			
			},
			columns: [
			            {"title":"工厂","class":"center","data":"factory_name","defaultContent": ""},
			            {"title":"焊装累计计划","class":"center welding_online","data":"welding_online","render":function(data,type,row){
			            	return data!='0' ? data : '-'
			            },"defaultContent": ""},
			            {"title":"焊装累计完成","class":"center welding_offline","data":"welding_offline","render":function(data,type,row){
			            	return (data!='0' && data!='0%') ? data : '-'
			            },"defaultContent": ""},
			            {"title":"欠产","class":"center","data": "-","render":function(data,type,row){
			            	return (row.factory_name!='达成率' && (row.welding_online!='0' || row.welding_offline!='0'))  ? row.welding_online-row.welding_offline :'-'
			            },"defaultContent": ""},
			            {"title":"底盘累计计划","class":"center chassis_online","data":"chassis_online","render":function(data,type,row){
			            	return data!='0' ? data : '-'
			            },"defaultContent": ""},	            
			            {"title":"底盘累计完成","class":"center chassis_offline","data": "chassis_offline","render":function(data,type,row){
			            	return (data!='0' && data!='0%') ? data : '-'
			            },"defaultContent": ""},
			            {"title":"欠产","class":"center","data": "-","render":function(data,type,row){
			            	return (row.factory_name!='达成率' && (row.chassis_online!='0' || row.chassis_offline!='0'))  ? row.chassis_online-row.chassis_offline : '-'
			            },"defaultContent": ""},
			          ]
		});
		$(".dt-buttons").css("margin-top","-50px").find("a").css("border","0px");
	});
})

function initPage(){
	getBusNumberSelect('#nav-search-input');
	//$("#search_date").val(formatDate());
	getFactorySelect("report/onlineAndOfflineReport",'',"#search_factory","全部",'id');
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
