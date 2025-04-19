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
	public List<Employees> abList(int startRow, int size) {
		System.out.println("<<< MessengerServiceImpl - abList >>>");
		return messengerMapper.abList(startRow, size);
	}
	
	// 주소록 검색(검색 시 조회)
	@Transactional
	public List<Employees> searchPerson(String search, int startRow, int size) {
		System.out.println("<<< MessengerServiceImpl - searchPerson >>>");
		return messengerMapper.searchPerson(search, startRow, size);
	}
	
	// 주소록 갯수
	@Transactional
	public int abCount(String search) {
		System.out.println("<<< MessengerServiceImpl - abCount >>>");
		
		if (search == null || search.trim().isEmpty()) {
			return messengerMapper.abCount();
		} else {
			return messengerMapper.abCountSearch(search);
		}
	}
}
