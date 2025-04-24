package com.spring.daon.schedule;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

@Service
public class ScheduleServiceImpl {
	
	@Autowired
	private ScheduleMapper scheduleMapper; 
	
	// 일정 카테고리 불러오기
    public List<Schedule_setting> getCategory(int emp_no) {
    	
    	return scheduleMapper.getCategory(emp_no);
    }
	// 일정 카테고리 색변경
	public void colorEdit(int c_sch_no, String c_sch_color) {
		Map<String, Object> map = new HashMap<>();
    	map.put("c_sch_no", c_sch_no);
    	map.put("c_sch_color", c_sch_color);
    	
		scheduleMapper.colorEdit(map);
	}	
	// 일정 카테고리 이름변경
	public void categoryNameEdit(int c_sch_no, String c_sch_title) {
		Map<String, Object> map = new HashMap<>();
    	map.put("c_sch_no", c_sch_no);
    	map.put("c_sch_title", c_sch_title);
    	
		scheduleMapper.categoryNameEdit(map);
	}	
	// 일정 카테고리 등록
	public void addCategory(int emp_no, String c_sch_title) {
		Map<String, Object> map = new HashMap<>();
    	map.put("emp_no", emp_no);
    	map.put("c_sch_title", c_sch_title);
    	
		scheduleMapper.addCategory(map);
	}	
	// 일정 카테고리 삭제
    public int deleteCategory(int c_sch_no) {
    	
    	return scheduleMapper.deleteCategory(c_sch_no);
    }
    
	// 일정 불러오기
    public List<Schedule> getSchedules(int emp_no) {
    	
    	return scheduleMapper.getSchedules(emp_no);
    }
}
