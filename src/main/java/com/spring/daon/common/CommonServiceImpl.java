package com.spring.daon.common;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spring.daon.hrMgt.Employees;

@Service
public class CommonServiceImpl implements CommonService{

	@Autowired
	private CommonMapper CommonMapper; 
	
	// 직원 정보 불러오기
	public Employees getEmpInfo(int emp_no) {
		return CommonMapper.getEmpInfo(emp_no);
	}
}
