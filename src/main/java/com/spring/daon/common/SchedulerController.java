package com.spring.daon.common;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class SchedulerController {
	 @Autowired
	 private SchedulerServiceImpl SchedulerService;
	 
	 // 결근 처리 스케쥴러
	 @Scheduled(cron = "00 59 23 * * *")
	 public void mark_absent() {
		System.out.println("<<< mark_absent >>>");
		SchedulerService.mark_absent();
	}
	 
	// 월차 자동 발생 스케쥴러
	@Scheduled(cron = "00 59 23 * * *")
	public void create_month_vacation() {
		System.out.println("<<< create_month_vacation >>>");
		SchedulerService.create_month_vacation();
	}
	
	// 연차 자동 발생 스케쥴러
	@Scheduled(cron = "00 59 23 * * *")
	public void create_year_vacation() {
		System.out.println("<<< create_year_vacation >>>");
		SchedulerService.create_year_vacation();
	}
}
