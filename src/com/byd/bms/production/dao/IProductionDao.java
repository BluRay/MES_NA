package com.byd.bms.production.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

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

	List<Map<String, Object>> queryStationList(Map<String, Object> condMap);

	void insertEcnHead(Map<String, Object> condMap);

	void batchInsertEcnItems(List<Map<String, Object>> item_list);

	void batchInsertItemBus(List<Map<String, Object>> item_bus_list);

	void batchInsertMaterial(List<Map<String, Object>> item_material_list);

	List<Map<String, Object>> queryEcnItemList(Map<String, Object> condMap);

	int queryEcnItemCount(Map<String, Object> condMap);

	List<Map<String, Object>> queryItemListByEcn(@Param(value = "ecn_id")String ecn_id);

	List<Map<String, Object>> queryEcnMaterialByItem(@Param(value = "ecn_item_id")String ecn_item_id);

	void updateEcnHead(Map<String, Object> condMap);

	void batchUpdateEcnItems(List<Map<String, Object>> item_list);

	void deleteMaterialByItem(@Param(value = "ecn_item_id")String ecn_item_id);

	void deleteEcnBusByItem(String ecn_item_id);

	void deleteEcnItem(String ecn_item_id);
	
	List<Map<String,Object>> queryEcnBusList(@Param(value = "ecn_item_id")String ecn_item_id);

	String queryMinEcnConfirmDate(String ecn_item_id);

	void updateEcnItem(Map<String, Object> condMap);

	void batchUpdateEcnBus(List<Map<String, Object>> bus_list);

	int queryUnQCBusCount(String ecn_item_id);
	
	List<Map<String,Object>> queryWorkshopStock(Map<String, Object> condMap);
	
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
	
	public List<Map<String, Object>> getBusNumberScanList(String bus_number);
	/**************************** tang jin end*********************************/
	
	public int insertAbnormity(Map<String,Object> conditionMap);
	public List<Map<String, Object>> getExceptionList(Map<String,Object> conditionMap);
	public int getExceptionCount(Map<String,Object> conditionMap);
	public int measuresAbnormity(Map<String,Object> conditionMap);

	public int getStationSquence(Map<String,Object> conditionMap);
	public List<Map<String, Object>> getMatReqProjectQty(Map<String,Object> conditionMap);
	public List<Map<String, Object>> getBusNumberProject(Map<String,Object> conditionMap);
	public List<Map<String, Object>> getBomListByProject(Map<String,Object> conditionMap);
	public List<Map<String, Object>> getLastStationInfo(Map<String,Object> conditionMap);
	public List<Map<String, Object>> getStationBusNumberProject(Map<String,Object> conditionMap);
	public int getLineDisCount(Map<String,Object> conditionMap);
	public int insertLineDistribution(Map<String,Object> conditionMap);

	public List<Map<String, Object>> getMaterialReception(Map<String,Object> conditionMap);
	public String getDistributionReceptionUser(Map<String,Object> conditionMap);
	public int getDistributionCount(Map<String,Object> conditionMap);
	public int updateLineDistributionReception(Map<String,Object> conditionMap);
	public int getLineInventoryQty(Map<String,Object> conditionMap);
	public int updateLineInventoryQty(Map<String,Object> conditionMap);
	public int insertLineInventory(Map<String,Object> conditionMap);
	
	public List<Map<String,String>> getProductionSearchBusinfo(String bus_number);

	public List<Map<String,Object>> queryEcnBusListByBusNo(@Param(value = "bus_number")String bus_number);

}
