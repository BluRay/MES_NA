<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<html lang="en">
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta charset="utf-8" />
		<title>Form Wizard - Ace Admin</title>

		<meta name="description" content="and Validation" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />

		<!-- bootstrap & fontawesome -->
		<link rel="stylesheet" href="assets/css/bootstrap.min.css" />
		<link rel="stylesheet" href="assets/css/font-awesome.min.css" />

		<!-- page specific plugin styles -->
		<link rel="stylesheet" href="assets/css/select2.css" />

		<!-- text fonts -->
		<link rel="stylesheet" href="assets/css/ace-fonts.css" />

		<!-- ace styles -->
		<link rel="stylesheet" href="assets/css/ace.min.css" id="main-ace-style" />

		<!--[if lte IE 9]>
			<link rel="stylesheet" href="assets/css/ace-part2.min.css" />
		<![endif]-->
		<link rel="stylesheet" href="assets/css/ace-skins.min.css" />
		<link rel="stylesheet" href="assets/css/ace-rtl.min.css" />

		<!--[if lte IE 9]>
		  <link rel="stylesheet" href="assets/css/ace-ie.min.css" />
		<![endif]-->

		<!-- inline styles related to this page -->

		<!-- ace settings handler -->
		<script src="assets/js/ace-extra.min.js"></script>

		<!-- HTML5shiv and Respond.js for IE8 to support HTML5 elements and media queries -->

		<!--[if lte IE 8]>
		<script src="assets/js/html5shiv.min.js"></script>
		<script src="assets/js/respond.min.js"></script>
		<![endif]-->
	</head>

	<body class="no-skin">
		<!-- #section:basics/navbar.layout -->
		<jsp:include page="top.jsp" flush="true"/>

		<!-- /section:basics/navbar.layout -->
		<div class="main-container" id="main-container">
			<script type="text/javascript">
				try{ace.settings.check('main-container' , 'fixed')}catch(e){}
			</script>

			<!-- #section:basics/sidebar -->
			<!-- 左边菜单 -->
			<jsp:include page="left.jsp" flush="true"/>

			<!-- /section:basics/sidebar -->
			<div class="main-content">
				<!-- #section:basics/content.breadcrumbs -->
				<div class="breadcrumbs" id="breadcrumbs">
					<script type="text/javascript">
						try{ace.settings.check('breadcrumbs' , 'fixed')}catch(e){}
					</script>

					<ul class="breadcrumb">
						<li>
							<i class="ace-icon fa fa-home home-icon"></i>
							<a href="#">Home</a>
						</li>

						<li>
							<a href="#">Forms</a>
						</li>
						<li class="active">Wizard &amp; Validation</li>
					</ul><!-- /.breadcrumb -->

					<!-- #section:basics/content.searchbox -->
					<div class="nav-search" id="nav-search">
						<form class="form-search">
							<span class="input-icon">
								<input type="text" placeholder="Search ..." class="nav-search-input" id="nav-search-input" autocomplete="off" />
								<i class="ace-icon fa fa-search nav-search-icon"></i>
							</span>
						</form>
					</div><!-- /.nav-search -->

					<!-- /section:basics/content.searchbox -->
				</div>

				<!-- /section:basics/content.breadcrumbs -->
				<div class="page-content">
					<!-- #section:settings.box -->
					<div class="ace-settings-container" id="ace-settings-container">
						<div class="btn btn-app btn-xs btn-warning ace-settings-btn" id="ace-settings-btn">
							<i class="ace-icon fa fa-cog bigger-150"></i>
						</div>

						<div class="ace-settings-box clearfix" id="ace-settings-box">
							<div class="pull-left width-50">
								<!-- #section:settings.skins -->
								<div class="ace-settings-item">
									<div class="pull-left">
										<select id="skin-colorpicker" class="hide">
											<option data-skin="no-skin" value="#438EB9">#438EB9</option>
											<option data-skin="skin-1" value="#222A2D">#222A2D</option>
											<option data-skin="skin-2" value="#C6487E">#C6487E</option>
											<option data-skin="skin-3" value="#D0D0D0">#D0D0D0</option>
										</select>
									</div>
									<span>&nbsp; Choose Skin</span>
								</div>

								<!-- /section:settings.skins -->

								<!-- #section:settings.navbar -->
								<div class="ace-settings-item">
									<input type="checkbox" class="ace ace-checkbox-2" id="ace-settings-navbar" />
									<label class="lbl" for="ace-settings-navbar"> Fixed Navbar</label>
								</div>

								<!-- /section:settings.navbar -->

								<!-- #section:settings.sidebar -->
								<div class="ace-settings-item">
									<input type="checkbox" class="ace ace-checkbox-2" id="ace-settings-sidebar" />
									<label class="lbl" for="ace-settings-sidebar"> Fixed Sidebar</label>
								</div>

								<!-- /section:settings.sidebar -->

								<!-- #section:settings.breadcrumbs -->
								<div class="ace-settings-item">
									<input type="checkbox" class="ace ace-checkbox-2" id="ace-settings-breadcrumbs" />
									<label class="lbl" for="ace-settings-breadcrumbs"> Fixed Breadcrumbs</label>
								</div>

								<!-- /section:settings.breadcrumbs -->

								<!-- #section:settings.rtl -->
								<div class="ace-settings-item">
									<input type="checkbox" class="ace ace-checkbox-2" id="ace-settings-rtl" />
									<label class="lbl" for="ace-settings-rtl"> Right To Left (rtl)</label>
								</div>

								<!-- /section:settings.rtl -->

								<!-- #section:settings.container -->
								<div class="ace-settings-item">
									<input type="checkbox" class="ace ace-checkbox-2" id="ace-settings-add-container" />
									<label class="lbl" for="ace-settings-add-container">
										Inside
										<b>.container</b>
									</label>
								</div>

								<!-- /section:settings.container -->
							</div><!-- /.pull-left -->

							<div class="pull-left width-50">
								<!-- #section:basics/sidebar.options -->
								<div class="ace-settings-item">
									<input type="checkbox" class="ace ace-checkbox-2" id="ace-settings-hover" />
									<label class="lbl" for="ace-settings-hover"> Submenu on Hover</label>
								</div>

								<div class="ace-settings-item">
									<input type="checkbox" class="ace ace-checkbox-2" id="ace-settings-compact" />
									<label class="lbl" for="ace-settings-compact"> Compact Sidebar</label>
								</div>

								<div class="ace-settings-item">
									<input type="checkbox" class="ace ace-checkbox-2" id="ace-settings-highlight" />
									<label class="lbl" for="ace-settings-highlight"> Alt. Active Item</label>
								</div>

								<!-- /section:basics/sidebar.options -->
							</div><!-- /.pull-left -->
						</div><!-- /.ace-settings-box -->
					</div><!-- /.ace-settings-container -->

					<!-- /section:settings.box -->
					<div class="page-content-area">
						<div class="page-header">
							<h1>
								Form Wizard
								<small>
									<i class="ace-icon fa fa-angle-double-right"></i>
									and Validation
								</small>
							</h1>
						</div><!-- /.page-header -->

						<div class="row">
							<div class="col-xs-12">
								<!-- PAGE CONTENT BEGINS -->
								<h4 class="lighter">
									<i class="ace-icon fa fa-hand-o-right icon-animated-hand-pointer blue"></i>
									<a href="#modal-wizard" data-toggle="modal" class="pink"> Wizard Inside a Modal Box </a>
								</h4>

								<div class="hr hr-18 hr-double dotted"></div>

								<div class="widget-box">
									<div class="widget-header widget-header-blue widget-header-flat">
										<h4 class="widget-title lighter">New Item Wizard</h4>

										<div class="widget-toolbar">
											<label>
												<small class="green">
													<b>Validation</b>
												</small>

												<input id="skip-validation" type="checkbox" class="ace ace-switch ace-switch-4" />
												<span class="lbl middle"></span>
											</label>
										</div>
									</div>

									<div class="widget-body">
										<div class="widget-main">
											<!-- #section:plugins/fuelux.wizard -->
											<div id="fuelux-wizard" data-target="#step-container">
												<!-- #section:plugins/fuelux.wizard.steps -->
												<ul class="wizard-steps">
													<li data-target="#step1" class="active">
														<span class="step">1</span>
														<span class="title">Validation states</span>
													</li>

													<li data-target="#step2">
														<span class="step">2</span>
														<span class="title">Alerts</span>
													</li>

													<li data-target="#step3">
														<span class="step">3</span>
														<span class="title">Payment Info</span>
													</li>

													<li data-target="#step4">
														<span class="step">4</span>
														<span class="title">Other Info</span>
													</li>
												</ul>

												<!-- /section:plugins/fuelux.wizard.steps -->
											</div>

											<hr />

											<!-- #section:plugins/fuelux.wizard.container -->
											<div class="step-content pos-rel" id="step-container">
												<div class="step-pane active" id="step1">
													<h3 class="lighter block green">Enter the following information</h3>

													<form class="form-horizontal" id="sample-form">
														<!-- #section:elements.form.input-state -->
														<div class="form-group has-warning">
															<label for="inputWarning" class="col-xs-12 col-sm-3 control-label no-padding-right">Input with warning</label>

															<div class="col-xs-12 col-sm-5">
																<span class="block input-icon input-icon-right">
																	<input type="text" id="inputWarning" class="width-100" />
																	<i class="ace-icon fa fa-leaf"></i>
																</span>
															</div>
															<div class="help-block col-xs-12 col-sm-reset inline"> Warning tip help! </div>
														</div>

														<!-- /section:elements.form.input-state -->
														<div class="form-group has-error">
															<label for="inputError" class="col-xs-12 col-sm-3 col-md-3 control-label no-padding-right">Input with error</label>

															<div class="col-xs-12 col-sm-5">
																<span class="block input-icon input-icon-right">
																	<input type="text" id="inputError" class="width-100" />
																	<i class="ace-icon fa fa-times-circle"></i>
																</span>
															</div>
															<div class="help-block col-xs-12 col-sm-reset inline"> Error tip help! </div>
														</div>

														<div class="form-group has-success">
															<label for="inputSuccess" class="col-xs-12 col-sm-3 control-label no-padding-right">Input with success</label>

															<div class="col-xs-12 col-sm-5">
																<span class="block input-icon input-icon-right">
																	<input type="text" id="inputSuccess" class="width-100" />
																	<i class="ace-icon fa fa-check-circle"></i>
																</span>
															</div>
															<div class="help-block col-xs-12 col-sm-reset inline"> Success tip help! </div>
														</div>

														<div class="form-group has-info">
															<label for="inputInfo" class="col-xs-12 col-sm-3 control-label no-padding-right">Input with info</label>

															<div class="col-xs-12 col-sm-5">
																<span class="block input-icon input-icon-right">
																	<input type="text" id="inputInfo" class="width-100" />
																	<i class="ace-icon fa fa-info-circle"></i>
																</span>
															</div>
															<div class="help-block col-xs-12 col-sm-reset inline"> Info tip help! </div>
														</div>

														<div class="form-group">
															<label for="inputError2" class="col-xs-12 col-sm-3 control-label no-padding-right">Input with error</label>

															<div class="col-xs-12 col-sm-5">
																<span class="input-icon block">
																	<input type="text" id="inputError2" class="width-100" />
																	<i class="ace-icon fa fa-times-circle red"></i>
																</span>
															</div>
															<div class="help-block col-xs-12 col-sm-reset inline"> Error tip help! </div>
														</div>
													</form>

													<form class="form-horizontal hide" id="validation-form" method="get">
														<div class="form-group">
															<label class="control-label col-xs-12 col-sm-3 no-padding-right" for="email">Email Address:</label>

															<div class="col-xs-12 col-sm-9">
																<div class="clearfix">
																	<input type="email" name="email" id="email" class="col-xs-12 col-sm-6" />
																</div>
															</div>
														</div>

														<div class="space-2"></div>

														<div class="form-group">
															<label class="control-label col-xs-12 col-sm-3 no-padding-right" for="password">Password:</label>

															<div class="col-xs-12 col-sm-9">
																<div class="clearfix">
																	<input type="password" name="password" id="password" class="col-xs-12 col-sm-4" />
																</div>
															</div>
														</div>

														<div class="space-2"></div>

														<div class="form-group">
															<label class="control-label col-xs-12 col-sm-3 no-padding-right" for="password2">Confirm Password:</label>

															<div class="col-xs-12 col-sm-9">
																<div class="clearfix">
																	<input type="password" name="password2" id="password2" class="col-xs-12 col-sm-4" />
																</div>
															</div>
														</div>

														<div class="hr hr-dotted"></div>

														<div class="form-group">
															<label class="control-label col-xs-12 col-sm-3 no-padding-right" for="name">Company Name:</label>

															<div class="col-xs-12 col-sm-9">
																<div class="clearfix">
																	<input type="text" id="name" name="name" class="col-xs-12 col-sm-5" />
																</div>
															</div>
														</div>

														<div class="space-2"></div>

														<div class="form-group">
															<label class="control-label col-xs-12 col-sm-3 no-padding-right" for="phone">Phone Number:</label>

															<div class="col-xs-12 col-sm-9">
																<div class="input-group">
																	<span class="input-group-addon">
																		<i class="ace-icon fa fa-phone"></i>
																	</span>

																	<input type="tel" id="phone" name="phone" />
																</div>
															</div>
														</div>

														<div class="space-2"></div>

														<div class="form-group">
															<label class="control-label col-xs-12 col-sm-3 no-padding-right" for="url">Company URL:</label>

															<div class="col-xs-12 col-sm-9">
																<div class="clearfix">
																	<input type="url" id="url" name="url" class="col-xs-12 col-sm-8" />
																</div>
															</div>
														</div>

														<div class="hr hr-dotted"></div>

														<div class="form-group">
															<label class="control-label col-xs-12 col-sm-3 no-padding-right">Subscribe to</label>

															<div class="col-xs-12 col-sm-9">
																<div>
																	<label>
																		<input name="subscription" value="1" type="checkbox" class="ace" />
																		<span class="lbl"> Latest news and announcements</span>
																	</label>
																</div>

																<div>
																	<label>
																		<input name="subscription" value="2" type="checkbox" class="ace" />
																		<span class="lbl"> Product offers and discounts</span>
																	</label>
																</div>
															</div>
														</div>

														<div class="space-2"></div>

														<div class="form-group">
															<label class="control-label col-xs-12 col-sm-3 no-padding-right">Gender</label>

															<div class="col-xs-12 col-sm-9">
																<div>
																	<label class="line-height-1 blue">
																		<input name="gender" value="1" type="radio" class="ace" />
																		<span class="lbl"> Male</span>
																	</label>
																</div>

																<div>
																	<label class="line-height-1 blue">
																		<input name="gender" value="2" type="radio" class="ace" />
																		<span class="lbl"> Female</span>
																	</label>
																</div>
															</div>
														</div>

														<div class="hr hr-dotted"></div>

														<div class="form-group">
															<label class="control-label col-xs-12 col-sm-3 no-padding-right" for="state">State</label>

															<div class="col-xs-12 col-sm-9">
																<select id="state" name="state" class="select2" data-placeholder="Click to Choose...">
																	<option value="">&nbsp;</option>
																	<option value="AL">Alabama</option>
																	<option value="AK">Alaska</option>
																	<option value="AZ">Arizona</option>
																	<option value="AR">Arkansas</option>
																	<option value="CA">California</option>
																	<option value="CO">Colorado</option>
																	<option value="CT">Connecticut</option>
																	<option value="DE">Delaware</option>
																	<option value="FL">Florida</option>
																	<option value="GA">Georgia</option>
																	<option value="HI">Hawaii</option>
																	<option value="ID">Idaho</option>
																	<option value="IL">Illinois</option>
																	<option value="IN">Indiana</option>
																	<option value="IA">Iowa</option>
																	<option value="KS">Kansas</option>
																	<option value="KY">Kentucky</option>
																	<option value="LA">Louisiana</option>
																	<option value="ME">Maine</option>
																	<option value="MD">Maryland</option>
																	<option value="MA">Massachusetts</option>
																	<option value="MI">Michigan</option>
																	<option value="MN">Minnesota</option>
																	<option value="MS">Mississippi</option>
																	<option value="MO">Missouri</option>
																	<option value="MT">Montana</option>
																	<option value="NE">Nebraska</option>
																	<option value="NV">Nevada</option>
																	<option value="NH">New Hampshire</option>
																	<option value="NJ">New Jersey</option>
																	<option value="NM">New Mexico</option>
																	<option value="NY">New York</option>
																	<option value="NC">North Carolina</option>
																	<option value="ND">North Dakota</option>
																	<option value="OH">Ohio</option>
																	<option value="OK">Oklahoma</option>
																	<option value="OR">Oregon</option>
																	<option value="PA">Pennsylvania</option>
																	<option value="RI">Rhode Island</option>
																	<option value="SC">South Carolina</option>
																	<option value="SD">South Dakota</option>
																	<option value="TN">Tennessee</option>
																	<option value="TX">Texas</option>
																	<option value="UT">Utah</option>
																	<option value="VT">Vermont</option>
																	<option value="VA">Virginia</option>
																	<option value="WA">Washington</option>
																	<option value="WV">West Virginia</option>
																	<option value="WI">Wisconsin</option>
																	<option value="WY">Wyoming</option>
																</select>
															</div>
														</div>

														<div class="space-2"></div>

														<div class="form-group">
															<label class="control-label col-xs-12 col-sm-3 no-padding-right" for="platform">Platform</label>

															<div class="col-xs-12 col-sm-9">
																<div class="clearfix">
																	<select class="input-medium" id="platform" name="platform">
																		<option value="">------------------</option>
																		<option value="linux">Linux</option>
																		<option value="windows">Windows</option>
																		<option value="mac">Mac OS</option>
																		<option value="ios">iOS</option>
																		<option value="android">Android</option>
																	</select>
																</div>
															</div>
														</div>

														<div class="space-2"></div>

														<div class="form-group">
															<label class="control-label col-xs-12 col-sm-3 no-padding-right" for="comment">Comment</label>

															<div class="col-xs-12 col-sm-9">
																<div class="clearfix">
																	<textarea class="input-xlarge" name="comment" id="comment"></textarea>
																</div>
															</div>
														</div>

														<div class="space-8"></div>

														<div class="form-group">
															<div class="col-xs-12 col-sm-4 col-sm-offset-3">
																<label>
																	<input name="agree" id="agree" type="checkbox" class="ace" />
																	<span class="lbl"> I accept the policy</span>
																</label>
															</div>
														</div>
													</form>
												</div>

												<div class="step-pane" id="step2">
													<div>
														<div class="alert alert-success">
															<button type="button" class="close" data-dismiss="alert">
																<i class="ace-icon fa fa-times"></i>
															</button>

															<strong>
																<i class="ace-icon fa fa-check"></i>
																Well done!
															</strong>

															You successfully read this important alert message.
															<br />
														</div>

														<div class="alert alert-danger">
															<button type="button" class="close" data-dismiss="alert">
																<i class="ace-icon fa fa-times"></i>
															</button>

															<strong>
																<i class="ace-icon fa fa-times"></i>
																Oh snap!
															</strong>

															Change a few things up and try submitting again.
															<br />
														</div>

														<div class="alert alert-warning">
															<button type="button" class="close" data-dismiss="alert">
																<i class="ace-icon fa fa-times"></i>
															</button>
															<strong>Warning!</strong>

															Best check yo self, you're not looking too good.
															<br />
														</div>

														<div class="alert alert-info">
															<button type="button" class="close" data-dismiss="alert">
																<i class="ace-icon fa fa-times"></i>
															</button>
															<strong>Heads up!</strong>

															This alert needs your attention, but it's not super important.
															<br />
														</div>
													</div>
												</div>

												<div class="step-pane" id="step3">
													<div class="center">
														<h3 class="blue lighter">This is step 3</h3>
													</div>
												</div>

												<div class="step-pane" id="step4">
													<div class="center">
														<h3 class="green">Congrats!</h3>
														Your product is ready to ship! Click finish to continue!
													</div>
												</div>
											</div>

											<!-- /section:plugins/fuelux.wizard.container -->
											<hr />
											<div class="wizard-actions">
												<!-- #section:plugins/fuelux.wizard.buttons -->
												<button class="btn btn-prev">
													<i class="ace-icon fa fa-arrow-left"></i>
													Prev
												</button>

												<button class="btn btn-success btn-next" data-last="Finish">
													Next
													<i class="ace-icon fa fa-arrow-right icon-on-right"></i>
												</button>

												<!-- /section:plugins/fuelux.wizard.buttons -->
											</div>

											<!-- /section:plugins/fuelux.wizard -->
										</div><!-- /.widget-main -->
									</div><!-- /.widget-body -->
								</div>

								<div id="modal-wizard" class="modal">
									<div class="modal-dialog">
										<div class="modal-content">
											<div class="modal-header" data-target="#modal-step-contents">
												<ul class="wizard-steps">
													<li data-target="#modal-step1" class="active">
														<span class="step">1</span>
														<span class="title">Validation states</span>
													</li>

													<li data-target="#modal-step2">
														<span class="step">2</span>
														<span class="title">Alerts</span>
													</li>

													<li data-target="#modal-step3">
														<span class="step">3</span>
														<span class="title">Payment Info</span>
													</li>

													<li data-target="#modal-step4">
														<span class="step">4</span>
														<span class="title">Other Info</span>
													</li>
												</ul>
											</div>

											<div class="modal-body step-content" id="modal-step-contents">
												<div class="step-pane active" id="modal-step1">
													<div class="center">
														<h4 class="blue">Step 1</h4>
													</div>
												</div>

												<div class="step-pane" id="modal-step2">
													<div class="center">
														<h4 class="blue">Step 2</h4>
													</div>
												</div>

												<div class="step-pane" id="modal-step3">
													<div class="center">
														<h4 class="blue">Step 3</h4>
													</div>
												</div>

												<div class="step-pane" id="modal-step4">
													<div class="center">
														<h4 class="blue">Step 4</h4>
													</div>
												</div>
											</div>

											<div class="modal-footer wizard-actions">
												<button class="btn btn-sm btn-prev">
													<i class="ace-icon fa fa-arrow-left"></i>
													Prev
												</button>

												<button class="btn btn-success btn-sm btn-next" data-last="Finish">
													Next
													<i class="ace-icon fa fa-arrow-right icon-on-right"></i>
												</button>

												<button class="btn btn-danger btn-sm pull-left" data-dismiss="modal">
													<i class="ace-icon fa fa-times"></i>
													Cancel
												</button>
											</div>
										</div>
									</div>
								</div><!-- PAGE CONTENT ENDS -->
							</div><!-- /.col -->
						</div><!-- /.row -->
					</div><!-- /.page-content-area -->
				</div><!-- /.page-content -->
			</div><!-- /.main-content -->

			<div class="footer">
				<div class="footer-inner">
					<!-- #section:basics/footer -->
					<div class="footer-content">
						<span class="bigger-120">
							<span class="blue bolder">Ace</span>
							Application &copy; 2013-2014
						</span>

						&nbsp; &nbsp;
						<span class="action-buttons">
							<a href="#">
								<i class="ace-icon fa fa-twitter-square light-blue bigger-150"></i>
							</a>

							<a href="#">
								<i class="ace-icon fa fa-facebook-square text-primary bigger-150"></i>
							</a>

							<a href="#">
								<i class="ace-icon fa fa-rss-square orange bigger-150"></i>
							</a>
						</span>
					</div>

					<!-- /section:basics/footer -->
				</div>
			</div>

			<a href="#" id="btn-scroll-up" class="btn-scroll-up btn btn-sm btn-inverse">
				<i class="ace-icon fa fa-angle-double-up icon-only bigger-110"></i>
			</a>
		</div><!-- /.main-container -->

		<!-- basic scripts -->

		<!--[if !IE]> -->
		<script type="text/javascript">
			window.jQuery || document.write("<script src='assets/js/jquery.min.js'>"+"<"+"/script>");
		</script>

		<!-- <![endif]-->

		<!--[if IE]>
