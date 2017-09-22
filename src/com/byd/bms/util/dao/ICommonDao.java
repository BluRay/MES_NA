package com.byd.bms.util.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import com.byd.bms.util.model.BmsBaseProcess;
import com.byd.bms.util.model.BmsBaseTask;

@Repository(value="commonDao")
public interface ICommonDao {

	List<Map<String, Object>> queryOrderList(Map<String,Object> condMap);

	List<Map<String, Object>> queryFactoryList(Map<String, Object> condMap);
	
	List<Map<String,Object>> queryFactoryListAuth(Map<String, Object> condMap);
	List<Map<String,Object>> queryAllFactoryList(Map<String, Object> condMap);

	List<Map<String, Object>> queryBusTypeList();
	
	List<Map<String, Object>> queryDepartmentByFactory(String factory_id);

	List<Map<String, Object>> queryKeysList(String keyCode);
	
	List<String> getAllRoleAuthority();
	
	List<String> getRoleAuthority(String staff_number);
	
	List<Map<String, Object>> queryWorkshopList(Map<String,Object>condMap);
	
	List<Map<String, Object>> queryTeamList(Map<String,Object>condMap);
	
	List<Map<String, Object>> queryWorkshopListAuth(Map<String,Object>condMap);
	
	public List<Map<String,String>> getAllReasonType();

	List<Map<String, Object>> queryLineList();

	List<Map<String, Object>> queryLineListAuth(Map<String, Object> condMap);

	List<Map<String, Object>> queryProcessMonitorList(Map<String, Object> condMap);
	
	List<BmsBaseProcess> queryProcessList(Map<String, Object> condMap);
	
	public List<Map<String,String>> getWorkshopSelect_Key();

	List<Map<String, Object>> queryOrderConfigList(@Param("order_id") String order_id);
	
	public List<Map<String,String>> getPartsSelect(String parts);

	List<Map<String, String>> queryBusNumberList(String bus_input);
	
	List<Map<String,Object>> queryWorkgroupList(Map<String,Object>condMap);
	List<Map<String,Object>> queryWorkshopStationList(Map<String,Object>condMap);
	
	List<Map<String,Object>> queryWorkgroupListAll(Map<String,Object>condMap);
	
	public List<Map<String,String>> getUserInfoByCard(String string);//刷厂牌获取用户信息

	Map<String, String> queryIndexOrderData(@Param("actYear") String actYear);
	
	List<Map<String,Object>> queryIndexFactoryDailyData(Map<String,Object>condMap);
	
	List<Map<String,Object>> queryTaskList(Map<String,Object>condMap);
	
	List<Map<String, Object>> queryTaskType(Map<String,Object>condMap);
	
	public int addTask(Map map);
	
	public int updateTask(Map map);

	List<Map<String, Object>> queryIndexFactoryPrdOrdData(@Param("factory_id") String factory_id);

	List<Map<String, Object>> queryIndexOutputData_Bustype(@Param("actYear")String actYear);
	
	List<Map<String, Object>> queryIndexOutputData_Factory(@Param("actYear")String actYear);

	List<Map<String, Object>> queryIndexExceptionData(@Param("factory") String factory);
	
	String getStaffNameByNumber(String staff_number);

	List<Map<String, Object>> queryIndexStaffCountData();

	List<Map<String, Object>> queryIndexStaffCountData_Factory();

	List<Map<String, Object>> queryProductionIndexData(String factoryId);

	List<Map<String, Object>> queryProductionIndexData( Map<String, Object> condMap);

	List<Map<String, Object>> getIndexWorkshopProduction(Map<String, Object> conditionMap);

	List<Map<String, Object>> getIndexExceptionList(Map<String, Object> conditionMap);

	List<Map<String, Object>> queryIndexDpuData(Map<String, Object> conditionMap);

	List<Map<String, Object>> getProductionSearch(Map<String, Object> conditionMap);

	List<Map<String, Object>> queryIndexPassRateData(Map<String, Object> conditionMap);

	List<Map<String, Object>> getPartsBalance(Map<String, Object> conditionMap);

	List<Map<String, Object>> getPauseList(Map<String, Object> conditionMap);
	
	List<Map<String,Object>> getOrgAuthTree(Map<String, Object> conditionMap);//获取权限树
	
	List<Map<String,Object>> querySubmitSalary(Map<String,Object> condMap);
	
	List<Map<String,Object>> getBasePrice(Map<String,Object> condMap);
	
	public List<Map<String,String>> queryChildOrgList(String parentOrgId);//根据父节点名称查找下一级组织列表
	public List<Map<String,String>> queryStaffInfo(Map<String, Object> conditionMap);//查询员工信息

	List<Map<String, Object>> queryRoleListAuth(@Param("staff_number")String staff_number);
}
