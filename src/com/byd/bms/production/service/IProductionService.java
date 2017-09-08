package com.byd.bms.production.service;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.ModelMap;

import com.byd.bms.production.model.ProductionException;
public interface IProductionService {
	/*****************************xiong jianwu start  *****************************/
	public List getLineProcessList(Map<String,Object> condMap);
	
	List<Map<String,Object>> getProcessMonitorSelect(Map<String, Object> condMap);

	List<Map<String,Object>>  getKeyParts(Map<String, Object> condMap);

	public Map<String, Object> getBusInfo(String bus_number);

	public List<Map<String,Object>> getOrderConfigList(String order_config_id);

	@Transactional
	public Map<String, Object> scan(Map<String,Object> condMap,List partsList);

	@Transactional
	public void createProductionException(List<ProductionException> exceptionList,ModelMap model);
	
	public Map<String, Object> getBusInfoList(Map<String, Object> condMap);

	public void updateBusInfo(Map<String, Object> condMap, ModelMap model);

	public void getSupplyTotalCount(Map<String, Object> condMap, ModelMap model);

	public void saveUpdateWorkshopSupply(Map<String, Object> condMap,ModelMap model);

	public Map<String, Object> getWorkshopSupplyList(Map<String, Object> condMap);

	public void getPartsFinishCount(Map<String, Object> condMap, ModelMap model);

	public void saveUpdatePartsOnOffRecord(Map<String, Object> condMap,ModelMap model);

	public Map<String,Object> getPartsOnOffList(Map<String, Object> condMap);
	
	public Map<String,Object> getNextProcess(Map<String,Object> condMap);
	
	public List<Map<String,String>> getProductionSearchBusinfo(String bus_number);
	
	public List<Map<String,String>> getProductionSearchScan(String bus_number);
	
	public List<Map<String,String>> getNamePlateInfo(String bus_number);
	
	public List<Map<String,String>> getProductionSearchException(String bus_number);
	
	public List<Map<String,String>> getCertificationInfo(String bus_number);
	
	public List<Map<String,String>> getEcnTasksByBusNumber(String bus_number);
	
	public List<Map<String,String>> getQmTestCardList(String bus_number);
	
	public List<Map<String,String>> getKeyPartsList(String bus_number);

	public void getNameplatePrintList(Map<String, Object> conditionMap, ModelMap model);

	public void updateNameplatePrint(Map<String, Object> conditionMap, ModelMap model);

	public void getCertificationList(Map<String, Object> conditionMap, ModelMap model);

	public void transferDataToHGZSys(List<Map<String, Object>> buslist, ModelMap model);

	public void getSalaryModel(Map<String, Object> condMap, ModelMap model);

	public void getTeamStaffDetail(Map<String, Object> condMap, ModelMap model);

	public void workhourValidateBus(Map<String, Object> condMap, ModelMap model);

	public void workhourValidateRecordIn(Map<String, Object> condMap, ModelMap model);
	
	public void saveStaffHours_cal0(String str_staffHours, String is_customer, String edit_date,String editor_id,ModelMap model);

	public void saveStaffHours_cal1(String str_staffHours, String is_customer,String edit_date, String editor_id,ModelMap model);

	public void saveStaffHours_cal2(String str_staffHours, String edit_date, String editor_id,ModelMap model);

	public void saveStaffHours_cal3(String str_staffHours, String edit_date, String editor_id,ModelMap model);

	public void getStaffHoursDetail(String org_id, String bus_number, String wdate_start, String wdate_end,String status, ModelMap model);

	public void deleteStaffHours(Map<String, Object> condMap, ModelMap model);
	
	public void updateStaffHours_cal0(String str_staffHours,
			String is_customer, String edit_date, String editor_id,
			ModelMap model);

	public void updateStaffHours_cal1(String str_staffHours,
			String is_customer, String edit_date, String editor_id,
			ModelMap model);

	public void updateStaffHours_cal2(String str_staffHours, String edit_date,
			String editor_id, ModelMap model);

	public void updateStaffHours_cal3(String str_staffHours, String edit_date,
			String editor_id, ModelMap model);

	public void verifyStaffHours(Map<String, String> condMap,ModelMap model);
	
	/*****************************xiong jianwu end  *****************************/

	/******************* tangjin start**************************/
	
