<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<html lang="zh-CN">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta charset="utf-8" />
<title>成品记录表</title>
<meta name="description" content="Common Buttons &amp; Icons" />
<meta name="viewport"
	content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />	
<link rel="stylesheet"
	href="../assets/css/fixedColumns.bootstrap.min.css" />
<link rel="stylesheet"
	href="../assets/css/fixedColumns.dataTables.min.css" />
<link rel="stylesheet" href="../assets/css/jquery-ui.min.css" />

</head>
<body class="no-skin" style="font-family: 'Microsoft YaHei';">
	<!-- 头 -->
	<jsp:include page="../top.jsp" flush="true" />
	<!-- 身 -->
	<div class="main-container" id="main-container">
		<!-- 左边菜单 -->
		<jsp:include page="../left.jsp" flush="true" />
		<!-- 主体 -->
		<div class="main-content">
			<!-- 路径和搜索框 -->
			<div class="main-content-inner">
				<div class="breadcrumbs ace-save-state" id="breadcrumbs">
					<ul class="breadcrumb">
						<li><i class="ace-icon fa fa-home home-icon"></i><a
							href="/BMS/index">首页</a></li>
						<li><a href="#">制程品质</a></li>
						<li><a href="#">成品记录表</a></li>
					</ul>
					<!-- /.breadcrumb -->

					<div class="nav-search" id="nav-search">
						<form class="form-search">
							<span class="input-icon">
								<input type="text" placeholder="Search ..." class="nav-search-input" id="nav-search-input" autocomplete="off" /><i class="ace-icon fa fa-search nav-search-icon"></i>
							</span>
						</form>
					</div>
					<!-- /.nav-search -->
				</div>

				<div class="page-content">
					<form id="form" class="well form-search">
						<table>
							<tr>
								<td>工厂：</td>
								<td>
									<select name="" id="search_factory" class="input-medium carType" style="height: 30px;width:100px;" ></select>
								</td>
								<td>检验节点：</td>
								<td>
									<select id="search_node" class="input-medium" style="height: 30px;width:80px;" >
										<option value=''>全部</option>
									</select>
								</td>	
								<td>订单：</td>
								<td><input style="height: 30px;width:130px;" type="text" class="input-medium revise" placeholder="订单编号..." id="search_order_no" /></td> 					
								<td>车号：</td>
								<td><input style="height: 30px;width:160px;" type="text" class="input-medium revise" placeholder="车号..." id="search_bus_number" /></td> 	
								
								<td style="padding-left:5px;">
								<label class=""> <input name="search_test_result" value="0" type="checkbox">一次检验合格
								</label> <label class=""> <input name="search_test_result" value="1" type="checkbox">返工/返修合格
								</label> <label class=""> <input name="search_test_result" value="2" type="checkbox">让步放行
								</label>
								</td>
								<td><input type="button" class="btn btn-sm btn-primary" id="btnQuery" value="查询" style="margin-left: 10px;"></input>						
										 <input type="button" class="btn btn-sm btn-success" id="btnAdd" value="新增" style="margin-left: 2px;"></input>
								</td>
							</tr>

						</table>
					</form>
						
					<div class="row" >
					<div class="col-xs-12 " id="scroll_div">
						<table id="tableResult" class="table table-striped table-bordered table-hover  " style="font-size: 12px;" >
						</table>	
					</div>
					</div>
				</div>

			<div id="dialog-config" class="hide" >
				<div id="create_form"  style="padding-left:20px;">
					<table style="line-height:35px;">
						<tr>
							<td width="80px" style="text-align:right">车号： </td>
							<td width="150px"><input id="bus_number" style="width: 150px;height:30px;" type="text"></td>
							<td width="80px" style="text-align:right">工厂： </td>
							<td width="150px"><select id="factory"  class="input-medium" style="width:150px;" disabled></select></td>			
							<td width="100px" style="text-align:right">检验节点： </td>				
							<td width="100px"><select id="check_node"  class="input-medium" style="width:100px;"></select></td>
							<td width="80px" style="text-align:right">订单： </td>
							<td ><span id="order" ></span></td>
							<td></td>
						</tr>
						<tr>
							<td width="80px" style="text-align:right">检验日期： </td>
							<td width="150px"><input id="test_date" style="width: 150px;height:30px;" type="text" onclick="WdatePicker({el:'test_date',dateFmt:'yyyy-MM-dd'});"></td>
							<td width="80px" style="text-align:right">检验结论： </td>
							<td colspan=3><label style="padding-left:10px;"><input name="testResult" value="0" type="radio">一次交检合格 </label>
							<label style="padding-left:10px;"><input name="testResult" value="1" type="radio">返工/返修合格 </label>
							<label style="padding-left:10px;"><input name="testResult" value="2" type="radio">让步放行</label>
							</td>										
							<td colspan=2>
								<input class="btn btn-sm btn-primary" id="btnShowTpl" value="确定" style="margin-left: 2px;" type="button">
								<!-- <input class="btn btn-sm btn-success" id="btnSave" value="保存" style="margin-left: 2px;" type="button"> -->
							</td>
						</tr>
					</table>
					
				</div>
				<div class="row" style="margin-top:10px;">
					<div class="col-xs-12" id="scroll_div" >
						<table id="tableDetail" class="table table-striped table-bordered table-hover " style="font-size: 12px;width:2000px;overflow:auto;text-align:center" >
						</table>	
					</div>
				</div>
			</div>		
		
		<div id="dialog-config-quaStad" class="hide" >
			<table style="line-height:35px;">
				<tr>
					<td>缺陷类别：</td>
					<td><input class="input-medium revise" id="bug_type" type="text" style="height:30px;width:100px"></td>
					<td>缺陷名称：</td>
					<td><input class="input-medium revise" id="bug" type="text" style="height:30px;width:120px"></td>
					<td>严重等级：</td>
					<td>
						<select name="" id="fault_level" class="input-medium carType" style="width:80px">
							<option value="">请选择</option>
							<option value="S">S</option>
							<option value="A">A</option>
							<option value="B">B</option>
							<option value="C">C</option>
						</select>
					</td>
					<td>缺陷分类：</td>
					<td><input class="input-medium revise" id="fault_type" type="text" style="height:30px;width:100px"></td>
					<td><input class="btn btn-sm btn-primary" id="btnLibQuery" value="查询" style="margin-left: 2px;" type="button">
					</td>
				</tr>
				</table>
			<div class="row" style="margin-top:10px;">
					<div class="col-xs-12" id="scroll_div" >
						<table id="faultLibTable" class="table table-striped table-bordered table-hover " style="font-size: 12px;width:730px;text-align:center" >
						</table>	
					</div>
				</div>
		</div>
			<select style="display:none" id="workshop_tmpl">
			
			</select>
		</div>
			<!-- /.main-container -->
		</div>
	</div>
	
	<script src="../js/datePicker/WdatePicker.js"></script>
	<script src="../assets/js/jquery.dataTables.min.js"></script>
	<script src="../assets/js/jquery-ui.min.js"></script>
	<script src="../assets/js/jquery.dataTables.bootstrap.js"></script>
	<script src="../assets/js/dataTables.fixedColumns.min.js"></script>
	<script src="../assets/js/dataTables.rowGroup.js"></script>
	<script src="../assets/js/bootstrap3-typeahead.js"></script>
	<script src="../assets/js/ace-elements.min.js"></script>
	<script src="../assets/js/jquery.gritter.min.js"></script>
	<script src="../js/jquery.form.js"></script>	
	<script src="../js/common.js"></script>
	<script src="../js/quality/productRecord.js"></script>
</body>
</html>