package com.spring.daon.hrMgt;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.CharBuffer;
import java.sql.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class HRMgtController {

    @Autowired
    private HRMgtServiceImpl service;

    @Autowired
    private PasswordEncoder passwordEncoder; // 🔐 BCryptPasswordEncoder 주입 필요

    //  사원 등록
    @PostMapping("/insertEmployee")
    public ResponseEntity<Integer> insertEmployee(
        @RequestPart("employee") Employees dto,
        @RequestPart(value = "image", required = false) MultipartFile imageFile
    ) throws IOException {
        System.out.println("📌 insertEmployee 호출됨");

        // 1. 비밀번호 자동 설정 및 암호화
        String rawPassword = dto.getEmp_birthday().toString().replace("-", ""); // yyyyMMdd
        String encodedPassword = passwordEncoder.encode(CharBuffer.wrap(rawPassword));
        dto.setEmp_pwd(encodedPassword);

        // 2. 프로필 이미지 처리
        if (imageFile != null && !imageFile.isEmpty()) {
            String fileName = "emp_" + System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
            String fullPath = System.getProperty("user.dir") + "/src/main/resources/static/profileImages/" + fileName;

            File dest = new File(fullPath);
            dest.getParentFile().mkdirs();
            imageFile.transferTo(dest);

            dto.setEmp_img(fileName);
        }

        // 3. 고용 형태가 정직원(1) 또는 프리랜서(4)인 경우 계약만료일은 null 처리
        if (dto.getEmp_type() == 1 || dto.getEmp_type() == 4) {
            dto.setContract_end_date(null);
        }

        int result = service.insertEmployee(dto);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    //  사원 수정
    @PutMapping("/updateEmployee/{emp_no}")
    public ResponseEntity<Integer> updateEmployee(
        @PathVariable int emp_no,
        @RequestPart("employee") Employees dto,
        @RequestPart(value = "image", required = false) MultipartFile imageFile
    ) throws IOException {
        System.out.println("📌 updateEmployee 호출됨");

        // 1. 이미지 처리
        if (imageFile != null && !imageFile.isEmpty()) {
            String fileName = "emp_" + System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
            String fullPath = System.getProperty("user.dir") + "/src/main/resources/static/profileImages/" + fileName;

            File dest = new File(fullPath);
            dest.getParentFile().mkdirs();
            imageFile.transferTo(dest);

            dto.setEmp_img(fileName);
        }

        // 2. 비밀번호 암호화 (입력된 경우만)
        if (dto.getEmp_pwd() != null && !dto.getEmp_pwd().isEmpty()) {
            String encodedPwd = passwordEncoder.encode(CharBuffer.wrap(dto.getEmp_pwd()));
            dto.setEmp_pwd(encodedPwd);
        } else {
            String currentPwd = service.findByEmployee(emp_no).getEmp_pwd();
            dto.setEmp_pwd(currentPwd);
        }

        // 3. 정직원 또는 프리랜서라면 계약만료일 무효화
        if (dto.getEmp_type() == 1 || dto.getEmp_type() == 4) {
            dto.setContract_end_date(null);
        }

        dto.setEmp_no(emp_no);
        return new ResponseEntity<>(service.updateEmployee(emp_no, dto), HttpStatus.OK);
    }

    // 전체 사원 목록 조회
    @GetMapping("/employeeList")
    public ResponseEntity<List<Employees>> findAll() {
        return new ResponseEntity<>(service.employeeList(), HttpStatus.OK);
    }

    // 단일 사원 조회
    @GetMapping("/employee/{emp_no}")
    public ResponseEntity<Employees> findById(@PathVariable int emp_no) {
        return new ResponseEntity<>(service.findByEmployee(emp_no), HttpStatus.OK);
    }

    // 사원 삭제
    @DeleteMapping("/deleteEmployee/{emp_no}")
    public ResponseEntity<String> deleteEmployee(@PathVariable int emp_no) {
        return new ResponseEntity<>(service.deleteEmplyee(emp_no), HttpStatus.OK);
    }

    // 기본급 조회
    @GetMapping("/employee/{emp_no}/baseSalary")
    public ResponseEntity<BigDecimal> BaseSalaryByEmpNo(@PathVariable("emp_no") int empNo) {
        return new ResponseEntity<>(service.BaseSalaryByEmpNo(empNo), HttpStatus.OK);
    }

    // 관리자 권한 변경
    @PutMapping("/{empNo}/adminType")
    public ResponseEntity<Integer> updateAdminType(
        @PathVariable int empNo,
        @RequestParam int adminType
    ) {
        int result = service.updateAdminType(empNo, adminType);
        return ResponseEntity.ok(result);
    }

    // 퇴사 처리
    @PutMapping("/employee/{empNo}/resign")
    public ResponseEntity<?> resignEmployee(@PathVariable int empNo) {
        int result = service.resignEmployee(empNo);
        return result > 0
            ? ResponseEntity.ok().build()
            : ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("퇴사 처리 실패");
    }

    // 인사 대시보드 통계
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Integer>> getEmployeeStats() {
        Map<String, Integer> stats = new HashMap<>();
        stats.put("totalEmployees", service.countAllEmployees());
        stats.put("newThisMonth", service.countNewHiresThisMonth());
        stats.put("resignedThisMonth", service.countResignedThisMonth());
        stats.put("contractsEnding", service.countContractExpiringThisMonth());
        stats.put("birthdaysThisMonth", service.countBirthdaysThisMonth());
        return ResponseEntity.ok(stats);
    }

    // 부서별 인원 수 통계
    @GetMapping("/employees/departmentCount")
    public ResponseEntity<List<Map<String, Object>>> getEmployeeCountByDepartment() {
        return ResponseEntity.ok(service.getEmployeeCountByDepartment());
    }
    
    // 계약직/인턴 사원 목록 
    @GetMapping("/employee/contractList")
    public ResponseEntity<List<Employees>> findContractEmployees() {
        List<Employees> list = service.findContractEmployees();
        return ResponseEntity.ok(list);
    }
    
    // 계약 만료일 연장 (계약직/인턴 대상)
    @PutMapping("/employee/{empNo}/extendContract")
    public ResponseEntity<?> extendContractDate(@PathVariable int empNo, @RequestParam String newDate) {
        try {
            // ✅ 문자열 → java.sql.Date로 변환
            Date parsedDate = Date.valueOf(newDate);

            int result = service.extendContract(empNo, parsedDate);
            return result > 0
                ? ResponseEntity.ok("계약 만료일이 연장되었습니다.")
                : ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("연장 실패");

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("날짜 형식이 잘못되었습니다. (예: 2025-07-01)");
        }
    }

    // 정직원 전환 처리 (emp_type → 1, contract_end_date → NULL)
    @PutMapping("/employee/{empNo}/convertToRegular")
    public ResponseEntity<?> convertToRegular(@PathVariable int empNo) {
        int result = service.convertToRegular(empNo);
        return result > 0
            ? ResponseEntity.ok("정직원으로 전환되었습니다.")
            : ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("전환 실패");
    }
}
