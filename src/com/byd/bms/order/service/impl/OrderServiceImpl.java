package com.byd.bms.order.service.impl;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.ModelMap;

import com.byd.bms.order.dao.IOrderDao;
import com.byd.bms.order.model.BmsOrder;
import com.byd.bms.order.service.IOrderService;
import com.byd.bms.util.DataSource;
import com.byd.bms.util.dao.ICommonDao;
import com.byd.bms.util.model.BmsBaseTask;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
@Service
@DataSource("dataSourceMaster")
public class OrderServiceImpl implements IOrderService {
	@Resource(name="orderDao")
	private IOrderDao orderDao;
	@Resource(name="commonDao")
	private ICommonDao commonDao;
	@Autowired 
	private HttpSession session;
	@Override
	public Map<String, Object> getOrderListPage(Map<String, Object> condMap) {
		int totalCount=0;
		List<Map<String, Object>> datalist=orderDao.getOrderList(condMap);
		totalCount=orderDao.getOrderTotalCount(condMap);
		Map<String, Object> result=new HashMap<String,Object>();
		result.put("draw", condMap.get("draw"));
		result.put("recordsTotal", totalCount);
		result.put("recordsFiltered", totalCount);
		result.put("data", datalist);
		return result;
	}
	
	@Override
	public List getOrderDetailList(Map<String, Object> conditionMap) {
		List datalist=new ArrayList();
		datalist=orderDao.getOrderDetailList(conditionMap);
		return datalist;
	}

	@Override
	@Transactional
	public void editOrder(BmsOrder order) {
		/**
		 * 修改BMS_ORDER表的订单数据
		 */		
		orderDao.updateOrder(order);
		int num_start=0;
		int num_end=0;
		Map<String,Object> bMap = orderDao.getBusNumberStartByProject(String.valueOf(order.getId()));
		if(bMap!=null&&!bMap.isEmpty()){
			num_start=Integer.parseInt(bMap.get("bus_number_start").toString());
			num_end=Integer.parseInt(bMap.get("bus_number_end").toString());
		}
		
		//根据减少的数量删除车辆信息
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("project_id", order.getId());
		condMap.put("bus_start", num_start+order.getQuantity());
		orderDao.deleteUnProcessBus(condMap);
		
		//根据增加的数量新增车辆信息
		List<Map<String,Object>> bus_list=new ArrayList<Map<String,Object>>();
		for(int i=num_end+1;i<=order.getQuantity();i++){
			Map<String,Object> bus=new HashMap<String,Object>();
			bus.put("project_id", order.getId());
			bus.put("bus_number", order.getProject_name()+"-"+(i));
			bus.put("production_plant_id", order.getProduction_plant_id());
			bus_list.add(bus);
		}
		if(bus_list.size()>0){
			orderDao.insertBus(bus_list);
		}
	}

	@Override
	public String getOrderSerial(String year) {
		String order_no=orderDao.queryOrderSerial(year);
		return order_no;
	}

	@Override
	@Transactional
	public void createOrder(BmsOrder order) {
		/**往BMS_ORDER 表中插入一条记录*/
		orderDao.insertOrder(order);
		
		/**
		 * 根据project_name获取车号最新流水
		 * 生成车号，车号规则：project_name+"-"+车号最新流水
		 */
		int series=Integer.parseInt(orderDao.queryBusLatestSerial(order.getProject_name()));
		List<Map<String,Object>> bus_list=new ArrayList<Map<String,Object>>();
		
		for(int i=1;i<=order.getQuantity();i++){
			Map<String,Object> bus=new HashMap<String,Object>();
			bus.put("project_id", order.getId());
			bus.put("bus_number", order.getProject_name()+"-"+(series+i));
			bus.put("production_plant_id", order.getProduction_plant_id());
			bus_list.add(bus);
		}
		
		if(bus_list.size()>0){
			orderDao.insertBus(bus_list);
		}
		
		// /**往当前任务表 BMS_BASE_TASK 中插入一条记录*/
		String param="?projectNo="+order.getProject_no();
		createTask("Import  BOM","1",param,"");
	}

