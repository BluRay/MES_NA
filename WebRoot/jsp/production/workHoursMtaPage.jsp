<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html lang="zh-CN">
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta charset="utf-8" />
		<title>额外工时维护</title>
		<meta name="description" content="Common Buttons &amp; Icons" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
		<link rel="stylesheet" href="../assets/css/jquery-ui.min.css" />
		<link rel="stylesheet" href="../assets/css/jquery-ui.custom.min.css" />
		<link rel="stylesheet" href="../assets/css/jquery.gritter.css" />
		<link rel="stylesheet" href="../assets/css/fixedColumns.bootstrap.min.css" />
		<link rel="stylesheet" href="../assets/css/fixedColumns.dataTables.min.css" />
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
						<li><a href="#">生产执行</a></li>
						<li class="active">额外工时维护</li>
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
					<!-- /section:settings.box -->
					<div class="page-content-area">
					
					<div class="well">
						<table>
							<tr>
								<td>派工流水号：</td>
								<td><input id="tmp_order_no" placeholder="请输入派工流水号..." style="height: 30px;width:120px" type="text"></td>
								<td>&nbsp;申请时间：</td>
								<td><input id="start_date" placeholder="开始时间..." style="height: 30px;width:100px" type="text" onClick="WdatePicker({el:'start_date',dateFmt:'yyyy-MM-dd'});"> - <input id="end_date" placeholder="结束时间..." style="height: 30px;width:100px" type="text" onClick="WdatePicker({el:'end_date',dateFmt:'yyyy-MM-dd'});"></td>
								<td>&nbsp;状态：</td>
								<td>
									<select id="status" style="height: 30px;" class="input-small carType">
										<option value='all'>全部</option>
										<option value='0'>已维护</option>
										<option value='1'>已完成</option>
										<option value='2'>已驳回</option>
									</select>
								</td>
								<td>&nbsp;制作工厂：</td>
								<td><select id="q_factory" style="height: 30px;" class="input-small"></select></td>
								<td>&nbsp;制作车间：</td>
								<td><select id="q_workshop" style="height: 30px;" class="input-small"></select></td>
								<td>
									<input id="btnQuery" type="button" class="btn btn-sm btn-success" value="查询" style="margin-left: 2px;">
								</td>
								<td></td>
							</tr>
						</table>
					</div>
					
					<table id="tableData" class="table table-striped table-bordered table-hover" style="width:2500px;overflow-x:auto;font-size: 12px;">
					</table>
					
					</div>
			</div><!-- /.main-content -->
			
			<div id="dialog-add" class="hide" style="align:center;width:780px;height:500px">
				<table style="line-height:30px">
					<tr>
					<td width="140px" style="text-align:right">派工单号：</td>								
					<td id="orderNo"></td>
					</tr>
					<tr>
					<td width="140px" style="text-align:right">作业原因/内容：</td>								
					<td id="reason"></td>	
					</tr>
				</table>
				<table >
					<tr>
					<td width="60px" style="text-align:right">工厂：</td>
					<td width="160px"><input id="factory" disabled="disabled" style="height: 30px;width:150px" type="text">
					</td>
					<td width="80px" style="text-align:right">车间：</td>
					<td width="160px"><input id="workshop" disabled="disabled" style="height: 30px;width:150px" type="text">
					</td>
					<td></td>
					<td></td>
					</tr>
					<tr>
					<td width="60px" style="text-align:right">班组：</td>
					<td width="160px"><select id="group" class="input-medium"><option value=''>请选择</option></select>
					</td>
					<td width="80px" style="text-align:right">小班组：</td>
					<td width="160px"><select id="subgroup" class="input-medium"><option value=''>请选择</option></select>
					</td>
					<td width="80px" style="text-align:right">操作日期：</td>
					<td>
						<input type="text" id="mta_wdate" class="input-medium" placeholder="操作日期" onclick="WdatePicker({dateFmt:'yyyy-MM-dd',maxDate:new Date()})"/>
					</td>
					</tr>
				</table>
				
				<h5 class="section-head">额外工时<span style="float:right;margin: 10px 20px;color:green" class="read_hours"></span></h5>
				<div style="width:100%;height:300px;">
					<table id="table_workhour" style="margin-left:0px;margin-top:0px;width:100%;text-align:left;" class="exp-table table">
					<thead style="background-color: rgb(225, 234, 240)">
						<tr>
						<td style="width: 30px;"><i id="addWorkhour" class="fa fa-plus addWorkhour" style="cursor: pointer;color: blue;"></i></td>
						<td >工号</td>
						<td >姓名</td>
						<td >岗位</td>
						<td >额外工时</td>
						<td >小班组</td>
						<td >班组</td>
						<td >车间</td>
						<td >工厂</td>
						</tr>
					</thead>
					<tbody class="exp-table" id="tb_workhour">
					</tbody>
				</table>
				</div>
			
			</div>
			
			
			<div id="dialog-edit" class="hide" style="align:center;width:820px;height:500px">
				<table style="line-height:30px" >
					<tr>
					<td width="140px" style="text-align:right">派工单号：</td>								
					<td id="edit_orderNo"></td>
					</tr>
					<tr>
					<td width="140px" style="text-align:right">作业原因/内容：</td>								
					<td id="edit_reason"></td>	
					</tr>
				</table>
				<table class="form-search">
					<tr>
					<td width="60px" style="text-align:right">工号：</td>
					<td width="160px">
						<input type="text" class="input-medium" id="edit_cardNumber"/>
					</td>
					<td width="80px" style="text-align:right">操作日期：</td>
					<td width="160px">
						<input type="text" class="input-medium" id="edit_workDate" onclick="WdatePicker({dateFmt:'yyyy-MM-dd'})"/>
					</td>
					<td><input type="button" class="btn btn-primary"
						id="btnSwhQuery" value="查询" style="margin-left: 2px;height:30px;line-height:1px"></input>
						</td>
					<td></td>
					</tr>								
				</table>
				<h5 class="section-head">额外工时<span style="float:right;margin: 10px 20px;color:green" class="read_hours"></span></h5>
				<div style="width:100%;height:300px;">
					<table style="margin-left:0px;width: 100%;"class="exp-table table" id="workhour_tb">
						<thead style="background-color: rgb(225, 234, 240)">
							<tr>
							<td ><input type="checkbox" id="checkall"></td>
							<td >工号</td>
							<td >姓名</td>
							<td >岗位</td>
							<td >额外工时</td>
							<td >小班组</td>
							<td >班组</td>
							<td >车间</td>
							<td >工厂</td>
							<td>状态</td>
							<td >操作日期</td>
							</tr>
						</thead>
						<tbody class="exp-table" id="workhour_list">
						</tbody>
					</table>
				
				</div>
			</div>
			
			<div id="dialog-show" class="hide" >
				<div class="tabbable">
					<ul class="nav nav-tabs" id="myTab">
						<li id="div1" class="active">
							<a data-toggle="tab" onclick="" href="#baseinfo">基本信息</a>
						</li>
						<li id="div2">
							<a data-toggle="tab" onclick="" href="#productiondetailmtn">产量明细维护</a>
						</li>
						<li id="div3">
							<a data-toggle="tab" onclick="" href="#workhourdetail">工时明细</a>
						</li>
						<li id="div4">
							<a data-toggle="tab" onclick="" href="#workhourallot">工时分配</a>
						</li>
					</ul>
				</div>
				<div class="tab-content" id="new_accordion">
                    <div class="tab-pane" role="tabpanel" style="height:400px" id="baseinfo">
                       <table>
							<tr style="height:30px;background-color:#f5f5f5"><th colspan=6><h5 style="line-height:30px;">&nbsp;&nbsp;工单内容</h5></th></tr>
							<tr style="height:30px">
								<td align="right" style="width:120px">派工发起人：</td>
								<td style="width:120px" id="show_order_launcher">
								</td>
								<td align="right" style="width:120px">派工接收工厂：</td>
								<td style="width:120px" id="show_factory"></td>
							    <td align="right" style="width:120px">派工接收车间：</td>
								<td style="width:120px" id="show_workshop"></td>
							</tr>
							<tr style="height:30px">
								<td align="right" style="width:120px">发起部门主管：</td>
								<td style="width:120px" id="show_head_launch_unit">
								</td>
								<td align="right" style="width:120px">验收人：</td>
								<td style="width:120px" id="show_acceptor"></td>
							    <td align="right">&nbsp;作业原因/内容：</td>
								<td colspan=5 id="show_reason_content">
								</td>
							</tr>
							<tr style="height:30px">
								<td align="right" style="width:120px">总数量：</td>
								<td style="width:120px" id="show_total_qty">
								</td>
								<td align="right" style="width:120px">派工类型：</td>
								<td style="width:120px" id="show_order_type"></td>
							    <td align="right" style="width:120px">责任部门：</td>
								<td style="width:120px" id="show_duty_unit"></td>
							</tr>
							<tr style="height:30px"><th colspan=6 style="background-color:#f5f5f5"><h5 style="line-height:30px">&nbsp;&nbsp;工单评估内容</h5></th></tr>
		
							<tr style="height:30px">
							    <td align="right" style="width:120px">所需人力：</td>
							    <td id="show_labors" ></td>
								<td align="right" style="width:120px">单工时：</td>
								<td  id="show_single_hour"></td>
							    <td></td><td></td>
							</tr>
							<tr style="height:30px">
							    <td align="right" style="width:120px">工时评估人：</td><td  id="show_assesor" ></td>
								<td align="right" style="width:120px">工时评估负责人：</td><td id="show_assess_verifier" ></td>
							    <td></td><td></td>
							</tr>
							<tr style="height:30px"><th colspan=6 style="background-color:#f5f5f5"><h5 style="line-height:30px">&nbsp;&nbsp;签批信息</h5></th></tr>
							<tr style="height:30px">
								<td align="right" style="width:120px">成本是否可转移：</td>
								<td style="width:120px" id="show_is_cost_transfer">
								</td>
								<td align="right" style="width:120px">成本科签字：</td>
								<td style="width:120px" id="show_cost_unit_signer"></td>
							    <td align="right" style="width:120px">工单号：</td>
								<td style="width:120px" id="show_sap_order"></td>
							</tr>
							<tr style="height:30px">
							    <td align="right" style="width:120px">派工流水号：</td><td id="show_tmp_order_no" ></td>
								<td align="right" style="width:120px">验收人签字：</td><td id="show_acceptor_sign"></td>
							    <td></td><td></td>
							</tr>
							</table>
                    </div>
                    <div class="tab-pane" role="tabpanel" style="height:400px" id="productiondetailmtn">
                        <div class="row" >
							<div class="col-xs-12"  id="productiondetailmtnResultDiv" style="padding-right:0px;">
								<table id="productiondetailmtnResult" class="table table-striped table-bordered table-hover" style="table-layout:fixed;font-size: 12px; width:745px;overflow:auto;">
								</table>
							</div>
						</div>
                    </div>
                    <div class="tab-pane" role="tabpanel" style="height:400px" id="workhourdetail">
                        <div class="row" >
							<div class="col-xs-12"  id="workhourdetailResultDiv" style="padding-right:0px;">
								<table id="workhourdetailResult" class="table table-striped table-bordered table-hover" style="table-layout:fixed;font-size: 12px; width:745px;overflow:auto;">
								</table>
							</div>
						</div>
                    </div>
                    <div class="tab-pane" role="tabpanel" style="height:400px" id="workhourallot">
                        <div class="row" >
							<div class="col-xs-12"  id="workhourallotResultDiv" style="padding-right:0px;">
								<table id="workhourallotResult" class="table table-striped table-bordered table-hover" style="table-layout:fixed;font-size: 12px; width:745px;overflow:auto;">
								</table>
							</div>
						</div>
                    </div>
				</div>
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
	<script type="text/javascript" src="../js/production/workHoursMtaPage.js"></script>
</html>
