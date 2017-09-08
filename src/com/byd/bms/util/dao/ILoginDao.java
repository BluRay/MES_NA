package com.byd.bms.util.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import com.byd.bms.util.model.BmsBaseUser;
@Repository(value="loginDao")
public interface ILoginDao {
	public List getUser(@Param("userName") String userName);
	public int insertUser(@Param("user") BmsBaseUser userMap);
	public int saveUserLoginInfo(@Param("user") BmsBaseUser user);
}
