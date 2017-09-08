package com.byd.bms.plan.service.impl;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.byd.bms.order.model.BmsOrder;
import com.byd.bms.plan.dao.IPlanDao;
import com.byd.bms.plan.model.PlanMasterPlan;
import com.byd.bms.plan.model.PlanPause;
import com.byd.bms.plan.model.PlanProductionPlan;
import com.byd.bms.plan.model.PlanVIN;
import com.byd.bms.plan.model.PlanBus;
import com.byd.bms.plan.model.PlanBusDispatchPlan;
import com.byd.bms.plan.model.PlanBusNumber;
import com.byd.bms.plan.model.PlanBusTransfer;
import com.byd.bms.plan.model.PlanConfigIssedQty;
import com.byd.bms.plan.model.PlanIssuance;
import com.byd.bms.plan.model.PlanIssuanceCount;
import com.byd.bms.plan.model.PlanIssuanceTotal;
import com.byd.bms.plan.model.PlanMasterIndex;
import com.byd.bms.plan.service.IPlanService;
import com.byd.bms.production.model.ProductionException;
import com.byd.bms.util.DataSource;
import com.byd.bms.util.ExcelModel;
import com.byd.bms.util.model.BmsBaseOperateChangeLog;

@Service
@DataSource("dataSourceMaster")
public class PlanServiceImpl implements IPlanService {
	static Logger logger = Logger.getLogger("PLAN");
	private static final Map<String,String> vinYearMap=new HashMap<String,String>();
	private static final Map<String,Integer> vinCharMap=new HashMap<String,Integer>();
	private static final Map<Integer,Integer> weightMap=new HashMap<Integer,Integer>();
	static{
		vinYearMap.put("2015", "F");vinYearMap.put("2016", "G");vinYearMap.put("2017", "H");
		vinYearMap.put("2018", "J");vinYearMap.put("2019", "K");vinYearMap.put("2020", "L");
		vinYearMap.put("2021", "M");vinYearMap.put("2022", "N");vinYearMap.put("2023", "P");
		vinYearMap.put("2024", "R");vinYearMap.put("2025", "S");vinYearMap.put("2026", "T");
		
		vinCharMap.put("A", 1);vinCharMap.put("B", 2);vinCharMap.put("C", 3);
		vinCharMap.put("D", 4);vinCharMap.put("E", 5);vinCharMap.put("F", 6);
		vinCharMap.put("G", 7);vinCharMap.put("H", 8);vinCharMap.put("J", 1);
		vinCharMap.put("K", 2);vinCharMap.put("L", 3);vinCharMap.put("M", 4);
		vinCharMap.put("N", 5);vinCharMap.put("P", 7);vinCharMap.put("R", 9);
		vinCharMap.put("S", 2);vinCharMap.put("T", 3);vinCharMap.put("U", 4);
		vinCharMap.put("V", 5);vinCharMap.put("W", 6);vinCharMap.put("X", 7);
		vinCharMap.put("Y", 8);vinCharMap.put("Z", 9);vinCharMap.put("0", 0);
		vinCharMap.put("1", 1);vinCharMap.put("2", 2);vinCharMap.put("3", 3);
		vinCharMap.put("4", 4);vinCharMap.put("5", 5);vinCharMap.put("6", 6);
		vinCharMap.put("7", 7);vinCharMap.put("8", 8);vinCharMap.put("9", 9);
		
		weightMap.put(1, 8);weightMap.put(2, 7);weightMap.put(3, 6);weightMap.put(4, 5);
		weightMap.put(5, 4);weightMap.put(6, 3);weightMap.put(7, 2);weightMap.put(8, 10);
		weightMap.put(10, 9);weightMap.put(11, 8);weightMap.put(12, 7);weightMap.put(13, 6);
		weightMap.put(14, 5);weightMap.put(15, 4);weightMap.put(16, 3);weightMap.put(17, 2);
		
	}
	@Resource(name="planDao")
	private IPlanDao planDao;
	
	@Override
	public String checkImportPlanFactory(Map<String, Object> queryMap) {
		return planDao.checkImportPlanFactory(queryMap);
	}

	@Override
	@Transactional
	public int savePlanMaster(ExcelModel excelModel,String userid) {
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Date dd = new Date();
		String curTime = df.format(dd);
		int lineCount = excelModel.getData().size();
		int result = 0;
		String order_no = "";		//订单编号 同一个文件只能导入一个订单
		String factory_name = "";
		String plan_month = "";
		for(int i=0;i<lineCount;i++){
			if (i==0){
				order_no = excelModel.getData().get(i)[0].toString().trim();
				factory_name = excelModel.getData().get(i)[1].toString().trim();
				plan_month = excelModel.getData().get(i)[3].toString().trim();
			}
			PlanMasterPlan newMasterPlan = new PlanMasterPlan();
			newMasterPlan.setVersion(new SimpleDateFormat("yyyyMMddHHmmss").format(dd));
			newMasterPlan.setOrder_no(order_no);
			newMasterPlan.setFactory_name(factory_name);
			newMasterPlan.setPlan_code_keyname(excelModel.getData().get(i)[2].toString().trim());
			newMasterPlan.setPlan_month(plan_month);
			newMasterPlan.setFlag("0");
			if (!excelModel.getData().get(i)[4].toString().trim().equals("")) newMasterPlan.setD1(Integer.parseInt(excelModel.getData().get(i)[4].toString().trim()));
			if (!excelModel.getData().get(i)[5].toString().trim().equals("")) newMasterPlan.setD2(Integer.parseInt(excelModel.getData().get(i)[5].toString().trim()));
			if (!excelModel.getData().get(i)[6].toString().trim().equals("")) newMasterPlan.setD3(Integer.parseInt(excelModel.getData().get(i)[6].toString().trim()));
			if (!excelModel.getData().get(i)[7].toString().trim().equals("")) newMasterPlan.setD4(Integer.parseInt(excelModel.getData().get(i)[7].toString().trim()));
			if (!excelModel.getData().get(i)[8].toString().trim().equals("")) newMasterPlan.setD5(Integer.parseInt(excelModel.getData().get(i)[8].toString().trim()));
			if (!excelModel.getData().get(i)[9].toString().trim().equals("")) newMasterPlan.setD6(Integer.parseInt(excelModel.getData().get(i)[9].toString().trim()));
			if (!excelModel.getData().get(i)[10].toString().trim().equals("")) newMasterPlan.setD7(Integer.parseInt(excelModel.getData().get(i)[10].toString().trim()));
			if (!excelModel.getData().get(i)[11].toString().trim().equals("")) newMasterPlan.setD8(Integer.parseInt(excelModel.getData().get(i)[11].toString().trim()));
			if (!excelModel.getData().get(i)[12].toString().trim().equals("")) newMasterPlan.setD9(Integer.parseInt(excelModel.getData().get(i)[12].toString().trim()));
			if (!excelModel.getData().get(i)[13].toString().trim().equals("")) newMasterPlan.setD10(Integer.parseInt(excelModel.getData().get(i)[13].toString().trim()));

			if (!excelModel.getData().get(i)[14].toString().trim().equals("")) newMasterPlan.setD11(Integer.parseInt(excelModel.getData().get(i)[14].toString().trim()));
			if (!excelModel.getData().get(i)[15].toString().trim().equals("")) newMasterPlan.setD12(Integer.parseInt(excelModel.getData().get(i)[15].toString().trim()));
			if (!excelModel.getData().get(i)[16].toString().trim().equals("")) newMasterPlan.setD13(Integer.parseInt(excelModel.getData().get(i)[16].toString().trim()));
			if (!excelModel.getData().get(i)[17].toString().trim().equals("")) newMasterPlan.setD14(Integer.parseInt(excelModel.getData().get(i)[17].toString().trim()));
			if (!excelModel.getData().get(i)[18].toString().trim().equals("")) newMasterPlan.setD15(Integer.parseInt(excelModel.getData().get(i)[18].toString().trim()));
			if (!excelModel.getData().get(i)[19].toString().trim().equals("")) newMasterPlan.setD16(Integer.parseInt(excelModel.getData().get(i)[19].toString().trim()));
			if (!excelModel.getData().get(i)[20].toString().trim().equals("")) newMasterPlan.setD17(Integer.parseInt(excelModel.getData().get(i)[20].toString().trim()));
			if (!excelModel.getData().get(i)[21].toString().trim().equals("")) newMasterPlan.setD18(Integer.parseInt(excelModel.getData().get(i)[21].toString().trim()));
			if (!excelModel.getData().get(i)[22].toString().trim().equals("")) newMasterPlan.setD19(Integer.parseInt(excelModel.getData().get(i)[22].toString().trim()));
			if (!excelModel.getData().get(i)[23].toString().trim().equals("")) newMasterPlan.setD20(Integer.parseInt(excelModel.getData().get(i)[23].toString().trim()));

			if (!excelModel.getData().get(i)[24].toString().trim().equals("")) newMasterPlan.setD21(Integer.parseInt(excelModel.getData().get(i)[24].toString().trim()));
			if (!excelModel.getData().get(i)[25].toString().trim().equals("")) newMasterPlan.setD22(Integer.parseInt(excelModel.getData().get(i)[25].toString().trim()));
			if (!excelModel.getData().get(i)[26].toString().trim().equals("")) newMasterPlan.setD23(Integer.parseInt(excelModel.getData().get(i)[26].toString().trim()));
			if (!excelModel.getData().get(i)[27].toString().trim().equals("")) newMasterPlan.setD24(Integer.parseInt(excelModel.getData().get(i)[27].toString().trim()));
			if (!excelModel.getData().get(i)[28].toString().trim().equals("")) newMasterPlan.setD25(Integer.parseInt(excelModel.getData().get(i)[28].toString().trim()));
			if (!excelModel.getData().get(i)[29].toString().trim().equals("")) newMasterPlan.setD26(Integer.parseInt(excelModel.getData().get(i)[29].toString().trim()));
			if (!excelModel.getData().get(i)[30].toString().trim().equals("")) newMasterPlan.setD27(Integer.parseInt(excelModel.getData().get(i)[30].toString().trim()));
			if (!excelModel.getData().get(i)[31].toString().trim().equals("")) newMasterPlan.setD28(Integer.parseInt(excelModel.getData().get(i)[31].toString().trim()));
			if (!excelModel.getData().get(i)[32].toString().trim().equals("")) newMasterPlan.setD29(Integer.parseInt(excelModel.getData().get(i)[32].toString().trim()));
			if (!excelModel.getData().get(i)[33].toString().trim().equals("")) newMasterPlan.setD30(Integer.parseInt(excelModel.getData().get(i)[33].toString().trim()));

			if (!excelModel.getData().get(i)[34].toString().trim().equals("")) newMasterPlan.setD31(Integer.parseInt(excelModel.getData().get(i)[34].toString().trim()));
			newMasterPlan.setCreator_id(Integer.parseInt(userid));
			newMasterPlan.setCreate_date(curTime);
			
			result += planDao.insertPlanMaster(newMasterPlan);
		}		
		return result;
	}

