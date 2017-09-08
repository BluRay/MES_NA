var div_height = $(window).height()-180;
var li_flag = "1";
$(document).ready(function () {	
	initPage();
	
	function initPage(){
		getBusNumberSelect('#transfer_his_busnumber');
		getBusNumberSelect('#nav-search-input');
		getFactorySelect("plan/busTransfer",'',"#transfer_out_factory",null,'id');
		getFactorySelect("plan/busTransfer",'',"#transfer_in_factory",null,'id');
		getFactorySelect("plan/busTransfer",'',"#transfer_in_factory2",null,'id');
		getFactorySelect("plan/busTransfer",'',"#transfer_his_out_factory",null,'id');
		getFactorySelect("plan/busTransfer",'',"#transfer_his_in_factory",null,'id');
		getOrderNoSelect("#transfer_his_orderno","#orderId");
		$("#btnTransferOut").attr("disabled","disabled"); 
		$("#btnTransferIn").attr("disabled","disabled");
		$("#out").css("height",div_height);
		$("#in").css("height",div_height);
		$("#his").css("height",div_height);
	}

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/BMS/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})
	
	$("li").click(function(e){
		if(this.id == "div1"){
			li_flag = "1";
		}else if(this.id == "div2"){
			li_flag = "2";
		}else{
			li_flag = "3";
		}
	});
	
	$("#btnTransferOutQuery").click (function () {
		if($("#transfer_out_busnumber").val() == ""){
			$.gritter.add({
				title: '系统提示：',
				text: '<h5>请输入车号！</h5>',
				class_name: 'gritter-error'
			});
			$("#transfer_out_busnumber").focus();
			return false;
		}
		ajaxQueryOut();
	});
	$("#btnTransferInQuery").click (function () {
		ajaxQueryIn();
	});
	$("#btnTransferHisQuery").click (function () {
		ajaxQueryHis();
	});
	
	$("#btnTransferOut").click (function () {
		var bus_numbers = "";
		$('#tableBusInfoOut tr').each(function(e){
			var id = $(this).attr("id");
			if(id != "0"){
				if($('#check_' + id).is(':checked')==true){
					bus_numbers+=$(this).attr("id")+",";
				}
			}
		});
		if(bus_numbers == ""){
			$.gritter.add({
				title: '系统提示：',
				text: '<h5>请选择要调动的车号！</h5>',
				class_name: 'gritter-error'
			});
			return false;
		}
		
		$.ajax({
			url : "busTransferOut",
			dataType : "json",
			data : {
		    	"bus_number": bus_numbers,
		    	"transfer_out_factory": $('#transfer_out_factory').val(),
			},
			async : false,
			error : function(response) {
				$.gritter.add({
					title: '系统提示：',
					text: '<h5>操作失败！</h5>',
					class_name: 'gritter-error'
				});
			},
			success : function(response) {
				if(response.message=='0'){
					$.gritter.add({
						title: '系统提示：',
						text: '<h5>操作成功！</h5>',
						class_name: 'gritter-success'
					});
				}else{
					$.gritter.add({
						title: '系统提示：',
						text: '<h5>操作失败！调出工厂有误，选择的车号已经在调出工厂，请重新选择！</h5>',
						class_name: 'gritter-error'
					});
				}
				ajaxQueryOut();
			}
		});
	});
	
	$("#btnTransferIn").click (function () {
		var bus_numbers = "";
		$('#tableBusInfoIn tr').each(function(e){
			var id = $(this).attr("id");
			if(id != "0"){
				if($('#check_' + id).is(':checked')==true){
					bus_numbers+=$(this).attr("id")+"|"+$(this).data("order_id")+"|"+$(this).data("order_no")+",";
				}
			}			
		});
		console.log("---->bus_numbers=" + bus_numbers);
		if(bus_numbers == ""){
			$.gritter.add({
				title: '系统提示：',
				text: '<h5>请选择要调动的车号！</h5>',
				class_name: 'gritter-error'
			});
			return false;
		}
		$.ajax({
			url : "busTransferIn",
			dataType : "json",
			data : {
		    	"bus_number": bus_numbers,
		    	"transfer_in_factory": $('#transfer_in_factory2').val()
			},
			async : false,
			error : function(response) {
				$.gritter.add({
					title: '系统提示：',
					text: '<h5>操作失败！</h5>',
					class_name: 'gritter-error'
				});
			},
			success : function(response) {
				if(response.message=='0'){
					$.gritter.add({
						title: '系统提示：',
						text: '<h5>操作成功！</h5>',
						class_name: 'gritter-success'
					});
				}else{
					$.gritter.add({
						title: '系统提示：',
						text: '<h5>操作失败！</h5>',
						class_name: 'gritter-error'
					});
				}
				ajaxQueryIn();
			}
		});
	});
	
	function ajaxQueryIn(){
		$.ajax({
		    url: "busTransferInQuery",
    	    dataType: "json",
			type: "get",
		    data: {
		    	"factory_id": $('#transfer_in_factory').val(),
				"factory_id_in": $('#transfer_in_factory2').val(),
		    	"bus_numbers": "'" + $('#transfer_in_busnumber').val().replace(/\r/ig, "','").replace(/\n/ig, "','") + "'"
		    },
		    success:function(response){
		    	$("#btnTransferIn").removeAttr("disabled");
		    	$("#tableBusInfoIn tbody").html("");
		    	$.each(response.data,function (index,value) {
		    		var tr = "";
		    		tr = $("<tr id =\""+value.bus_number+"\" />");
					$("<td style=\"text-align:center;\" />").html("<input id=\"check_"+value.bus_number+"\" type=\"checkbox\">").appendTo(tr);
					$("<td style=\"text-align:center;\" />").html(value.bus_number).appendTo(tr);
	    			$("<td style=\"text-align:center;\" />").html(value.order_no).appendTo(tr);
	    			$("<td style=\"text-align:center;\" />").html(value.bus_number.substr(0,value.bus_number.indexOf("-"))).appendTo(tr);
	    			var bus_numberstr = value.bus_number.substr(value.bus_number.indexOf("-")+1,value.bus_number.length);
	    			var bus_numberstr2 = bus_numberstr.substr(bus_numberstr.indexOf("-")+1,bus_numberstr.length);
	    			$("<td style=\"text-align:center;\" />").html(bus_numberstr2.substr(0,4)).appendTo(tr);
	    			$("<td style=\"text-align:center;\" />").html(value.customer).appendTo(tr);
	    			$("<td style=\"text-align:center;\" />").html(value.order_config_name).appendTo(tr);
	    			$("<td style=\"text-align:center;\" />").html(value.vin).appendTo(tr);
	    			$("<td style=\"text-align:center;\" />").html(value.factory_name).appendTo(tr);
	    			$("<td style=\"text-align:center;\" />").html(value.process_name).appendTo(tr);
	    			$("<td style=\"text-align:center;\" />").html((value.status==0)?"正常":"冻结").appendTo(tr);
	    			$(tr).data("order_id",value.order_id);
	    			$(tr).data("order_no",value.order_no);
	    			$("#tableBusInfoIn tbody").append(tr);
		    	});
		    }
		});
	}
	
	function ajaxQueryOut(){
		$.ajax({
		    url: "busTransferOutQuery",
    	    dataType: "json",
			type: "get",
		    data: {
		    	"factory_id": $('#transfer_in_factory').val(),
		    	"busNumbers": "'" + $('#transfer_out_busnumber').val().replace(/\r/ig, "','").replace(/\n/ig, "','") + "'"
		    },
		    success:function(response){
		    	$("#btnTransferOut").removeAttr("disabled");
		    	$("#tableBusInfoOut tbody").html("");
		    	$.each(response.data,function (index,value) {
		    		var tr = "";
	    			if((value.status==0)){
	    				tr = $("<tr id =\""+value.bus_number+"\" />");
	    				$("<td style=\"text-align:center;\" />").html("<input id=\"check_"+value.bus_number+"\" type=\"checkbox\">").appendTo(tr);
	    			}else{
	    				tr = $("<tr id =\"0\" />");
	    				$("<td style=\"text-align:center;\" />").html("<input disabled=\"disabled\" type=\"checkbox\">").appendTo(tr);
	    			}
	    			$("<td style=\"text-align:center;\" />").html(value.bus_number).appendTo(tr);
	    			$("<td style=\"text-align:center;\" />").html(value.order_name).appendTo(tr);
	    			$("<td style=\"text-align:center;\" />").html(value.bus_number.substr(0,value.bus_number.indexOf("-"))).appendTo(tr);
	    			var bus_numberstr = value.bus_number.substr(value.bus_number.indexOf("-")+1,value.bus_number.length);
	    			var bus_numberstr2 = bus_numberstr.substr(bus_numberstr.indexOf("-")+1,bus_numberstr.length);
	    			$("<td style=\"text-align:center;\" />").html(bus_numberstr2.substr(0,4)).appendTo(tr);
	    			$("<td style=\"text-align:center;\" />").html(value.customer).appendTo(tr);
	    			$("<td style=\"text-align:center;\" />").html(value.order_config_name).appendTo(tr);
	    			$("<td style=\"text-align:center;\" />").html(value.vin).appendTo(tr);
	    			$("<td style=\"text-align:center;\" />").html(value.factory_name).appendTo(tr);
	    			$("<td style=\"text-align:center;\" />").html("").appendTo(tr);
	    			$("<td style=\"text-align:center;\" />").html((value.status==0)?"正常":"冻结").appendTo(tr);
	    			$("#tableBusInfoOut tbody").append(tr);
		    	});
		    }
		});
	}
	
	function ajaxQueryHis(){
		$.ajax({
		    url: "busTransferHisQuery",
    	    dataType: "json",
			type: "get",
		    data: {
		    	"transfer_his_busnumber": $('#transfer_his_busnumber').val(),
				"transfer_his_vin": $('#transfer_his_vin').val(),
				"transfer_his_orderno": $('#transfer_his_orderno').val(),
				
				"transfer_his_out_factory": $('#transfer_his_out_factory').val(),
				"transfer_his_out_date_start": $('#start_date').val(),
				"transfer_his_out_date_end": $('#end_date').val(),
				
				"transfer_his_in_factory": $('#transfer_his_in_factory').val(),
				"transfer_his_in_date_start": $('#start_date2').val(),
				"transfer_his_in_date_end": $('#end_date2').val(),		
		    },
		    success:function(response){
		    	$("#tableBusHisInfo tbody").html("");
	    		$.each(response.data,function (index,value) {
	    			var tr = "";
	    			tr = $("<tr id =\""+value.bus_number+"\" />");	
	    			$("<td style=\"text-align:center;\" />").html(value.bus_number).appendTo(tr);
	    			$("<td style=\"text-align:center;\" />").html(value.order_name).appendTo(tr);
	    			$("<td style=\"text-align:center;\" />").html(value.bus_number.substr(0,value.bus_number.indexOf("-"))).appendTo(tr);
	    			var bus_numberstr = value.bus_number.substr(value.bus_number.indexOf("-")+1,value.bus_number.length);
	    			var bus_numberstr2 = bus_numberstr.substr(bus_numberstr.indexOf("-")+1,bus_numberstr.length);
	    			$("<td style=\"text-align:center;\" />").html(bus_numberstr2.substr(0,4)).appendTo(tr);
	    			$("<td style=\"text-align:center;\" />").html(value.customer).appendTo(tr);
	    			$("<td style=\"text-align:center;\" />").html(value.order_config_name).appendTo(tr);
	    			$("<td style=\"text-align:center;\" />").html(value.vin).appendTo(tr);
	    			$("<td style=\"text-align:center;\" />").html(value.factory_name_out).appendTo(tr);
	    			$("<td style=\"text-align:center;\" />").html(value.factory_name_in).appendTo(tr);
	    			$("<td style=\"text-align:center;\" />").html(value.tfrom_date).appendTo(tr);
	    			$("<td style=\"text-align:center;\" />").html(value.name_out).appendTo(tr);
	    			$("<td style=\"text-align:center;\" />").html(value.tto_date).appendTo(tr);
	    			$("<td style=\"text-align:center;\" />").html(value.name_in).appendTo(tr);
	    			$("#tableBusHisInfo tbody").append(tr);
	    		});
		    }
		});
		
	}
	
	//全选反选
	$(document).on("click","#checkall_in",function(){
		if ($('#checkall_in').is(":checked")) {
			check_All_unAll("#tableBusInfoIn",true);
		}
		if($('#checkall_in').is(":checked")==false){
			check_All_unAll("#tableBusInfoIn",false);
		}
	})
	$(document).on("click","#checkall",function(){
		if ($('#checkall').is(":checked")) {
			check_All_unAll("#tableBusInfoOut",true);
		}
		if($('#checkall').is(":checked")==false){
			check_All_unAll("#tableBusInfoOut",false);
		}
	})
	
});