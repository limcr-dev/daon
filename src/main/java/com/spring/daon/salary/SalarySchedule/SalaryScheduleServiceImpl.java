package com.spring.daon.salary.SalarySchedule;


import java.sql.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SalaryScheduleServiceImpl {

    @Autowired
    private SalaryScheduleMapper mapper;

    public List<SalarySchedule> findAll() {
        return mapper.findAll();
    }

    public SalarySchedule findByMonth(String salary_month) {
        return mapper.findByMonth(salary_month);
    }

    public int insert(SalarySchedule dto) {
    	// 사용자가 지급일(payday)을 입력하지 않은 경우
        if (dto.getPayday() == null) {
            String month = dto.getSalary_month(); // 예: "2025-04"
            dto.setPayday(Date.valueOf(month + "-26")); // "2025-04-25" 형식으로 설정
        }

        return mapper.insert(dto);
    }

    public int updatePayday(SalarySchedule dto) {
        return mapper.updatePayday(dto);
    }
    
    public int closeSchedule(int id) {
        return mapper.updateCloseStatus(id);
    }

    public int delete(int id) {
        return mapper.delete(id);
    }    
    
	// ✅ 급여 계산 완료 상태로 표시하는 서비스 메서드
	// - 급여 월을 기준으로 급여 대장에서 is_calculated = true로 업데이트
    public int markAsCalculated(String salaryMonth) {
    	return mapper.markAsCalculated(salaryMonth);
    }
    
}
