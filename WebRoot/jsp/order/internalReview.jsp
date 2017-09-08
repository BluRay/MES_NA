<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String rqip= request.getRemoteAddr();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path;
%>
<html lang="zh-CN">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta charset="utf-8" />
<title>订单评审</title>
<meta name="description" content="Common Buttons &amp; Icons" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
<link rel="stylesheet" href="<%=basePath%>/assets/css/fixedColumns.bootstrap.min.css" />
<link rel="stylesheet" href="<%=basePath%>/assets/css/fixedColumns.dataTables.min.css" />
<link rel="stylesheet" href="<%=basePath%>/assets/css/jquery-ui.min.css" />
<link rel="stylesheet" href="<%=basePath%>/assets/css/jquery.gritter.css" /> 
<style type="text/css" media="screen">
      .english{
          font-size:13px;
          font-family: "Times New Roman", Times, serif;
      }
      .Chinese{
	      margin:0px;
	      padding:0px;
	      font-family:"微软雅黑","黑体","仿宋";
	      font-size:13px;

	  }
</style> 
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
					<li class="active">订单评审</li>
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
				<div id="form" class="well form-search">
					<table>
						<tr>
							<td>订单编号：</td>
							<td><input type="text" style="height: 30px;"
								class="input-medium revise" placeholder="请输入订单编号..." value=""
								id="search_order_no" /></td>
							<td>评审状态：</td>
							
							<td><select id="search_review_status" class="input-medium revise">
								<option value=''>全部</option>
								<option value='0'>未评审</option>
								<option value='1'>评审中</option>
								<option value='2'>已评审</option>
								</select>
							</td>
							<td>生产年份：</td>
							<td>
								<input class="input-small"  style="height: 30px;" id="search_productive_year" onclick="WdatePicker({el:'search_productive_year',dateFmt:'yyyy'});" type="text">
							</td>
							<td>生产工厂：</td>
							<td><select name="" id="search_factory" class="input-small">
							</select>
							 	<script id="tmplBusTypeSelect" type="text/x-jsrander">
                                    <option value='{{:id}}'>{{:code}}</option>
                                </script>
							</td>
							<td><input type="button"
								class="btn btn-sm btn-primary btnQuery" id="btnQuery" value="查询"
								style="margin-left: 2px;"></input>
						</tr>
					</table>
				</div>

				<div class="row"  >
					<div class="col-xs-12"  style="width:100%">
						<table id="tableOrder" class="table table-striped table-bordered table-hover" style="font-size: 12px;" >
						</table>
					</div>
				</div>
				<div id="dialog-edit" class="hide">
					<table id="tableData" class="table table-striped table-bordered table-hover dataTable no-footer"
					            style="font-size: 13px;width:900px" role="grid" aria-describedby="tableData_info">
						 <tr role="row" class="odd">
				            <td class="sorting_disabled center" rowspan="1" colspan=7 style="width: 96px;font-size:18px;font-weight:bold;">十九事业部订单评审评估表</td>
						 </tr>
						 <tr role="row" class="odd">
				            <td class="sorting_disabled center" rowspan="1" style="width: 96px;font-weight:bold;">客户</td>
				            <td class="sorting_disabled center" rowspan="1" style="width: 96px;font-weight:bold;">车型</td>
				            <td class="sorting_disabled center" rowspan="1" style="width: 96px;font-weight:bold;">生产数量</td>
				            <td class="sorting_disabled center" rowspan="1" style="width: 96px;font-weight:bold;">生产工厂</td>
				            <td class="sorting_disabled center" rowspan="1" style="width: 96px;font-weight:bold;">订单类型</td>
				            <td class="sorting_disabled center" rowspan="1" style="width: 96px;font-weight:bold;">交付日期</td>
				            <td class="sorting_disabled center" rowspan="1" style="width: 96px;font-weight:bold;">产能/天</td>
						 </tr>
						 <tr role="row" class="odd">
						    <td id="customer" class="center Chinese"></td>
						    <td id="busType"  class="center english"></td>
						    <td id="productionQty" class="center english"></td>
						    <td id="factoryName" class="center Chinese"></td>
				            <td id="order_type" class="center Chinese"></td>
							<td id="delveryDate" class="center english"></td>
							<td id="capacity" class="center english"></td>
						</tr>
						 <tr role="row" class="odd">
						    <td class="sorting_disabled center" rowspan="2" style="width: 96px;font-weight:bold;">订单启动节点</td>
				            <td class="sorting_disabled center" rowspan="1" style="width: 96px;">部件上线</td>
							<td class="sorting_disabled center" rowspan="1" style="width: 96px;">焊装上线</td>
							<td class="sorting_disabled center" rowspan="1" style="width: 96px;">涂装上线</td>
							<td class="sorting_disabled center" rowspan="1" style="width: 96px;">底盘上线</td>
							<td class="sorting_disabled center" rowspan="1" style="width: 96px;">总装上线</td>
							<td class="sorting_disabled center" rowspan="1" style="width: 96px;">全部入库</td>
						</tr>
						<tr>
							<td id="partsonlineDate" class="center english"></td>
							<td id="weldingonlineDate" class="center english"></td>
							<td id="paintonlineDate" class="center english"></td>
							<td id="chassisonlineDate" class="center english"></td>
							<td id="assemblyonlineDate" class="center english"></td>
							<td id="warehousingDate" class="center english"></td>
						</tr>
					    <tr>
					        <td class="sorting_disabled center" rowspan="2" style="width: 96px;font-weight:bold;">资料需求节点</td>
						    <td class="sorting_disabled center" style="width: 96px;font-size:13px">&nbsp;数模输出时间</td>
							<td class="sorting_disabled center" style="width: 96px;">下料明细</td>
							<td class="sorting_disabled center english" style="width: 96px;">BOM</td>
							<td class="sorting_disabled center" style="width: 96px;font-size:13px">图纸输出时间</td>
							<td class="sorting_disabled center english" style="width: 96px;">SOP</td>
							<td class="sorting_disabled center english" style="width: 96px;">SIP</td>
						</tr>
						<tr role="row" class="odd">
						    <td id="modelexportDate" class="center english" ></td>
						    <td id="detaildemandNode" class="center english"></td>
						    <td id="bomdemandNode" class="center english"></td>
				            <td id="drawingexportDate" class="center english"></td>
							<td id="sopdemandNode" class="center english"></td>
							<td id="sipdemandNode" class="center english"></td>
						</tr>
						<tr>
						    <td class="sorting_disabled center" rowspan="4" style="width: 96px;font-weight:bold;">技术部</td>
						    <td class="sorting_disabled center" rowspan="4" style="width: 96px;">技术资料完善及可行性</td>
							<td class="sorting_disabled center" style="width: 96px;">配置表</td>
							<td class="sorting_disabled center" style="width: 96px;">型材清单</td>
							<td class="sorting_disabled center" style="width: 96px;">数模评审</td>
							<td class="sorting_disabled center" style="width: 96px;font-size:13px">图纸受控前评审</td>
							<td class="sorting_disabled center" style="width: 96px;">采购明细</td>
						</tr>
						<tr>
						    <td id="configTable" class="center Chinese"></td>
						    <td id="proximatematter" class="center Chinese"></td>
				            <td id="modeljudging" class="center english"></td>
							<td id="drawingearlierjudging" class="center english"></td>
							<td id="purchasedetail" class="center english"></td>
						</tr>
						<tr>
						    <td class="sorting_disabled center" style="width: 96px;">资料需求节点</td>
						    <td id="technicaldatanode" class="english"></td>
				            <td class="sorting_disabled center" style="width: 96px;">其他</td>
							<td colspan=2 id="mintechInfo" class="Chinese"></td>
						</tr>
						<tr>
						    <td class="sorting_disabled center" style="width: 96px;">签字</td>
						    <td id="technical_operator" class="Chinese"></td>
				            <td class="sorting_disabled center" style="width: 96px;">日期</td>
							<td colspan=2 id="technical_create_time" class="english"></td>
						</tr>
						<tr>
						    <td class="sorting_disabled center" rowspan="2" style="width: 96px;font-weight:bold;">工艺部</td>
						    <td class="sorting_disabled center" rowspan="2" style="width: 96px;">是否有新增工装、模具、工艺等</td>
							<td class="sorting_disabled center" style="width: 96px;">资料需求节点</td>
							<td id="technicsNode" class="english"></td>
							<td class="sorting_disabled center" style="width: 96px;">其他</td>
							<td colspan=2 id="technicsInfo" class="Chinese"></td>
						</tr>
						<tr>
						    <td class="sorting_disabled center" style="width: 96px;">签字</td>
						    <td id="technology_operator" class="Chinese"></td>
				            <td class="sorting_disabled center" style="width: 96px;">日期</td>
							<td colspan=2 id="technology_create_time"  class="english"></td>
						</tr>
						<tr>
						    <td class="sorting_disabled center" rowspan=2 style="width: 96px;font-weight:bold;">品质部</td>
						    <td class="sorting_disabled center" rowspan=2 style="width: 96px;">首车生产是否有指导文件</td>
							<td class="sorting_disabled center" style="width: 96px;">资料需求节点</td>
							<td id="qualityNode" class="english"></td>
							<td class="sorting_disabled center" style="width: 96px;">其他</td>
							<td colspan=2 id="qualityInfo" class="Chinese"></td>
						</tr>
						<tr>
						    <td class="sorting_disabled center" style="width: 96px;">签字</td>
						    <td id="quality_operator" class="Chinese"></td>
				            <td class="sorting_disabled center" style="width: 96px;">日期</td>
							<td colspan=2 id="quality_create_time"  class="english"></td>
						</tr>
						<tr>
						    <td class="sorting_disabled center" rowspan=2 style="width: 96px;font-weight:bold;">工厂内部</td>
						    <td class="sorting_disabled center" rowspan=2 style="width: 96px;">人员、场地、设备等</td>
							<td class="sorting_disabled center" style="width: 96px;">资料需求节点</td>
							<td id="factoryNode" class="english"></td>
							<td class="sorting_disabled center" style="width: 96px;">其他</td>
							<td colspan=2 id="factoryInfo" class="Chinese"></td>
						</tr>
						<tr>
						    <td class="sorting_disabled center" style="width: 96px;">签字</td>
						    <td id="factory_operator" class="Chinese"></td>
				            <td class="sorting_disabled center" style="width: 96px;">日期</td>
							<td colspan=2 id="factory_create_time" class="english"></td>
						</tr>
						<tr>
						    <td class="sorting_disabled center" rowspan=2 style="width: 96px;font-weight:bold;">综合计划部物控</td>
						    <td class="sorting_disabled center" rowspan=2 style="width: 96px;">物料风险</td>
							<td class="sorting_disabled center" style="width: 96px;">资料需求节点</td>
							<td id="materialcontrolNode" class="english"></td>
							<td class="sorting_disabled center" style="width: 96px;">其他</td>
							<td colspan=2 id="materialcontrolInfo" class="Chinese"></td>
						</tr>
						<tr>
						    <td class="sorting_disabled center" style="width: 96px;">签字</td>
						    <td id="planning_operator" class="Chinese"></td>
				            <td class="sorting_disabled center" style="width: 96px;">日期</td>
							<td colspan=2 id="planning_create_time" class="english"></td>
						</tr>
						
						<tr>
						    <td class="sorting_disabled center" rowspan=2 style="width: 96px;font-weight:bold;">综合计划部计划</td>
						    <td class="sorting_disabled center" rowspan=2 style="width: 96px;">计划风险</td>
							<td class="sorting_disabled center" style="width: 96px;">资料需求节点</td>
							<td id="plandepNode" class="english"></td>
							<td class="sorting_disabled center" style="width: 96px;">其他</td>
							<td colspan=2 id="plandepInfo" class="Chinese"></td>
						</tr>
						<tr>
						    <td class="sorting_disabled center" style="width: 96px;">签字</td>
						    <td id="plandep_operator" class="Chinese"></td>
				            <td class="sorting_disabled center" style="width: 96px;">日期</td>
							<td colspan=2 id="plandep_create_time" class="english"></td>
						</tr>
						<tr role="row" class="odd">
					    	<td class="sorting_disabled center" style="width: 96px;font-weight:bold;" rowspan=4>评审结果修正</td>
						    <td class="sorting_disabled center" style="width: 96px;" rowspan=2>订单启动节点</td>
				            <td class="sorting_disabled center" style="width: 96px;">部件上线</td>
							<td class="sorting_disabled center" style="width: 96px;">焊装上线</td>
							<td class="sorting_disabled center" style="width: 96px;">涂装上线</td>
							<td class="sorting_disabled center" style="width: 96px;">底盘上线</td>
							<td class="sorting_disabled center" style="width: 96px;">总装上线</td>
							
						</tr>
						<tr>
							<td id="revisionpartsonlineDate" class="center english"></td>
							<td id="revisionweldingonlineDate" class="center english"></td>
							<td id="revisionpaintonlineDate" class="center english"></td>
							<td id="revisionchassisonlineDate" class="center english"></td>
							<td id="revisionassemblyonlineDate" class="center english"></td>
							
						</tr>
					    <tr>
					        <td class="sorting_disabled center" style="width: 96px;" rowspan=2>修正资料需求节点</td>
							<td class="sorting_disabled center" style="width: 96px;">全部入库</td>
							<td class="sorting_disabled center" style="width: 96px;">下料明细</td>
							<td class="sorting_disabled center english" style="width: 96px;">BOM</td>
							<td class="sorting_disabled center english" style="width: 96px;">SOP</td>
							<td class="sorting_disabled center english" style="width: 96px;">SIP</td>
						</tr>
						<tr role="row" class="odd">
						    <td id="revisionwarehousingDate" class="center english"></td>
						    <td id="revisiondetailNode" class="center english"></td>
						    <td id="revisionbomNode" class="center english"></td>
							<td id="revisionsopNode" class="center english"></td>
							<td id="revisionsipNode" class="center english"></td>
						</tr>
					</table>
				</div>
            </div>
		</div>
	</div>	
		<!-- /.main-container -->
	</div>
	<script src="<%=basePath%>/js/datePicker/WdatePicker.js"></script>
	<script src="<%=basePath%>/assets/js/jquery-ui.min.js"></script>
	<script src="<%=basePath%>/assets/js/jquery.gritter.min.js"></script>
	<script src="<%=basePath%>/assets/js/jquery.dataTables.min.js"></script>
	<script src="<%=basePath%>/assets/js/jquery.dataTables.bootstrap.js"></script>
	<script src="<%=basePath%>/assets/js/dataTables.fixedColumns.min.js"></script>
	<script src="<%=basePath%>/assets/js/dataTables.rowGroup.js"></script>
	<script src="<%=basePath%>/assets/js/ace/elements.onpage-help.js"></script>
	<script src="<%=basePath%>/assets/js/ace/ace.onpage-help.js"></script>
	<script src="<%=basePath%>/assets/js/bootstrap3-typeahead.js"></script>
<%-- 	<script src="<%=basePath%>/js/bootstrap-table-export.js"></script> --%>
	<script src="<%=basePath%>/js/jsrender.min.js"></script>
	<script src="<%=basePath%>/js/common.js"></script>
	<script src="<%=basePath%>/js/tableExport.js"></script>
<%-- 	<script src="<%=basePath%>/js/jquery.base64.js"></script> --%>
<%-- 	<script src="<%=basePath%>/js/jspdf.js"></script> --%>
<%-- 	<script src="<%=basePath%>/js/Base64.js"></script> --%>
<%-- 	<script src="<%=basePath%>/js/sprintf.js"></script> --%>
<%-- 	<script src="<%=basePath%>/js/autotable.js"></script> --%>
	<script src="<%=basePath%>/js/order/internalReview.js"></script>
</body>

</html>
