package com.spring.daon.schedule;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

@Mapper
@Repository
public interface ScheduleMapper {
	
	// 일정 카테고리 불러오기
	public List<Schedule_setting> getCategory(int emp_no); 	
}
