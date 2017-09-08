<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html lang="zh-CN">
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta charset="utf-8" />
		<title>随车附件</title>
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
						<li class="active">随车附件</li>
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
								<td>订单编号：</td>
								<td><input id="orderNo" placeholder="请输入订单编号..." style="height: 30px;width:160px" type="text"></td>
								<td>
									<input id="queryBtn" type="button" class="btn btn-sm btn-success" value="查询" style="margin-left: 2px;">
									<input id="dispatchBtn" type="button" class="btn btn-sm btn-info" value="交接" style="margin-left: 2px;">
								</td>
								<td>
								<div class="help-inline" id="orderInfo" >
									&nbsp;&nbsp;<span title="订单名称" class="label label-info" rel="tooltip"  id="orderName"></span>
									&nbsp;<span title="车型" class="label label-info" rel="tooltip"  id="busType"></span>
									&nbsp;<span title="订单数量" class="label label-info" rel="tooltip"  id="orderQty"></span>
								</div>
								</td>
							</tr>
						</table>
					</div>
					
					<form action="" method="post" id="dispatchForm" style="">
						<table id="dispatchDetail" class="table table-striped table-bordered table-hover" >
							<thead>
								<tr>
									<th align="center" style="text-align:center;" width='50px'><i class="fa fa-plus" style="cursor: pointer;color:blue"></i></th>
									<th width='220px' style="text-align:center;">随车附件</th>
									<th style="text-align:center;">单车数量</th>
									<th style="text-align:center;">单位</th>
									<th style="text-align:center;">订单合计</th>
									<th style="text-align:center;">已发车合计</th>
									<th style="text-align:center;">交接数量</th>
								</tr>
							</thead>
							<tbody>
							</tbody>
						</table>
					</form>
					
					<div class="well">
						<table>
							<tr>
								<td>附件名称：</td>
								<td><input type="text" style="height: 30px;" id="dis_name" placeholder="附件名称..." class="input-medium"></td>
								<td>交接人：</td>
								<td><input type="text" style="height: 30px;" id="dis_receiver" placeholder="交接人..." class="input-medium"></td>
								<td>交接时间：</td>
								<td><input type="text" style="height: 30px;" id="dis_date_start" placeholder="开始时间..."  onclick="WdatePicker({el:'dis_date_start',dateFmt:'yyyy-MM-dd'});" class="input-medium"> 
	               				-<input type="text" style="height: 30px;" id="dis_date_end" placeholder="结束时间..." onclick="WdatePicker({el:'dis_date_end',dateFmt:'yyyy-MM-dd'});" class="input-medium"></td>
								<td>
									<input id="querydisBtn" type="button" class="btn btn-sm btn-info" value="查询">
								</td>
								<td></td>
							</tr>
						</table>
					</div>
					
					<table id="dipatchRecord" class="table table-striped table-bordered table-hover" style="font-size: 12px;">
            		<thead>
                		<tr>
                		<th style="text-align:center;" >随车附件</th >
						<th style="text-align:center;" >单车数量</th >
						<th style="text-align:center;" >单位</th >
						<th style="text-align:center;" >交接数量</th >
						<th style="text-align:center;" >操作人</th >
						<th style="text-align:center;" >交接人</th >
						<th style="text-align:center;" >交接时间</th >
              			</tr>
                	</thead>
                	<tbody></tbody>
         			</table>
					
					</div>
			</div><!-- /.main-content -->
			
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
	
	<script type="text/javascript" src="../js/jquery.form.js"></script>
	<script src="../assets/js/bootstrap3-typeahead.js"></script>
	<script src="../js/datePicker/WdatePicker.js"></script>
	<script src="../js/common.js"></script>
	<script src="../js/plan/busDispatchAccessories.js"></script>
</html>
