/**
 * 
 */
package com.byd.bms.production.service.impl;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.commons.lang.StringUtils;
import org.apache.poi.util.StringUtil;
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
}
