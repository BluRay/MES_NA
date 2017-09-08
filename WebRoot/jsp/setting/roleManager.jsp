<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html lang="en">
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta charset="utf-8" />
		<title>MES Settings Role Management</title>
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
						<li class="active">Role Management</li>
					</ul><!-- /.breadcrumb -->

					<div class="nav-search" id="nav-search">
						<form class="form-search">
							<span class="input-icon">
								<input type="text" placeholder="Search ..." class="nav-search-input" id="nav-search-input" autocomplete="off" /><i class="ace-icon fa fa-search nav-search-icon"></i>
							</span>
						</form>
					</div><!-- /.nav-search -->
				</div>
				
			<div class="page-content">
					<!-- 设置小部件 -->
					<!-- /section:settings.box -->
					
					<div class="row">
						<div class="col-xs-12">
							<div class="row">
								<div class="col-sm-4">
									<div id="div_tree1" class="widget-box widget-color-blue2" style="height:350px;OVERFLOW-X:auto;OVERFLOW-Y:auto;OVERFLOW:auto">
										<div class="widget-header">
											<h4 class="widget-title lighter smaller">Select User Role&nbsp;&nbsp;&nbsp;&nbsp;</h4>
											<button id="btn_save" style="float:right;margin-top:2px" class="btn btn-sm btn-purple">Save</button>&nbsp;&nbsp;
											<button id="btn_addRole" style="float:right;margin-top:2px" class="btn btn-sm btn-success">Add</button>
											
										</div>

										<div class="widget-body">
											<div class="widget-main padding-8">
												<div id="tree1" class="tree"></div>
											</div>
										</div>
									</div>
								</div>
								<div class="col-sm-8">
									<div id="div_tree2" class="widget-box widget-color-green2" style="height:350px;OVERFLOW-X:auto;OVERFLOW-Y:auto;OVERFLOW:auto">
										<div class="widget-header">
											<h4 class="widget-title lighter smaller">Program Permission Settings</h4>
										</div>

										<div class="widget-body">
											<div class="widget-main padding-8">
											<div id="tree2" class="tree"></div>
											</div>
										</div>
									</div>
								</div>
							</div>
							
							<div class="row">
								<div class="col-sm-12">
									<div id="div_3" class="widget-box widget-color-blue2" style="height:100px">
										<div class="widget-header">
											<h4 class="widget-title lighter smaller">Role Content Configuration</h4>
										</div>
										<div class="widget-body">
											<div class="widget-main padding-8">
												<div class="checkbox">
													<label>
														<input id="checkbox1" name="form-field-checkbox" type="checkbox" class="ace" />
														<span class="lbl"> Plant</span>
													</label>
													<label>
														<input id="checkbox2" name="form-field-checkbox" type="checkbox" class="ace" />
														<span class="lbl"> Workshop</span>
													</label>
													<label>
														<input id="checkbox3" name="form-field-checkbox" type="checkbox" class="ace" />
														<span class="lbl"> Line</span>
													</label>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							
						</div>							
					</div>
			</div><!-- /.main-content -->
			<div id="dialog-confirm" class="hide" style="width:800px;height:600px">
				<form>
					<fieldset>
						<div class="form-group form-horizontal">
							<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> Role Name： </label>
							<div class="col-sm-9"><input id="new_role_name" placeholder="Role Name..." class="col-sm-9" type="text"></div>
						</div>
					</fieldset><br/>
					<fieldset>
						<div class="form-group form-horizontal">
							<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> Role Description： </label>
							<div class="col-sm-9"><input id="new_role_description" placeholder="Role description..." class="col-sm-9" type="text"></div>
						</div>
					</fieldset><br/>
					<fieldset>
						<div class="form-group form-horizontal">
							<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> Type： </label>
							<div class="col-sm-9">
								<select id="new_type" class="col-sm-9" id="form-field-select-1">
									<option value="1">System Role</option>
									<option value="2">Business Role</option>
								</select>
							</div>
						</div>
					</fieldset>
	
					<div class="form-actions center">
						<button id="btn_ok" type="button" class="btn btn-success" role="button"><span class="ui-button-text"><i class="ace-icon glyphicon glyphicon-ok"></i>&nbsp; Add</span></button>
					<button id="btn_cancel" type="button" class="btn" role="button"><span class="ui-button-text"><i class="ace-icon glyphicon glyphicon-remove"></i>&nbsp; Cancel</span></button>
					</div>
				</form>

			</div>
			<!-- 脚 -->
			<%-- <jsp:include page="footer.jsp" flush="true"/> --%>
			<a href="#" id="btn-scroll-up" class="btn-scroll-up btn btn-sm btn-inverse"><i class="ace-icon fa fa-angle-double-up icon-only bigger-110"></i></a>
		</div><!-- /.main-container -->
	</div>
		<script src="../assets/js/fuelux/fuelux.tree.min.js"></script>
		<script src="../js/setting/roleManager.js"></script>
		<script src="../assets/js/jquery-ui.min.js"></script>
		<script src="../assets/js/jquery.ui.touch-punch.min.js"></script>
		<script src="../assets/js/jquery.gritter.min.js"></script>
	</body>
</html>
