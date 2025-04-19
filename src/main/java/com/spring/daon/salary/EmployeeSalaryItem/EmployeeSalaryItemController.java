package com.spring.daon.salary.EmployeeSalaryItem;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class EmployeeSalaryItemController {

	@Autowired
	private EmployeeSalaryItemServiceImpl service;
	
	// 사원 수당/공제 항목 조회(월기준)
	@GetMapping("/salaryItem")
	public ResponseEntity<List<EmployeeSalaryItem>> findByEmpNo(@RequestParam int emp_no, @RequestParam String salary_month) {
		return new ResponseEntity<>(service.findByEmpNo(emp_no, salary_month), HttpStatus.OK);
	}
	
	// 항목 등록
	@PostMapping("/salaryItem")
	public ResponseEntity<Integer> insert(@RequestBody EmployeeSalaryItem dto) {
		System.out.println("insert");
		return new ResponseEntity<>(service.insert(dto), HttpStatus.CREATED);
	}
	
	// 항목 수정
	@PutMapping("salaryItem/{id}")
	public ResponseEntity<Integer> update(@PathVariable int id, @RequestBody EmployeeSalaryItem dto) {
		return new ResponseEntity<>(service.update(dto), HttpStatus.OK);
	}
	
	// 수정 삭제
	@DeleteMapping("salaryItem/{id}")
	public ResponseEntity<Integer> delete(@PathVariable int id) {
		return new ResponseEntity<>(service.delete(id), HttpStatus.OK);
	}
}
