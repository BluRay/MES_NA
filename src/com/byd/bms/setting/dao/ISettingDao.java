package com.byd.bms.setting.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import com.byd.bms.setting.model.BmsBaseBusType;
import com.byd.bms.setting.model.BmsBaseFactory;
import com.byd.bms.setting.model.BmsBaseFunction;
import com.byd.bms.setting.model.BmsBaseFunctionPermission;
import com.byd.bms.setting.model.BmsBaseLine;
import com.byd.bms.setting.model.BmsBaseProcess;
import com.byd.bms.setting.model.BmsBaseRole;
import com.byd.bms.setting.model.BmsBaseRolePermission;
import com.byd.bms.setting.model.BmsBaseStandardWorkgroup;
import com.byd.bms.setting.model.BmsBaseStation;
import com.byd.bms.setting.model.BmsBaseVinRule;
import com.byd.bms.setting.model.BmsBaseWorkshop;
import com.byd.bms.setting.model.BmsUserRole;
import com.byd.bms.util.model.BmsBaseUser;

@Repository(value="settingDao")
public interface ISettingDao {
	public List<BmsBaseRole> getRoleList();
	public List<BmsBaseFunction> getFunctionList();
	public List<BmsBaseRolePermission> getRolePermission(String role_id);
	public List<BmsBaseFunctionPermission> getBaseFunctionPermission(String role_id);
	public int addRole(BmsBaseRole role);
	public int delRoleFunction(@Param("role_id") String role_id,@Param("function_ids") String function_ids);
	public int addRoleFunction(@Param("role_id") String role_id,@Param("function_id") String function_id);
	public int delFunctionPermission(@Param("role_id") String role_id,@Param("permission_ids") String permission_ids);
	public int addFunctionPermission(@Param("role_id") String role_id,@Param("permission_id") String permission_id);
	public int addUser(BmsBaseUser user);
	public int editUser(BmsBaseUser user);
	public int delUser(BmsBaseUser user);
	public BmsBaseUser getUserById(@Param("id") String id);
	public int resetUserPass(BmsBaseUser user);
	public List<BmsBaseUser> getUserList(Map<String,Object> queryMap);
	public int getTotalUserCount(Map<String,Object> queryMap);
	public List<BmsUserRole> getUserRole(@Param("staff_number") String staff_number);
	public List<BmsUserRole> getOneUserRole(@Param("staff_number") String staff_number,@Param("role_id") String role_id);
	public int addUserRole(BmsUserRole userRole);
	public int addOneUserRole(BmsUserRole userRole);
	public int updateUserRole(BmsUserRole userRole);
	public int delUserRole(@Param("staff_number")String staff_number,@Param("roles")String roles);
	public int delOneUserRole(@Param("staff_number")String staff_number,@Param("role")String role);
	public List<Map<String,Object>> getPermissionByMap(Map<String,Object> queryMap);
	
	public List<Map<String,Object>> getOrgDataTreeList(Map<String,Object> queryMap);
	public List<Map<String,Object>> getOrgDataByParentId(Map<String,Object> queryMap);
	public int addOrgData(Map<String,Object> queryMap);
	public int editOrgData(Map<String,Object> queryMap);
	public int deleteOrgData(Map<String,Object> conditionMap);
	
	//工厂
	public List<BmsBaseFactory> getFactoryList(Map<String,Object> queryMap);
	public int getFactoryTotalCount(Map<String,Object> queryMap);
	public BmsBaseFactory getFactoryById(@Param("id") String id);
	public void updateFactory(BmsBaseFactory factory);
	public void deleteFactory(List ids);
	public int checkDeleteFactory(List ids);
	public int addFactory(BmsBaseFactory factory);
	
	//车间
	public List<BmsBaseWorkshop> getWorkshopList(Map<String,Object> queryMap);
	public List<BmsBaseWorkshop> getAllWorkshopList();
	public int getWorkshopTotalCount(Map<String,Object> queryMap);
	public int addWorkshop(BmsBaseWorkshop workshop);
	public void updateWorkshop(BmsBaseWorkshop workshop);
	public void deleteWorkshop(List ids);
	public int checkDeleteWorkshop(List ids);
	
	//线别
	public List<BmsBaseLine> getLineList(Map<String,Object> queryMap);
	public int getLineTotalCount(Map<String,Object> queryMap);
	public int addLine(BmsBaseLine line);
	public void updateLine(BmsBaseLine line);
	public void deleteLine(List ids);
	public int checkDeleteLine(List ids);
	
	//工位
	public List<BmsBaseStation> getStationList(Map<String,Object> queryMap);
	public int getStationTotalCount(Map<String,Object> queryMap);
	public int addStation(BmsBaseStation station);
	public void updateStation(BmsBaseStation station);
	public void deleteStation(List ids);
	
	//工序
	public List<BmsBaseProcess> getProcessList(Map<String,Object> queryMap);
	public int getProcessTotalCount(Map<String,Object> queryMap);
	public int addProcess(BmsBaseProcess process);
	public void updateProcess(BmsBaseProcess process);
	public void deleteProcess(List ids);
	public List<Map<String,Object>> queryProcessConfigList(Map<String, Object> condMap);
	public int queryProcessConfigCount(Map<String, Object> condMap);
	public List<Map<String, Object>> queryProcessListNoLine(Map<String, Object> condMap);
	public List<Map<String, Object>> queryProcessConfigDetailList( Map<String, Object> condMap);
	public List<Map<String, Object>> queryProcessListByFactory(Map<String, Object> condMap);
	public int insertProcessConfig(List<Map<String, Object>> process_list);
	public void deleteProcessConfig(Map<String, Object> condMap);
	
	//车间班组
	public List<BmsBaseStandardWorkgroup> getWorkgroupList(Map<String,Object> queryMap);
	public List<Map<String,Object>> getWorkshopTreeList(Map<String,Object> queryMap);
	public int getWorkgroupTotalCount(Map<String,Object> queryMap);
	public int addWorkgroup(BmsBaseStandardWorkgroup workgroup);
	public int updateWorkgroup(BmsBaseStandardWorkgroup workgroup);
	public void deleteWorkgroup(String id);
	
	//车型
	public List<BmsBaseBusType> getBusTypeList(Map<String,Object> queryMap);
	public int getBusTypeTotalCount(Map<String,Object> queryMap);
	public int addBusType(BmsBaseBusType busType);
	public void updateBusType(BmsBaseBusType busType);
	public BmsBaseBusType getBusTypeById(Map<String,Object> queryMap);
	// VIN生成规则
	public List<BmsBaseVinRule> getVinRuleList(Map<String,Object> queryMap);
	public int getVinRuleTotalCount(Map<String,Object> queryMap);	
	public int addVinRule(BmsBaseVinRule vinRule);
	public int updateVinRule(BmsBaseVinRule vinRule);
	public void deleteVinRule(List ids);

}
