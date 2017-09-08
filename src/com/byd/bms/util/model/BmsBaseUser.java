package com.byd.bms.util.model;

import org.springframework.stereotype.Component;

@Component
public class BmsBaseUser {
	
	private int id;
	private String username;
	private String password;
	private String staff_number;
	private String card_8H10D;
	private int role_id;
	private String email;
	private String telephone;
	private String cellphone;
	private String display_name;
	private int department_id;
	private String admin;//0:非admin用户；1:admin用户
	private String isdelete;
	private int factory_id;
	private String factory;
	private String factory_name;
	private String department;
	private String workshop_org;
	private String workgroup_org;
	private String team_org;
	private String create_user;
	private String create_time;
	private String modify_time;
	private String login_count;
	private String last_login_time;
	
	//add by wuxiao
	private String pwd_modified;
	
	public String getCreate_user() {
		return create_user;
	}
	public void setCreate_user(String create_user) {
		this.create_user = create_user;
	}
	public String getCreate_time() {
		return create_time;
	}
	public void setCreate_time(String create_time) {
		this.create_time = create_time;
	}
	public String getModify_time() {
		return modify_time;
	}
	public void setModify_time(String modify_time) {
		this.modify_time = modify_time;
	}
	public String getLogin_count() {
		return login_count;
	}
	public void setLogin_count(String login_count) {
		this.login_count = login_count;
	}
	public String getLast_login_time() {
		return last_login_time;
	}
	public void setLast_login_time(String last_login_time) {
		this.last_login_time = last_login_time;
	}
	public String getPwd_modified() {
		return pwd_modified;
	}
	public void setPwd_modified(String pwd_modified) {
		this.pwd_modified = pwd_modified;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getStaff_number() {
		return staff_number;
	}
	public void setStaff_number(String staff_number) {
		this.staff_number = staff_number;
	}
	public String getCard_8H10D() {
		return card_8H10D;
	}
	public void setCard_8H10D(String card_8h10d) {
		card_8H10D = card_8h10d;
	}
	public int getRole_id() {
		return role_id;
	}
	public void setRole_id(int role_id) {
		this.role_id = role_id;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getTelephone() {
		return telephone;
	}
	public void setTelephone(String telephone) {
		this.telephone = telephone;
	}
	public String getCellphone() {
		return cellphone;
	}
	public void setCellphone(String cellphone) {
		this.cellphone = cellphone;
	}
	public String getDisplay_name() {
		return display_name;
	}
	public void setDisplay_name(String display_name) {
		this.display_name = display_name;
	}
	public int getDepartment_id() {
		return department_id;
	}
	public void setDepartment_id(int department_id) {
		this.department_id = department_id;
	}
	public String getAdmin() {
		return admin;
	}
	public void setAdmin(String admin) {
		this.admin = admin;
	}
	public String getIsdelete() {
		return isdelete;
	}
	public void setIsdelete(String isdelete) {
		this.isdelete = isdelete;
	}
	public int getFactory_id() {
		return factory_id;
	}
	public void setFactory_id(int factory_id) {
		this.factory_id = factory_id;
	}
	public String getFactory() {
		return factory;
	}
	public void setFactory(String factory) {
		this.factory = factory;
	}
	public String getFactory_name() {
		return factory_name;
	}
	public void setFactory_name(String factory_name) {
		this.factory_name = factory_name;
	}
	public String getDepartment() {
		return department;
	}
	public void setDepartment(String department) {
		this.department = department;
	}
	public String getWorkshop_org() {
		return workshop_org;
	}
	public void setWorkshop_org(String workshop_org) {
		this.workshop_org = workshop_org;
	}
	public String getWorkgroup_org() {
		return workgroup_org;
	}
	public void setWorkgroup_org(String workgroup_org) {
		this.workgroup_org = workgroup_org;
	}
	public String getTeam_org() {
		return team_org;
	}
	public void setTeam_org(String team_org) {
		this.team_org = team_org;
	}
	
}
