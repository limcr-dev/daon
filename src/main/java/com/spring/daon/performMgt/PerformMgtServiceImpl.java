package com.spring.daon.performMgt;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;



@Service
public class PerformMgtServiceImpl implements PerformMgtService {
	
	@Autowired
	private PerformMgtMapper perMapper; 

	// 문제 리스트 페이지 
	@Override
	public List<EvalQuesComp> evalQuesList() {
		System.out.println("test"+ perMapper.evalQuesList() );
		return  perMapper.evalQuesList();
		
	}

	// 역량 리스트
	@Override
	public List<EvalQuesComp> evalList() {
		System.out.println("test"+ perMapper.evalQuesList() );
		return perMapper.evalList();
	}

}