	@Override
	public Map<String, Object> getPlanMasterIndex(Map<String, Object> queryMap) {
		int totalCount=0;
		List<PlanMasterIndex> datalist = planDao.getPlanMasterIndex(queryMap);
		totalCount = planDao.getPlanMasterCount(queryMap);
		Map<String, Object> result = new HashMap<String,Object>();
		result.put("draw", queryMap.get("draw"));
		result.put("recordsTotal", totalCount);
		result.put("recordsFiltered", totalCount);
		result.put("data", datalist);
		return result;
	}

	@Override
	@DataSource("dataSourceSlave")
	public List<PlanMasterPlan> showPlanMasterList(Map<String, Object> queryMap) {
		List<PlanMasterPlan> datalist = planDao.getPlanMasterList(queryMap);
		return datalist;
	}

	@Override
	public List<Map<String, String>> getPlanIssed(Map<String, Object> queryMap) {
		List<Map<String,String>> datalist = planDao.getPlanIssed(queryMap);
		return datalist;
	}

	@Override
	public int reVisionPlan(String factory_id, String order_no, String revision_str, String plan_month,String userId) {
		List<PlanMasterPlan> datalist=new ArrayList<PlanMasterPlan>();
		//复制指定工厂ID指定订单编号 最新版本 最大flag 的计划，保存flag+1
		Map<String,Object> conditionMap=new HashMap<String,Object>();
		conditionMap.put("version", "");
		conditionMap.put("factory_id", factory_id);
		conditionMap.put("order_no", order_no);
		conditionMap.put("plan_month", plan_month);
		datalist=planDao.getPlanMasterList(conditionMap);
		SimpleDateFormat df2 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String creatTime = df2.format(new Date());
		for(int i=0;i<datalist.size();i++){
			PlanMasterPlan copyPlanMasterPlan = (PlanMasterPlan) datalist.get(i);
			copyPlanMasterPlan.setFlag(String.valueOf(Integer.parseInt(copyPlanMasterPlan.getFlag())+1));
			copyPlanMasterPlan.setCreate_date(creatTime);
			
			planDao.insertMasterPlan(copyPlanMasterPlan);
			//更新 新增的 id 到list
			datalist.set(i, copyPlanMasterPlan);
		}
		//根据revision_str 更新计划信息  11,3,0,201507,1,8,0; [order_id,factory,i,month,day,num,old_num]
		if (revision_str.length()>0){
			String[] revisionStrArray=revision_str.split(";");
			for(int i = 0; i < revisionStrArray.length; i++){
				String[] revisionArray = revisionStrArray[i].split(",");
				PlanMasterPlan editPlanMasterPlan = (PlanMasterPlan) datalist.get(Integer.parseInt(revisionArray[2]));
				//revisionArray[6] = String.valueOf(editPlanMasterPlan.getD1()); //原值
				switch(Integer.parseInt(revisionArray[4])){
				case 1:revisionArray[6] = String.valueOf(editPlanMasterPlan.getD1());editPlanMasterPlan.setD1(Integer.parseInt(revisionArray[5]));break;
				case 2:revisionArray[6] = String.valueOf(editPlanMasterPlan.getD2());editPlanMasterPlan.setD2(Integer.parseInt(revisionArray[5]));break;
				case 3:revisionArray[6] = String.valueOf(editPlanMasterPlan.getD3());editPlanMasterPlan.setD3(Integer.parseInt(revisionArray[5]));break;
				case 4:revisionArray[6] = String.valueOf(editPlanMasterPlan.getD4());editPlanMasterPlan.setD4(Integer.parseInt(revisionArray[5]));break;
				case 5:revisionArray[6] = String.valueOf(editPlanMasterPlan.getD5());editPlanMasterPlan.setD5(Integer.parseInt(revisionArray[5]));break;
				case 6:revisionArray[6] = String.valueOf(editPlanMasterPlan.getD6());editPlanMasterPlan.setD6(Integer.parseInt(revisionArray[5]));break;
				case 7:revisionArray[6] = String.valueOf(editPlanMasterPlan.getD7());editPlanMasterPlan.setD7(Integer.parseInt(revisionArray[5]));break;
				case 8:revisionArray[6] = String.valueOf(editPlanMasterPlan.getD8());editPlanMasterPlan.setD8(Integer.parseInt(revisionArray[5]));break;
				case 9:revisionArray[6] = String.valueOf(editPlanMasterPlan.getD9());editPlanMasterPlan.setD9(Integer.parseInt(revisionArray[5]));break;
				case 10:revisionArray[6] = String.valueOf(editPlanMasterPlan.getD10());editPlanMasterPlan.setD10(Integer.parseInt(revisionArray[5]));break;

				case 11:revisionArray[6] = String.valueOf(editPlanMasterPlan.getD11());editPlanMasterPlan.setD11(Integer.parseInt(revisionArray[5]));break;
				case 12:revisionArray[6] = String.valueOf(editPlanMasterPlan.getD12());editPlanMasterPlan.setD12(Integer.parseInt(revisionArray[5]));break;
				case 13:revisionArray[6] = String.valueOf(editPlanMasterPlan.getD13());editPlanMasterPlan.setD13(Integer.parseInt(revisionArray[5]));break;
				case 14:revisionArray[6] = String.valueOf(editPlanMasterPlan.getD14());editPlanMasterPlan.setD14(Integer.parseInt(revisionArray[5]));break;
				case 15:revisionArray[6] = String.valueOf(editPlanMasterPlan.getD15());editPlanMasterPlan.setD15(Integer.parseInt(revisionArray[5]));break;
				case 16:revisionArray[6] = String.valueOf(editPlanMasterPlan.getD16());editPlanMasterPlan.setD16(Integer.parseInt(revisionArray[5]));break;
				case 17:revisionArray[6] = String.valueOf(editPlanMasterPlan.getD17());editPlanMasterPlan.setD17(Integer.parseInt(revisionArray[5]));break;
				case 18:revisionArray[6] = String.valueOf(editPlanMasterPlan.getD18());editPlanMasterPlan.setD18(Integer.parseInt(revisionArray[5]));break;
				case 19:revisionArray[6] = String.valueOf(editPlanMasterPlan.getD19());editPlanMasterPlan.setD19(Integer.parseInt(revisionArray[5]));break;
				case 20:revisionArray[6] = String.valueOf(editPlanMasterPlan.getD20());editPlanMasterPlan.setD20(Integer.parseInt(revisionArray[5]));break;

				case 21:revisionArray[6] = String.valueOf(editPlanMasterPlan.getD21());editPlanMasterPlan.setD21(Integer.parseInt(revisionArray[5]));break;
				case 22:revisionArray[6] = String.valueOf(editPlanMasterPlan.getD22());editPlanMasterPlan.setD22(Integer.parseInt(revisionArray[5]));break;
				case 23:revisionArray[6] = String.valueOf(editPlanMasterPlan.getD23());editPlanMasterPlan.setD23(Integer.parseInt(revisionArray[5]));break;
				case 24:revisionArray[6] = String.valueOf(editPlanMasterPlan.getD24());editPlanMasterPlan.setD24(Integer.parseInt(revisionArray[5]));break;
				case 25:revisionArray[6] = String.valueOf(editPlanMasterPlan.getD25());editPlanMasterPlan.setD25(Integer.parseInt(revisionArray[5]));break;
				case 26:revisionArray[6] = String.valueOf(editPlanMasterPlan.getD26());editPlanMasterPlan.setD26(Integer.parseInt(revisionArray[5]));break;
				case 27:revisionArray[6] = String.valueOf(editPlanMasterPlan.getD27());editPlanMasterPlan.setD27(Integer.parseInt(revisionArray[5]));break;
				case 28:revisionArray[6] = String.valueOf(editPlanMasterPlan.getD28());editPlanMasterPlan.setD28(Integer.parseInt(revisionArray[5]));break;
				case 29:revisionArray[6] = String.valueOf(editPlanMasterPlan.getD29());editPlanMasterPlan.setD29(Integer.parseInt(revisionArray[5]));break;
				case 30:revisionArray[6] = String.valueOf(editPlanMasterPlan.getD30());editPlanMasterPlan.setD30(Integer.parseInt(revisionArray[5]));break;
				case 31:revisionArray[6] = String.valueOf(editPlanMasterPlan.getD31());editPlanMasterPlan.setD31(Integer.parseInt(revisionArray[5]));break;
				
				}
				planDao.updatePlanMasterInfo(editPlanMasterPlan);
				//根据revision_str 更新日志表 operate_change_type_id = 63 table_name = BMS_PLAN_MASTER_PLAN
				BmsBaseOperateChangeLog changLog = new BmsBaseOperateChangeLog();
				changLog.setOperate_change_type_id(63);
				changLog.setTable_name("BMS_PLAN_MASTER_PLAN");
				changLog.setField_id(editPlanMasterPlan.getId());
				changLog.setField_name("D" + revisionArray[4]);
				changLog.setOld_value(revisionArray[6]);
				changLog.setNew_value(revisionArray[5]);
				changLog.setChanger_id(Integer.valueOf(userId));
				changLog.setChange_date(creatTime);
				planDao.insertOperateChangeLog(changLog);
			}
		}
		
		return 0;
	}

