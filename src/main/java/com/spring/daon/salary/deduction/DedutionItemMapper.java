package com.spring.daon.salary.deduction;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface DedutionItemMapper {

	// 공제 한목 전체조회
	List<DedutionItem> findAll();
	
	// 공제 등록
	int insert(DedutionItem dto);
	
	// 공제 수정
	int update(DedutionItem dto);
	
	// 공제 삭제
	int delete(int id);
	
}
