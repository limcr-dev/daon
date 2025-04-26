package com.spring.daon.messenger.chat.dto;

import java.time.OffsetDateTime;

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
	private String roomCode;
	private int senderId;
	private String senderName;
	private String content;
	private String originalName; // 파일 이름용 (옵션)
	private String type; // TEXT, FILE, IMAGE
	private OffsetDateTime timestamp = OffsetDateTime.now(); // 서버 기준 시간
}
