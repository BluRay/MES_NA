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
	public int insertFaultLib(Map<String, Object> faultLib);
	public int updateFaultLib(Map<String, Object> faultLib);
	public List<Map<String, String>> getFaultLibList(Map<String, Object> conditionMap);	
	public int getFaultLibCount(Map<String, Object> conditionMap);
	
	int getOrderKeyPartsTemplateCount(Map<String, Object> condMap);
	List<Map<String, Object>> getOrderKeyPartsTemplateList(Map<String, Object> condMap);
	Map<String, Object> queryKeyPartsHeader(Map<String, Object> keyParts);
	int saveKeyPartsHeader(Map<String, Object> keyParts);
	int saveKeyPartsDetails(List detail_list);
	int updateKeyPartsHeader(Map<String, Object> keyParts);
	int deleteKeyPartsByHeader(@Param(value="header_id")int header_id);
	List<Map<String, Object>> queryKeyPartsList(Map<String, Object> condMap);
	List<Map<String, String>> queryWorkshopProcessList(@Param(value="addList")List<Map<String, String>> addList);
	public String queryKeyPartsMaxVersion(String project_id);
	public List<Map<String, String>> getKeyPartsList(Map<String, Object> keyParts);
	int getPrdRcdOrderTplCount(Map<String, Object> condMap);
	List<Map<String, Object>> getPrdRcdOrderTplList(Map<String, Object> condMap);
	Map<String, Object> getProjectByNo(Map<String, Object> condMap);
	int saveInspectionRecordTemplate(List detail_list);
	public String queryInspectionRecordMaxVersion(String project_id);
	public int deleteInspectionRecordTemplate(Map<String, Object> condMap);
	public List<Map<String, String>> getPrdRcdOrderTplDetailList(Map<String, Object> map);
}
