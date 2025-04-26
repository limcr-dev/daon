package com.spring.daon.salary.DepartmentSalaryStats;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface SalaryDashboardMapper {
    List<DepartmentSalaryStats> getDepartmentSalaryStats(String salaryMonth);
    
    List<MonthlySalaryStat> getMonthlySalaryStats();
}