	@Override
	public List<Map<String, String>> checkPlanIssuanceList(Map<String, Object> queryMap) {
		List<Map<String, String>> checkdatalist=new ArrayList<Map<String, String>>();
		checkdatalist = planDao.checkPlanIssuanceList(queryMap);
		return checkdatalist;
	}

	@Override
	public List<PlanIssuance> getPlanIssuanceList(Map<String, Object> queryMap) {
		return planDao.getPlanIssuanceList(queryMap);
	}

	@Override
	public List<PlanIssuanceTotal> getPlanIssuanceTotal(Map<String, Object> queryMap) {
		return planDao.getPlanIssuanceTotal(queryMap);
	}

	@Override
	public List<PlanProductionPlan> getProductionPlanIssuanceList(Map<String, Object> queryMap) {
		return planDao.getProductionPlanIssuanceList(queryMap);
	}

	@Override
	public List<PlanIssuanceCount> getPlanIssuanceCount(Map<String, Object> queryMap) {
		return planDao.getPlanIssuanceCount(queryMap);
	}

	@Override
	public List<PlanIssuanceCount> getDatePlanIssuanceCount(Map<String, Object> queryMap) {
		return planDao.getDatePlanIssuanceCount(queryMap);
	}
	
	@Override
	public int getPlanConfigQty(Map<String, Object> queryMap) {
		return planDao.getPlanConfigQty(queryMap);
	}

	@Override
	public List<PlanConfigIssedQty> getPlanConfigIssedQty(Map<String, Object> queryMap) {
		return planDao.getPlanConfigIssedQty(queryMap);
	}

	@Override
	@Transactional
	public int issuancePlanSubmit(String curTime, String edit_user, String issuance_date, int factory_id, String issuance_str) {
		String[] issuanceStrArray=issuance_str.split(";");
		int plan_code_value[]={0,1,2,3,4,5,6,7,8,9,10,11,12};
		//当前车号的生成规则是通过SQL自动产生，产生规则见planDao::insertPlanBusNumber		
		int bus_count = 0;				//【BMS_FACTORY_ORDER】 已发布数计数
		for(int i = 0; i < issuanceStrArray.length; i++){
			String[] issuanceArray = issuanceStrArray[i].split(",");
			String order_id = planDao.getOrderIdByConfigId(issuanceArray[0].substring(0, issuanceArray[0].length()-1));
			BmsOrder order_info = planDao.getOrderInfoByOrderID(order_id);
			String order_no = order_info.getOrder_no();
			String bus_type = order_info.getBus_type();
			String order_code = order_info.getOrder_code();
			String year = order_info.getProductive_year();
			String order_type = order_info.getOrder_type();		//订单类型，KD件不产生车号
			for(int j=1;j<issuanceArray.length;j++){
				if (Integer.valueOf(issuanceArray[j])>0){
					PlanProductionPlan productionPlan = new PlanProductionPlan();
					productionPlan.setOrder_no(order_no);
					productionPlan.setFactory_id(factory_id);
					productionPlan.setPlan_code_value(plan_code_value[j]);
					productionPlan.setPlan_date(issuance_date);
					productionPlan.setOrder_config_id(Integer.valueOf(issuanceArray[0].substring(0, issuanceArray[0].length()-1)));
					productionPlan.setPlan_qty(Integer.valueOf(issuanceArray[j]));
					productionPlan.setCreator_id(Integer.valueOf(edit_user));
					productionPlan.setCreat_date(curTime);				
					int production_plan_id = 0;
					planDao.insertPlanIssuance(productionPlan);
					production_plan_id = productionPlan.getId();
					//焊装上线节点 开始生成车号
					if(plan_code_value[j]==4){
						if(order_type.equals("KD件")){
							//logger.info("---->当前订单为KD件，不产生车号");
						}else{
							int busPlanQty=Integer.valueOf(issuanceArray[j]);	//发布数量
							for (int n=0;n<busPlanQty;n++){//START循环生成车号
								//查询当前订单 当前工厂  【BMS_FACTORY_ORDER_DETAIL】
								Map<String,Object> orderDetailMap=new HashMap<String,Object>();
								orderDetailMap.put("factory_id", factory_id);
								orderDetailMap.put("order_no", order_no);
								List<Map<String,Object>> datalist=new ArrayList<Map<String,Object>>();
								datalist = planDao.getFactoryOrderDetail(orderDetailMap);
								//List<Map<String,Object>> busNo_generatelist=new ArrayList<Map<String,Object>>();
								/**
							 	* 查询该工厂订单下的车号流水最小值，判断最小值是否超出流水范围，未超出则用最小值减一生成车号，超出则查找该工厂订单下车号流水的最大值，判断最大值
							 	* 是否超出流水范围，未超出用最大值加一生成车号，超出则不生成车号；
							 	*/
								Integer cur_bus_number=null;//当前产生车号准备使用的流水号
								int factory_order_id = 0;
								/**
								 * 当最小车号流水为0代表该工厂订单还未生成车号，则使用起始流水号开始生成车号；
								 * 当最小车号流水不为0，且最小车号流水大于起始流水号，则使用最小车号流水-1生成车号
								 * 当最小车号流水等于起始流水车号，判断最大车号流水是否小于结束流水号，是：用最大车号流水+1生成车号；
								 * 当最小车号流水等于起始流水车号，且最大车号流水等于结束流水号，则需要判断该工厂订单是否存在其他流水段，存在再重复该循环，
								 * 直到找到合适流水号，未找到则表明所有车号均已产生
								 */
								for(int k=0;k<datalist.size();k++){
									Map<String, Object> result = new HashMap<String,Object>();
									result = (Map<String, Object>) datalist.get(k);
									Long max=(Long)result.get("maxbusnum") ;
									Long min=(Long)result.get("minbusnum");
									int maxbusnum=max.intValue();
									int minbusnum=min.intValue();
									int busnum_start=Integer.parseInt(result.get("busnum_start").toString());
									int busnum_end=Integer.parseInt(result.get("busnum_end").toString());
									factory_order_id=Integer.parseInt(result.get("id").toString());
									if(minbusnum>busnum_start){//该段流水前段有剩余流水号，minbusnum-1接着生成
										cur_bus_number=minbusnum-1;
										break;
									}else if(maxbusnum<busnum_end&&minbusnum!=0&&maxbusnum!=0){//该段流水后段有剩余流水号，maxbusnum+1接着生成
										cur_bus_number=maxbusnum+1;
										break;
									}else if(minbusnum==0&&maxbusnum==0){//该段流水未产生车号
										cur_bus_number=busnum_start;
										break;
									}
								}
								//logger.info("---->当前车号为:" + cur_bus_number);
								if(cur_bus_number!=null){//当找到了合适的流水号时，产生车号，否则代表已全部生成完
									PlanBusNumber busNumber = new PlanBusNumber();
									busNumber.setCreator_id(Integer.valueOf(edit_user));
									busNumber.setPrint_sign("0");
									busNumber.setCreat_date(curTime);
									busNumber.setNum(cur_bus_number);
									busNumber.setBus_code(bus_type);
									busNumber.setOrder_code(order_code);
									busNumber.setYear(year);
									int busNumberId = planDao.insertPlanBusNumber(busNumber);
									logger.info("---->busNumberId = " + busNumberId + "=" + busNumber.getId());
									PlanBus bus = new PlanBus();
									bus.setBus_number_id(busNumber.getId());
									bus.setFactory_id(factory_id);
									bus.setStatus("0");
									bus.setOrder_no(order_no);
									bus.setOrder_config_id(Integer.valueOf(issuanceArray[0].substring(0, issuanceArray[0].length()-1)));
									bus.setSequence(i+1);
									bus.setProduction_plan_id(production_plan_id);
									bus.setFactory_order_id(factory_order_id);
									planDao.insertPlanBus(bus);
									//更新工厂已发布数:已发布数+1
									planDao.updateFactoryOrder(factory_order_id);
									bus_count++;
								}
							}//END循环生成车号
						}
					}
				}
			}
		}
		return bus_count;
	}

	@Override
	@Transactional
	public int addPause(List<PlanPause> pauseList) {
		int result = 0;
		for(PlanPause pause:pauseList) {
			result += planDao.addPause(pause);
		}
		return result;
	}

