/**
 * 
 */
package com.byd.bms.production.service.impl;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import javax.annotation.Resource;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.ModelMap;
import com.byd.bms.production.dao.IProductionDao;
import com.byd.bms.production.service.IProductionService;
import com.byd.bms.util.DataSource;

/**
 * @author xiong.jianwu
 *	生产模块service实现
 */
@Service
@DataSource("dataSourceMaster")
public class ProductionServiceImpl implements IProductionService {
	static Logger logger = Logger.getLogger(ProductionServiceImpl.class.getName());
	@Resource(name="productionDao")
	private IProductionDao productionDao;

	@Override
	public Map<String, Object> getVinList(Map<String, Object> conditionMap) {
		//int totalCount=0;
		List<Map<String, Object>> datalist=productionDao.getVinList(conditionMap);
		//totalCount=productionDao.getVinTotalCount(conditionMap);
		Map<String, Object> result=new HashMap<String,Object>();
		//result.put("draw", conditionMap.get("draw"));
		//result.put("recordsTotal", totalCount);
		//result.put("recordsFiltered", totalCount);
		result.put("data", datalist);
		return result;
	}

	@Override
	@Transactional
	public int batchUpdateVin(List<Map<String, Object>> list) {
		return productionDao.batchUpdateVin(list);
	}
	
	/*****************************xiong jianwu start  *****************************/
	/**
	 * 查询线别工序列表
	 */
	@Override
	public List getLineProcessList(Map<String, Object> condMap) {
		List datalist=new ArrayList();
		datalist=productionDao.queryLineProcessList(condMap);
		return datalist;
	}

	@Override
	public List<Map<String, Object>> getStationMonitorSelect(Map<String, Object> condMap) {
		
		return productionDao.queryProcessMonitorList(condMap);
	}
	
	@Override
	public List<Map<String, Object>> getKeyParts(Map<String, Object> condMap) {
		List<Map<String, Object>> keyParts=productionDao.queryKeyParts(condMap);
		if(keyParts==null){
			keyParts=new ArrayList<Map<String,Object>>();
		}
		return keyParts;
	}

	@Override
	public Map<String, Object> getBusInfo(String bus_number) {
		Map<String,Object> businfo=new HashMap<String,Object>();
		businfo=productionDao.queryBusInfo(bus_number);

		return businfo;
	}
	
