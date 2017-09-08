<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
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
			    <c:forEach items="${vars}" var="item">
				<table id="tableData" class="table table-striped table-bordered table-hover dataTable no-footer"
				            style="font-size: 14px;" role="grid" aria-describedby="tableData_info">
					<tr role="row" class="even">
                        <th class="sorting_disabled center" rowspan="1" colspan="4" style="width: 96px;">评审结果</th>
					</tr>
					<tr role="row" class="odd">
						<td>&nbsp;资料需求节点：</td>
						<td>&nbsp;${item['qualityNode'] }</td>
						<td>&nbsp;其他：</td>
						<td>&nbsp;${item['qualityInfo'] }</td>	
					</tr>
					<tr>
						<td colspan=6 align="right">
                          <input type="button" class="btn btn-sm btn-info" id="btnBack" value="返回" style="margin-left: 2px;"></input>&nbsp;&nbsp;&nbsp;
                       </td>
					</tr>	
				 </table>
				 </c:forEach>
			</div>
		<!-- /.main-container &nbsp;${item['reason'] } -->
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
		    	$("#btnBack").click(function(){
            		window.open("/BMS/order/review/internalReview","_parent");
                });
		    });
		</script>
	</div>

</body>

</html>
