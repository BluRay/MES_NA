<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
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
<link rel="stylesheet" href="../../assets/css/jquery-ui.min.css" />
<link rel="stylesheet" href="../../assets/css/jquery-ui.custom.min.css" />
<link rel="stylesheet" href="../../assets/css/jquery.gritter.css" />
<link rel="stylesheet" href="<%=basePath%>/assets/css/bootstrap.min.css" />
<link rel="stylesheet" href="<%=basePath%>/assets/css/font-awesome.min.css" />
<meta name="description" content="Common Buttons &amp; Icons" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
</head>
<body class="no-skin" style="font-family: 'Microsoft YaHei';">
	
	<!-- 身  -->
	<!-- 主体 -->
		<div class="main-content">
			<!-- 路径和搜索框 -->
			<div class="main-content-inner">
				<div class="page-content">
					<form action="<%=basePath%>/snaker/flow/process" method="post">
					    <input type="hidden" id="processId" name="processId" value="${processId }" />
						<input type="hidden" id="orderId" name="orderId" value="${orderId }" />
						<input type="hidden" id="taskId" name="taskId" value="${taskId }" />
						<input type="hidden" id="reviewResultId" name="reviewResultId" value="${reviewResultId }" />
						<table id="tableData" class="table table-striped table-bordered table-hover dataTable no-footer"
                            style="font-size: 14px;" role="grid" aria-describedby="tableData_info">
							<tr role="row" class="even">
		                        <th class="sorting_disabled center" rowspan="1" colspan="4" style="width: 96px;">评审信息</th>
							</tr>
							<tr role="row" class="odd">
							    <td>&nbsp;资料需求节点：</td>
								<td>
									<input type="radio" value="OK" name="S_materialcontrolNode"/>&nbsp;&nbsp;OK &nbsp;&nbsp;&nbsp;
							        <input type="radio" value="NG" name="S_materialcontrolNode"/>&nbsp;&nbsp;NG &nbsp;&nbsp;&nbsp;
							        <input type="radio" value="待评审" name="S_materialcontrolNode"/>&nbsp;&nbsp;待评审
								</td>
							</tr>
							<tr role="row" class="even">
								<td>&nbsp;其他：</td>
								<td colspan=2>
								<textarea id="materialcontrolInfo" name="S_materialcontrolInfo" style="width: 580px;" placeholder="..." rows="3"></textarea>
								</td>
							</tr>
							<tr role="row" class="odd">
								<td></td>
								<td align="right">
									<input type="hidden" id="planning_operator" name="S_planning.operator" value="${operator }" />
						            <input type="hidden" id="plandep_operator" name="S_plandep.operator" value="${nextOperator }" />
									<input id="btnSave" type="button" class="btn btn-sm btn-primary" value="评审" style="margin-left: 2px;"></input>&nbsp;
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
		<script src="../../assets/js/jquery-ui.min.js"></script>
		<script src="../../assets/js/jquery.gritter.min.js"></script>
		<script src="../../assets/js/jquery.dataTables.min.js"></script>
		<script src="../../assets/js/jquery.dataTables.bootstrap.js"></script>
		<script src="../../assets/js/dataTables.rowGroup.js"></script>
        <script src="../../assets/js/bootstrap3-typeahead.js"></script>
		<script src="../../js/jquery.form.js"></script>
		<script src="../../js/common.js"></script>
		<script src="../../assets/js/fuelux/fuelux.tree.min.js"></script>
		<script type="text/javascript">
            $(function(){
            	$("#btnSave").click(function(){
            		if($("#plandep_operator").val()==""){
            			alert("暂未给用户分配【综合计划部计划评审】角色,无法进行评审");
            			return false;
            		}
            		$.ajax({
            			url: "/BMS/snaker/flow/process",
            			dataType: "json",
            			data: {
            				"materialcontrolNode" : $('input:radio[name="S_materialcontrolNode"]:checked').val(),
            				"materialcontrolInfo":$("#materialcontrolInfo").val(),
            				"plandep.operator" : $("#plandep_operator").val(),
            				"planning.operator" : $("#planning_operator").val(),
            				"processId" : $("#processId").val(),
            				"orderId" : $("#orderId").val(),
            				"taskId" : $("#taskId").val(),
            				"reviewResultId":$("#reviewResultId").val(),
            				"type" : "planning"
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
            		window.open("<%=basePath%>/order/review/internalReview","_parent");
                });
            })
        </script>
    </body>
</html>