	@Override
	public Map<String,Object> getPauseList(Map<String, Object> queryMap) {
		int totalCount=0;
		List<PlanPause> datalist = planDao.getPauseList(queryMap);
		totalCount = planDao.getPauseTotalCount(queryMap);
		Map<String, Object> result = new HashMap<String,Object>();
		result.put("draw", queryMap.get("draw"));
		result.put("recordsTotal", totalCount);
		result.put("recordsFiltered", totalCount);
		result.put("data", datalist);
		return result;
	}

	@Override
	public int updatePauseInfo(PlanPause pause) {
		return planDao.updatePauseInfo(pause);
	}

	@Override
	public Map<String, Object> getExceptionList(Map<String, Object> queryMap) {
		int totalCount=0;
		List<ProductionException> datalist = planDao.getExceptionList(queryMap);
		totalCount = planDao.getExceptionCount(queryMap);
		Map<String, Object> result = new HashMap<String,Object>();
		result.put("total", totalCount);
		result.put("rows", datalist);
		return result;
	}

	@Override
	public int updateExceptionInfo(ProductionException exception) {
		return planDao.updateExceptionInfo(exception);
	}

	@Override
	public int confirmException(ProductionException exception) {
		return planDao.confirmException(exception);
	}

	@Override
	public Map<String, Object> getPlanVinList(Map<String, Object> queryMap) {
		int totalCount=0;
		List<PlanVIN> datalist = planDao.getPlanVin(queryMap);
		totalCount = planDao.getPlanVinCount(queryMap);
		Map<String, Object> result = new HashMap<String,Object>();
		result.put("total", totalCount);
		result.put("rows", datalist);
		return result;
	}

	@Override
	@Transactional
	public Map<String, Object> getGenerateVin(Map<String, Object> queryMap) {
		int vinCount = Integer.valueOf(queryMap.get("vinCount").toString());
		int factoryOrderQty = planDao.getFactoryOrderInfo(queryMap);
		Map<String, Object> result = new HashMap<String,Object>();
		if(factoryOrderQty == 0){
			result.put("message", "没有该订单的工厂生产数据！");
			result.put("success", false);
			return result;
		}
		int totalCount=planDao.getPlanVinCount(queryMap);
		int genVinCount = factoryOrderQty - totalCount;
		if(genVinCount <= 0){
			result.put("message", "该订单的VIN号已经全部生成！");
			result.put("success", false);
			return result;
		}
		if(vinCount > genVinCount){
			result.put("message", "生成数大于剩余车辆数！");
			result.put("success", false);
			return result;
		}
		//获取VIN前8位
		//String order_no = queryMap.get("order_no").toString();
		String vin_prefix = queryMap.get("vin_prefix").toString();
		
		String factory_prefix = planDao.GetFactoryVinPrefix(Integer.valueOf(queryMap.get("vin_factory_id").toString()));
		String year = queryMap.get("year").toString();
		String WMI_extension = queryMap.get("WMI_extension").toString();
		//获取当前年份最大的VIN流水号
		int vin_count = 0; int vin_num = 0;
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("year_code", vinYearMap.get(year));
		condMap.put("vin_prefix", vin_prefix);
		condMap.put("WMI_extension", WMI_extension);
		vin_count = planDao.getVinCountByYear(condMap);
		for(int i=0;i<genVinCount;i++){
			if (vinCount >0){
				vin_count++;
				String vin_count_str = "";
				if(WMI_extension == ""){
					vin_count_str = String.format("%06d", vin_count);
				}else{
					vin_count_str = WMI_extension + String.format("%03d", vin_count);
				}
				String vin = vin_prefix + "-" + vinYearMap.get(year) + factory_prefix + vin_count_str;
				logger.info("---->vin = " + vin);
				logger.info("---->verifyVin " + i + " = " + verifyVin(vin));
				PlanVIN planVIN = new PlanVIN();
				planVIN.setVin(verifyVin(vin));
				planVIN.setFactory_id(Integer.valueOf(queryMap.get("factory_id").toString()));
				planVIN.setOrder_no(queryMap.get("order_no").toString());
				planVIN.setCreator_id(Integer.valueOf(queryMap.get("staff_number").toString()));
				planVIN.setCreat_date(queryMap.get("curTime").toString());
				planDao.insertPlanVin(planVIN);
				vinCount--;
				vin_num++;	//生成VIN号数量
			}
		}
		result.put("message", "操作成功！共生成" + vin_num + "个VIN号");
		result.put("success", true);
		return result;
	}

	@Override
	public Map<String,Object>  getVinPrefix(Map<String, Object> queryMap) {
		return planDao.getVinPrefix(queryMap);
	}
	
	public String verifyVin(String vin){
		int vin_sum = 0;
		for(int i=0;i<17;i++){
			if (i!=8){
				vin_sum += vinCharMap.get(vin.substring(i, i+1)) * weightMap.get(i+1);
			}
		}
		if (vin_sum%11 == 10){
			return vin.substring(0, 8) + "X" + vin.substring(9,17);
		}else{
			return vin.substring(0, 8) + vin_sum%11 + vin.substring(9,17);
		}
	}

	@Override
	public int checkFactoryOrder(Map<String, Object> queryMap) {
		return planDao.checkFactoryOrder(queryMap);
	}

	@Override
	@Transactional
	public int importVin(List<Map<String, Object>> vin_list) {
		int result = 0;
		for(int i=0;i<vin_list.size();i++){
			PlanVIN planVIN = new PlanVIN();
			planVIN.setVin(vin_list.get(i).get("vin").toString());
			planVIN.setBus_number(vin_list.get(i).get("bus_number").toString());
			planVIN.setOrder_no(vin_list.get(i).get("order_no").toString());
			planVIN.setFactory_name(vin_list.get(i).get("factory_name").toString());
			planVIN.setLeft_motor_number(vin_list.get(i).get("left_motor_number").toString());
			planVIN.setRight_motor_number(vin_list.get(i).get("right_motor_number").toString());
			planVIN.setCreator_id(Integer.valueOf(vin_list.get(i).get("staff_number").toString()));
			planVIN.setCreat_date(vin_list.get(i).get("curTime").toString());
			planVIN.setSource("1");
			result += planDao.insertPlanVin2(planVIN);
			//如导入数据中有车号信息，则需要更新两个表：plan_bus表和pd_vin表
			if(!(vin_list.get(i).get("bus_number").toString().equals(""))){
				result += planDao.updatePlanBus(planVIN);
			}
		}
		return result;
	}

	@Override
	public List<String> selectBusByMotorVin(Map<String,Object> queryMap) {
		return planDao.selectBusByMotorVin(queryMap);
	}
	
	@Override
	public int checkBusNumber(Map<String,Object> queryMap){
		return planDao.checkBusNumber(queryMap);
	}
	
	@Override
	public int checkBingingVin(Map<String,Object> queryMap){
		return planDao.checkBingingVin(queryMap);
	}

	@Override
	@Transactional
	public int BingingVinMotor(Map<String, Object> queryMap) {
		String update = queryMap.get("update").toString();	//left_motor_number right_motor_number bus_number
		String update_val = queryMap.get("update_val").toString();
		//判断是否重复绑定
		if(update.equals("bus_number")){
			if(update_val==""){
				//解除绑定
				planDao.unBingingBusNumber(queryMap);
			}else{
				int check = planDao.checkBusNumber(queryMap);
				if(check == 0){
					//此车号已经绑定了或不存在
					return -1;
				}else{
					planDao.bingingBusNumber(queryMap);
				}
			}
		}else{
			int check = planDao.checkBingingVin(queryMap);
			if(check != 0){
				//此电机号已经绑定了
				return -2;
			}else{
				planDao.bingingVin(queryMap);
			}
		}
		return 0;
	}

	@Override
	public List<Map<String,String>> getBusTransferOutList(Map<String, Object> queryMap) {
		return planDao.getBusTransferOutList(queryMap);
	}
	
	@Override
	public List<Map<String,String>> getBusTransferInList(Map<String, Object> queryMap) {
		return planDao.getBusTransferInList(queryMap);
	}

