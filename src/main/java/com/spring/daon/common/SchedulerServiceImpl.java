package com.spring.daon.common;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SchedulerServiceImpl{

	@Autowired
	private SchedulerMapper SchedulerMapper; 
	
	// 결근 처리 스케쥴러
	public void mark_absent() {
		SchedulerMapper.mark_absent();
	}
	// 월차 자동 발생 스케쥴러
	public void create_month_vacation() {
		SchedulerMapper.create_month_vacation();
	}
	// 연차 자동 발생 스케쥴러
	public void create_year_vacation() {
		SchedulerMapper.create_year_vacation();
	}
}
