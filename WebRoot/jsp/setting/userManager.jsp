<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html lang="en">
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta charset="utf-8" />
		<title>MES Settings User Management</title>
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
		<div id="div_row" class="main-container" id="main-container">
			<!-- 左边菜单 -->
			<jsp:include page="../left.jsp" flush="true"/>
			<!-- 主体 -->
			<div class="main-content">
			<!-- 路径和搜索框 -->
			<div class="breadcrumbs" id="breadcrumbs">
					<ul class="breadcrumb">
						<li><i class="ace-icon fa fa-home home-icon"></i><a href="<%=request.getContextPath()%>/index">Index</a></li>
						<li><a href="#">Settings</a></li>
						<li class="active">User Management</li>
					</ul>

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
								<td>Search Key：</td>
								<td><input id="search_key" placeholder="Staff number/Userame..." class="col-sm-10" type="text" style="width:180px;"></td>
								<td>&nbsp;<input id="btnQuery" type="button" class="btn btn-sm btn-success" value="Search"></input>&nbsp;</td>
								<td>&nbsp;<input id="btnAdd" type="button" class="btn btn-sm btn-info" value="Add">&nbsp;</td>
							</tr>
						</table>
					</div>
					<table id="tableData" class="table table-striped table-bordered table-hover" style="font-size: 12px;">
					</table>
					</div>
			</div><!-- /.main-content -->

			<div id="dialog-confirm" class="hide" style="width:800px;height:500px">
				<form>
					<fieldset>
						<div class="form-group form-horizontal">
							<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> username： </label>
							<div class="col-sm-9"><input id="new_username" placeholder="username" class="col-sm-9" type="text"></div>
						</div>
					</fieldset>
					<fieldset style ="padding-top:4px">
						<div class="form-group form-horizontal">
							<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> staff number： </label>
							<div class="col-sm-9"><input id="new_staff_number" placeholder="staff number" class="col-sm-9" type="text"></div>
						</div>
					</fieldset>
					<fieldset style ="padding-top:4px">
						<div class="form-group form-horizontal">
							<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> email： </label>
							<div class="col-sm-9"><input id="new_email" placeholder="email" class="col-sm-9" type="text"></div>
						</div>
					</fieldset>
					<fieldset style ="padding-top:4px">
						<div class="form-group form-horizontal">
							<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> cellphone： </label>
							<div class="col-sm-9"><input id="new_cellphone" placeholder="cellphone" class="col-sm-9" type="text"></div>
						</div>
					</fieldset>
					<fieldset style ="padding-top:4px">
						<div class="form-group form-horizontal">
							<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> telephone： </label>
							<div class="col-sm-9"><input id="new_telephone" placeholder="telephone" class="col-sm-9" type="text"></div>
						</div>
					</fieldset>
					<fieldset style ="padding-top:4px">
						<div class="form-group form-horizontal">
							<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> plant： </label>
							<div class="col-sm-9">
							<select id="new_factory_id" class="col-sm-9" id="form-field-select-1">
							</select>
							</div>
						</div>
					</fieldset>
					<fieldset style ="padding-top:4px">
						<div class="form-group form-horizontal">
							<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> user type： </label>
							<div class="col-sm-9">
								<select id="new_admin" class="col-sm-9" id="form-field-select-1">
									<option value="0">user</option>
									<option value="1">admin</option>
								</select>
							</div>
						</div>
					</fieldset>
				</form>

			</div>
			
			<div id="dialog-edit" class="hide" style="width:800px;height:500px">
				<form>
					<fieldset>
						<div class="form-group form-horizontal">
							<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> staff number： </label>
							<div class="col-sm-9"><input id="edit_staff_number" placeholder="staff number" disabled="disabled" class="col-sm-9" type="text"></div>
						</div>
					</fieldset>
					<fieldset style ="padding-top:4px">
						<div class="form-group form-horizontal">
							<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> username： </label>
							<div class="col-sm-9"><input id="edit_username" placeholder="姓名" class="col-sm-9" type="text"></div>
						</div>
					</fieldset>
					<fieldset style ="padding-top:4px">
						<div class="form-group form-horizontal">
							<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> email： </label>
							<div class="col-sm-9"><input id="edit_email" placeholder="邮箱地址" class="col-sm-9" type="text"></div>
						</div>
					</fieldset>
					<fieldset style ="padding-top:4px">
						<div class="form-group form-horizontal">
							<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> cellphone： </label>
							<div class="col-sm-9"><input id="edit_cellphone" placeholder="cellphone" class="col-sm-9" type="text"></div>
						</div>
					</fieldset>
					<fieldset style ="padding-top:4px">
						<div class="form-group form-horizontal">
							<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> elephone： </label>
							<div class="col-sm-9"><input id="edit_telephone" placeholder="elephone" class="col-sm-9" type="text"></div>
						</div>
					</fieldset>
					<fieldset style ="padding-top:4px">
						<div class="form-group form-horizontal">
							<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> plant： </label>
							<div class="col-sm-9"><select id="edit_factory_id" class="col-sm-9" id="form-field-select-1"></select></div>
						</div>
					</fieldset>
					<fieldset style ="padding-top:4px">
						<div class="form-group form-horizontal">
							<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> user type： </label>
							<div class="col-sm-9">
								<select id="edit_admin" class="col-sm-9" id="form-field-select-1">
									<option value="0">user</option>
									<option value="1">admin</option>
								</select>
							</div>
						</div>
					</fieldset>
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
	
	<script src="../js/common.js"></script>
	<script src="../js/setting/userManager.js"></script>
</html>
