package com.spring.daon.hrMgt;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

@Mapper
@Repository
public interface HRMgtMapper {

	// 사원 목록
	public List<Employees> employeeList();
	
	// 사원 등록
	public int insertEmployee(Employees dto);
	
	// 사원 조회
	public Employees findByEmployee(int emp_no);
	
	// 사원 수정
	public int updateEmployee(Employees dto);
	
	// 사원 삭제
	public int deleteEmployee(int emp_no);
	
}
