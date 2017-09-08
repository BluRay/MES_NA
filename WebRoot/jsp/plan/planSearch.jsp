<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html lang="zh-CN">
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta charset="utf-8" />
		<title>计划完成情况</title>
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
						<li class="active">计划完成</li>
					</ul><!-- /.breadcrumb -->

					<!-- #section:basics/content.searchbox -->
					<div class="nav-search" id="nav-search">
						<form class="form-search">
							<span class="input-icon">
								<input type="text" placeholder="Search ..." class="nav-search-input" id="nav-search-input" onkeydown="EnterPress()" onkeypress="EnterPress(e)" autocomplete="off" /><i class="ace-icon fa fa-search nav-search-icon"></i>
							</span>
						</form>
					</div><!-- /.nav-search -->
				</div>
				
			<div class="page-content">
					<div class="page-content-area">
					<div class="well">
						<table>
							<tr>
								<td>工厂：</td>
								<td><select id="search_factory" class="input-small" style="height: 30px;width:100px"></select></td>
								<td>&nbsp;车间：</td>
								<td><select id="search_workshop" class="input-small" style="height: 30px;width:80px"></select></td>
								<td>&nbsp;订单：</td>
								<td><input id="search_order_no" placeholder="请输入订单编号..." style="height: 30px;width:110px" type="text"></td>
								<td>&nbsp;生产日期：</td>
								<td><input id="start_date" placeholder="开始时间..." style="height: 30px;width:125px" type="text" onClick="WdatePicker({el:'start_date',dateFmt:'yyyy-MM-dd'});"> - <input id="end_date" placeholder="结束时间..." style="height: 30px;width:125px" type="text" onClick="WdatePicker({el:'end_date',dateFmt:'yyyy-MM-dd'});"></td>
								<td><input id="btnQuery" type="button" class="btn btn-sm btn-success" value="查询" style="margin-left: 2px;"></td>
								<td></td>
							</tr>
						</table>
					</div>	
					
					<div class="tabbable">
						<ul class="nav nav-tabs" id="myTab">
							<li id="div1" class="active">
								<a data-toggle="tab" href="#home">计划达成数据</a>
							</li>
							<li id="div2">
								<a data-toggle="tab" href="#messages">计划达成明细</a>
							</li>
						</ul>

						<div class="tab-content" id="tab-content">
							<div id="home" class="tab-pane fade in active">
								<p style="font-weight:bold">车间计划达成：</p>
								<table id="tablePlan_total" style="table-layout:fixed;font-size:12px;text-align:center" class="table table-bordered table-striped">
									<thead>
								         <tr id='0'>
								        	<th style="text-align:center;">生产车间</th>
								            <th style="text-align:center;">自制件下线</th>
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
									<tbody>
										<tr id="tr_plan">
											<td>计划数量</td>
											<td></td>
											<td></td>
											<td></td>
											<td></td>
											<td></td>
											<td></td>
											<td></td>
											<td></td>
											<td></td>
											<td></td>
											<td></td>
										</tr>
										<tr id="tr_realDone">
											<td>实际完成量</td>
											<td></td>
											<td></td>
											<td></td>
											<td></td>
											<td></td>
											<td></td>
											<td></td>
											<td></td>
											<td></td>
											<td></td>
											<td></td>
										</tr>
										<tr id="tr_doneRate">
											<td>实际达成率</td>
											<td></td>
											<td></td>
											<td></td>
											<td></td>
											<td></td>
											<td></td>
											<td></td>
											<td></td>
											<td></td>
											<td></td>
											<td></td>
										</tr>
										<tr id="tr_undone">
											<td>欠产数量</td>
											<td></td>
											<td></td>
											<td></td>
											<td></td>
											<td></td>
											<td></td>
											<td></td>
											<td></td>
											<td></td>
											<td></td>
											<td></td>
										</tr>
									</tbody>
								</table>
								
								<p style="font-weight:bold">订单计划达成：</p>
								<table id="tablePlan" style="table-layout:fixed;font-size:12px" class="table table-bordered table-striped">
									<thead>
								         <tr id='0'>
								         	<th style="text-align:center;width:250px">生产订单</th>
								        	<th style="text-align:center;">生产车间</th>
								            <th style="text-align:center;">计划数量</th>
								            <th style="text-align:center;">实际完成量</th>
								            <th style="text-align:center;">实际达成率</th>
								            <th style="text-align:center;">累计完成量</th>
								        </tr>
								    </thead>
								<tbody>
								</tbody>
								</table>
								
							</div>
							<div id="messages" style="overflow:auto" class="tab-pane fade">
								<table id="tablePlanDetail" style="font-size:12px;overflow:auto"  class="table table-striped table-bordered table-hover">
									<thead>
								         <tr id='0'>
								         	<th style="width:80px;text-align:center;">订单</th>
								        	<th style="width:105px;text-align:center;">车间</th>
								            <th id="D1" style="text-align:center; width:55px;"> </th>
								            <th id="D2" style="text-align:center; width:55px;"> </th>
								            <th id="D3" style="text-align:center; width:55px;"> </th>
								            <th id="D4" style="text-align:center; width:55px;"> </th>
								            <th id="D5" style="text-align:center; width:55px;"> </th>
								            <th id="D6" style="text-align:center; width:55px;"> </th>
								            <th id="D7" style="text-align:center; width:55px;"> </th>
								            <th id="D8" style="text-align:center; width:55px;"> </th>
								            <th id="D9" style="text-align:center; width:55px;"> </th>
								            <th id="D10" style="text-align:center; width:55px;"> </th>          
								            <th id="D11" style="text-align:center; width:55px;"> </th>
								            <th id="D12" style="text-align:center; width:55px;"> </th>
								            <th id="D13" style="text-align:center; width:55px;"> </th>
								            <th id="D14" style="text-align:center; width:55px;"> </th>
								            <th id="D15" style="text-align:center; width:55px;"> </th>
								            <th id="D16" style="text-align:center; width:55px;"> </th>
								            <th id="D17" style="text-align:center; width:55px;"> </th>
								            <th id="D18" style="text-align:center; width:55px;"> </th>
								            <th id="D19" style="text-align:center; width:55px;"> </th>
								            <th id="D20" style="text-align:center; width:55px;"> </th>
								            <th id="D21" style="text-align:center; width:55px;"> </th>
								            <th id="D22" style="text-align:center; width:55px;"> </th>
								            <th id="D23" style="text-align:center; width:55px;"> </th>
								            <th id="D24" style="text-align:center; width:55px;"> </th>
								            <th id="D25" style="text-align:center; width:55px;"> </th>
								            <th id="D26" style="text-align:center; width:55px;"> </th>
								            <th id="D27" style="text-align:center; width:55px;"> </th>
								            <th id="D28" style="text-align:center; width:55px;"> </th>
								            <th id="D29" style="text-align:center; width:55px;"> </th>
								            <th id="D30" style="text-align:center; width:55px;"> </th>
								            <th id="D31" style="text-align:center; width:55px;"> </th>
								            <th id="Total" style="width:65px;text-align:center;">合计</th>
								            <th id="TotalMonth" style="width:70px;text-align:center;padding-left:1px;padding-right:0px">本月合计</th>
								            <th id="TotalOrder" style="width:70px;text-align:center;padding-left:1px;padding-right:0px">订单合计</th>
								        </tr>
								    </thead>
								<tbody>
								</tbody>
								</table>
							</div>
						</div>
					</div>
					
					</div>
			</div><!-- /.main-content -->

			<!-- 脚 -->
			<%-- <jsp:include page="footer.jsp" flush="true"/> --%>
			<a href="#" id="btn-scroll-up" class="btn-scroll-up btn btn-sm btn-inverse"><i class="ace-icon fa fa-angle-double-up icon-only bigger-110"></i></a>
		</div><!-- /.main-container -->
	</div>
	</body>
	<script src="../assets/js/bootstrap3-typeahead.js"></script>
	<script type="text/javascript" src="../js/datePicker/WdatePicker.js"></script>
	<script type="text/javascript" src="../js/common.js"></script>
	<script type="text/javascript" src="../js/plan/planSearch.js"></script>
</html>
