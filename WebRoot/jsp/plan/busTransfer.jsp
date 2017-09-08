<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html lang="zh-CN">
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta charset="utf-8" />
		<title>车辆调动</title>
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
						<li><a href="#">生产计划</a></li>
						<li class="active">车辆调动</li>
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
					<div class="page-content-area">
					<div class="tabbable">
					<ul class="nav nav-tabs" id="myTab">
						<li id="div1" class="active">
							<a data-toggle="tab" href="#out">调出</a>
						</li>
						<li id="div2">
							<a data-toggle="tab" href="#in">调入</a>
						</li>
						<li id="div3">
							<a data-toggle="tab" href="#his">调动记录</a>
						</li>
					</ul>
					<div class="tab-content">
						<div id="out" style="overflow-x:auto;overflow-y:auto;" class="tab-pane fade in active">
							<div class="well">
								<table>
									<tr>
									<td>车号：</td>
									<td><textarea style="height: 30px;width: 450px;" placeholder="车号,每行一个车号..."  class="input-xlarge" onkeyup="this.value = this.value.slice(0, 1000)" id="transfer_out_busnumber" rows="3"></textarea></td>
									</tr>
								<tr>
									<td>调入工厂：</td>
									<td><select id="transfer_out_factory" class="input-small" style="height: 30px;width:150px"></select></td>
									<td>
									<input id="btnTransferOutQuery" type="button" class="btn btn-sm btn-primary" value="查询" style="margin-left: 2px;"></input>
									<input id="btnTransferOut" type="button" class="btn btn-sm btn-primary" value="调出" style="margin-left: 2px;"></input>
									</td>
								</tr>
								</table>
							</div>
							<table id="tableBusInfoOut" class="table table-striped table-bordered table-hover" style="font-size: 12px;">
							<thead>
							<tr>
								<tr id="0">
								<th style="text-align:center;" width="15px"><input type="checkbox" id="checkall"></th>			
								<th style="text-align:center;" width="50px">车号</th>					
								<th style="text-align:center;" width="35px">订单</th>					
								<th style="text-align:center;" width="15px">车型</th>					
								<th style="text-align:center;" width="25px">年份</th>					
								<th style="text-align:center;" width="35px">客户</th>					
								<th style="text-align:center;" width="35px">配置</th>					
								<th style="text-align:center;" width="50px">VIN</th>					
								<th style="text-align:center;" width="35px">生产工厂</th>					
								<th style="text-align:center;" width="35px">当前工序</th>					
								<th style="text-align:center;" width="15px">状态</th>
							</tr>
							</thead>
							<tbody></tbody>
							</table>
						</div>
						<div id="in" style="overflow-x:auto;overflow-y:auto;" class="tab-pane fade in">
							<div class="well">
								<table>
									<tr>
									<td>车号：</td>
									<td colspan=3><textarea style="height: 30px;width: 450px;" placeholder="车号,每行一个车号..."  class="input-xlarge" onkeyup="this.value = this.value.slice(0, 1000)" id="transfer_in_busnumber" rows="3"></textarea></td>
									</tr>
								<tr>
									<td>调出工厂：</td>
									<td><select id="transfer_in_factory" class="input-small" style="height: 30px;width:150px"></select></td>
									<td>调入工厂：</td>
									<td><select id="transfer_in_factory2" class="input-small" style="height: 30px;width:150px"></select></td>
									<td>
									<input id="btnTransferInQuery" type="button" class="btn btn-sm btn-primary" value="查询" style="margin-left: 2px;"></input>
									<input id="btnTransferIn" type="button" class="btn btn-sm btn-primary" value="调入" style="margin-left: 2px;"></input>
									</td>
								</tr>
								</table>
							</div>
							<table id="tableBusInfoIn" class="table table-striped table-bordered table-hover" style="font-size: 12px;">
							<thead>
							<tr>
								<tr id="0">
								<th style="text-align:center;" width="15px"><input type="checkbox" id="checkall_in"></th>			
								<th style="text-align:center;" width="50px">车号</th>					
								<th style="text-align:center;" width="35px">订单</th>					
								<th style="text-align:center;" width="15px">车型</th>					
								<th style="text-align:center;" width="25px">年份</th>					
								<th style="text-align:center;" width="35px">客户</th>					
								<th style="text-align:center;" width="35px">配置</th>					
								<th style="text-align:center;" width="50px">VIN</th>					
								<th style="text-align:center;" width="35px">生产工厂</th>					
								<th style="text-align:center;" width="35px">当前工序</th>					
								<th style="text-align:center;" width="15px">状态</th>
							</tr>
							</thead>
							<tbody></tbody>
							</table>
							
						</div>
						<div id="his" style="overflow-x:auto;overflow-y:auto;" class="tab-pane fade in">
							<div class="well">
								<table>
									<tr>
									<td>车号：</td>
									<td><input id="transfer_his_busnumber" placeholder="请输入车号..." style="height: 30px;width:150px" type="text"></td>
									<td>VIN号：</td>
									<td><input id="transfer_his_vin" placeholder="请输入VIN号..." style="height: 30px;width:150px" type="text"></td>
									<td>&nbsp;订单编号：</td>
									<td><input style="height: 30px;" type="text" class="input-medium revise" placeholder="订单编号..." id="transfer_his_orderno" /></td>
									</tr>
									<tr>
									<td>调出工厂：</td>
									<td colspan=3><select id="transfer_his_out_factory" style="width:100px;height:30px"></select>
									<input id="start_date" placeholder="开始时间..." style="width:85px" type="text" onClick="WdatePicker({el:'start_date',dateFmt:'yyyy-MM-dd'});"> - <input id="end_date" placeholder="结束时间..." style="width:85px" type="text" onClick="WdatePicker({el:'end_date',dateFmt:'yyyy-MM-dd'});"></td>
									<td>&nbsp;调入工厂：</td>
									<td colspan=3><select id="transfer_his_in_factory" style="width:100px;height:30px"></select>
									<input id="start_date2" placeholder="开始时间..." style="width:85px" type="text" onClick="WdatePicker({el:'start_date2',dateFmt:'yyyy-MM-dd'});"> - <input id="end_date2" placeholder="结束时间..." style="width:85px" type="text" onClick="WdatePicker({el:'end_date2',dateFmt:'yyyy-MM-dd'});">
									<input id="btnTransferHisQuery" type="button" class="btn btn-sm btn-primary" value="查询" style="margin-left: 2px;"></input>
									</td>
									</tr>
								</table>
							</div>
							<table id="tableBusHisInfo" class="table table-striped table-bordered table-hover" style="font-size: 12px;">
							<thead>
							<tr id="0">
							<th style="text-align:center;" width="30px">车号</th>					
							<th style="text-align:center;" width="45px">订单</th>					
							<th style="text-align:center;" width="20px">车型</th>					
							<th style="text-align:center;" width="20px">年份</th>					
							<th style="text-align:center;" width="30px">客户</th>					
							<th style="text-align:center;" width="30px">配置</th>					
							<th style="text-align:center;" width="30px">VIN</th>
							<th style="text-align:center;" width="40px">调出工厂</th>					
							<th style="text-align:center;" width="40px">调入工厂</th>			
							<th style="text-align:center;" width="30px">调出时间</th>			
							<th style="text-align:center;" width="35px">调出人</th>			
							<th style="text-align:center;" width="40px">接收时间</th>			
							<th style="text-align:center;" width="25px">接收人</th>
							</tr>
							</thead>
							<tbody></tbody>
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
	<script src="../assets/js/fuelux/fuelux.tree.min.js"></script>
	<script src="../assets/js/jquery.ui.touch-punch.min.js"></script>
	<script src="../assets/js/jquery.gritter.min.js"></script>
	<script src="../js/datePicker/WdatePicker.js"></script>
	<script src="../assets/js/bootstrap3-typeahead.js"></script>
	<script src="../js/common.js"></script>
	<script src="../js/plan/busTransfer.js"></script>
</html>
