package com.spring.daon.login.mappers;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import com.spring.daon.hrMgt.Employees;

@Mapper
@Repository
public interface LoginMapper {
	
	public Employees findByEmp_email(String emp_email);
	
	public Employees toEmployees(Employees dto); 
	
	public Employees findByEmp_no(int emp_no); 	

}
