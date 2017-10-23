package com.byd.bms.report.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.ui.ModelMap;

import com.byd.bms.report.dao.IReportDao;
import com.byd.bms.report.service.IReportService;
import com.byd.bms.util.DataSource;
@Service
public class ReportServiceImpl implements IReportService {
	@Resource(name="reportDao")
	private IReportDao reportDao;
	
	@Override
	@DataSource("dataSourceSlave")
	public void getFactoryOutputYear(Map<String, Object> condMap, ModelMap model) {
		List<Map<String,Object>> resultList=new ArrayList<Map<String,Object>>();
		String[] keys=new String[12];
		keys[0]="自制件下线";
		keys[1]="部件下线";
		keys[2]="焊装上线";
		keys[3]="焊装下线";
		keys[4]="涂装上线";
		keys[5]="涂装下线";
		keys[6]="底盘上线";
		keys[7]="底盘下线";
		keys[8]="总装上线";
		keys[9]="总装下线";
		keys[10]="入库";
		keys[11]="发车";
		
		List<Map<String,Object>> datalist=reportDao.queryFactoryOutputYear(condMap);
		
		for(String key:keys){
			Map<String,Object> m=new HashMap<String,Object>();
			m.put("workshop", key);			
			m.put("output_1", 0);
			m.put("output_2", 0);
			m.put("output_3", 0);
			m.put("output_4", 0);
			m.put("output_5", 0);
			m.put("output_6", 0);
			m.put("output_7", 0);
			m.put("output_8", 0);
			m.put("output_9", 0);
			m.put("output_10", 0);
			m.put("output_11", 0);
			m.put("output_12", 0);
			
			for(Map<String,Object> d:datalist){
				String workshop=d.get("workshop").toString();
				if(workshop.equals(key)){
					String[] outputs=d.get("output_info").toString().split(",");
					for(int i=0;i<outputs.length;i++){
						String[] o=outputs[i].split(":");
						int month=Integer.parseInt(o[0]);
						String output=o[1];
						m.put("output_"+month, output);
					}
					
					break;
				}
				
				
			}
			
			resultList.add(m);
		}
				
		model.put("data", resultList);
	}

