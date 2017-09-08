package com.byd.bms.report.service;

import java.util.List;
import java.util.Map;

import org.springframework.ui.ModelMap;

public interface IReportService {
	/**
	 * 获取工厂年度产量数据
	 * @author xiong.jianwu
	 * @param condMap
	 * @param model
	 */
	void getFactoryOutputYear(Map<String,Object> condMap,ModelMap model);
	// 焊装、底盘上下线完成情况
	void getOnlineAndOfflineData(Map<String,Object> condMap,ModelMap model);
	
	public List<Map<String, Object>> showFactoryOutputReportData(Map<String, Object> queryMap);
	/**
	 * 获取工厂月计划达成数据
	 * @author xiong.jianwu
	 * @param condMap
	 * @param model
	 */
	void getFactoryPlanRateData(Map<String, Object> condMap, ModelMap model);
	
	public List<Map<String,Object>> queryPlanQty(Map<String,Object> conditionMap);
	
	public List<Map<String,String>> getPlanSearchRealCount(List queryMapList);		//查询订单完成实际完成数[订单查询页面]
	
	public int getPlanPartsRealCount(Map<String,Object> conditionMap);
	
	public int getPlanZzjRealCount(Map<String,Object> conditionMap);
	
}
