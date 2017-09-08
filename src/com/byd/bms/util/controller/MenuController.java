package com.byd.bms.util.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.byd.bms.util.model.BmsBaseMenu;
import com.byd.bms.util.service.IMenuService;
import com.google.gson.Gson;

@Controller
public class MenuController extends BaseController {
	@Autowired
	protected IMenuService menuService;

	@RequestMapping("/getMenu")
	@ResponseBody
	public ModelMap getMenu() {
		List<BmsBaseMenu> list = new ArrayList<BmsBaseMenu>();
		list = menuService.getMenu();
		Gson gson = new Gson();
		String jsonstr = gson.toJson(list).toString();
		model.put("result", jsonstr);
		model.put("success", true);
		return model;
	}
}
