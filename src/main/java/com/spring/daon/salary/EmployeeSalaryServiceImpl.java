package com.spring.daon.salary;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmployeeSalaryServiceImpl {

    @Autowired
    private EmployeeSalaryMapper mapper;

    public SalaryDetail getSalaryDetail(int empNo, String salaryMonth) {
        SalaryDetail dto = mapper.findSummaryDetail(empNo, salaryMonth);
        dto.setAllowances(mapper.findAllowances(empNo, salaryMonth));
        dto.setDeductions(mapper.findDeductions(empNo, salaryMonth));
        return dto;
    }
}
