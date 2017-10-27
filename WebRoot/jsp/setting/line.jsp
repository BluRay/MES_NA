<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html lang="en">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta charset="utf-8" />
<title>MES Settings Line</title>
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
						<li><i class="ace-icon fa fa-home home-icon"></i><a href="<%=request.getContextPath()%>/index">Index</a></li>
						<li><a href="#">Settings</a></li>
						<li class="active">Line</li>
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
								<td>Line：</td>
								<td><input type="text" style="height: 30px;" class="input-medium revise" placeholder="Line Name..." value="" id="search_line" /></td>
								<!-- <td><select id="search_order_status" class="input-medium revise">
								<option value=''>全部</option>
								<option value='0'>未开始</option>
								<option value='1'>生产中</option>
								<option value='2'>已完成</option>
								</select>
							</td> -->

								<td><input type="button" class="btn btn-sm btn-primary btnQuery" id="btnQuery" value="Search" style="margin-left: 2px;"></input>
									<button id='btnAdd' class="btn btn-sm btn-success">Add</button>
									<button id='btnDelete' class="btn btn-sm btn-delete">Delete</button></td>
							</tr>
						</table>
					</div>

					<div class="row">
						<div class="col-xs-12">
							<table id="tableData" class="table table-striped table-bordered table-hover" style="font-size: 12px;">
								<!-- <thead>
								<tr>
									<th style="text-align: center;">订单编号</th>
									<th style="text-align: center;">订单描述</th>
									<th style="text-align: center;">客户</th>
									<th style="text-align: center;">生产年份</th>
									<th style="text-align: center;">订单交期</th>
									<th style="text-align: center;">订单总数量</th>
									<th style="text-align: center;">订单状态</th>
									<th style="text-align: center;">生产工厂</th>
									<th style="text-align: center;">生产数量</th>
									<th style="text-align: center;">起始车号流水</th>
									<th style="text-align: center;">结束车号流水</th>
									<th style="text-align: center;">车号</th>
									<th style="text-align: center;">维护者</th>
									<th style="text-align: center;">维护时间</th>
									<th style="text-align: center;">分配</th>
								</tr>
							</thead>
							<tbody>
							
							</tbody> -->
							</table>
						</div>
					</div>


				</div>
				

				<div id="dialog-add" class="hide">
					<form id="addForm" class="form-horizontal">
						<div class="form-group">
							<label class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="addLineName">*&nbsp;Line Name</label>
							<div class="col-sm-9">
								<input type="text" class="input-medium" placeholder="Line Name..." id="addLineName" />
							</div>
						</div>
						
						
						<div class="form-group">
							<label class="col-sm-3 control-label no-padding-right" for="addMemo">Memo</label>
							<div class="col-sm-9">
								<textarea class="input-xlarge" style="width: 355px" id="addMemo" rows="2"></textarea>
							</div>
						</div>
					</form>
				</div>
				
				<div id="dialog-edit" class="hide">
					<form id="editForm" class="form-horizontal">
						<div class="form-group">
							<label class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="editLineName">*&nbsp;Line Name</label>
							<div class="col-sm-9">
								<input type="hidden" id="editId" />
								<input type="text" class="input-medium" placeholder="Line Name..." id="editLineName" />
							</div>
						</div>
						
						
						<div class="form-group">
							<label class="col-sm-3 control-label no-padding-right" for="editMemo">Memo</label>
							<div class="col-sm-9">
								<textarea class="input-xlarge" style="width: 355px" id="editMemo" rows="2"></textarea>
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
	<script src="../assets/js/dataTables.rowGroup.js"></script>
	<script src="../assets/js/ace/elements.onpage-help.js"></script>
	<script src="../assets/js/ace/ace.onpage-help.js"></script>
	<script src="../assets/js/bootstrap3-typeahead.js"></script>
	<script src="../js/jsrender.min.js"></script>
	<script src="../js/common.js"></script>
	<script src="../js/setting/line.js"></script>
</body>

</html>
