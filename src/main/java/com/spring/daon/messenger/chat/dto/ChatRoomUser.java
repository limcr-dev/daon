package com.spring.daon.messenger.chat.dto;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "chat_room_user")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRoomUser {
	@Id
    private Long id;

    @Column(name = "room_code")
    private String roomCode;

    @Column(name = "user_id")
    private int userId;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "user_joined_at")
    private LocalDateTime joinedAt;
}