	@Override
	@Transactional
	public int busTransferOut(Map<String, Object> queryMap) {
		String bus_numbers = queryMap.get("bus_numbers").toString();
		String factory_out_id = queryMap.get("factory_out_id").toString();
		String[] busNumberList = bus_numbers.split(",");
		for(int i=0;i<busNumberList.length;i++){
			Map<String,Object> conditionMap=new HashMap<String,Object>();
			conditionMap.put("factory_id", factory_out_id);
			conditionMap.put("bus_number", busNumberList[i]);
			conditionMap.put("status", "1");
			//校验，不能调出到自己工厂
			List<Map<String,String>> busInfo=new ArrayList<Map<String, String>>();
			busInfo = planDao.getBusInfo(busNumberList[i]);
			Map<String,String> busInfoMap=new HashMap<String,String>();
			busInfoMap = (Map<String, String>) busInfo.get(0);
			if(factory_out_id.equals(String.valueOf(busInfoMap.get("factory_id")))){
				return -1;	//调出工厂有误，车号"+busNumberList[i]+"已经在调出工厂，请重新选择！
			}
		}
		for(int i=0;i<busNumberList.length;i++){
			Map<String,Object> conditionMap=new HashMap<String,Object>();
			conditionMap.put("factory_id", factory_out_id);
			conditionMap.put("bus_number", busNumberList[i]);
			conditionMap.put("status", "1");
			List<Map<String,String>> busInfo=new ArrayList<Map<String, String>>();
			busInfo = planDao.getBusInfo(busNumberList[i]);

			Map<String,String> busInfoMap=new HashMap<String,String>();
			busInfoMap = (Map<String, String>) busInfo.get(0);
			int fromFactoryId = Integer.valueOf(String.valueOf(busInfoMap.get("factory_id")));
			planDao.updatePlanBusStatus(conditionMap);
			//记录调出记录【BMS_PLAN_BUS_TRANSFER_LOG】
			PlanBusTransfer busTransfer = new PlanBusTransfer();
			busTransfer.setBus_number(busNumberList[i]);
			busTransfer.setTto_factory_id(Integer.valueOf(factory_out_id));
			busTransfer.setTfrom_factory_id(fromFactoryId);
			busTransfer.setTfrom_date(queryMap.get("curTime").toString());
			busTransfer.setTfrom_people_id(Integer.valueOf(queryMap.get("staff_number").toString()));
			planDao.insertBusTransferLog(busTransfer);
			
			//车辆调出后需调整调出工厂车号流水对应的工厂订单生产数量
			Map<String,Object> condmap=new HashMap<String,Object>();
			String[] bus_info=busNumberList[i].split("-");
			condmap.put("bus_series", bus_info[3]);
			condmap.put("year", bus_info[2]);
			condmap.put("factory_id", fromFactoryId);
			condmap.put("order_id", busInfoMap.get("order_id"));
			planDao.updateFactoryOrderProQty(condmap);
		}
		return 0;
	}
	
	@Override
	@Transactional
	public int busTransferIn(Map<String, Object> queryMap) {
		String bus_numbers = queryMap.get("bus_numbers").toString();
		String transfer_in_factory = queryMap.get("transfer_in_factory").toString();
		String[] busNumberList = bus_numbers.split(",");
		for(int i=0;i<busNumberList.length;i++){
			String[] bus_order=busNumberList[i].split("\\|");//传输格式：bus_number|order_id|order_no
			Map<String,Object> conditionMap=new HashMap<String,Object>();
			conditionMap.put("factory_id", transfer_in_factory);
			conditionMap.put("bus_number", bus_order[0]);
			conditionMap.put("status", "0");
			planDao.updatePlanBusTranIn(conditionMap);
			//更新调出记录【BMS_PLAN_BUS_TRANSFER_LOG】
			PlanBusTransfer busTransfer = new PlanBusTransfer();
			busTransfer.setBus_number(bus_order[0]);
			busTransfer.setTto_date(queryMap.get("curTime").toString());
			busTransfer.setTto_people_id(Integer.valueOf(queryMap.get("staff_number").toString()));
			planDao.updateBusTransferLog(busTransfer);
			//调入时，先根据车号、调入工厂查询是否存在对应的工厂订单，不存在新增一行工厂订单记录，存在则将该记录的生产数量加一
			Map<String, Object> queryMap2=new HashMap<String,Object>();
			String[] bus_info=busNumberList[i].split("-");
			String order_no=bus_order[2];
			int order_id=Integer.parseInt(bus_order[1]);
			queryMap2.put("order_no", order_no);			
			queryMap2.put("order_id", order_id);
			queryMap2.put("factory_id", transfer_in_factory);
			queryMap2.put("bus_series", bus_info[3]);
			List<Map<String, String>> facOrderList=planDao.queryFactoryOrderId(queryMap2);
			if(facOrderList==null ||facOrderList.size()==0){//不存在新增一行工厂订单记录
				planDao.insertFactoryOrder(queryMap2);
			}
			if(facOrderList.size()>0){//存在则将该记录的生产数量加一
				String factory_order_id=String.valueOf(facOrderList.get(0).get("id"));
				planDao.updateFactoryOrderQty(factory_order_id);
			}
		}
		return 0;
	}

	@Override
	public List<Map<String, String>> getBusTransferHisList(Map<String, Object> queryMap) {
		return planDao.getBusTransferHisList(queryMap);
	}

	@Override
	public List<Map<String, String>> checkProductionPlan(Map<String, Object> queryMap) {
		return planDao.checkProductionPlan(queryMap);
	}

	@Override
	@DataSource("dataSourceSlave")
	public List<Map<String, String>> getPlanSerach(Map<String, Object> queryMap) {
		return planDao.getPlanSerach(queryMap);
	}

