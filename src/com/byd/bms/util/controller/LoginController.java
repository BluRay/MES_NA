package com.byd.bms.util.controller;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.security.NoSuchAlgorithmException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.byd.bms.util.MD5Util;
import com.byd.bms.util.model.BmsBaseUser;
import com.byd.bms.util.service.ILoginService;

@Controller
public class LoginController extends BaseController{
	@Autowired
	protected ILoginService loginService;
	
	@RequestMapping("/")  
    public ModelAndView index(){ 
		mv.setViewName("index");
        return mv;  
    }
	@RequestMapping("/loginPage")  
    public ModelAndView login(){ 
		mv.setViewName("login");
        return mv;  
    }  
	@RequestMapping("/page403")  
    public ModelAndView page403(){ 
		mv.setViewName("403");
        return mv;  
    }  
	@RequestMapping("/login")
    public ModelAndView login(BmsBaseUser user,Model model) throws NoSuchAlgorithmException, UnsupportedEncodingException, IOException{ 
		String password=StringUtils.isEmpty(user.getPassword())?"":user.getPassword();
		user=loginService.getUser(user.getUsername());
		String last_url=request.getParameter("last_url");
		String token_flag=request.getParameter("token_flag");
		
		if(MD5Util.validPassword(password, user.getPassword())){
			session.setAttribute("user_name", user.getUsername());
			session.setAttribute("display_name", user.getDisplay_name());
			session.setAttribute("user_id", user.getId());
			session.setAttribute("staff_number", user.getStaff_number());
			session.setAttribute("factory", user.getFactory());
			session.setAttribute("factory_id", user.getFactory_id());
			session.setAttribute("bmsuser", user);
			model.addAttribute("user", user);
			
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String login_time = df.format(new Date());
			user.setLast_login_time(login_time);			
			loginService.saveUserLoginInfo(user);
			
			if(last_url!=""&&last_url!=null){
				response.sendRedirect(last_url);
				return null;
			}else{
				mv.setViewName("home"+token_flag);
			}
				
		}else{
			mv.setViewName("error");
		}
        return mv;  
    }
	@RequestMapping("/logout")
	public ModelAndView logout(){ 
		mv.setViewName("login");
		session.setAttribute("user_name", null);
		session.setAttribute("display_name", null);
		session.setAttribute("user_id", null);
		session.setAttribute("factory", null);
		session.setAttribute("bmsuser", null);
		mv.setViewName("login");
        return mv;  
    }
	
	@RequestMapping("/index")  
    public ModelAndView index1(){ 
		mv.setViewName("index");
        return mv;  
    } 

	@RequestMapping("/tables")  
    public ModelAndView tables(){ 
		mv.setViewName("tables");
        return mv;  
    }  
	
	@RequestMapping("/elements")  
    public ModelAndView elements(){ 
		mv.setViewName("elements");
        return mv;  
    }  
	
	@RequestMapping("/buttons")  
    public ModelAndView buttons(){ 
		mv.setViewName("buttons");
        return mv;  
    }  
	
	@RequestMapping("/profile")  
    public ModelAndView profile(){ 
		mv.setViewName("profile");
        return mv;  
    }  
	
	@RequestMapping("/dropzone")  
    public ModelAndView dropzone(){ 
		mv.setViewName("dropzone");
        return mv;  
    } 
	
	@RequestMapping("/formelements")  
    public ModelAndView formelements(){ 
		mv.setViewName("formelements");
        return mv;  
    } 
	
	@RequestMapping("/formwizard")  
    public ModelAndView formwizard(){ 
		mv.setViewName("formwizard");
        return mv;  
    } 
	
	@RequestMapping("/jqueryui")  
    public ModelAndView jqueryui(){ 
		mv.setViewName("jqueryui");
        return mv;  
    } 
	
	@RequestMapping("/treeview")  
    public ModelAndView treeview(){ 
		mv.setViewName("treeview");
        return mv;  
    } 
	
	@RequestMapping("/wysiwyg")  
    public ModelAndView wysiwyg(){ 
		mv.setViewName("wysiwyg");
        return mv;  
    }
	@RequestMapping("/flow")  
    public ModelAndView flow(){ 
		mv.setViewName("flow");
        return mv;  
    } 
	
	@RequestMapping("/blank")  
    public ModelAndView blank(){ 
		mv.setViewName("blank");
        return mv;  
    } 
	
	@RequestMapping("/login_mobile")
    public ModelAndView login_mobile(BmsBaseUser user,Model model) throws NoSuchAlgorithmException, UnsupportedEncodingException, IOException{ 
		String password=StringUtils.isEmpty(user.getPassword())?"":user.getPassword();
		user=loginService.getUser(user.getUsername());
		String last_url=request.getParameter("last_url");
		
		if(MD5Util.validPassword(password, user.getPassword())){
			session.setAttribute("user_name", user.getUsername());
			session.setAttribute("display_name", user.getDisplay_name());
			session.setAttribute("user_id", user.getId());
			session.setAttribute("staff_number", user.getStaff_number());
			session.setAttribute("factory", user.getFactory());
			session.setAttribute("bmsuser", user);
			model.addAttribute("user", user);
			
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String login_time = df.format(new Date());
			user.setLast_login_time(login_time);			
			loginService.saveUserLoginInfo(user);
			
			if(last_url!=""&&last_url!=null){
				response.sendRedirect(last_url);
				return null;
			}else
				mv.setViewName("home_mobile");
		}else{
			mv.setViewName("error");
		}
        return mv;  
    }
	
	@RequestMapping("/index_mobile")  
    public ModelAndView index_mobile(){ 
		mv.setViewName("home_mobile");
        return mv;  
    } 
}
