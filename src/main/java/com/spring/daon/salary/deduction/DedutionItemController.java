package com.spring.daon.salary.deduction;

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
public class DedutionItemController {

	@Autowired
	private DedutionItemServiceImpl service;
	
	// 공제 항목 전체조회
	@GetMapping("/deductions")
	public ResponseEntity<List<DedutionItem>> findAll() {
		return new ResponseEntity<>(service.findAll(), HttpStatus.OK);
	}
	
	// 공제 등록
	@PostMapping("/deduction")
	public ResponseEntity<Integer> insert(@RequestBody DedutionItem dto) {
		return new ResponseEntity<>(service.insert(dto), HttpStatus.CREATED);
	}
	
	// 공제 수정
	@PutMapping("/deduction/{id}")
	public ResponseEntity<Integer> update(@PathVariable int id, @RequestBody DedutionItem dto) {
		dto.setId(id);
		return new ResponseEntity<>(service.update(dto), HttpStatus.OK);
		
	}
	
	// 공제 삭제
	@DeleteMapping("/deduction/{id}")
	public ResponseEntity<Integer> delete(@PathVariable int id) {
		return new ResponseEntity<>(service.delete(id), HttpStatus.OK);
	}
}
