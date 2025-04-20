package com.spring.daon.salary.EmployeeSalaryItem;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EmployeeSalaryItemServiceImpl {

	@Autowired
	private EmployeeSalaryItemMapper mapper;
	
	// 사원 수당/공제 항목 조회(월기준)
	@Transactional(readOnly = true)
	public List<EmployeeSalaryItem> findByEmpNo(int emp_no, String salary_month) {
		return mapper.findByEmpNo(emp_no, salary_month);
	}
	
	// 항목 등록
	@Transactional
	public int insert(EmployeeSalaryItem dto) {
		return mapper.insert(dto);
	}
	
	// 항목 수정
	@Transactional
	public int update(EmployeeSalaryItem dto) {
		return mapper.update(dto);
	}
	
	// 항목 삭제
	@Transactional
	public int delete(int id) {
		return mapper.delete(id);
	}
}
