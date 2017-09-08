<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html lang="zh-CN">
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta charset="utf-8" />
		<title>标准故障库</title>
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
						<li><a href="#">制程品质</a></li>
						<li class="active">标准故障库</li>
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
					
					<div class="well">
						<table>
							<tr>
								<td>缺陷名称：</td>
								<td><input id="input_bug" placeholder="缺陷名称..." style="width:100px" type="text"></td>
								<td>&nbsp;缺陷类别：</td>
								<td><input id="input_bug_type" placeholder="缺陷类别..." style="width:100px" type="text"></td>
								<td>&nbsp;严重等级：</td>
								<td width="300px">
									<label class="" style="display:-webkit-inline-box;margin-left:10px">
									<input type="checkbox" name="faultlevel" value="S" />S
									</label>
									<label class="" style="display:-webkit-inline-box;margin-left:4px;vertical-align:bottom">
									<input type="checkbox" name="faultlevel" value="A" />A
									</label>
									<label class="" style="display:-webkit-inline-box;margin-left:4px;vertical-align:bottom">
									<input type="checkbox" name="faultlevel" value="B" />B
									</label>
									<label class="" style="display:-webkit-inline-box;margin-left:4px;vertical-align:bottom">
									<input type="checkbox" name="faultlevel" value="C" />C								
									</label>
								</td>
								<td><input id="btnQuery" type="button" class="btn btn-sm btn-primary" value="查询" style="margin-left: 2px;"></input><input id="btnAdd" type="button" class="btn btn-sm btn-success" value="新增" style="margin-left: 2px;"></input></td>
							</tr>
						</table>
					</div>	
					
					<table id="tableData" class="table table-striped table-bordered table-hover" style="overflow-x:auto;font-size: 12px;">
					</table>
					
					</div>
			</div><!-- /.main-content -->
			
			<div id="dialog-add" class="hide" style="align:center;width:700px;height:500px">
				<form>
					<table>
					<tr style="height:40px">
						<td align="right" style="width:100px">*缺陷类别：</td><td style="width:150px"><input type="text" class="input-medium" id="new_bug_type" style="width:150px"/></td>
						<td></td><td></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:100px">*严重等级：</td><td style="width:150px">
							<select class="input-medium" id="new_faultlevel" style="width:150px">
								<option value="S">S</option>
								<option value="A">A</option>
								<option value="B">B</option>
								<option value="C">C</option>
							</select></td>
						<td align="right" style="width:100px">缺陷分类：</td><td style="width:150px">
							<input type="text" class="input-medium" id="new_faulttype" style="width:150px" />
						</td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:100px">*缺陷名称：</td><td colspan=3><input type="text" class="input-medium" id="new_bug" style="width:400px"/></td>
					</tr>
					
					</table>
				</form>
			
			</div>
			
			<div id="dialog-edit" class="hide" style="align:center;width:700px;height:500px">
				<form>
					<table>
					<tr style="height:40px">
						<td align="right" style="width:100px">缺陷类别：</td><td style="width:150px"><input type="text" class="input-medium" id="edit_bug_type" style="width:150px"/></td>
						<td></td><td></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:100px">严重等级：</td><td style="width:150px">
							<select class="input-medium" id="edit_faultlevel" style="width:150px">
								<option value="S">S</option>
								<option value="A">A</option>
								<option value="B">B</option>
								<option value="C">C</option>
							</select></td>
						<td align="right" style="width:100px">缺陷分类：</td><td style="width:150px">
							<input type="text" class="input-medium" id="edit_faulttype" style="width:150px" />
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:100px">缺陷名称：</td><td colspan=3><input type="text" class="input-medium" id="edit_bug" style="width:400px"/></td>
					</tr>
					
					</table>
					<input type="text" class="input-medium" id="edit_id" style="display:none"/>
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
	<script type="text/javascript" src="../js/quality/standardFaultLib.js"></script>
</html>
