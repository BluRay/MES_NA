package com.byd.bms.setting.model;

import org.springframework.stereotype.Component;

@Component
public class BmsBaseFunction {
	private int id;
	private String function_name;
	private String function_icon;
	private String model_id;
	private String parent_function_id;
	private String function_url;
	private String priority;
	private String type;
	private String isPermission;
	private String sub_count;		//子功能数
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getFunction_name() {
		return function_name;
	}
	public void setFunction_name(String function_name) {
		this.function_name = function_name;
	}
	public String getFunction_icon() {
		return function_icon;
	}
	public void setFunction_icon(String function_icon) {
		this.function_icon = function_icon;
	}
	public String getModel_id() {
		return model_id;
	}
	public void setModel_id(String model_id) {
		this.model_id = model_id;
	}
	public String getParent_function_id() {
		return parent_function_id;
	}
	public void setParent_function_id(String parent_function_id) {
		this.parent_function_id = parent_function_id;
	}
	public String getFunction_url() {
		return function_url;
	}
	public void setFunction_url(String function_url) {
		this.function_url = function_url;
	}
	public String getPriority() {
		return priority;
	}
	public void setPriority(String priority) {
		this.priority = priority;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getIsPermission() {
		return isPermission;
	}
	public void setIsPermission(String isPermission) {
		this.isPermission = isPermission;
	}
	public String getSub_count() {
		return sub_count;
	}
	public void setSub_count(String sub_count) {
		this.sub_count = sub_count;
	}
	
}
