package com.spring.daon.messenger.chat.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatGroup {
	private String roomName;		// 방 이름
	private int creatorId; 			// 방 만든 사람
    private List<Integer> userIds; 	// 초대된 사람 리스트
}
