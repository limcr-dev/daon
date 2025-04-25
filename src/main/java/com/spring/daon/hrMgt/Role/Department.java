package com.spring.daon.hrMgt.Role;

import lombok.Data;

@Data
public class Department {

    private int dept_no;           // 부서 코드
    private String dept_name;      // 부서 이름
    private Integer dept_parent;   // 상위 부서 (nullable)

}