	/**
	 *车辆扫描，判断该工序是否有扫描记录，未扫描判断上一个扫描节点是否有扫描记录，无则提示先扫描上一个节点
	 * 保存扫描信息、关键零部件信息、更新bus表对应车辆的latest_station_id 
	 */
	@Override
	@Transactional
	public Map<String,Object> scan(Map<String, Object> condMap,List partsList) {
		Map<String,Object> rMap=new HashMap<String,Object>();
		String plan_node_name=condMap.get("plan_node_name")==null?"":condMap.get("plan_node_name").toString();
		String on_offline=condMap.get("on_offline").toString();
		String rework=condMap.get("rework").toString();
		/**
		 * 返修扫描，判断该节点是否扫描上线，已上线：保存返修记录（扫描记录和关键零部件信息）;未上线：提示先扫描该节点上线
		 */
		if(rework.equals("1")){
			Map<String, Object> reMap=new HashMap<String,Object>();
			reMap.putAll(condMap);
			reMap.put("on_offline", "online");
			
			Map<String,Object> onlineRecord=productionDao.queryScanNodeRecord(reMap);
			if(onlineRecord==null){//未上线扫描
				rMap.put("success", false);
				rMap.put("message", "该节点未扫描上线，请先扫描"+condMap.get("station_name")+"上线!");
				return rMap;
			}else{
				productionDao.saveScanRecord(condMap);//保存扫描记录
				if(partsList.size()>0){
					productionDao.updateParts(partsList);//更新关键零部件信息
				}
				rMap.put("success", true);
				rMap.put("message", "Succeed！");
				return rMap;
			}
			
		}
		
		/**
		 * 正常扫描逻辑:先判断是否存在该节点扫描记录，已存在：更新关键零部件信息；
		 * 不存在：判断是扫描上线还是下线，下线扫描则判断上线是否已经扫描，上线扫描则判断上一个扫描节点是否扫描了下线
		 * 焊装上线扫描时：订单第一台车辆扫描焊装上线，更新订单状态为“In process”
		 * 车辆入库扫描时：订单最后一台车辆扫描入库下线，更新订单状态为“Completed”
		 */	
		Map<String,Object> scanRecord=productionDao.queryScanNodeRecord(condMap);//查询当前节点扫描记录
		if(scanRecord==null){//不存在扫描记录
			if(on_offline.equals("online")){//上线扫描
				Map<String,Object> lastScanNode=productionDao.queryLastScanNode(condMap);
				if(lastScanNode==null){//不存在上一扫描节点
					productionDao.saveScanRecord(condMap);
					
					//计划节点上线扫描时更新上线车间上线时间，工厂下线节点扫描时才更新车间下线时间
					productionDao.updateBusProcess(condMap);
					if(plan_node_name.contains(condMap.get("on_offline").toString())){
						productionDao.updateBusPlanNodeDate(condMap);
					}
				}else{//存在上一扫描节点，判断上一扫描节点是否扫描下线
					condMap.put("last_station_name", lastScanNode.get("station_name"));
					Map<String,Object> scanRecord_last=productionDao.queryScanLastScanNode(condMap);
					if(scanRecord_last==null){//上一扫描节点未扫描下线
						rMap.put("success", false);
						rMap.put("message", "请先扫描"+lastScanNode.get("station_name")+"下线!");
						return rMap;
					}else{//上一扫描节点已扫描下线，保存该节点扫描信息及关键零部件信息
						productionDao.saveScanRecord(condMap);
						
						//计划节点上线扫描时更新上线车间上线时间，工厂下线节点扫描时才更新车间下线时间
						productionDao.updateBusProcess(condMap);
						if(plan_node_name.contains(condMap.get("on_offline").toString())){
							productionDao.updateBusPlanNodeDate(condMap);
						}
					}
					
				}
				
				if(partsList.size()>0){
					productionDao.saveParts(partsList);
				}
				
			}else{//下线扫描，判断该节点是否已扫描上线
				Map<String, Object> reMap=new HashMap<String,Object>();
				reMap.putAll(condMap);
				reMap.put("on_offline", "online");
				
				Map<String,Object> onlineRecord=productionDao.queryScanNodeRecord(reMap);
				if(onlineRecord==null){//未扫描上线
					rMap.put("success", false);
					rMap.put("message", "请先扫描"+condMap.get("station_name")+"上线!");
					return rMap;
				}else{//已扫描上线，保存扫描记录
					productionDao.saveScanRecord(condMap);
					
					//计划节点上线扫描时更新上线车间上线时间，工厂下线节点扫描时才更新车间下线时间
					productionDao.updateBusProcess(condMap);
					if(plan_node_name.contains(condMap.get("on_offline").toString())){
						productionDao.updateBusPlanNodeDate(condMap);
					}
					
				}
				
				if(partsList.size()>0){
					productionDao.updateParts(partsList);
				}	
			}			
			
			Map<String,Object> m=new HashMap<String,Object>();
			m.put("project_id", condMap.get("project_id"));
			m.put("factory_id", condMap.get("factory_id"));
			//车辆第一次扫描时，判断工厂订单所有车辆是否全部扫描完成，第一辆车扫描焊装上线时更新工厂订单状态为“生产中”，全部扫描入库完成则更新状态为“已完成”
			if("welding online".equals(condMap.get("plan_node_name"))&&condMap.get("on_offline").equals("online")){
				int welding_online_count=0;
				welding_online_count=productionDao.queryWeldingOnlineCount(condMap);
				if(welding_online_count==1){//第一辆车焊装上线扫描,更新BMS_OR_FACTORY_ORDER status为1：“生产中”					
					m.put("status", "2");
					productionDao.updateProject(m);
				}
			}
			if("outgoing".equals(condMap.get("plan_node_name"))&&condMap.get("on_offline").equals("offline")){
				Map<String,Object> info=productionDao.queryWarehouseInfo(condMap);
				int warehouse_count=Integer.parseInt(info.get("warehouse_count").toString());
				int factory_order_qty=Integer.parseInt(info.get("production_qty").toString());
				if(warehouse_count==factory_order_qty){//最后一台车入库，更新BMS_OR_FACTORY_ORDER status为2：“已完成”
					m.put("status", "3");
					productionDao.updateProject(m);
				}
			}	
			
				
			rMap.put("success", true);
			rMap.put("message", "扫描成功！");
			return rMap;
			
		}else{//已经扫描，更新关键零部件信息			
			if(partsList.size()>0){
				productionDao.updateParts(partsList);
			}		
			rMap.put("success", true);
			rMap.put("message", "扫描成功！");
			return rMap;
		}

	}

