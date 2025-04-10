package com.spring.daon.attendMgt;

import java.sql.Time;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/attend")
@CrossOrigin
public class AttendMgtController {
	
	@Autowired
	private AttendMgtServiceImpl service;

	// 출근 버튼 
	@PostMapping("/checkIn/{emp_no}/{start_time}")
	public ResponseEntity<?> checkIn(@PathVariable int emp_no, Time start_time) {
		System.out.println("<<< checkIn >>>");
	
		return new ResponseEntity<>(service.checkIn(emp_no, start_time), HttpStatus.OK);
	}	
	// 퇴근 버튼
	@PutMapping("/checkOut/{emp_no}/{end_time}")
	public ResponseEntity<?> checkOut(@PathVariable int emp_no, Time end_time) {
		System.out.println("<<< checkOut >>>");
	
		return new ResponseEntity<>(service.checkOut(emp_no, end_time), HttpStatus.OK);
	}	
	// 오늘 출퇴근 기록 불러오기
	@GetMapping("/attendByDate/{emp_no}")
	public ResponseEntity<?> attendByDate(@PathVariable int emp_no) {
		System.out.println("<<< attendByDate >>>");
	
		return new ResponseEntity<>(service.attendByDate(emp_no), HttpStatus.OK);
	}
	
	// 근무 유형 조회
	@GetMapping("/workType/{work_type_no}")
	public ResponseEntity<?> workType(@PathVariable int work_type_no) {
		System.out.println("<<< workType >>>");
	
		return new ResponseEntity<>(service.workType(work_type_no), HttpStatus.OK);
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
	
	// <<< 휴가 관련 >>>
	
}
