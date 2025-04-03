package com.spring.daon.messenger;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import com.spring.daon.hrMgt.Employees;

@Mapper
@Repository
public interface MessengerMapper {

	// 주소록 목록 조회
	public List<Employees> abList();
	
//	// 주소록 검색(검색 시 조회)
//	public Employees searchPerson(int emp_no);

}
