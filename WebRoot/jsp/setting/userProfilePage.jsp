<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html lang="zh-CN">
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta charset="utf-8" />
		<title>User Center</title>
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
						<li><i class="ace-icon fa fa-home home-icon"></i><a href="/MES/index">Index</a></li>
						<li><a href="#">Setting</a></li>
						<li class="active">User Center</li>
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
					
					<div class="profile-user-info profile-user-info-striped">
						<div class="profile-info-row">
							<div class="profile-info-name"> Username： </div>
							<div class="profile-info-value">
								<input id="username" disabled="disabled" style="width:240px;background-color:gainsboro" type="text">
							</div>
						</div>
						<div class="profile-info-row">
							<div class="profile-info-name"> Factory： </div>
							<div class="profile-info-value">
								<input id="factory_name" disabled="disabled" style="width:240px;background-color:gainsboro" type="text">
							</div>
						</div>
						<div class="profile-info-row">
							<div class="profile-info-name"> Staff Number： </div>
							<div class="profile-info-value">
								<input id="staff_number" disabled="disabled" style="width:240px;background-color:gainsboro" type="text">
							</div>
						</div>
						<div class="profile-info-row">
							<div class="profile-info-name"> Card： </div>
							<div class="profile-info-value">
								<input id="card_8H10D" disabled="disabled" style="width:240px;background-color:gainsboro" type="text">
							</div>
						</div>
						<div class="profile-info-row">
							<div class="profile-info-name"> Email Address： </div>
							<div class="profile-info-value">
								<input id="email" style="width:240px" type="text">
							</div>
						</div>
						<div class="profile-info-row">
							<div class="profile-info-name"> Telephone： </div>
							<div class="profile-info-value">
								<input id="telephone"  style="width:240px" type="text">
							</div>
						</div>
						<div class="profile-info-row">
							<div class="profile-info-name"> Cellphone： </div>
							<div class="profile-info-value">
								<input id="cellphone" style="width:240px" type="text">
							</div>
						</div>
						<div class="profile-info-row">
							<div class="profile-info-name"> Login Count： </div>
							<div class="profile-info-value">
								<input id="login_count" disabled="disabled" style="width:240px;background-color:gainsboro" type="text">
							</div>
						</div>
						<div class="profile-info-row">
							<div class="profile-info-name"> Last Login Time： </div>
							<div class="profile-info-value">
								<input id="last_login_time" disabled="disabled" style="width:240px;background-color:gainsboro" type="text">
							</div>
						</div>
						
						<div class="profile-info-row">
							<div class="profile-info-name"></div>

							<div class="profile-info-value">
								<input id="btnEditInfo" type="button" class="btn btn-sm btn-success" value="Update"></input>
								<input id="btnEditPassword" type="button" class="btn btn-sm btn-info" value="Modify Password"></input>
							</div>
						</div>
					</div>
					
					</div>
			</div><!-- /.main-content -->
			
			<div id="dialog-edit" class="hide" style="width:800px;height:500px">
				<fieldset>
					<div class="form-group form-horizontal">
						<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> Old Password： </label>
						<div class="col-sm-9"><input id="old_password" class="col-sm-9" type="password"></div>
					</div>
				</fieldset><br/>
				<fieldset>
					<div class="form-group form-horizontal">
						<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> New Password： </label>
						<div class="col-sm-9"><input id="new_password" class="col-sm-9" type="password"></div>
					</div>
				</fieldset><br/>
				<fieldset>
					<div class="form-group form-horizontal">
						<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> Confirm New Password： </label>
						<div class="col-sm-9"><input id="new_password2" class="col-sm-9" type="password"></div>
					</div>
				</fieldset>
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
	<script src="../assets/js/bootstrap3-typeahead.js"></script>
	<script src="../assets/js/jquery.dataTables.min.js"></script>
	<script src="../assets/js/jquery.dataTables.bootstrap.js"></script>
	<script src="../js/common.js"></script>
	<script src="../js/setting/userProfilePage.js"></script>
</html>
