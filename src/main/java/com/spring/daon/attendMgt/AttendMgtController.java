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
@RequestMapping("/api")
@CrossOrigin
public class AttendMgtController {
	
	@Autowired
	private AttendMgtServiceImpl service;

	// 출근 버튼
	@PostMapping("/postcheckIn/{emp_no}/{start_time}")
	public ResponseEntity<?> checkIn(@PathVariable int emp_no, Time start_time) {
		System.out.println("<<< checkIn >>>");
	
		return new ResponseEntity<>(service.checkIn(emp_no, start_time), HttpStatus.OK);
	}	
	// 퇴근 버튼
	@PutMapping("/putcheckOut/{emp_no}/{end_time}")
	public ResponseEntity<?> checkOut(@PathVariable int emp_no, Time end_time) {
		System.out.println("<<< checkOut >>>");
	
		return new ResponseEntity<>(service.checkOut(emp_no, end_time), HttpStatus.OK);
	}	
	// 오늘 출퇴근 기록 불러오기
	@GetMapping("/fetchAttendanceByDate/{emp_no}")
	public ResponseEntity<?> fetchAttendanceByDate(@PathVariable int emp_no) {
		System.out.println("<<< fetchAttendanceByDate >>>");
	
		return new ResponseEntity<>(service.fetchAttendanceByDate(emp_no), HttpStatus.OK);
	}
	
	// 근무 유형 조회
	@GetMapping("/fetchWorkType/{work_type_no}")
	public ResponseEntity<?> fetchWorkType(@PathVariable int work_type_no) {
		System.out.println("<<< fetchWorkType >>>");
	
		return new ResponseEntity<>(service.fetchWorkType(work_type_no), HttpStatus.OK);
	}
	// 선택한 달 출퇴근 기록 불러오기
	@GetMapping("/fetchAttendanceByAll/{emp_no}/{year}/{month}")
	public ResponseEntity<?> fetchAttendanceByAll(@PathVariable int emp_no, @PathVariable int year, @PathVariable int month) {
		System.out.println("<<< fetchAttendanceByAll >>>");
		System.out.println("year" + year + "month" + month);
		return new ResponseEntity<>(service.fetchAttendanceByAll(emp_no, year, month), HttpStatus.OK);
	}
}
