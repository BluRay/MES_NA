package com.byd.bms.setting.model;

import org.springframework.stereotype.Component;

@Component
public class BmsUserRole {
	private int id;
	private String staff_number;
	private String role_id;
	private String role_name;
	private String permission_key;
	private String permission_name;
	private String permission_value;
	private String edit_user;
	private String edit_time;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getStaff_number() {
		return staff_number;
	}
	public void setStaff_number(String staff_number) {
		this.staff_number = staff_number;
	}
	public String getRole_id() {
		return role_id;
	}
	public void setRole_id(String role_id) {
		this.role_id = role_id;
	}
	public String getRole_name() {
		return role_name;
	}
	public void setRole_name(String role_name) {
		this.role_name = role_name;
	}
	public String getPermission_key() {
		return permission_key;
	}
	public void setPermission_key(String permission_key) {
		this.permission_key = permission_key;
	}
	public String getPermission_name() {
		return permission_name;
	}
	public void setPermission_name(String permission_name) {
		this.permission_name = permission_name;
	}
	public String getPermission_value() {
		return permission_value;
	}
	public void setPermission_value(String permission_value) {
		this.permission_value = permission_value;
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
