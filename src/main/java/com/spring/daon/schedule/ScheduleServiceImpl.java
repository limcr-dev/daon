package com.spring.daon.schedule;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ScheduleServiceImpl {
	
	@Autowired
	private ScheduleMapper scheduleMapper; 
	
	// 일정 카테고리 불러오기
	@Transactional(readOnly=true)
    public List<Schedule_setting> getCategory(int emp_no) {
    	
    	return scheduleMapper.getCategory(emp_no);
    }
	// 일정 카테고리 색변경
	@Transactional
	public void colorEdit(int c_sch_no, String c_sch_color) {
		Map<String, Object> map = new HashMap<>();
    	map.put("c_sch_no", c_sch_no);
    	map.put("c_sch_color", c_sch_color);
    	
		scheduleMapper.colorEdit(map);
	}	
	// 일정 카테고리 이름변경
	@Transactional
	public void categoryNameEdit(int c_sch_no, String c_sch_title) {
		Map<String, Object> map = new HashMap<>();
    	map.put("c_sch_no", c_sch_no);
    	map.put("c_sch_title", c_sch_title);
    	
		scheduleMapper.categoryNameEdit(map);
	}	
	// 일정 카테고리 등록
	@Transactional
	public void addCategory(int emp_no, String c_sch_title) {
		Map<String, Object> map = new HashMap<>();
    	map.put("emp_no", emp_no);
    	map.put("c_sch_title", c_sch_title);
    	
		scheduleMapper.addCategory(map);
	}	
	// 일정 카테고리 삭제
	@Transactional
    public int deleteCategory(int c_sch_no) {
    	
    	return scheduleMapper.deleteCategory(c_sch_no);
    }
    
	// 일정 저장
	@Transactional
    public int addSchedule(Schedule schedule) {
    	
    	return scheduleMapper.addSchedule(schedule);
    }
    
	// 일정 한개 불러오기
	@Transactional(readOnly=true)
	public Schedule getEvent(int sch_no) {
	
		return scheduleMapper.getEvent(sch_no);
	}	
	
	// 일정 목록 불러오기
	@Transactional(readOnly=true)
    public List<Schedule> getSchedules(int emp_no) {
    	
    	return scheduleMapper.getSchedules(emp_no);
    }
	// 전사일정 불러오기
	@Transactional(readOnly=true)
    public List<Schedule> getAllSchedules(int emp_no) {
    	
    	return scheduleMapper.getAllSchedules(emp_no);
    }
    
	// 일정 수정
	@Transactional
    public int editSchedule(Schedule schedule) {
    	
    	return scheduleMapper.editSchedule(schedule);
    }
    
    // 일정 삭제
	@Transactional
    public int deleteSchedule(int sch_no) {
    	
    	return scheduleMapper.deleteSchedule(sch_no);
    }
}
