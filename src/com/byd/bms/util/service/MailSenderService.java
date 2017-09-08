package com.byd.bms.util.service;

import javax.mail.internet.InternetAddress;

import org.springframework.ui.ModelMap;

import com.byd.bms.util.EmailSender;
/**
 * 邮件服务类接口
 * @company : 比亚迪股份有限公司
 * @author CaoQingqing
 * @date : Nov 29, 2009 11:07:44 PM
 */
public interface MailSenderService{
	/**
	 * 使用默認帳號發送Email
	 * @param to
	 * @param subject
	 * @param content
	 */
	public void send(String to,String subject,String content);

	/**
	 * 發送簡單的Email
	 * @Author : CaoQingqing
	 * @Date : Nov 29, 2009 11:08:21 PM
	 * @param emailSender
	 */
	public void send(EmailSender emailSender,ModelMap model);
	/**
	 * 
	 * @Author : CaoQingqing
	 * @Date : Nov 29, 2009 11:08:08 PM
	 * @param addressString
	 * @return
	 */
	public InternetAddress[] parseAddress(String addressString);
	
}