	public Map<String,Object> getVinPrintList(Map<String,Object> conditionMap);
	
	public int updateVinPrint(Map<String,Object> conditionMap);
	
	public int updateBusMotorNumber(Map<String, Object> buslist);
	
	public int updateVinMotorNumber(Map<String, Object> buslist);
	
	public List<Map<String,String>> getVinList(Map<String, Object> conditionMap);
	
	public List<Map<String,String>> getBusNumberByVin(Map<String, Object> conditionMap);//根据vin码查询BusNumber

	/*** 查询车号打印列表*/
	public Map<String,Object> getBusNoPrintList(Map<String, Object> conditionMap);
	/**工厂、订单、配置查询bus表中已分配的车号数量*/
	public int getOrderConfigDoneQty(Map<String, Object> conditionMap);
	/** 打印后更新车号表打印次数，打印人，打印时间，打印状态*/
	public int updateBusPrint(Map<String,Object> conditionMap);
	/**打印后更新bus表订单配置*/
	public int updateBusConfig(Map<String,Object> conditionMap);
	
	public List<Map<String,Object>> getOrderConfigList(Map<String,Object> conditionMap);
	
	public Map<String, Object> getWaitWorkTimeList(Map<String, Object> condMap);
	
	public int saveWaitWorkHourInfo(List<Map<String, Object>> swh_list);
	
    public int deleteWaitHourInfo(Map<String, Object> conditionMap);
	
	public int batchUpdateWaitPay(List<Map<String, Object>> swh_list);
	
	//临时派工类型
	public Map<String,Object> getTmpOrderTypeList(Map<String,Object> queryMap);
	public void editTmpOrderType(Map<String,Object> map);
	public void delTmpOrderType(List<String> ids);
	public int insertTmpOrderType(Map<String,Object> map);
	//额外临时库
	public Map<String,Object> getExtraWorkHourManagerList(Map<String,Object> queryMap);
	public int editExtraWorkHourManager(Map<String,Object> map);
	public int delExtraWorkHourManager(List<String> ids);
	public int insertExtraWorkHourManager(List<Map<String,Object>> list);
	//创建临时派工单
	public Map<String,Object> getCreateTmpOrderList(Map<String,Object> queryMap);
	public int editCreateTmpOrder(Map<String,Object> map);
	public int delCreateTmpOrder(String ids);
	public int insertCreateTmpOrder(Map<String, Object> map);
	public List<Map<String,Object>> queryTmpOrderProcedureList(Map<String,Object> map);
	public List<Map<String,Object>> queryAssignList(Map<String,Object> map);
	// 临时派工单查询
	public Map<String,Object> queryTmpOrderList(Map<String,Object> queryMap);
	/******************* tangjin end**************************/

	public List<Map<String,String>> getProductionSearch(Map<String,Object> queryMap);
	public List<Map<String,String>> getProductionWIPBusInfo(Map<String,Object> queryMap);
	public List<Map<String,String>> getProductionSearchCarinfo(Map<String,Object> queryMap);
	
	public int addRewards(List<Map<String, Object>> addList);
	public Map<String, Object> getRewardsList(Map<String,Object> queryMap);
	public void deleteRewards(Map map);
	public List<Map<String, Object>> getOrg(List<Map<String, Object>> conditionMap);
	public int insertRewards(List<Map<String, Object>> conditionMap);		//增加奖惩数据
	public Map<String, Object> getAttendanceList(Map<String,Object> queryMap);
	public int uoloadStaffAttendance(List<Map<String, Object>> addList);

	public Map<String, Object> getTmpOrderList(Map<String, Object> conditionMap);
	public Map<String, Object> getTmpOrderListForVerify(Map<String, Object> conditionMap);
	public int saveWorkHourInfo(List<Map<String, Object>> swh_list);
	public List<Map<String, String>> queryStaffTmpHours(Map<String, Object> conditionMap);
	public int deleteStaffTmpHourInfo(Map<String, Object> conditionMap);	
	public void verifyOrder(Map<String, Object> m);
	public void rejectOrder(Map<String, Object> m);
	public int batchUpdateWorkHour(List<Map<String, Object>> swh_list);
	public int saveTmpOrderProcedure(Map<String, Object> cmap);
	public int updateTmpOrder(Map<String, Object> cmap);
	public String caculateTmpSalary(Map<String, Object> conditionMap);
}
