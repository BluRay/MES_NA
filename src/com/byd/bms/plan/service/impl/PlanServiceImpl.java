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
	public List<Map<String, String>> checkProductionPlan(Map<String, Object> queryMap) {
		return planDao.checkProductionPlan(queryMap);
	}

}
