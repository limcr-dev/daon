package com.spring.daon.messenger.addressBook;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import com.spring.daon.hrMgt.Employees;

@Mapper
@Repository
public interface AddressBookMapper {

	// 주소록 목록 조회
	public List<Employees> abList(int startRow, int size);
	
	// 주소록 검색(검색 시 조회)
	public List<Employees> searchPerson(String search, int startRow, int size);
	
	// 리스트 갯수
	public int abCount();
	
	// 리스트 갯수
	public int abCountSearch(String search);
}
