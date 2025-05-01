package com.spring.daon.messenger.file;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Data
public class FileDTO {
   private String roomCode;
    private int senderId;
    private String originalName;
    private String savedName;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime uploadedAt = LocalDateTime.now();
}
