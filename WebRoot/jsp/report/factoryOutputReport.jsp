<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html lang="zh-CN">
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta charset="utf-8" />
		<title>工厂产量（日、周、月）</title>
		<link rel="stylesheet" href="../css/bootstrap-table.css">
		<link rel="stylesheet" href="../css/bootstrap-editable.css">
		<link rel="stylesheet" href="../css/bootstrap-table-fixed-columns.css">
		<link rel="stylesheet" href="../assets/css/jquery-ui.min.css" />
		<link rel="stylesheet" href="../assets/css/jquery-ui.custom.min.css" />
		<link rel="stylesheet" href="../assets/css/jquery.gritter.css" />
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
						<li><i class="ace-icon fa fa-home home-icon"></i><a href="/BMS/index">首页</a></li>
						<li><a href="#">报表</a></li>
						<li class="active">工厂产量（日、周、月）</li>
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
								<td>工厂：</td>
								<td><select id="search_factory" class="input-small" style="height: 30px;width:100px"></select></td>
								<td>&nbsp;生产日期：</td>
								<td><input id="start_date" placeholder="开始时间..." style="height: 30px;width:125px" type="text" onClick="WdatePicker({el:'start_date',dateFmt:'yyyy-MM-dd'});"> - <input id="end_date" placeholder="结束时间..." style="height: 30px;width:125px" type="text" onClick="WdatePicker({el:'end_date',dateFmt:'yyyy-MM-dd'});"></td>
								<td>&nbsp;查询范围：</td>
								<td>
									<select id="search_index" class="input-small" style="height: 30px;width:60px">
										<option value="0">今天</option>
										<option value="1">本周</option>
										<option value="2">本月</option>
									</select>
								</td>
								<td><input id="btnQuery" type="button" class="btn btn-sm btn-success" value="查询" style="margin-left: 2px;"></td>
								<td></td>
							</tr>
						</table>
					</div>		
					
					<div id="toolbar"></div>
					<table  style="font-weight:normal;" id="table" data-toolbar="#toolbar" data-search="false" data-show-refresh="true"
				           data-show-toggle="false" data-show-columns="true" data-show-export="true" data-detail-view="false"
				           data-detail-formatter="detailFormatter" data-minimum-count-columns="2" data-show-pagination-switch="true"
				           data-pagination="true" data-id-field="id" data-page-list="[50, 100, 200, 500, ALL]"
				           data-show-footer="false" data-side-pagination="server" data-response-handler="responseHandler">
				    </table>
				    
					</div>
			</div><!-- /.main-content -->

			<!-- 脚 -->
			<%-- <jsp:include page="footer.jsp" flush="true"/> --%>
			<a href="#" id="btn-scroll-up" class="btn-scroll-up btn btn-sm btn-inverse"><i class="ace-icon fa fa-angle-double-up icon-only bigger-110"></i></a>
		</div><!-- /.main-container -->
	</div>
	</body>
	<script>
		var $table = $('#table'),$remove = $('#remove'),selections = [];
	</script>
	<style type="text/css">
	.table{
	    table-layout: fixed;
	}
	.fixed-table-toolbar .bs-bars, .fixed-table-toolbar .search, .fixed-table-toolbar .columns {
		position: absolute;
		margin-top: 102px;
		right: 20px;
		top: -79px;
	}
	.btn-default {
		color: #333;
		background-color: #fff;
		border-color: #ccc;
		height: 40px;
		color: #fff;
		background-color: #333;
	}
	
</style>
	<script type="text/javascript" src="../assets/js/jquery-ui.min.js"></script>
	<script type="text/javascript" src="../js/bootstrap-table.js"></script>
	<script src="../assets/js/bootstrap3-typeahead.js"></script>
	<script type="text/javascript" src="../js/datePicker/WdatePicker.js"></script>
	<script type="text/javascript" src="../js/common.js"></script>
	<script type="text/javascript" src="../js/report/factoryOutputReport.js"></script>
</html>
