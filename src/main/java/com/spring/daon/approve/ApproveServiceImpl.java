package com.spring.daon.approve;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ApproveServiceImpl {
	
	@Autowired
	ApproveMapper apprMapper;
	
	public List<Documents> getDocumentList(int status){
		System.out.println("<<< ApproveServiceImpl - getDocumentList >>>");
		return apprMapper.getDocumentList(status);
	}
	
//	public List<Documents> getCompleteList(){
//		System.out.println("<<< ApproveServiceImpl - getCompleteList >>>");
//		return apprMapper.getCompleteList();
//	}
}
