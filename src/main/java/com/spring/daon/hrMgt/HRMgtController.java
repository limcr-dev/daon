package com.spring.daon.hrMgt;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.CharBuffer;
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

    @PostMapping("/insertEmployee")
    public ResponseEntity<Integer> insertEmployee(
        @RequestPart("employee") Employees dto,
        @RequestPart(value = "image", required = false) MultipartFile imageFile
    ) throws IOException {
        System.out.println("📌 insertEmployee 호출됨");

        // ✅ 1. 생년월일을 비밀번호로 자동 설정 (yyyyMMdd 형식)
        String rawPassword = dto.getEmp_birthday().toString().replace("-", ""); // 예: "19900520"
        String encodedPassword = passwordEncoder.encode(CharBuffer.wrap(rawPassword));
        dto.setEmp_pwd(encodedPassword); // 🔐 암호화된 비밀번호 저장

        // ✅ 2. 이미지 파일 저장 처리
        if (imageFile != null && !imageFile.isEmpty()) {
            String fileName = "emp_" + System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
            String fullPath = System.getProperty("user.dir") + "/src/main/resources/static/profileImages/" + fileName;

            File dest = new File(fullPath);
            dest.getParentFile().mkdirs();
            imageFile.transferTo(dest);

            dto.setEmp_img(fileName); // DB에는 파일명만 저장
        }

        // ✅ 3. 사원 등록
        int result = service.insertEmployee(dto);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    // 👇 아래 기존 코드들은 그대로 유지
    @PutMapping("/updateEmployee/{emp_no}")
    public ResponseEntity<Integer> updateEmployee(
        @PathVariable int emp_no,
        @RequestPart("employee") Employees dto,
        @RequestPart(value = "image", required = false) MultipartFile imageFile
    ) throws IOException {
        System.out.println("📌 updateEmployee 호출됨");

        // ✅ 1. 이미지 업로드 처리
        if (imageFile != null && !imageFile.isEmpty()) {
            String fileName = "emp_" + System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
            String fullPath = System.getProperty("user.dir") + "/src/main/resources/static/profileImages/" + fileName;

            File dest = new File(fullPath);
            dest.getParentFile().mkdirs();
            imageFile.transferTo(dest);

            dto.setEmp_img(fileName);
        }

        // ✅ 2. 비밀번호 수정 여부 확인 → 조건부 암호화
        if (dto.getEmp_pwd() != null && !dto.getEmp_pwd().isEmpty()) {
            // 새로운 비밀번호가 입력되었을 때만 암호화
            String encodedPwd = passwordEncoder.encode(CharBuffer.wrap(dto.getEmp_pwd()));
            dto.setEmp_pwd(encodedPwd);
        } else {
            // 입력된 비밀번호가 없으면 기존 비밀번호 유지
            String currentPwd = service.findByEmployee(emp_no).getEmp_pwd();
            dto.setEmp_pwd(currentPwd);
        }

        // ✅ 3. 사원번호 설정 및 업데이트 처리
        dto.setEmp_no(emp_no);
        return new ResponseEntity<>(service.updateEmployee(emp_no, dto), HttpStatus.OK);
    }

    @GetMapping("/employeeList")
    public ResponseEntity<List<Employees>> findAll() {
        return new ResponseEntity<>(service.employeeList(), HttpStatus.OK);
    }

    @GetMapping("/employee/{emp_no}")
    public ResponseEntity<Employees> findById(@PathVariable int emp_no) {
        return new ResponseEntity<>(service.findByEmployee(emp_no), HttpStatus.OK);
    }

    @DeleteMapping("/deleteEmployee/{emp_no}")
    public ResponseEntity<String> deleteEmployee(@PathVariable int emp_no) {
        return new ResponseEntity<>(service.deleteEmplyee(emp_no), HttpStatus.OK);
    }

    @GetMapping("/employee/{emp_no}/baseSalary")
    public ResponseEntity<BigDecimal> BaseSalaryByEmpNo(@PathVariable("emp_no") int empNo) {
        return new ResponseEntity<>(service.BaseSalaryByEmpNo(empNo), HttpStatus.OK);
    }
    
    // 권한(admin_type) 변경 API
    @PutMapping("/{empNo}/adminType")
    public ResponseEntity<Integer> updateAdminType(
        @PathVariable int empNo,
        @RequestParam int adminType
    ) {
        int result = service.updateAdminType(empNo, adminType);
        return ResponseEntity.ok(result);
    }
    
    // 사원 퇴사 처리 API
    @PutMapping("/employee/{empNo}/resign")
    public ResponseEntity<?> resignEmployee(@PathVariable int empNo) {
        // 서비스 호출하여 emp_status = 3 (퇴사), leave_date = NOW() 처리
        int result = service.resignEmployee(empNo);

        // 결과 반환 (성공: 200 OK, 실패: 500)
        return result > 0
            ? ResponseEntity.ok().build()
            : ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("퇴사 처리 실패");
    }
    
    //  인사관리 대시보드 통계 API
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
    
    @GetMapping("/employees/departmentCount")
    public ResponseEntity<List<Map<String, Object>>> getEmployeeCountByDepartment() {
        return ResponseEntity.ok(service.getEmployeeCountByDepartment());
    }
    

}
