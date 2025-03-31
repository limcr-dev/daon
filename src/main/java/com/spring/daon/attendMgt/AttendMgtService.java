package com.spring.daon.attendMgt;

import java.sql.Time;

import org.springframework.stereotype.Service;

@Service
public interface AttendMgtService {
	// 출근 버튼
	public int checkIn(int emp_no, Time start_time);
	
	// 퇴근 버튼
	public int checkOut(int emp_no, Time end_time);
	
	// 오늘 출퇴근 기록 불러오기
	public Attendance fetchAttendanceByDate(int emp_no);
	
	// 근무 유형 조회
	public Work_schedules fetchWorkType(int work_type_no);
	
	// 선택한 달 출퇴근 기록 불러오기
	public Attendance fetchAttendanceByAll(int emp_no, int year, int month);
}