	@Override
	@DataSource("dataSourceSlave")
	public List getBusNumberByOrder(Map<String, Object> conditionMap) {
		List datalist=new ArrayList();
		datalist=orderDao.queryBusNumberByOrder(conditionMap);
		return datalist;
	}

	@Override
	public Map<String, Object> getOrderByNo(Map<String, Object> queryMap) {
		return orderDao.getOrderByNo(queryMap);
	}
	// /**往当前任务表 BMS_BASE_TASK 中新增一个新任务*/
    public int createTask(String task_type,String count,String param,String factoryCode){
    	int result=0;
    	SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String curTime = df.format(new Date());
		String userid=String.valueOf(session.getAttribute("user_id"));
		Map conditionMap=new HashMap<String,Object>();
		conditionMap.put("task_type", task_type);
		conditionMap.put("param", param);
		List<Map<String,Object>> taskList=commonDao.queryTaskList(conditionMap);
		// 如果BMS_BASE_TASK 存在未完成的任务
		if(taskList.size()>0){  
			Map<String,Object> taskMap=taskList.get(0);
			// 任务类型task_type与参数param都相同  任务数在该记录上累加 将count加 1
			String exeistParam=taskMap.get("param")!=null ?((String)taskMap.get("param")).trim() : "";
			String exeistTasktype=taskMap.get("task_type")!=null ?((String)taskMap.get("task_type")).trim() : "";
			if(param.equals(exeistParam) && task_type.equals(exeistTasktype)){
				Map<String,Object> task=new HashMap<String,Object>();
				task.put("id",(String)taskMap.get("id"));
				task.put("count",count);
				task.put("task_type_name",task_type);
				task.put("editor_id", Integer.parseInt(userid));
				task.put("edit_date", curTime);
				commonDao.updateTask(task);
			}else{ // 新增一条记录
				List<Map<String, Object>> list=commonDao.queryTaskType(conditionMap);
				if(list.size()>0){
					Map<String,Object> map=list.get(0);
					if(map!=null && !map.isEmpty()){
						map.put("count", count);
						map.put("finish_count", "0");
						map.put("editor_id", Integer.parseInt(userid));
						map.put("edit_date", curTime);
						map.put("param", param);
						map.put("factory_code", factoryCode);
						result=commonDao.addTask(map);
					}
				}
			}			
		}else{ // 如果BMS_BASE_TASK的任务 都已完成，重新new一个task，新增一条记录
			List<Map<String, Object>> list=commonDao.queryTaskType(conditionMap);
			if(list.size()>0){
				Map<String,Object> map=list.get(0);
				if(map!=null && !map.isEmpty()){
					map.put("count", count);
					map.put("finish_count", "0");
					map.put("editor_id", Integer.parseInt(userid));
					map.put("edit_date", curTime);
					map.put("param", param);
					map.put("factory_code", factoryCode);
					result=commonDao.addTask(map);
				}
			}
		}
    	return result;
    }
 // /**更新任务表 BMS_BASE_TASK*/
    public int updateTask(String task_type,String finish_count){
    	int result=0;
		Map conditionMap=new HashMap<String,Object>();
		conditionMap.put("task_type", task_type);
		List<Map<String,Object>> list=commonDao.queryTaskList(conditionMap);
		if(list.size()>0){
			Map m=list.get(0);
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String curTime = df.format(new Date());
			String userid=String.valueOf(session.getAttribute("user_id"));
			Map<String,Object> task=new HashMap<String,Object>();
			task.put("id",(String)m.get("id"));
			task.put("finish_count",finish_count);
			task.put("task_type_name",task_type);
			task.put("handler", Integer.parseInt(userid));
			task.put("finish_date", curTime);
			result=commonDao.updateTask(task);
		}
    	return result;
    }

