<%@ page language="java" pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>  
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=Edge">
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<title><fmt:message key="login.title" /></title>
<link rel="stylesheet" type="text/css" href="css/base.css" media="all">
<link type="text/css" rel="stylesheet" href="css/comm.css" source="widget">
<link charset="utf-8" rel="stylesheet" href="css/tips.css">
<link href="css/bootstrap.min.css" rel="stylesheet">
<link href="css/login.css" rel="stylesheet">
<script type="text/javascript" src="js/jquery-2.1.0.min.js"></script>
<script type="text/javascript" src="js/bootstrap.min.js"></script>
<script type="text/javascript" src="js/common.js"></script>
<script type="text/javascript">
$(document).ready(function(){
	var last_url=getQueryString("last_url");
	$("#last_url").val(last_url);
});
</script>
<style id="style-1-cropbar-clipper">
.en-markup-crop-options {
	top: 18px !important;
	left: 50% !important;
	margin-left: -100px !important;
	width: 200px !important;
	border: 2px rgba(255, 255, 255, .38) solid !important;
	border-radius: 4px !important;
}

.en-markup-crop-options div div:first-of-type {
	margin-left: 0px !important;
}
</style>
</head>

<body style="overflow: hidden;">
	<div class="w">
		<div id="logo">
			<a href="http://www.byd.com/"
				clstag="pageclick|keycount|20150112ABD|45"><img
				src="images/logo.png" alt="BYD"></a>
		</div>
	</div>
	<div id="content">
		<div class="login-wrap">
			<div class="w">
				<div class="login-form" style="border: 1px solid #FDCC97;">
					<div class="login-box">
						<div class="mt">
							<h1 style="top: -10px;"><fmt:message key="login.system_welcome" /></h1>
							<div class="extra-r"></div>
						</div>

						<div class="mc" style="margin-top:20px">
							<div class="form">
								<form id="login" action="login" method="post">
									<div class="msg-wrap" style="margin-bottom: 14px">
										<div class="msg-warn">
											<b></b><span style="margin-left: -85px"><fmt:message key="login.tip" /></span>
										</div>
										<div class="msg-error hide" style="display: none;">
											<b></b>
										</div>
									</div>
									<div class="item item-fore1">
										<label for="loginname" class="login-label name-label"></label>
										<input
											style="width: 267px; height: 38px; margin-left: 38px;margin-top: -1px; position:absolute ;z-index:10"
											placeholder="请输入账号" name="username" id="username"
											label="用户名："></input>
										<!-- <span class="clear-btn" style="display: inline;"></span> -->
									</div>
									<div id="entry" class="item item-fore2">
										<label class="login-label pwd-label" for="nloginpwd"></label>
										<input type="password"
											style="width: 267px; height: 38px; margin-left: 38px;margin-top: -1px; position:absolute ;z-index:10"
											placeholder="请输入密码" name="password" id="password" label="密码："></input>
									</div>

									<div class="item item-fore5">
										<div class="login-btn">
											<a href="javascript:login.submit();"
												class="btn-img btn-entry" id="loginsubmit" tabindex="6"
												clstag="pageclick|keycount|20150112ABD|2">登&nbsp;&nbsp;&nbsp;&nbsp;录</a>
										</div>
									</div>
									 <p>* 请使用 <a href="firefox.exe">火狐浏览器(点击下载)</a> 使用本系统</p> 
									 
									 <input type="hidden" id="last_url" name="last_url" ></input>
								</form>
							</div>
							
						</div>						
					</div>
					<div style="margin-top:50px">
								<p id="accessTip" style="display: none;">* 请使用 <a href="firefox.exe">火狐浏览器(点击下载)</a> 使用本系统</p>									
						</div>
				</div>
			</div>
			
			<div class="login-banner" style="background-color: White">
				<div class="w">
					<div id="banner-bg" clstag="pageclick|keycount|20150112ABD|46"
						class="i-inner"
						style="background: url(images/1.png) 0px 0px no-repeat; background-color: White">
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="w">
		<div id="footer-2013">
			<div class="links">
				<a rel="nofollow" target="_blank" href="#"> 关于我们 </a> | <a
					rel="nofollow" target="_blank" href="#"> 联系我们 </a> | <a
					target="_blank" href="#"> 友情链接 </a>
			</div>
			<div class="copyright" style="font-family: Microsoft YaHei;">
				Copyright©2015&nbsp;&nbsp;&nbsp;比亚迪·信息中心</div>
		</div>
	</div>
	<script type="text/javascript">
		document.getElementById('banner-bg').style.background = "url(images/"
				+ (Math.floor(Math.random() * 4) + 1) + ".png)";

		$(document).ready(function() {
			if (navigator.appName=='Microsoft Internet Explorer'){						
				$('.form').hide();
				$("#accessTip").show();
				if(confirm("请使用火狐浏览器，点击‘确定’下载！")){
					window.location.href="firefox.exe";
				}
				return ;
			}else{
				var s = window.location + "";
				//alert(s.substr(28,38));
				/* if (s.substr(28,38) == "login.jsp"){
					window.navigate('logout.action');
				} */

				$('#username').focus();
				$('#username').bind('keydown', function(event) {
					if (event.keyCode == "13") {
						$('#password').focus();
						$('#password').select();
						return false;
					}
				});
				$('#password').bind('keydown', function(event) {
					if (event.keyCode == "13") {
						document.getElementById("login").submit()
						return false;
					}
				});
			}
			})
			
	</script>
</body>
</html>