	@Override
	public Map<String, Object> getNextStation(Map<String, Object> condMap) {
		Map<String,Object> nextProcess=productionDao.queryNextStation(condMap);
		return nextProcess;
	}
	
	@Override
	public List<Map<String, Object>> getStationSelect(Map<String, Object> condMap) {
		List<Map<String, Object>> stations=productionDao.queryStationList(condMap);
		return stations;
	}	

	@Override
	@Transactional
	public void addEcnItems(Map<String, Object> condMap, ModelMap model) {
		try{
			//保存BMS_NA_ECN_HEAD表信息
			productionDao.insertEcnHead(condMap);
			int ecn_id=Integer.parseInt(condMap.get("id").toString());
			
			//保存ecn items 信息包括ecn_id，返回items id
			String itemlist_str=condMap.get("ecnItemList").toString();
			JSONArray items=JSONArray.fromObject(itemlist_str);
			Iterator it_del=items.iterator();
			List<Map<String,Object>> item_list=new ArrayList<Map<String,Object>>();
			
			while(it_del.hasNext()){
				JSONObject jel=(JSONObject) it_del.next();
				Map<String,Object> item=(Map<String, Object>) JSONObject.toBean(jel, Map.class);
				item.put("ecn_id", ecn_id);
				item_list.add(item);
			}
			
			productionDao.batchInsertEcnItems(item_list);
				
			//保存BMS_NA_ECN_ITEM_BUS信息，包括ecn items 返回的items id	
			String bus_list_str=condMap.get("bus_list").toString();
			List<Map<String,Object>> item_bus_list=new ArrayList<Map<String,Object>>();
			List<String> bus_list=Arrays.asList(bus_list_str.split(","));
			
			//为每个ecn item 保存需要技改的车辆信息
			Iterator it_del_items=item_list.iterator();
			while(it_del_items.hasNext()){
				Map<String,Object> item=(Map<String,Object>)it_del_items.next();
				String ecn_item_id=item.get("id").toString();
				for(String bus:bus_list){
					Map<String,Object> item_bus=new HashMap<String,Object>();
					item_bus.put("bus_number", bus);
					item_bus.put("ecn_item_id", ecn_item_id);
					item_bus_list.add(item_bus);
				}
				
			}
			productionDao.batchInsertItemBus(item_bus_list);	
			
			//保存BMS_NA_ECN_ITEM_MATERIAL 信息，包括ecn items 返回的items id
			List<Map<String,Object>> item_material_list=new ArrayList<Map<String,Object>>();
			it_del_items=item_list.iterator();
			
			while(it_del_items.hasNext()){
				Map<String,Object> item=(Map<String,Object>)it_del_items.next();
				String material_str=item.get("materialList").toString();
				String ecn_item_id=item.get("id").toString();
				material_str=material_str.substring(1,material_str.length()-1);
				JSONArray materials=JSONArray.fromObject(material_str);
				Iterator it_del_m=materials.iterator();
				while(it_del_m.hasNext()){
					JSONObject jel_m=(JSONObject)it_del_m.next();
					Map<String,Object> material=(Map<String, Object>) JSONObject.toBean(jel_m, Map.class);
					material.put("ecn_item_id", ecn_item_id);
					item_material_list.add(material);		
				}
				
			}
			
			productionDao.batchInsertMaterial(item_material_list);
			
			model.put("success", true);
			model.put("message", "Succeed!");
		}catch(Exception e){
			logger.error(e.getMessage());
			model.put("success", false);
			model.put("message", "Failed!");
			throw new RuntimeException(e.getMessage());
			
		}
	}	
	
