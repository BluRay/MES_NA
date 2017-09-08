package com.byd.bms.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.util.ResourceUtils;
/**
 * Email工具类
 * @company : 比亚迪股份有限公司
 * @author CaoQingqing
 * @date : Nov 29, 2009 11:09:46 PM
 */
public class EmailSupport {
	private String templet;
	private String encode;
	private String regex = "\\w[-\\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\\.)+[A-Za-z]{2,14}";
	
	private static final Log log = LogFactory.getLog(EmailSupport.class);
	
	public InternetAddress[] parseAddress(String addressString){	
		if(addressString == null) return  new InternetAddress[0];
			log.info("開始解析email address ==>"+addressString);
			String[] addresslist=addressString.split(";");
			
			InternetAddress[] iadr=null;
			List<String> toAdr=new ArrayList<String>();
			Pattern r = Pattern.compile(regex);
			for(String address:addresslist){	
				
				Matcher m = r.matcher(address);
				if(m.matches()){
					toAdr.add(address);
				}	
			}

			try{
				String addrlist=StringUtils.join(toAdr.toArray(),",");
				iadr=InternetAddress.parse(addrlist);
			}catch(AddressException e){
				throw new RuntimeException(e);
			}
			
			return iadr;
			
	}
	protected String getTempletInner(){
		log.info("讀mail的模板文件 ==>"+this.getTemplet());
		StringBuffer buf = new StringBuffer();
		FileInputStream instr = null;
		InputStreamReader instrR = null;
		BufferedReader bufferedReaderObj = null;
		try {
			File file = ResourceUtils.getFile(templet);
			if(!file.exists())throw new UnsupportedOperationException("模板文件不存在==>file path:"+file.getPath());
//            java.io.FileReader fileReaderObj = new java.io.FileReader(file);
//            BufferedReader bufferedReaderObj = new BufferedReader(fileReaderObj);
			instr = new FileInputStream(file);
			instrR = new InputStreamReader(instr,this.getEncode());
			bufferedReaderObj = new BufferedReader(instrR);
			String strVal = "";
            while ((strVal = bufferedReaderObj.readLine()) != null) {
            	buf.append(strVal);
            }
            
        } catch (Exception ex) {
            throw new UnsupportedOperationException("讀取模板文件失敗!",ex);
        } finally{
        	if(instr != null){
        		try {
					instr.close();
				} catch (IOException e) {
					log.warn("fileInputStream can be not closed! \n\t"+e);
				}
        	}
        	if(instrR != null){
        		try {
					instrR.close();
				} catch (IOException e) {
					log.warn("InputStreamReader can be not closed! \n\t"+e);
				}
        	}
        	if(bufferedReaderObj != null){        		
        		try {
					bufferedReaderObj.close();
				} catch (IOException e) {
					log.warn("BufferedReader can be not closed! \n\t"+e);
				}
        	}
        }
		return buf.toString();
	}
	public void setTemplet(String templet) {
		this.templet = templet;
	}

	public String getTemplet() {
		return templet;
	}
	public void setEncode(String encode) {
		this.encode = encode;
	}
	public String getEncode() {
		return encode;
	}

	public static void main(String[] args){
		String addr="zhou.hu@byd.com;zhang.yanqun@byd.com;wei.bo1@byd.com;zhu.yingchun@byd.com;wang.wenxin@byd.com;xia.fasheng@byd.com;liu.longjing@byd.com;xiao.yuguo@byd.com;chu.jianliang@byd.com;li.ruihong@byd.com;yu.chao1@byd.com;li.daoliang@byd.com;zhang.xiamei@byd.com;zong.yang@byd.com;tao.guoqing@byd.com;lion.wang@byd.com;peng.zheng@byd.com;";
		String regex = "\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*";
		List<String> toAdr=new ArrayList<String>();
		String[] addresslist=addr.split(";");
		Pattern r = Pattern.compile(regex);
		
		for(String address:addresslist){	
			
			Matcher m = r.matcher(address);
			if(m.matches()){
				toAdr.add(address);
			}	
		}
		String addrlist=StringUtils.join(toAdr.toArray(),",");
		System.out.print(addrlist);
	}
}
