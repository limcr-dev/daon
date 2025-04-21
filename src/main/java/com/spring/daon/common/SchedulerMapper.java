package com.spring.daon.common;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

@Mapper
@Repository
public interface SchedulerMapper {

	// 결근 처리 스케쥴러
	public void mark_absent(); 	
	
	// 월차 자동 발생 스케쥴러
	public void create_month_vacation(); 	
	
	// 연차 자동 발생 스케쥴러
	public void create_year_vacation(); 	
}
