<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<html lang="en">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta charset="utf-8" />
<title>BMS 标题</title>
<meta name="description" content="Common Buttons &amp; Icons" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
<link rel="stylesheet" href="../assets/css/fixedColumns.bootstrap.min.css" />
<link rel="stylesheet" href="../assets/css/fixedColumns.dataTables.min.css" />
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
						href="<%=request.getContextPath()%>/index">首页</a></li>
					<li><a href="#">系统设置</a></li>
					<li class="active">标准工序</li>
				</ul>
				<!-- /.breadcrumb -->

				<div class="nav-search" id="nav-search">
					<form class="form-search">
						<span class="input-icon"> <input type="text"
							placeholder="Search ..." class="nav-search-input"
							id="nav-search-input" autocomplete="off" /><i
							class="ace-icon fa fa-search nav-search-icon"></i>
						</span>
					</form>
				</div>
				<!-- /.nav-search -->
			</div>

			<div class="page-content">
				<div id="form" class="well form-search">
					<table>
						<tr>
							<td>工厂：</td>
							<td>
							<select name="" id="search_factory" class="input-small"><option value=''>全部</option></select>
							</td>
							<td>车间：</td>
							<td>
							<select name="" id="search_workshop" class="input-small"><option value=''>全部</option></select>
							</td>
							<td>线别：</td>
							<td>
							<select name="" id="search_line" class="input-small"><option value=''>全部</option></select>
							</td>
							<td style='padding-left:10px;'><input id="input_monitoryPointFlag" type="checkbox"> <span>生产监控点 </span></td>
							<td style='padding-left:10px;'><input id="input_keyProcessFlag" type="checkbox"> <span>关键工序</span></td>
							<td style='padding-left:10px;'><input id="input_planNodeFlag" type="checkbox"><span> 计划节点</span></td>
							<td>
								<input type="button" class="btn btn-sm btn-primary btnQuery" id="btnQuery" value="查询" style="margin-left: 2px;"></input>
								<input type="button" class="btn btn-sm btn-success " id="btnAdd" value="新增" style="margin-left: 2px;"></input>
								<input type="button" class="btn btn-sm btn-danger" id="btnDelete" value="删除" style="margin-left: 2px;"></input></td>
						</tr>
					</table>
				</div>

				<div class="row"  >
					<div class="col-xs-12"  style="width:100%">
						<table id="tableResult" 
							class="table table-striped table-bordered table-hover"
							style="font-size: 12px; overflow-x:auto" >
						</table>
					</div>
				</div>


			</div>
			
			<div id="dialog-process" class="hide">
				<form id="" class="form-horizontal">
					<div class="form-group">
							<label class="col-sm-2 control-label no-padding-right no-padding-right" for="newOrderName">*工厂</label>
							<div class="col-sm-4">
							<select name="" id="factory" class="input-medium"> <option value=''>请选择</option></select>
							</div>
							<label class="col-sm-2 control-label no-padding-right no-padding-right" for="newOrderCode">*车间</label>
							<div class="col-sm-4">
							<select name="" id="workshop" class="input-medium"> 
								<option value=''>请选择</option>
							</select>
							</div>			
					</div>

					<div class="form-group">
							<label class="col-sm-2 control-label no-padding-right no-padding-right" for="newOrderCode">*线别</label>
							<div class="col-sm-4">
							<select name="" id="line" class="input-medium"><option value=''>请选择</option></select>
							</div>
							<label class="col-sm-2 control-label no-padding-right" for="">计划节点</label>
							<div class="col-sm-4">
							<select name="" id="plan_node" class="input-medium"></select>
							</div>				
					</div>
					
					<div class="form-group">
							<label class="col-sm-2 control-label no-padding-right" for="">*工序编号</label>
							<div class="col-sm-4">
							<input type="text" class="input-medium" placeholder="工序编号..." id="process_code" />
							</div>
							<label class="col-sm-2 control-label no-padding-right" for="new_order_qty">*工序名称</label>
							<div class="col-sm-4">
							<input type="text" class="input-medium" placeholder="工序名称..." id="process_name" />
							</div>					
					</div>
					
					<div class="form-group">
							<label class="col-sm-2 control-label no-padding-right" for="monitory_point_flag">生产监控点</label>
							<div class="col-sm-4">
							<input type="checkbox" id="monitory_point_flag" style="margin-top: 8px;" />
							</div>
							<label class="col-sm-2 control-label no-padding-right" for="monitory_point_flag">关键工序</label>
							<div class="col-sm-4">
							<input type="checkbox"  id="key_process_flag"  style="margin-top: 8px;" />
							</div>				
					</div>
					
					<div class="form-group">
						<label class="col-sm-2 control-label no-padding-right" for="">备注</label>
						<div class="col-sm-10">
							<textarea class="input-xlarge" style="width: 95%"
								id="memo" rows="2"></textarea>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>	
		<!-- /.main-container -->
	</div>
	<script src="../assets/js/jquery-ui.min.js"></script>
	<script src="../assets/js/jquery.dataTables.min.js"></script>
	<script src="../assets/js/jquery.dataTables.bootstrap.js"></script>
	<script src="../js/common.js"></script>
	<script src="../js/setting/process.js"></script>
</body>

</html>
