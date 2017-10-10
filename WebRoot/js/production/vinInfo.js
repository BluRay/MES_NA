var pageSize=1;
var cur_year="";
var dt;

$(document).ready(function(){
	getBusNumberSelect('#nav-search-input');
	getFactorySelect("production/vinInfo",'',"#search_factory","全部",'id');
	getOrderNoSelect("#search_project_no","#orderId");
	$("#btnQuery").on("click",function(){
		ajaxQuery();
	}); 
	$('#file').ace_file_input({
		no_file:'...',
		btn_choose:'Browse',
		btn_change:'Browse',
		width:"150px",
		droppable:false,
		onchange:null,
		thumbnail:false, //| true | large
		//allowExt: ['pdf','PDF'],
	}).on('file.error.ace', function(event, info) {
		//alert("请上传正确的文件!");
		return false;
    });
	ajaxQuery();

//	$('#nav-search-input').bind('keydown', function(event) {
//		if (event.keyCode == "13") {
//			window.open("/BMS/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
//			return false;
//		}
//	})
	$("#btn_upload").click (function () {
		$(".divLoading").addClass("fade in").show();
		$("#uploadForm").ajaxSubmit({
			url:"uploadProjectVinInfo",
			type: "post",
			dataType:"json",
			data:{"project_id":$("#project_id").val()},
			success:function(response){
				if(response.success){	
					if($.fn.dataTable.isDataTable("#tableVinImport")){
						$('#tableVinImport').DataTable().destroy();
						$('#tableVinImport').empty();
					}
					var datalist=response.data;
					var columns=[
			            {"title":"No.","class":"center","data":"no","defaultContent": ""},
			            {"title":"Bus No.","class":"center","data": "bus_number","defaultContent": ""},
			            {"title":"VIN","class":"center","data": "vin","defaultContent": ""},
			            {"title":"","class":"center","data": "error","defaultContent": ""}
			        ];

					$("#tableVinImport").DataTable({
						paiging:false,
						ordering:false,
						processing:true,
						searching: false,
						autoWidth:false,
						paginate:false,
						sScrollY: $(window).height()-320,
						scrollX: true,
						scrollCollapse: true,
						lengthChange:false,
						orderMulti:false,
						info:false,
						language: {},
						aoColumnDefs : [
							{  
			                "aTargets" :[3], // 错误信息不为空， 该行用红色字体标示
			                "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) { 
			                	if($(nTd).text()!=''){
			                		//数据格式错误 整行用红色字体标示
			                		$(nTd).parent().css('color', '#ff0000');
				                	$(nTd).css('color', '#ff0000').css('font-weight', 'bold').css('width','200px');
			                	}
			                }   
			                },
			            ],
			            buttons: [
			          	        {extend:'excelHtml5',title:'data_export',className:'black',text:'<i class=\"fa fa-file-excel-o bigger-130\" tooltip=\"导出excel\"></i>'},
			          	    ],
						data:datalist,
						columns:columns
					});

				}else{
					
				}
//				var head_width=$(".dataTables_scrollHead").width();
//                $(".dataTables_scrollHead").css("width",head_width-10);
				$(".divLoading").hide();
			}			
		});
	});
});


function ajaxQuery(){
	dt=$("#tableResult").DataTable({
		serverSide: true,
//		fixedColumns:   {
//            leftColumns: 3,
//            rightColumns:3
//        },
       // rowsGroup:[0,1,2,3,4,5],
		paiging:true,
		ordering:false,
		searching: false,
		autoWidth:false,
		destroy: true,
		scrollY: $(window).height()-250,
		scrollX: $(window).width(),
		/*scrollCollapse: true,*/
		pageLength: 20,
		pagingType:"full_numbers",
		lengthChange:false,
		orderMulti:false,
		language: {
			
		},
		ajax:function (data, callback, settings) {
			var param ={
				"draw":1,
				"project_no":$("#search_project_no").val(),
				"status":$("#search_status").val(),
				"factory":getAllFromOptions("#search_factory","val")
			};
            param.length = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;//开始的记录序号
            param.page = (data.start / data.length)+1;//当前页码

            $.ajax({
                type: "post",
                url: "getProjectBusNumberList",
                data: param,  //传入组装的参数
                dataType: "json",
                success: function (result) {
                    console.log(result);
                	//封装返回数据
                    var returnData = {};
                    returnData.draw = data.draw;//这里直接自行返回了draw计数器,应该由后台返回
                    returnData.recordsTotal = result.recordsTotal;//返回数据全部记录
                    returnData.recordsFiltered = result.recordsTotal;//后台不实现过滤功能，每次查询均视作全部结果
                    returnData.data = result.data;//返回的数据列表
                    callback(returnData);
                }
            });
		
		},
		columns: [
            {"title":"Project No.","class":"center","data":"project_no","defaultContent": ""},
            {"title":"Project Name","class":"center","data":"project_name","defaultContent": ""},
            {"title":"Delivery Date","class":"center","data": "delivery_date","defaultContent": ""},
            {"title":"Quantity","class":"center","data":"quantity","defaultContent": ""},
            {"title":"Plant","class":"center","data": "plant","defaultContent": ""},
            {"title":"Status","class":"center","data":"project_status","render":function(data,type,row){
            	return data=="0"?"Created":(data=="1"?"In Process":"Completed")},"defaultContent":""
            },
            {"title":"Sales Manager","class":"center","data": "sales_manager","defaultContent": ""},
            {"title":"Project Manager","class":"center","data": "project_manager","defaultContent": ""},
            {"title":"Editor","class":"center","data": "username","defaultContent": ""},
            {"title":"Edit Date","class":"center","data": "edit_date","defaultContent": ""},
            {"title":"VIN","class":"center","data":null,"render":function(data,type,row){
                //var  str="<i class=\"glyphicon glyphicon-search bigger-130\" title=\"查看详情\" onclick=\"showVinInfo('"+row['id']+"')\" style='color:blue;cursor: pointer;'></i>&nbsp;"+
                var  str="&nbsp;<i class=\"ace-icon fa fa-pencil bigger-130\" title=\"Import\" onclick='importVinInfo("+JSON.stringify(row)+")' style='color:blue;cursor: pointer;'></i>&nbsp;";
            	return str;
                },
            }
        ],
		
	});
}

