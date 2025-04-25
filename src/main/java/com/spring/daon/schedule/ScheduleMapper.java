package com.spring.daon.schedule;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

@Mapper
@Repository
public interface ScheduleMapper {
	
	// 일정 카테고리 불러오기
	public List<Schedule_setting> getCategory(int emp_no); 	 
	
	// 일정 카테고리 색변경
	public void colorEdit(Map<String, Object> map);
	
	// 일정 카테고리 이름변경
	public void categoryNameEdit(Map<String, Object> map);
	
	// 일정 카테고리 등록
	public void addCategory(Map<String, Object> map);
	
	// 일정 카테고리 삭제
	public int deleteCategory(int c_sch_no);
	
	// 일정 저장
	public int addSchedule(Schedule schedule); 	 
	
	// 일정 한개 불러오기
	public Schedule getEvent(int sch_no); 	 
	
	// 일정 목록 불러오기
	public List<Schedule> getSchedules(int emp_no); 	 
	
	// 전사 일정 불러오기
	public List<Schedule> getAllSchedules(int emp_no); 	 
	
	// 일정 수정
    public int editSchedule(Schedule schedule);
    
	// 일정 삭제
    public int deleteSchedule(int c_sch_no);
}
