package com.spring.daon.salary.EmployeeSalarySummary;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class TaxCalculator {

	/**
	 * 소득세 및 지방소득세 계산 유틸 클래스
	 *
	 * - 연봉 기준으로 소득세 계산
	 * - 소득세 기준으로 지방소득세 계산
	 */

	    /**
	     * 월 기준 과세소득을 받아서 소득세를 계산하는 메서드
	     *
	     * @param basePay 월 과세 대상 급여 (예: 기본급 + 과세 수당)
	     * @return 계산된 월 소득세 (정수 단위, 반올림)
	     */
	public static BigDecimal calculateMonthlyIncomeTax(BigDecimal basePay) {
		// 1. 월급을 연봉으로 환산 (월 × 12)
		BigDecimal annualSalary = basePay.multiply(new BigDecimal("12"));
		BigDecimal annualTax;
		
		// 2. 연 소득에 따라 누진세율 적용 (2024년 기준 누진세율)
		if (annualSalary.compareTo(new BigDecimal("14000000")) <= 0) {
		// ~1,400만 원 이하: 6%
		annualTax = annualSalary.multiply(new BigDecimal("0.06"));
		} else if (annualSalary.compareTo(new BigDecimal("50000000")) <= 0) {
		// 1,400만 초과 ~ 5,000만 이하: 15% - 1,260,000 공제
		annualTax = annualSalary.multiply(new BigDecimal("0.15")).subtract(new BigDecimal("1260000"));
		} else if (annualSalary.compareTo(new BigDecimal("88000000")) <= 0) {
		// 5,000만 초과 ~ 8,800만 이하: 24% - 5,760,000 공제
		annualTax = annualSalary.multiply(new BigDecimal("0.24")).subtract(new BigDecimal("5760000"));
		} else if (annualSalary.compareTo(new BigDecimal("150000000")) <= 0) {
		// 8,800만 초과 ~ 1억5천만 이하: 35% - 15,440,000 공제
		annualTax = annualSalary.multiply(new BigDecimal("0.35")).subtract(new BigDecimal("15440000"));
		} else if (annualSalary.compareTo(new BigDecimal("300000000")) <= 0) {
		// 1억5천 초과 ~ 3억 이하: 38% - 19,940,000 공제
		annualTax = annualSalary.multiply(new BigDecimal("0.38")).subtract(new BigDecimal("19940000"));
		} else if (annualSalary.compareTo(new BigDecimal("500000000")) <= 0) {
		// 3억 초과 ~ 5억 이하: 40% - 25,940,000 공제
		annualTax = annualSalary.multiply(new BigDecimal("0.40")).subtract(new BigDecimal("25940000"));
		} else if (annualSalary.compareTo(new BigDecimal("1000000000")) <= 0) {
		// 5억 초과 ~ 10억 이하: 42% - 35,940,000 공제
		annualTax = annualSalary.multiply(new BigDecimal("0.42")).subtract(new BigDecimal("35940000"));
		} else {
		    // 10억 초과: 45% - 65,940,000 공제
		annualTax = annualSalary.multiply(new BigDecimal("0.45")).subtract(new BigDecimal("65940000"));
		}
		
		// 3. 연 소득세를 월로 나눠서 월 소득세로 변환 (반올림, 소수점 버림)
		return annualTax.divide(new BigDecimal("12"), 0, RoundingMode.HALF_UP);
		}
		
		/**
		 * 지방소득세 계산 메서드
		 *
		 * @param incomeTax 계산된 월 소득세
		 * @return 월 지방소득세 (소득세의 10%, 반올림)
		 */
		public static BigDecimal calculateLocalIncomeTax(BigDecimal incomeTax) {
		    return incomeTax.multiply(new BigDecimal("0.1")).setScale(0, RoundingMode.HALF_UP);
		}



}
