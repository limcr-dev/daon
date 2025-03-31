package com.spring.daon.attendMgt;

import java.sql.Time;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AttendMgtServiceImpl implements AttendMgtService{

	@Autowired
	private AttendMgtMapper AttendMgtMapper; 
	
	// 출근 버튼
    @Override
    public int checkIn(int emp_no, Time start_time) {
    	Map<String, Object> map = new HashMap<>();
    	map.put("emp_no", emp_no);
    	map.put("start_time", start_time);
    	
    	return AttendMgtMapper.checkIn(map);
    }
    
    // 퇴근 버튼
    @Override
    public int checkOut(int emp_no, Time end_time) {
    	Map<String, Object> map = new HashMap<>();
    	map.put("emp_no", emp_no);
    	map.put("end_time", end_time);
    	
    	return AttendMgtMapper.checkOut(map);
    }
    
    // 오늘 출퇴근 기록 불러오기
    @Override
    public Attendance fetchAttendanceByDate(int emp_no) {
        
    	return AttendMgtMapper.fetchAttendanceByDate(emp_no);
    }
	// 근무 유형 조회
    @Override
	public Work_schedules fetchWorkType(int work_type_no) {
		
		return AttendMgtMapper.fetchWorkType(work_type_no);
	}
    
	// 선택한 달 출퇴근 기록 불러오기
	public Attendance fetchAttendanceByAll(int emp_no, int year, int month) {
		Map<String, Object> map = new HashMap<>();
    	map.put("emp_no", emp_no);
    	map.put("year", year);
    	map.put("month", month);
    	
    	Attendance result = AttendMgtMapper.fetchAttendanceByAll(map);
    	System.out.println("null값 처리전 " + result);
    	// 값이 null 일때 프론트로 null을 보내지 않기 위해 작성
    	if (result == null) {
    		result = new Attendance();
    		result.setEarly_leave(0);
    	}
		return result;
	}
}
