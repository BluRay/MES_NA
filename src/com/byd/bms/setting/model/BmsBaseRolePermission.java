package com.byd.bms.setting.model;

import org.springframework.stereotype.Component;

@Component
public class BmsBaseRolePermission {
	private int id;
	private String role_id;
	private String function_id;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getRole_id() {
		return role_id;
	}
	public void setRole_id(String role_id) {
		this.role_id = role_id;
	}
	public String getFunction_id() {
		return function_id;
	}
	public void setFunction_id(String function_id) {
		this.function_id = function_id;
	}
	
}
