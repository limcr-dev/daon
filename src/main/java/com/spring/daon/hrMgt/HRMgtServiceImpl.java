package com.spring.daon.hrMgt;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class HRMgtServiceImpl {

	@Autowired
	private HRMgtMapper Mapper;
	
	// 사원 목록
	@Transactional(readOnly=true)
	public List<Employees> employeeList() {
		return Mapper.employeeList();
	}
	
	// 사원 등록
	@Transactional
	public int insertEmployee(Employees dto) {
		return Mapper.insertEmployee(dto);
	}
	
	// 사원 조회
	@Transactional
	public Employees findByEmployee(int emp_no) {
		return Mapper.findByEmployee(emp_no);
	}
	
	// 사원 수정
	@Transactional
	public int updateEmployee(int emp_no, Employees dto) {
		return Mapper.updateEmployee(dto);
	}
	
	// 사원 삭제
	@Transactional
	public String deleteEmplyee(int emp_no) {
		Mapper.deleteEmployee(emp_no);
		
		return "ok";
	}
	
	// 사원 기본급 조회
	public BigDecimal BaseSalaryByEmpNo(int empNo) {
		return Mapper.BaseSalaryByEmpNo(empNo);
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
}
