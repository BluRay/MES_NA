<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html lang="zh-CN">
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta charset="utf-8" />
		<title>生产查询</title>
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
						<li><a href="#">生产执行</a></li>
						<li class="active">生产查询</li>
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
							<td><select id="search_factory" class="input-small" style="height: 30px;width:150px"></select></td>
							<td>&nbsp;车间：</td>
							<td><select id="search_workshop" class="input-small" style="height: 30px;width:150px"></select></td>
							<td>&nbsp;线别：</td>
							<td><select id="search_line" style="height: 30px;" class="input-small"><option value=''>全部</option><option value='A'>A线</option><option value='B'>B线</option></select></td>
							<td id="onoff_lable">&nbsp;上/下线：</td>
							<td id="onoff_td"><select name="" id="on_offline" style="height: 30px;width:60px" class="input-small">
							<option value=''>全部</option><option value='上线'>上线</option><option value='下线'>下线</option>
							</select>
							</td>
							<td id='date_lable' style="display:none">&nbsp;日期范围</td>
							<td style="display:none" id="date_td">
							<input type="text" id="date_start" style="height: 30px;width:100px" class="input-small" onclick="WdatePicker({dateFmt:'yyyy-MM-dd'})"/>
							<span>-</span>
							<input type="text" id="date_end" style="height: 30px;width:100px" class="input-small" onclick="WdatePicker({dateFmt:'yyyy-MM-dd'})"/>
							</td>							
							
						</tr>
						<tr>
							<td>订单编号：</td>
							<td><input style="height: 30px;" type="text" style="height: 30px;width:180px" class="input-medium revise" placeholder="订单编号..." id="search_order_no" /></td>
							<td>&nbsp;车号：</td>
							<td><input class="input-medium" placeholder="车号..." id="search_busnumber"  style="height: 30px;width:150px" type="text"></td>
							
							<td id="exce_lable">&nbsp;异常信息：</td>
							<td id="exce_td"><select name="" id="search_exception" style="height: 30px;" class="input-small carType"><option value='0'>全部</option><option value='1'>正常</option><option value='2'>异常已处理</option><option value='3'>异常未处理</option></select></td>						
							
							<td><input type="button" class="btn btn-sm btn-success" id="btnQuery" value="查询" style="margin-left: 2px;"></input>&nbsp;</td>
							<td>
							</td>
						</tr>
					</table>
					</div>		
					
					<p style="font-weight:bold">当前车辆数量统计：</p>
					<table id="tableWorkshopCount" style=";text-align:center;table-layout:fixed;font-size:12px;border-collapse: collapse" class="table table-bordered table-striped">
						<thead id="th_count_cs">
							<tr id="0">
								<th style="text-align:center;">车间</th>
								<th style="text-align:center;">焊装</th>
								<th style="text-align:center;">WIP</th>
								<th style="text-align:center;">涂装</th>
								<th style="text-align:center;">WIP</th>
								<th style="text-align:center;">底盘</th>
								<th style="text-align:center;">WIP</th>
								<th style="text-align:center;">总装</th>
								<th style="text-align:center;">调试区</th>
								<th style="text-align:center;">检测线</th>
								<th style="text-align:center;">成品库</th>
							</tr>
						</thead>
						<thead id="th_count_other" style="display:none">
							<tr id="0">
								<th style="text-align:center;">车间</th>
								<th style="text-align:center;">焊装</th>
								<th style="text-align:center;">WIP</th>
								<th style="text-align:center;">涂装</th>
								<th style="text-align:center;">WIP</th>
								<th style="text-align:center;">底盘</th>
								<th style="text-align:center;">WIP</th>
								<th style="text-align:center;">总装</th>
								<th style="text-align:center;">调试区</th>
								<th style="text-align:center;">检测线</th>
								<th style="text-align:center;">成品库</th>
							</tr>
						</thead>
						<thead id="th_count_onoff" style="display:none">
							<tr id="0">
								<th style="text-align:center;">车间</th>
								<th style="text-align:center;">焊装</th>
								<th style="text-align:center;">涂装</th>
								<th style="text-align:center;">底盘</th>
								<th style="text-align:center;">总装</th>
								<th style="text-align:center;">调试区</th>
								<th style="text-align:center;">检测线</th>
							</tr>
						</thead>
						<tbody>	
						</tbody>
					</table>
					
					<p id="detail_info" style="font-weight:bold">当前车辆位置：</p>
					<table id="tableWorkshopCarinfo" style=";text-align:center;table-layout:fixed;font-size:12px" class="table table-bordered table-striped">
						<thead>
							<tr id="0">
								<th style="width:60px;text-align:center;">序号</th>
								<th style="text-align:center;">生产订单</th>
								<th style="text-align:center;">车辆车号</th>
								<th style="text-align:center;width:100px">生产车间</th>
								<th style="text-align:center;width:100px">生产线别</th>
								<th style="text-align:center;">当前工序</th>
								<th style="text-align:center;width:150px"">进入时间</th>
								<th style="text-align:center;width:100px">车辆状态</th>
							</tr>
						</thead>
						<tbody>	
						</tbody>
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
	<script type="text/javascript" src="../js/datePicker/WdatePicker.js"></script>
	<script type="text/javascript" src="../js/common.js"></script>
	<script type="text/javascript" src="../js/production/productionsearch.js"></script>
</html>
