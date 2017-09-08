package com.byd.bms.quality.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import com.byd.bms.quality.model.BmsBaseQCStdRecord;
import com.byd.bms.quality.model.MaterialExceptionLogs;
import com.byd.bms.quality.model.ProblemImproveBean;
import com.byd.bms.quality.model.ProcessFaultBean;
import com.byd.bms.quality.model.QualityTargetBean;
import com.byd.bms.quality.model.StdFaultLibBean;

@Repository(value="qualityDao")
public interface IQualityDao {
	//======================== xjw start=================================//
	int getConfigTotalCount(Map<String, Object> condMap);
	
	List<Map<String, Object>> getOrderConfigList(Map<String, Object> condMap);

	Map<String, Object> queryKeyPartsHeader(Map<String, Object> keyParts);

	int saveKeyPartsHeader(Map<String, Object> keyParts);

	int saveKeyPartsDetails(Map<String, Object> smap);

	int updateKeyPartsHeader(Map<String, Object> keyParts);

	int deleteKeyPartsByHeader(@Param(value="header_id")int header_id);

	List<Map<String, Object>> queryKeyPartsList(Map<String, Object> condMap);
	
	List<Map<String, String>> queryWorkshopProcessList(@Param(value="addList")List<Map<String, String>> addList);
	
	List<Map<String, Object>> queryPrdRcdBusTypeTplList( HashMap<String, Object> condMap);
	
	int queryPrdRcdBusTypeTplCount(HashMap<String, Object> condMap);

	void insertPrdRcdBusTypeTplHeader(Map<String, Object> condMap);

	void updatePrdRcdBusTypeTplHeader(Map<String, Object> condMap);

	void insertPrdRcdTplDetail(Map<String, Object> smap);

	void deletePrdRcdTplByHeader(@Param(value="tpl_header_id")int tpl_header_id);

	List<Map<String, Object>> queryPrdRcdTplDetail(@Param(value="tpl_header_id")String tpl_header_id);

	List<Map<String, Object>> queryPrdRcdOrderTplList( HashMap<String, Object> condMap);

	int queryPrdRcdOrderTplCount(HashMap<String, Object> condMap);

	/*List<Map<String, Object>> queryPrdRcdBusTypeTplDetailLatest(HashMap<String, Object> condMap);*/

	Map<String, Object> queryPrdRcdBusTypeTplHeader(HashMap<String, Object> condMap);
	
	Map<String, Object> queryPrdRcdOrderTplHeader(Map<String, Object> condMap);
	
	void insertPrdRcdOrderTplHeader(Map<String, Object> condMap);

	void updatePrdRcdOrderTplHeader(Map<String, Object> condMap);
	
	public List<StdFaultLibBean> getFaultLibFuzzyList(Map<String, Object> conditionMap);
	
	void deleteProductRecord(Map<String, Object> condMap);

	void insertProductRecord(Map<String, Object> condMap);
	
	List<Map<String, Object>> queryProductRecordList(Map<String,Object> condMap);

	int queryProductRecordCount(Map<String, Object> condMap);
	
	List<Map<String, Object>> queryProductRecordDetail(Map<String,Object> condMap);
	
	int insertProductRecordNoFault(Map<String, Object> condMap);
	
	//======================== xjw end=================================//
	
	
	//========================yk start=================================//
	public int insertFaultLib(StdFaultLibBean faultLib);
	public int updateFaultLib(StdFaultLibBean faultLib);
	public List<Map<String,String>> getQualityTargetList(Map<String, Object> conditionMap);
	public int getQualityTargetCount(Map<String, Object> conditionMap);
	public int insertQualityTarget(QualityTargetBean qualityTarget);
	public int updateQualityTarget(QualityTargetBean qualityTarget);
	
	public List<Map<String,String>> getProcessFaultList(Map<String, Object> conditionMap);
	public int getProcessFaultCount(Map<String, Object> conditionMap);
	public int addProcessFault(ProcessFaultBean pocessFault);
	public int editProcessFault(ProcessFaultBean pocessFault);
	public ProcessFaultBean showProcessFaultInfo(int id);
	
	public int insertProblemImprove(ProblemImproveBean problemImprove);
	public List<Map<String,String>> getProblemImproveList(Map<String, Object> conditionMap);
	public int getProblemImproveCount(Map<String, Object> conditionMap);
	public ProblemImproveBean showProblemImproveInfo(int id);
	public int updateProblemImprove(ProblemImproveBean problemImprove);
	
	//======================== yk end=================================//
		
		
	//========================tj start=================================//
    public List<Map<String,Object>> getKeyPartsTraceList(Map<String,Object> conditionMap);
	
	public int getKeyPartsTraceCount(Map<String,Object> conditionMap);
	
	public int updateKeyParts(Map<String,Object> conditionMap);
	
	public int saveParts(Map<String,Object> conditionMap);
	
    public List<Map<String,Object>> getBusNumberDetailList(Map<String,Object> conditionMap);
	
    public List<Map<String,Object>> getMaterialExceptionLogsList(Map<String,Object> conditionMap);
	
	public int getMaterialExceptionLogsCount(Map<String,Object> conditionMap);
	
	public int saveMaterialExceptionLogs(MaterialExceptionLogs materialExceptionLogs);
	
	public MaterialExceptionLogs selectLogsById(@Param(value="id") int id);
	
	public int updateMaterialExceptionLogs(MaterialExceptionLogs materialExceptionLogs);
	
	//品质标准更新记录 add by tangjin
	public int insertStdRecord(BmsBaseQCStdRecord stdRecord);
	
	public BmsBaseQCStdRecord selectStdRecord(int recordId);
	
	public List<BmsBaseQCStdRecord> getStdRecordList(Map<String,Object> conditionMap);
	
	public int getStdRecordCount(Map<String,Object> conditionMap);
	
	//======================== tj end=================================//

	public List<Map<String, String>> getFaultLibList(Map<String, Object> conditionMap);	

	public int getFaultLibCount(Map<String, Object> conditionMap);


}
