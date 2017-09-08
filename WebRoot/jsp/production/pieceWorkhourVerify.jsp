<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<html lang="zh-CN">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta charset="utf-8" />
<title>计件工时审核</title>
<meta name="description" content="Common Buttons &amp; Icons" />
<meta name="viewport"
	content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
<link rel="stylesheet"
	href="../assets/css/fixedColumns.bootstrap.min.css" />
<link rel="stylesheet"
	href="../assets/css/fixedColumns.dataTables.min.css" />
<link rel="stylesheet" href="../assets/css/jquery-ui.min.css" />
<link rel="stylesheet" href="../assets/css/jquery.gritter.css" />
<link rel="stylesheet" href="../css/zTreeStyle/metro.css"
	type="text/css">
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
							href="/BMS/index">首页</a></li>
						<li><a href="#">生产执行</a></li>
						<li><a href="#">计件工时审核</a></li>
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
					<div class="row">
						<div id="zztree" class="col-xs-2" style="position: relative; left: 0; float: left; border: 1px solid #ccebf8; overflow: auto;color:#616161">
							<ul id="workGroupTree" class="ztree" style="padding-left:0px;"></ul>
						</div>
						<div class="col-xs-10">
							<div class="row">
								<form id="form" class="well form-search " style="margin-left: 12px;">
									<table>
										<tr>					
										<td style="text-align:right">车号：</td>
										<td>
											<input id="bus_number" class="input-medium" style="height: 30px;" placeholder="请输入车号/自编号" type="text">
										</td>
										<td style="text-align:right" width="80px">操作日期：</td>
										<td colspan="1">
											<input id="wdate_start" style="width:100px;height: 30px;" class="input-small" 
											onclick="WdatePicker({dateFmt:'yyyy-MM-dd',minDate:'#F{limitMonthDate(1);}',maxDate:'#F{$dp.$D(\'wdate_end\',{d:0})}'})" type="text">
											<span>-</span>
											<input id="wdate_end" style="width:100px;height: 30px;" class="input-small" 
											onclick="WdatePicker({dateFmt:'yyyy-MM-dd',minDate:'#F{$dp.$D(\'wdate_start\',{d:0})}',maxDate:'#F{limitMonthDate(2);}'})" type="text">
										</td>
										<td style="text-align:right">状态：</td>
										<td>
											<select id="hour_status" class="input-medium" style="width:100px" disabled="">										
												<option value="1" selected="selected">已审批</option>
												<option value="2">已驳回</option>
												<option value="3">已锁定</option>
											</select>
										</td>
										<td><input class="btn btn-sm btn-primary" id="btnQuery" value="查询" style="margin-left: 2px;" type="button">
											<input class="btn btn-sm btn-danger" id="btnSave" value="驳回" style="margin-left: 2px;" type="button"> 
										</td>
										</tr>
									</table>
								</form>
							</div>
							<div class="row" >
								<div class="col-xs-12"  id="tableReusltDiv" style="padding-right:0px;">
									<table id="tableResult" class="table table-striped table-bordered table-hover" style="table-layout:fixed;font-size: 12px; width:933px;overflow:auto;">
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>

			</div>
			<!-- /.main-container -->
		</div>
		</div>
		<script src="../js/datePicker/WdatePicker.js"></script>
		<script src="../assets/js/jquery.dataTables.min.js"></script>
		<script src="../assets/js/jquery-ui.min.js"></script>
		<script src="../assets/js/jquery.gritter.min.js"></script>
		<script src="../assets/js/jquery.dataTables.bootstrap.js"></script>
		<script src="../assets/js/dataTables.rowGroup.js"></script>
		<script src="../assets/js/dataTables.fixedColumns.min.js"></script>
		<script src="../assets/js/bootstrap3-typeahead.js"></script>
		<script src="../js/ztree/jquery.ztree.core-3.5.min.js"></script>
		<script src="../js/jquery.form.js"></script>
		<script src="../js/common.js"></script>
		<script src="../js/production/pieceWorkhourVerify.js"></script>
</body>

</html>
