package com.spring.daon.hrMgt;

import java.math.BigDecimal;
import java.sql.Date;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

@Mapper
@Repository
public interface HRMgtMapper {

    //  관리자 권한(admin_type) 수정
    int updateAdminType(@Param("empNo") int empNo, @Param("adminType") int adminType);

    //  전체 사원 목록 조회
    List<Employees> employeeList();

    //  사원 등록
    int insertEmployee(Employees dto);

    //  사원 단건 조회
    Employees findByEmployee(int emp_no);

    //  사원 정보 수정
    int updateEmployee(Employees dto);

    //  사원 삭제
    int deleteEmployee(int emp_no);

    //  기본급 조회
    BigDecimal BaseSalaryByEmpNo(int empNo);

    //  재직 중 사원번호 목록 조회
    List<Integer> findActiveEmpNos();

    //  퇴사 처리
    int resignEmployee(@Param("empNo") int empNo);

    //  총 사원 수 
    int countAllEmployees();

    //  이번달 입사자 수 
    int countNewHiresThisMonth();

    //  이번달 퇴사자 수 
    int countResignedThisMonth();

    //  이번달 계약 만료 예정자 수 
    int countContractExpiringThisMonth();

    //  이번달 생일자 수 
    int countBirthdaysThisMonth();

    // 부서별 사원 수 통계
    List<Map<String, Object>> getEmployeeCountByDepartment();
    
    // 계약직/인턴 사원 목록 
    List<Employees> findContractEmployees();
    
    // 계약 만료일 연장 (계약직/인턴 대상)
    int extendContract(@Param("empNo") int empNo, @Param("newEndDate") Date newEndDate);
    
    // 정직원 전환 처리 
    int convertToRegular(@Param("empNo") int empNo);

    // 본인제외 전체 조회
    List<Employees> findAllExceptMe(@Param("myId") int myId);
} 
