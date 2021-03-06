<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html lang="en">
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta charset="utf-8" />
		<title>Import plan</title>
		<meta name="description" content="Common Buttons &amp; Icons" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
	</head>
	<body class="no-skin" style="font-family: 'Microsoft YaHei';">
		<!-- 头 -->
		<jsp:include page="../top.jsp" flush="true"/>
		<!-- 身 -->
		<div class="main-container" id="main-container">
			<!-- 左边菜单 -->
			<jsp:include page="../left.jsp" flush="true"/>
			<!-- 主体 -->
			<div class="main-content">			
			<!-- 路径和搜索框 -->
			<div class="breadcrumbs" id="breadcrumbs">
					<ul class="breadcrumb">
						<li><i class="ace-icon fa fa-home home-icon"></i><a href="/BMS/index">Index</a></li>
						<li><a href="#">Plan</a></li>
						<li class="active">Import Plan</li>
					</ul><!-- /.breadcrumb -->

					<!-- #section:basics/content.searchbox -->
					<div class="nav-search" id="nav-search">
						<form class="form-search">
							<span class="input-icon">
								<input type="text" placeholder="Search ..." class="nav-search-input" id="nav-search-input" autocomplete="off" /><i class="ace-icon fa fa-search nav-search-icon"></i>
							</span>
						</form>
					</div><!-- /.nav-search -->
				</div>
				
			<div class="page-content">
					<!-- /section:settings.box -->
					<div class="page-content-area">					
					
					<div class="well">
						<table>
							<tr>
								<td>Production Factory : &nbsp;</td>
								<td>&nbsp;<select id="search_factory" class="input-small" style="height: 30px;width:120px"></select></td>
								<td>&nbsp;Project Name : &nbsp;</td>
								<td>&nbsp;<input id="search_project_no" style="height: 30px;" placeholder="Project No..." class="col-sm-10" type="text"></td>
								<td>&nbsp;<input type="button" class="btn btn-sm btn-success" id="btnQuery" value="Search" style="margin-left: 2px;"></input>&nbsp;</td>
								<td>&nbsp;<input id="btnBulkAdd" class="btn btn-sm btn-info" value="Import" type="button">&nbsp;</td>
							</tr>
						</table>
					</div>
					
					<div id="divBulkAdd" class="well" style="display:none;">
					<button id="btnBulkHide" type="button" class="close"><i class="ace-icon fa fa-times"></i></button>
						<form id="uploadMasterPlanForm" action="#" enctype="multipart/form-data" method="post">
						<table>
							<tr>
								<td width="300px">
								<input id="file" value="file" type="file" name="file" accept="*.xls"/>
								</td>
								<td>&nbsp;&nbsp;<input id="btn_upload" type="button" class="btn btn-sm btn-primary" value="Upload & Import" onclick="javascript:return LimitAttach(this.form, this.form.file.value)"/></td>
								<td></td><td>&nbsp;&nbsp;<a href="../docs/masterPlan.xls">Download Template</a></td>
							</tr>
						</table>
						</form>
					</div>
					<table id="tableData" class="table table-striped table-bordered table-hover" style="font-size: 12px;">
					</table>
					</div>
			</div><!-- /.main-content -->

			<!-- 脚 -->
			<%-- <jsp:include page="footer.jsp" flush="true"/> --%>
			<a href="#" id="btn-scroll-up" class="btn-scroll-up btn btn-sm btn-inverse"><i class="ace-icon fa fa-angle-double-up icon-only bigger-110"></i></a>
		</div><!-- /.main-container -->
	</div>
	</body>
	<script src="../assets/js/jquery.gritter.min.js"></script>
	<script src="../assets/js/jquery.dataTables.min.js"></script>
	<script src="../assets/js/jquery.dataTables.bootstrap.js"></script>
	<script src="../assets/js/dataTables.fixedColumns.min.js"></script>
	<script type="text/javascript" src="../assets/js/bootstrap3-typeahead.js"></script>
	<script type="text/javascript" src="../js/common.js"></script>
	<script type="text/javascript" src="../js/jquery.form.js"></script>
	<script type="text/javascript" src="../js/plan/importPlan.js"></script>
</html>
