<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<html lang="en">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta charset="utf-8" />
<title>MES Settings Scan Rule</title>
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
						href="<%=request.getContextPath()%>/index">Index</a></li>
					<li><a href="#">Settings</a></li>
					<li class="active">Scan Rule</li>
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
							<td>Plant：</td>
							<td>
							<select name="" id="search_factory" class="input-small"><option value=''>All</option></select>
							</td>
							<td>Order Type：</td>
							<td>
							<select name="" id="search_orderType" class="input-small"><option value=''>All</option></select>
							<script id="tmplOrderTypeSelect" type="text/x-jsrander">
                                   <option value='{{:name}}'>{{:name}}</option>
                            </script>
							</td>
							<td>
								<input type="button" class="btn btn-sm btn-primary btnQuery" id="btnQuery" value="Search" style="margin-left: 2px;"></input>
								<input type="button" class="btn btn-sm btn-success " id="btnAdd" value="Add" style="margin-left: 2px;"></input>
							</td>
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
			
			<script id="tmplWorkshopSelect" type="text/x-jsrander">
                       <option value='{{:id}}'>{{:name}}</option>
            </script>
            
            <script id="tmplProcessSelect" type="text/x-jsrander">
                       <option value='{{:station_name}}' monitory_point_flag='{{:monitory_point_flag}}' key_station_flag='{{:key_station_flag}}' plan_node='{{:plan_node}}'>{{:station_name}}</option>
            </script>
			
			<div id="dialog-processConfig-new" class="hide">
				<form id="" class="form-horizontal">
					<div class="form-group">
							<label class="col-sm-1 control-label no-padding-right no-padding-right" for="">*Plant</label>
							<div class="col-sm-2">
							<select name="" id="factory" class="input-medium"> <option value=''>Please Choose</option></select>
							
							</div>
							<label class="col-sm-2 control-label no-padding-right no-padding-right" for="" style="width:100px;">*Order Type</label>
							<div class="col-sm-2">
							<select name="" id="order_type" class="input-medium"> 
							</select>
							</div>	
							<div class="col-sm-3" style='margin-top: 5px;'>
								<input type="checkbox" id="import_new">&nbsp;Import standard procedure
							</div>		
					</div>
					<div class="form-group"  style="margin-top:20px;">
						<!-- <h5 class="header smaller lighter blue" style="padding-left: 12px; ">工序配置：<input type="checkbox" style="position: absolute; right: 22px;margin-top: 10px;">导入标准工序</input></h5> -->
						<table class="table table-bordered table-hover"  id="processConfigTable" style="text-align:center">
							<thead>	
								<tr>
									<td width='50px'>No.</td>
									<td>Workshop</td>
									<td >Station</td>
									<td >Monitory Point</td>
									<td>Key Station</td>
									<td>Plan Node</td>
									<td style="text-align: center;"></td>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td width='50px'>1</td>
									<td>
											<select class="input-medium workshop" style="width:100%;border:0px;padding:0px;text-align:center">
												<option value=''>Please Choose</option>
											</select>
									</td>
									<td >
											<select class="input-medium process" style="width:100%;border:0px;padding:0px;text-align:center">
												<option value=''>Please Choose</option>
											</select>
									</td>
									<td ></td>
									<td></td>
									<td></td>
									<td style="text-align: left;width:80px">
										<i  class="fa fa-arrow-up" style="cursor: pointer;color:blue"></i>
										<i class="fa fa-arrow-down" style="cursor: pointer;color:blue"></i>
										<i class="fa fa-plus" style="cursor: pointer;color:green"></i>
										<i class="fa fa-times" style="cursor: pointer;color:red;visibility:hidden;position:absolute" ></i>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</form>
			</div>
			
			<div id="dialog-processConfig-edit" class="hide">
				<form id="" class="form-horizontal">
					<div class="form-group">
							<label class="col-sm-1 control-label no-padding-right no-padding-right" for="">*Plant</label>
							<div class="col-sm-2">
							<select name="" id="factory_edit" class="input-medium"> <option value=''>Please Choose</option></select>
							
							</div>
							<label class="col-sm-2 control-label no-padding-right no-padding-right" for="" style="width:100px;">*Order Type</label>
							<div class="col-sm-2">
							<select name="" id="order_type_edit" class="input-medium"> 
							</select>
							</div>	
							<div class="col-sm-3" style='margin-top: 5px;'>
								<input type="checkbox"  id="import_edit">&nbsp;Import standard procedure
							</div>		
					</div>
					<div class="form-group"  style="margin-top:20px;">
						<!-- <h5 class="header smaller lighter blue" style="padding-left: 12px; ">工序配置：<input type="checkbox" style="position: absolute; right: 22px;margin-top: 10px;">导入标准工序</input></h5> -->
						<table class="table table-bordered table-hover"  id="processConfigTable_edit" style="text-align:center">
							<thead>	
								<tr>
									<td width='50px'>No.</td>
									<td>Workshop</td>
									<td >Station</td>
									<td >Monitory Point</td>
									<td>Key Station</td>
									<td>Plan Node</td>
									<td style="text-align: center;"></td>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td width='50px'>1</td>
									<td>
											<select class="input-medium workshop" style="width:100%;border:0px;padding:0px;text-align:center">
												<option value=''>Please Choose</option>
											</select>
									</td>
									<td >
											<select class="input-medium process" style="width:100%;border:0px;padding:0px;text-align:center">
												<option value=''>Please Choose</option>
											</select>
									</td>
									<td ></td>
									<td></td>
									<td></td>
									<td style="text-align: left;width:80px">
										<i  class="fa fa-arrow-up" style="cursor: pointer;color:blue"></i>
										<i class="fa fa-arrow-down" style="cursor: pointer;color:blue"></i>
										<i class="fa fa-plus" style="cursor: pointer;color:green"></i>
										<i class="fa fa-times" style="cursor: pointer;color:red;visibility:hidden;position:absolute" ></i>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</form>
			</div>
			
			<div id="dialog-processConfig-view" class="hide">
				<form id="" class="form-horizontal">
					<div class="form-group">
							<label class="col-sm-1 control-label no-padding-right no-padding-right" for="">*Plant：</label>
							<div class="col-sm-2" style="padding-top: 5px;">
							<span id="factory_view"></span>						
							</div>
							<label class="col-sm-2 control-label no-padding-right no-padding-right" for="" style="width:100px;">*Order Type：</label>
							<div class="col-sm-2" style="padding-top: 5px;">
							<span id="order_type_view"></span>
							</div>		
					</div>
					<div class="form-group"  style="margin-top:20px;">
						<!-- <h5 class="header smaller lighter blue" style="padding-left: 12px; ">工序配置：<input type="checkbox" style="position: absolute; right: 22px;margin-top: 10px;">导入标准工序</input></h5> -->
						<table class="table table-bordered table-hover"  id="processConfigTable_view" style="text-align:center">
							<thead>	
								<tr>
									<td width='50px'>No.</td>
									<td>Workshop</td>
									<td >Station</td>
									<td >Monitory Point</td>
									<td>Key Station</td>
									<td>Plan Node</td>
								</tr>
							</thead>
							<tbody>
							</tbody>
						</table>
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
	<script src="../assets/js/bootstrap3-typeahead.js"></script>
	<script src="../js/jsrender.min.js"></script>
	<script src="../js/common.js"></script>
	<script src="../js/setting/stationConfig.js"></script>
</body>

</html>
