package com.spring.daon.login.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefreshToken {
    private Long id;
    private Integer empNo;
    private String token;
    private LocalDateTime expiryDate;
    private LocalDateTime createdAt;
}