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
<title>Bom Display </title>
<meta name="description" content="Common Buttons &amp; Icons" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
<link rel="stylesheet" href="<%=basePath%>/assets/css/fixedColumns.bootstrap.min.css" />
<link rel="stylesheet" href="<%=basePath%>/assets/css/fixedColumns.dataTables.min.css" />
<link rel="stylesheet" href="<%=basePath%>/assets/css/jquery-ui.min.css" />
<link rel="stylesheet" href="<%=basePath%>/assets/css/jquery.gritter.css" /> 

</head>
<body class="no-skin" style="font-family: 'Microsoft YaHei';">
	<!-- 头 -->
	<jsp:include page="../top.jsp" flush="true" />
	<!-- 身 -->
	<div class="main-container" id="main-container">
		<!-- 左边菜单 -->
		<jsp:include page="../left.jsp" flush="true" />
		<!-- 主体 -->
		<div class="main-content">
			<!-- 路径和搜索框 -->
			<div class="main-content-inner">
			<div class="breadcrumbs ace-save-state" id="breadcrumbs">
				<ul class="breadcrumb">
					<li><i class="ace-icon fa fa-home home-icon"></i><a
						href="/BMS/index">index</a></li>
					<li class="active">Project Bom</li>
					<li class="active">Bom Display</li>
				</ul>
				<!-- /.breadcrumb -->

				<div class="nav-search" id="nav-search">
					<form class="form-search">
							<span class="input-icon">
								<input type="text" placeholder="Search ..." class="nav-search-input" id="nav-search-input" autocomplete="off" /><i class="ace-icon fa fa-search nav-search-icon"></i>
							</span>
					</form>
				</div>
				<!-- /.nav-search -->
			</div>

			<div class="page-content">
				<div id="form" class="well form-search">
					<table>
						<tr>
							<td>Project No：</td>
							<td><input type="text" style="height: 30px;"
								class="input-medium revise"  value="${projectNo }" id="search_project_no" /></td>
							<td>SAP No.：</td>
							<td>
								<input type="text" style="height: 30px;"
								class="input-medium revise"  value="" id="search_sap_no" />
							</td>
							<td>Station：</td>
							<td>
								<input class="input-small"  style="height: 30px;" id="search_station_code" type="text">
							</td>
						    <td><input type="button"
								class="btn btn-sm btn-primary btnQuery" id="btnQuery" value="Search"
								style="margin-left: 2px;"></input>
							</td>
						</tr>
						<tr>
							<td colspan=6>
								<label>
									<input name="type" type="radio" value="0" />&nbsp;display the current version 
								</label> 
<!-- 							</td> -->
<!-- 							<td colspan=2> -->
								<label>
									<input name="type" type="radio" value="1" />&nbsp;compare with the previous version
								</label> 
<!-- 							</td> -->
<!-- 							<td colspan=2> -->
								<label>
									<input name="type" type="radio" value="2" />&nbsp;show the difference 
								</label> 
							</td>
							
						</tr>
					</table>
				</div>

				<div class="row"  >
					<div class="col-xs-12" style="width: calc(100vw + 15px)">
						<table id="tableResult" class="table table-striped table-bordered table-hover" style="font-size: 12px;" >
						</table>
					</div>
				</div>
            </div>
		</div>
	</div>	
	</div>
	<script src="<%=basePath%>/assets/js/jquery-ui.min.js"></script>
	<script src="<%=basePath%>/assets/js/jquery.gritter.min.js"></script>
	<script src="<%=basePath%>/assets/js/jquery.dataTables.min.js"></script>
	<script src="<%=basePath%>/assets/js/jquery.dataTables.bootstrap.js"></script>
	<script src="<%=basePath%>/assets/js/dataTables.fixedColumns.min.js"></script>
	<script src="<%=basePath%>/assets/js/dataTables.rowGroup.js"></script>
	<script src="<%=basePath%>/assets/js/ace/elements.onpage-help.js"></script>
	<script src="<%=basePath%>/assets/js/ace/ace.onpage-help.js"></script>
	<script src="<%=basePath%>/assets/js/bootstrap3-typeahead.js"></script>
	<script src="<%=basePath%>/js/jsrender.min.js"></script>
	<script src="<%=basePath%>/js/common.js"></script>
	<script src="<%=basePath%>/js/tableExport.js"></script>
    <script src="<%=basePath%>/js/order/showBomInfo.js"></script>
</body>

</html>
