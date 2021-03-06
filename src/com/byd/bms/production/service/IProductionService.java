package com.byd.bms.production.service;

import java.util.List;
import java.util.Map;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.ModelMap;

public interface IProductionService {
	/*****************************xiong jianwu start  *****************************/
	public List getLineProcessList(Map<String,Object> condMap);
	
	List<Map<String,Object>> getStationMonitorSelect(Map<String, Object> condMap);
	
	List<Map<String,Object>>  getKeyParts(Map<String, Object> condMap);
	
	public Map<String, Object> getBusInfo(String bus_number);
	
	@Transactional
	public Map<String, Object> scan(Map<String,Object> condMap,List partsList);
	
	public Map<String,Object> getNextStation(Map<String,Object> condMap);

	public List<Map<String, Object>> getStationSelect(Map<String, Object> condMap);	
	
	@Transactional
	public void addEcnItems(Map<String, Object> condMap, ModelMap model);

	public void getEcnItemList(Map<String, Object> condMap, ModelMap model);

	public void getItemListByEcn(String ecn_id, ModelMap model);
	
	@Transactional
	public void updateEcnItems(Map<String, Object> condMap, ModelMap model);

	@Transactional
	public void deleteEcnItem(String ecn_item_id, ModelMap model);
	
	public void getEcnBusList(String ecn_item_id, ModelMap model);

	@Transactional
	public void confirmEcnItem(List<Map<String, Object>> bus_list, ModelMap model);
	
	@Transactional
	public void confirmEcnItem_QC(List<Map<String, Object>> bus_list, ModelMap model);
	
	public void getWorkshopStock(Map<String, Object> condMap, ModelMap model);
	
	public void getMonitorBusList(Map<String, Object> condMap, ModelMap model);

	public void saveUpdateParts(List<Map<String, Object>> parts_list,ModelMap model);
	
	/*****************************xiong jianwu end  *****************************/
	/*****************************tang jin start  *****************************/
    public Map<String, Object> getVinList(Map<String, Object> conditionMap);
	
	public int batchUpdateVin(List<Map<String,Object>> list);

	public Map<String, Object> getBusNumberList(Map<String, Object> conditionMap);
	/** 打印后更新车号表打印次数，打印人，打印时间，打印状态*/
	public int updateVinPrint(Map<String,Object> conditionMap);
	
	public Map<String, Object> getProjectBusNumberList(Map<String, Object> conditionMap);
	
	public List<Map<String,String>> getProductionSearchBusinfo(String bus_number);
	
	public void getEcnBusListByBusNo(String bus_number, ModelMap model);
	
	public void getBusNumberScanList(String bus_number, ModelMap model);
	
	public void getTechtaskListByBus(String bus_number, ModelMap model);
	
	public int followTechTaskByBus(Map<String,Object> conditionMap);
	/*****************************tang jin end  *****************************/
	
	public List<Map<String,Object>> getProcessMonitorSelect(Map<String, Object> condMap);
	public int insertAbnormity(Map<String, Object> conditionMap);
	public Map<String,Object> getExceptionList(Map<String,Object> queryMap);
	public int measuresAbnormity(Map<String, Object> conditionMap);
	
	public List<Map<String,Object>> getMaterialRequirement(Map<String, Object> condMap);
	public int printMaterialRequirement(Map<String, Object> conditionMap);
	public int getLineDisCount(Map<String,Object> conditionMap);
	public int insertLineDistribution(Map<String,Object> conditionMap);
	public List<Map<String, Object>> getMaterialReception(Map<String,Object> conditionMap);
	public String getDistributionReceptionUser(Map<String,Object> conditionMap);
	public int getDistributionCount(Map<String,Object> conditionMap);
	public int updateLineDistributionReception(Map<String,Object> conditionMap);
	public void updateLineInventory(Map<String,Object> conditionMap);
	public List<Map<String, Object>> getLineInventoryList(Map<String,Object> conditionMap);
	public int removeDistribution(Map<String,Object> conditionMap);
	public Map<String,Object> getLineInventoryMatList(Map<String,Object> conditionMap);

	
}
