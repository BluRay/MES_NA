package com.byd.bms.util.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.byd.bms.util.DataSource;
import com.byd.bms.util.dao.ILoginDao;
import com.byd.bms.util.model.BmsBaseUser;
import com.byd.bms.util.service.ILoginService;
@Service
public class LoginServiceImpl implements ILoginService {
	@Resource(name="loginDao")
	private ILoginDao loginDao;
	@Override
	public BmsBaseUser getUser(String userName) {
		// TODO Auto-generated method stub
		BmsBaseUser user=new BmsBaseUser();
		List list= loginDao.getUser(userName);
		if(list.size()>0){
			user=(BmsBaseUser) list.get(0);
		}
		return user;
	}
	@Transactional
	public void saveUser(BmsBaseUser user) {
		int id=0;

		loginDao.insertUser(user);
		id=user.getId();		
		throw new RuntimeException("创建一个运行时异常！");		

	}
	@Override
	@DataSource("dataSourceMaster")
	public int saveUserLoginInfo(BmsBaseUser user) {
		return loginDao.saveUserLoginInfo(user);
	}
}
