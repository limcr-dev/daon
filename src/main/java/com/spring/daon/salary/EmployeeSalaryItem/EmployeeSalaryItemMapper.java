package com.spring.daon.salary.EmployeeSalaryItem;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface EmployeeSalaryItemMapper {

	// 사원 수당/공제 항목 조회(월기준)
	List<EmployeeSalaryItem> findByEmpNo(int emp_no, String salary_month);
	
	// 항목 등록
	int insert(EmployeeSalaryItem dto);
	
	// 항목 수정
	int update(EmployeeSalaryItem dto);
	
	// 항목 삭제
	int delete(int id);
}
