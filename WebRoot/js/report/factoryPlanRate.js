$(document).ready(function(){
	
	initPage();

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/BMS/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})
	
	$("#btnQuery").click(function(){
		ajaxQuery();
	})
})

function initPage(){
	getBusNumberSelect('#nav-search-input');
	getFactorySelect("report/factoryOutputYear","","#search_factory",null,"id");
	var year=new Date().getFullYear();
	var month=new Date().getMonth()+1;
	$("#search_month").val(year+"-"+(month<10?"0"+month:month));
	ajaxQuery();
}

function ajaxQuery(){
	$(".divLoading").addClass("fade in").show();
	if ( $.fn.dataTable.isDataTable("#tableResult") ) {
		$("#tableResult").dataTable().fnClearTable();
	    $("#tableResult").dataTable().fnDestroy();
	}
	$("#tableResult").html("");
	var data=[];
	var th_order_list=[];
	var rowsGroup=[];
	
	$.ajax({
		 type: "post",
         url: "getFactoryPlanRateData",
         cache: false,  //禁用缓存
         async:false,
         data: {
        	 factory_id:$("#search_factory").val(),
        	 factory_name:$("#search_factory :selected").text(),
        	 month:$("#search_month").val()
         },  //传入组装的参数
         dataType: "json",
         success: function (response) {
        	 data=response.data;
        	 th_order_list=response.order_names;
        	 if(th_order_list.length>0){
        		 showTable(data,th_order_list);
        	 }else{
        		 alert("抱歉，未查询到数据！");
        	 }
        	 
        	$(".divLoading").hide();
         }
   
	})
	
}

function showTable(data,th_order_list){
	 var index=th_order_list.length+5;
	 /*rowsGroup=[9];*/
	 var html_th="<tr><th class='center' rowspan=2>车间</th><th class='center' rowspan=2>计划数</th>"+
		 "<th class='center' rowspan=2>完成数</th>"+
		 "<th class='center' colspan="+th_order_list.length+">订单完成明细</th>"+
		 "<th class='center' rowspan=2>计划达成率</th><th class='center' width='300px' rowspan=2>备注</th></tr>";
	 html_th+="<tr>";  	 
	 $.each(th_order_list,function(i,value){
		 var th="<th class='center'>"+value+"</th>";
		 html_th+=th;
	 });
	 html_th+="</tr>";
	var thead= $("<thead />").html(html_th)
	 
	$("#tableResult").append(thead);
	
	var tbody= $("<tbody />");
	var last_workshop="";
	var mark_id="";
	$.each(data,function(i,value){
		
		var tr=$("<tr />");
		$("<td />").html(value.workshop).appendTo(tr);
		
		$("<td />").html(value.plan_qty).appendTo(tr);
		
		$("<td />").html(value.done_qty).appendTo(tr);
		for(var j=0;j<th_order_list.length;j++){
			$("<td />").html((value["order_"+j]||0)).appendTo(tr);
		}
		$("<td />").html(value.rate).appendTo(tr);

		//alert(last_workshop);
/*		if(last_workshop==value.workshop.slice(0,-2)){
			var rowspan=parseInt($(mark_id).attr("rowspan"));
			//alert($(mark_id).html())
			$(mark_id).attr("rowspan",rowspan+1);
		}else{
			mark_id="#mark_"+i;
			$("<td id='mark_"+i+"' style='text-align:left' rowspan=1 />").html(value.mark).appendTo(tr);
		}*/
		var marks=value.mark.trim().split("||");
		$.each(marks,function(i,v){
			if(v==undefined||v.trim().length==0){
				marks.splice(i,1)
			}
		})
		var mark_title="";
		$.each(marks,function(i,v){
			mark_title+=(i+1)+". "+v+"  ";
		})
		//alert(value.mark.trim().length)
		if(value.mark.trim().length==0){
			$("<td id='mark_"+i+"' style='text-align:left;' rowspan=1 width='300px'/>").html("").appendTo(tr);
		}else{			
			$("<td id='mark_"+i+"' style='text-align:left;' rowspan=1 width='300px'/>").html("<i style='font-style:normal' title='"+mark_title+"'>"+
					(mark_title.length>40?(mark_title.substring(0,40)+"..."):mark_title)+"</i>").appendTo(tr);

		}
		last_workshop=value.workshop.slice(0,-2);
		$(tbody).append(tr);
		$("#tableResult").append(tbody);
	})
	    	
	var tb=$("#tableResult").dataTable({
		  dom: 'Bfrtip',
		  buttons: [
			        {extend:'excelHtml5',title:'data_export',className:'black',text:'<i class=\"fa fa-file-excel-o bigger-130\" tooltip=\"导出excel\"></i>'},
			        {extend:'colvis',text:'<i class=\"fa fa-list bigger-130\" tooltip=\"选择展示列\"></i>'},	       
			        ],
		  paginate:false,	 
		  paiging:false,
		  ordering:false,
		  /*rowsGroup:[9],*/
		  searching: false,
		  bAutoWidth:false,
		  destroy: true,
		  sScrollY: $(window).height()-250,
		  scrollX: true,
		  info:false,
		  orderMulti:false,
		  language: {
				emptyTable:"抱歉，未查询到数据！",
				loadingRecords:"正在查询，请稍后..." ,
				infoEmpty:"抱歉，未查询到数据！",
			},
			
	  });

	$(".dt-buttons").css("margin-top","-50px").find("a").css("border","0px");
	var head_width=$(".dataTables_scroll").width();
	$(".dataTables_scrollBody").scrollTop(10);
	//alert($(".dataTables_scrollBody").scrollTop());

	if($(".dataTables_scrollBody").scrollTop()>0){
		$(".dataTables_scrollHead").css("width",head_width-20);
		$(".dataTables_scrollBody").scrollTop(0);
	}
 
}