<script type="text/javascript">
 window.jQuery || document.write("<script src='assets/js/jquery1x.min.js'>"+"<"+"/script>");
</script>
<![endif]-->
		<script type="text/javascript">
			if('ontouchstart' in document.documentElement) document.write("<script src='assets/js/jquery.mobile.custom.min.js'>"+"<"+"/script>");
		</script>
		<script src="assets/js/bootstrap.min.js"></script>

		<!-- page specific plugin scripts -->
		<script src="assets/js/fuelux/fuelux.wizard.min.js"></script>
		<script src="assets/js/jquery.validate.min.js"></script>
		<script src="assets/js/additional-methods.min.js"></script>
		<script src="assets/js/bootbox.min.js"></script>
		<script src="assets/js/jquery.maskedinput.min.js"></script>
		<script src="assets/js/select2.min.js"></script>

		<!-- ace scripts -->
		<script src="assets/js/ace-elements.min.js"></script>
		<script src="assets/js/ace.min.js"></script>

		<!-- inline scripts related to this page -->
		<script type="text/javascript">
			jQuery(function($) {
			
				$('[data-rel=tooltip]').tooltip();
			
				$(".select2").css('width','200px').select2({allowClear:true})
				.on('change', function(){
					$(this).closest('form').validate().element($(this));
				}); 
			
			
				var $validation = false;
				$('#fuelux-wizard')
				.ace_wizard({
					//step: 2 //optional argument. wizard will jump to step "2" at first
				})
				.on('change' , function(e, info){
					if(info.step == 1 && $validation) {
						if(!$('#validation-form').valid()) return false;
					}
				})
				.on('finished', function(e) {
					bootbox.dialog({
						message: "Thank you! Your information was successfully saved!", 
						buttons: {
							"success" : {
								"label" : "OK",
								"className" : "btn-sm btn-primary"
							}
						}
					});
				}).on('stepclick', function(e){
					//e.preventDefault();//this will prevent clicking and selecting steps
				});
			
			
				//jump to a step
				$('#step-jump').on('click', function() {
					var wizard = $('#fuelux-wizard').data('wizard')
					wizard.currentStep = 3;
					wizard.setState();
				})
				//determine selected step
				//wizard.selectedItem().step
			
			
			
				//hide or show the other form which requires validation
				//this is for demo only, you usullay want just one form in your application
				$('#skip-validation').removeAttr('checked').on('click', function(){
					$validation = this.checked;
					if(this.checked) {
						$('#sample-form').hide();
						$('#validation-form').removeClass('hide');
					}
					else {
						$('#validation-form').addClass('hide');
						$('#sample-form').show();
					}
				})
			
			
			
				//documentation : http://docs.jquery.com/Plugins/Validation/validate
			
			
				$.mask.definitions['~']='[+-]';
				$('#phone').mask('(999) 999-9999');
			
				jQuery.validator.addMethod("phone", function (value, element) {
					return this.optional(element) || /^\(\d{3}\) \d{3}\-\d{4}( x\d{1,6})?$/.test(value);
				}, "Enter a valid phone number.");
			
				$('#validation-form').validate({
					errorElement: 'div',
					errorClass: 'help-block',
					focusInvalid: false,
					rules: {
						email: {
							required: true,
							email:true
						},
						password: {
							required: true,
							minlength: 5
						},
						password2: {
							required: true,
							minlength: 5,
							equalTo: "#password"
						},
						name: {
							required: true
						},
						phone: {
							required: true,
							phone: 'required'
						},
						url: {
							required: true,
							url: true
						},
						comment: {
							required: true
						},
						state: {
							required: true
						},
						platform: {
							required: true
						},
						subscription: {
							required: true
						},
						gender: {
							required: true,
						},
						agree: {
							required: true,
						}
					},
			
					messages: {
						email: {
							required: "Please provide a valid email.",
							email: "Please provide a valid email."
						},
						password: {
							required: "Please specify a password.",
							minlength: "Please specify a secure password."
						},
						state: "Please choose state",
						subscription: "Please choose at least one option",
						gender: "Please choose gender",
						agree: "Please accept our policy"
					},
			
			
					highlight: function (e) {
						$(e).closest('.form-group').removeClass('has-info').addClass('has-error');
					},
			
					success: function (e) {
						$(e).closest('.form-group').removeClass('has-error');//.addClass('has-info');
						$(e).remove();
					},
			
					errorPlacement: function (error, element) {
						if(element.is('input[type=checkbox]') || element.is('input[type=radio]')) {
							var controls = element.closest('div[class*="col-"]');
							if(controls.find(':checkbox,:radio').length > 1) controls.append(error);
							else error.insertAfter(element.nextAll('.lbl:eq(0)').eq(0));
						}
						else if(element.is('.select2')) {
							error.insertAfter(element.siblings('[class*="select2-container"]:eq(0)'));
						}
						else if(element.is('.chosen-select')) {
							error.insertAfter(element.siblings('[class*="chosen-container"]:eq(0)'));
						}
						else error.insertAfter(element.parent());
					},
			
					submitHandler: function (form) {
					},
					invalidHandler: function (form) {
					}
				});
			
				
				
				
				$('#modal-wizard .modal-header').ace_wizard();
				$('#modal-wizard .wizard-actions .btn[data-dismiss=modal]').removeAttr('disabled');
				
				
				/**
				$('#date').datepicker({autoclose:true}).on('changeDate', function(ev) {
					$(this).closest('form').validate().element($(this));
				});
				
				$('#mychosen').chosen().on('change', function(ev) {
					$(this).closest('form').validate().element($(this));
				});
				*/
			})
		</script>

		<!-- the following scripts are used in demo only for onpage help and you don't need them -->
		<link rel="stylesheet" href="assets/css/ace.onpage-help.css" />
		<link rel="stylesheet" href="docs/assets/js/themes/sunburst.css" />

		<script type="text/javascript"> ace.vars['base'] = '..'; </script>
		<script src="assets/js/ace/elements.onpage-help.js"></script>
		<script src="assets/js/ace/ace.onpage-help.js"></script>
		<script src="docs/assets/js/rainbow.js"></script>
		<script src="docs/assets/js/language/generic.js"></script>
		<script src="docs/assets/js/language/html.js"></script>
		<script src="docs/assets/js/language/css.js"></script>
		<script src="docs/assets/js/language/javascript.js"></script>
	</body>
</html>
