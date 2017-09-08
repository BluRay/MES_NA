package com.byd.bms.plan.service;

import java.util.List;
import java.util.Map;
import com.byd.bms.util.ExcelModel;
import com.byd.bms.plan.model.PlanBus;
import com.byd.bms.plan.model.PlanBusDispatchPlan;
import com.byd.bms.plan.model.PlanConfigIssedQty;
import com.byd.bms.plan.model.PlanIssuance;
import com.byd.bms.plan.model.PlanIssuanceCount;
import com.byd.bms.plan.model.PlanIssuanceTotal;
import com.byd.bms.plan.model.PlanMasterPlan;
import com.byd.bms.plan.model.PlanPause;
import com.byd.bms.plan.model.PlanProductionPlan;
import com.byd.bms.production.model.ProductionException;

public interface IPlanService {
	public String checkImportPlanFactory(Map<String,Object> queryMap);
	public int savePlanMaster(ExcelModel excelModel,String userid);
	public Map<String,Object> getPlanMasterIndex(Map<String,Object> queryMap);
	public List<PlanMasterPlan> showPlanMasterList(Map<String,Object> queryMap);
	public List<Map<String,String>> getPlanIssed(Map<String,Object> queryMap);
	public int reVisionPlan(String factory_id,String order_no,String revision_str,String plan_month,String userId);
	public List<Map<String,String>> checkPlanIssuanceList(Map<String,Object> queryMap);
	public List<PlanIssuance> getPlanIssuanceList(Map<String,Object> queryMap);
	public List<PlanIssuanceTotal> getPlanIssuanceTotal(Map<String,Object> queryMap);
	public List<PlanProductionPlan> getProductionPlanIssuanceList(Map<String,Object> queryMap);
	public List<PlanIssuanceCount> getPlanIssuanceCount(Map<String,Object> queryMap);
	public List<PlanIssuanceCount> getDatePlanIssuanceCount(Map<String,Object> queryMap);
	public int getPlanConfigQty(Map<String,Object> queryMap);
	public List<PlanConfigIssedQty> getPlanConfigIssedQty(Map<String,Object> queryMap);//获取当前配置已发布数量
	public int issuancePlanSubmit(String curTime,String edit_user,String issuance_date,int factory_id,String issuance_str);
	public int addPause(List<PlanPause> pauseList);
	public Map<String,Object> getPauseList(Map<String,Object> queryMap);
	public int updatePauseInfo(PlanPause pause);
	public Map<String, Object> getExceptionList(Map<String,Object> queryMap);
	public int updateExceptionInfo(ProductionException exception);
	public int confirmException(ProductionException exception);
	public Map<String,Object> getPlanVinList(Map<String,Object> queryMap);
	public Map<String,Object> getGenerateVin(Map<String,Object> queryMap);
	public Map<String,Object> getVinPrefix(Map<String,Object> queryMap);
	public int checkFactoryOrder(Map<String,Object> queryMap);
	public List<String> selectBusByMotorVin(Map<String,Object> queryMap); 			//根据VIN/左右电机查询车号，校验是否重复绑定
	public int importVin(List<Map<String,Object>> vin_list);
	public int BingingVinMotor(Map<String,Object> queryMap);
	public int checkBusNumber(Map<String,Object> queryMap);
	public int checkBingingVin(Map<String,Object> queryMap);
	public List<Map<String,String>> getBusTransferOutList(Map<String,Object> queryMap);
	public List<Map<String,String>> getBusTransferInList(Map<String,Object> queryMap);
	public int busTransferOut(Map<String,Object> queryMap);
	public int busTransferIn(Map<String,Object> queryMap);
	public List<Map<String,String>> getBusTransferHisList(Map<String,Object> queryMap);
	public List<Map<String,String>> checkProductionPlan(Map<String,Object> queryMap);
	public List<Map<String,String>> getPlanSerach(Map<String,Object> queryMap);	
	public Map<String,Object> showPlanSearchDetail(Map<String,Object> queryMap);
	public int addDispatchPlan(PlanBusDispatchPlan planBusDispatchPlan);
	public Map<String,Object> getDispatchPlanList(Map<String,Object> queryMap);
	public int getOrderDispatchQty(int orderId);
	public int editDispatchPlan(PlanBusDispatchPlan planBusDispatchPlan);
	public List<Map<String,String>> getOrderDispatchList(Map<String, Object> conditionMap);//根据订单编号查询该订单下附件交接记录
	public Map<String,Object> saveOrderDispatchRecord(String curTime,String edit_user,String factory_id,String form_str,String cardNumber,String receiver);
	public PlanBus getBusInfoByBusNo(Map<String, Object> conditionMap);
	public List<Map<String,Object>> getBusToolList();
	public Map<String,Object> saveDispatchRecord(String curTime,String edit_user,String form_str,String plan_status);
	public Map<String,Object> saveDispatchRecordKD(Map<String, Object> conditionMap);
	public Map<String, Object> busDispatchQuery(Map<String, Object> conditionMap);
	public Map<String, Object> busDispatchDescQuery(Map<String, Object> conditionMap);
}
