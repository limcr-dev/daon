package com.spring.daon.attendMgt;

import java.sql.Time;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.spring.daon.hrMgt.Employees;
import com.spring.daon.paging.Paging;

@RestController
@RequestMapping("/attend")
@CrossOrigin
public class AttendMgtController {
	
	@Autowired
	private AttendMgtServiceImpl service;

	// 출근 버튼 
	@PostMapping("/checkIn/{emp_no}/{start_time}")
	public ResponseEntity<?> checkIn(@PathVariable int emp_no, @PathVariable Time start_time) {
		System.out.println("<<< checkIn >>>");
	
		return new ResponseEntity<>(service.checkIn(emp_no, start_time), HttpStatus.OK);
	}
	// 퇴근 버튼
	@PutMapping("/checkOut/{emp_no}/{end_time}")
	public ResponseEntity<?> checkOut(@PathVariable int emp_no, @PathVariable Time end_time) {
		System.out.println("<<< checkOut >>>");
		return new ResponseEntity<>(service.checkOut(emp_no, end_time), HttpStatus.OK);
	}
	// 오늘 출퇴근 기록 불러오기
	@GetMapping("/attendByDate/{emp_no}")
	public ResponseEntity<?> attendByDate(@PathVariable int emp_no) {
		System.out.println("<<< attendByDate >>>");
		Attendance result = service.attendByDate(emp_no);

		 if (result == null) {
		        return ResponseEntity.ok(Collections.emptyMap());
		    }
		 else {
			 return new ResponseEntity<>(result, HttpStatus.OK);
		 }
	}
	
	// 근무 유형 조회
	@GetMapping("/workType/{emp_no}")
	public ResponseEntity<?> workType(@PathVariable int emp_no) {
		System.out.println("<<< workType >>>");
		
		return new ResponseEntity<>(service.workType(emp_no), HttpStatus.OK);
	}
	
	// 선택한 달 출퇴근 통계 불러오기
	@GetMapping("/attendCnt/{emp_no}/{year}/{month}")
	public ResponseEntity<?> attendCnt(@PathVariable int emp_no, @PathVariable int year, @PathVariable int month) {
		System.out.println("<<< attendCnt >>>");
	
		return new ResponseEntity<>(service.attendCnt(emp_no, year, month), HttpStatus.OK);
	}
	
	// 선택한 달 출퇴근 기록 불러오기
	@GetMapping("/attendHistory/{emp_no}/{year}/{month}")
	public ResponseEntity<?> attendHistory(@PathVariable int emp_no, @PathVariable int year, @PathVariable int month) {
		System.out.println("<<< attendHistory >>>");
		
		return new ResponseEntity<>(service.attendHistory(emp_no, year, month), HttpStatus.OK);
	}
	// 선택한 달 변경이력 불러오기
	@GetMapping("/changeLog/{emp_no}/{year}/{month}")
	public ResponseEntity<?> changeLog(@PathVariable int emp_no, @PathVariable int year, @PathVariable int month) {
		System.out.println("<<< changeLog >>>" + emp_no + year + month);
		
		return new ResponseEntity<>(service.changeLog(emp_no, year, month), HttpStatus.OK);
	}
	// 선택한 근태기록 불러오기
	@GetMapping("/pickAttend/{attendance_no}")
	public ResponseEntity<?> pickAttend(@PathVariable int attendance_no) {
		System.out.println("<<< pickAttend >>>" + attendance_no);
		
		return new ResponseEntity<>(service.pickAttend(attendance_no), HttpStatus.OK);
	}	
	// 근태기록 수정
	@PutMapping("/attendEdit")
	public ResponseEntity<?> attendEdit(@RequestBody Attendance attendance) {
		System.out.println("<<< attendEdit >>>" + attendance);
		service.attendEdit(attendance);
		return new ResponseEntity<>(HttpStatus.OK);
	}
	// 부서별 근태통계 불러오기
	@GetMapping("/deptAttendCnt/{dept_no}/{year}/{month}")
	public ResponseEntity<?> deptAttendCnt(@PathVariable int dept_no, @PathVariable int year, @PathVariable int month) {
		System.out.println("<<< deptAttendCnt >>>" + dept_no + year + month);
		
		System.out.println("test" + service.deptAttendCnt(dept_no, year, month));
		return new ResponseEntity<>(service.deptAttendCnt(dept_no, year, month), HttpStatus.OK);
	}
	// 부서별 근태현황 불러오기
	@GetMapping("/deptStatus/{dept_no}")
	public ResponseEntity<?> deptStatus(@PathVariable int dept_no) {
		System.out.println("<<< deptStatus >>>" + dept_no);
		
		return new ResponseEntity<>(service.deptStatus(dept_no), HttpStatus.OK);
	}
	// <<< 휴가 관련 >>>
	
