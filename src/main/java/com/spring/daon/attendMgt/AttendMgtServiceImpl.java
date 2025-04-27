package com.spring.daon.attendMgt;

import java.sql.Time;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.spring.daon.hrMgt.Employees;

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
    	
		return AttendMgtMapper.attendHistory(map);
	}
	// 선택한 달 변경이력 불러오기
	public List<Attendance> changeLog(int emp_no, int year, int month) {
		Map<String, Object> map = new HashMap<>();
    	map.put("emp_no", emp_no);
    	map.put("year", year);
    	map.put("month", month);
    	
    	List<Attendance> result = AttendMgtMapper.changeLog(map);
		return result;
	}
    
    // 선택한 근태기록 불러오기
    public Attendance pickAttend(int attendance_no) {
        
    	return AttendMgtMapper.pickAttend(attendance_no);
    }
    
	// 근태 기록 수정
	public int attendEdit(Attendance attendance) {
		int sum = attendance.getAbsent() +attendance.getEarly_leave()+ attendance.getLate() + attendance.getOut_status();
		if(sum == 0) {
			attendance.setNormal(1);
		}
		else {
			attendance.setNormal(0);
		}
		return AttendMgtMapper.attendEdit(attendance);
	}
	
	// 부서별 출퇴근 통계 불러오기
	public Attendance deptAttendCnt(int dept_no, int year, int month) {
		Map<String, Object> map = new HashMap<>();
    	map.put("dept_no", dept_no);
    	map.put("year", year);
    	map.put("month", month);
    	
    	Attendance result = AttendMgtMapper.deptAttendCnt(map);
    	// 값이 null 일때 프론트로 null을 보내지 않기 위해 작성
    	if (result == null) {
    		result = new Attendance();
    		result.setEarly_leave(0);
    	}
		return result;
	}
	
	// 부서별 근태현황 불러오기
	public List<Attendance> deptStatus(int dept_no) {
		
		return AttendMgtMapper.deptStatus(dept_no);
	}
	// <<< 휴가 관련 >>>
	
	// 휴가 생성 내역
	public List<Vacation_occur> vacation_log(int emp_no) {
    	
		return AttendMgtMapper.vacation_log(emp_no);
	}
	// 휴가 생성 내역 전체 불러오기
	public List<Vacation_occur> allVacation_log() {
    	
    	List<Vacation_occur> result = AttendMgtMapper.allVacation_log();
    	System.out.println("vacation_log" + result);
		return result;
	}
	// 휴가 사용기록 입사일기준 현재 분기에 승인된 연차만 불러오기
	public List<Vacation_occur> vacationHistory(int emp_no) {
    	
		return AttendMgtMapper.vacationHistory(emp_no);
	}
	// 휴가 사용기록 전체 불러오기
	public List<Vacation_occur> allVacationHistory() {
    	
		return AttendMgtMapper.allVacationHistory();
	}
	 
	// 근무 유형 목록 불러오기
	public List<Work_schedules> allWorkType() {
		System.out.println("<<< allWorkType >>>");
		
		return AttendMgtMapper.allWorkType();
	}
	// 선택한 근무유형 불러오기
	public Work_schedules getWorkType(int work_type_no) {
		System.out.println("<<< getWorkType >>>");
		
		return AttendMgtMapper.getWorkType(work_type_no);
	}
	
	// 근무유형 등록
	public int addWorkSchedule(Work_schedules work_schedules) {
		
		Time startTime = work_schedules.getStart_time();
		Time endTime = work_schedules.getEnd_time();
		long seconds = (endTime.getTime() - startTime.getTime()) / 1000;

		Time totalTime = new Time(seconds * 1000);

		work_schedules.setTotal_time(totalTime);
		System.out.println("getStart_time" + work_schedules.getStart_time() );
		System.out.println("getEnd_time" + work_schedules.getEnd_time() );
		System.out.println("getType_name" + work_schedules.getType_name() );
		System.out.println("total_time" + work_schedules.getTotal_time() );
		return AttendMgtMapper.addWorkSchedule(work_schedules);
	}
	
	// 근무유형 수정
	public int editWorkSchedule(Work_schedules work_schedules) {
		
		return AttendMgtMapper.editWorkSchedule(work_schedules);
	}
	
	// 근무유형 삭제
	public int deleteWorkSchedule(List<Integer> work_type_no) {
		AttendMgtMapper.reassignWorkType(work_type_no);
		return AttendMgtMapper.deleteWorkSchedule(work_type_no);
	}
	
	// 직원 목록 조회
	@Transactional
	public List<Work_schedules> empList(int startRow, int size) {
		
		return AttendMgtMapper.empList(startRow, size);
	}
	
	// 직원 검색(검색 시 조회)
	@Transactional
	public List<Work_schedules> searchPerson(String search, int startRow, int size) {
		
		return AttendMgtMapper.searchPerson(search, startRow, size);
	}
	
	// 리스트 갯수
	@Transactional
	public int empCount(String search) {
		 
		if (search == null || search.trim().isEmpty()) {
			return AttendMgtMapper.empCount();
		} else {
			return AttendMgtMapper.empCountSearch(search);
		}
	}
	
	// 직원 근무유형 변경
	public int changeWorkSchedule(int emp_no, int work_type_no) {
		Map<String, Object> map = new HashMap<>();
    	map.put("emp_no", emp_no);
    	map.put("work_type_no", work_type_no);
    	
		return AttendMgtMapper.changeWorkSchedule(map);
	}
	
}
