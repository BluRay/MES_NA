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
import com.byd.bms.plan.service.IPlanService;
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
		String project_no = "";			//订单编号 同一个文件只能导入一个订单
		String factory_name = "";
		String plan_month = "";
		int curMonth = Integer.valueOf(new SimpleDateFormat("yyyyMM").format(dd));
		int cur_day = Integer.valueOf(new SimpleDateFormat("dd").format(dd));
		
		for(int i=0;i<lineCount;i++){
			if (i==0){
				project_no = excelModel.getData().get(i)[0].toString().trim();
				factory_name = excelModel.getData().get(i)[1].toString().trim();
				plan_month = excelModel.getData().get(i)[3].toString().trim();				
				plan_month = plan_month.substring(0, 4) + "-" +  plan_month.substring(4, 6);
			}
			PlanMasterPlan newMasterPlan = new PlanMasterPlan();
			newMasterPlan.setVersion(new SimpleDateFormat("yyyyMMddHHmmss").format(dd));
			newMasterPlan.setProject_no(project_no);
			newMasterPlan.setFactory_name(factory_name);
			newMasterPlan.setPlan_node(excelModel.getData().get(i)[2].toString().trim());
			newMasterPlan.setMonth(plan_month);
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

			//计划导入后自动发布，只发布当前日期之后的计划
			//删除原发布数据
			if (Integer.valueOf(excelModel.getData().get(i)[3].toString().trim()) == curMonth ){
				//System.out.println("本月计划,cur_day = " + plan_month + "-" + ((cur_day<10)?"0":"") + cur_day);
				//删除当天以后的原发布数据
				Map<String, Object> conditionMap = new HashMap<String, Object>();
				conditionMap.put("project_no", project_no);
				conditionMap.put("plan_node", excelModel.getData().get(i)[2].toString().trim());
				conditionMap.put("plan_month", plan_month);
				conditionMap.put("cur_day", plan_month + "-" + ((cur_day<10)?"0":"") + cur_day);
				planDao.deleteProductionPlan(conditionMap);
			}
			if (Integer.valueOf(excelModel.getData().get(i)[3].toString().trim()) > curMonth ){
				//System.out.println("未来月份计划");
				//删除计划月份原发布数据
				Map<String, Object> conditionMap = new HashMap<String, Object>();
				conditionMap.put("project_no", project_no);
				conditionMap.put("plan_node", excelModel.getData().get(i)[2].toString().trim());
				conditionMap.put("plan_month", plan_month);
				conditionMap.put("cur_day", "");
				planDao.deleteProductionPlan(conditionMap);
			}
			if (Integer.valueOf(excelModel.getData().get(i)[3].toString().trim()) < curMonth ){
				//System.out.println("历史计划");
			}
			for (int j=1;j<=31;j++){
				
				if(!excelModel.getData().get(i)[3+j].toString().trim().equals("") && !excelModel.getData().get(i)[3+j].toString().trim().equals("0")){
					System.out.println("Plan node = " + excelModel.getData().get(i)[2].toString().trim());
					System.out.println("plan_date = " + plan_month + "-" + j);
					System.out.println("plan num = " + excelModel.getData().get(i)[3+j].toString().trim());
					Map<String, Object> conditionMap = new HashMap<String, Object>();
					conditionMap.put("project_no", project_no);
					conditionMap.put("factory_name", factory_name);
					conditionMap.put("plan_node", excelModel.getData().get(i)[2].toString().trim());
					conditionMap.put("plan_date", plan_month + "-" + ((j<10)?"0":"") + j);
					conditionMap.put("plan_qty", excelModel.getData().get(i)[3+j].toString().trim());
					conditionMap.put("curTime", curTime);
					conditionMap.put("userid", userid);
					
					if (Integer.valueOf(excelModel.getData().get(i)[3].toString().trim()) == curMonth ){
						if (j > cur_day){
							planDao.insertProductionPlan(conditionMap);
						}
					}
					if (Integer.valueOf(excelModel.getData().get(i)[3].toString().trim()) > curMonth ){
						planDao.insertProductionPlan(conditionMap);
					}
					
				}
				
			}
			
		}		
		return result;
	}
	
	@Override
	public Map<String, Object> getPlanMasterIndex(Map<String, Object> queryMap) {
		int totalCount=0;
		List<Map<String,Object>> datalist = planDao.getPlanMasterIndex(queryMap);
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
	@Transactional
	public int reVisionPlan(String factory_id,String factory_name, String order_no, String revision_str, String plan_month,String userId) {
		List<PlanMasterPlan> datalist=new ArrayList<PlanMasterPlan>();
		//复制指定工厂ID指定订单编号 最新版本 最大flag 的计划，保存flag+1
		Map<String,Object> conditionMap=new HashMap<String,Object>();
		conditionMap.put("version", "");
		conditionMap.put("factory_id", factory_id);
		conditionMap.put("factory_name", factory_name);
		conditionMap.put("project_no", order_no);
		conditionMap.put("plan_month", plan_month);
		datalist=planDao.getPlanMasterList(conditionMap);
		SimpleDateFormat df2 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String creatTime = df2.format(new Date());
		for(int i=0;i<datalist.size();i++){
			PlanMasterPlan copyPlanMasterPlan = (PlanMasterPlan) datalist.get(i);
			copyPlanMasterPlan.setFlag(String.valueOf(Integer.parseInt(copyPlanMasterPlan.getFlag())+1));
			copyPlanMasterPlan.setCreate_date(creatTime);
			planDao.insertPlanMaster(copyPlanMasterPlan);
			datalist.set(i, copyPlanMasterPlan);
		}
		//根据revision_str 更新计划信息  11,3,0,201507,1,8,0; [order_id,factory,i,month,day,num,old_num]
		if (revision_str.length()>0){
			String[] revisionStrArray=revision_str.split(";");
			for(int i = 0; i < revisionStrArray.length; i++){
				String[] revisionArray = revisionStrArray[i].split(",");
				PlanMasterPlan editPlanMasterPlan = (PlanMasterPlan) datalist.get(Integer.parseInt(revisionArray[2])-1);
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
			//调整今天以后的计划需自动重新发布
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			Date dd = new Date();
			String curTime = df.format(dd);
			int curMonth = Integer.valueOf(new SimpleDateFormat("yyyyMM").format(dd));
			int curDay = Integer.valueOf(new SimpleDateFormat("dd").format(dd));
			int thisMonth = Integer.parseInt(revisionArray[3].replace("-", ""));
			String thisMonthStr = revisionArray[3];
			int thisDay = Integer.parseInt(revisionArray[4]);
			Map<String, Object> condMap = new HashMap<String, Object>();
			condMap.put("project_id", Integer.parseInt(revisionArray[0]));
			condMap.put("plant_id", Integer.parseInt(revisionArray[1]));
			condMap.put("plan_code_value", (Integer.parseInt(revisionArray[2])==9)?10:Integer.parseInt(revisionArray[2]));
			condMap.put("cur_day", thisMonthStr + "-" + ((thisDay<10)?"0":"") + thisDay);
			condMap.put("plan_date", thisMonthStr + "-" + ((thisDay<10)?"0":"") + thisDay);
			condMap.put("plan_qty", Integer.parseInt(revisionArray[5]));
			condMap.put("curTime", curTime);
			condMap.put("userid", userId);
			if(thisMonth == curMonth){
				if(thisDay > curDay){
					planDao.deleteOneProductionPlan(condMap);
					planDao.insertOneProductionPlan(condMap);
				}
			}else if (thisMonth > curMonth){
				planDao.deleteOneProductionPlan(condMap);
				planDao.insertOneProductionPlan(condMap);
			}
			
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
		//logger.info("---->startDate = " + startDate + "|endDate = " + endDate);
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
					//logger.info("-->factory_id = " + detailList.get(i)[0] + "|order_no = " + detailList.get(i)[1] + "|plan_code_id = " + detailList.get(i)[34]);
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
					case 1:
						conditionMap2.put("workshop", "welding_online");conditionMap3.put("workshop", "welding_online");break;
					case 2:
						conditionMap2.put("workshop", "welding_offline");conditionMap3.put("workshop", "welding_offline");break;
					case 3:
						conditionMap2.put("workshop", "painting_online");conditionMap3.put("workshop", "painting_online");break;
					case 4:
						conditionMap2.put("workshop", "painting_offline");conditionMap3.put("workshop", "painting_offline");break;
					case 5:
						conditionMap2.put("workshop", "chassis_online");conditionMap3.put("workshop", "chassis_online");break;
					case 6:
						conditionMap2.put("workshop", "chassis_offline");conditionMap3.put("workshop", "chassis_offline");break;
					case 7:
						conditionMap2.put("workshop", "assembly_online");conditionMap3.put("workshop", "assembly_online");break;
					case 8:
						conditionMap2.put("workshop", "assembly_offline");conditionMap3.put("workshop", "assembly_offline");break;
					case 11:
						conditionMap2.put("workshop", "outgoing");conditionMap3.put("workshop", "outgoing");break;
					}
					total_month = planDao.getPlanSearchTotalRealQty(conditionMap2);
					total_order = planDao.getPlanSearchTotalRealQty(conditionMap3);
					
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
		//logger.info("-->month = " + month);
		String workshop = "";
		if (!queryMap.get("workshop").toString().equals("All")) workshop = queryMap.get("workshop").toString();
		String[] detailArray_1 = new String[35];  String[] detailArray_1_real = new String[35];
		String[] detailArray_2 = new String[35];  String[] detailArray_2_real = new String[35];
		String[] detailArray_3 = new String[35];  String[] detailArray_3_real = new String[35];
		String[] detailArray_4 = new String[35];  String[] detailArray_4_real = new String[35];
		String[] detailArray_5 = new String[35];  String[] detailArray_5_real = new String[35];
		String[] detailArray_6 = new String[35];  String[] detailArray_6_real = new String[35];
		String[] detailArray_7 = new String[35];  String[] detailArray_7_real = new String[35];
		String[] detailArray_8 = new String[35];  String[] detailArray_8_real = new String[35];
		String[] detailArray_9 = new String[35];  String[] detailArray_9_real = new String[35];
		
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
				conditionMap2.put("workshop", resultMap.get("key_name_en"));
				conditionMap2.put("plan_date", dateArray[i]);
				
				int real_qty = planDao.getPlanSearchRealQty(conditionMap2);
				//logger.info("---->real_qty = " + conditionMap2.get("factory_id") + "|" + conditionMap2.get("order_no") + "|" + conditionMap2.get("workshop") + "|" + String.valueOf(real_qty));
				resultMap.put("sum_real_qty", String.valueOf(real_qty));
				
			}
			if (i==0){
				detailArray_1[0]=queryMap.get("factory_id").toString();
				detailArray_1[1]=queryMap.get("order_no").toString();
				detailArray_1[2]="WeldingOnlinePlan";detailArray_1[34]="1";					
				detailArray_2[0]=queryMap.get("factory_id").toString();
				detailArray_2[1]=queryMap.get("order_no").toString();
				detailArray_2[2]="WeldingOfflinePlan";detailArray_2[34]="2";	
				detailArray_3[0]=queryMap.get("factory_id").toString();
				detailArray_3[1]=queryMap.get("order_no").toString();
				detailArray_3[2]="PaintingOnlinePlan";detailArray_3[34]="3";				
				
				detailArray_1_real[0]=queryMap.get("factory_id").toString();
				detailArray_1_real[1]=queryMap.get("order_no").toString();
				detailArray_1_real[2]="WeldingOnlineFinish";detailArray_1_real[34]="1";					
				detailArray_2_real[0]=queryMap.get("factory_id").toString();
				detailArray_2_real[1]=queryMap.get("order_no").toString();
				detailArray_2_real[2]="WeldingOfflineFinish";detailArray_2_real[34]="2";			
				detailArray_3_real[0]=queryMap.get("factory_id").toString();
				detailArray_3_real[1]=queryMap.get("order_no").toString();
				detailArray_3_real[2]="PaintingOnlineFinish";detailArray_3_real[34]="3";
				
				detailArray_4[0]=queryMap.get("factory_id").toString();
				detailArray_4[1]=queryMap.get("order_no").toString();
				detailArray_4[2]="PaintingOfflinePlan";detailArray_4[34]="4";			
				detailArray_5[0]=queryMap.get("factory_id").toString();
				detailArray_5[1]=queryMap.get("order_no").toString();
				detailArray_5[2]="ChassisOnlinePlan";detailArray_5[34]="5";
				
				detailArray_4_real[0]=queryMap.get("factory_id").toString();
				detailArray_4_real[1]=queryMap.get("order_no").toString();
				detailArray_4_real[2]="PaintingOfflineFinish";detailArray_4_real[34]="4";
				detailArray_5_real[0]=queryMap.get("factory_id").toString();
				detailArray_5_real[1]=queryMap.get("order_no").toString();
				detailArray_5_real[2]="ChassisOnlinePlanFinish";detailArray_5_real[34]="5";
				
				detailArray_6[0]=queryMap.get("factory_id").toString();
				detailArray_6[1]=queryMap.get("order_no").toString();
				detailArray_6[2]="ChassisOfflinePlan";detailArray_6[34]="6";
				detailArray_7[0]=queryMap.get("factory_id").toString();
				detailArray_7[1]=queryMap.get("order_no").toString();
				detailArray_7[2]="AssemblyOnlinePlan";detailArray_7[34]="7";
				
				detailArray_6_real[0]=queryMap.get("factory_id").toString();
				detailArray_6_real[1]=queryMap.get("order_no").toString();
				detailArray_6_real[2]="ChassisOfflineFinish";detailArray_6_real[34]="6";
				detailArray_7_real[0]=queryMap.get("factory_id").toString();
				detailArray_7_real[1]=queryMap.get("order_no").toString();
				detailArray_7_real[2]="AssemblyOnlineFinish";detailArray_7_real[34]="7";
				
				detailArray_8[0]=queryMap.get("factory_id").toString();
				detailArray_8[1]=queryMap.get("order_no").toString();
				detailArray_8[2]="AssemblyOfflinePlan";detailArray_8[34]="8";
				detailArray_9[0]=queryMap.get("factory_id").toString();
				detailArray_9[1]=queryMap.get("order_no").toString();
				detailArray_9[2]="WarehousingPlan";detailArray_9[34]="11";
				
				detailArray_8_real[0]=queryMap.get("factory_id").toString();
				detailArray_8_real[1]=queryMap.get("order_no").toString();
				detailArray_8_real[2]="AssemblyOfflineFinish";detailArray_8_real[34]="8";
				detailArray_9_real[0]=queryMap.get("factory_id").toString();
				detailArray_9_real[1]=queryMap.get("order_no").toString();
				detailArray_9_real[2]="WarehousingFinish";detailArray_9_real[34]="11";
				
				
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
					}
				}
			}
		}
		return detailList;
	}
	
}
