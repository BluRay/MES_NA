package com.byd.bms.util.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.byd.bms.util.DataSource;
import com.byd.bms.util.dao.IMenuDao;
import com.byd.bms.util.model.BmsBaseMenu;
import com.byd.bms.util.service.IMenuService;
@Service
@DataSource("dataSourceMaster")
public class MenuServiceImpl implements IMenuService {
	@Resource(name="menuDao")
	private IMenuDao menuDao;
	@Override
	public List<BmsBaseMenu> getMenu() {
		// TODO Auto-generated method stub
		List<BmsBaseMenu> list= menuDao.getMenu();
		return list;
	}
}
