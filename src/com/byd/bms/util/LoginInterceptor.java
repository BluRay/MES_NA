package com.byd.bms.util;

import java.util.Enumeration;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import com.byd.bms.util.model.BmsBaseUser;
import com.byd.bms.util.service.ICommonService;
import com.byd.bms.util.service.ILoginService;

/**
 * @author Yangke 170313
 * 登录拦截器
 */
public class LoginInterceptor extends HandlerInterceptorAdapter{
	static Logger logger = Logger.getLogger(LoginInterceptor.class);
	@Autowired
	protected ICommonService commonService;
	@Autowired
	protected ILoginService loginService;
	private List<String> excludedUrls;

	public void setExcludeUrls(List<String> excludeUrls) {
		this.excludedUrls = excludeUrls;
	}

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
		// 获得请求路径的uri
		String uri = request.getRequestURI();
		String accessURL = uri.substring(uri.indexOf("/", 1)+1,uri.length()); 
		String loginName = request.getHeader("BMS_USER_ID");
		String remoteAddr = request.getRemoteAddr();
		HttpSession session = request.getSession();
		for (String url : excludedUrls) {
			if (uri.endsWith(url)) {
				return true;		//不拦截静态资源文件
			}
		}
		
		// 进入登录页面，在LoginController中判断是否已登录，有的话重定向到首页，否则进入登录界面
		if (uri.contains("/loginPage")) {
			return true;
		}
		if (uri.contains("/login")) {
			return true;
		}
		
		// 其他情况判断session中是否有key，有的话继续用户的操作
		if (session.getAttribute("user_name") != null) {
			//判断user是否拥有该请求的访问权限,没有则跳到无权限的错误提示页面
			List<String> authAllList = commonService.getAllRoleAuthority();
			List<String> authlist = commonService.getRoleAuthority(request.getSession().getAttribute("staff_number") + "");
			boolean check_permission = false;
			for(int i=0;i<authAllList.size();i++){
				authAllList.set(i, uri.substring(0, uri.indexOf("/", 1)+1) + authAllList.get(i));
			}
			for(int i=0;i<authlist.size();i++){
				authlist.set(i, uri.substring(0, uri.indexOf("/", 1)+1) + authlist.get(i));
			}
			//只判断配置了权限的功能地址，没有配置权限的可以直接访问
			if (authAllList.contains(uri)) {
				if (authlist.contains(uri)) {
					check_permission = true;
				}
			}else{
				check_permission = true;
			}

			if(!check_permission){
				logger.info ("check_permission = " + check_permission);
				response.sendRedirect(request.getContextPath() + "/page403");
				return false;
			}
			
			//保存操作日志 TODO 先判断请求是否需要记录操作日志
			//操作日志格式：	工号		IP地址		  请求地址	  请求数据
			//				2074793 10.23.105.108 /BMS/login order_no:123456 new_value:8888
			Enumeration<?> enu=request.getParameterNames();
			String str_request = "";
			while(enu.hasMoreElements()){  
				String paraName=(String)enu.nextElement();  
				str_request += paraName + ":" + request.getParameter(paraName) + " ";  
			}
			logger.info("-->" + request.getSession().getAttribute("staff_number") + " " + request.getRemoteAddr() + " " + uri + " " + str_request);
			
			return true;
		}

		
		/*
		 * 和OAM SSO集成，从OAM获取登录验证标识
		 */
		logger.info("SSO login name:"+loginName);
		
		// 如果获取不到HEADER直接进入本地登录入口
		if (StringUtils.isEmpty(loginName)) {
			// 跳转到原始登录页面
			//returnPage=request.getContextPath() + "/login.jsp";
			response.sendRedirect(request.getContextPath()+ "/loginPage?last_url="+accessURL);
			return false;
		}else{
			BmsBaseUser user=loginService.getUser(loginName);
			if(!loginName.equals(user.getStaff_number())){
				logger.info("用户"+loginName+" 在BMS系统不存在！");
				response.sendRedirect(request.getContextPath()+"/loginPage");
				return false;
			}
			boolean ipOK = false;
			
			// WEB服务器IP配置需要从配置文件读取，如果WEB服务器是APACHE,IHS之类的，有多个服务器，IP可以用逗号隔开，
			// 如果是直接从F5进行的负载，则配置文件写F5的地址即可，后续如果WEB服务器IP地址变化了，需要修改配置文件的IP
			// 如果是单节点没有负载则不需要做这个判断
			if ("10.23.1.18,10.23.1.74".indexOf(remoteAddr) != -1)
				ipOK = true;
			
			if(ipOK){
				session.setAttribute("user_name",user.getUsername());
				session.setAttribute("display_name", user.getDisplay_name());
				session.setAttribute("user_id", user.getId());
				session.setAttribute("staff_number", user.getStaff_number());
				session.setAttribute("factory", user.getFactory());
				session.setAttribute("factory_id", user.getFactory_id());
				session.setAttribute("bmsuser", user);
				return true;
			}
		}
		
		// 最后的情况就是进入登录页面
		response.sendRedirect(request.getContextPath() + "/loginPage?last_url="+accessURL);
		return false;
	}
}
