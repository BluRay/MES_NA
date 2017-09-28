<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html lang="en">
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta charset="utf-8" />
		<title>Display Plan</title>
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
						<li><i class="ace-icon fa fa-home home-icon"></i><a href="/BMS/index">Index</a></li>
						<li><a href="importMaster">Import Plan</a></li>
						<li class="active">Display Plan</li>
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
								<td>Production Factory :</td>
								<td><select id="search_factory" class="input-small" style="height: 30px;width:120px"></select></td>
								<td>&nbsp;Project Name : &nbsp;</td>
								<td><input id="search_order_no" placeholder="Project Name..." style="height: 30px;width:120px" class="col-sm-10" type="text"></td>
								<td>&nbsp;Plan Month : &nbsp;</td>
								<td width="80px"><input id="search_plan_month" placeholder="Plan Month..." onClick="WdatePicker({el:'search_plan_month',dateFmt:'yyyy-MM'});" style="height: 30px;width:80px" type="text"></td>
								<td>&nbsp;Plan Version : &nbsp;</td>
								<td><input id="search_plan_version" style="height: 30px;" placeholder="Plan Version..." class="col-sm-12" type="text"></td>
								<td><input type="button" class="btn btn-sm btn-success" id="btnQuery" value="Search" style="margin-left: 2px;"></input>&nbsp;</td>
								<td></td>
							</tr>
						</table>
					</div>		
					<table id="tableData" class="table table-striped table-bordered table-hover" style="font-size: 12px;">
					<thead><tr>
						<th style="text-align:center;padding-left:0px;padding-right:0px;width:60px;">Plan</th><th id="th_order_no" style="text-align:center;padding-left:0px;padding-right:0px;" width="55px"></th>
						<th style="text-align:center;padding-left:0px;padding-right:0px;" width="30px">Date</th>
						<th style="text-align:center;padding-left:0px;padding-right:0px;" width="23px">1</th><th style="text-align:center;padding-left:0px;padding-right:0px;" width="23px">2</th><th style="text-align:center;padding-left:0px;padding-right:0px;" width="23px">3</th>
						<th style="text-align:center;padding-left:0px;padding-right:0px;" width="23px">4</th><th style="text-align:center;padding-left:0px;padding-right:0px;" width="23px">5</th><th style="text-align:center;padding-left:0px;padding-right:0px;" width="23px">6</th>
						<th style="text-align:center;padding-left:0px;padding-right:0px;" width="23px">7</th><th style="text-align:center;padding-left:0px;padding-right:0px;" width="23px">8</th><th style="text-align:center;padding-left:0px;padding-right:0px;" width="23px">9</th>
						<th style="text-align:center;padding-left:0px;padding-right:0px;" width="23px">10</th><th style="text-align:center;padding-left:0px;padding-right:0px;" width="23px">11</th><th style="text-align:center;padding-left:0px;padding-right:0px;" width="23px">12</th>
						<th style="text-align:center;padding-left:0px;padding-right:0px;" width="23px">13</th><th style="text-align:center;padding-left:0px;padding-right:0px;" width="23px">14</th><th style="text-align:center;padding-left:0px;padding-right:0px;" width="23px">15</th>
						
						<th style="text-align:center;padding-left:0px;padding-right:0px;" width="23px">16</th><th style="text-align:center;padding-left:0px;padding-right:0px;" width="23px">17</th><th style="text-align:center;padding-left:0px;padding-right:0px;" width="23px">18</th>
						<th style="text-align:center;padding-left:0px;padding-right:0px;" width="23px">19</th><th style="text-align:center;padding-left:0px;padding-right:0px;" width="23px">20</th><th style="text-align:center;padding-left:0px;padding-right:0px;" width="23px">21</th>
						<th style="text-align:center;padding-left:0px;padding-right:0px;" width="23px">22</th><th style="text-align:center;padding-left:0px;padding-right:0px;" width="23px">23</th><th style="text-align:center;padding-left:0px;padding-right:0px;" width="23px">24</th>
						<th style="text-align:center;padding-left:0px;padding-right:0px;" width="23px">25</th><th style="text-align:center;padding-left:0px;padding-right:0px;" width="23px">26</th><th style="text-align:center;padding-left:0px;padding-right:0px;" width="23px">27</th>
						<th style="text-align:center;padding-left:0px;padding-right:0px;" width="23px">28</th><th style="text-align:center;padding-left:0px;padding-right:0px;" width="23px">29</th><th style="text-align:center;padding-left:0px;padding-right:0px;" width="23px">30</th>
						
						<th style="text-align:center;padding-left:0px;padding-right:0px;" width="23px">31</th><th style="text-align:center;padding-left:0px;padding-right:0px;" width="38px">Sum</th>
						<th style="text-align:center;padding-left:0px;padding-right:0px;" width="38px">Total</th>
					</tr></thead>
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
	<script src="../assets/js/bootstrap3-typeahead.js"></script>
	<script src="../assets/js/jquery.gritter.min.js"></script>
	<script src="../assets/js/jquery.dataTables.min.js"></script>
	<script src="../assets/js/jquery.dataTables.bootstrap.js"></script>
	<script src="../assets/js/dataTables.fixedColumns.min.js"></script>
	<script type="text/javascript" src="../js/datePicker/WdatePicker.js"></script>
	<script type="text/javascript" src="../js/common.js"></script>
	<script type="text/javascript" src="../js/plan/displayPlan.js"></script>
</html>
