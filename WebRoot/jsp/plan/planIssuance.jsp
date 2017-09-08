<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html lang="zh-CN">
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta charset="utf-8" />
		<title>计划发布</title>
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
						<li><a href="#">生产计划</a></li>
						<li class="active">计划发布</li>
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
						<td>生产工厂：</td>
						<td><select id="search_factory" class="input-small" style="height: 30px;width:120px"></select></td>
						<td>&nbsp;订单编号：</td>
						<td><input id="search_order_no" placeholder="请输入订单编号..." style="height: 30px;width:120px" class="col-sm-10" type="text"></td>
						<td>&nbsp;生产日期：</td>
						<td><input type="text" style="height: 30px;width:120px" class="col-sm-10" placeholder="请输入生产日期..." id="issuance_date" onClick="WdatePicker({el:'issuance_date',dateFmt:'yyyy-MM-dd'});" />
						</td>
						<td><input type="button" class="btn btn-sm btn-success" id="btnQuery" value="查询" style="margin-left: 2px;"></input>&nbsp;</td>
						<td><input type="button" class="btn btn-sm btn-info" id="btnSave" value="发布" style="margin-left: 2px;"></input>&nbsp;</td>
						<td>
						<input type="text" style="display:none" class="input-small revise" id="configs"></input>
						<input type="text" style="display:none;width:400px" class="input-large revise" id="issuance_str"></input>
						</td>
						</tr>
					</table>
					</div>		
					<table id="tableData" class="table table-striped table-bordered table-hover" style="font-size: 12px;">
					<thead>
					<tr>
						<th style="text-align:center;">序号</th>
	                	<th style="text-align:center;">计划配置</th>
	                    <th style="text-align:center;">自制件下线</th>
	                    <th style="text-align:center;">部件上线</th>
	                    <th style="text-align:center;">部件下线</th>
	                    <th style="text-align:center;">焊装上线</th>
	                    <th style="text-align:center;">焊装下线</th>
	                    <th style="text-align:center;">涂装上线</th>
	                    <th style="text-align:center;">涂装下线</th>
	                    <th style="text-align:center;">底盘上线</th>
	                    <th style="text-align:center;">底盘下线</th>
	                    <th style="text-align:center;">总装上线</th>
	                    <th style="text-align:center;">总装下线</th>
	                    <th style="text-align:center;">入库</th>
					</tr>
					</thead>
					<tbody></tbody>
					</table>
					</div>
			</div><!-- /.main-content -->

			<!-- 脚 -->
			<%-- <jsp:include page="footer.jsp" flush="true"/> --%>
			<a href="#" id="btn-scroll-up" class="btn-scroll-up btn btn-sm btn-inverse"><i class="ace-icon fa fa-angle-double-up icon-only bigger-110"></i></a>
		</div><!-- /.main-container -->
	</div>
	</body>
	<script src="../js/datePicker/WdatePicker.js"></script>
	<script src="../assets/js/bootstrap3-typeahead.js"></script>
	<script src="../js/common.js"></script>
	<script src="../js/plan/planIssuance.js"></script>
</html>
