package com.byd.bms.report.dao;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;
@Repository(value="reportDao")
public interface IReportDao {

	List<Map<String, Object>> queryFactoryOutputYear(Map<String, Object> condMap);
	
	public List<Map<String, Object>> queryFactoryOutputReportData(List<Map<String, Object>> conditionMap);
	public List<Map<String, Object>> queryFactoryZzjOutputReportData(List<Map<String, Object>> conditionMap);
	public List<Map<String, Object>> queryFactoryBjOutputReportData(List<Map<String, Object>> conditionMap);

	List<Map<String, Object>> queryOnlineAndOfflineData(Map<String, Object> condMap);

	List<Map<String, Object>> queryFactoryPlanRateList(Map<String, Object> condMap);

	List<Map<String, Object>> queryPlanNodeOrderList(Map<String, Object> condMap);

	List<Map<String, Object>> queryExceptionList(Map<String, Object> condMap);
	
	//public List<Map<String,String>> getPlanRate(Map<String,Object> queryMap);  //工厂计划达成率报表
	public List<Map<String,Object>> queryPlanQty(Map<String,Object> conditionMap);
	public List<Map<String,String>> getPlanSearchRealCount(List queryMapList);		//查询订单完成实际完成数[订单查询页面]
	public int getPlanPartsRealCount(Map<String,Object> conditionMap);
	public int getPlanZzjRealCount(Map<String,Object> conditionMap);
	
	List<Map<String, Object>> queryWorkshopBusInfoData(Map<String, Object> condMap);
	
	List<Map<String, Object>> queryHZoneData(Map<String, Object> condMap);
	
	List<Map<String, Object>> getStationMaxNode(String plant);
	
	List<Map<String, Object>> getStationMinNode(String plant);

}
