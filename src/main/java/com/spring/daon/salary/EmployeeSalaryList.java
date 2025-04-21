package com.spring.daon.salary;

import lombok.Data;

import java.math.BigDecimal;

/**
 * 급여 요약 목록 화면에 사용하는 DTO
 */
@Data
public class EmployeeSalaryList {

    private int emp_no;                      // 사원 번호
    private String emp_name;                // 사원 이름
    private int dept_no;                    // 부서 번호 (→ 프론트에서 부서명 변환)
    private int position_id;                // 직급 코드 (→ 프론트에서 직급명 변환)
    private int emp_status;                // 재직 상태 (→ 프론트에서 '재직', '퇴사' 등으로 표시)
    private String hire_date;              // 입사일

    private BigDecimal base_pay;            // 기본급
    private BigDecimal total_allowance;     // 총 수당
    private BigDecimal total_deduction;     // 총 공제
    private BigDecimal actual_pay;          // 실수령액
}
