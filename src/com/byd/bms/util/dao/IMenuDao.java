package com.byd.bms.util.dao;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.byd.bms.util.model.BmsBaseMenu;
@Repository(value="menuDao")
public interface IMenuDao {
	public List<BmsBaseMenu> getMenu();
}
