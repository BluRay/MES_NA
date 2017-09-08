package com.byd.bms.util.dao;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

/**
 * 邮件数据访问接口
 */
@Repository(value="emailDao")
public interface IEmailDao {
	public List<Map<String,Object>> getEmailTemplet(Map<String,Object> conditionMap);
}
