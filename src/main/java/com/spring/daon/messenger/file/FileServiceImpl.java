package com.spring.daon.messenger.file;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FileServiceImpl {
	 private final FileMapper fileMapper;

	 public void saveFile(String roomCode, int senderId, String originalName, String savedName) {
	        FileDTO file = new FileDTO();
	        file.setRoomCode(roomCode);
	        file.setSenderId(senderId);
	        file.setOriginalName(originalName);
	        file.setSavedName(savedName);
	        fileMapper.insertFile(file);
	    }
}
