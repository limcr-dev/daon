package com.spring.daon.salary.DepartmentSalaryStats;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin
public class SalaryDashboardController {

    @Autowired
    private SalaryDashboardServiceImpl service;

    @GetMapping("/department-salary")
    public ResponseEntity<List<DepartmentSalaryStats>> getDeptStats(@RequestParam String salaryMonth) {
        return ResponseEntity.ok(service.getDeptStats(salaryMonth));
    }
   
    @GetMapping("/monthly-total-pay")
    public ResponseEntity<List<MonthlySalaryStat>> getMonthlyStats() {
        return ResponseEntity.ok(service.getMonthlyStats());
    }
}