function importVinInfo(row){
	var project_id=row.id;
	$("#project_no").text(row.project_no+" "+row.project_name+" "+row.quantity +" Bus");
//	if($.fn.dataTable.isDataTable("#tableVinImport")){
//		$('#tableVinImport').DataTable().destroy();
//		$('#tableVinImport').empty();
//	}
	$.ajax({
		url: "getVinListByProject",
		dataType: "json",
		data: {"project_id" : project_id},
		async: false,
		error: function () {},
		success: function (response) {
			$("#project_id").val(project_id);
			var datalist=response.data;
			$.each(datalist,function(index,value){
				var tr=$("<tr/>");
				$("<td style='text-align:center;'/>").html(index).appendTo(tr);
				$("<td style='text-align:center;'/>").html(value.bus_number).appendTo(tr);
				$("<td style='text-align:center;'/>").html(value.VIN).appendTo(tr);
				$("#tableVinImport tbody").append(tr);
			});
			var dialog = $("#dialog-import").removeClass('hide').dialog({
				width:700,
				height:580,
				modal: true,
				title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i> Import VIN </h4></div>",
				title_html: true,
				buttons: [ 
					{
						text: "Close",
						"class" : "btn btn-minier",
						click: function() {
							$("#project_id").val("");
							$( this ).dialog( "close" ); 
						} 
					},
					{
						text: "Save",
						"class" : "btn btn-primary btn-minier",
						click: function() {
							save();
						} 
					},
				]
			});

		},
		complete:function (response){
        	//$(".divLoading").hide();
		}
	})
}
function downloadTemplate(){
	//$("#tableVinImport thead").children("tr").children("th").eq(0).html("No.").css("height","0px");
	//$("#tableVinImport thead").children("tr").children("th").eq(1).html("Bus No.").css("height","0px");
	//$("#tableVinImport thead").children("tr").children("th").eq(2).html("VIN").css("height","0px");
	$("#tableVinImport").tableExport({
		type:'xlsx',fileName:'vin',worksheetName:'vin',
		//excelstyles:['border-bottom', 'border-top', 'border-left', 'border-right']
		});
}
function save() {
	var save_flag=true;
	var trs=$("#tableVinImport tbody").find("tr");
	if(trs.length==0){
		save_flag=false;
		alert("没有可保存的数据");
		return false;
	}
	var project_id=$("#project_id").val();
	var addList=[];
	$.each(trs,function(i,tr){
		var tds=$(tr).children("td");
		var error = $(tds).eq(3).html();
		if(error!=''){
			var item_no = $(tds).eq(0).html();
			save_flag=false;
			alert(item_no+"行 数据存在异常，请修改后在导入");
			return false;
		}
		var bus_number = $(tds).eq(1).html();
		var vin = $(tds).eq(2).html();
		
		var vinArr={};
		vinArr.bus_number=bus_number;
		vinArr.vin=vin;
		vinArr.project_id=project_id;
		addList.push(vinArr);
	});
	if(save_flag){
		$.ajax({
			url:'saveVinInfo',
			method:'post',
			dataType:'json',
			async:false,
			data:{
				"addList":JSON.stringify(addList)
			},
			success:function(response){
	            if(response.success){
	            	
	            	$.gritter.add({
						title: 'Message：',
						text: "<h5>"+response.message+"！</h5>",
						class_name: 'gritter-info'
					});
	            }else{
	            	$.gritter.add({
						title: 'Message：',
						text: "<h5>"+response.message+"！</h5>",
						class_name: 'gritter-info'
					});
	            }
			}
		});
	}
}


