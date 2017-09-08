package com.byd.bms.plan.model;

public class PlanBus {
	private int id;
	private int production_plan_id;
	private int factory_id;
	private int factory_order_id;
	private String factory_name;
	private String bus_number;
	private String status;
	private int order_id;
	private int order_config_id;
	private int sequence;
	private String vin;
	private String customer_number;
	private String chassis_productive_date;		//底盘生产日期
	private String nameplate_date;				//铭牌日期
	private String productive_date;
	private String left_motor_number;
	private String right_motor_number;
	private String bus_color;
	private String bus_seats;
	private String spring_num;					//簧弹片数
	private String welding_online_date;
	private String welding_offline_date;
	private String fiberglass_offline_date;
	private String painting_online_date;
	private String painting_offline_date;
	private String chassis_online_date;
	private String chassis_offline_date;
	private String assembly_online_date;
	private String assembly_offline_date;
	private String debugarea_online_date;
	private String debugarea_offline_date;
	private String testline_online_date;
	private String testline_offline_date;
	private String warehousing_date;	//入库日期
	private String dispatch_date;		//发车日期
	private String latest_process_id;
	private String production_status;
	private String nameplate_print_date;
	private String nameplate_printer_id;
	private String ccczs_date;
	private String dpgg_date;
	private String zcgg_date;
	private String dp_production_date;
	private String zc_production_date;
	private String dp_zzd;
	private String zc_zzd;
	private String hgz_note;
	private String order_no;
	private int bus_number_id;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getProduction_plan_id() {
		return production_plan_id;
	}
	public void setProduction_plan_id(int production_plan_id) {
		this.production_plan_id = production_plan_id;
	}
	public int getFactory_id() {
		return factory_id;
	}
	public void setFactory_id(int factory_id) {
		this.factory_id = factory_id;
	}
	public int getFactory_order_id() {
		return factory_order_id;
	}
	public void setFactory_order_id(int factory_order_id) {
		this.factory_order_id = factory_order_id;
	}
	public String getFactory_name() {
		return factory_name;
	}
	public void setFactory_name(String factory_name) {
		this.factory_name = factory_name;
	}
	public String getBus_number() {
		return bus_number;
	}
	public void setBus_number(String bus_number) {
		this.bus_number = bus_number;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public int getOrder_id() {
		return order_id;
	}
	public void setOrder_id(int order_id) {
		this.order_id = order_id;
	}
	public int getOrder_config_id() {
		return order_config_id;
	}
	public void setOrder_config_id(int order_config_id) {
		this.order_config_id = order_config_id;
	}
	public int getSequence() {
		return sequence;
	}
	public void setSequence(int sequence) {
		this.sequence = sequence;
	}
	public String getVin() {
		return vin;
	}
	public void setVin(String vin) {
		this.vin = vin;
	}
	public String getCustomer_number() {
		return customer_number;
	}
	public void setCustomer_number(String customer_number) {
		this.customer_number = customer_number;
	}
	public String getChassis_productive_date() {
		return chassis_productive_date;
	}
	public void setChassis_productive_date(String chassis_productive_date) {
		this.chassis_productive_date = chassis_productive_date;
	}
	public String getNameplate_date() {
		return nameplate_date;
	}
	public void setNameplate_date(String nameplate_date) {
		this.nameplate_date = nameplate_date;
	}
	public String getProductive_date() {
		return productive_date;
	}
	public void setProductive_date(String productive_date) {
		this.productive_date = productive_date;
	}
	public String getLeft_motor_number() {
		return left_motor_number;
	}
	public void setLeft_motor_number(String left_motor_number) {
		this.left_motor_number = left_motor_number;
	}
	public String getRight_motor_number() {
		return right_motor_number;
	}
	public void setRight_motor_number(String right_motor_number) {
		this.right_motor_number = right_motor_number;
	}
	public String getBus_color() {
		return bus_color;
	}
	public void setBus_color(String bus_color) {
		this.bus_color = bus_color;
	}
	public String getBus_seats() {
		return bus_seats;
	}
	public void setBus_seats(String bus_seats) {
		this.bus_seats = bus_seats;
	}
	public String getSpring_num() {
		return spring_num;
	}
	public void setSpring_num(String spring_num) {
		this.spring_num = spring_num;
	}
	public String getWelding_online_date() {
		return welding_online_date;
	}
	public void setWelding_online_date(String welding_online_date) {
		this.welding_online_date = welding_online_date;
	}
	public String getWelding_offline_date() {
		return welding_offline_date;
	}
	public void setWelding_offline_date(String welding_offline_date) {
		this.welding_offline_date = welding_offline_date;
	}
	public String getFiberglass_offline_date() {
		return fiberglass_offline_date;
	}
	public void setFiberglass_offline_date(String fiberglass_offline_date) {
		this.fiberglass_offline_date = fiberglass_offline_date;
	}
	public String getPainting_online_date() {
		return painting_online_date;
	}
	public void setPainting_online_date(String painting_online_date) {
		this.painting_online_date = painting_online_date;
	}
	public String getPainting_offline_date() {
		return painting_offline_date;
	}
	public void setPainting_offline_date(String painting_offline_date) {
		this.painting_offline_date = painting_offline_date;
	}
	public String getChassis_online_date() {
		return chassis_online_date;
	}
	public void setChassis_online_date(String chassis_online_date) {
		this.chassis_online_date = chassis_online_date;
	}
	public String getChassis_offline_date() {
		return chassis_offline_date;
	}
	public void setChassis_offline_date(String chassis_offline_date) {
		this.chassis_offline_date = chassis_offline_date;
	}
	public String getAssembly_online_date() {
		return assembly_online_date;
	}
	public void setAssembly_online_date(String assembly_online_date) {
		this.assembly_online_date = assembly_online_date;
	}
	public String getAssembly_offline_date() {
		return assembly_offline_date;
	}
	public void setAssembly_offline_date(String assembly_offline_date) {
		this.assembly_offline_date = assembly_offline_date;
	}
	public String getDebugarea_online_date() {
		return debugarea_online_date;
	}
	public void setDebugarea_online_date(String debugarea_online_date) {
		this.debugarea_online_date = debugarea_online_date;
	}
	public String getDebugarea_offline_date() {
		return debugarea_offline_date;
	}
	public void setDebugarea_offline_date(String debugarea_offline_date) {
		this.debugarea_offline_date = debugarea_offline_date;
	}
	public String getTestline_online_date() {
		return testline_online_date;
	}
	public void setTestline_online_date(String testline_online_date) {
		this.testline_online_date = testline_online_date;
	}
	public String getTestline_offline_date() {
		return testline_offline_date;
	}
	public void setTestline_offline_date(String testline_offline_date) {
		this.testline_offline_date = testline_offline_date;
	}
	public String getWarehousing_date() {
		return warehousing_date;
	}
	public void setWarehousing_date(String warehousing_date) {
		this.warehousing_date = warehousing_date;
	}
	public String getDispatch_date() {
		return dispatch_date;
	}
	public void setDispatch_date(String dispatch_date) {
		this.dispatch_date = dispatch_date;
	}
	public String getLatest_process_id() {
		return latest_process_id;
	}
	public void setLatest_process_id(String latest_process_id) {
		this.latest_process_id = latest_process_id;
	}
	public String getProduction_status() {
		return production_status;
	}
	public void setProduction_status(String production_status) {
		this.production_status = production_status;
	}
	public String getNameplate_print_date() {
		return nameplate_print_date;
	}
	public void setNameplate_print_date(String nameplate_print_date) {
		this.nameplate_print_date = nameplate_print_date;
	}
	public String getNameplate_printer_id() {
		return nameplate_printer_id;
	}
	public void setNameplate_printer_id(String nameplate_printer_id) {
		this.nameplate_printer_id = nameplate_printer_id;
	}
	public String getCcczs_date() {
		return ccczs_date;
	}
	public void setCcczs_date(String ccczs_date) {
		this.ccczs_date = ccczs_date;
	}
	public String getDpgg_date() {
		return dpgg_date;
	}
	public void setDpgg_date(String dpgg_date) {
		this.dpgg_date = dpgg_date;
	}
	public String getZcgg_date() {
		return zcgg_date;
	}
	public void setZcgg_date(String zcgg_date) {
		this.zcgg_date = zcgg_date;
	}
	public String getDp_production_date() {
		return dp_production_date;
	}
	public void setDp_production_date(String dp_production_date) {
		this.dp_production_date = dp_production_date;
	}
	public String getZc_production_date() {
		return zc_production_date;
	}
	public void setZc_production_date(String zc_production_date) {
		this.zc_production_date = zc_production_date;
	}
	public String getDp_zzd() {
		return dp_zzd;
	}
	public void setDp_zzd(String dp_zzd) {
		this.dp_zzd = dp_zzd;
	}
	public String getZc_zzd() {
		return zc_zzd;
	}
	public void setZc_zzd(String zc_zzd) {
		this.zc_zzd = zc_zzd;
	}
	public String getHgz_note() {
		return hgz_note;
	}
	public void setHgz_note(String hgz_note) {
		this.hgz_note = hgz_note;
	}
	public String getOrder_no() {
		return order_no;
	}
	public void setOrder_no(String order_no) {
		this.order_no = order_no;
	}
	public int getBus_number_id() {
		return bus_number_id;
	}
	public void setBus_number_id(int bus_number_id) {
		this.bus_number_id = bus_number_id;
	}

}
