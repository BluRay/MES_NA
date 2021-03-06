var pageSize=1;
var table;
var dt;

$(document).ready(function(){
	getBusNumberSelect('#nav-search-input');
	$('#file').ace_file_input({
		no_file:'Please Choose xls File...',
		btn_choose:'Choose File',
		btn_change:'Change File',
		droppable:false,
		onchange:null,
		thumbnail:false, //| true | large
		allowExt: ['xlsx','xls'],
	}).on('file.error.ace', function(event, info) {
		alert("Please Choose xls File!");
    });
	$("#btnQuery").on("click",function(){
		ajaxQuery();
	}); 
	
	//ajaxQuery();
	$("#btn_upload").click (function () {
		if($("#file").val()==''){
			alert(Warn['P_common_07']);
			return false;
		}
		$(".divLoading").addClass("fade in").show();
		$("#uploadForm").ajaxSubmit({
			url:"uploadBomInfo",
			type: "post",
			dataType:"json",
			success:function(response){
				if(response.success){	
					if($.fn.dataTable.isDataTable("#tableResult")){
						$('#tableResult').DataTable().destroy();
						$('#tableResult').empty();
					}
					var datalist=response.data;
					var columns=[
			            {"title":"Item No.","class":"center","width":"70px","data":"item_no","defaultContent": ""},
			            {"title":"SAP Material","class":"center","width":"100px","data":"SAP_material","defaultContent": ""},
			            {"title":"BYD_P/N","class":"center","width":"100px","data":"BYD_P/N","defaultContent": ""},
			            {"title":"Part Name","class":"center","data": "part_name","defaultContent": ""},
			            {"title":"Specification","class":"center","width":"160px","data":"specification","defaultContent": ""},
			            {"title":"Unit","class":"center","width":"45px","data": "unit","defaultContent": ""},
			            {"title":"Quantity","class":"center","width":"60px","data": "quantity","defaultContent": ""},
			            {"title":"English Description","class":"center","data": "en_description","defaultContent": ""},
			            {"title":"Vendor","class":"center","data": "vendor","defaultContent": ""},
			            {"title":"Station Code","class":"center","width":"100px","data": "station_code","defaultContent": ""},
			            {"title":"Note","class":"center","data": "note","defaultContent": ""},
			            {"title":"","class":"center","data": "error","defaultContent": "","render":function(data,type,row){
			            	var desc="";
			            	if(data!=''){
			            		var messageArr=data.split(";");
			            		for(var i=0;i<messageArr.length;i++){
			            			if(messageArr[i]!=''){
			            			    desc+=Warn[messageArr[i]]+";";
			            			}
			            		}
			            	}
			            	return desc;
			            }}
			        ];
					$("#tableResult").DataTable({
						paiging:false,
						fixedColumns:   { //固定列，行有错位现象
				            leftColumns: 0,
				            rightColumns:0
				        },
						ordering:false,
						processing:true,
						searching: false,
						autoWidth:false,
						paginate:false,
						sScrollY: $(window).height()-250,
						scrollX: true,
						scrollCollapse: true,
						lengthChange:false,
						orderMulti:false,
						info:false,
						language: {
							
						},
						aoColumnDefs : [
			                {
			                "aTargets" :[11],
			                "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) { 
			                	if($(nTd).text()!=''){
			                		//数据格式错误 整行用红色字体标示
			                		$(nTd).parent().css('color', '#ff0000');
				                	$(nTd).css('color', '#ff0000').css('font-weight', 'bold').css('width','200px');
			                	}
			                }   
			                },
			            ],
						data:datalist,
						columns:columns
					});

				}else{
					
				}
				var head_width=$(".dataTables_scrollHead").width();
                $(".dataTables_scrollHead").css("width",head_width-17);
				$(".divLoading").hide();
			},
			complete:function(){
				$("#uploadForm").reset();
			}		
		});
	});
	$('#btnSave').click(function(event) {
		var save_flag=true;
		var trs=$("#tableResult tbody").find("tr");
		if(trs.length==0){
			save_flag=false;
			alert(Warn['P_common_05']);
			return false;
		}
		var addList=[];
		$.each(trs,function(i,tr){
			var tds=$(tr).children("td");
			var error = $(tds).eq(11).html();
			if(error!=''){
				var item_no = $(tds).eq(0).html();
				save_flag=false;
				alert(item_no+Warn['P_common_06']);
				return false;
			}
			var item_no = $(tds).eq(0).html();
			var SAP_material = $(tds).eq(1).html();
			var BYD_NO = $(tds).eq(2).html();
			var part_name = $(tds).eq(3).html();
			var specification = $(tds).eq(4).html();
			var unit = $(tds).eq(5).html();
			var quantity = $(tds).eq(6).html();
			var en_description = $(tds).eq(7).html();
			var vendor = $(tds).eq(8).html();
			var station_code = $(tds).eq(9).html();
			var note = $(tds).eq(10).html();
			
			var bom={};
			bom.item_no=item_no;
			bom.SAP_material=SAP_material;
			bom.BYD_NO=BYD_NO;
			bom.part_name=part_name;
			bom.specification = specification;
			bom.unit=unit;
			bom.quantity=quantity;
			bom.en_description=en_description;
			bom.vendor=vendor;
			bom.station_code=station_code;
			bom.note=note;
			addList.push(bom);
		});
		if(save_flag){
			ajaxSave(addList);
		}
	});
	$('#btnBack').click(function(event) {
		window.open("../project/getProjectBomInfo","_parent");
	})
	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("../production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})
});
function ajaxSave(addList){
	if($("#documentNo").val()==''){
		alert(Warn['P_importBomInfo_01']);
		$("#documentNo").focus();
		return false;
	}
	if($("#version").val()==''){
		alert(Warn['P_importBomInfo_02']);
		$("#version").focus();
		return false;
	}
	if($("#dcn").val()==''){
		alert(Warn['P_importBomInfo_03']);
		$("#dcn").focus();
		return false;
	}
	$.ajax({
		url:'saveProjectBomInfo',
		method:'post',
		dataType:'json',
		async:false,
		data:{
			"addList":JSON.stringify(addList),
			"projectId":$("#projectId").val(),
			"documentNo":$("#documentNo").val(),
			"version":$("#version").val(),
			"dcn":$("#dcn").val()
		},
		success:function(response){
            if(response.success){
            	$("#documentNo").val("");
            	$("#dcn").val("");
            	$("#version").val("");
            	//$('#tableResult tbody').html("");
            	$.gritter.add({
					title: 'Message：',
					text: "<h5>"+Warn['P_common_03']+"！</h5>",
					class_name: 'gritter-info'
				});
            }else{
            	$.gritter.add({
					title: 'Message：',
					text: "<h5>"+Warn['P_common_04']+"</h5>",
					class_name: 'gritter-info'
				});
            }
		}
	});

}