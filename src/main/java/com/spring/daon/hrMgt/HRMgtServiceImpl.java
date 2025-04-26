package com.spring.daon.hrMgt;

import java.math.BigDecimal;
import java.sql.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class HRMgtServiceImpl {

    @Autowired
    private HRMgtMapper Mapper;

    //  관리자 권한(admin_type) 수정
    public int updateAdminType(int empNo, int adminType) {
        return Mapper.updateAdminType(empNo, adminType);
    }

    //  전체 사원 목록 조회
    @Transactional(readOnly = true)
    public List<Employees> employeeList() {
        return Mapper.employeeList();
    }

    //  사원 등록
    @Transactional
    public int insertEmployee(Employees dto) {
        return Mapper.insertEmployee(dto);
    }

    //  사원 단건 조회
    @Transactional(readOnly = true)
    public Employees findByEmployee(int emp_no) {
        return Mapper.findByEmployee(emp_no);
    }

    //  사원 정보 수정
    @Transactional
    public int updateEmployee(int emp_no, Employees dto) {
        return Mapper.updateEmployee(dto);
    }

    //  사원 삭제
    @Transactional
    public String deleteEmplyee(int emp_no) {
        Mapper.deleteEmployee(emp_no);
        return "ok";
    }

    //  기본급 조회
    @Transactional(readOnly = true)
    public BigDecimal BaseSalaryByEmpNo(int empNo) {
        return Mapper.BaseSalaryByEmpNo(empNo);
    }

    //  퇴사 처리
    @Transactional
    public int resignEmployee(int empNo) {
        return Mapper.resignEmployee(empNo);
    }

    //  총 사원 수 
    @Transactional
    public int countAllEmployees() {
        return Mapper.countAllEmployees();
    }

    //  이번달 입사자 수 
    @Transactional
    public int countNewHiresThisMonth() {
        return Mapper.countNewHiresThisMonth();
    }

    //  이번달 퇴사자 수 
    @Transactional
    public int countResignedThisMonth() {
        return Mapper.countResignedThisMonth();
    }

    //  계약 만료 예정자 수 
    @Transactional
    public int countContractExpiringThisMonth() {
        return Mapper.countContractExpiringThisMonth();
    }

    //  이번달 생일자 수 
    @Transactional
    public int countBirthdaysThisMonth() {
        return Mapper.countBirthdaysThisMonth();
    }
   
    @Transactional
    public List<Map<String, Object>> getEmployeeCountByDepartment() {
        return Mapper.getEmployeeCountByDepartment();
    }
    
    // 계약직/인턴 사원 목록 
    @Transactional(readOnly = true)
    public List<Employees> findContractEmployees() {
        return Mapper.findContractEmployees();
    }
    // 계약 만료일 연장 (계약직/인턴 대상)
    @Transactional
    public int extendContract(int empNo, Date newEndDate) {
        return Mapper.extendContract(empNo, newEndDate);
    }
    // 정직원 전환 처리 
    @Transactional
    public int convertToRegular(int empNo) {
        return Mapper.convertToRegular(empNo);
    }
    
}
