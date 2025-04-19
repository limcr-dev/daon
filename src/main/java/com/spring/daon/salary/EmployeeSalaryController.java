package com.spring.daon.salary;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class EmployeeSalaryController {

    @Autowired
    private EmployeeSalaryMapper mapper;

    @Autowired
    private EmployeeSalaryServiceImpl service;

    /**
     * ✅ 급여 요약 목록 조회 API
     * 예: /api/salaries/summary?salaryMonth=2024-04
     */
    @GetMapping("/salaries/summary")
    public ResponseEntity<List<EmployeeSalaryList>> getSalarySummaryByMonth(
            @RequestParam("salaryMonth") String salaryMonth
    ) {
        List<EmployeeSalaryList> list = mapper.findSalarySummaryByMonth(salaryMonth);
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    /**
     * ✅ 급여 상세 조회 API
     * 예: /api/salaries/detail?empNo=1001&salaryMonth=2024-04
     */
    @GetMapping("/salaries/detail")
    public ResponseEntity<SalaryDetail> getSalaryDetail(
            @RequestParam int empNo,
            @RequestParam String salaryMonth
    ) {
        SalaryDetail dto = service.getSalaryDetail(empNo, salaryMonth);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }
}
