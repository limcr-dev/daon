package com.spring.daon.orgChart;

import java.util.List;

import com.spring.daon.hrMgt.Employees;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Department {
	private int dept_no;       // 부서 코드
    private String dept_name;  // 부서명
    private Integer dept_parent; // 상위 부서 (최상위 부서는 NULL)
    private List<Employees> employees; // 부서에 속한 직원 리스트 추가!
	
}
