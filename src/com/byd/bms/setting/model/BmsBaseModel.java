package com.byd.bms.setting.model;

import org.springframework.stereotype.Component;

@Component
public class BmsBaseModel {
	private int id; 
	private String model_name; 
	private String model_icon; 
	private String model_url; 
	private String parent_model_id; 
	private String priority; 
	private String isPermission;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getModel_name() {
		return model_name;
	}
	public void setModel_name(String model_name) {
		this.model_name = model_name;
	}
	public String getModel_icon() {
		return model_icon;
	}
	public void setModel_icon(String model_icon) {
		this.model_icon = model_icon;
	}
	public String getModel_url() {
		return model_url;
	}
	public void setModel_url(String model_url) {
		this.model_url = model_url;
	}
	public String getParent_model_id() {
		return parent_model_id;
	}
	public void setParent_model_id(String parent_model_id) {
		this.parent_model_id = parent_model_id;
	}
	public String getPriority() {
		return priority;
	}
	public void setPriority(String priority) {
		this.priority = priority;
	}
	public String getIsPermission() {
		return isPermission;
	}
	public void setIsPermission(String isPermission) {
		this.isPermission = isPermission;
	}
	
}
