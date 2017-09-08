<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html lang="zh-CN">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta charset="utf-8" />
<title>BMS 临时派工类型维护</title>
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
						<li><i class="ace-icon fa fa-home home-icon"></i><a href="/BMS/index">首页</a></li>
						<li><a href="#">生产执行</a></li>
						<li class="active">临时派工类型维护</li>
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
								<td>派工类型：</td>
								<td><input type="text" style="height: 30px;" class="input-medium revise" placeholder="派工类型..." value="" id="search_name" /></td>
								<td>&nbsp;成本是否可转移：</td>
								<td>
								<select id="search_cost_transfer" class="input-small">
								    <option value=''></option>
								    <option value='0'>否</option>
								    <option value='1'>是</option>
								</select>
								</td>
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
							<label class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="addtype">*&nbsp;派工类型</label>
							<div class="col-sm-9">
								<input type="text"  class="input-medium" style="width:120px"  id="add_name"  placeholder="派工类型.." />
							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="addArea">*&nbsp;成本是否可转移</label>
							<div class="col-sm-9">
								<input type="radio" value="0" name="add_cost_transfer"/>&nbsp;&nbsp;否 &nbsp;&nbsp;&nbsp;
							    <input type="radio" value="1" name="add_cost_transfer"/>&nbsp;&nbsp;是
							</div>
						</div>
					</form>
				</div>
				
				<div id="dialog-edit" class="hide">
					<form id="editForm" class="form-horizontal">
						<div class="form-group">
							<label class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="addtype">*&nbsp;派工类型</label>
							<div class="col-sm-9">
							    <input type="hidden" id="editId" />
								<input type="text"  class="input-medium" style="width:120px"  id="edit_name"/>
							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="addArea">*&nbsp;成本是否可转移</label>
							<div class="col-sm-9">
								<input type="radio" value="0" name="edit_cost_transfer"/>&nbsp;&nbsp;否 &nbsp;&nbsp;&nbsp;
							    <input type="radio" value="1" name="edit_cost_transfer"/>&nbsp;&nbsp;是
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
	<script src="../js/production/tmpOrderType.js"></script>
</body>

</html>