	@Override
	public void getEcnItemList(Map<String, Object> condMap, ModelMap model) {
		List<Map<String,Object>> datalist=new ArrayList<Map<String,Object>>();
		int totalCount=0;
		datalist=productionDao.queryEcnItemList(condMap);
		totalCount=productionDao.queryEcnItemCount(condMap);
		
		model.put("draw", condMap.get("draw"));
		model.put("recordsTotal", totalCount);
		model.put("recordsFiltered", totalCount);
		model.put("data", datalist);
		
	}

	@Override
	public void getItemListByEcn(String ecn_id, ModelMap model) {
		List<Map<String,Object>> item_list=new ArrayList<Map<String,Object>>();
		item_list=productionDao.queryItemListByEcn(ecn_id);
		for(Map<String,Object> item:item_list){
			//根据ecn_item_id 查询material list
			List<Map<String,Object>> material_list=new ArrayList<Map<String,Object>>();
			material_list=productionDao.queryEcnMaterialByItem(item.get("id").toString());
			item.put("material_list", material_list);
		}
		
		model.put("data", item_list);
	}
	
	/**
	 * 修改技改单信息，技改任务如果存在则不往BMS_NA_ECN_ITEM_BUS表中插入需要技改的车辆，新增的技改任务需要插入技改车辆
	 * 技改物料明细：需要修改的先根据ecn_item_id删除再插入，新增技改任务则直接插入
	 */
	@Override
	@Transactional
	public void updateEcnItems(Map<String, Object> condMap, ModelMap model) {
		try{
			//更新BMS_NA_ECN_HEAD表信息
			productionDao.updateEcnHead(condMap);
			int ecn_id=Integer.parseInt(condMap.get("ecn_id").toString());
			
			//更新ecn items 信息
			String itemlist_str=condMap.get("ecnItemList").toString();
			JSONArray items=JSONArray.fromObject(itemlist_str);
			Iterator it_del=items.iterator();
			List<Map<String,Object>> item_list_update=new ArrayList<Map<String,Object>>();
			List<Map<String,Object>> item_list_add=new ArrayList<Map<String,Object>>();
			while(it_del.hasNext()){
				JSONObject jel=(JSONObject) it_del.next();
				Map<String,Object> item=(Map<String, Object>) JSONObject.toBean(jel, Map.class);
				item.put("ecn_id", ecn_id);
				//任务不存在，属于新增的任务
				if("".equals(item.get("id").toString())){
					item_list_add.add(item);
				}else{
					item_list_update.add(item);
				}
							
			}
			
			if(item_list_update.size()>0){
				productionDao.batchUpdateEcnItems(item_list_update);
			}
			if(item_list_add.size()>0){
				productionDao.batchInsertEcnItems(item_list_add);
			}
				
			/**
			 * 合并新增和修改的技改任务
			 */
			List<Map<String,Object>> item_list=new ArrayList<Map<String,Object>>();
			item_list.addAll(item_list_update);
			item_list.addAll(item_list_add);
			
			//保存BMS_NA_ECN_ITEM_BUS信息，包括ecn items 返回的items id	
			
			String bus_list_str=condMap.get("bus_list").toString();
			List<Map<String,Object>> item_bus_list=new ArrayList<Map<String,Object>>();
			List<String> bus_list=Arrays.asList(bus_list_str.split(","));
			
			//为每个ecn item 保存需要技改的车辆信息
			Iterator it_del_items=item_list_add.iterator();
			while(it_del_items.hasNext()){
				Map<String,Object> item=(Map<String,Object>)it_del_items.next();
				String ecn_item_id=item.get("id").toString();
				for(String bus:bus_list){
					Map<String,Object> item_bus=new HashMap<String,Object>();
					item_bus.put("bus_number", bus);
					item_bus.put("ecn_item_id", ecn_item_id);
					item_bus_list.add(item_bus);
				}	
			}
			if(item_bus_list.size()>0){
				productionDao.batchInsertItemBus(item_bus_list);
			}
				
			
			//保存BMS_NA_ECN_ITEM_MATERIAL 信息，包括ecn items 返回的items id
			List<Map<String,Object>> item_material_list=new ArrayList<Map<String,Object>>();
			it_del_items=item_list.iterator();
			
			while(it_del_items.hasNext()){
				Map<String,Object> item=(Map<String,Object>)it_del_items.next();
				String material_str=item.get("materialList").toString();
				String ecn_item_id=item.get("id").toString();
				/**
				 * 根据ecn_item_id 删除技改物料明细
				 */
				productionDao.deleteMaterialByItem(ecn_item_id);
				if(material_str.contains("{")){
					material_str=material_str.substring(1,material_str.length()-1);
					JSONArray materials=JSONArray.fromObject(material_str);
					Iterator it_del_m=materials.iterator();
					while(it_del_m.hasNext()){
						JSONObject jel_m=(JSONObject)it_del_m.next();
						Map<String,Object> material=(Map<String, Object>) JSONObject.toBean(jel_m, Map.class);
						material.put("ecn_item_id", ecn_item_id);
						item_material_list.add(material);		
					}
				}
					
			}
			/**
			 * 批量插入技改物料明细
			 */
			productionDao.batchInsertMaterial(item_material_list);
			
			model.put("success", true);
			model.put("message", "Succeed!");
		}catch(Exception e){
			logger.error(e.getMessage());
			model.put("success", false);
			model.put("message", "Failed!");
			throw new RuntimeException(e.getCause());
			
		}
		
	}