	// 휴가 생성 내역
	@GetMapping("/vacation_log/{emp_no}")
	public ResponseEntity<?> vacation_log(@PathVariable int emp_no) {
		System.out.println("<<< vacation_log >>>" + emp_no);
		
		return new ResponseEntity<>(service.vacation_log(emp_no), HttpStatus.OK);
	}
	// 휴가 생성 내역 전체 불러오기
	@GetMapping("/vacation_log")
	public ResponseEntity<?> vacation_log() {
		System.out.println("<<< allVacation_log >>>");
		
		return new ResponseEntity<>(service.allVacation_log(), HttpStatus.OK);
	}
	// 휴가 사용기록 입사일기준 현재 분기에 승인된 연차만 불러오기
	@GetMapping("/vacationHistory/{emp_no}")
	public ResponseEntity<?> vacationHistory(@PathVariable int emp_no) {
		System.out.println("<<< vacationHistory >>>" + emp_no);
		
		return new ResponseEntity<>(service.vacationHistory(emp_no), HttpStatus.OK);
	}
	// 휴가 사용기록 전체 불러오기
	@GetMapping("/vacationHistory")
	public ResponseEntity<?> vacationHistory() {
		System.out.println("<<< allVacationHistory >>>");
		
		return new ResponseEntity<>(service.allVacationHistory(), HttpStatus.OK);
	}
	
	// 근무유형 목록 불러오기
	@GetMapping("/workType")
	public ResponseEntity<?> allWorkType() {
		System.out.println("<<< allWorkType >>>"+service.allWorkType());
		
		return new ResponseEntity<>(service.allWorkType(), HttpStatus.OK);
	}
	// 선택한 근무유형 불러오기
	@GetMapping("/getWorkType/{work_type_no}")
	public ResponseEntity<?> getWorkType(@PathVariable int work_type_no) {
		System.out.println("<<< getWorkType >>>"+service.getWorkType(work_type_no));
		 
		return new ResponseEntity<>(service.getWorkType(work_type_no), HttpStatus.OK);
	}
	
	// 근무유형 등록
	@PostMapping("/addWorkSchedule")
	public ResponseEntity<?> addWorkSchedule(@RequestBody Work_schedules work_schedules) {
		System.out.println("<<< addWorkSchedule >>>");
		 
		return new ResponseEntity<>(service.addWorkSchedule(work_schedules), HttpStatus.OK);
	}
	
	// 근무유형 수정
	@PutMapping("/editWorkSchedule")
	public ResponseEntity<?> editWorkSchedule(@RequestBody Work_schedules work_schedules) {
		System.out.println("<<< editWorkSchedule >>>"+service.editWorkSchedule(work_schedules));
		 
		return new ResponseEntity<>(service.editWorkSchedule(work_schedules), HttpStatus.OK);
	}
	
	// 근무유형 삭제
	@DeleteMapping("/deleteWorkSchedule")
	public ResponseEntity<?> deleteWorkSchedule(@RequestBody List<Integer> work_type_no) {
		System.out.println("<<< deleteWorkSchedule >>>");
		 
		return new ResponseEntity<>(service.deleteWorkSchedule(work_type_no), HttpStatus.OK);
	}
	
	// 근태 설정 직원목록
	@GetMapping("/workScheduleEmpList")
	public ResponseEntity<?> workScheduleEmpList(
			@RequestParam(defaultValue = "1") int page,
		    @RequestParam(defaultValue = "10") int size,
		    @RequestParam(required = false) String search) {
	    System.out.println("<<< workScheduleEmpList >>> search : " + search);

	    int totalCount = service.empCount(search);
	    Paging paging = new Paging(page, size, totalCount);

	    List<Work_schedules> result = (search == null || search.trim().isEmpty())
	        ? service.empList(paging.getStartRow(), paging.getSize())
	        : service.searchPerson(search, paging.getStartRow(), paging.getSize());

	    Map<String, Object> response = new HashMap<>();
	    response.put("list", result);
	    response.put("paging", paging);

	    System.out.println("result : " + result);
	    return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	// 직원 근무유형 변경
	@PutMapping("/changeWorkSchedule/{emp_no}/{work_type_no}")
	public ResponseEntity<?> changeWorkSchedule(@PathVariable int emp_no, @PathVariable int work_type_no) {
		System.out.println("<<< changeWorkSchedule >>>");
		 
		return new ResponseEntity<>(service.changeWorkSchedule(emp_no, work_type_no), HttpStatus.OK);
	}
	
}
