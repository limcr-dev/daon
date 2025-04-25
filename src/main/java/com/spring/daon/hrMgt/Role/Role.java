package com.spring.daon.hrMgt.Role;

import java.sql.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Role {
	private int role_id;         // 직책 ID
    private String role_name;    // 직책명
    private int dept_no;         // 부서 코드
    private int is_active;       // 사용 여부
    private Timestamp created_at;
}