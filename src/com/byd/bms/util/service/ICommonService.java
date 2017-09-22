package com.byd.bms.util.service;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.springframework.ui.ModelMap;

import com.byd.bms.util.model.BmsBaseProcess;

public interface ICommonService {

	List<Map<String,Object>> getOrderFuzzySelect(Map<String, Object> condMap);

	List<Map<String,Object>> getFactorySelect(Map<String, Object> condMap);
	
	List<Map<String,Object>> getFactorySelectAuth(Map<String, Object> condMap);
	List<Map<String,Object>> getAllFactorySelect(Map<String, Object> condMap);

	List<Map<String,Object>> getBusTypeSelect();

	List<Map<String,Object>> getKeysSelect(String string);
	
	List<Map<String,Object>> getDepartmentByFactory(String factory_id);
	
	List<String> getAllRoleAuthority();
	
	List<String> getRoleAuthority(String staff_number);
	
	List<Map<String,Object>> getWorkshopSelect(Map<String,Object> condMap);
	
	List<Map<String,Object>> getWorkshopSelectAuth(Map<String,Object> condMap);
	
	public List<Map<String,String>> getAllReasonType();

	List<Map<String,Object>> getLineSelect();
	
	List<Map<String,Object>> getLineSelectAuth(Map<String, Object> condMap);

	List<BmsBaseProcess> queryProcessList(Map<String, Object> condMap);
	
	List<Map<String,String>> getWorkshopSelect_Key();

	List<Map<String,Object>> getOrderConfigSelect(String order_id);
	
	public List<Map<String,String>> getPartsSelect(String parts);

	List<Map<String, String>> getBusNumberList(@Param(value="bus_input") String bus_input);
	
	List<Map<String,Object>> getWorkgroupSelect(Map<String,Object> condMap);
	
	List<Map<String,Object>> getWorkgroupSelectAll(Map<String,Object> condMap);
	
	public List<Map<String,String>> getUserInfoByCard(String string);//刷厂牌获取用户信息
	
	public void getStaffNameByNumber(String staff_number,ModelMap model);
	
	List<Map<String,Object>> getStationSelect(Map<String,Object> condMap);

	/**
	 * @author xiong.jianwu
	 * @param actYear
	 * @param model 
	 */
	void getIndexOrderData(String actYear, ModelMap model);
	/**
	 * @author xiong.jianwu
	 * @param condMap
	 * @param model
	 */
	void getIndexFactoryDailyData(Map<String, Object> condMap, ModelMap model);
	

    Map<String,Object> getTaskList(Map<String, Object> condMap);
	
	public int createTask(String task_type,String count,String param,String factoryCode,String workshop_name);
	
	public int createTask(String task_name,Map<String,Map<String,Object>> taskMap);
	
	public int updateTask(String task_type,String finish_count,String workshop_name);
	
	public int updateTask(String task_name,Map<String,Map<String,Object>> taskMap);

	/**
	 * @author xiong.jianwu
	 * @param factory_id
	 * @param model
	 */
	void getIndexFactoryPrdOrdData(String factory_id, ModelMap model);
	/**
	 * @author xiong.jianwu
	 * @param actYear
	 * @param model
	 */
	void getIndexOutputData(String actYear, ModelMap model);
	/**
	 * @author xiong.jianwu
	 * @param factory_id
	 * @param model
	 */
	void getIndexExceptionData(String factory, ModelMap model);
	/**
	 * @author xiong.jianwu
	 * @param model
	 */
	void getIndexStaffCountData(ModelMap model);
	/**
	 * @author xiong.jianwu
	 * @param conditionMap
	 * @param model
	 */
	void getProductionIndexData(Map<String, Object> conditionMap, ModelMap model);
	/**
	 * @author xiong.jianwu
	 * @param conditionMap
	 * @param model
	 */
	void getMonitorBoardInfo(Map<String, Object> conditionMap, ModelMap model);
	/**
	 * @author xiong.jianwu
	 * @param conditionMap
	 * @param model
	 */
	void getOrgAuthTree(Map<String, Object> conditionMap, ModelMap model);
	/**
	 * @author xiong.jianwu
	 * @param condMap
	 * @param model
	 */
	void getSubmitSalary(Map<String, Object> condMap, ModelMap model);
	
	void getBasePrice(Map<String, Object> condMap, ModelMap model);
	
	public List<Map<String,String>> queryChildOrgList(String parentOrgId);//根据父节点名称查找下一级组织列表
	public List<Map<String,String>> queryStaffInfo(Map<String, Object> conditionMap);//查询员工信息

	List<Map<String,Object>> getTeamSelect(Map<String, Object> condMap);
	/**
	 * @author xiong.jianwu
	 * 查询用户角色列表
	 * @param staff_number
	 * @param model
	 */
	void getRoleListAuth(String staff_number, ModelMap model);
}
