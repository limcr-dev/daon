package com.spring.daon.messenger.chat.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatRoomList {
    private String roomCode;		// 채팅방 코드
    private String lastMessage;		// 마지막 메시지 내용
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime lastTime;	// 마지막 메시지 보낸 시간
    private String roomCreated;		// 방 생성일
}
