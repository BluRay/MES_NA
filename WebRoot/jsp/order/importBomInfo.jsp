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
<title>Import BOM</title>
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
					<li class="active">Import BOM</li>
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
							<td>*Project No.：</td>
							<td><input type="text" style="height: 30px;"
								class="input-medium revise"  value="${projectNo}" id="projectNo" readonly="readonly"/>
							    <input type="hidden" value="${projectId}" id="projectId" />
							</td>
							<td>*Document No.：</td>
							<td>
							<input type="text" style="height: 30px;"
								class="input-medium revise" value="${document_no}"  id="documentNo" />
							</td>
<!-- 						</tr> -->
<!-- 						<tr> -->
							<td>*Version：</td>
							<td>
								<input class="input-medium revise" value="${version}" style="height: 30px;" id="version" type="text">
							</td>
							<td>*DCN：</td>
							<td>
							    <input class="input-medium revise" value="${dcn}" style="height: 30px;" id="dcn" type="text">
							</td>
						</tr>
						<tr>
						    <td>*BOM：</td>
							<td colspan=2 style="padding-top:5px">
							    <form id="uploadForm" action="#" enctype="multipart/form-data" method="post">
									<table>
										<tr>
											<td width="150px"><input id="file" type="file" name="file" accept="*.xlsx"/></td>
											<td><input id="btn_upload" style="margin-left:5px;" type="button" class="btn btn-sm btn-primary" value="Import"/></td>
										</tr>
									</table>
						        </form>
							</td>
							<td><a href="../docs/bom.xlsx">Download the pilot template</a></td>
							<td></td>
							<td><input type="button"
								class="btn btn-sm btn-primary btnSave" id="btnSave" value="Save"
								style="margin-right: 2px;"></input>&nbsp;&nbsp;
							<input type="button"
							    class="btn btn-sm btn-primary btnSave" id="btnBack" value="Back"
							    style="margin-right: 2px;"></input>
							</td>
						</tr>
					</table>
				</div>
				<div class="row"  >
					<div class="col-xs-12" style="width: calc(100vw + 17px)">
						<table id="tableResult" class="table table-striped table-bordered table-hover" style="font-size: 12px;table-layout:fixed;width:1200px" >
						    <thead>
						       <tr>
						          <th align="center">Item</th>
						          <th align="center">SAP</th>
						          <th align="center">BYD P/N</th>
						          <th align="center">Part Name</th>
						          <th align="center">Material Specification</th>
						          <th align="center">Unit</th>
						          <th align="center">Quantity</th>
						          <th align="center">English Description</th>
						          <th align="center">Vendor</th>
						          <th align="center">Station Code</th>
						          <th align="center">Note</th>
						          <th align="center">Message</th>
						       </tr>
						    </thead>
						</table>
					</div>
				</div>
            </div>
		</div>
	</div>	
	</div>
	<script src="<%=basePath%>/js/datePicker/WdatePicker.js"></script>
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
	<script src="<%=basePath%>/js/jquery.form.js"></script>
	<script src="<%=basePath%>/assets/js/ace/elements.fileinput.js"></script>
    <script src="<%=basePath%>/js/order/importBomInfo.js"></script>
</body>

</html>
