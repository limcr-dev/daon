package com.spring.daon.salary.EmployeeSalarySummary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class EmployeeSalarySummaryController {

    @Autowired
    private SalaryServiceImpl salaryService;

    /**
     * 급여 계산 API (관리자용)
     * 예: /api/salary/calculate?emp_no=1001&salary_month=2024-04
     */
    @PostMapping("/salary/calculate")
    public ResponseEntity<String> calculateSalary(
        @RequestParam("emp_no") int empNo,
        @RequestParam("salary_month") String salaryMonth
    ) {
        try {
            salaryService.calculateAndSave(empNo, salaryMonth);
            return ResponseEntity.ok("급여 계산 완료");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("급여 계산 실패");
        }
    }
}
