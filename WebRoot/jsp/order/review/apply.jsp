<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<%
String path = request.getContextPath();
String rqip= request.getRemoteAddr();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path;
%>
<html lang="zh-CN">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta charset="utf-8" />
<title>评审发起</title>
<meta name="description" content="Common Buttons &amp; Icons" />
<meta name="viewport"
	content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />	
<link rel="stylesheet" href="../../assets/css/jquery-ui.min.css" />
<link rel="stylesheet" href="../../assets/css/jquery-ui.custom.min.css" />
<link rel="stylesheet" href="../../assets/css/jquery.gritter.css" />
<link rel="stylesheet" href="../../assets/css/bootstrap.min.css" />
</head>
<body class="no-skin" style="font-family: 'Microsoft YaHei';">
	
	<!-- 身  -->
	<!-- 主体 -->
		<div class="main-content">
			<!-- 路径和搜索框 -->
			<div class="main-content-inner">
				
				<div class="page-content">
					<form action="<%=basePath%>/snaker/flow/process" method="post"> <!-- b103b4fc137743979aa248307c4bf553 -->
					<input type="hidden" id="processId" name="processId" value="${processId}" />
					<input type="hidden" id="orderId" name="orderId" value="${orderId}" />
					<input type="hidden" id="taskId" name="taskId" value="${taskId}" />
					<input type="hidden" id="reviewOrderId" name="reviewOrderId" value="${reviewOrderId}"/>
					<input type="hidden" id="factoryId" name="factoryId" value="${factoryId }"/>
					<table id="tableData" class="table table-striped table-bordered table-hover dataTable no-footer"
					            style="font-size: 14px;" role="grid">
						 <tr role="row" class="odd">
				            <th class="sorting_disabled center" rowspan="1" colspan="6" style="width: 96px;">订单启动节点</th>
						 </tr>
						 <tr role="row" class="odd">
				            <td>&nbsp;部件上线：</td>
							<td><input id="partsonlineDate" name="S_partsonlineDate" onClick="WdatePicker({el:'partsonlineDate',dateFmt:'yyyy-MM-dd'});" placeholder="部件上线..." style="width:120px" class="col-sm-10" type="text"></td>
							<td>&nbsp;焊装上线：</td>
							<td><input id="weldingonlineDate" name="S_weldingonlineDate"  onClick="WdatePicker({el:'weldingonlineDate',dateFmt:'yyyy-MM-dd'});" placeholder="焊装上线..." style="width:120px" class="col-sm-10" type="text"></td>
							<td>&nbsp;涂装上线：</td>
							<td><input id="paintonlineDate" name="S_paintonlineDate" onClick="WdatePicker({el:'paintonlineDate',dateFmt:'yyyy-MM-dd'});" placeholder="涂装上线..." style="width:120px" class="col-sm-10" type="text"></td>
						</tr>
						<tr>
						    <td>&nbsp;底盘上线：</td>
							<td><input id="chassisonlineDate" name="S_chassisonlineDate" onClick="WdatePicker({el:'chassisonlineDate',dateFmt:'yyyy-MM-dd'});" placeholder="底盘上线..." style="width:120px" class="col-sm-10" type="text"></td>
							<td>&nbsp;总装上线：</td>
							<td><input id="assemblyonlineDate" name="S_assemblyonlineDate" onClick="WdatePicker({el:'assemblyonlineDate',dateFmt:'yyyy-MM-dd'});" placeholder="总装上线..." style="width:120px" class="col-sm-10" type="text"></td>
							<td>&nbsp;全部入库：</td>
							<td><input id="warehousingDate" name="S_warehousingDate" onClick="WdatePicker({el:'warehousingDate',dateFmt:'yyyy-MM-dd'});" placeholder="全部入库..." style="width:120px" class="col-sm-10" type="text"></td>
						</tr>
					    <tr role="row" class="odd">
				            <th class="sorting_disabled center" rowspan="1" colspan="6" style="width: 96px;">资料需求节点</th>
                         </tr>
						 <tr>
						    <td>&nbsp;数模输出时间：</td>
							<td><input id="modelexportDate" name="S_modelexportDate" onClick="WdatePicker({el:'modelexportDate',dateFmt:'yyyy-MM-dd'});" placeholder="数模输出时间..." style="width:120px" class="col-sm-10" type="text"></td>
							<td>&nbsp;下料明细：</td>
							<td><input id="detaildemandNode" name="S_detaildemandNode" onClick="WdatePicker({el:'detaildemandNode',dateFmt:'yyyy-MM-dd'});" placeholder="下料明细时间..." style="width:120px" class="col-sm-10" type="text"></td>
							<td>&nbsp;BOM：</td>
							<td><input id="bomdemandNode" name="S_bomdemandNode" onClick="WdatePicker({el:'bomdemandNode',dateFmt:'yyyy-MM-dd'});" placeholder="BOM时间..." style="width:120px" class="col-sm-10" type="text"></td>
						</tr>
						 <tr role="row" class="odd">
				            <td>&nbsp;图纸输出时间：</td>
							<td><input id="drawingexportDate" name="S_drawingexportDate" onClick="WdatePicker({el:'drawingexportDate',dateFmt:'yyyy-MM-dd'});"placeholder="图纸输出时间..." style="width:120px" class="col-sm-10" type="text"></td>
							<td>&nbsp;SOP：</td>
							<td><input id="sopdemandNode" name="S_sopdemandNode" onClick="WdatePicker({el:'sopdemandNode',dateFmt:'yyyy-MM-dd'});" placeholder="SOP时间..." style="width:120px" class="col-sm-10" type="text"></td>
							<td>&nbsp;SIP：</td>
							<td><input id="sipdemandNode" name="S_sipdemandNode" onClick="WdatePicker({el:'sipdemandNode',dateFmt:'yyyy-MM-dd'});" placeholder="SIP时间..." style="width:120px" class="col-sm-10" type="text"></td>
						</tr>
						
                        <tr>
						    <td colspan=6 align="right">
						        <input type="hidden"  id="apply_operator" name="S_apply.operator" value="${operator }" />
				                <input type="hidden" id="technical_operator" name="S_technical.operator" value="${nextOperator }" />
						        <input type="button" class="btn btn-sm btn-info" id="btnSave" value="提交" style="margin-left: 2px;"></input>&nbsp;
						        <input type="button" class="btn btn-sm btn-info" id="btnBack" value="返回" style="margin-left: 2px;"></input>&nbsp;&nbsp;&nbsp;
						    </td>
						</tr>
					</table>
					</form>
                </div>
			</div>
			<!-- /.main-container -->
		</div>
		<script src="../../js/jquery-2.1.0.min.js"></script>
		<script src="../../js/datePicker/WdatePicker.js"></script>
		<script src="../../assets/js/jquery-ui.min.js"></script>
		<script src="../../assets/js/jquery.gritter.min.js"></script>
		<script src="../../assets/js/jquery.dataTables.min.js"></script>
		<script src="../../assets/js/jquery.dataTables.bootstrap.js"></script>
		<script src="../../assets/js/bootstrap3-typeahead.js"></script>
		<script src="../../js/jquery.form.js"></script>
		<script src="../../js/common.js"></script>
        <script type="text/javascript">
            $(function(){
            	$("#btnSave").click(function(){
            		if($("#technical_operator").val()==""){
            			alert("暂未给用户分配【技术部评审】角色,无法发起评审");
            			return false;
            		}
            		$.ajax({
            			url: "/BMS/snaker/flow/process",
            			dataType: "json",
            			data: {
            				"partsonlineDate" : $("#partsonlineDate").val(),
            				"weldingonlineDate" : $("#weldingonlineDate").val(),
            				"paintonlineDate" : $("#paintonlineDate").val(),
            				"chassisonlineDate" : $("#chassisonlineDate").val(),
            				"assemblyonlineDate" : $("#assemblyonlineDate").val(),
            				"warehousingDate" : $("#warehousingDate").val(),
            				"modelexportDate" : $("#modelexportDate").val(),
            				"detaildemandNode" : $("#detaildemandNode").val(),
            				"bomdemandNode" : $("#bomdemandNode").val(),
            				"drawingexportDate" : $("#drawingexportDate").val(),
            				"sopdemandNode" : $("#sopdemandNode").val(),
            				"sipdemandNode" : $("#sipdemandNode").val(),
            				"apply.operator" : $("#apply_operator").val(),
            				"technical.operator" : $("#technical_operator").val(),
            				"technology.operator" : $("#technology_operator").val(),
            				"quality.operator" : $("#quality_operator").val(),
            				"processId" : $("#processId").val(),
            				"orderId" : $("#orderId").val(),
            				"taskId" : $("#taskId").val(),
            				"reviewOrderId" : $("#reviewOrderId").val(),
            				"factoryId" : $("#factoryId").val(),
            				"type" : "apply"
            				},
            			error: function () {},
            			success: function (response) {
            				if(response.success){
//             					var orderId=$("#reviewOrderId").val();
//             					var factoryId=$("#factoryId").val();
//             					orderId="+orderId+"&factoryId="+factoryId+"&
            					var url="<%=basePath%>/order/review/internalReview?message=success";
            					window.open(url,"_parent");
            				}else{
            					alert("提交失败");
            				}
            			}
            		})
            	});
            	$("#btnBack").click(function(){
            		window.open("<%=basePath%>/order/review/internalReview","_parent");
                });
            })
        </script>
   </body>

</html>
