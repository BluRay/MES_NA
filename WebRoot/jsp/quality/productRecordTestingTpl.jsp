<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<html lang="zh-CN">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta charset="utf-8" />
<title>Testing Template</title>
<meta name="description" content="Common Buttons &amp; Icons" />
<meta name="viewport"
	content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />	
<link rel="stylesheet"
	href="../assets/css/fixedColumns.bootstrap.min.css" />
<link rel="stylesheet"
	href="../assets/css/fixedColumns.dataTables.min.css" />
<link rel="stylesheet" href="../assets/css/jquery-ui.min.css" />
<link rel="stylesheet" href="../assets/css/jquery.gritter.css" />
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
							href="/MES/index">Index</a></li>
						<li><a href="#">Quality</a></li>
						<li><a href="#">Testing Template</a></li>
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
								<td>Bus type：</td>
								<td>
									<select name="" id="search_bus_type" class="input-medium carType" style="height: 30px;width:100px;" ></select>
								</td>
 								<td>Project No.：</td>
								<td><input style="height: 30px;width:130px;" type="text" class="input-medium revise" placeholder="" id="search_project_no" /></td>
								<td>Testing Type：</td>
								<td>
									<select id="search_testing_type_value" class="input-medium" style="height: 30px;width:120px;" >
									</select>
								</td>						
								<td>
								    <input type="button" class="btn btn-sm btn-primary" id="btnQuery" value="Search" style="margin-left: 2px;"></input>						
									<input type="button" class="btn btn-sm btn-success" id="btnAdd" value="Add" style="margin-left: 2px;"></input>
								</td>
							</tr>
						</table>
					</form>
						
					<div class="row">
						<div class="col-xs-12" id="scroll_div">
							<table id="tableResult" class="table table-striped table-bordered table-hover" style="font-size: 12px;" >
							</table>	
						</div>
					</div>
				</div>

			<div id="dialog-config" class="hide">
				<div id="create_form" class="form-horizontal">
					<div class="form-group">
						<label class="col-sm-2 control-label">*&nbsp;Project No.：</label>
						<div class="col-sm-2">
							<input id="add_project_no" type="text" class="input-medium" style="height: 30px;width:80%;" ></input>
						</div>						
						<label class="col-sm-2 control-label no-padding-right " for="" >*&nbsp;Testing Type：</label>
						<div class="col-sm-2">
							<select id="testing_type_value" class="input-medium" style="height: 30px;width:80%" ></select>
						</div>					
					</div>
					<div class="form-group">
						<label class="col-sm-2 control-label no-padding-right" for="" >*&nbsp;Initiated By：</label>
						<div class="col-sm-2">
							<input id="initiated" type="text" class="input-medium" style="height: 30px;width:80%;" ></input>
						</div>						
						<label class="col-sm-2 control-label no-padding-right " for="" >*&nbsp;Approved By：</label>
						<div class="col-sm-2">
							<input id="approved" type="text" class="input-medium" style="height: 30px;width:80%;" ></input>
						</div>				
					</div>
					<div class="form-group">
					    <label class="col-sm-2 control-label no-padding-right" for="" >&nbsp;Remark：</label>
						<div class="col-sm-6">
							<textarea class="input-xlarge" style="width: 100%" id="remarks" rows="1"></textarea>
						</div>
					</div>
					<div class="form-group" id="importDiv">					
						<label class="col-sm-2 control-label no-padding-right" for="">*&nbsp;Template：</label>
						<form id="uploadForm" action="" enctype="multipart/form-data" method="post">
							<div class="col-sm-4" style="margin-left:-10px;">
								<input id="file" style="margin-left:0px;padding:0px 0px;font-size: 12px" class="btn btn-info btn-small" name="file" type="file"> 				
							</div>
							<div class="col-sm-4">
									<input id="btn_upload" style="padding:0px 0px;font-size: 12px;height:30px;width:60px" class="btn btn-primary" value="Import" onclick="javascript:return upload(this.form, this.form.file.value)" type="button"> 
									<a href="../docs/testingTemplate.xlsx">Download Template</a>
								</div>							
							</form>
						</div>									
					</div>
					<div class="form-group">					
						<div class="col-sm-12">			
							<table class="table table-striped table-bordered table-hover" style="width: 831px;font-size:12px;" id="tplDetailTable">
							</table>
						</div>
					</div>
			     </div>
	      </div>
	   </div>
		<!-- /.main-container -->
	</div>
	<script src="../assets/js/jquery.dataTables.min.js"></script>
	<script src="../assets/js/jquery-ui.min.js"></script>
	<script src="../assets/js/jquery.dataTables.bootstrap.js"></script>
	<script src="../assets/js/jquery.gritter.min.js"></script>
	<script src="../assets/js/dataTables.rowGroup.js"></script>
	<script src="../assets/js/bootstrap3-typeahead.js"></script>
	<script src="../js/jquery.form.js"></script>	
	<script src="../js/common.js"></script>
	<script src="../js/alertMessage.js"></script>
	<script src="../assets/js/ace/elements.fileinput.js"></script>
	<script src="../js/quality/productRecordTestingTpl.js"></script>
</body>

</html>
