package com.spring.daon.salary.SalarySchedule;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface SalaryScheduleMapper {
	
	List<SalarySchedule> findAll(); // 전체 조회
    
	SalarySchedule findByMonth(String salary_month); // 월별 조회
    
    int insert(SalarySchedule dto); // 등록
    
    int updatePayday(SalarySchedule dto); // 지급일 수정
   
    int updateCloseStatus(int id); // 마감
   
    int delete(int id); // 삭제
    
    // 급여 월 기준으로 is_calculated 값을 true로 업데이트 (전체 급여 계산 완료 표시)
    @Update("UPDATE salary_schedule SET is_calculated = TRUE WHERE salary_month = #{salaryMonth}")
    int markAsCalculated(@Param("salaryMonth") String salaryMonth);
}
