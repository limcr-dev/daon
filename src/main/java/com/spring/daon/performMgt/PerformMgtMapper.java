package com.spring.daon.performMgt;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

@Mapper
@Repository
public interface PerformMgtMapper {
	
	// 전체리스트 문제 불러오기
	public List<EvalQuesComp> evalQuesList();
	
	// 역량 리스트
	public List<EvalQuesComp> evalList();
	
	// 역량을 넣어서 테스트 insert하기
//	public 
	

	// 역량별 문제 불러오기
	
	
	// 역량별 문제 등록하기
	
	// 역량별 문제 수정하기
	
	
	// 역량별 문제 삭제하기
	
	// 
	
}
