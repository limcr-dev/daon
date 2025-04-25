package com.spring.daon.hrMgt.Role;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DepartmentServiceImpl {

    @Autowired
    private DepartmentMapper departmentMapper;

    public List<Department> getAllDepartments() {
        return departmentMapper.findAllDepartments();
    }

    public int insertDepartment(Department dept) {
        return departmentMapper.insertDepartment(dept);
    }

    public int updateDepartment(Department dept) {
        return departmentMapper.updateDepartment(dept);
    }

    public int deleteDepartment(int deptNo) {
        return departmentMapper.deleteDepartment(deptNo);
    }
}