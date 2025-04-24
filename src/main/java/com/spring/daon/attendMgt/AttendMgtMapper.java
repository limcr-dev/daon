package com.spring.daon.attendMgt;

import java.util.List;
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
	public Attendance attendByDate(int emp_no);
	
	// 근무 유형 조회
	public Work_schedules workType(int emp_no);

	// 선택한 달 출퇴근 통계 불러오기
	public Attendance attendCnt(Map<String, Object> map);
	
	// 선택한 달 출퇴근 통계 불러오기
	public List<Attendance> attendHistory(Map<String, Object> map);
	
	// 선택한 달 변경이력 불러오기
	public List<Attendance> changeLog(Map<String, Object> map);
	
    // 선택한 근태기록 불러오기
    public Attendance pickAttend(int attendance_no);
    
	// 근태 기록 수정
	public int attendEdit(Attendance attendance);
	
	// 부서별 출퇴근 통계 불러오기
	public Attendance deptAttendCnt(Map<String, Object> map);
	
	// 부서별 근태현황 불러오기
	public List<Attendance> deptStatus(int dept_no);
	
	// <<< 휴가 관련 >>>
	
	// 휴가 생성 내역
	public List<Vacation_occur> vacation_log(int emp_no);
	
	// 휴가 생성 내역 전체 불러오기
	public List<Vacation_occur> allVacation_log();
	
	// 휴가 사용기록 입사일기준 현재 분기에 승인된 연차만 불러오기
	public List<Vacation_occur> vacationHistory(int emp_no);
	
	// 휴가 사용기록 전체 불러오기
	public List<Vacation_occur> allVacationHistory();
	
	
}
