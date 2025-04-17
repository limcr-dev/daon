package com.spring.daon.performMgt;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;



@Service
public class PerformMgtServiceImpl {
	
	@Autowired
	private PerformMgtMapper perMapper; 

	// 문제 리스트 페이지 
	public List<EvalQuesComp> evalQuesList() {
		System.out.println("문제리스트"+ perMapper.evalQuesList() );
		return  perMapper.evalQuesList();
		
	}

	// 역량 리스트
	public List<EvalQuesComp> compList() {
		System.out.println("역량리스트"+ perMapper.compList() );
		return perMapper.compList();
	}
	
	// 역량을 넣어서 테스트 insert하기
	public int insertTest(Test test) {
		System.out.println("test" );
		return perMapper.insertTest(test);
	}
	
	// 평가 직원 리스트
	public List<EvalQuesComp> evalList() {
		System.out.println("평가직원"+ perMapper.evalList() );
		return perMapper.evalList();
	}
	
	// 저장된 테스트 리스트
	public List<Test> testList() {
		System.out.println("테스트 리스트"+ perMapper.testList() );
		return perMapper.testList();
	}
	
	// 삭제 테스트 리스트
	public String deleteTest(String eval_order_num) {
		System.out.println("테스트 삭제"+ perMapper.deleteTest(eval_order_num) );
		
		return "ok";
	}
	
	// 마지막 순번 불러오기(다음번호로 올리기 위합)
	public String findLastOrderNum() {
		System.out.println("테스트 삭제"+ perMapper.selectLastOrderNum() );
		
		return perMapper.selectLastOrderNum();
	}

}
