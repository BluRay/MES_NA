<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html lang="zh-CN">
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta charset="utf-8" />
		<title>发车计划</title>
		<meta name="description" content="Common Buttons &amp; Icons" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
		<link rel="stylesheet" href="../assets/css/jquery-ui.min.css" />
		<link rel="stylesheet" href="../assets/css/jquery-ui.custom.min.css" />
		<link rel="stylesheet" href="../assets/css/jquery.gritter.css" />
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
						<li class="active">发车计划</li>
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
								<td>&nbsp;车型：</td>
								<td><select id="search_bustype" class="input-small" style="height: 30px;width:80px"></select></td>
								<td>&nbsp;订单：</td>
								<td><input id="search_order_no" placeholder="请输入订单编号..." style="height: 30px;width:110px" type="text"></td>
								<td>&nbsp;发车时间：</td>
								<td><input id="start_date" placeholder="开始时间..." style="height: 30px;width:125px" type="text" onClick="WdatePicker({el:'start_date',dateFmt:'yyyy-MM-dd'});"> - <input id="end_date" placeholder="结束时间..." style="height: 30px;width:125px" type="text" onClick="WdatePicker({el:'end_date',dateFmt:'yyyy-MM-dd'});"></td>
								<td>
									<input id="btnQuery" type="button" class="btn btn-sm btn-success" value="查询" style="margin-left: 2px;">
									<input id="btnAdd" type="button" class="btn btn-sm btn-info" value="增加" style="margin-left: 2px;">
								</td>
								<td></td>
							</tr>
						</table>
					</div>
					<table id="tableData" class="table table-striped table-bordered table-hover" style="font-size: 12px;">
					</table>
					</div>
			</div><!-- /.main-content -->
			
			<div id="dialog-add" class="hide" style="align:center;width:700px;height:500px">
			<form>
					<table>
					<tr style="height:40px">
						<td align="right" style="width:150px">生产工厂：</td><td style="width:180px"><select id="new_factory" class="form-control" style="width:150px"></select></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:150px">生产订单：</td>
						<td style="width:180px">
							<input id="new_order_no" placeholder="请输入订单编号..." style="width:150px" type="text">
						</td>
					</tr>
					<tr style="height:40px">
					<td align="center" colspan="2" style="width:200px">
						订单数量：<span class="text-info" id="new_order_qty">0</span>
						已计划发车数量：<span class="text-info" id="new_plan_done_qty">0</span>&nbsp;
						剩余数量：<span class="text-info" id="new_plan_left_qty">0</span>
					</td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:150px">计划发车数量：</td><td style="width:150px"><input id="new_plan_num" placeholder="请输入发车数量..." style="width:150px" type="text"></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:150px">计划发车时间：</td><td style="width:150px"><input id="new_plan_date" placeholder="请输入发车时间..." style="width:150px" type="text" onClick="WdatePicker({el:'new_plan_date',dateFmt:'yyyy-MM-dd'});"></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:150px">自编号：</td><td style="width:150px"><select id="new_customer_number_flag" class="form-control" style="width:150px"><option value='0'>有</option><option value='1'>无</option></select></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:150px">邮件通知：</td><td style="width:250px"><input id="new_mail_addr" placeholder="请输入邮件地址..." style="width:250px" type="text"></td>
					</tr>
					</table>
			</form>		
			</div>
			
			<div id="dialog-edit" class="hide" style="align:center;width:700px;height:500px">
			<form>
					<table>
					<tr style="height:40px">
						<td align="right" style="width:150px">生产工厂：</td><td style="width:180px"><select id="edit_factory" class="form-control" style="width:150px"></select></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:150px">生产订单：</td>
						<td style="width:180px">
							<input id="edit_order_no" placeholder="请输入订单编号..." style="width:150px" type="text">
						</td>
					</tr>
					<tr style="height:40px">
					<td align="center" colspan="2" style="width:200px">
						订单数量：<span class="text-info" id="edit_order_qty">0</span>
						已计划发车数量：<span class="text-info" id="edit_plan_done_qty">0</span>&nbsp;
						剩余数量：<span class="text-info" id="edit_plan_left_qty">0</span>
					</td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:150px">计划发车数量：</td><td style="width:150px"><input id="edit_plan_num" placeholder="请输入发车数量..." style="width:150px" type="text"></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:150px">计划发车时间：</td><td style="width:150px"><input id="edit_plan_date" placeholder="请输入发车时间..." style="width:150px" type="text" onClick="WdatePicker({el:'edit_plan_date',dateFmt:'yyyy-MM-dd'});"></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:150px">自编号：</td><td style="width:150px"><select id="edit_customer_number_flag" class="form-control" style="width:150px"><option value='0'>有</option><option value='1'>无</option></select></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:150px">邮件通知：</td><td style="width:250px"><input id="edit_mail_addr" placeholder="请输入邮件地址..." style="width:250px" type="text"></td>
					</tr>
					</table>
			</form>		
			</div>

			<!-- 脚 -->
			<%-- <jsp:include page="footer.jsp" flush="true"/> --%>
			<a href="#" id="btn-scroll-up" class="btn-scroll-up btn btn-sm btn-inverse"><i class="ace-icon fa fa-angle-double-up icon-only bigger-110"></i></a>
		</div><!-- /.main-container -->
	</div>
	</body>
	<script src="../assets/js/fuelux/fuelux.tree.min.js"></script>
	<script src="../assets/js/jquery-ui.min.js"></script>
	<script src="../assets/js/jquery.ui.touch-punch.min.js"></script>
	<script src="../assets/js/jquery.gritter.min.js"></script>

	<script src="../assets/js/jquery.dataTables.min.js"></script>
	<script src="../assets/js/jquery.dataTables.bootstrap.js"></script>
	<script src="../assets/js/dataTables.fixedColumns.min.js"></script>
	<script src="../assets/js/bootstrap3-typeahead.js"></script>
	<script type="text/javascript" src="../js/datePicker/WdatePicker.js"></script>
	<script type="text/javascript" src="../js/common.js"></script>
	<script type="text/javascript" src="../js/plan/busDispatchPlan.js"></script>
</html>
