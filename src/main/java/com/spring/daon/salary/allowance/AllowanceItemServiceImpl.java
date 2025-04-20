package com.spring.daon.salary.allowance;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AllowanceItemServiceImpl {

	@Autowired
	private AllowanceItemMapper mapper;
	
	// 수당 항목 전체조회
	@Transactional(readOnly = true)
	public List<AllowanceItem> findAll() {
		return mapper.findAll();
	}
	// 수당 등록
	@Transactional
	public int insert(AllowanceItem dto) {
		return mapper.insert(dto);
	}
	// 수당 수정
	@Transactional
	public int update(AllowanceItem dto) {
		return mapper.update(dto);
	}
	//수당 삭제
	@Transactional
	public int delete(int id) {
		return mapper.delete(id);
	}	
}