	@Override
	@DataSource("dataSourceSlave")
	public Map<String, Object> showPlanSearchDetail(Map<String, Object> queryMap) {
		Map<String, Object> result=new HashMap<String,Object>();
		String date_array = queryMap.get("date_array").toString();
		String[] dateArray = date_array.split(",");
		String month = dateArray[0].substring(0, 7);
		String startDate = dateArray[0];
		String endDate = dateArray[dateArray.length-1];
		logger.info("---->startDate = " + startDate + "|endDate = " + endDate);
		List<Map<String, String>> datalist=new ArrayList<Map<String, String>>();		
		List<String> order_list = new ArrayList<String>();
		
		if(queryMap.get("order_no").toString().equals("")){
			List<Map<String,String>> orderlist = new ArrayList<Map<String, String>>();
			Map<String,Object> conditionMap2=new HashMap<String,Object>();
			conditionMap2.put("factory_id", queryMap.get("factory_id").toString());
			conditionMap2.put("start_date", startDate);
			conditionMap2.put("end_date", endDate);
			orderlist = planDao.getPlanOrderList(conditionMap2);
			for(int m=0;m<orderlist.size();m++){
				order_list.add(((Map<String,String>)orderlist.get(m)).get("order_no"));
			}
			
		}else{
			order_list.add(queryMap.get("order_no").toString());
		}
		
		for(int n=0;n<order_list.size();n++){
			List<String[]> detailList = this.getPlanDetailByOrder(order_list.get(n),date_array,queryMap);
			for(int i = 0; i < detailList.size(); i++) {	
				Map<String,String> resultMap=new HashMap<String,String>();
				int total = 0;int total_month = 0;int total_order = 0;
				resultMap.put("factory_id", detailList.get(i)[0]);
				resultMap.put("order_no", order_list.get(n));
				resultMap.put("workshop", detailList.get(i)[2]);
				
				resultMap.put("D1", detailList.get(i)[3]);  total+=Integer.parseInt((detailList.get(i)[3]==null)?"0":detailList.get(i)[3]);
				resultMap.put("D2", detailList.get(i)[4]);  total+=Integer.parseInt((detailList.get(i)[4]==null)?"0":detailList.get(i)[4]);
				resultMap.put("D3", detailList.get(i)[5]);  total+=Integer.parseInt((detailList.get(i)[5]==null)?"0":detailList.get(i)[5]);
				resultMap.put("D4", detailList.get(i)[6]);  total+=Integer.parseInt((detailList.get(i)[6]==null)?"0":detailList.get(i)[6]);
				resultMap.put("D5", detailList.get(i)[7]);  total+=Integer.parseInt((detailList.get(i)[7]==null)?"0":detailList.get(i)[7]);
				resultMap.put("D6", detailList.get(i)[8]);  total+=Integer.parseInt((detailList.get(i)[8]==null)?"0":detailList.get(i)[8]);
				resultMap.put("D7", detailList.get(i)[9]);  total+=Integer.parseInt((detailList.get(i)[9]==null)?"0":detailList.get(i)[9]);
				resultMap.put("D8", detailList.get(i)[10]); total+=Integer.parseInt((detailList.get(i)[10]==null)?"0":detailList.get(i)[10]);
				resultMap.put("D9", detailList.get(i)[11]); total+=Integer.parseInt((detailList.get(i)[11]==null)?"0":detailList.get(i)[11]);
				resultMap.put("D10", detailList.get(i)[12]);total+=Integer.parseInt((detailList.get(i)[12]==null)?"0":detailList.get(i)[12]);

				resultMap.put("D11", detailList.get(i)[13]);total+=Integer.parseInt((detailList.get(i)[13]==null)?"0":detailList.get(i)[13]);
				resultMap.put("D12", detailList.get(i)[14]);total+=Integer.parseInt((detailList.get(i)[14]==null)?"0":detailList.get(i)[14]);
				resultMap.put("D13", detailList.get(i)[15]);total+=Integer.parseInt((detailList.get(i)[15]==null)?"0":detailList.get(i)[15]);
				resultMap.put("D14", detailList.get(i)[16]);total+=Integer.parseInt((detailList.get(i)[16]==null)?"0":detailList.get(i)[16]);
				resultMap.put("D15", detailList.get(i)[17]);total+=Integer.parseInt((detailList.get(i)[17]==null)?"0":detailList.get(i)[17]);
				resultMap.put("D16", detailList.get(i)[18]);total+=Integer.parseInt((detailList.get(i)[18]==null)?"0":detailList.get(i)[18]);
				resultMap.put("D17", detailList.get(i)[19]);total+=Integer.parseInt((detailList.get(i)[19]==null)?"0":detailList.get(i)[19]);
				resultMap.put("D18", detailList.get(i)[20]);total+=Integer.parseInt((detailList.get(i)[20]==null)?"0":detailList.get(i)[20]);
				resultMap.put("D19", detailList.get(i)[21]);total+=Integer.parseInt((detailList.get(i)[21]==null)?"0":detailList.get(i)[21]);
				resultMap.put("D20", detailList.get(i)[22]);total+=Integer.parseInt((detailList.get(i)[22]==null)?"0":detailList.get(i)[22]);

				resultMap.put("D21", detailList.get(i)[23]);total+=Integer.parseInt((detailList.get(i)[23]==null)?"0":detailList.get(i)[23]);
				resultMap.put("D22", detailList.get(i)[24]);total+=Integer.parseInt((detailList.get(i)[24]==null)?"0":detailList.get(i)[24]);
				resultMap.put("D23", detailList.get(i)[25]);total+=Integer.parseInt((detailList.get(i)[25]==null)?"0":detailList.get(i)[25]);
				resultMap.put("D24", detailList.get(i)[26]);total+=Integer.parseInt((detailList.get(i)[26]==null)?"0":detailList.get(i)[26]);
				resultMap.put("D25", detailList.get(i)[27]);total+=Integer.parseInt((detailList.get(i)[27]==null)?"0":detailList.get(i)[27]);
				resultMap.put("D26", detailList.get(i)[28]);total+=Integer.parseInt((detailList.get(i)[28]==null)?"0":detailList.get(i)[28]);
				resultMap.put("D27", detailList.get(i)[29]);total+=Integer.parseInt((detailList.get(i)[29]==null)?"0":detailList.get(i)[29]);
				resultMap.put("D28", detailList.get(i)[30]);total+=Integer.parseInt((detailList.get(i)[30]==null)?"0":detailList.get(i)[30]);
				resultMap.put("D29", detailList.get(i)[31]);total+=Integer.parseInt((detailList.get(i)[31]==null)?"0":detailList.get(i)[31]);
				resultMap.put("D30", detailList.get(i)[32]);total+=Integer.parseInt((detailList.get(i)[32]==null)?"0":detailList.get(i)[32]);
				resultMap.put("D31", detailList.get(i)[33]);total+=Integer.parseInt((detailList.get(i)[33]==null)?"0":detailList.get(i)[33]);
				resultMap.put("total", String.valueOf(total));
				
				//计算本月合计（跨月取第一个月的数据）
				//计划
				String workshop = detailList.get(i)[2];
				int plan_code_id = 0;
				if(workshop.substring(workshop.length()-2, workshop.length()).equals("计划")){
					Map<String,Object> conditionMap2=new HashMap<String,Object>();
					conditionMap2.put("factory_id", detailList.get(i)[0]);
					conditionMap2.put("order_no", order_list.get(n));
					conditionMap2.put("month", month);
					conditionMap2.put("plan_code_id", detailList.get(i)[34]);
					total_month = planDao.getPlanSearchTotalMonthPlanQty(conditionMap2);
					Map<String,Object> conditionMap3=new HashMap<String,Object>();
					conditionMap3.put("factory_id", detailList.get(i)[0]);
					conditionMap3.put("order_no", order_list.get(n));
					conditionMap3.put("month", "");
					conditionMap3.put("plan_code_id", detailList.get(i)[34]);
					logger.info("-->factory_id = " + detailList.get(i)[0] + "|order_no = " + detailList.get(i)[1] + "|plan_code_id = " + detailList.get(i)[34]);
					total_order = planDao.getPlanSearchTotalMonthPlanQty(conditionMap3);
				}else{
					//完成数
					Map<String,Object> conditionMap2=new HashMap<String,Object>();
					conditionMap2.put("factory_id", detailList.get(i)[0]);
					conditionMap2.put("order_no", order_list.get(n));
					conditionMap2.put("month", month);
					
					Map<String,Object> conditionMap3=new HashMap<String,Object>();
					conditionMap3.put("factory_id", detailList.get(i)[0]);
					conditionMap3.put("order_no", order_list.get(n));
					conditionMap3.put("month", "");
					
					plan_code_id = Integer.valueOf(detailList.get(i)[34]);
					switch(plan_code_id){
					case 4:
						conditionMap2.put("workshop", "welding_online_date");conditionMap3.put("workshop", "welding_online_date");break;
					case 5:
						conditionMap2.put("workshop", "welding_offline_date");conditionMap3.put("workshop", "welding_offline_date");break;
					//case 1:
					//	conditionMap2.put("workshop", "fiberglass_offline_date");conditionMap3.put("workshop", "fiberglass_offline_date");break;
					case 6:
						conditionMap2.put("workshop", "painting_online_date");conditionMap3.put("workshop", "painting_online_date");break;
					case 7:
						conditionMap2.put("workshop", "painting_offline_date");conditionMap3.put("workshop", "painting_offline_date");break;
					case 8:
						conditionMap2.put("workshop", "chassis_online_date");conditionMap3.put("workshop", "chassis_online_date");break;
					case 9:
						conditionMap2.put("workshop", "chassis_offline_date");conditionMap3.put("workshop", "chassis_offline_date");break;
					case 10:
						conditionMap2.put("workshop", "assembly_online_date");conditionMap3.put("workshop", "assembly_online_date");break;
					case 11:
						conditionMap2.put("workshop", "assembly_offline_date");conditionMap3.put("workshop", "assembly_offline_date");break;
					case 12:
						conditionMap2.put("workshop", "warehousing_date");conditionMap3.put("workshop", "warehousing_date");break;
					}
					if(plan_code_id==2||plan_code_id==3){
						if(plan_code_id==2){	//部件上线 取[前段车架总成][6]
							conditionMap2.put("parts", "online_real_qty");
							conditionMap2.put("month", month);						
							conditionMap2.put("parts_id", "6");						
							conditionMap3.put("parts", "online_real_qty");
							conditionMap3.put("month", "");				
							conditionMap3.put("parts_id", "6");		
						}else{					//部件下线 取[喷砂][0]
							conditionMap2.put("parts", "offline_real_qty");
							conditionMap2.put("month", month);							
							conditionMap2.put("parts_id", "0");				
							conditionMap3.put("parts", "offline_real_qty");
							conditionMap3.put("month", "");				
							conditionMap3.put("parts_id", "0");		
						}
						total_month = planDao.getPlanSearchTotalRealPartsQty(conditionMap2);
						total_order = planDao.getPlanSearchTotalRealPartsQty(conditionMap3);
					}else if(plan_code_id==1){	//自制件下线
						logger.info("----> month = " + month + detailList.get(i)[0] + order_list.get(n));
						Map<String,Object> conditionMap4=new HashMap<String,Object>();
						Map<String,Object> conditionMap5=new HashMap<String,Object>();
						conditionMap4.put("factory_id", detailList.get(i)[0]);
						conditionMap4.put("order_no", order_list.get(n));
						conditionMap4.put("month", "");
						conditionMap5.put("factory_id", detailList.get(i)[0]);
						conditionMap5.put("order_no", order_list.get(n));
						conditionMap5.put("month", month);
						total_month = planDao.getPlanSearchTotalRealZzjQty(conditionMap4);
						total_order = planDao.getPlanSearchTotalRealZzjQty(conditionMap5);
					}else{
						total_month = planDao.getPlanSearchTotalRealQty(conditionMap2);
						total_order = planDao.getPlanSearchTotalRealQty(conditionMap3);
					}
					
				}
				resultMap.put("total_month", String.valueOf(total_month));
				resultMap.put("total_order", String.valueOf(total_order));
				datalist.add(resultMap);
				
			}
		}
		result.put("data", datalist);
		return result;
	}
	
