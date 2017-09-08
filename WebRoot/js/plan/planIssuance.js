var issTotal =  new Array(0,0,0,0,0,0,0,0,0,0,0,0);
var issTotalBak=new Array(0,0,0,0,0,0,0,0,0,0,0,0);
var issed = "0";	//标记已发布
var plan_code = new Array("自制件下线","部件上线","部件下线","焊装上线","焊装下线","涂装上线","涂装下线","底盘上线","底盘下线","总装上线","总装下线","入库");
$(document).ready(function () {	
	initPage();
	
	function initPage(){
		getBusNumberSelect('#nav-search-input');
		getFactorySelect("plan/planRevision",'',"#search_factory",null,'id');
		getOrderNoSelect("#search_order_no","#orderId");
		$("#btnSave").attr("disabled","disabled");
	}

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/BMS/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})
	
	$("#btnQuery").click (function () {
		if($('#search_factory').val() == ""){
			alert("请选择工厂！");
			return false;
		}
		if($('#issuance_date').val() == ""){
			alert("请输入发布日期！");
			$('#issuance_date').focus();
			return false;
		}
		$('#revision_str').val("");
		ajaxQuery();
		return false;
	});
	
	$("#btnSave").click (function () {
		issTotal =  new Array(0,0,0,0,0,0,0,0,0,0,0,0);
		$("#btnSave").attr("disabled","disabled");
		var sum_plan = 0; var sum_iss = 0; var tableData=new Array();
		var plan_count = 0; var check = 0;
		$("#tableData tr").each(function(trindex,tritem){
			if(trindex >0){
				tableData[trindex]=new Array();
                if($(tritem).text().substring(1,2)=='D'){
                	if(plan_count != 0){
                		if(issTotal.toString()!="0,0,0,0,0,0,0,0,0,0,0,0"){
                			alert("发布计划数量有误，配置计划数之和需等于总计划数，请检查后重新输入");
                			$("#btnSave").removeAttr("disabled");
                			check = 1;
                    		issTotal =  new Array(0,0,0,0,0,0,0,0,0,0,0,0);
            				return false;
                		}
                	}
                	var i = 0;
                	$(tritem).find("td").each(function(tdindex,tditem){
                		sum_plan += parseInt((tdindex < 2)?0:$(tditem).find(".cell").val());
                		if(tdindex >= 2){
                    		issTotal[i] += parseInt($(tditem).find(".cell").val());
                    		i++;
                		}
                	})
                	plan_count++;
                }else{
                	var i = 0;
                	$(tritem).find("td").each(function(tdindex,tditem){
                		sum_iss += parseInt((tdindex < 2)?0:$(tditem).find(".cell").val());
                		if(tdindex >= 2){
                    		issTotal[i] -= parseInt($(tditem).find(".cell").val());
                    		i++;
                		}
                	})
                }
			}
		});
		
		if(check == 1){return false;}
        if(issTotal.toString()!="0,0,0,0,0,0,0,0,0,0,0,0"){
        	alert("发布计划数量有误，配置计划数之和需等于总计划数，请检查后重新输入");
        	$("#btnSave").removeAttr("disabled");
			return false;
		}
        $.ajax({
		    url: "issuancePlanSubmit",
    	    dataType: "json",
			type: "get",
		    data: {
		    	"factory_id": $('#search_factory').val(),
		    	"order_no": $('#search_order_no').val(),
		    	"issuance_date": $('#issuance_date').val(),
		    	"issuance_str": $('#issuance_str').val(),
		    },
		    success:function(response){
		    	alert("发布成功，生成车号数量：" + response.message);
		    	ajaxQuery();
				return false;
		    }
		});
        $("#btnSave").removeAttr("disabled");
		return false;
	});
	
	function ajaxQuery(targetPage){
		$.ajax({
		    url: "getIssuancePlan",
    	    dataType: "json",
			type: "get",
		    data: {
		    	"factory_id": $('#search_factory').val(),
		    	"order_no": $('#search_order_no').val(),
		    	"issuance_date": $('#issuance_date').val()
		    },
		    success:function(response){	
		    	$("#tableData tbody").html("");
		    	if(response.success){
		    		if(response.message != '查询成功')alert(response.message);
		    		$("#btnSave").removeAttr("disabled");
		    		var input_disable_total = "<input name = 'total' title=\"总计划\" class=\"cell\" style=\"border:0;width:45px;background-color:#abbac3\" disabled=\"disabled\" onclick=\"javascript:$(this).blur();\" value=";
		    		var input_disable = "<input title=\"计划已发布\" disabled=\"disabled\" class=\"cell\" style=\"border:0;width:45px;BACKGROUND: none transparent scroll repeat 0% 0%;\" onclick=\"javascript:$(this).select();\" value=";
		    		var issStr = "";var configsStr = "";
		    		$.each(response.data,function (index,value) {
		    			if((value.order_config_name.substring(0,1)!='D')) {
		    				issStr += value.order_config_id + ":," + value.plan_code_1 + "," + value.plan_code_2 + "," + value.plan_code_3 + "," 
		    				+ value.plan_code_4 + "," + value.plan_code_5 + "," + value.plan_code_6 
			    			+ "," + value.plan_code_7 + "," + value.plan_code_8 + "," + value.plan_code_9 + "," + value.plan_code_10 
			    			+ "," + value.plan_code_11 + "," + value.plan_code_12 + ";";
		    				configsStr += value.order_config_id + ",";
		    			}else{
		    				issTotalBak[0]= value.plan_code_1;issTotalBak[1]= value.plan_code_2;issTotalBak[2]= value.plan_code_3;		//计划总数
		    				issTotalBak[3]= value.plan_code_4;issTotalBak[4]= value.plan_code_5;issTotalBak[5]= value.plan_code_6;
		    				issTotalBak[6]= value.plan_code_7;issTotalBak[7]= value.plan_code_8;issTotalBak[8]= value.plan_code_9;
		    				issTotalBak[9]= value.plan_code_10;issTotalBak[10]= value.plan_code_11;issTotalBak[11]= value.plan_code_12;
		    			}
		    			var tr = $("<tr />");
		    			$("<td />").html(index).appendTo(tr);
		    			$("<td />").html(value.order_config_name).appendTo(tr);
		    			if(value.order_config_name.substring(0,1)=='D'){
		    				$("<td style='background-color:#abbac3'/>").html(input_disable_total + value.plan_code_1 + ">").appendTo(tr);
		    				$("<td style='background-color:#abbac3' />").html(input_disable_total + value.plan_code_2 + ">").appendTo(tr);
		    				$("<td style='background-color:#abbac3' />").html(input_disable_total + value.plan_code_3 + ">").appendTo(tr);
		    				$("<td style='background-color:#abbac3' />").html(input_disable_total + value.plan_code_4 + ">").appendTo(tr);
		    				$("<td style='background-color:#abbac3' />").html(input_disable_total + value.plan_code_5 + ">").appendTo(tr);
		    				$("<td style='background-color:#abbac3' />").html(input_disable_total + value.plan_code_6 + ">").appendTo(tr);
		    				$("<td style='background-color:#abbac3' />").html(input_disable_total + value.plan_code_7 + ">").appendTo(tr);
		    				$("<td style='background-color:#abbac3' />").html(input_disable_total + value.plan_code_8 + ">").appendTo(tr);
		    				$("<td style='background-color:#abbac3' />").html(input_disable_total + value.plan_code_9 + ">").appendTo(tr);
		    				$("<td style='background-color:#abbac3' />").html(input_disable_total + value.plan_code_10 + ">").appendTo(tr);
		    				$("<td style='background-color:#abbac3' />").html(input_disable_total + value.plan_code_11 + ">").appendTo(tr);
		    				$("<td style='background-color:#abbac3' />").html(input_disable_total + value.plan_code_12 + ">").appendTo(tr);
		    			}else{
		    				$("<td />").html((value.plan_code_issed_1_done==0)?"<input id='"+ value.order_config_id + '_1' +"' class=\"cell\" style=\"border:0;width:45px;BACKGROUND: none transparent scroll repeat 0% 0%;\" onclick=\"javascript:$(this).select();\" value=" + value.plan_code_1 + ">":input_disable + value.plan_code_issed_1 + ">").appendTo(tr);
		    				$("<td />").html((value.plan_code_issed_2_done==0)?"<input id='"+ value.order_config_id + '_2' +"' class=\"cell\" style=\"border:0;width:45px;BACKGROUND: none transparent scroll repeat 0% 0%;\" onclick=\"javascript:$(this).select();\" value=" + value.plan_code_2 + ">":input_disable + value.plan_code_issed_2 + ">").appendTo(tr);
		    				$("<td />").html((value.plan_code_issed_3_done==0)?"<input id='"+ value.order_config_id + '_3' +"' class=\"cell\" style=\"border:0;width:45px;BACKGROUND: none transparent scroll repeat 0% 0%;\" onclick=\"javascript:$(this).select();\" value=" + value.plan_code_3 + ">":input_disable + value.plan_code_issed_3 + ">").appendTo(tr);
		    				$("<td />").html((value.plan_code_issed_4_done==0)?"<input id='"+ value.order_config_id + '_4' +"' class=\"cell\" style=\"border:0;width:45px;BACKGROUND: none transparent scroll repeat 0% 0%;\" onclick=\"javascript:$(this).select();\" value=" + value.plan_code_4 + ">":input_disable + value.plan_code_issed_4 + ">").appendTo(tr);
		    				$("<td />").html((value.plan_code_issed_5_done==0)?"<input id='"+ value.order_config_id + '_5' +"' class=\"cell\" style=\"border:0;width:45px;BACKGROUND: none transparent scroll repeat 0% 0%;\" onclick=\"javascript:$(this).select();\" value=" + value.plan_code_5 + ">":input_disable + value.plan_code_issed_5 + ">").appendTo(tr);
		    				$("<td />").html((value.plan_code_issed_6_done==0)?"<input id='"+ value.order_config_id + '_6' +"' class=\"cell\" style=\"border:0;width:45px;BACKGROUND: none transparent scroll repeat 0% 0%;\" onclick=\"javascript:$(this).select();\" value=" + value.plan_code_6 + ">":input_disable + value.plan_code_issed_6 + ">").appendTo(tr);
		    				$("<td />").html((value.plan_code_issed_7_done==0)?"<input id='"+ value.order_config_id + '_7' +"' class=\"cell\" style=\"border:0;width:45px;BACKGROUND: none transparent scroll repeat 0% 0%;\" onclick=\"javascript:$(this).select();\" value=" + value.plan_code_7 + ">":input_disable + value.plan_code_issed_7 + ">").appendTo(tr);
		    				$("<td />").html((value.plan_code_issed_8_done==0)?"<input id='"+ value.order_config_id + '_8' +"' class=\"cell\" style=\"border:0;width:45px;BACKGROUND: none transparent scroll repeat 0% 0%;\" onclick=\"javascript:$(this).select();\" value=" + value.plan_code_8 + ">":input_disable + value.plan_code_issed_8 + ">").appendTo(tr);
		    				$("<td />").html((value.plan_code_issed_9_done==0)?"<input id='"+ value.order_config_id + '_9' +"' class=\"cell\" style=\"border:0;width:45px;BACKGROUND: none transparent scroll repeat 0% 0%;\" onclick=\"javascript:$(this).select();\" value=" + value.plan_code_9 + ">":input_disable + value.plan_code_issed_9 + ">").appendTo(tr);
		    				$("<td />").html((value.plan_code_issed_10_done==0)?"<input id='"+ value.order_config_id + '_10' +"' class=\"cell\" style=\"border:0;width:45px;BACKGROUND: none transparent scroll repeat 0% 0%;\" onclick=\"javascript:$(this).select();\" value=" + value.plan_code_10 + ">":input_disable + value.plan_code_issed_10 + ">").appendTo(tr);
		    				$("<td />").html((value.plan_code_issed_11_done==0)?"<input id='"+ value.order_config_id + '_11' +"' class=\"cell\" style=\"border:0;width:45px;BACKGROUND: none transparent scroll repeat 0% 0%;\" onclick=\"javascript:$(this).select();\" value=" + value.plan_code_11 + ">":input_disable + value.plan_code_issed_11 + ">").appendTo(tr);
		    				$("<td />").html((value.plan_code_issed_12_done==0)?"<input id='"+ value.order_config_id + '_12' +"' class=\"cell\" style=\"border:0;width:45px;BACKGROUND: none transparent scroll repeat 0% 0%;\" onclick=\"javascript:$(this).select();\" value=" + value.plan_code_12 + ">":input_disable + value.plan_code_issed_12 + ">").appendTo(tr);
		    			}
		    			$("#tableData tbody").append(tr);
		    		});
		    		$("#issuance_str").val(issStr);
		    		$("#configs").val(configsStr);
		    		getIssStr();
		    	}
		    }
		});
		
	}
	
});

$("body").on("change",".cell",function(e){
	if(isNaN($(e.target).val())){
		alert("请输入数字！");
		$(e.target).val(0);
		return false;
	}
	getIssStr();
});

function getIssStr(){
	var arr1 = $("#configs").val().substring(0,$("#configs").val().length-1).split(",");
	var newstr="";
	for(i in arr1) 
	{
		newstr += arr1[i] + ":";
		for(j=1;j<13;j++){
			if($("#"+arr1[i] + "_" + j).val() == null){
				newstr += "," + "0";
			}else{
				newstr += "," + $("#"+arr1[i] + "_" + j).val();
				issed = "1";
			}
		}
		newstr += ";"
	}
	$("#issuance_str").val(newstr);
}