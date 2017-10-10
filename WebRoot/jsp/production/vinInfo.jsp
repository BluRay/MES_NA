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
<title>VIN</title>
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
					<li class="active">Production</li>
					<li class="active">VIN</li>
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
								class="input-medium revise"  value="" id="search_project_no" /></td>
							<td>Status：</td>
							
							<td><select id="search_status" class="input-medium revise">
								<option value=''>ALL</option>
								<option value='0'>Created</option>
								<option value='1'>In Process</option>
								<option value='2'>Completed</option>
								</select>
							</td>
							<td>Plant：</td>
							<td><select name="" id="search_factory" class="input-small">
							</select>	
							</td>
							<td><input type="button"
								class="btn btn-sm btn-primary btnQuery" id="btnQuery" value="Search"
								style="margin-left: 2px;"></input>
						</tr>
					</table>
				</div>

				<div class="row">
					<div class="col-xs-12"  style="width:100%">
						<table id="tableResult" class="table table-striped table-bordered table-hover" style="font-size: 12px;" >
						</table>
					</div>
				</div>
				<div id="dialog-show" class="hide" style="width: calc(100vw + 10px)">
				    <table id="tableVin" style="font-size: 12px;width:655px;" class="table table-bordered table-striped">
					</table>
				</div>
				<div id="dialog-import" class="hide" style="width: calc(100vw + 10px)">
					<div id="create_form" class="form-horizontal">
						<div class="form-group">
							<label class="col-sm-2 control-label no-padding-right" for="" >&nbsp;*Project No.：</label>
							<label id="project_no" class="col-sm-4  no-padding-left"  style="margin-left:15px;"></label>
						    <input type="hidden" id="project_id" value=''>
						</div>
						<div class="form-group">					
							<label class="col-sm-2 control-label no-padding-right no-padding-right" for="editOrderCode">*&nbsp;VIN：</label>
							<div class="col-sm-9">
								<form id="uploadForm" action="" enctype="multipart/form-data" method="post">
									<div class="col-sm-4">
										<input id="file" style="margin-left: -10px;padding:0px 0px;font-size: 12px" class="btn btn-info btn-small" name="file" accept=".xlsx" type="file">&nbsp;&nbsp;				
									</div>
									<div class="col-sm-4">
										&nbsp;<input id="btn_upload" style="padding:0px 0px;font-size: 12px;height:30px" class="btn btn-primary" value="Import" onclick="javascript:return upload(this.form, this.form.file.value)" type="button"> 
									</div>
									<div class="col-sm-4">
										&nbsp;<a onclick="downloadTemplate()" style="cursor:pointer;">Download template</a>
									</div>								
								</form>
							</div>									
						</div>
						<table id="tableVinImport" style="font-size: 12px;width:655px" class="table table-bordered table-striped">
			                <thead>
			                    <tr>
			                        <th style="text-align:center;">No.</th>
			                        <th style="text-align:center;">Bus No.</th>
			                        <th style="text-align:center;">VIN</th>
			                    </tr>
			                </thead>
			                <tbody>
			                </tbody>
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
	<script src="<%=basePath%>/js/jquery.form.js"></script>
	<script src="<%=basePath%>/js/xlsx.core.min.js"></script>
<%-- 	<script src="<%=basePath%>/js/xlsx.js"></script> --%>
<%-- 	<script src="<%=basePath%>/js/jszip.js"></script> --%>
	<script src="<%=basePath%>/js/FileSaver.js"></script>
	<script src="<%=basePath%>/js/tableExport.js"></script>
	<script src="<%=basePath%>/assets/js/ace/elements.fileinput.js"></script>
    <script src="<%=basePath%>/js/production/vinInfo.js"></script>
</body>

</html>