	@Override
	public Map<String, Object> getProjectBomList(Map<String, Object> condMap) {
		int totalCount=0;
		List<Map<String, Object>> datalist=orderDao.getProjectBomList(condMap);
		totalCount=orderDao.getProjectBomTotalCount(condMap);
		Map<String, Object> result=new HashMap<String,Object>();
		result.put("draw", condMap.get("draw"));
		result.put("recordsTotal", totalCount);
		result.put("recordsFiltered", totalCount);
		result.put("data", datalist);
		return result;
	}

	@Override
	@Transactional
	public int saveBomInfo(Map<String, Object> condMap) {
		int header_id=0;
		List bomList=(List) condMap.get("bom_list");
		Map<String,Object> m=orderDao.queryBomHeader(condMap);
		if(m!=null){
			header_id=Integer.parseInt(m.get("id").toString());
		}
		Map<String,Object> smap=new HashMap<String,Object>();
		smap.put("bomList", bomList);
		if(header_id==0){ // 此版本不存在，先保存HEAD表，在保存ITEM表
			orderDao.saveBomHeader(condMap);
			header_id=(int) condMap.get("id");	
			smap.put("bom_head_id", header_id);
			if(bomList.size()>0){
				orderDao.saveBomDetails(smap);
			}	
		}else{
			if(bomList.size()>0){
				orderDao.updateBomHeader(condMap); // 更新header
				orderDao.deleteBomByHeader(header_id); //根据header_id删除ITEM表记录
				smap.put("bom_head_id", header_id);
				orderDao.saveBomDetails(smap); // 保存到ITEM表
			}		
		}
		return 0;
	}

	@Override
	public Map<String, Object> getBomItemList(Map<String, Object> condMap) {
		int totalCount=0;
		List<Map<String, Object>> datalist=orderDao.getBomItemList(condMap);
		totalCount=orderDao.getBomItemTotalCount(condMap);
		Map<String, Object> result=new HashMap<String,Object>();
		result.put("draw", condMap.get("draw"));
		result.put("recordsTotal", totalCount);
		result.put("recordsFiltered", totalCount);
		result.put("data", datalist);
		return result;
	}

	@Override
	public Map<String, Object> getBomCompareList(
			Map<String, Object> condMap) {
		Map<String, Object> result=new HashMap<String,Object>();
		List<Map<String, Object>> versionList=orderDao.getMaxVersion(condMap);
		if(versionList.size()!=2){
			result.put("error", "P_showBomInfo_01");
			return result;
		}else{
			String currentVersion=(String)versionList.get(0).get("version");
			String prevVersion=(String)versionList.get(1).get("version");
			condMap.put("currentVersion", currentVersion);
			condMap.put("prevVersion", prevVersion);
			List<Map<String, Object>> datalist=null;
			if(condMap.get("compareType")!=null && condMap.get("compareType").toString().equals("difference")){
				datalist=orderDao.getBomCompareDiffList(condMap);
			}else{
			    datalist=orderDao.getBomCompareList(condMap);
			}
			result.put("data", datalist);
		}
		return result;
	}

	@Override
	public ModelMap getOrderQueryData(Map<String, Object> condMap) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void getBusInProcess(String project_id, ModelMap model) {
		Map<String,Object> data=null;
		data=orderDao.queryBusInProcessByProject(project_id);
		if(data==null){
			data=new HashMap<String,Object>();
		}
		model.put("data", data);
	}

	public ModelMap getProjectQueryData(Map<String, Object> condMap) {
		List datalist=new ArrayList();
		datalist=orderDao.queryProjectQueryList(condMap);
		int totalCount=orderDao.queryProjectQueryListCount(condMap);		
		
		ModelMap model=new ModelMap();
		model.put("draw", condMap.get("draw"));
		model.put("recordsTotal", totalCount);
		model.put("recordsFiltered", totalCount);
		model.put("data", datalist);
		return model;
	}
	public List getBusNumberByProject(Map<String, Object> conditionMap) {
		List datalist=new ArrayList();
		datalist=orderDao.queryBusNumberByProject(conditionMap);
		return datalist;
	}

}
