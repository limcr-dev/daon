package com.spring.daon.attendMgt;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import com.spring.daon.hrMgt.Employees;

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
	
	// 근무 유형 목록 불러오기
	public List<Work_schedules> allWorkType();

	// 근무 유형 불러오기
	public Work_schedules getWorkType(int work_type_no);
	
	// 근무유형 등록
	public int addWorkSchedule(Work_schedules work_schedules);
	
	// 근무유형 수정
	public int editWorkSchedule(Work_schedules work_schedules);
	
	// 근무유형 삭제
	public int deleteWorkSchedule(List<Integer> work_type_no);
	
	// 근무유형 삭제 시 연관된 직원의 근무유형 재설정
	public int reassignWorkType(List<Integer> work_type_no);
	
	// 직원 목록 조회
	public List<Work_schedules> empList(int startRow, int size);
	
	// 이름/사번 검색(검색 시 조회)
	public List<Work_schedules> searchPerson(String search, int startRow, int size);
	
	// 리스트 갯수
	public int empCount();
	
	// 리스트 갯수
	public int empCountSearch(String search);

	// 직원 근무유형 변경
	public int changeWorkSchedule(Map<String, Object> map);
	
	
}