	@Override
	@DataSource("dataSourceSlave")
	public List<Map<String, Object>> showFactoryOutputReportData(Map<String, Object> queryMap) {		
		List<Map<String, Object>> datalist=new ArrayList<Map<String, Object>>();
		String date_array = queryMap.get("date_array").toString();
		String[] dateArray = date_array.split(",");	
		String startDate = dateArray[0];
		String endDate = dateArray[dateArray.length-1];
		String factory_id = queryMap.get("factory_id").toString();
		String[] factoryidArray = factory_id.split(",");
		String cur_factoryid ="";
		for(int j=0;j<factoryidArray.length;j++){
			cur_factoryid = factoryidArray[j];
			//System.out.println("-->cur_factoryid = " + cur_factoryid);
			Map<String, Object> map_sum = new HashMap<String,Object>();
			//自制件下线
			List<Map<String, Object>> conditionMap = new ArrayList<Map<String, Object>>();
//			for(int i = 0; i < dateArray.length; i++) {	
//				Map<String,Object> conditionMap1=new HashMap<String,Object>();
//				conditionMap1.put("factory_id", cur_factoryid);
//				conditionMap1.put("data", dateArray[i]);
//				conditionMap1.put("workshop", "自制件车间(下)");
//				conditionMap1.put("workshop_id", "1");
//				conditionMap1.put("startDate", startDate);
//				conditionMap1.put("endDate", endDate);
//				conditionMap.add(conditionMap1);
//			}
			List<Map<String, Object>> output_result =  new ArrayList<Map<String, Object>>();
//			output_result = reportDao.queryFactoryZzjOutputReportData(conditionMap);		
//			datalist.add(output_result.get(0));
//			map_sum.putAll(output_result.get(0));
			//部件下线
//			conditionMap = new ArrayList<Map<String, Object>>();
//			for(int i = 0; i < dateArray.length; i++) {	
//				Map<String,Object> conditionMap1=new HashMap<String,Object>();
//				conditionMap1.put("factory_id", cur_factoryid);
//				conditionMap1.put("data", dateArray[i]);
//				conditionMap1.put("workshop", "部件车间(下)");
//				conditionMap1.put("workshop_id", "2");
//				conditionMap1.put("startDate", startDate);
//				conditionMap1.put("endDate", endDate);
//				conditionMap.add(conditionMap1);
//			}
//			output_result =  new ArrayList<Map<String, Object>>();
//			output_result = reportDao.queryFactoryBjOutputReportData(conditionMap);		
//			datalist.add(output_result.get(0));
//			//统计汇总
//			map_sum.put("SUM", Double.valueOf(map_sum.get("SUM").toString()) + Double.valueOf(output_result.get(0).get("SUM").toString()));
//			for(int i = 0; i < dateArray.length; i++) {	
//				map_sum.put(dateArray[i], Double.valueOf(map_sum.get(dateArray[i]).toString()) + Double.valueOf(output_result.get(0).get(dateArray[i]).toString()));
//			}
			//焊装下线 welding_offline_date
			conditionMap = new ArrayList<Map<String, Object>>();
			for(int i = 0; i < dateArray.length; i++) {	
				Map<String,Object> conditionMap1=new HashMap<String,Object>();
				conditionMap1.put("production_plant_id", cur_factoryid);
				conditionMap1.put("data", dateArray[i]);
				conditionMap1.put("workshop", "welding_offline");
				conditionMap1.put("workshop_name", "Welding(Offline)");
				conditionMap1.put("workshop_id", "3");
				conditionMap1.put("startDate", startDate);
				conditionMap1.put("endDate", endDate);
				conditionMap.add(conditionMap1);
			}
			output_result =  new ArrayList<Map<String, Object>>();
			output_result = reportDao.queryFactoryOutputReportData(conditionMap);		
			datalist.add(output_result.get(0));
			map_sum.putAll(output_result.get(0));
			//统计汇总
			map_sum.put("SUM", Double.valueOf(map_sum.get("SUM").toString()) + Double.valueOf(output_result.get(0).get("SUM").toString()));
			for(int i = 0; i < dateArray.length; i++) {	
				map_sum.put(dateArray[i], Double.valueOf(map_sum.get(dateArray[i]).toString()) + Double.valueOf(output_result.get(0).get(dateArray[i]).toString()));
			}
			
			//涂装下线 painting_offline_date
			conditionMap = new ArrayList<Map<String, Object>>();
			for(int i = 0; i < dateArray.length; i++) {	
				Map<String,Object> conditionMap1=new HashMap<String,Object>();
				conditionMap1.put("production_plant_id", cur_factoryid);
				conditionMap1.put("data", dateArray[i]);
				conditionMap1.put("workshop", "painting_offline");
				conditionMap1.put("workshop_name", "Painting(Offline)");
				conditionMap1.put("workshop_id", "4");
				conditionMap1.put("startDate", startDate);
				conditionMap1.put("endDate", endDate);
				conditionMap.add(conditionMap1);
			}
			output_result =  new ArrayList<Map<String, Object>>();
			output_result = reportDao.queryFactoryOutputReportData(conditionMap);		
			datalist.add(output_result.get(0));
			//统计汇总
			map_sum.put("SUM", Double.valueOf(map_sum.get("SUM").toString()) + Double.valueOf(output_result.get(0).get("SUM").toString()));
			for(int i = 0; i < dateArray.length; i++) {	
				map_sum.put(dateArray[i], Double.valueOf(map_sum.get(dateArray[i]).toString()) + Double.valueOf(output_result.get(0).get(dateArray[i]).toString()));
			}
			
			//底盘下线 chassis_offline_date
			conditionMap = new ArrayList<Map<String, Object>>();
			for(int i = 0; i < dateArray.length; i++) {	
				Map<String,Object> conditionMap1=new HashMap<String,Object>();
				conditionMap1.put("production_plant_id", cur_factoryid);
				conditionMap1.put("data", dateArray[i]);
				conditionMap1.put("workshop", "chassis_offline");
				conditionMap1.put("workshop_name", "Chassis(Offline)");
				conditionMap1.put("workshop_id", "5");
				conditionMap1.put("startDate", startDate);
				conditionMap1.put("endDate", endDate);
				conditionMap.add(conditionMap1);
			}
			output_result =  new ArrayList<Map<String, Object>>();
			output_result = reportDao.queryFactoryOutputReportData(conditionMap);		
			datalist.add(output_result.get(0));
			//统计汇总
			map_sum.put("SUM", Double.valueOf(map_sum.get("SUM").toString()) + Double.valueOf(output_result.get(0).get("SUM").toString()));
			for(int i = 0; i < dateArray.length; i++) {	
				map_sum.put(dateArray[i], Double.valueOf(map_sum.get(dateArray[i]).toString()) + Double.valueOf(output_result.get(0).get(dateArray[i]).toString()));
			}
			
			//总装下线 assembly_offline_date
			conditionMap = new ArrayList<Map<String, Object>>();
			for(int i = 0; i < dateArray.length; i++) {	
				Map<String,Object> conditionMap1=new HashMap<String,Object>();
				conditionMap1.put("production_plant_id", cur_factoryid);
				conditionMap1.put("data", dateArray[i]);
				conditionMap1.put("workshop", "assembly_offline");
				conditionMap1.put("workshop_name", "Assembly(Offline)");
				conditionMap1.put("workshop_id", "6");
				conditionMap1.put("startDate", startDate);
				conditionMap1.put("endDate", endDate);
				conditionMap.add(conditionMap1);
			}
			output_result =  new ArrayList<Map<String, Object>>();
			output_result = reportDao.queryFactoryOutputReportData(conditionMap);		
			datalist.add(output_result.get(0));
			//统计汇总
			map_sum.put("SUM", Double.valueOf(map_sum.get("SUM").toString()) + Double.valueOf(output_result.get(0).get("SUM").toString()));
			for(int i = 0; i < dateArray.length; i++) {	
				map_sum.put(dateArray[i], Double.valueOf(map_sum.get(dateArray[i]).toString()) + Double.valueOf(output_result.get(0).get(dateArray[i]).toString()));
			}
			//计划工厂汇总
			map_sum.put("WORKSHOP", "Total");
			datalist.add(map_sum);
		}
		return datalist;
	}

