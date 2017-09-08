<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html lang="en">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta charset="utf-8" />
<title>BMS 系统设置 VIN规则</title>
<meta name="description" content="Common Buttons &amp; Icons" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />

<link rel="stylesheet" href="../assets/css/fixedColumns.bootstrap.min.css" />
<link rel="stylesheet" href="../assets/css/fixedColumns.dataTables.min.css" />
<link rel="stylesheet" href="../assets/css/jquery-ui.min.css" />
<link rel="stylesheet" href="../assets/css/jquery.gritter.css" />
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
				<div class="breadcrumbs ace-save-state  breadcrumbs-fixed" id="breadcrumbs">
					<ul class="breadcrumb">
						<li><i class="ace-icon fa fa-home home-icon"></i><a href="<%=request.getContextPath()%>/index">首页</a></li>
						<li><a href="#">系统设置</a></li>
						<li class="active">VIN规则</li>
					</ul>
					<!-- /.breadcrumb -->

					<div class="nav-search" id="nav-search">
						<form class="form-search">
							<span class="input-icon"> <input type="text" placeholder="Search ..." class="nav-search-input" id="nav-search-input" autocomplete="off" /><i class="ace-icon fa fa-search nav-search-icon"></i>
							</span>
						</form>
					</div>
					<!-- /.nav-search -->
				</div>

				<div class="page-content">
					<div id="form" class="well form-search">
						<table>
							<tr>
								<td>车型：</td>
								<td><input type="text" style="height: 30px;" class="input-medium revise" placeholder="车型..." value="" id="search_busType" /></td>
								<td>&nbsp;区域：</td>
								<td><select id="search_area" class="input-small"></select></td>
								<td><input type="button" class="btn btn-sm btn-primary btnQuery" id="btnQuery" value="查询" style="margin-left: 2px;"></input>
									<button id='btnAdd' class="btn btn-sm btn-success">新增</button>
									<button id='btnDelete' class="btn btn-sm btn-delete">删除</button></td>
							</tr>
						</table>
					</div>

					<div class="row">
						<div class="col-xs-12">
							<table id="tableData" class="table table-striped table-bordered table-hover" style="font-size: 12px;">
								
							</table>
						</div>
					</div>
                </div>
				
                <div id="dialog-add" class="hide">
					<form id="addForm" class="form-horizontal">
						<div class="form-group">
							<label class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="addBusType">*&nbsp;车型</label>
							<div class="col-sm-9">
								<select id="add_busType" class="input-small"></select>
							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="addArea">*&nbsp;区域</label>
							<div class="col-sm-9">
								<select id="add_area" class="input-small"></select>
							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="addShortName">*&nbsp;VIN前8位</label>
							<div class="col-sm-9">
								<input type="text" class="input-medium" placeholder="VIN前8位..." id="add_vinPrefix" />
							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="addCapacity">*&nbsp;WMI扩展代码</label>
							<div class="col-sm-9">
								<input type="text" class="input-medium" placeholder="WMI扩展代码..." id="add_wmiExtension" maxlength="2" onkeyup="value=value.replace(/[^\d]/g,'')" onpaste="return false;" />
							</div>
						</div>
						
						<div class="form-group">
							<label class="col-sm-3 control-label no-padding-right" for="add">*&nbsp;生成序列号位数</label>
							<div class="col-sm-9">
								<input type="text" class="input-medium" placeholder="生成序列号位数..." id="add_numberSize" />
							</div>
						</div>
					</form>
				</div>
				
				<div id="dialog-edit" class="hide">
					<form id="editForm" class="form-horizontal">
						<div class="form-group">
							<label class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="editBusType">*&nbsp;车型</label>
							<div class="col-sm-9">
								<input type="hidden" id="editId" />
								<select id="edit_busType" class="input-small"></select>
							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="editArea">*&nbsp;区域</label>
							<div class="col-sm-9">
								<select id="edit_area" class="input-small"></select>
							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="editShortName">*&nbsp;VIN前8位</label>
							<div class="col-sm-9">
								<input type="text" class="input-medium" placeholder="VIN前8位..." id="edit_vinPrefix" />
							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="editWmiExtension">*&nbsp;WMI扩展代码</label>
							<div class="col-sm-9">
								<input type="text" class="input-medium" placeholder="WMI扩展代码..." id="edit_wmiExtension"/>
							</div>
						</div>
						
						<div class="form-group">
							<label class="col-sm-3 control-label no-padding-right" for="editNumberSize">*&nbsp;生成序列号位数</label>
							<div class="col-sm-9">
								<input type="text" class="input-medium" placeholder="生成序列号位数..." id="edit_numberSize" />
							</div>
						</div>
					</form>
				</div>
				
			</div>
		</div>
		<!-- /.main-container -->
	</div>
	<script src="../assets/js/jquery-ui.min.js"></script>
	<script src="../assets/js/jquery.gritter.min.js"></script>
	<script src="../assets/js/jquery.dataTables.min.js"></script>
	<script src="../assets/js/jquery.dataTables.bootstrap.js"></script>
	<script src="../assets/js/dataTables.fixedColumns.min.js"></script>
	<script src="../assets/js/ace/elements.onpage-help.js"></script>
	<script src="../assets/js/ace/ace.onpage-help.js"></script>
	<script src="../assets/js/bootstrap3-typeahead.js"></script>
	<script src="../js/jsrender.min.js"></script>
	<script src="../js/common.js"></script>
	<script src="../js/setting/vinRule.js"></script>
</body>

</html>
