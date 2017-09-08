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
<meta name="description" content="Common Buttons &amp; Icons" />
<meta name="viewport"
	content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />	
<link rel="stylesheet"
	href="../../assets/css/fixedColumns.bootstrap.min.css" />
<link rel="stylesheet"
	href="../../assets/css/fixedColumns.dataTables.min.css" />
<link rel="stylesheet" href="../../assets/css/jquery-ui.min.css" />
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
					<div class="col-xs-12">
					<form action="<%=basePath%>/snaker/flow/process" method="post">
					    <input type="hidden" id="processId" name="processId" value="${processId }" />
						<input type="hidden" id="orderId" name="orderId" value="${orderId }" />
						<input type="hidden" id="taskId" name="taskId" value="${taskId }" />
						<input type="hidden" id="reviewResultId" name="taskId" value="${reviewResultId }" />
						<table id="tableData" class="table table-striped table-bordered table-hover dataTable no-footer"
				            style="font-size: 14px;" role="grid" aria-describedby="tableData_info">
						<tr role="row" class="even">
	                        <th class="sorting_disabled center" rowspan="1" colspan="4" style="width: 96px;">评审信息</th>
						</tr>
						<tr role="row" class="odd">
							<td>&nbsp;技术协议/配置表：</td>
							<td><input id="configTable" name="S_configTable" placeholder="技术协议/配置表..." style="height: 30px;" class="input-medium revise" type="text"></td>
							<td>&nbsp;型材清单：</td>
							<td><input id="proximatematter" name="S_proximatematter" placeholder="型材清单..." style="height: 30px;"class="input-medium revise" type="text"></td>
						</tr>
						<tr role="row" class="even">
							<td>&nbsp;数模评审：</td>
							<td>
							    <input type="radio" value="OK" name="S_modeljudging"/>&nbsp;OK&nbsp;&nbsp;
							    <input type="radio" value="NG" name="S_modeljudging"/>&nbsp;NG
							</td>
							<td>&nbsp;图纸受控前评审：</td>
							<td>
                                <input type="radio" value="OK" name="S_drawingearlierjudging"/>&nbsp;OK&nbsp;&nbsp;
							    <input type="radio" value="NG" name="S_drawingearlierjudging"/>&nbsp;NG
                            </td>
						</tr>
						<tr role="row" class="odd">
							<td>&nbsp;采购明细：</td>
							<td>
							    <input type="radio" value="OK" name="S_purchasedetail"/>&nbsp;OK&nbsp;&nbsp;
							    <input type="radio" value="NG" name="S_purchasedetail"/>&nbsp;NG
							</td>
							<td>&nbsp;资料需求节点：</td>
							<td>
							    <input type="radio" value="OK" name="S_technicaldatanode"/>&nbsp;OK&nbsp;&nbsp;
							    <input type="radio" value="NG" name="S_technicaldatanode"/>&nbsp;NG
							</td>
						</tr>
						<tr role="row" class="even">
							<td>&nbsp;其他：</td>
							<td colspan=3>
							    <textarea id="mintechInfo" name="S_mintechInfo" style="width:580px"></textarea>
							    <input type="hidden" id="technical_operator" name="S_technical.operator" value="${operator }" />
								<input type="hidden" id="technology_operator" name="S_technology.operator" value="${nextOperator }" />
							</td>
						</tr>
						<tr role="row" class="odd">
							<td colspan=3></td>
							<td>
							    <input style="margin-left: 2px;" id="btnSave" class="btn btn-sm btn-primary" type="button" value="提交"/>&nbsp;&nbsp;
							    <input type="button" class="btn btn-sm btn-info" id="btnBack" value="返回" style="margin-left: 2px;"></input>
							</td>
						 </tr>
					 </table>
					 </form>
				</div>
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
            		if($("#technology_operator").val()==""){
            			alert("暂未给用户分配【工艺部评审】角色,无法进行评审");
            			return false;
            		}
            		$.ajax({
            			url: "/BMS/snaker/flow/process",
            			dataType: "json",
            			data: {
            				"configTable" : $("#configTable").val(),
            				"proximatematter" : $("#proximatematter").val(),
            				"modeljudging" : $('input:radio[name="S_modeljudging"]:checked').val(),
            				"drawingearlierjudging" : $('input:radio[name="S_drawingearlierjudging"]:checked').val(),
            				"purchasedetail" : $('input:radio[name="S_purchasedetail"]:checked').val(),
            				"technicaldatanode" : $('input:radio[name="S_technicaldatanode"]:checked').val(),
            				"mintechInfo":$("#mintechInfo").val(),
            				"technical.operator" : $("#technical_operator").val(),
            				"technology.operator" : $("#technology_operator").val(),
            				"processId" : $("#processId").val(),
            				"orderId" : $("#orderId").val(),
            				"taskId" : $("#taskId").val(),
            				"reviewResultId":$("#reviewResultId").val(),
            				"type" : "technical"
            				},
            			error: function () {},
            			success: function (response) {
            				if(response.success){
//             					var orderId=$("#reviewOrderId").val();
//             					var factoryId=$("#factoryId").val();
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
