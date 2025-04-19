package com.spring.daon.salary.EmployeeSalarySummary;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface EmployeeSalarySummaryMapper {
	
	// 급여 정보 저장
	int upsert(EmployeeSalarySummary dto);

}
