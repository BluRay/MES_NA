package com.byd.bms.production.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import com.byd.bms.setting.model.BmsBaseFactory;
@Repository(value="productionDao")
public interface IProductionDao {
	/*****************************xiong jianwu start  *****************************/
	List queryLineProcessList(Map<String, Object> condMap);	

	List<Map<String, Object>> queryProcessMonitorList(Map<String, Object> condMap);

	List<Map<String, Object>> queryKeyParts(Map<String, Object> condMap);

	Map<String, Object> queryBusInfo(String bus_number);
	
	Map<String,Object> queryNextStation(Map<String, Object> condMap);//查询车辆当前扫描节点的下一个扫描工序

	int queryScanRecord(Map<String, Object> condMap);//查询车辆当前工序是否存在扫描记录
	
	Map<String, Object> queryLastScanNode(Map<String,Object> condMap);//查询车辆当前扫描节点的上一个扫描节点
	
	Map<String, Object> queryScanLastScanNode(Map<String,Object> condMap);//查询车辆当前扫描节点的上一个计划节点是否存在扫描记录
	
	void saveScanRecord(Map<String, Object> condMap);//保存扫描记录

	void updateBusProcess(Map<String, Object> condMap);//更新PLAN_BUS表的当前节点信息
	
	void updateBusPlanNodeDate(Map<String, Object> condMap);//更新BUS表节点扫描时间
	
	int saveParts(@Param(value = "parts_list") List parts_list);
	
	int updateParts(@Param(value = "parts_list")List parts_list);
	
	int queryWeldingOnlineCount(Map<String, Object> condMap);
	
	void updateProject(Map<String, Object> m);
	
	Map<String, Object> queryWarehouseInfo(Map<String, Object> condMap);

	Map<String, Object> queryScanNodeRecord(Map<String, Object> condMap);//查询节点是否扫描了
	
	/*****************************xiong jianwu end  *****************************/
    /**************************** tang jin start*********************************/
	public List<Map<String, Object>> getVinList(Map<String, Object> condMap);
	
	public int getVinTotalCount(Map<String, Object> condMap);
	
	public int batchUpdateVin(List<Map<String,Object>> list);
	
	public List<Map<String, Object>> getBusNumberList(Map<String, Object> condMap);
	
	public int getBusNumberTotalCount(Map<String, Object> condMap);
	/*** 打印后更新VIN表打印次数，打印人，打印时间，打印状态*/
	public int updateVinPrint(Map<String,Object> conditionMap);
	
    public List<Map<String, Object>> getProjectBusNumberList(Map<String, Object> condMap);
	
	public int getProjectBusNumberCount(Map<String, Object> condMap);
	/**************************** tang jin end*********************************/
	
	public int insertAbnormity(Map<String,Object> conditionMap);
}
