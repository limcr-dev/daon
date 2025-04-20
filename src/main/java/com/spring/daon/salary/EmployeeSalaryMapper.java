package com.spring.daon.salary;


import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface EmployeeSalaryMapper {

    // 특정 급여 월의 전체 급여 요약 목록 조회
    List<EmployeeSalaryList> findSalarySummaryByMonth(String salaryMonth);
    
    List<SalaryItem> findAllowances(@Param("empNo") int empNo, @Param("salaryMonth") String salaryMonth);
    List<SalaryItem> findDeductions(@Param("empNo") int empNo, @Param("salaryMonth") String salaryMonth);
    SalaryDetail findSummaryDetail(@Param("empNo") int empNo, @Param("salaryMonth") String salaryMonth);

}
