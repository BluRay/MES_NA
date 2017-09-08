package com.byd.bms.util.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class BaseController {
	protected ModelAndView mv = new ModelAndView();
	protected ModelMap model=new ModelMap();
	@Autowired  
	protected HttpServletRequest request;
	@Autowired 
	protected HttpServletResponse response;
	@Autowired 
	protected HttpSession session; 
	
	public ModelMap getModel() {
		return model;
	}
	public void setModel(ModelMap model) {
		this.model = model;
	}
	public ModelAndView getMv() {
		return mv;
	}
	public void setMv(ModelAndView mv) {
		this.mv = mv;
	}	
	public HttpServletRequest getRequest() {
		return request;
	}
	public void setRequest(HttpServletRequest request) {
		this.request = request;
	}
	 @ModelAttribute 
     public void setReqAndRes(HttpServletRequest request, HttpServletResponse response){ 
         this.request = request; 
         this.response = response; 
         this.session = request.getSession(); 
     } 

	 public void initModel(boolean status,String message,Object data){
		 mv.clear();
		 Map<String, Object> map = new HashMap<String, Object>();  
	     map.put( "success", status);  
	     map.put( "message", message); 
	     map.put( "data",data);
		 mv.getModelMap().addAllAttributes(map);
	 };
}
