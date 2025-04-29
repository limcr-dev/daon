package com.spring.daon.hrMgt.Role;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/departments")
@CrossOrigin
public class DepartmentController {

    @Autowired
    private DepartmentServiceImpl departmentService;

    // 부서 전체 조회
    @GetMapping
    public ResponseEntity<List<Department>> getAllDepartments() {
        return ResponseEntity.ok(departmentService.getAllDepartments());
    }

    // 부서 등록
    @PostMapping
    public ResponseEntity<Integer> insertDepartment(@RequestBody Department dept) {
        return ResponseEntity.ok(departmentService.insertDepartment(dept));
    }

    // 부서 수정
    @PutMapping
    public ResponseEntity<Integer> updateDepartment(@RequestBody Department dept) {
        return ResponseEntity.ok(departmentService.updateDepartment(dept));
    }

    // 부서 삭제
    @DeleteMapping("/{deptNo}")
    public ResponseEntity<Integer> deleteDepartment(@PathVariable int deptNo) {
        return ResponseEntity.ok(departmentService.deleteDepartment(deptNo));
    }
}