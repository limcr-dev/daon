package com.spring.daon.performMgt;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public interface PerformMgtService {
	
	// 문제 리스트 페이지 
	public List<EvalQuesComp> evalQuesList();
	
	// 역량 리스트
	public List<EvalQuesComp> evalList();
	
	// 역량을 넣어서 테스트 insert하기
//	public  insertTest (eval_click_emp);
	
}
