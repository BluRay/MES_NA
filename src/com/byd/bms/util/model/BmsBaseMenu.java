package com.byd.bms.util.model;

import org.springframework.stereotype.Component;

@Component
public class BmsBaseMenu {
	
	private int id;
	private String name;
	private String icon;
	private String path;
	private int parent;
	private int priority;
	private int isPermission;
	public String getIcon() {
		return icon;
	}
	public void setIcon(String icon) {
		this.icon = icon;
	}
	public int getPriority() {
		return priority;
	}
	public void setPriority(int priority) {
		this.priority = priority;
	}
	public int getIsPermission() {
		return isPermission;
	}
	public void setIsPermission(int isPermission) {
		this.isPermission = isPermission;
	}
	public int getIsDeleted() {
		return isDeleted;
	}
	public void setIsDeleted(int isDeleted) {
		this.isDeleted = isDeleted;
	}
	private int isDeleted;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getPath() {
		return path;
	}
	public void setPath(String path) {
		this.path = path;
	}
	public int getParent() {
		return parent;
	}
	public void setParent(int parent) {
		this.parent = parent;
	}
	
}
