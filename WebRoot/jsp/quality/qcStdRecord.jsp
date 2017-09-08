<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html lang="zh-CN">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta charset="utf-8" />
<title>BMS 系统设置  品质标准更新记录</title>
<meta name="description" content="Common Buttons &amp; Icons" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />

<link rel="stylesheet" href="../assets/css/fixedColumns.bootstrap.min.css" />
<link rel="stylesheet" href="../assets/css/fixedColumns.dataTables.min.css" />
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
				<div class="breadcrumbs ace-save-state  breadcrumbs-fixed" id="breadcrumbs">
					<ul class="breadcrumb">
						<li><i class="ace-icon fa fa-home home-icon"></i><a href="/BMS/index">首页</a></li>
						<li><a href="#">制程品质</a></li>
						<li class="active">品质标准更新记录</li>
					</ul>
					<!-- /.breadcrumb -->

					<div class="nav-search" id="nav-search">
						<form class="form-search">
							<span class="input-icon"> <input type="text" placeholder="Search ..." class="nav-search-input" id="nav-search-input" autocomplete="off" /><i class="ace-icon fa fa-search nav-search-icon"></i>
							</span>
						</form>
					</div>
					<!-- /.nav-search -->
				</div>

				<div class="page-content">
					<div id="form" class="well form-search">
						<table>
							<tr>
								<td>记录编号：</td>
								<td><input type="text" style="height: 30px;" class="input-medium revise" placeholder="记录编号..." value="" id="search_recordNo" /></td>
								<td>&nbsp;标准文件编号/名称：</td>
								<td><input type="text" style="height: 30px;" class="input-medium revise" placeholder="标准文件标号/名称..." value="" id="search_stdFileName"/></td>
								<td>编制日期：</td>
								<td><input id="start_date" placeholder="开始时间..." style="width:125px" type="text" onClick="WdatePicker({el:'start_date',dateFmt:'yyyy-MM-dd'});"> - <input id="end_date" placeholder="结束时间..." style="width:125px" type="text" onClick="WdatePicker({el:'end_date',dateFmt:'yyyy-MM-dd'});"></td>

								<td><input type="button" class="btn btn-sm btn-primary btnQuery" id="btnQuery" value="查询" style="margin-left: 10px;"></input>
									<button id='btnAdd' class="btn btn-sm btn-success">新增</button>
							</tr>
						</table>
					</div>

					<div class="row">
						<div class="col-xs-12">
							<table id="tableData" class="table table-striped table-bordered table-hover" style="font-size: 12px;">
								
							</table>
						</div>
					</div>
                </div>
				
                <div id="dialog-add" class="hide">
					<form id="addForm" class="form-horizontal" method="post" enctype="multipart/form-data" action="addRecord">
						<div class="form-group">
							<label class="col-sm-3 control-label no-padding-right" for="add">*&nbsp;记录编号</label>
							<div class="col-sm-9">
								<input type="text" class="input-medium" id="recordNo" name="recordNo" style="width:360px;height:30px;"/>
							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-3 control-label no-padding-right" for="add">*&nbsp;标准文件编号/名称</label>
							<div class="col-sm-9">
								<input type="text" class="input-medium" id="stdFileName" name="standardfile" style="width:360px;height:30px;"/>
							</div>
						</div>
						
						<div class="form-group">
							<label class="col-sm-3 control-label no-padding-right" for="add">*&nbsp;更新内容摘要</label>
							<div class="col-sm-9">
								<textarea class="input-xlarge" id="usynopsis" style="width:360px;" rows="2" name="usynopsis"></textarea>
							</div>
						</div>
						
						<div class="form-group">
							<label class="col-sm-3 control-label no-padding-right" for="add">&nbsp;更替前附件</label>
							<div class="col-sm-9">
								<input class="maintain" type="file" name="bfile" id="bfile" style="width:210px"/>					
								<!-- <input type="submit" value="上传" class="btn btn-primary maintain"/> -->
							</div>
						</div>
						
						<div class="form-group">
							<label class="col-sm-3 control-label no-padding-right" for="add">*&nbsp;更替后附件</label>
							<div class="col-sm-9">
								<input class="maintain" type="file" name="afile" id="afile" style="width:210px"/>					
								<!-- <input type="submit" value="上传" class="btn btn-primary maintain"/> -->
							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-3 control-label no-padding-right" for="add">&nbsp;备注</label>
							<div class="col-sm-9">
								<textarea class="input-xlarge" id="memo" style="width:360px;" rows="1" name="memo"></textarea>
							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-3 control-label no-padding-right" for="">&nbsp;通知邮箱地址</label>
							<div class="col-sm-9">
								<textarea class="input-xlarge" style="width:360px;" id="mailAddrs" rows="3" placeholder="多个邮箱以;隔开" name="mailAddrs"></textarea>
							</div>
					    </div>
					</form>

				</div>
				
				<div id="dialog-edit" class="hide">
					<form id="editForm" class="form-horizontal">
					    <input type="hidden" id="urlPath" value="<%=request.getContextPath()%>/">
						<div class="form-group">
							<label class="col-sm-3 control-label no-padding-right" for="add">*&nbsp;记录编号</label>
							<div class="col-sm-9">
								<input type="text" class="input-medium" style="width:360px;height:30px;" id="recordNo_show" readonly="readonly"/>
							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-3 control-label no-padding-right" for="add">*&nbsp;标准文件编号/名称</label>
							<div class="col-sm-9">
                                <input type="text" class="input-medium" style="width:360px;height:30px;" id="stdFileName_show" readonly="readonly"/>
                            </div>
						</div>
						<div class="form-group">
							<label class="col-sm-3 control-label no-padding-right" for="add">*&nbsp;更新内容摘要</label>
							<div class="col-sm-9">
								<textarea class="input-xlarge" style="width:360px;" id="usynopsis_show" rows="2" name="usynopsis" readonly="readonly"></textarea>
							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-3 control-label no-padding-right">&nbsp;更替前附件</label>&nbsp;&nbsp;
                            <label class="control-label" style="padding-left:2px;align:left"><a href="" class="text-info" id="bfile_path" target="_blank">查看</a></label>
                        </div>
						<div class="form-group">
							<label class="col-sm-3 control-label no-padding-right">*&nbsp;更替后附件</label>&nbsp;&nbsp;
							<label class="control-label" style="padding-left:2px;align:left"><a href="" class="text-info" id="afile_path" target="_blank">查看</a></label>
						</div>
						<div class="form-group">
							<label class="col-sm-3 control-label no-padding-right" for="add">&nbsp;备注</label>
							<div class="col-sm-9">
								<textarea class="input-xlarge" style="width:360px;" id="memo_show" rows="1" name="memo" readonly="readonly"></textarea>
							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-3 control-label no-padding-right" for="">&nbsp;通知邮箱地址</label>
							<div class="col-sm-9">
								<textarea class="input-xlarge" style="width:360px;" id="mailAddrs_show" rows="3" name="mailAddrs" readonly="readonly"></textarea>
							</div>
					    </div>
					</form>
				</div>
				
			</div>
		</div>
		<!-- /.main-container -->
	</div>
	<script src="../assets/js/jquery-ui.min.js"></script>
	<script src="../assets/js/jquery.gritter.min.js"></script>
	<script src="../assets/js/jquery.dataTables.min.js"></script>
	<script src="../assets/js/jquery.dataTables.bootstrap.js"></script>
	<script src="../assets/js/dataTables.fixedColumns.min.js"></script>
	<script src="../assets/js/ace/elements.onpage-help.js"></script>
	<script src="../assets/js/ace/ace.onpage-help.js"></script>
	<script src="../assets/js/bootstrap3-typeahead.js"></script>
	<script src="../js/jsrender.min.js"></script>
	<script src="../js/common.js"></script>
	<script src="../js/datePicker/WdatePicker.js"></script>
	<script src="../js/quality/qcStdRecord.js"></script>
	<script src="../js/jquery.form.js"></script>
</body>

</html>
