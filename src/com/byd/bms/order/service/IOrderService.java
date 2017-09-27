package com.byd.bms.order.service;

import java.util.List;
import java.util.Map;

import net.sf.json.JSONArray;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.ModelMap;

import com.byd.bms.order.model.BmsOrder;
import com.google.gson.JsonArray;

public interface IOrderService {
	public Map<String,Object> getOrderListPage(Map<String,Object> condMap);
	public List getOrderDetailList(Map<String, Object> conditionMap);
	@Transactional
	public void editOrder(BmsOrder order);
	public Map<String,Object> getOrderByNo(Map<String,Object> queryMap);
	public String getOrderSerial(String year);
	@Transactional
	public void createOrder(BmsOrder order);
	public List getBusNumberByOrder(Map<String, Object> conditionMap);
	public ModelMap getOrderQueryData(Map<String, Object> condMap);
	// 海外MES 
	public Map<String,Object> getProjectBomList(Map<String,Object> condMap);
	public int saveBomInfo(Map<String,Object> condMap);
	// 根据project_no查询当前Max version的BOM Item数据
	public Map<String,Object> getBomItemList(Map<String,Object> condMap);
	public Map<String, Object> getBomCompareList(Map<String, Object> condMap);
	public void getBusInProcess(String project_id, ModelMap model);
	public ModelMap getProjectQueryData(Map<String, Object> condMap);
	public List getBusNumberByProject(Map<String, Object> conditionMap);
}
