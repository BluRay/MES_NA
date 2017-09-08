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
import com.byd.bms.order.model.BmsFactoryOrderDetail;
import com.byd.bms.order.model.BmsOrder;
import com.byd.bms.order.model.BmsOrderConfigAllot;
import com.byd.bms.order.model.BmsOrderConfigDetail;
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
	public int getBusNumberStart(Map<String, Object> conditionMap) {
		int num=orderDao.getBusNumberStart(conditionMap);
		return num;
	}

	@Override
	public List getOrderDetailList(Map<String, Object> conditionMap) {
		List datalist=new ArrayList();
		datalist=orderDao.getOrderDetailList(conditionMap);
		return datalist;
	}

	@Override
	@Transactional
	public void editOrder(JSONArray jsar_del, JSONArray jsar, Map<String,String> ordermap) {
		/**
		 * 修改BMS_ORDER表的订单数据
		 */
		BmsOrder order = new BmsOrder();
		int order_id=Integer.parseInt(ordermap.get("order_id"));
		int userid=Integer.parseInt(ordermap.get("userid"));
		String curTime=(String)ordermap.get("curTime");
		
		order.setId(order_id);
		order.setDelivery_date((String) ordermap.get("delivery_date"));
		order.setMemo((String)ordermap.get("memo"));
		order.setCustomer(ordermap.get("customer").toString());
		orderDao.updateOrder(order);
		
		/**
		 * 如果jel_del不为空，删除factory_order
		 */
		
		Iterator it_del=jsar_del.iterator();
		//Gson gson = new Gson();
		while(it_del.hasNext()){
			JSONObject jel=(JSONObject) it_del.next();
			BmsFactoryOrderDetail del_map=(BmsFactoryOrderDetail) JSONObject.toBean(jel, BmsFactoryOrderDetail.class);
			int factory_order_id=del_map.getFactory_order_id();
			
			orderDao.deleteFactoryOrderById(factory_order_id);
		}	
		
		/**
		 * 遍历jsar，无order_id的往BMS_OR_FACTORY_ORDER表中
		 * 新增一行数据;有order_id的修改BMS_OR_FACTORY_ORDER表对应数据
		 */
		
		Iterator it_order=jsar.iterator();
		while(it_order.hasNext()){
			JSONObject jel=(JSONObject) it_order.next();
			BmsFactoryOrderDetail omap=(BmsFactoryOrderDetail) JSONObject.toBean(jel, BmsFactoryOrderDetail.class);
			int factory_order_id=omap.getFactory_order_id();
			int production_qty=omap.getProduction_qty();
			int busnum_start=omap.getBusnum_start();
			int busnum_end=omap.getBusnum_end();
			int factory_id=omap.getFactory_id();
			
			BmsFactoryOrderDetail factoryorder=new BmsFactoryOrderDetail();
			factoryorder.setFactory_order_id(factory_order_id);
			factoryorder.setFactory_id(factory_id);
			factoryorder.setOrder_id(order_id);
			factoryorder.setBusnum_start(busnum_start);
			factoryorder.setBus_number_start(busnum_start);
			factoryorder.setBusnum_end(busnum_end);
			factoryorder.setProduction_qty(production_qty);
			factoryorder.setEditor_id(userid);
			factoryorder.setEdit_date(curTime);
			if(factory_order_id==0){			
				orderDao.insertFactoryOrder(factoryorder);
				factory_order_id=factoryorder.getId();
			}else{
				orderDao.updateFactoryOrder(factoryorder);//更新工厂订单production_qty 加上新的产地分配数量
			}
		}
		//当production_qty减少为0时删除该factory_order
		orderDao.deleteFactoryOrderNoProduction(Integer.parseInt(ordermap.get("order_id")));
	}

	@Override
	public String getOrderSerial(String year) {
		String order_no=orderDao.queryOrderSerial(year);
		return order_no;
	}

	@Override
	@Transactional
	public void createOrder(BmsOrder order, String factoryOrderNum) {
		/**往BMS_ORDER 表中插入一条记录*/
		orderDao.insertOrder(order);
		String[] strarray=factoryOrderNum.split(",");
		
		//计算当前订单 车号起始值
		String productive_year = order.getProductive_year();
		String orderType=order.getOrder_type();
		Map<String,Object> conditionMap=new HashMap<String,Object>();
		conditionMap.put("productive_year", productive_year);
		conditionMap.put("order_id", order.getId());
		int busNumberStart = orderDao.getBusNumberStart(conditionMap) + 1;
		int busnum_start = busNumberStart;		//开始流水号
		if("KD件".equals(orderType)){
			busnum_start=0;
		}
		int busnum_end = 0;			//开始流水号
		int newOrderId = order.getId();	
		
		for(int i = 0; i < strarray.length; i++) {			
			int factory_id = Integer.parseInt(strarray[i].substring(0, strarray[i].indexOf(":")));
			int production_qty = Integer.parseInt(strarray[i].substring(strarray[i].indexOf(":") + 1, strarray[i].length()));			
			busnum_end = busnum_start + production_qty - 1;			
			//开始写入订单工厂表BMS_OR_FACTORY_ORDER
			BmsFactoryOrderDetail factoryOrder = new BmsFactoryOrderDetail();
			factoryOrder.setOrder_id(newOrderId);
			factoryOrder.setFactory_id(factory_id);
			factoryOrder.setProduction_qty(production_qty);
			factoryOrder.setBus_number_start(busNumberStart);
			factoryOrder.setEditor_id(order.getEditor_id());
			factoryOrder.setEdit_date(order.getEdit_date());
			
			if("KD件".equals(orderType)){
				factoryOrder.setBus_number_start(busnum_start);
			}else{
				factoryOrder.setBus_number_start(busNumberStart);
			}
			busNumberStart+=production_qty;
			factoryOrder.setBusnum_start(busnum_start);
			factoryOrder.setBusnum_end(busnum_end);

			
			orderDao.insertFactoryOrder(factoryOrder);
			
			busnum_start = busnum_end + 1;
			
		}
		// /**往当前任务表 BMS_BASE_TASK 中插入一条记录*/
		String param="?orderNo="+order.getOrder_no();
		createTask("配置导入","1",param,"");
	}

	@Override
	@DataSource("dataSourceSlave")
	public List getBusNumberByOrder(Map<String, Object> conditionMap) {
		List datalist=new ArrayList();
		datalist=orderDao.queryBusNumberByOrder(conditionMap);
		return datalist;
	}

	@Override
	public Map<String, Object> getOrderConfigListPage(
			Map<String, Object> condMap) {
		int totalCount=0;
		List<Map<String, Object>> datalist=orderDao.getOrderConfigList(condMap);
		totalCount=orderDao.getConfigTotalCount(condMap);
		Map<String, Object> result=new HashMap<String,Object>();
		result.put("draw", condMap.get("draw"));
		result.put("recordsTotal", totalCount);
		result.put("recordsFiltered", totalCount);
		result.put("data", datalist);
		return result;
	}

	@Override
	public List getConfigDetailList(String configId) {
		List datalist=new ArrayList();
		datalist=orderDao.queryConfigDetailList(configId);
		return datalist;
	}

	@Override
	@Transactional
	public void saveOrderConfigDetail(Map<String, Object> configDetail) {
		int config_id=(int)configDetail.get("config_id");
		String config_detail=(String)configDetail.get("config_detail");
		List detail_list=new ArrayList();
	/*	JsonArray jsa=new JsonArray();
		JsonParser parser=new JsonParser();
		JsonElement jel=parser.parse(config_detail);
		Gson gson = new Gson();
		if (jel.isJsonArray()) {
			jsa=jel.getAsJsonArray();
		}*/
		JSONArray jsa=new JSONArray();
		if(config_detail.contains("[")){
			jsa=JSONArray.fromObject(config_detail);
		}
		Iterator it=jsa.iterator();
		while(it.hasNext()){
			JSONObject el= (JSONObject) it.next();
			BmsOrderConfigDetail detail=(BmsOrderConfigDetail) JSONObject.toBean(el, BmsOrderConfigDetail.class);
			detail_list.add(detail);
		}
		
		Map<String,Object> smap=null;
		if(config_id==0){
			orderDao.saveOrderConfig(configDetail);
			int config_id_new=(int) configDetail.get("id");	
			smap=new HashMap<String,Object>();
			smap.put("config_id", config_id_new);
			smap.put("detail_list", detail_list);
			
			if(detail_list.size()>0){
				orderDao.saveConfigDetails(smap);
			}	
			//**更新任务表 BMS_BASE_TASK 的finish_count【param1：task_type ; param2:finish_count】 */
			updateTask("配置导入","1");
			// /**往当前任务表 BMS_BASE_TASK 中插入一条记录*/
			int order_id=(int)configDetail.get("order_id");
			Map conditionMap=new HashMap<String,Object>();
			conditionMap.put("orderId", order_id);
			List<Map<String,Object>> factoryOrderList=orderDao.getOrderList(conditionMap);
			for(Map factoryOrderMap : factoryOrderList){
				String param="?orderNo="+factoryOrderMap.get("order_no")+"&factory="+factoryOrderMap.get("factory_id");
				createTask("配置分配","1",param,(String)factoryOrderMap.get("factory_code"));
			}
		}else{
			orderDao.updateOrderConfig(configDetail);
			if(detail_list.size()>0){
				smap=new HashMap<String,Object>();
				smap.put("config_id", config_id);
				smap.put("detail_list", detail_list);
				orderDao.deleteConfigDetailById(config_id);
				orderDao.saveConfigDetails(smap);
			}
		}	
	}
	/**
	 * 分页查询配置分配列表数据
	 */
	@Override
	public Map<String, Object> getConfigAllotListPage(
			Map<String, Object> condMap) {
		int totalCount=0;
		List<Map<String, Object>> datalist=orderDao.queryConfigAllotList(condMap);
		totalCount=orderDao.queryConfigAllotTotalCount(condMap);
		Map<String, Object> result=new HashMap<String,Object>();
		result.put("draw", condMap.get("draw"));
		result.put("recordsTotal", totalCount);
		result.put("recordsFiltered", totalCount);
		result.put("data", datalist);
		return result;
	}

	@Override
	public List getConfigListByOrder(Map<String, Object> condMap) {
		List datalist=new ArrayList();
		datalist=orderDao.queryConfigListByOrder(condMap);
		return datalist;
	}

	@Override
	public void saveOrderConfigAllot(List detail_list) {
		orderDao.batchSaveFactoryOrderConfig(detail_list);
		for(Object bean : detail_list){
			BmsOrderConfigAllot entity=(BmsOrderConfigAllot) bean;
			if(entity.getId()==0){
				updateTask("配置分配","1");
				break;
			}
		}
		
	}

	@Override
	@DataSource("dataSourceSlave")
	public ModelMap getOrderQueryData(Map<String, Object> condMap) {
		List datalist=new ArrayList();
		datalist=orderDao.queryOrderQueryList(condMap);
		int totalCount=orderDao.queryOrderQueryListCount(condMap);		
		
		ModelMap model=new ModelMap();
		model.put("draw", condMap.get("draw"));
		model.put("recordsTotal", totalCount);
		model.put("recordsFiltered", totalCount);
		model.put("data", datalist);
		return model;
	}

	@Override
	public void getOrderConfigTotalQty(String order_id, ModelMap model) {
		model.put("data", orderDao.queryOrderConfigTotalQty(order_id));
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
}
