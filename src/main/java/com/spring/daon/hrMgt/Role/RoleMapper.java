package com.spring.daon.hrMgt.Role;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface RoleMapper {
    List<Role> findByDeptNo(int deptNo);       // 부서별 직책 조회
    int insertRole(Role role);                 // 직책 등록
    int updateRole(Role role);                 // 직책 수정
    int deleteRole(int roleId);                   // 직책 삭제
}
