package com.spring.daon.salary.EmployeeSalarySummary;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spring.daon.hrMgt.HRMgtMapper;
import com.spring.daon.salary.EmployeeSalaryItem.EmployeeSalaryItem;
import com.spring.daon.salary.EmployeeSalaryItem.EmployeeSalaryItemMapper;
import com.spring.daon.salary.SalarySchedule.SalaryScheduleServiceImpl;

@Service
public class SalaryServiceImpl {

	@Autowired
	private HRMgtMapper employeesMapper;
	
	@Autowired
	private EmployeeSalaryItemMapper salaryItemMapper;
	
	@Autowired
	private EmployeeSalarySummaryMapper summaryMapper;
	
	public void calculateAndSave(int empNo, String salaryMonth) {
		// 사원 기본급 
		BigDecimal basePay = employeesMapper.BaseSalaryByEmpNo(empNo);
		
		// 해당 사원 급여 항목 
		List<EmployeeSalaryItem> items = salaryItemMapper.findByEmpNo(empNo, salaryMonth);
		
		BigDecimal totalAllowance = BigDecimal.ZERO;
		BigDecimal totalDeduction = BigDecimal.ZERO;
		
		for (EmployeeSalaryItem item : items) {
			if("ALLOWANCE".equals(item.getItem_type())) {
				totalAllowance = totalAllowance.add(item.getAmount());
			}else if ("DEDUCTION".equals(item.getItem_type())) {
				if (!"소득세".equals(item.getItem_name()) && !"지방소득세".equals(item.getItem_name())) {
					totalDeduction = totalDeduction.add(item.getAmount());
				}
			}
		}
		
		// 소득세 및 지방소득세 자동 계산
		BigDecimal incomeTax = TaxCalculator.calculateMonthlyIncomeTax(basePay);
		BigDecimal localTax = TaxCalculator.calculateLocalIncomeTax(incomeTax);
		
		// 5. 총 지급액 및 실수령액 계산
        BigDecimal totalPay = basePay.add(totalAllowance);
        BigDecimal actualPay = totalPay.subtract(totalDeduction).subtract(incomeTax).subtract(localTax);

		// 6. 요약 DTO 구성
        EmployeeSalarySummary summary = EmployeeSalarySummary.builder()
                .emp_no(empNo)
                .salary_month(salaryMonth)
                .base_pay(basePay)
                .total_allowance(totalAllowance)
                .total_deduction(totalDeduction)
                .income_tax(incomeTax)
                .local_tax(localTax)
                .total_pay(totalPay)
                .actual_pay(actualPay)
                .build();

        // 7. 저장 (upsert)
        summaryMapper.upsert(summary);
    }
	
	// 전체 급여 계산 완료 후 is_calculated = true 업데이트 포함
	@Autowired
	private SalaryScheduleServiceImpl scheduleService;

	public void calculateAllEmployees(String salaryMonth) {
	    List<Integer> empNos = employeesMapper.findActiveEmpNos();  // 재직 중인 사원 목록 조회

	    for (int empNo : empNos) {
	        calculateAndSave(empNo, salaryMonth);  // 기존 계산 로직 재사용
	    }

	    // 전체 계산 후 급여 대장에 계산 완료 상태로 업데이트
	    scheduleService.markAsCalculated(salaryMonth);
	}
}

