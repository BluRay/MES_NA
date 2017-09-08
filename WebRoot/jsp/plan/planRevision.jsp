<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html lang="zh-CN">
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta charset="utf-8" />
		<title>计划调整</title>
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
						<li class="active">计划调整</li>
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
								<td>&nbsp;订单年月：</td>
								<td width="200px"><select id="search_year" style="height: 30px;width:80px"></select> - 
								<select id="search_month" style="height: 30px;width:60px">
									<option value="01">1月</option><option value="02">2月</option><option value="03">3月</option><option value="04">4月</option>
									<option value="05">5月</option><option value="06">6月</option><option value="07">7月</option><option value="08">8月</option>
									<option value="09">9月</option><option value="10">10月</option><option value="11">11月</option><option value="12">12月</option>
								</select>
								</td>
								<td><input type="button" class="btn btn-sm btn-success" id="btnQuery" value="查询" style="margin-left: 2px;"></input>&nbsp;</td>
								<td><input type="button" class="btn btn-sm btn-info" id="btnSave" value="保存" style="margin-left: 2px;"></input>&nbsp;</td>
								<td>
								<input type="text" style="display:none" class="input-small revise" id="order_id"></input>
								<input type="text" style="display:none" class="input-small revise" id="factory_id"></input>
								<input type="text" style="display:none;width:400px" class="input-large revise" id="revision_str"></input>
								</td>
							</tr>
						</table>
					</div>	
					
					<table id="tableData" class="table table-striped table-bordered table-hover" style="font-size: 12px;">
					<thead><tr>
						<th style="text-align:center;padding-left:0px;padding-right:0px;width:60px;">计划调整</th><th id="th_order_no" style="text-align:center;padding-left:0px;padding-right:0px;" width="55px">-</th>
						<th style="text-align:center;padding-left:0px;padding-right:0px;" width="33px"><p style="width:33px;margin:0">日期</p></th>
						<th style="text-align:center;padding-left:0px;padding-right:0px;" width="22px">1</th><th style="text-align:center;padding-left:0px;padding-right:0px;" width="22px">2</th><th style="text-align:center;padding-left:0px;padding-right:0px;" width="22px">3</th>
						<th style="text-align:center;padding-left:0px;padding-right:0px;" width="22px">4</th><th style="text-align:center;padding-left:0px;padding-right:0px;" width="22px">5</th><th style="text-align:center;padding-left:0px;padding-right:0px;" width="22px">6</th>
						<th style="text-align:center;padding-left:0px;padding-right:0px;" width="22px">7</th><th style="text-align:center;padding-left:0px;padding-right:0px;" width="22px">8</th><th style="text-align:center;padding-left:0px;padding-right:0px;" width="22px">9</th>
						<th style="text-align:center;padding-left:0px;padding-right:0px;" width="22px">10</th><th style="text-align:center;padding-left:0px;padding-right:0px;" width="22px">11</th><th style="text-align:center;padding-left:0px;padding-right:0px;" width="22px">12</th>
						<th style="text-align:center;padding-left:0px;padding-right:0px;" width="22px">13</th><th style="text-align:center;padding-left:0px;padding-right:0px;" width="22px">14</th><th style="text-align:center;padding-left:0px;padding-right:0px;" width="22px">15</th>
						
						<th style="text-align:center;padding-left:0px;padding-right:0px;" width="22px">16</th><th style="text-align:center;padding-left:0px;padding-right:0px;" width="22px">17</th><th style="text-align:center;padding-left:0px;padding-right:0px;" width="22px">18</th>
						<th style="text-align:center;padding-left:0px;padding-right:0px;" width="22px">19</th><th style="text-align:center;padding-left:0px;padding-right:0px;" width="22px">20</th><th style="text-align:center;padding-left:0px;padding-right:0px;" width="22px">21</th>
						<th style="text-align:center;padding-left:0px;padding-right:0px;" width="22px">22</th><th style="text-align:center;padding-left:0px;padding-right:0px;" width="22px">23</th><th style="text-align:center;padding-left:0px;padding-right:0px;" width="22px">24</th>
						<th style="text-align:center;padding-left:0px;padding-right:0px;" width="22px">25</th><th style="text-align:center;padding-left:0px;padding-right:0px;" width="22px">26</th><th style="text-align:center;padding-left:0px;padding-right:0px;" width="22px">27</th>
						<th style="text-align:center;padding-left:0px;padding-right:0px;" width="22px">28</th><th style="text-align:center;padding-left:0px;padding-right:0px;" width="22px">29</th><th style="text-align:center;padding-left:0px;padding-right:0px;" width="22px">30</th>
						
						<th style="text-align:center;padding-left:0px;padding-right:0px;" width="22px">31</th><th style="text-align:center;padding-left:0px;padding-right:0px;" width="38px">合计</th>
						<th style="text-align:center;padding-left:0px;padding-right:0px;" width="38px">总计</th>
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
	<script src="../js/common.js"></script>
	<script src="../js/plan/planRevision.js"></script>
</html>
