package com.byd.bms.plan.dao;

import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Repository;

import com.byd.bms.order.model.BmsOrder;
import com.byd.bms.plan.model.PlanBus;
import com.byd.bms.plan.model.PlanBusDispatchPlan;
import com.byd.bms.plan.model.PlanBusNumber;
import com.byd.bms.plan.model.PlanBusTransfer;
import com.byd.bms.plan.model.PlanConfigIssedQty;
import com.byd.bms.plan.model.PlanIssuance;
import com.byd.bms.plan.model.PlanIssuanceCount;
import com.byd.bms.plan.model.PlanIssuanceTotal;
import com.byd.bms.plan.model.PlanMasterPlan;
import com.byd.bms.plan.model.PlanPause;
import com.byd.bms.plan.model.PlanProductionPlan;
import com.byd.bms.plan.model.PlanVIN;
import com.byd.bms.util.model.BmsBaseOperateChangeLog;

@Repository(value="planDao")
public interface IPlanDao {
	public String checkImportPlanFactory(Map<String,Object> queryMap);
	public int insertPlanMaster(PlanMasterPlan masterPlan);
	public List<Map<String,Object>> getPlanMasterIndex(Map<String,Object> queryMap);
	public int getPlanMasterCount(Map<String,Object> queryMap);
	public int deleteProductionPlan(Map<String,Object> queryMap);
	public int deleteOneProductionPlan(Map<String,Object> queryMap);
	public int insertProductionPlan(Map<String,Object> queryMap);
	public int insertOneProductionPlan(Map<String,Object> queryMap);

	public List<PlanMasterPlan> getPlanMasterList(Map<String,Object> queryMap);
	public int updatePlanMasterInfo(PlanMasterPlan masterPlan);
	public int insertOperateChangeLog(BmsBaseOperateChangeLog changLog);
	
	public List<Map<String,String>> getPlanSerach(Map<String,Object> queryMap);
	public List<Map<String,String>> getPlanOrderList(Map<String,Object> queryMap);
	public List<Map<String,String>> getPlanSearchPlanQty(Map<String,Object> queryMap);
	public int getPlanSearchRealQty(Map<String,Object> queryMap);
	public int getPlanSearchTotalMonthPlanQty(Map<String,Object> queryMap);
	public int getPlanSearchTotalRealQty(Map<String,Object> queryMap);
	
}
