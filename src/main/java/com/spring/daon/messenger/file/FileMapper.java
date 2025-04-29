package com.spring.daon.messenger.file;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface FileMapper {
	void insertFile(FileDTO file);
}
