package com.spring.daon.messenger.file;

import lombok.Data;

@Data
public class FileDTO {
	private String roomCode;
    private int senderId;
    private String originalName;
    private String savedName;
}
