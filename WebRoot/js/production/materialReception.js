var pageSize=1;
var table;
var table_height = $(window).height()-250;
var query_data;
$(document).ready(function () {	
	initPage();
	
	function initPage(){
		getBusNumberSelect('#nav-search-input');
		$("#search_disno").focus();
	};

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/MES/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	});
	
	$("#btnQuery").click(function () {
		ajaxQuery();
	});
	
	$("#btnReception").click(function () {
		if(typeof(query_data) == "undefined"){
			alert(Warn['P_materialReception_05']);
			return false;
		}
		if(query_data.length == 0){
			alert(Warn['P_materialReception_05']);
			return false;
		}
		
		if(confirm(Warn['P_materialReception_02'])){
			$.ajax({
				url : "materialReceptionConfirm",
				dataType : "json",
				data : {
					conditions:JSON.stringify(query_data)
				},
				async : false,
				success : function(response) {
					if(response.success == false){
						alert(Warn[response.data]);
					}else{
						alert(Warn['P_materialReception_04']);
					}
					ajaxQuery();
				}
			});
		}
	});
	
	Array.prototype.remove = function(val) {  
	    var index = this.indexOf(val);  
	    if (index > -1) {  
	        this.splice(index, 1);  
	    }  
	}; 
	
})



function ajaxQuery(){
	if($('#search_disno').val() == ""){
		alert(Warn['P_materialReception_01']);
		$("#search_disno").focus();
		return false;
	}
	
	$.ajax({
	    url: "getMaterialReception",
	    dataType: "json",
		type: "get",
	    data: {
	    	"dis_no": $('#search_disno').val()
	    },
	    success:function(response){
	    	$("#tableData tbody").html("");
	    	query_data = response.data;
	    	if(response.data.length == 0){
	    		alert(Warn['P_lineInventory_01']);
	    	}
	    	$.each(response.data,function (index,value) {
	    		var tr = $("<tr/>");
		    	$("<td style=\"text-align:center;\" />").html(value.station).appendTo(tr);
		    	$("<td style=\"text-align:center;\" />").html(value.bus_number).appendTo(tr);
		    	$("<td style=\"text-align:center;\" />").html(value.sap_material).appendTo(tr);
		    	$("<td style=\"text-align:center;\" />").html(value.byd_no).appendTo(tr);
		    	$("<td style=\"text-align:center;\" />").html(value.part_name).appendTo(tr);
		    	$("<td style=\"text-align:center;\" />").html(value.specification).appendTo(tr);
		    	$("<td style=\"text-align:center;\" />").html(value.required_quantity).appendTo(tr);
		    	$("<td style=\"text-align:center;\" />").html(value.unit).appendTo(tr);
		    	$("<td style=\"text-align:center;\" />").html(value.dis_quantity).appendTo(tr);
		    	$("<td style=\"text-align:center;\" />").html(value.vendor).appendTo(tr);		
		    	$("<td style=\"text-align:center;\" />").html(value.reception_user).appendTo(tr);	
		    	$("<td style=\"text-align:center;\" />").html(value.reception_time).appendTo(tr);	    	
		    	
		    	$("#tableData tbody").append(tr);
	    	})
	    }
	});
}

function selectAll(){
	//$("#tableData tbody :checkbox").prop("checked", true);
	//console.log($("#selectAll").prop("checked"));
	if ($("#selectAll").prop("checked") == true) {
		check_All_unAll("#tableData", true);
	} else {
		check_All_unAll("#tableData", false);
	}
}

