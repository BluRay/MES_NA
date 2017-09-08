package com.byd.bms.setting.model;

public class BmsBaseStandardWorkgroup {
	private int id;
	private int factoryId;
	private String factoryName;
	private int workshopId;
	private String workshopName;
	private String parentId;
	private String responsibility;
	private String type;
	private String workgroupId;
	private String groupName;
	private String memo;
	private String deleteFlag;
	private int editorId;
	private String editor;
	private String editDate;
	
	public String getWorkgroupId() {
		return workgroupId;
	}
	public void setWorkgroupId(String workgroupId) {
		this.workgroupId = workgroupId;
	}
	public int getWorkshopId() {
		return workshopId;
	}
	public void setWorkshopId(int workshopId) {
		this.workshopId = workshopId;
	}

	public String getFactoryName() {
		return factoryName;
	}
	public void setFactoryName(String factoryName) {
		this.factoryName = factoryName;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getFactoryId() {
		return factoryId;
	}
	public void setFactoryId(int factoryId) {
		this.factoryId = factoryId;
	}
	public String getWorkshopName() {
		return workshopName;
	}
	public void setWorkshopName(String workshopName) {
		this.workshopName = workshopName;
	}
	public String getParentId() {
		return parentId;
	}
	public void setParentId(String parentId) {
		this.parentId = parentId;
	}
	public String getResponsibility() {
		return responsibility;
	}
	public void setResponsibility(String responsibility) {
		this.responsibility = responsibility;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getDeleteFlag() {
		return deleteFlag;
	}
	public void setDeleteFlag(String deleteFlag) {
		this.deleteFlag = deleteFlag;
	}
	public int getEditorId() {
		return editorId;
	}
	public void setEditorId(int editorId) {
		this.editorId = editorId;
	}
	public String getEditor() {
		return editor;
	}
	public void setEditor(String editor) {
		this.editor = editor;
	}
	public String getEditDate() {
		return editDate;
	}
	public void setEditDate(String editDate) {
		this.editDate = editDate;
	}
	public String getGroupName() {
		return groupName;
	}
	public void setGroupName(String groupName) {
		this.groupName = groupName;
	}
	public String getMemo() {
		return memo;
	}
	public void setMemo(String memo) {
		this.memo = memo;
	}
}
