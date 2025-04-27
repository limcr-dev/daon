package com.spring.daon.messenger.chat.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

//import javax.persistence.Column;
//import javax.persistence.EnumType;
//import javax.persistence.Enumerated;
//import javax.persistence.GeneratedValue;
//import javax.persistence.GenerationType;
//import javax.persistence.Id;
//
//import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {
	private Long id; 				// 메시지 고유 ID 추가
	private String roomCode;		// 채팅방 코드
	private int senderId;			// 보낸 사람 사번
	private String senderName;		// 보낸 사람 이름
	private String content;			// 메시지 내용 (텍스트 or 파일 경로)
	private String originalName; 	// (파일 이름용, 파일일 때만)
	private String type; 			// 'TEXT', 'FILE', 'IMAGE'
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime timestamp = LocalDateTime.now();
}
