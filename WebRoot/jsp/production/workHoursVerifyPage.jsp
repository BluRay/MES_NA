<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html lang="zh-CN">
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta charset="utf-8" />
		<title>额外工时审核</title>
		<meta name="description" content="Common Buttons &amp; Icons" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
		<link rel="stylesheet" href="../assets/css/jquery-ui.min.css" />
		<link rel="stylesheet" href="../assets/css/jquery-ui.custom.min.css" />
		<link rel="stylesheet" href="../assets/css/jquery.gritter.css" />
		<link rel="stylesheet" href="../assets/css/fixedColumns.bootstrap.min.css" />
		<link rel="stylesheet" href="../assets/css/fixedColumns.dataTables.min.css" />
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
						<li><a href="#">生产执行</a></li>
						<li class="active">额外工时审核</li>
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
								<td>派工流水号：</td>
								<td><input id="tmp_order_no" placeholder="请输入派工流水号..." style="height: 30px;width:120px" type="text"></td>
								<td>&nbsp;申请时间：</td>
								<td><input id="start_date" placeholder="开始时间..." style="height: 30px;width:100px" type="text" onClick="WdatePicker({el:'start_date',dateFmt:'yyyy-MM-dd'});"> - <input id="end_date" placeholder="结束时间..." style="height: 30px;width:100px" type="text" onClick="WdatePicker({el:'end_date',dateFmt:'yyyy-MM-dd'});"></td>
								<td>&nbsp;工时状态：</td>
								<td>
									<select id="status" style="height: 30px;" class="input-small carType">
										<option value=''>全部</option>
										<option value='未审批'>未审批</option>
										<option value='已审批'>已审批</option>
										<option value='已驳回'>已驳回</option>
									</select>
								</td>
								<td>&nbsp;制作工厂：</td>
								<td><select id="q_factory" style="height: 30px;" class="input-small"></select></td>
								<td>&nbsp;制作车间：</td>
								<td><select id="q_workshop" style="height: 30px;" class="input-small"></select></td>
								<td>
									<input id="btnQuery" type="button" class="btn btn-sm btn-success" value="查询" style="margin-left: 2px;">
								</td>
								<td></td>
							</tr>
						</table>
					</div>
					
					<table id="tableData" class="table table-striped table-bordered table-hover" style="width:1350px;overflow-x:auto;font-size: 12px;">
					</table>
					
					</div>
			</div><!-- /.main-content -->
			
			<div id="dialog-edit" class="hide" style="align:center;width:780px;height:500px">
				<table style="line-height: 30px">
					<tr>
						<td width="140px" style="text-align: right">派工流水号：</td>
						<td id="edit_orderNo" colspan="2"></td>
					</tr>
					<tr>
						<td width="140px" style="text-align: right">作业原因/内容：</td>
						<td id="edit_reason" colspan="7"></td>
					</tr>
					<tr>
						<td width="140px" style="text-align: right">总数量：</td>
						<td id="edit_totalQty" width="50px">30</td>
						<td width="80px" style="text-align: right">单工时：</td>
						<td id="edit_singleHour" width="50px">1.5</td>
						<td width="80px" style="text-align: right">所需人力：</td>
						<td id="edit_labors" width="50px">10</td>
						<td width="80px" style="text-align: right">总工时：</td>
						<td id="edit_totalHour">20</td>
					</tr>
				</table>
				
				<table class="form-search">
					<tr>
						<td width="60px" style="text-align: right">工号：</td>
						<td width="160px"><input type="text" class="input-medium"
							id="edit_cardNumber" /></td>
						<td width="80px" style="text-align: right">操作月份：</td>
						<td width="160px"><input type="text" class="input-medium"
							id="edit_workDate"
							onclick="WdatePicker({dateFmt:'yyyy-MM'})" /></td>
						<td><input type="button" class="btn btn-primary"
							id="btnSwhQuery" value="查询" style="margin-left: 2px;height:30px;line-height:1px"></input></td>
						<td></td>
					</tr>
				</table>
				<h5 class="section-head">额外工时<span style="float:right;margin: 10px 20px;color:green" class="read_hours"></span></h5>
							
				<div style="width:100%;height:300px;">
					<table id="work_hour_tb" style="margin-left: 0px; margin-top: 15px; width: 100%;" class="exp-table table">
						<thead style="background-color: rgb(225, 234, 240)">
							<tr>
								<td><input type="checkbox" id="checkall"></td>
								<td>工号</td>
								<td>姓名</td>
								<td>岗位</td>
								<td>额外工时</td>
								<td>小班组</td>
								<td>班组</td>
								<td>车间</td>
								<td>工厂</td>
								<td>状态</td>
								<td>操作日期</td>
							</tr>
						</thead>
						<tbody class="exp-table" id="workhour_list">
						</tbody>
					</table>
				</div>			
			
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
	<script type="text/javascript" src="../js/production/workHoursVerifyPage.js"></script>
</html>
