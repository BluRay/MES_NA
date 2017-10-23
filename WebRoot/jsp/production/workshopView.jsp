<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html lang="en">
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta charset="utf-8" />
		<title>MES</title>
		<meta name="description" content="Common Buttons &amp; Icons" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
	<style>	
		.myselect {
			border: 0px none;
			-moz-appearance:none;
			-webkit-appearance:none;
			font-size: 100%;
			margin-bottom: 3px;
			color: #555;
			background-color:#f5f5f5;
			width: 80px;
			padding: 0px;
			height:27px;
			cursor: pointer;
			margin-left: -8px;
			}
			
		#v_welding{
			height: 86px;
			width: 322px;
			/* border: 2px solid blue;  */
			position: absolute;
			top: 45px;
			left: 16px;
		}		
		#v_prePaint{
			height: 56px;
			width: 134px;
			border: 2px solid blue;
			position: absolute;
			top: 45px;
			left: 344px;
		}
		.w_text{
			font-size:16px;
			font-weight:bold;
			position: absolute;
		}
	</style>
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
			<div class="breadcrumbs breadcrumbs-fixed" id="breadcrumbs">
					<ul class="breadcrumb">
						<li><i class="ace-icon fa fa-home home-icon"></i><a href="<%=request.getContextPath()%>/index">Index</a></li>
						<li class="active">
						<select name="" id="search_factory" class="myselect">
						</select>
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
					<!-- 设置小部件 -->
					<%-- <jsp:include page="settings.jsp" flush="true"/> --%>
					<!-- /section:settings.box -->
					<div class="page-content-area ">
			<div class="row">
				<div class="col-xs-12 col-sm-7 widget-container-col ui-sortable">
					<div class="widget-box ui-sortable-handle">
								<div class="widget-header">
									<h5 class="widget-title">Workshop View:</h5>									
								</div>

								<div class="widget-body" style="height:270px">
								<!-- <div  class="widget-main" style="height:270px;overflow:hidden;background-image:url('/MES/images/workshopView.png');
								background-repeat:no-repeat; background-size:100% 100%;-moz-background-size:100% 100%;">
								</div>
								<div id="v_welding">
									<span id="welding_text" class="w_text" style="margin-top: 30px;margin-left: 130px;">Welding</span>									
								</div>
								<div id="v_prePaint">
									<span id="prePaint_text" class="w_text" style="margin-top: 25px;margin-left: 230px;">Pre-Paint</span>									
								</div>	 -->	
								<canvas id="canvas_wv" width=650 height=270  style="border: solid 0px;"> 
					
								</canvas> 						
								</div>
						</div>
				</div>
				
				<div class="col-xs-12 col-sm-5 widget-container-col ui-sortable" >
					<div class="widget-box ui-sortable-handle" >
								<div class="widget-header">
									<h5 class="widget-title">Detail:</h5>									
								</div>

								<div class="widget-body" id="chart2" style="height:270px">
									<div id="myCarousel" class="carousel slide" style="height:100%">
									<div class="carousel-inner">
									<div class="item active" style="line-height:23px;">
										<div class="form-group">
											<label class="col-sm-3 control-label " style="text-align:right;padding-right:20px"><b>Station：</b></label>
											<label class="col-sm-9 control-label no-padding-left" >Line Ⅰ_A3 Interior trim</label>
										</div>
										<div class="form-group">
											<label class="col-sm-3 control-label " style="text-align:right;padding-right:20px"><b>Status：</b></label>
											<label class="col-sm-9 control-label no-padding-left" >Abnormal , Lack of Material : 38Min</label>
										</div>
										<div class="form-group">
											<label class="col-sm-3 control-label " style="text-align:right;padding-right:20px"><b>Bus No.：</b></label>
											<label class="col-sm-9 control-label no-padding-left" >ABQ F-2</label>
										</div>
										<div class="form-group">
											<label class="col-sm-3 control-label " style="text-align:right;padding-right:20px"><b>VIN：</b></label>
											<label class="col-sm-9 control-label no-padding-left" >LC06S24K3H5498521</label>
										</div>
										<div class="form-group">
											<label class="col-sm-3 control-label " style="text-align:right;padding-right:20px"><b>Project：</b></label>
											<label class="col-sm-9 control-label no-padding-left" >K7M-UCSF</label>
										</div>
										<div class="form-group">
											<label class="col-sm-3 control-label " style="text-align:right;padding-right:20px"><b>Punch List：</b></label>
											<label class="col-sm-9 control-label no-padding-left" >2 in Open & 7 in Closed</label>
										</div>
										<div class="form-group">
											<label class="col-sm-3 control-label " style="text-align:right;padding-right:20px"><b>ECN：</b></label>
											<label class="col-sm-9 control-label no-padding-left" >BYD-US-K8-SBMTD -ECN-00001</label>
										</div>
										<div class="form-group">
											<label class="col-sm-12" style="text-align:center;bottom: -10px;">1/3</label>
										</div>	
									</div>
									<div class="item" style="line-height:23px;">
										<div class="form-group">
											<label class="col-sm-3 control-label " style="text-align:right;padding-right:20px"><b>Station：</b></label>
											<label class="col-sm-9 control-label no-padding-left" >Line Ⅰ_A3 Interior trim</label>
										</div>
										<div class="form-group">
											<label class="col-sm-3 control-label " style="text-align:right;padding-right:20px"><b>Status：</b></label>
											<label class="col-sm-9 control-label no-padding-left" >Abnormal , Lack of Material : 38Min</label>
										</div>
										<div class="form-group">
											<label class="col-sm-3 control-label " style="text-align:right;padding-right:20px"><b>Bus No.：</b></label>
											<label class="col-sm-9 control-label no-padding-left" >ABQ F-2</label>
										</div>
										<div class="form-group">
											<label class="col-sm-3 control-label " style="text-align:right;padding-right:20px"><b>VIN：</b></label>
											<label class="col-sm-9 control-label no-padding-left" >LC06S24K3H5498521</label>
										</div>
										<div class="form-group">
											<label class="col-sm-3 control-label " style="text-align:right;padding-right:20px"><b>Project：</b></label>
											<label class="col-sm-9 control-label no-padding-left" >K7M-UCSF</label>
										</div>
										<div class="form-group">
											<label class="col-sm-3 control-label " style="text-align:right;padding-right:20px"><b>Punch List：</b></label>
											<label class="col-sm-9 control-label no-padding-left" >2 in Open & 7 in Closed</label>
										</div>
										<div class="form-group">
											<label class="col-sm-3 control-label " style="text-align:right;padding-right:20px"><b>ECN：</b></label>
											<label class="col-sm-9 control-label no-padding-left" >BYD-US-K8-SBMTD -ECN-00001</label>
										</div>
										<div class="form-group">
											<label class="col-sm-12" style="text-align:center;bottom: -10px;">2/3</label>
										</div>	
									</div>
									<div class="item" style="line-height:23px;">
										<div class="form-group">
											<label class="col-sm-3 control-label " style="text-align:right;padding-right:20px"><b>Station：</b></label>
											<label class="col-sm-9 control-label no-padding-left" >Line Ⅰ_A3 Interior trim</label>
										</div>
										<div class="form-group">
											<label class="col-sm-3 control-label " style="text-align:right;padding-right:20px"><b>Status：</b></label>
											<label class="col-sm-9 control-label no-padding-left" >Abnormal , Lack of Material : 38Min</label>
										</div>
										<div class="form-group">
											<label class="col-sm-3 control-label " style="text-align:right;padding-right:20px"><b>Bus No.：</b></label>
											<label class="col-sm-9 control-label no-padding-left" >ABQ F-2</label>
										</div>
										<div class="form-group">
											<label class="col-sm-3 control-label " style="text-align:right;padding-right:20px"><b>VIN：</b></label>
											<label class="col-sm-9 control-label no-padding-left" >LC06S24K3H5498521</label>
										</div>
										<div class="form-group">
											<label class="col-sm-3 control-label " style="text-align:right;padding-right:20px"><b>Project：</b></label>
											<label class="col-sm-9 control-label no-padding-left" >K7M-UCSF</label>
										</div>
										<div class="form-group">
											<label class="col-sm-3 control-label " style="text-align:right;padding-right:20px"><b>Punch List：</b></label>
											<label class="col-sm-9 control-label no-padding-left" >2  in Open & 7  in Closed</label>
										</div>
										<div class="form-group">
											<label class="col-sm-3 control-label " style="text-align:right;padding-right:20px"><b>ECN：</b></label>
											<label class="col-sm-9 control-label no-padding-left" >BYD-US-K8-SBMTD -ECN-00001</label>
										</div>
										<div class="form-group">
											<label class="col-sm-12" style="text-align:center;bottom: -10px;">3/3</label>
										</div>	
									</div>
									</div>						
									<a class="carousel-control left" href="#myCarousel" data-slide="prev">&lsaquo;</a>
									<a class="carousel-control right" href="#myCarousel" data-slide="next">&rsaquo;</a>
									</div>
								</div>
						</div> 
						
						<div class="item hidden" style="line-height:23px;" id="bus_item_temp">
							<div class="form-group">
								<label class="col-sm-3 control-label " style="text-align:right;padding-right:20px"><b>Station：</b></label>
								<label class="col-sm-9 control-label no-padding-left station" >Line Ⅰ_A3 Interior trim</label>
							</div>
							<div class="form-group">
								<label class="col-sm-3 control-label " style="text-align:right;padding-right:20px"><b>Status：</b></label>
								<label class="col-sm-9 control-label no-padding-left status" >Abnormal , Lack of Material : 38Min</label>
							</div>
							<div class="form-group">
								<label class="col-sm-3 control-label " style="text-align:right;padding-right:20px"><b>Bus No.：</b></label>
								<label class="col-sm-9 control-label no-padding-left bus_no" >ABQ F-2</label>
							</div>
							<div class="form-group">
								<label class="col-sm-3 control-label " style="text-align:right;padding-right:20px"><b>VIN：</b></label>
								<label class="col-sm-9 control-label no-padding-left vin" >LC06S24K3H5498521</label>
							</div>
							<div class="form-group">
								<label class="col-sm-3 control-label " style="text-align:right;padding-right:20px"><b>Project：</b></label>
								<label class="col-sm-9 control-label no-padding-left project" >K7M-UCSF</label>
							</div>
							<div class="form-group">
								<label class="col-sm-3 control-label " style="text-align:right;padding-right:20px"><b>Punch List：</b></label>
								<label class="col-sm-9 control-label no-padding-left punch_list" >2 in Open & 7 in Closed</label>
							</div>
							<div class="form-group">
								<label class="col-sm-3 control-label " style="text-align:right;padding-right:20px"><b>ECN：</b></label>
								<label class="col-sm-9 control-label no-padding-left ecn" >BYD-US-K8-SBMTD -ECN-00001</label>
							</div>
							<div class="form-group">
								<label class="col-sm-12 pagesec" style="text-align:center;bottom: -10px;">3/3</label>
							</div>	
						</div>											
				</div>
			
			</div>

			<div class="row">
				<div class="col-xs-12 col-sm-12 widget-container-col ui-sortable">
					<div class="widget-box ui-sortable-handle">
								<div class="widget-header">
									<h5 class="widget-title" id="stations" >Welding:</h5>									
								</div>
								<div class="widget-body" >							
								<canvas id="canvas_stations" width=1115 height=190  style="border: solid 0px;"> 
					
								</canvas> 						
								</div>
						</div>
				</div>
			</div>
			<!-- 脚 -->
			<%-- <jsp:include page="footer.jsp" flush="true"/> --%>
			<a href="#" id="btn-scroll-up" class="btn-scroll-up btn btn-sm btn-inverse"><i class="ace-icon fa fa-angle-double-up icon-only bigger-110"></i></a>
		</div><!-- /.main-container -->
	</div>
	<script src="../assets/js/jquery-ui.custom.min.js"></script>
	<script src="../assets/js/jquery.easypiechart.min.js"></script>
	<script src="../js/highcharts.js"></script>
	<script src="../js/common.js"></script>
	<script src="../js/production/workshopView.js"></script>
	
	</body>
</html>
