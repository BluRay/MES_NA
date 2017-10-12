var extArray = new Array(".xls");
var json_keyParts=null;
$(document).ready(function(){
	initPage();
	$("#btnQuery").on("click",function(){
		ajaxQuery();
	}); 

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/MES/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})
	$(document).on("input","#search_project_no",function(){
		$("#search_project_no").attr("order_id","");
	});
	$("#btn_upload").click (function () {
		$(".divLoading").addClass("fade in").show();
		$("#uploadForm").ajaxSubmit({
			url:"uploadKeyPartsFile",
			type: "post",
			dataType:"json",
			success:function(response){
				if(response.success){	
					if($.fn.dataTable.isDataTable("#keyPartsTable")){
						$('#keyPartsTable').DataTable().destroy();
						$('#keyPartsTable').empty();
					}
					var datalist=response.data;
					var columns=[
			            {"title":"Item No.","class":"center","data":"item_no","defaultContent": ""},
			            {"title":"SAP Material","class":"center","data":"sap_material","defaultContent": ""},
			            {"title":"Part Name","class":"center","data": "parts_name","defaultContent": ""},
			            {"title":"BYD_P/N","class":"center","data":"byd_pn","defaultContent": ""},
			            {"title":"Vendor","class":"center","data": "vendor","defaultContent": ""},
			            {"title":"Workshop","class":"center","data": "workshop","defaultContent": ""},
			            {"title":"Station","class":"center","data": "station","defaultContent": ""},
			            {"title":"","class":"center","data": "error","defaultContent": ""}
			        ];

					$("#keyPartsTable").DataTable({
						paiging:false,
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
			                "aTargets" :[7],
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
				$(".divLoading").hide();
			}			
		});
	});
	
})

function initPage(){
	getBusNumberSelect('#nav-search-input');
	getBusTypeSelect('','#search_bus_type','All','id');
	getOrderNoSelect("#search_project_no","#orderId",null,$('#search_bus_type').val());
	ajaxQuery();
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
}


function ajaxQuery(){

	$("#tableResult").DataTable({
		serverSide: true,
		rowsGroup:[0,1],
		paiging:true,
		ordering:false,
		searching: false,
		bAutoWidth:false,
		destroy: true,
		sScrollY: $(window).height()-250,
		scrollX: true,
		pageLength: 20,
		pagingType:"full_numbers",
		lengthChange:false,
		orderMulti:false,
		language: {	
		},
		ajax:function (data, callback, settings) {
			var param ={
					"draw":1,
					"bus_type":$("#search_bus_type").find("option:selected").text(),
					"project_no":$("#search_project_no").val()
				};
            param.length = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;//开始的记录序号
            param.page = (data.start / data.length)+1;//当前页码

            $.ajax({
                type: "post",
                url: "getProjectKeyPartsTemplateList",
                cache: false,  //禁用缓存
                data: param,  //传入组装的参数
                dataType: "json",
                success: function (result) {
                    //console.log(result);
                	//封装返回数据
                    var returnData = {};
                    returnData.draw = data.draw;//这里直接自行返回了draw计数器,应该由后台返回
                    returnData.recordsTotal = result.recordsTotal;//返回数据全部记录
                    returnData.recordsFiltered = result.recordsTotal;//后台不实现过滤功能，每次查询均视作全部结果
                    returnData.data = result.data;//返回的数据列表
                    //console.log(returnData);
                    //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                    //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                    callback(returnData);

                }
            });
		
		},
		columns: [
		          	{"title":"Bus Type","class":"center","data":"bus_type","defaultContent": ""},
		            {"title":"Project No.","class":"center","data":"order_desc","defaultContent": ""},
		            {"title":"Version","class":"center","data":"version","defaultContent": ""},
		            {"title":"Editor","class":"center","data": "editor","defaultContent": ""},
		            {"title":"Edit Date","class":"center","data":"edit_date","defaultContent": ""},		            	            
		            {"title":"","class":"center","data":"order_id","render":function(data,type,row){
		            	return "<i class=\"glyphicon glyphicon-search bigger-130 showbus\" title='Display' onclick = 'showInfoPage(" + JSON.stringify(row)+");' style='color:blue;cursor: pointer;'></i>&nbsp;&nbsp;&nbsp;" 
		            	}
		            },{"title":"","class":"center","data":"order_id","render":function(data,type,row){
		            	return "<i class=\"ace-icon fa fa-upload bigger-130 editorder\" title='Import' onclick = 'showEditPage(" + JSON.stringify(row)+ ");' style='color:green;cursor: pointer;'></i>";
		            	}
		            }
		          ]
	});

}

function showEditPage(row){
		$("#order").html(row.order_desc);
	
		//drawKeyPartsTable("#keyPartsTable");
		var dialog = $( "#dialog-config" ).removeClass('hide').dialog({
			width:1100,
			height:550,
			modal: true,
			title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i> Import Bus traceTemplate </h4></div>",
			title_html: true,
			buttons: [ 
				{
					text: "Cancel",
					"class" : "btn btn-minier",
					click: function() {
						$( this ).dialog( "close" ); 
					} 
				},
				{
					text: "Confirm",
					"class" : "btn btn-primary btn-minier",
					click: function() {
						save(row.id,row.version); 
						$( this ).dialog( "close" ); 
					} 
				}
			]
		});
}

function save(project_id,version) {
	var save_flag=true;
	var trs=$("#keyPartsTable tbody").find("tr");
	if(trs.length==0){
		save_flag=false;
		alert("没有可保存的数据");
		return false;
	}
	var addList=[];
	$.each(trs,function(i,tr){
		var tds=$(tr).children("td");
		var error = $(tds).eq(7).html();
		if(error!=''){
			var item_no = $(tds).eq(0).html();
			save_flag=false;
			alert("Item:"+item_no+" 数据存在异常，请修改后在导入");
			return false;
		}
		var item_no = $(tds).eq(0).html();
		var sap_material = $(tds).eq(1).html();
		var parts_name = $(tds).eq(2).html();
		var byd_pn = $(tds).eq(3).html();
		var vendor = $(tds).eq(4).html();
		var workshop = $(tds).eq(5).html();
		var station = $(tds).eq(6).html();
		var keyparts={};
		keyparts.item_no=item_no;
		keyparts.sap_material=sap_material;
		keyparts.byd_pn=byd_pn;
		keyparts.parts_name=parts_name;
		keyparts.vendor=vendor;
		keyparts.workshop=workshop;
		keyparts.station=station;
		addList.push(keyparts);
	});
	if(save_flag){
		$.ajax({
			url:'saveKeyPartsTemplateInfo',
			method:'post',
			dataType:'json',
			async:false,
			data:{
				"addList":JSON.stringify(addList),
				"project_id":project_id,
				"version":version
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

function showInfoPage(row){
	$("#order_view").html(row.order_desc);
	var project_id=row.id;
	var version=row.version;
	$.ajax({
		type: "post",
        url: "getKeyPartsList",
        cache: false,  //禁用缓存
        data: {
        	"project_id":project_id,
        	"version":version
        },  //传入组装的参数
        dataType: "json",
        success: function (response) {
        	drawKeyPartsTable("#keyPartsTable_view",response.data);
        }
	});
	
	//show dialog
	var dialog = $( "#dialog-config-view" ).removeClass('hide').dialog({
		width:1100,
		height:550,
		modal: true,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i> Display Bus traceTemplate</h4></div>",
		title_html: true,
		buttons: [ 
			
			{
				text: "Close",
				"class" : "btn btn-primary btn-minier",
				click: function() {
					$( this ).dialog( "close" ); 
				} 
			}
		]
	});
}
function drawKeyPartsTable(tableId,data){
	$(tableId).dataTable({
		paiging:false,
		ordering:false,
		searching: false,
		autoWidth:false,
		destroy: true,
		paginate:false,
		//sScrollY: $(window).height()-250,
		scrollX: true,
		scrollCollapse: false,
		lengthChange:false,
		orderMulti:false,
		info:false,
		language: {
		},
		columnDefs: [{
            "searchable": false,
            "orderable": false,
            "targets": 0
        }],
		data:data||{},
		columns: [
		            {"title":"Item No.","class":"center","data":"item_no","defaultContent": ""},
		            {"title":"SAP No.","class":"center","data":"sap_material","defaultContent": ""},
		            {"title":"Parts Name","class":"center","data": "parts_name","defaultContent": ""},
		          //  {"title":"材料/规格","class":"center","data":"size","defaultContent": ""},		            	            
		            {"title":"Vendor","class":"center","data": "vendor","defaultContent": ""},
		            {"title":"Workshop","class":"center","data":"workshop","defaultContent":""},
		            {"title":"Station","class":"center","data":"station","defaultContent": ""},	
//		            {"title":"3C件","class":"center","data":"ccc","defaultContent": "","width":"6%"},
//		            {"title":"3C编号","class":"center","data":"cccNo","defaultContent": ""},	
		          ]	
	});
}

