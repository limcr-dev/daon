package com.spring.daon.messenger.chat.dto;

import lombok.Data;

@Data
public class ChatRequest {
	private int userId;
    private int targetId;
}
