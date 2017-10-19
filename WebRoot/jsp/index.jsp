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
	</style>
	</head>
	<body class="no-skin" style="font-family: 'Microsoft YaHei';">
		<!-- 头 -->
		<jsp:include page="top.jsp" flush="true"/>
		<!-- 身 -->
		<div class="main-container" id="main-container">
			<!-- 左边菜单 -->
			<jsp:include page="left.jsp" flush="true"/>
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
								<div class="col-xs-12 col-sm-5 widget-container-col ui-sortable" >
										<!-- #section:custom/widget-box -->
										<div class="widget-box ui-sortable-handle">
											<div class="widget-header">
												<h5 class="widget-title">Production status：</h5>

												<!-- #section:custom/widget-box.toolbar -->
												<div class="widget-toolbar">
													<!-- <div class="widget-menu">
														<a href="#" data-action="settings" data-toggle="dropdown">
															<i class="ace-icon fa fa-bars"></i>
														</a>
														<ul class="dropdown-menu dropdown-menu-right dropdown-light-blue dropdown-caret dropdown-closer">
															<li>
																<a data-toggle="tab" href="#dropdown1">Option#1</a>
															</li>

															<li>
																<a data-toggle="tab" href="#dropdown2">Option#2</a>
															</li>
														</ul>
													</div> -->
													<a href="#">
														<i class="ace-icon fa fa-desktop" title="Monitor"></i>
	                        						</a>
													<a href="#" data-action="fullscreen" class="orange2">
														<i class="ace-icon fa fa-expand"></i>
													</a>

													<a href="#" data-action="reload" onclick="reload('1');">
														<i class="ace-icon fa fa-refresh"></i>
													</a>

													<!-- <a href="#" data-action="collapse">
														<i class="ace-icon fa fa-chevron-up"></i>
													</a> -->
												</div>

												<!-- /section:custom/widget-box.toolbar -->
											</div>

											<div class="widget-body">
												<div class="widget-main" style="height:230px">
													<div class="row">
															<div class="col-xs-6" >
																<div class="col-xs-6 center" style="line-height:20px;height:75px;top:10px;">
																	<p style="color:green;font-size:24px;" id="welding_plan_done"></p>
																	<p style="font-size:15px;">Welding Online</p>
																</div>
																<div class="col-xs-6 center">
																	<div id='welding_percent' class="easy-pie-chart percentage" data-percent="0" data-color="#D15B47">
																	<span class="percent" >0</span>%
																	</div>
																</div>	
															</div>											
															<div class="col-xs-6 ">
																<div class="col-xs-6 center" style="line-height:20px;height:75px;top:10px;">
																	<p style="color:green;font-size:24px;" id="painting_plan_done"></p>
																	<p style="font-size:15px;">Painting Online</p>
																</div>
																<div class="col-xs-6 center">
																	<div id='painting_percent'  class="easy-pie-chart percentage" data-percent="0" data-color="#D15B47">
																	<span class="percent">0</span>%
																</div>
																</div>														
															</div>												
													</div>
													<hr>
													<div class="row">
															<div class="col-xs-6 " >
																<div class="col-xs-6 center" style="line-height:20px;height:75px;top:10px;top:10px;">
																	<p style="color:green;font-size:24px;" id="chassis_plan_done"></p>
																	<p style="font-size:15px;">Chassis Online</p>
																</div>
																<div class="col-xs-6 center">
																	<div id="chassis_percent" class="easy-pie-chart percentage" data-percent="0" data-color="#D15B47">
																	<span class="percent">0</span>%
																	</div>
																</div>	
															</div>											
															<div class="col-xs-6 ">
																<div class="col-xs-6 center" style="line-height:20px;height:75px;top:10px;">
																	<p style="color:green;font-size:24px;" id="assembly_plan_done"></p>
																	<p style="font-size:15px;">Assembly Offline</p>
																</div>
																<div class="col-xs-6 center">
																	<div id="assembly_percent" class="easy-pie-chart percentage" data-percent="0" data-color="#D15B47">
																	<span class="percent">0</span>%
																</div>
																</div>														
															</div>												
													</div>
										</div>
									</div>
						</div>	
					</div>
					
					<div class="col-xs-12 col-sm-7 widget-container-col ui-sortable" >
								<div class="widget-box ui-sortable-handle">
									<div class="widget-header">
										<h5 class="widget-title">Project quantity(Year)：</h5>

										<!-- #section:custom/widget-box.toolbar -->
										<div class="widget-toolbar">
											<a href="#" data-action="fullscreen" class="orange2" >
												<i class="ace-icon fa fa-expand"></i>
											</a>

											<a href="#" data-action="reload" onclick="reload('2');">
												<i class="ace-icon fa fa-refresh"></i>
											</a>

										</div>
									</div>

									<div class="widget-body" id="chart1">
										<div class="widget-main" id="container" style="height:230px">												
										</div>
									</div>
								</div>
					</div>
									
			</div>
			
			<div class="row">
				<div class="col-xs-12 col-sm-5 widget-container-col ui-sortable">
					<div class="widget-box ui-sortable-handle">
								<div class="widget-header">
									<h5 class="widget-title">In production：</h5>
									<div class="widget-toolbar">
										<a href="#" data-action="fullscreen" class="orange2">
											<i class="ace-icon fa fa-expand"></i>
										</a>
										<a href="#" data-action="reload" onclick="reload('3');">
											<i class="ace-icon fa fa-refresh"></i>
										</a>
									</div>
								</div>

								<div class="widget-body"  >
								<div  class="widget-main" style="height:230px;overflow:hidden">
									<div style="overflow:hidden" id="factory_act_order">									
									</div>
								</div>									
								</div>
						</div>
				</div>
				
				<div class="col-xs-12 col-sm-7 widget-container-col ui-sortable" >
					<div class="widget-box ui-sortable-handle" >
								<div class="widget-header">
									<h5 class="widget-title">yield：</h5>
									<div class="widget-toolbar">
										<a href="#" data-action="fullscreen" class="orange2" >
											<i class="ace-icon fa fa-expand"></i>
										</a>
										<a href="#" data-action="reload" onclick="reload('4');">
											<i class="ace-icon fa fa-refresh"></i>
										</a>
									</div>
								</div>

								<div class="widget-body" id="chart2">
									<div class="widget-main" id="container2" style="height:230px">												
									</div>
								</div>
						</div> 
						<!-- <div id="myCarousel" class="carousel slide">
						轮播（Carousel）指标
						<ol class="carousel-indicators">
						<li data-target="#myCarousel" data-slide-to="0" class="active"></li>
						<li data-target="#myCarousel" data-slide-to="1"></li>
						<li data-target="#myCarousel" data-slide-to="2"></li>
						</ol>
						轮播（Carousel）项目
						<div class="carousel-inner">
						<div class="item active" style="height:250px">
						<img src="/MES/images/home-1.png"  style="width:100%;height:100%"   alt="First slide">
						<div class="carousel-caption">1/3</div>
						</div>
						<div class="item" style="height:250px">
						<img src="/MES/images/home-2.png" style="width:100%;height:100%" alt="Second slide">
						<div class="carousel-caption">2/3</div>
						</div>
						<div class="item" style="height:250px">
						<img src="/MES/images/home-3.png" style="width:100%;height:100%" alt="Third slide">
						<div class="carousel-caption">3/3</div>
						</div>
						</div>
						轮播（Carousel）导航
						<a class="carousel-control left" href="#myCarousel"
						data-slide="prev">&lsaquo;
						</a>
						<a class="carousel-control right" href="#myCarousel"
						data-slide="next">&rsaquo;
						</a>
						</div> -->
														
						
				</div>
			
			</div>
			
				<!-- <div class="row">
				<div class="col-xs-12 col-sm-5 widget-container-col ui-sortable">
					<div class="widget-box ui-sortable-handle">
								<div class="widget-header">
									<h5 class="widget-title">工厂异常停线</h5>
									<div class="widget-toolbar">
										<a href="#" data-action="fullscreen" class="orange2">
											<i class="ace-icon fa fa-expand"></i>
										</a>
										<a href="#" data-action="reload" onclick="reload('5');">
											<i class="ace-icon fa fa-refresh"></i>
										</a>
									</div>
								</div>

								<div class="widget-body">
									<div class="widget-main"  style="height:230px;overflow:hidden">		
											<ul id="exception">
											
											</ul>								
									</div>
								</div>
						</div>
				</div>
				
				<div class="col-xs-12 col-sm-7 widget-container-col ui-sortable" >
					<div class="widget-box ui-sortable-handle" >
								<div class="widget-header">
									<h5 class="widget-title">Monitor：</h5>
									<div class="widget-toolbar">
										<a href="#" data-action="fullscreen" class="orange2" >
											<i class="ace-icon fa fa-expand"></i>
										</a>
										<a href="#" data-action="reload" onclick="reload('6');">
											<i class="ace-icon fa fa-refresh"></i>
										</a>
									</div>
								</div>

								<div class="widget-body" id="">
										<div class="widget-main" id="container3"  style="height:210px">												
										</div>
									</div>
						</div>
				</div>
			
			</div> -->

			<!-- 脚 -->
			<%-- <jsp:include page="footer.jsp" flush="true"/> --%>
			<a href="#" id="btn-scroll-up" class="btn-scroll-up btn btn-sm btn-inverse"><i class="ace-icon fa fa-angle-double-up icon-only bigger-110"></i></a>
		</div><!-- /.main-container -->
	</div>
	<script src="assets/js/jquery-ui.custom.min.js"></script>
	<script src="assets/js/jquery.easypiechart.min.js"></script>
	<script src="js/highcharts.js"></script>
	<script src="js/common.js"></script>
	<script src="js/index.js"></script>
	
	</body>
</html>
