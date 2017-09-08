<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html lang="en">
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta charset="utf-8" />
		<title>BMS 设置 班组</title>
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
						<li><i class="ace-icon fa fa-home home-icon"></i><a href="<%=request.getContextPath()%>/index">首页</a></li>
						<li><a href="#">设置</a></li>
						<li class="active">班组</li>
					</ul>

					<div class="nav-search" id="nav-search">
						<form class="form-search">
							<span class="input-icon">
								<input type="text" placeholder="Search ..." class="nav-search-input" id="nav-search-input" autocomplete="off" /><i class="ace-icon fa fa-search nav-search-icon"></i>
							</span>
						</form>
					</div><!-- /.nav-search -->
				</div>
				
			<div class="page-content">
					
					<div class="row">
						<div class="col-xs-12">
							<div class="row">
								<div class="col-sm-4">
									<div id="div_tree1" class="widget-box widget-color-blue2" style="height:800px;OVERFLOW-X:auto;OVERFLOW-Y:auto;OVERFLOW:auto">
										<div class="widget-header">
											<h4 class="widget-title lighter smaller">班组菜单&nbsp;&nbsp;&nbsp;&nbsp;</h4>
										</div>

										<div class="widget-body">
											<div class="widget-main padding-8">
												<div id="tree2" class="tree tree-unselectable"></div>
											</div>
										</div>
									</div>
								</div>
								<div class="col-sm-8">
									<div id="div_tree2" class="widget-box widget-color-green2" style="height:800px;OVERFLOW-X:auto;OVERFLOW-Y:auto;OVERFLOW:auto">
										<div class="widget-header">
											<h4 class="widget-title lighter smaller" id="nodeName">标准班组:&nbsp;</h4>
											<button id="btn_delete" style="float:right;margin-top:2px" class="btn btn-sm btn-purple">删除</button>&nbsp;&nbsp;
											<button id="btn_add" style="float:right;margin-top:2px" class="btn btn-sm btn-success">新增</button>
										</div>

										<div class="widget-body">
											<div class="widget-main padding-8">
											<div class="form-group">
											    <table id="tableData" class="table table-striped table-bordered table-hover" style="font-size: 12px;"></table>
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
							<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 班组编号： </label>
							<div class="col-sm-9"><input id="new_workgroupId" placeholder="班组编号" class="col-sm-9" type="text"></div>
						</div>
					</fieldset><br/>
					<fieldset>
						<div class="form-group form-horizontal">
							<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 班组名称： </label>
							<div class="col-sm-9"><input id="new_groupName" placeholder="班组名称" class="col-sm-9" type="text"></div>
						</div>
					</fieldset><br/>
					<fieldset>
						<div class="form-group form-horizontal">
							<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 职责： </label>
							<div class="col-sm-9"><input id="new_responsibility" placeholder="职责" class="col-sm-9" type="text"></div>
						</div>
					</fieldset><br/>
					<fieldset>
						<div class="form-group form-horizontal">
							<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 备注： </label>
							<div class="col-sm-9"><input id="new_memo" placeholder="备注" class="col-sm-9" type="text"></div>
						</div>
					</fieldset>
	
					<div class="form-actions center">
					    <input type="hidden" id="new_parentId">
					    <input type="hidden" id="new_workshopId">
						<button id="btn_ok" type="button" class="btn btn-success" role="button"><span class="ui-button-text"><i class="ace-icon glyphicon glyphicon-ok"></i>&nbsp; 增加</span></button>
					    <button id="btn_cancel" type="button" class="btn" role="button"><span class="ui-button-text"><i class="ace-icon glyphicon glyphicon-remove"></i>&nbsp; 取消</span></button>
					</div>
				</form>
            </div>
			<div id="dialog-edit" class="hide" style="width:800px;height:600px">
				<form>
					<fieldset>
						<div class="form-group form-horizontal">
							<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 班组编号： </label>
							<div class="col-sm-9">
								<input type="hidden" id="editId" />
								<input id="edit_workgroupId" placeholder="班组编号" class="col-sm-9" type="text">
							</div>
						</div>
					</fieldset><br/>
					<fieldset>
						<div class="form-group form-horizontal">
							<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 班组名称： </label>
							<div class="col-sm-9"><input id="edit_groupName" placeholder="班组名称" class="col-sm-9" type="text"></div>
						</div>
					</fieldset><br/>
					<fieldset>
						<div class="form-group form-horizontal">
							<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 职责： </label>
							<div class="col-sm-9"><input id="edit_responsibility" placeholder="职责" class="col-sm-9" type="text"></div>
						</div>
					</fieldset><br/>
					<fieldset>
						<div class="form-group form-horizontal">
							<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 备注： </label>
							<div class="col-sm-9"><input id="edit_memo" placeholder="备注" class="col-sm-9" type="text"></div>
						</div>
					</fieldset>
	                <input type="hidden" id="edit_parentId">
					<input type="hidden" id="edit_workshopId">
				</form>
            </div>
			<!-- 脚 -->
			<%-- <jsp:include page="footer.jsp" flush="true"/> --%>
			<a href="#" id="btn-scroll-up" class="btn-scroll-up btn btn-sm btn-inverse"><i class="ace-icon fa fa-angle-double-up icon-only bigger-110"></i></a>
		</div><!-- /.main-container -->
	</div>
		<script src="../assets/js/fuelux/fuelux.tree.min.js"></script>
		<script src="../assets/js/jquery.dataTables.min.js"></script>
		<script src="../assets/js/jquery.dataTables.bootstrap.js"></script>
		<script src="../assets/js/dataTables.fixedColumns.min.js"></script>
		<script src="../js/setting/workgroup.js"></script>
		<script src="../assets/js/jquery-ui.min.js"></script>
		<script src="../assets/js/jquery.ui.touch-punch.min.js"></script>
		<script src="../assets/js/jquery.gritter.min.js"></script>
	</body>
</html>
