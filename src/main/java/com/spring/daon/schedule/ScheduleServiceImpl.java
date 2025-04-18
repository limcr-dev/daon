package com.spring.daon.schedule;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ScheduleServiceImpl {
	
	@Autowired
	private ScheduleMapper AttendMgtMapper; 
	
	// 일정 카테고리 불러오기
    public List<Schedule_setting> getCategory(int emp_no) {
    	
    	return AttendMgtMapper.getCategory(emp_no);
    }
}
