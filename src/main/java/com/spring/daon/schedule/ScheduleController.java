package com.spring.daon.schedule;

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
import org.springframework.web.bind.annotation.RestController;

import com.spring.daon.attendMgt.Attendance;



@RestController
@RequestMapping("/schedule") // 임시 토큰 수정 후 바꿀거
@CrossOrigin
public class ScheduleController {
	
	@Autowired
	private ScheduleServiceImpl service;

	// 일정 카테고리 불러오기
	@GetMapping("/getCategory/{emp_no}")
	public ResponseEntity<?> getCategory(@PathVariable int emp_no) {
		System.out.println("<<< getCategory >>>" +service.getCategory(emp_no));
	
		return new ResponseEntity<>(service.getCategory(emp_no), HttpStatus.OK);
	}	
	// 일정 카테고리 색변경
	@PutMapping("/colorEdit/{c_sch_no}/{c_sch_color}")
	public ResponseEntity<?> colorEdit(@PathVariable int c_sch_no, @PathVariable String c_sch_color) {
		System.out.println("<<< colorEdit >>>");
		service.colorEdit(c_sch_no, c_sch_color);
		
		return new ResponseEntity<>(HttpStatus.OK);
	}	
	// 일정 카테고리 이름변경
	@PutMapping("/categoryNameEdit/{c_sch_no}/{c_sch_title}")
	public ResponseEntity<?> categoryNameEdit(@PathVariable int c_sch_no, @PathVariable String c_sch_title) {
		System.out.println("<<< categoryNameEdit >>>"+ c_sch_no + c_sch_title);
		service.categoryNameEdit(c_sch_no, c_sch_title);
		
		return new ResponseEntity<>(HttpStatus.OK);
	}
	// 일정 카테고리 등록
	@PostMapping("/addCategory/{emp_no}/{c_sch_title}")
	public ResponseEntity<?> addCategory(@PathVariable int emp_no, @PathVariable String c_sch_title) {
		System.out.println("<<< addCategory >>>"+ emp_no + c_sch_title);
		service.addCategory(emp_no, c_sch_title);
		 
		return new ResponseEntity<>(HttpStatus.OK);
	}
		
	// 일정 카테고리 삭제
	@DeleteMapping("/deleteCategory/{c_sch_no}")
	public ResponseEntity<?> deleteCategory(@PathVariable int c_sch_no) {
		System.out.println("<<< deleteCategory >>>"+ c_sch_no);
		int result = service.deleteCategory(c_sch_no);
		if(result != 1) {
			return new ResponseEntity<>("기본일정은 삭제 할 수 없습니다.", HttpStatus.OK);
		}
		else {
			return new ResponseEntity<>(HttpStatus.OK);
		}
	}
	// 일정 저장
	@PostMapping("/addSchedule/")
	public ResponseEntity<?> addSchedule(@RequestBody Schedule schedule) {
		System.out.println("<<< addSchedule >>>" +schedule);
	 
		return new ResponseEntity<>(service.addSchedule(schedule), HttpStatus.OK);
	}	
	// 일정 불러오기
	@GetMapping("/getSchedules/{emp_no}")
	public ResponseEntity<?> getSchedules(@PathVariable int emp_no) {
		System.out.println("<<< getSchedules >>>" +service.getSchedules(emp_no));
	
		return new ResponseEntity<>(service.getSchedules(emp_no), HttpStatus.OK);
	}	
}
