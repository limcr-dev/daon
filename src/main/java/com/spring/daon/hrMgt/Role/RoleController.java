package com.spring.daon.hrMgt.Role;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/roles")
@CrossOrigin
public class RoleController {

    @Autowired
    private RoleServiceImpl roleService;

    // 부서별 직책 조회
    @GetMapping
    public List<Role> findByDept(@RequestParam int deptNo) {
        return roleService.findByDeptNo(deptNo);
    }

    // 직책 등록
    @PostMapping
    public int insert(@RequestBody Role dto) {
        return roleService.insertRole(dto);
    }

    // 직책 수정
    @PutMapping
    public int update(@RequestBody Role dto) {
        return roleService.updateRole(dto);
    }

    // 직책 삭제
    @DeleteMapping("/{roleId}")
    public int delete(@PathVariable int roleId) {
        return roleService.deleteRole(roleId);
    }
}