	@Transactional
	@Override
	public void deleteEcnItem(String ecn_item_id, ModelMap model) {
		try{
			//根据ecn_item_id 删除物料明细
			productionDao.deleteMaterialByItem(ecn_item_id);
			//根据ecn_item_id 删除需要技改的车辆
			productionDao.deleteEcnBusByItem(ecn_item_id);
			//根据ecn_item_id 删除技改任务
			productionDao.deleteEcnItem(ecn_item_id);
			
			model.put("success", true);
			model.put("message", "Succeed!");
		}catch(Exception e){
			logger.error(e.getMessage());
			model.put("success", false);
			model.put("message", "Failed!");
			throw new RuntimeException(e.getCause());
		}
		
	}

	@Override
	public void getEcnBusList(String ecn_item_id, ModelMap model) {
		List<Map<String, Object>> bus_list=productionDao.queryEcnBusList(ecn_item_id);
		model.put("data", bus_list);		
	}

	@Override
	@Transactional
	public void confirmEcnItem(List<Map<String, Object>> bus_list,
			ModelMap model) {
		String ecn_item_id="";
		if(bus_list.get(0).get("ecn_item_id")!=null){
			ecn_item_id=bus_list.get(0).get("ecn_item_id").toString();
		}
		//查询ecn item 第一台车的技改确认日期signed_time_first
		String min_confirm_date=productionDao.queryMinEcnConfirmDate(ecn_item_id);
		
		DateFormat df = new SimpleDateFormat("yyyy-MM-dd");
		try{
			for(Map<String,Object> bus:bus_list){
				
				if(min_confirm_date.equals("")){
					min_confirm_date=bus.get("confirmed_date").toString();
				}
				Date d_compare=df.parse(bus.get("confirmed_date").toString());
				Date d_min=df.parse(min_confirm_date);
				if(d_min.getTime()>=d_compare.getTime()){
					min_confirm_date=bus.get("confirmed_date").toString();
				}	
			}
			
			/**
			 * 更新BMS_NA_ECN_ITEM status为2（processing），以及字段signed_time_first
			 */
			Map<String,Object> condMap=new HashMap<String,Object>();
			condMap.put("ecn_item_id", ecn_item_id);
			condMap.put("status", "2");
			condMap.put("signed_time_first",min_confirm_date);
			productionDao.updateEcnItem(condMap);
			
			/**
			 * 更新BMS_NA_ECN_ITEM_BUS表信息
			 */
			productionDao.batchUpdateEcnBus(bus_list);
			
			model.put("success", true);
			model.put("message", "Succeed!");
		}catch(Exception e){
			logger.error(e.getMessage());
			model.put("success", false);
			model.put("message", "Failed!");
			throw new RuntimeException(e.getCause());
		}
			
	}