	public List<String[]> getPlanDetailByOrder(String order_no,String date_array,Map<String, Object> queryMap){
		String[] dateArray = date_array.split(",");		
		String month = dateArray[0].substring(0, 7);
		logger.info("-->month = " + month);
		String workshop = "";
		if (!queryMap.get("workshop").toString().equals("全部")) workshop = queryMap.get("workshop").toString();
		String[] detailArray_1 = new String[35];  String[] detailArray_1_real = new String[35];
		String[] detailArray_2 = new String[35];  String[] detailArray_2_real = new String[35];
		String[] detailArray_3 = new String[35];  String[] detailArray_3_real = new String[35];
		String[] detailArray_4 = new String[35];  String[] detailArray_4_real = new String[35];
		String[] detailArray_5 = new String[35];  String[] detailArray_5_real = new String[35];
		String[] detailArray_6 = new String[35];  String[] detailArray_6_real = new String[35];
		String[] detailArray_7 = new String[35];  String[] detailArray_7_real = new String[35];
		String[] detailArray_8 = new String[35];  String[] detailArray_8_real = new String[35];
		String[] detailArray_9 = new String[35];  String[] detailArray_9_real = new String[35];
		String[] detailArray_10 = new String[35]; String[] detailArray_10_real = new String[35];
		String[] detailArray_11 = new String[35]; String[] detailArray_11_real = new String[35];
		String[] detailArray_12 = new String[35]; String[] detailArray_12_real = new String[35];
		
		List<String[]> detailList = new ArrayList<String[]>();
		detailList.add(detailArray_1);  detailList.add(detailArray_1_real);
		detailList.add(detailArray_2);  detailList.add(detailArray_2_real);
		detailList.add(detailArray_3);  detailList.add(detailArray_3_real);
		detailList.add(detailArray_4);  detailList.add(detailArray_4_real);
		detailList.add(detailArray_5);  detailList.add(detailArray_5_real);
		detailList.add(detailArray_6);  detailList.add(detailArray_6_real);
		detailList.add(detailArray_7);  detailList.add(detailArray_7_real);
		detailList.add(detailArray_8);  detailList.add(detailArray_8_real);
		detailList.add(detailArray_9);  detailList.add(detailArray_9_real);
		detailList.add(detailArray_10); detailList.add(detailArray_10_real);
		detailList.add(detailArray_11); detailList.add(detailArray_11_real);
		detailList.add(detailArray_12); detailList.add(detailArray_12_real);
		
		for(int i = 0; i < dateArray.length; i++) {			//循环查询每一天所有车间的数据
			Map<String,Object> conditionMap=new HashMap<String,Object>();
			conditionMap.put("factory_id", queryMap.get("factory_id").toString());
			conditionMap.put("order_no", order_no);
			conditionMap.put("workshop", workshop);
			//conditionMap.put("plan_date", dateArray[i].replaceAll("-", ""));		//???
			conditionMap.put("plan_date", dateArray[i]);
			List<Map<String,String>> datalist=new ArrayList<Map<String, String>>();
			datalist = planDao.getPlanSearchPlanQty(conditionMap);
			
			for (int j = 0; j < datalist.size(); j++) {	
				Map<String,String> resultMap=new HashMap<String,String>();
				resultMap = (Map<String, String>) datalist.get(j);
				Map<String,Object> conditionMap2=new HashMap<String,Object>();
				conditionMap2.put("factory_id", queryMap.get("factory_id").toString());
				conditionMap2.put("order_no", order_no);
				conditionMap2.put("workshop", resultMap.get("key_name_en") + "_date");
				conditionMap2.put("plan_date", dateArray[i]);
				
				// 部件车间完成数另外计算
				if(resultMap.get("key_name_en").equals("parts_online") || resultMap.get("key_name_en").equals("parts_offline")){
					conditionMap2.put("plan_date", dateArray[i]);
					if (resultMap.get("key_name_en").equals("parts_online")){
						conditionMap2.put("parts", "online_real_qty");
					}else{
						conditionMap2.put("parts", "offline_real_qty");
					}					
					int real_qty = planDao.getPlanSearchRealPartsQty(conditionMap2);
					resultMap.put("sum_real_qty", String.valueOf(real_qty));
				}else if(resultMap.get("key_name_en").equals("ZZJ_offline")){
					Map<String,Object> conditionMap3=new HashMap<String,Object>();
					conditionMap3.put("factory_id", queryMap.get("factory_id").toString());
					conditionMap3.put("order_no", order_no);
					conditionMap3.put("plan_date", dateArray[i]);
					int real_qty = planDao.getPlanSearchRealZzjQty(conditionMap3);
					resultMap.put("sum_real_qty", String.valueOf(real_qty));
				}else{
					int real_qty = planDao.getPlanSearchRealQty(conditionMap2);
					logger.info("---->real_qty = " + conditionMap2.get("factory_id") + "|" + conditionMap2.get("order_no") + "|" + conditionMap2.get("workshop") + "|" + String.valueOf(real_qty));
					resultMap.put("sum_real_qty", String.valueOf(real_qty));
				}
				
			}
			if (i==0){
				detailArray_1[0]=queryMap.get("factory_id").toString();
				detailArray_1[1]=queryMap.get("order_no").toString();
				detailArray_1[2]="自制件下线计划";detailArray_1[34]="1";					
				detailArray_2[0]=queryMap.get("factory_id").toString();
				detailArray_2[1]=queryMap.get("order_no").toString();
				detailArray_2[2]="部件上线计划";detailArray_2[34]="2";	
				detailArray_3[0]=queryMap.get("factory_id").toString();
				detailArray_3[1]=queryMap.get("order_no").toString();
				detailArray_3[2]="部件下线计划";detailArray_3[34]="3";				
				
				detailArray_1_real[0]=queryMap.get("factory_id").toString();
				detailArray_1_real[1]=queryMap.get("order_no").toString();
				detailArray_1_real[2]="自制件下线完成";detailArray_1_real[34]="1";					
				detailArray_2_real[0]=queryMap.get("factory_id").toString();
				detailArray_2_real[1]=queryMap.get("order_no").toString();
				detailArray_2_real[2]="部件上线完成";detailArray_2_real[34]="2";			
				detailArray_3_real[0]=queryMap.get("factory_id").toString();
				detailArray_3_real[1]=queryMap.get("order_no").toString();
				detailArray_3_real[2]="部件下线完成";detailArray_3_real[34]="3";
				
				detailArray_4[0]=queryMap.get("factory_id").toString();
				detailArray_4[1]=queryMap.get("order_no").toString();
				detailArray_4[2]="焊装上线计划";detailArray_4[34]="4";			
				detailArray_5[0]=queryMap.get("factory_id").toString();
				detailArray_5[1]=queryMap.get("order_no").toString();
				detailArray_5[2]="焊装下线计划";detailArray_5[34]="5";
				
				detailArray_4_real[0]=queryMap.get("factory_id").toString();
				detailArray_4_real[1]=queryMap.get("order_no").toString();
				detailArray_4_real[2]="焊装上线完成";detailArray_4_real[34]="4";
				detailArray_5_real[0]=queryMap.get("factory_id").toString();
				detailArray_5_real[1]=queryMap.get("order_no").toString();
				detailArray_5_real[2]="焊装下线完成";detailArray_5_real[34]="5";
				
				detailArray_6[0]=queryMap.get("factory_id").toString();
				detailArray_6[1]=queryMap.get("order_no").toString();
				detailArray_6[2]="涂装上线计划";detailArray_6[34]="6";
				detailArray_7[0]=queryMap.get("factory_id").toString();
				detailArray_7[1]=queryMap.get("order_no").toString();
				detailArray_7[2]="涂装下线计划";detailArray_7[34]="7";
				
				detailArray_6_real[0]=queryMap.get("factory_id").toString();
				detailArray_6_real[1]=queryMap.get("order_no").toString();
				detailArray_6_real[2]="涂装上线完成";detailArray_6_real[34]="6";
				detailArray_7_real[0]=queryMap.get("factory_id").toString();
				detailArray_7_real[1]=queryMap.get("order_no").toString();
				detailArray_7_real[2]="涂装下线完成";detailArray_7_real[34]="7";
				
				detailArray_8[0]=queryMap.get("factory_id").toString();
				detailArray_8[1]=queryMap.get("order_no").toString();
				detailArray_8[2]="底盘上线计划";detailArray_8[34]="8";
				detailArray_9[0]=queryMap.get("factory_id").toString();
				detailArray_9[1]=queryMap.get("order_no").toString();
				detailArray_9[2]="底盘下线计划";detailArray_9[34]="9";
				
				detailArray_8_real[0]=queryMap.get("factory_id").toString();
				detailArray_8_real[1]=queryMap.get("order_no").toString();
				detailArray_8_real[2]="底盘上线完成";detailArray_8_real[34]="8";
				detailArray_9_real[0]=queryMap.get("factory_id").toString();
				detailArray_9_real[1]=queryMap.get("order_no").toString();
				detailArray_9_real[2]="底盘下线完成";detailArray_9_real[34]="9";
				
				detailArray_10[0]=queryMap.get("factory_id").toString();
				detailArray_10[1]=queryMap.get("order_no").toString();
				detailArray_10[2]="总装上线计划";detailArray_10[34]="10";
				detailArray_11[0]=queryMap.get("factory_id").toString();
				detailArray_11[1]=queryMap.get("order_no").toString();
				detailArray_11[2]="总装下线计划";detailArray_11[34]="11";
				
				detailArray_12[0]=queryMap.get("factory_id").toString();
				detailArray_12[1]=queryMap.get("order_no").toString();
				detailArray_12[2]="入库计划";detailArray_12[34]="12";
				
				detailArray_10_real[0]=queryMap.get("factory_id").toString();
				detailArray_10_real[1]=queryMap.get("order_no").toString();
				detailArray_10_real[2]="总装上线完成";detailArray_10_real[34]="10";
				detailArray_11_real[0]=queryMap.get("factory_id").toString();
				detailArray_11_real[1]=queryMap.get("order_no").toString();
				detailArray_11_real[2]="总装下线完成";detailArray_11_real[34]="11";
				
				detailArray_12_real[0]=queryMap.get("factory_id").toString();
				detailArray_12_real[1]=queryMap.get("order_no").toString();
				detailArray_12_real[2]="入库完成";detailArray_12_real[34]="12";
				
				for (int j = 0; j < datalist.size(); j++) {	
					Map<String,String> resultMap=new HashMap<String,String>();
					resultMap = (Map<String, String>) datalist.get(j);
					
					switch(Integer.valueOf(String.valueOf(resultMap.get("plan_code_id")))){
					case 1:
						detailArray_1[3]=String.valueOf(resultMap.get("sum_plan_qty"));
						detailArray_1_real[3]=String.valueOf(resultMap.get("sum_real_qty"));
						break;
					case 2:
						detailArray_2[3]=String.valueOf(resultMap.get("sum_plan_qty"));
						detailArray_2_real[3]=String.valueOf(resultMap.get("sum_real_qty"));
						break;
					case 3:
						detailArray_3[3]=String.valueOf(resultMap.get("sum_plan_qty"));
						detailArray_3_real[3]=String.valueOf(resultMap.get("sum_real_qty"));
						break;
					case 4:
						detailArray_4[3]=String.valueOf(resultMap.get("sum_plan_qty"));
						detailArray_4_real[3]=String.valueOf(resultMap.get("sum_real_qty"));
						break;
					case 5:
						detailArray_5[3]=String.valueOf(resultMap.get("sum_plan_qty"));
						detailArray_5_real[3]=String.valueOf(resultMap.get("sum_real_qty"));
						break;
					case 6:
						detailArray_6[3]=String.valueOf(resultMap.get("sum_plan_qty"));
						detailArray_6_real[3]=String.valueOf(resultMap.get("sum_real_qty"));
						break;
					case 7:
						detailArray_7[3]=String.valueOf(resultMap.get("sum_plan_qty"));
						detailArray_7_real[3]=String.valueOf(resultMap.get("sum_real_qty"));
						break;
					case 8:
						detailArray_8[3]=String.valueOf(resultMap.get("sum_plan_qty"));
						detailArray_8_real[3]=String.valueOf(resultMap.get("sum_real_qty"));
						break;
					case 9:
						detailArray_9[3]=String.valueOf(resultMap.get("sum_plan_qty"));
						detailArray_9_real[3]=String.valueOf(resultMap.get("sum_real_qty"));
						break;
					case 10:
						detailArray_10[3]=String.valueOf(resultMap.get("sum_plan_qty"));
						detailArray_10_real[3]=String.valueOf(resultMap.get("sum_real_qty"));
						break;
					case 11:
						detailArray_11[3]=String.valueOf(resultMap.get("sum_plan_qty"));
						detailArray_11_real[3]=String.valueOf(resultMap.get("sum_real_qty"));
						break;
					case 12:
						detailArray_12[3]=String.valueOf(resultMap.get("sum_plan_qty"));
						detailArray_12_real[3]=String.valueOf(resultMap.get("sum_real_qty"));
						break;
					}			
				}
			}else {		//1,2,3,4...
				for (int j = 0; j < datalist.size(); j++) {	
					Map<String,String> resultMap=new HashMap<String,String>();
					resultMap = (Map<String, String>) datalist.get(j);
					switch(Integer.valueOf(String.valueOf(resultMap.get("plan_code_id")))){
						case 1:
							detailArray_1[3+i]=String.valueOf(resultMap.get("sum_plan_qty"));
							detailArray_1_real[3+i]=String.valueOf(resultMap.get("sum_real_qty"));
							break;
						case 2:
							detailArray_2[3+i]=String.valueOf(resultMap.get("sum_plan_qty"));
							detailArray_2_real[3+i]=String.valueOf(resultMap.get("sum_real_qty"));
							break;
						case 3:
							detailArray_3[3+i]=String.valueOf(resultMap.get("sum_plan_qty"));
							detailArray_3_real[3+i]=String.valueOf(resultMap.get("sum_real_qty"));
							break;
						case 4:
							detailArray_4[3+i]=String.valueOf(resultMap.get("sum_plan_qty"));
							detailArray_4_real[3+i]=String.valueOf(resultMap.get("sum_real_qty"));
							break;
						case 5:
							detailArray_5[3+i]=String.valueOf(resultMap.get("sum_plan_qty"));
							detailArray_5_real[3+i]=String.valueOf(resultMap.get("sum_real_qty"));
							break;
						case 6:
							detailArray_6[3+i]=String.valueOf(resultMap.get("sum_plan_qty"));
							detailArray_6_real[3+i]=String.valueOf(resultMap.get("sum_real_qty"));
							break;
						case 7:
							detailArray_7[3+i]=String.valueOf(resultMap.get("sum_plan_qty"));
							detailArray_7_real[3+i]=String.valueOf(resultMap.get("sum_real_qty"));
							break;
						case 8:
							detailArray_8[3+i]=String.valueOf(resultMap.get("sum_plan_qty"));
							detailArray_8_real[3+i]=String.valueOf(resultMap.get("sum_real_qty"));
							break;
						case 9:
							detailArray_9[3+i]=String.valueOf(resultMap.get("sum_plan_qty"));
							detailArray_9_real[3+i]=String.valueOf(resultMap.get("sum_real_qty"));
							break;
						case 10:
							detailArray_10[3+i]=String.valueOf(resultMap.get("sum_plan_qty"));
							detailArray_10_real[3+i]=String.valueOf(resultMap.get("sum_real_qty"));
							break;
						case 11:
							detailArray_11[3+i]=String.valueOf(resultMap.get("sum_plan_qty"));
							detailArray_11_real[3+i]=String.valueOf(resultMap.get("sum_real_qty"));
							break;
						case 12:
							detailArray_12[3+i]=String.valueOf(resultMap.get("sum_plan_qty"));
							detailArray_12_real[3+i]=String.valueOf(resultMap.get("sum_real_qty"));
							break;
					}
				}
			}
		}
		return detailList;
	}

