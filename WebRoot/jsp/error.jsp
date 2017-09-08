<%@ page language="java"  pageEncoding="utf-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">   
    <title>ErrorPage</title>    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<link rel="stylesheet" href="assets/css/ace.min.css" />
  </head>
  <body class="login-layout light-login">
  	<center>
  	<div style="CURSOR:pointer;width:900px;border:2px solid #ffcc00;background:#fffff7""> 	
  	<img onclick="location='loginPage'" alt="登录失败" src="images/error.jpg">  	
  	</div>
  	</center>
  </body>
</html>
