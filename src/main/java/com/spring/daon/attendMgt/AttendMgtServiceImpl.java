package com.spring.daon.attendMgt;

import java.sql.Date;
import java.sql.Time;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AttendMgtServiceImpl{

	@Autowired
	private AttendMgtMapper AttendMgtMapper; 
	
	// 출근 버튼
    public int checkIn(int emp_no, Time start_time) {
    	Map<String, Object> map = new HashMap<>();
    	map.put("emp_no", emp_no);
    	map.put("start_time", start_time);
    	
    	return AttendMgtMapper.checkIn(map);
    }
    
    // 퇴근 버튼
    public int checkOut(int emp_no, Time end_time) {
    	Map<String, Object> map = new HashMap<>();
    	map.put("emp_no", emp_no);
    	map.put("end_time", end_time);
    	
    	return AttendMgtMapper.checkOut(map);
    }
    
    // 오늘 출퇴근 기록 불러오기
    public Attendance attendByDate(int emp_no) {
        
    	return AttendMgtMapper.attendByDate(emp_no);
    }
	// 근무 유형 조회
	public Work_schedules workType(int emp_no) {
		
		return AttendMgtMapper.workType(emp_no);
	}
    
	// 선택한 달 출퇴근 통계 불러오기
	public Attendance attendCnt(int emp_no, int year, int month) {
		Map<String, Object> map = new HashMap<>();
    	map.put("emp_no", emp_no);
    	map.put("year", year);
    	map.put("month", month);
    	
    	Attendance result = AttendMgtMapper.attendCnt(map);
    	// 값이 null 일때 프론트로 null을 보내지 않기 위해 작성
    	if (result == null) {
    		result = new Attendance();
    		result.setEarly_leave(0);
    	}
		return result;
	}
	// 선택한 달 출퇴근 기록 불러오기
	public List<Attendance> attendHistory(int emp_no, int year, int month) {
		Map<String, Object> map = new HashMap<>();
    	map.put("emp_no", emp_no);
    	map.put("year", year);
    	map.put("month", month);
    	
    	List<Attendance> result = AttendMgtMapper.attendHistory(map);
		return result;
	}
	// 선택한 달 변경이력 불러오기
	public List<Attendance> changeLog(int emp_no, int year, int month) {
		Map<String, Object> map = new HashMap<>();
    	map.put("emp_no", emp_no);
    	map.put("year", year);
    	map.put("month", month);
    	
    	List<Attendance> result = AttendMgtMapper.changeLog(map);
    	System.out.println("change" + result);
		return result;
	}
	
	// <<< 휴가 관련 >>>
	
	// 휴가 생성 내역
	public List<Vacation_occur> vacation_log(int emp_no, Date startDate, Date endDate) {
		Map<String, Object> map = new HashMap<>();
    	map.put("emp_no", emp_no);
    	map.put("startDate", startDate);
    	map.put("endDate", endDate);
    	
    	System.out.println("기간" +startDate +  endDate);
    	List<Vacation_occur> result = AttendMgtMapper.vacation_log(map);
    	System.out.println("vacation_log" + result);
		return result;
	}
}
