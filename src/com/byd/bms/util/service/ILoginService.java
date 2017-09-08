package com.byd.bms.util.service;

import com.byd.bms.util.model.BmsBaseUser;

public interface ILoginService {
	public BmsBaseUser getUser(String userName);
	public void saveUser(BmsBaseUser user) ;
	public int saveUserLoginInfo(BmsBaseUser user);
}
