package com.spring.daon.approve;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ApproveMapper {
	
	public List<Documents> getDocumentList(int status);
	
	//public List<Documents> getCompleteList();
}