	@Override
	public int addDispatchPlan(PlanBusDispatchPlan planBusDispatchPlan) {
		return planDao.addDispatchPlan(planBusDispatchPlan);
	}

	@Override
	public Map<String, Object> getDispatchPlanList(Map<String, Object> queryMap) {
		int totalCount=0;
		List<Map<String,String>> datalist = planDao.getDispatchPlanList(queryMap);
		totalCount = planDao.getDispatchPlanListCount(queryMap);
		Map<String, Object> result = new HashMap<String,Object>();
		result.put("draw", queryMap.get("draw"));
		result.put("recordsTotal", totalCount);
		result.put("recordsFiltered", totalCount);
		result.put("data", datalist);
		return result;
	}

	@Override
	public int getOrderDispatchQty(int orderId) {
		return planDao.getOrderDispatchQty(orderId);
	}

	@Override
	public int editDispatchPlan(PlanBusDispatchPlan planBusDispatchPlan) {
		return planDao.editDispatchPlan(planBusDispatchPlan);
	}

	@Override
	public List<Map<String, String>> getOrderDispatchList(Map<String, Object> conditionMap) {
		return planDao.getOrderDispatchList(conditionMap);
	}

	@Override
	@Transactional
	public Map<String, Object> saveOrderDispatchRecord(String curTime, String edit_user,String factory_id, String form_str,String cardNumber,String receiver) {
		//form_str:aaaaa,1,d,4,D2017007,,,; bbbbb,2,d,10,D2017007,,,
		String[] form_date = form_str.split(";");
		for (int i = 0 ; i <form_date.length ; i++ ) {
			String recode_str = form_date[i];
			String[] recode = recode_str.split(",",-1);
			Map<String, Object> recode_map = new HashMap<String,Object>();
			recode_map.put("tool_name", recode[0]);
			recode_map.put("single_use_qty", recode[1]);
			recode_map.put("unit", recode[2]);
			recode_map.put("quantity", recode[3]);
			recode_map.put("order_no", recode[4]);
			recode_map.put("receiver", receiver);
			recode_map.put("workcardid", cardNumber);
			recode_map.put("department", recode[7]);
			recode_map.put("factory_id", factory_id);
			recode_map.put("editor_id", edit_user);
			recode_map.put("edit_date", curTime);
			planDao.insertOrderDispatchRecord(recode_map);
		} 
		Map<String, Object> result = new HashMap<String,Object>();
		result.put("message", "SUCCESS");
		return result;
	}

	@Override
	public PlanBus getBusInfoByBusNo(Map<String, Object> conditionMap) {
		return planDao.getBusInfoByBusNo(conditionMap);
	}

	@Override
	public List<Map<String, Object>> getBusToolList() {
		return planDao.getBusToolList();
	}

	@Override
	@Transactional
	public Map<String, Object> saveDispatchRecord(String curTime, String edit_user, String form_str,String plan_status) {
		String[] form_date = form_str.split("\\u007C");
		for (int i = 0 ; i <form_date.length ; i++ ) {
			String recode_str = form_date[i];
			String[] recode = recode_str.split("\\u005E",-1);
			Map<String, Object> recode_map = new HashMap<String,Object>();
			recode_map.put("dispatch_plan_id", recode[0]);
			recode_map.put("bus_number", recode[1]);
			recode_map.put("dispatcher_id", edit_user);
			recode_map.put("receiver", recode[3]);
			recode_map.put("workcardid", recode[4]);
			recode_map.put("batch_desc", recode[5]);
			recode_map.put("flag_3c", recode[6]);
			recode_map.put("number_3c", recode[7]);
			recode_map.put("qtys", recode[8]);
			recode_map.put("curTime", curTime);
			recode_map.put("edit_user", edit_user);
			recode_map.put("plan_status", plan_status);
			planDao.insertDispatchRecord(recode_map);
			planDao.updateBusDispatchDate(recode_map);
			planDao.updateDispatchPlanStatus(recode_map);
			
		}
		return null;
	}

	@Override
	@Transactional
	public Map<String, Object> saveDispatchRecordKD(Map<String, Object> conditionMap) {
		planDao.insertDispatchRecord(conditionMap);
		planDao.updateBusDispatchDate(conditionMap);
		return null;
	}

	@Override
	public Map<String, Object> busDispatchQuery(Map<String, Object> conditionMap) {
		List<Map<String,Object>> datalist = planDao.getBusDispatchTotalList(conditionMap);
		int totalCount = planDao.getBusDispatchTotalCount(conditionMap);
		Map<String, Object> result = new HashMap<String,Object>();
		result.put("draw", conditionMap.get("draw"));
		result.put("recordsTotal", totalCount);
		result.put("recordsFiltered", totalCount);
		result.put("data", datalist);
		return result;
	}

	@Override
	public Map<String, Object> busDispatchDescQuery(Map<String, Object> conditionMap) {
		List<Map<String,Object>> datalist = planDao.getBusDispatchDetailList(conditionMap);
		int totalCount = planDao.getBusDispatchDetailCount(conditionMap);
		Map<String, Object> result = new HashMap<String,Object>();
		result.put("draw", conditionMap.get("draw"));
		result.put("recordsTotal", totalCount);
		result.put("recordsFiltered", totalCount);
		result.put("data", datalist);
		return result;
	}

}
