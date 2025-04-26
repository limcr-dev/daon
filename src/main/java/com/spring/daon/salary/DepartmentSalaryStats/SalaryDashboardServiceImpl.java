package com.spring.daon.salary.DepartmentSalaryStats;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SalaryDashboardServiceImpl {

    @Autowired
    private SalaryDashboardMapper mapper;

    public List<DepartmentSalaryStats> getDeptStats(String salaryMonth) {
        return mapper.getDepartmentSalaryStats(salaryMonth);
    }
    
    public List<MonthlySalaryStat> getMonthlyStats() {
        return mapper.getMonthlySalaryStats();
    }
}