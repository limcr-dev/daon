package com.spring.daon.messenger;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.spring.daon.hrMgt.Employees;

@Service
public class MessengerServiceImpl {
	
	@Autowired
	private MessengerMapper messengerMapper;
	
	// 주소록 목록 조회
	@Transactional
	public List<Employees> abList() {
		System.out.println("<<< MessengerServiceImpl - abList >>>");
		return messengerMapper.abList();
	}
	
	
//	// 주소록 검색(검색 시 조회)
//	@Transactional
//	public Employees searchPerson(int emp_no) {
//		return messengerMapper.searchPerson(emp_no);
//	}
}
