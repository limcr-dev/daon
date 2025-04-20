package com.spring.daon.salary.deduction;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DedutionItemServiceImpl {

	@Autowired
	private DedutionItemMapper mapper;
	
	// 공제 항목 전체조회
	@Transactional(readOnly = true)
	public List<DedutionItem> findAll() {
		return mapper.findAll();
	}
	
	// 공제 등록
	@Transactional
	public int insert(DedutionItem dto) {
		return mapper.insert(dto);
	}
	
	// 공제 수정
	@Transactional
	public int update(DedutionItem dto) {
		return mapper.update(dto);
	}
	
	//공제 삭제
	@Transactional
	public int delete(int id) {
		return mapper.delete(id);
	}
}