	@Override
	@DataSource("dataSourceSlave")
	public void getOnlineAndOfflineData(Map<String, Object> condMap,
			ModelMap model) {
		List<Map<String,Object>> datalist=reportDao.queryOnlineAndOfflineData(condMap);
		model.put("data", datalist);
	}

	@Override
	@DataSource("dataSourceSlave")
	public void getFactoryPlanRateData(Map<String, Object> condMap,
			ModelMap model) {
		List<Map<String,Object>> resultList=new ArrayList<Map<String,Object>>();
		
		String[] keys=new String[12];
		keys[0]="自制件下线";
		keys[1]="部件下线";
		keys[2]="焊装上线";
		keys[3]="焊装下线";
		keys[4]="涂装上线";
		keys[5]="涂装下线";
		keys[6]="底盘上线";
		keys[7]="底盘下线";
		keys[8]="总装上线";
		keys[9]="总装下线";
		keys[10]="入库";
		keys[11]="发车";
		
		List<String> th_orderList=new ArrayList<String>();//订单列表
		List<String> th_orderNames=new ArrayList<String>();//订单列表
		
		List<Map<String,Object>> rate_list=reportDao.queryFactoryPlanRateList(condMap);
		List<Map<String,Object>> order_list=reportDao.queryPlanNodeOrderList(condMap);
		List<Map<String,Object>> exception_list=reportDao.queryExceptionList(condMap);
		
		//封装报表表头订单详情订单列表数据
		for(Map<String,Object> o : order_list){
			String order_id=o.get("order_id").toString();
			if(!th_orderList.contains(order_id)){
				th_orderList.add(order_id);
				String order_desc=o.get("order_desc")==null?"":o.get("order_desc").toString();
				th_orderNames.add(order_desc);
			}
		}
		
		for(String key:keys){
			Map<String,Object> m=new HashMap<String,Object>();
			m.put("workshop", key);	
			m.put("plan_qty", 0);
			m.put("done_qty", 0);
			m.put("rate", "");
			m.put("mark", "");
			
			//封装报表备注信息
			for(Map<String,Object> e: exception_list){
				if(key.indexOf(e.get("workshop").toString())>=0){
					m.put("mark", e.get("mark").toString());
					break;
				}
			}
			
			//封装计划达成数据
			for(Map<String,Object> e : rate_list){
				if(e.get("workshop").toString().equals(key)){
					m.put("plan_qty", e.get("plan_qty"));
					m.put("done_qty", e.get("quantity"));
					m.put("rate", e.get("rate"));
					break;
				}
			}	
			
			//封装报表各个节点的订单完成情况列表数据
			for(Map<String,Object> o : order_list){
				String order_id=o.get("order_id").toString();
				String workshop=o.get("workshop").toString();
				int index=th_orderList.indexOf(order_id);
				if(m.get("workshop").equals(workshop)){
					m.put("order_"+index, o.get("quantity"));
				}
			}
			
			resultList.add(m);
		}
	
		model.put("data", resultList);
		model.put("order_names", th_orderNames);
	}

	@Override
	public List<Map<String, Object>> queryPlanQty(
			Map<String, Object> conditionMap) {
		return reportDao.queryPlanQty(conditionMap);
	}

	@Override
	public List<Map<String, String>> getPlanSearchRealCount(List queryMapList) {
		return reportDao.getPlanSearchRealCount(queryMapList);
	}

	@Override
	public int getPlanPartsRealCount(Map<String, Object> conditionMap) {
		return reportDao.getPlanPartsRealCount(conditionMap);
	}

	@Override
	public int getPlanZzjRealCount(Map<String, Object> conditionMap) {
		return reportDao.getPlanZzjRealCount(conditionMap);
	}
	
	
}
