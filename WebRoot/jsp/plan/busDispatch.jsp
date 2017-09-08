<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html lang="zh-CN">
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta charset="utf-8" />
		<title>发车交接</title>
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
						<li class="active">发车交接</li>
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
								<td>&nbsp;订单：</td>
								<td><input id="search_order_no" placeholder="请输入订单编号..." style="height: 30px;width:110px" type="text"></td>
								<td>&nbsp;计划发车时间：</td>
								<td><input id="start_date" placeholder="开始时间..." style="height: 30px;width:125px" type="text" onClick="WdatePicker({el:'start_date',dateFmt:'yyyy-MM-dd'});"> - <input id="end_date" placeholder="结束时间..." style="height: 30px;width:125px" type="text" onClick="WdatePicker({el:'end_date',dateFmt:'yyyy-MM-dd'});"></td>
								<td>
									<input id="btnQuery" type="button" class="btn btn-sm btn-success" value="查询" style="margin-left: 2px;">
								</td>
								<td></td>
							</tr>
						</table>
					</div>
					<div id="busNoForm" style="display:none" class="well">
						<div id="colse_a" style="display:block;float:right"><a href="#" style="text-align:right;" onclick="close_form();" data-action="close"><i class="ace-icon fa fa-times bigger-130"></i></a></div>
						
						<table>
							<tr>
								<td>发车订单：</td>
								<td><input type="text" id="dis_order_no" disabled="disabled" class="input-medium"></td>
								<td>&nbsp;车号：</td>
								<td><input type="text" id="busNo" class="input-medium"> 请输入车号后回车</td>
								<td>
									<input id="dispatchBtn" type="button" class="btn btn-sm btn-success" value="确认交接" style="margin-left: 2px;">
								</td>
								<td></td>
							</tr>
						</table>
					</div>
					
					<div id="kdForm" style="display:none" class="well">
						<div id="colse_a_kd" style="display:block;float:right"><a href="#" style="text-align:right;" onclick="close_form_kd();" data-action="close"><i class="ace-icon fa fa-times bigger-130"></i></a></div>
						<label>发车订单(KD件)：</label>
						<input type="text" id="dis_order_no_kd" disabled="disabled" class="input-medium"> &nbsp;&nbsp;
						<label>流水号：</label>
						<input type="text" id="customerNoStart" class="input-small" onkeyup="value=value.replace(/[^\d]/g,'')" onpaste="return false;" placeholder="起始流水号..."> -
						<input type="text" id="customerNoEnd" class="input-small" onkeyup="value=value.replace(/[^\d]/g,'')" onpaste="return false;" placeholder="结束流水号..."> 
						<input type="button" id="dispatchCustomerBtn" class="btn btn-sm btn-success" value="确认交接" >
					</div>
					
					<form action="" method="post" id="dispatchForm" style="display: none">
						<table id="dispatchDetail" class="table table-bordered">
							<thead>
								<tr>
									<td>车号</td>
									<td>VIN号</td>
									<td>电机号(左/右）</td>
									<td>自编号</td>
									<td><span style="color:red">*</span>3C编号</td>
									<td>随车附件、3C认证标贴</td>
									<td></td>
								</tr>
							</thead>
							<tbody>
	
							</tbody>
						</table>
					</form>
					
					<table id="tableData" class="table table-striped table-bordered table-hover" style="font-size: 12px;">
					</table>	
					
					</div>
			</div><!-- /.main-content -->
			
			<div id="patchModal" class="hide" style="align:center;width:700px;height:500px">
			<table class="table" id="toollist" style="text-align: center">
			
			</table>
			</div>
			
			<div id="dispatchModal" class="hide" style="align:center;width:700px;height:500px">
			<form>
				<table>
					<tr style="height:40px">
						<td width="100px"></td><td align="right">工号：</td><td colspan=3><input type="text" class="input-large" id="workcardid"/></td>
					</tr>
					<tr style="height:40px">
						<td></td><td align="right">姓名：</td><td colspan=3><input type="text" disabled="disabled" class="input-large" id="receiver"/></td>
					</tr>
				</table>
			</form>
			</div>
			<div id="dispatchKDModal" class="hide" style="align:center;width:700px;height:500px">
			<form>
				<table>
					<tr style="height:40px">
						<td width="100px"></td><td align="right">工号：</td><td colspan=3><input type="text" class="input-large" id="workcardidKD"/></td>
					</tr>
					<tr style="height:40px">
						<td></td><td align="right">姓名：</td><td colspan=3><input type="text" disabled="disabled" class="input-large" id="receiverKD"/></td>
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
	<script type="text/javascript" src="../js/plan/busDispatch.js"></script>
</html>
