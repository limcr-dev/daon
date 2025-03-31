package com.spring.daon.common;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import com.spring.daon.hrMgt.Employees;

@Mapper
@Repository
public interface CommonMapper {

	// 직원 정보 불러오기 
	public Employees getEmpInfo(int emp_no); 
}
