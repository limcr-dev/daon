package com.spring.daon.salary.allowance;

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
@RequestMapping("/api")
@CrossOrigin
public class AllowanceItemController {

	@Autowired
	private AllowanceItemServiceImpl service;
	
	// 수당 항목 전체조회
	@GetMapping("/allowances")
	public ResponseEntity<List<AllowanceItem>> findAll() {
		return new ResponseEntity<>(service.findAll(), HttpStatus.OK);
	}
	
	// 수당 등록
	@PostMapping("/allowance")
	public ResponseEntity<Integer> insert(@RequestBody AllowanceItem dto) {
		return new ResponseEntity<>(service.insert(dto), HttpStatus.CREATED);
	}
	
	// 수당 수정
	@PutMapping("/allowance/{id}")
	public ResponseEntity<Integer> update(@PathVariable int id, @RequestBody AllowanceItem dto) {
		return new ResponseEntity<>(service.update(dto), HttpStatus.OK);
	}
	
	// 수당 삭제
	@DeleteMapping("/allowance/{id}")
	public ResponseEntity<Integer> delete(@PathVariable int id) {
		return new ResponseEntity<>(service.delete(id), HttpStatus.OK);
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
}
