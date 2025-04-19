package com.spring.daon.hrMgt;

import java.math.BigDecimal;
import java.util.List;

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

@RestController
@CrossOrigin
@RequestMapping("/api")
public class HRMgtController {
	
	@Autowired
	private HRMgtServiceImpl service;
	
	// 사원 목록
	@GetMapping("/employeeList")
	public ResponseEntity<List<Employees>> findAll() {
		System.out.println("employeeList");
		
		return new ResponseEntity<>(service.employeeList(), HttpStatus.OK);
	}
	
	// 사원 등록
	@PostMapping("/insertEmployee")
	public ResponseEntity<Integer> save(@RequestBody Employees dto) {
		System.out.println("insertEmployee");
		
		return new ResponseEntity<>(service.insertEmployee(dto), HttpStatus.CREATED);
	}
	
	// 사원 조회
	@GetMapping("/employee/{emp_no}")
	public ResponseEntity<Employees> findById(@PathVariable int emp_no) {
		System.out.println("findById");
		
		return new ResponseEntity<>(service.findByEmployee(emp_no), HttpStatus.OK);
	}
	
	@PutMapping("/updateEmployee/{emp_no}")
	public ResponseEntity<Integer> updateEmployee(@PathVariable int emp_no, @RequestBody Employees dto) {
		System.out.println("updateEmployee");
		
		return new ResponseEntity<>(service.updateEmployee(emp_no, dto), HttpStatus.OK);
	}
	
	// 사원 삭제
	@DeleteMapping("/deleteEmployee/{emp_no}")
	public ResponseEntity<String> deleteEmployee(@PathVariable int emp_no) {
		System.out.println("deleteEmployee");
		
		return new ResponseEntity<>(service.deleteEmplyee(emp_no), HttpStatus.OK);
	}
	
	// 사원 기본급 조회
	@GetMapping("/employee/{emp_no}/baseSalary")
	public ResponseEntity<BigDecimal> BaseSalaryByEmpNo(@PathVariable("emp_no") int empNo) {
		return new ResponseEntity<>(service.BaseSalaryByEmpNo(empNo), HttpStatus.OK);
	}
}
