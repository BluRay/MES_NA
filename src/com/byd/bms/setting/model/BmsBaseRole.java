package com.byd.bms.setting.model;

import org.springframework.stereotype.Component;

@Component
public class BmsBaseRole {
	private int id;
	private String role_name;
	private String role_description;
	private String type;
	private String edit_user;
	private String edit_time;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getRole_name() {
		return role_name;
	}
	public void setRole_name(String role_name) {
		this.role_name = role_name;
	}
	public String getRole_description() {
		return role_description;
	}
	public void setRole_description(String role_description) {
		this.role_description = role_description;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getEdit_user() {
		return edit_user;
	}
	public void setEdit_user(String edit_user) {
		this.edit_user = edit_user;
	}
	public String getEdit_time() {
		return edit_time;
	}
	public void setEdit_time(String edit_time) {
		this.edit_time = edit_time;
	}
}
