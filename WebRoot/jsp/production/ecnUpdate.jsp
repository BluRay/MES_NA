<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<html lang="zh-CN">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta charset="utf-8" />
<title>ECN Update</title>
<meta name="description" content="Common Buttons &amp; Icons" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />	
<link rel="stylesheet" href="../assets/css/fixedColumns.bootstrap.min.css" />
<link rel="stylesheet" href="../assets/css/fixedColumns.dataTables.min.css" />
<link rel="stylesheet" href="../css/bootstrap-multiselect.min.css" />
<link rel="stylesheet" href="../assets/css/jquery-ui.min.css" />
<link rel="stylesheet" href="../assets/css/buttons.dataTables.css" /> 
<style>
	.multiselect {
	height:30px;
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
							href="/MES/index">Index</a></li>
						<li><a href="#">Manufacturing</a></li>
						<li><a href="#">ECN Update</a></li>
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
								<td>ECN No.：</td>
								<td>
									<input style="height: 30px;width:100px;" type="text" class="input-medium revise" id="search_ecn_no" />
								</td>
								<td>Status：</td>
								<td>
									<select id="search_status" class="input-medium" style="height: 30px;width:90px;" >
										<option value='All'>All</option>
										<option value='1'>Created</option>
										<option value='2'>In Process</option>
										<option value='3'>Completed</option>
									</select>
								</td>
								<td>Date：</td>
								<td>
									<input id="search_date_start" class="input-medium" style="width:90px" onclick="WdatePicker({language:'en_us',dateFmt:'yyyy-MM-dd'})" type="text">	
									-
									<input id="search_date_end" class="input-medium" style="width:90px" onclick="WdatePicker({language:'en_us',dateFmt:'yyyy-MM-dd'})" type="text">						
								</td>							
								<td><input type="button" class="btn btn-sm btn-primary" id="btnQuery" value="Search" style="margin-left: 2px;"></input>
								<input type="button" class="btn btn-sm btn-info" id="btnAdd" value="Add" style="margin-left: 2px;"></input>						
								</td>
							</tr>

						</table>
					</form>
						
					<div class="row">
					<div class="col-xs-12">
						<table id="tableResult"
							class="table table-striped table-bordered table-hover" style="font-size: 12px; width:1800px;overflow-x:auto ">
						</table>	
					</div>
					</div>
				</div>

			<div id="dialog-config_new" class="hide">
				<div  class="form-horizontal">
					<form id='create_form'>
					<table style='border:0px'>
					<tbody>
					<tr style="height:40px">
						<td style="width:130px" align="right">*&nbsp;Project :&nbsp;</td>
						<td style="width:250px"><input style="width:250px;height;30px" id="new_project" name="project" class="input-medium" type="text"></td>
						<td style="width:130px" align="right">*&nbsp;Bus NO. :&nbsp;</td>
						<td style="width:250px">
							<select id="new_bus_no" class="multiselect" multiple="" >
							</select>
						</td>
					</tr>
					<tr style="height:40px">
						<td style="width:130px" align="right">*&nbsp;ECN NO. :&nbsp;</td>
						<td style="width:250px"><input style="width:250px;height;30px" id="new_ecn_no" class="input-medium" type="text"></td>
						<td style="width:130px" align="right">&nbsp;Pictures :&nbsp;</td>
						<td style="width:250px">
							<input name="ecn_pictures" id="new_ecn_pictures" multiple="multiple" style="height: 30px; width: 180px" type="file">
						</td>
					</tr>
					<tr style="height:40px">
						<td style="width:130px" align="right">Design People :&nbsp;</td>
						<td style="width:250px">
							<input style="width:250px;height;30px" id="new_design_people" class="input-medium" type="text">
						</td>
					</tr>
					</tbody>
					</table>
					</form>
					
					<div class="">
						<!-- <label class="col-sm-3 control-label no-padding-right no-padding-right" for="" >*&nbsp;Items：</label> -->
						<div class="controls">
							<div style="width: 100%">
							<ul class="nav nav-tabs" id="new_tab" role="tablist">
								<li class="active"><a href="#new_task1" data-toggle="tab" style="font-size: 14px; color: #333">Item-1</a></li>
								<li><i id="add_tech_detail" class="glyphicon glyphicon-plus bigger-110" style="cursor: pointer; padding-top: 10px;padding-left:5px;color: blue;"></i></li>							
							</ul>
							</div>
							<div class="tab-content" id="new_task_list">
								<div class="tab-pane active" role="tabpanel" id="new_task1">
								<div class="panel panel-default" style='border:0px;box-shadow:0 0px 0px'>
								<div id="collapseTask1" class="panel-collapse collapse in" role="tabpanel">
									<div class="panel-body" style='padding: 5px;'>
									<table style="width: 100%;border-collapse:separate; border-spacing:0px 5px;">
										<tbody>
											<tr>
											<td style="width: 130px;"><label class="control-label" for="">*&nbsp;Items:</label> </td>
											<td><input style="width: 99%;" class="input-small item_name" placeholder="" type='text'></input> </td>
											<td style="width: 130px;"><label class="control-label" for="">*&nbsp;Work Station:</label> </td>
											<td><select class="input-medium work_station"></select></td>
											</tr>
											<tr>
											<td style="width: 130px;"> <label class="control-label" for="">*&nbsp;Problem Detail:</label> </td>
											<td colspan=3><textarea style="width: 88%;" class="input-small problem_detail" placeholder="" rows="1"></textarea></td>
											</tr>
											<tr>
											<td style="width: 130px;"><label class="control-label">*&nbsp;Scope of Change:</label></td>
											<td><select class="input-medium scope_change">
												<option>A</option>
												<option>B</option>
												<option>C1</option>
												<option>C2</option>
												<option>D</option>
												<option>E</option>
												<option>F</option>
												</select>
											</td>
											
											</tr>
											<tr>
											<td style="width: 130px;"></td>
											<td colspan=3>
												<p style='margin: 0 0 2px;'>A: Only pictures or engineering technical papers shall be changed.</p>
												<p style='margin: 0 0 2px;'>B: Natural change. Continue to use present material until present material run out then use new material.</p>
												<p style='margin: 0 0 2px;'>C1: Incorporate change immediately. New materials is used immediately and present material should be scrapped.</p>
												<p style='margin: 0 0 2px;'>C2: Incorporate change immediately. New materials is used immediately and present material should be reworked.</p>
												<p style='margin: 0 0 2px;'>D: Incorporate change immediately. Finished products are allowed to leave factory and be put into use.</p>
												<p style='margin: 0 0 2px;'>E: Incorporate change immediately. Finished products are not allowed to leave the factory or be put into use.
												But products already been shipped out don't need to be recalled.</p>
												<p style='margin: 0 0 4px;'>F: Incorporate change immediately. Finished products are not allowed to leave the factory.
												Products already been shipped out need to be recalled.</p>
											</td>
											</tr>	
											<tr>
											<td style="width: 130px;"><label class="control-label" style="padding-top: 0px;">*&nbsp;Material List:</label></td>
											<td colspan=3>
												<div>
												<form name="uploadForm" action="" enctype="multipart/form-data" method="post">
								     			<div class="col-sm-4" style="width:220px;">
												<input id="" style="margin-left: -10px;padding:0px 0px;font-size: 12px" class="btn btn-info btn-small material_upload" name="file" accept=".xls" type="file"> 				
												</div>
												<div class="col-sm-6">
												<input style="padding:0px 0px;font-size: 12px;height:35px" class="btn btn-primary btn_upload" value="Import" onclick="javascript:return upload(this.form, this.form.file.value)" type="button"> 
												<a href="../docs/ECNMaterialList.xls.xls">Download the pilot template</a>
												
												</div>	
												</form>		
												</div>									
											</td>
											</tr>
											<tr>
											<td style="width: 130px;"></td>
											<td colspan=3>
												<table class="material_table table table-striped table-bordered" style="font-size: 12px;">
												</table>
											</td>
											</tr>									
										</tbody>
									</table>
									
									</div>									
								</div>	
								</div>
								</div>
							</div>												
							</div>
						</div>
					</div>
					
					
			</div>
			
			
			<div id="dialog-config_edit" class="hide">
				<div  class="form-horizontal">
					<form id='edit_form'>
					<table style='border:0px'>
					<tbody>
					<tr style="height:40px">
						<td style="width:130px" align="right">*&nbsp;Project :&nbsp;</td>
						<td style="width:250px"><input style="width:250px;height;30px" id="edit_project" name="project" class="input-medium" type="text"></td>
						<td style="width:130px" align="right">*&nbsp;Bus NO. :&nbsp;</td>
						<td style="width:180px">
							<select id="edit_bus_no" class="multiselect" multiple="" >
							</select>
						</td>
					</tr>
					<tr style="height:40px">
						<td style="width:130px" align="right">*&nbsp;ECN NO. :&nbsp;</td>
						<td style="width:250px"><input style="width:250px;height;30px" id="edit_ecn_no" class="input-medium" type="text"></td>
						<td style="width:130px" align="right">&nbsp;Pictures :&nbsp;</td>
						<td style="width:180px;nowrap:'nowrap'">
							<input name="ecn_pictures" id="edit_ecn_pictures" multiple="multiple" style="height: 30px; width: 180px" type="file" title='查看'>
						</td>
					</tr>
					<tr style="height:40px">
						<td style="width:130px" align="right">Design People :&nbsp;</td>
						<td style="width:250px">
							<input style="width:250px;height;30px" id="edit_design_people" class="input-medium" type="text">
						</td>
					</tr>
					</tbody>
					</table>
					</form>
					
					<div class="">
						<!-- <label class="col-sm-3 control-label no-padding-right no-padding-right" for="" >*&nbsp;Items：</label> -->
						<div class="controls">
							<div style="width: 100%">
							<ul class="nav nav-tabs" id="edit_tab" role="tablist">								
								<li><i id="edit_add_tech_detail" class="glyphicon glyphicon-plus bigger-110" style="cursor: pointer; padding-top: 10px;padding-left:5px;color: blue;"></i></li>							
							</ul>
							</div>
							<div class="tab-content" id="edit_task_list">
								
							</div>												
							</div>
						</div>
					</div>
					
					
			</div>
			
			
			<div id="dialog-config_display" class="hide">
				<div  class="form-horizontal">
					<form id='display_form'>
					<table style='border:0px'>
					<tbody>
					<tr style="height:40px">
						<td style="width:130px" align="right">*&nbsp;Project :&nbsp;</td>
						<td style="width:250px"><input style="width:250px;height;30px" id="display_project" name="project" class="input-medium" type="text"></td>
						<td style="width:130px" align="right">*&nbsp;Bus NO. :&nbsp;</td>
						<td style="width:180px">
							<select id="display_bus_no" class="multiselect" multiple="" >
							</select>
						</td>
					</tr>
					<tr style="height:40px">
						<td style="width:130px" align="right">*&nbsp;ECN NO. :&nbsp;</td>
						<td style="width:250px"><input style="width:250px;height;30px" id="display_ecn_no" class="input-medium" type="text"></td>
						<td style="width:130px" align="right">&nbsp;Pictures :&nbsp;</td>
						<td style="width:180px;nowrap:'nowrap'">
							<span id='display_ecn_pictures'></span>
						</td>
					</tr>
					<tr style="height:40px">
						<td style="width:130px" align="right">Design People :&nbsp;</td>
						<td style="width:250px">
							<input style="width:250px;height;30px" id="display_design_people" class="input-medium" type="text">
						</td>
					</tr>
					</tbody>
					</table>
					</form>
					
					<div class="">
						<!-- <label class="col-sm-3 control-label no-padding-right no-padding-right" for="" >*&nbsp;Items：</label> -->
						<div class="controls">
							<div style="width: 100%">
							<ul class="nav nav-tabs" id="display_tab" role="tablist">								
								
							</ul>
							</div>
							<div class="tab-content" id="display_task_list">
								
							</div>												
							</div>
						</div>
					</div>
					
					
			</div>
			
		</div>
		
			</div>
			
			<div class="tab-pane hide" role="tabpanel" id="task_temp">
								<div class="panel panel-default" style='border:0px;box-shadow:0 0px 0px'>
								<div id="collapseTask1" class="panel-collapse collapse in" role="tabpanel">
									<div class="panel-body" style='padding: 5px;'>
									<table style="width: 100%;border-collapse:separate; border-spacing:0px 5px;">
										<tbody>
											<tr>
											<td style="width: 130px;"><label class="control-label" for="">*&nbsp;Items:</label> </td>
											<td><input style="width: 99%;" class="input-small item_name" placeholder="" type='text'></input> </td>
											<td style="width: 130px;"><label class="control-label" for="">*&nbsp;Work Station:</label> </td>
											<td><select class="input-medium work_station"></select></td>
											</tr>
											<tr>
											<td style="width: 130px;"> <label class="control-label" for="">*&nbsp;Problem Detail:</label> </td>
											<td colspan=3><textarea style="width: 88%;" class="input-small problem_detail" placeholder="" rows="1"></textarea></td>
											</tr>
											<tr>
											<td style="width: 130px;"><label class="control-label">*&nbsp;Scope of Change:</label></td>
											<td><select class="input-medium scope_change">
												<option>A</option>
												<option>B</option>
												<option>C1</option>
												<option>C2</option>
												<option>D</option>
												<option>E</option>
												<option>F</option>
												</select>
											</td>
											
											</tr>
											<tr>
											<td style="width: 130px;"></td>
											<td colspan=3>
												<p style='margin: 0 0 2px;'>A: Only pictures or engineering technical papers shall be changed.</p>
												<p style='margin: 0 0 2px;'>B: Natural change. Continue to use present material until present material run out then use new material.</p>
												<p style='margin: 0 0 2px;'>C1: Incorporate change immediately. New materials is used immediately and present material should be scrapped.</p>
												<p style='margin: 0 0 2px;'>C2: Incorporate change immediately. New materials is used immediately and present material should be reworked.</p>
												<p style='margin: 0 0 2px;'>D: Incorporate change immediately. Finished products are allowed to leave factory and be put into use.</p>
												<p style='margin: 0 0 2px;'>E: Incorporate change immediately. Finished products are not allowed to leave the factory or be put into use.
												But products already been shipped out don't need to be recalled.</p>
												<p style='margin: 0 0 4px;'>F: Incorporate change immediately. Finished products are not allowed to leave the factory.
												Products already been shipped out need to be recalled.</p>
											</td>
											</tr>	
											<tr>
											<td style="width: 130px;"><label class="control-label">*&nbsp;Material List:</label></td>
											<td colspan=3 class="td_material_upload">
												<div>
												<form id="uploadForm" action="" enctype="multipart/form-data" method="post">
								     			<div class="col-sm-4" style="width:220px;">
												<input id="file" style="margin-left: -10px;padding:0px 0px;font-size: 12px" class="btn btn-info btn-small" name="file" accept=".xls" type="file"> 				
												</div>
												<div class="col-sm-6">
												<input style="padding:0px 0px;font-size: 12px;height:35px" class="btn btn-primary btn_upload" value="Import" onclick="javascript:return upload(this.form, this.form.file.value)" type="button"> 
												<a href="../docs/ECNMaterialList.xls.xls">Download the pilot template</a>
												</div>	
												</form>		
												</div>									
											</td>
											</tr>
											<tr>
											<td style="width: 130px;"></td>
											<td colspan=3>
												<table class="material_table table table-striped table-bordered">
												</table>
											</td>
											</tr>									
										</tbody>
									</table>
									
									</div>									
								</div>	
								</div>
								</div>
			<!-- /.main-container -->
		</div>
	
	<script src="../js/datePicker/WdatePicker.js"></script>
	<script src="../assets/js/jquery.dataTables.min.js"></script>
	<script src="../assets/js/jquery-ui.min.js"></script>
	<script src="../assets/js/jquery.dataTables.bootstrap.js"></script>
	<script src="../js/bootstrap-multiselect.min.js"></script>
	<script src="../assets/js/dataTables.fixedColumns.min.js"></script>
	<script src="../assets/js/dataTables.rowGroup.js"></script>
	<script src="../assets/js/bootstrap3-typeahead.js"></script>
	<script src="../js/jquery.form.js"></script>
	<script src="../assets/js/jszip.min.js"></script>
	<script src="../assets/js/dataTables.buttons.js"></script>
	<script src="../assets/js/buttons.colVis.js"></script>
	<script src="../assets/js/buttons.html5.js"></script>	
	<script src="../js/common.js"></script>
	<script src="../js/production/ecnUpdate.js"></script>
</body>

</html>
