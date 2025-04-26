package com.spring.daon.messenger.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatTyping {
//    private String roomCode;
//    private int senderId;
	private String roomCode;
    private int senderId;
    private String senderName;
}