	@Transactional
	@Override
	public void confirmEcnItem_QC(List<Map<String, Object>> bus_list,
			ModelMap model) {
		try{
			String ecn_item_id="";
			if(bus_list.get(0).get("ecn_item_id")!=null){
				ecn_item_id=bus_list.get(0).get("ecn_item_id").toString();
			}
			String qc_date="";
			if(bus_list.get(0).get("qc_date")!=null){
				qc_date=bus_list.get(0).get("qc_date").toString();
			}
			/**
			 * 更新BMS_NA_ECN_ITEM_BUS表信息
			 */
			productionDao.batchUpdateEcnBus(bus_list);
			
			/**
			 * 查询是否ecn_itme_id对应的ECN ITEM 是否都全部技改QC确认了，
			 * 是则更新BMS_NA_ECN_ITEM status为3（finished），以及字段finished_time
			 */
			int un_qc_count=productionDao.queryUnQCBusCount(ecn_item_id);
			if(un_qc_count==0){
				Map<String,Object> condMap=new HashMap<String,Object>();
				condMap.put("ecn_item_id", ecn_item_id);
				condMap.put("status", "3");
				condMap.put("finished_time",qc_date);
				
				productionDao.updateEcnItem(condMap);
			}
			
			
			model.put("success", true);
			model.put("message", "Succeed!");
		}catch(Exception e){
			logger.error(e.getMessage());
			model.put("success", false);
			model.put("message", "Failed!");
			throw new RuntimeException(e.getCause());
		}	
		
	}

	
	@Override
	public void getWorkshopStock(Map<String, Object> condMap, ModelMap model) {
		List<Map<String, Object>> stock_list=productionDao.queryWorkshopStock(condMap);
		model.put("data", stock_list);
		
	}

	/*****************************xiong jianwu end  *****************************/
	@Override
	public Map<String, Object> getBusNumberList(Map<String, Object> conditionMap) {
		int totalCount=0;
		List<Map<String, Object>> datalist=productionDao.getBusNumberList(conditionMap);
		totalCount=productionDao.getBusNumberTotalCount(conditionMap);
		Map<String, Object> result=new HashMap<String,Object>();
		result.put("draw", conditionMap.get("draw"));
		result.put("recordsTotal", totalCount);
		result.put("recordsFiltered", totalCount);
		result.put("data", datalist);
		return result;
	}

	public int updateVinPrint(Map<String, Object> conditionMap) {
		return productionDao.updateVinPrint(conditionMap);
	}

	@Override
	public Map<String, Object> getProjectBusNumberList(
			Map<String, Object> conditionMap) {
		int totalCount=0;
		List<Map<String, Object>> datalist=productionDao.getProjectBusNumberList(conditionMap);
		totalCount=productionDao.getProjectBusNumberCount(conditionMap);
		Map<String, Object> result=new HashMap<String,Object>();
		result.put("draw", conditionMap.get("draw"));
		result.put("recordsTotal", totalCount);
		result.put("recordsFiltered", totalCount);
		result.put("data", datalist);
		return result;
	}
	
	@Override
	public List<Map<String, Object>> getProcessMonitorSelect(Map<String, Object> condMap) {	
		return productionDao.queryProcessMonitorList(condMap);
	}

	@Override
	public int insertAbnormity(Map<String, Object> conditionMap) {
		return productionDao.insertAbnormity(conditionMap);
	}

	@Override
	public Map<String, Object> getExceptionList(Map<String, Object> queryMap) {
		int totalCount=0;
		List<Map<String, Object>> datalist = productionDao.getExceptionList(queryMap);
		totalCount = productionDao.getExceptionCount(queryMap);
		Map<String, Object> result = new HashMap<String,Object>();		
		result.put("draw", queryMap.get("draw"));
		result.put("recordsTotal", totalCount);
		result.put("recordsFiltered", totalCount);
		result.put("data", datalist);
		return result;
	}

	@Override
	public int measuresAbnormity(Map<String, Object> conditionMap) {
		return productionDao.measuresAbnormity(conditionMap);
	}

