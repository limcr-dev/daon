package com.spring.daon.salary.allowance;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AllowanceItemMapper {

	// 수당 항목 전체조회
	List<AllowanceItem> findAll();
	
	// 수당 등록
	int insert(AllowanceItem dto);
	
	// 수당 수정
	int update(AllowanceItem dto);
	
	// 수당 삭제
	int delete(int id);
}
