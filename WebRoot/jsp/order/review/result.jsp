<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<%String path = request.getContextPath();String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";%>
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
		<div class="main-content">
			<!-- 路径和搜索框 -->
			<div class="main-content-inner">
				
				<div class="page-content">
					<form action="<%=basePath%>snaker/flow/process" method="post">
					<input type="hidden" id="processId" name="processId" value="${processId}" />
					<input type="hidden" id="orderId" name="orderId" value="${orderId}" />
					<input type="hidden" id="taskId" name="taskId" value="${taskId}" />
					<input type="hidden" id="reviewResultId" name="reviewResultId" value="${reviewResultId }" />
					<table id="tableData" class="table table-striped table-bordered table-hover dataTable no-footer"
					            style="font-size: 14px;" role="grid">
						 <tr role="row" class="odd">
				            <th class="sorting_disabled center" rowspan="1" colspan="6" style="width: 96px;">订单启动节点</th>
						 </tr>
						 <tr role="row" class="odd">
				            <td>&nbsp;部件上线：</td>
							<td><input id="revisionpartsonlineDate" name="S_partsonlineDate" onClick="WdatePicker({el:'revisionpartsonlineDate',dateFmt:'yyyy-MM-dd'});" placeholder="部件上线..." style="width:120px" class="col-sm-10" type="text"></td>
							<td>&nbsp;焊装上线：</td>
							<td><input id="revisionweldingonlineDate" name="S_weldingonlineDate"  onClick="WdatePicker({el:'revisionweldingonlineDate',dateFmt:'yyyy-MM-dd'});" placeholder="焊装上线..." style="width:120px" class="col-sm-10" type="text"></td>
							<td>&nbsp;涂装上线：</td>
							<td><input id="revisionpaintonlineDate" name="S_paintonlineDate" onClick="WdatePicker({el:'revisionpaintonlineDate',dateFmt:'yyyy-MM-dd'});" placeholder="涂装上线..." style="width:120px" class="col-sm-10" type="text"></td>
						</tr>
						<tr>
						    <td>&nbsp;底盘上线：</td>
							<td><input id="revisionchassisonlineDate" name="S_chassisonlineDate" onClick="WdatePicker({el:'revisionchassisonlineDate',dateFmt:'yyyy-MM-dd'});" placeholder="底盘上线..." style="width:120px" class="col-sm-10" type="text"></td>
							<td>&nbsp;总装上线：</td>
							<td><input id="revisionassemblyonlineDate" name="S_assemblyonlineDate" onClick="WdatePicker({el:'revisionassemblyonlineDate',dateFmt:'yyyy-MM-dd'});" placeholder="总装上线..." style="width:120px" class="col-sm-10" type="text"></td>
							<td>&nbsp;全部入库：</td>
							<td><input id="revisionwarehousingDate" name="S_warehousingDate" onClick="WdatePicker({el:'revisionwarehousingDate',dateFmt:'yyyy-MM-dd'});" placeholder="全部入库..." style="width:120px" class="col-sm-10" type="text"></td>
						</tr>
					
						 <tr role="row" class="odd">
				            <th class="sorting_disabled center" rowspan="1" colspan="6" style="width: 96px;">材料需求节点</th>
						 </tr>
						 <tr>
							<td>&nbsp;下料明细：</td>
							<td><input id="revisiondetailNode" name="S_revisiondetailNode" onClick="WdatePicker({el:'revisiondetailNode',dateFmt:'yyyy-MM-dd'});" placeholder="下料明细..." style="width:120px" class="col-sm-10" type="text"></td>
							<td>&nbsp;BOM：</td>
							<td><input id="revisionbomNode" name="S_revisionbomNode" onClick="WdatePicker({el:'revisionbomNode',dateFmt:'yyyy-MM-dd'});" placeholder="BOM..." style="width:120px" class="col-sm-10" type="text"></td>
						    <td></td><td></td>
						</tr>
						 <tr role="row" class="odd">
							<td>&nbsp;SOP：</td>
							<td><input id="revisionsopNode" name="S_revisionsopNode" onClick="WdatePicker({el:'revisionsopNode',dateFmt:'yyyy-MM-dd'});" placeholder="SOP..." style="width:120px" class="col-sm-10" type="text"></td>
							<td>&nbsp;SIP：</td>
							<td><input id="revisionsipNode" name="S_revisionsipNode" onClick="WdatePicker({el:'revisionsipNode',dateFmt:'yyyy-MM-dd'});" placeholder="SIP..." style="width:120px" class="col-sm-10" type="text"></td>
						
						    <td colspan=2 style="align:right">
						        <input type="hidden"  id="result_operator" class="input_240" name="S_result.operator" value="${operator }" />
						        <input type="button" class="btn btn-sm btn-info" id="btnSave" value="提交" style="margin-left: 2px;"></input>
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
            		$.ajax({
            			url: "/BMS/snaker/flow/process",
            			dataType: "json",
            			data: {
            				"revisionpartsonlineDate" : $("#revisionpartsonlineDate").val(),
            				"revisionweldingonlineDate" : $("#revisionweldingonlineDate").val(),
            				"revisionpaintonlineDate" : $("#revisionpaintonlineDate").val(),
            				"revisionchassisonlineDate" : $("#revisionchassisonlineDate").val(),
            				"revisionassemblyonlineDate" : $("#revisionassemblyonlineDate").val(),
            				"revisionwarehousingDate" : $("#revisionwarehousingDate").val(),
            				"revisiondetailNode" : $("#revisiondetailNode").val(),
            				"revisionbomNode" : $("#revisionbomNode").val(),
            				"revisionsopNode" : $("#revisionsopNode").val(),
            				"revisionsipNode" : $("#revisionsipNode").val(),
            				"result.operator" : $("#result_operator").val(),
            				"processId" : $("#processId").val(),
            				"orderId" : $("#orderId").val(),
            				"taskId" : $("#taskId").val(),
            				"reviewResultId" : $("#reviewResultId").val(),
            				"factoryId" : $("#factoryId").val(),
            				"type" : "result"
            				},
            			error: function () {},
            			success: function (response) {
            				if(response.success){
            					var url="<%=basePath%>/order/review/internalReview?message=success";
            					window.open(url,"_parent");
//             					alert("提交成功");
//             					$("#btnSave").attr("disabled",true);
            				}else{
            					alert("提交失败");
            				}
            			}
            		})
            	});
            	$("#btnBack").click(function(){
            		window.open("/BMS/order/review/internalReview","_parent");
                });
            })
        </script>
   </body>

</html>
