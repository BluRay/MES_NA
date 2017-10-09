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

public interface IPlanService {
	public String checkImportPlanFactory(Map<String,Object> queryMap);
	public int savePlanMaster(ExcelModel excelModel,String userid);
	public Map<String,Object> getPlanMasterIndex(Map<String,Object> queryMap);

	public List<PlanMasterPlan> showPlanMasterList(Map<String,Object> queryMap);
	public int reVisionPlan(String factory_id,String factory_name, String order_no, String revision_str, String plan_month,String userId);
	
	public List<Map<String, String>> getPlanSerach(Map<String, Object> queryMap);
}
