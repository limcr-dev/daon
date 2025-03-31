package com.spring.daon.attendMgt;

import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

@Mapper
@Repository
public interface AttendMgtMapper {

	// 출근 버튼
	public int checkIn(Map<String, Object> map); 	

	// 퇴근 버튼
	public int checkOut(Map<String, Object> map); 
	
    // 오늘 출퇴근 기록 불러오기
	public Attendance fetchAttendanceByDate(int emp_no);
	
	// 근무 유형 조회
	public Work_schedules fetchWorkType(int work_type_no);

	// 선택한 달 출퇴근 기록 불러오기
	public Attendance fetchAttendanceByAll(Map<String, Object> map);
	
}