	@Override
	public List<Map<String, Object>> getMaterialRequirement(Map<String, Object> condMap) {
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
		String curDate = df.format(new Date());
		condMap.put("curDate", curDate);
		int station_seq = 0;
		station_seq = productionDao.getStationSquence(condMap);
		logger.info("-->station_seq = " + station_seq);
		List<Map<String, Object>> datalist = new ArrayList<Map<String, Object>>();
		String station = condMap.get("station").toString() + " " + condMap.get("station_name").toString();
		if(station_seq == 1){//焊装第一个节点 取计划数量
			String bus_number = condMap.get("bus_number").toString();
			//01 获取计划列表
			List<Map<String, Object>> projectQtyList = productionDao.getMatReqProjectQty(condMap);				
			//02 循环获取车号及Project
			for(int i=0;i<projectQtyList.size();i++){
				logger.info("-->projectQtyList " + i + " project_id = " + projectQtyList.get(i).get("project_id"));
				Map<String,Object> condMapBus=new HashMap<String,Object>();
				condMapBus.put("project_id", projectQtyList.get(i).get("project_id"));
				condMapBus.put("bus_number", bus_number);
				condMapBus.put("planQty", projectQtyList.get(i).get("plan_qty"));
				List<Map<String, Object>> busProjectList = productionDao.getBusNumberProject(condMapBus);
				//03 获取BOM
				for(int j=0;j<busProjectList.size();j++){
					logger.info("--->busProjectList " + j + " bus_number = " + busProjectList.get(j).get("bus_number") 
							+ " project_id = " + busProjectList.get(j).get("project_id"));
					Map<String,Object> condMapBom=new HashMap<String,Object>();
					condMapBom.put("project_id", busProjectList.get(j).get("project_id"));
					condMapBom.put("bus_number", busProjectList.get(j).get("bus_number"));
					condMapBom.put("station", station);
					List<Map<String, Object>> busBomList = productionDao.getBomListByProject(condMapBom);
					//04 查询当前车辆线边物料并汇总
					
					
					datalist.addAll(busBomList);
				}
			}
			
		}else{//其他节点 取上一节点扫描车辆信息
			//01 查询上一节点信息
			condMap.put("sequence", station_seq-1);
			List<Map<String, Object>> lastStation = productionDao.getLastStationInfo(condMap);
			logger.info("-->lastStation = " + lastStation.get(0).get("station_name"));
			condMap.put("last_station_name", lastStation.get(0).get("station_name"));
			//02 获取上一节点已下线 当前节点未上线 的车辆
			List<Map<String, Object>> busProjectList = productionDao.getStationBusNumberProject(condMap);
			//03 获取BOM
			for(int i=0;i<busProjectList.size();i++){
				logger.info("--->busProjectList " + i + " bus_number = " + busProjectList.get(i).get("bus_number") 
						+ " project_id = " + busProjectList.get(i).get("project_id"));
				Map<String,Object> condMapBom=new HashMap<String,Object>();
				condMapBom.put("project_id", busProjectList.get(i).get("project_id"));
				condMapBom.put("bus_number", busProjectList.get(i).get("bus_number"));
				condMapBom.put("station", station);
				List<Map<String, Object>> busBomList = productionDao.getBomListByProject(condMapBom);
				datalist.addAll(busBomList);
				
				//04 查询当前车辆线边物料并汇总
			}
		}
		
		return datalist;
	}
	
	@Override
	public int printMaterialRequirement(Map<String, Object> conditionMap) {
		return 0;
	}

	@Override
	public int getLineDisCount(Map<String, Object> conditionMap) {
		return productionDao.getLineDisCount(conditionMap);
	}

	@Override
	public int insertLineDistribution(Map<String, Object> conditionMap) {
		return productionDao.insertLineDistribution(conditionMap);
	}

	@Override
	public List<Map<String, Object>> getMaterialReception(Map<String, Object> conditionMap) {
		return productionDao.getMaterialReception(conditionMap);
	}

	@Override
	public String getDistributionReceptionUser(Map<String, Object> conditionMap) {
		return productionDao.getDistributionReceptionUser(conditionMap);
	}

	@Override
	public int updateLineDistributionReception(Map<String, Object> conditionMap) {
		return productionDao.updateLineDistributionReception(conditionMap);
	}

	@Override
	public void updateLineInventory(Map<String, Object> conditionMap) {
		//判断当前车号当前料号是否存在 存在刚更新 不存在则新增
		int lineInventoryQty = productionDao.getLineInventoryQty(conditionMap);
		if(lineInventoryQty == 0){
			productionDao.insertLineInventory(conditionMap);
		}else{
			productionDao.updateLineInventoryQty(conditionMap);
		}
	}
	
	public List<Map<String, String>> getProductionSearchBusinfo(String bus_number) {
		return productionDao.getProductionSearchBusinfo(bus_number);
	}

	@Override
	public int getDistributionCount(Map<String, Object> conditionMap) {
		return productionDao.getDistributionCount(conditionMap);
	}
}
