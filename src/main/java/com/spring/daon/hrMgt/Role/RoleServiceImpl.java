package com.spring.daon.hrMgt.Role;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoleServiceImpl {

    @Autowired
    private RoleMapper roleMapper;

    public List<Role> findByDeptNo(int deptNo) {
        return roleMapper.findByDeptNo(deptNo);
    }

    public int insertRole(Role dto) {
        return roleMapper.insertRole(dto);
    }

    public int updateRole(Role dto) {
        return roleMapper.updateRole(dto);
    }

    public int deleteRole(int roleId) {
        return roleMapper.deleteRole(roleId);
    }
}