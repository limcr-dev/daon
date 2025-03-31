package com.spring.daon.common;

import org.springframework.stereotype.Service;

import com.spring.daon.hrMgt.Employees;

@Service
public interface CommonService {
	
	// 직원 정보 불러오기
	public Employees getEmpInfo(int emp_no);
}
