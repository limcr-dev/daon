package com.spring.daon.hrMgt.Role;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface DepartmentMapper {

	@Select("SELECT * FROM departments ORDER BY dept_no")
    List<Department> findAllDepartments();

    @Insert("INSERT INTO departments (dept_no, dept_name, dept_parent) VALUES (#{dept_no}, #{dept_name}, #{dept_parent})")
    int insertDepartment(Department dept);

    @Update("UPDATE departments SET dept_name = #{dept_name}, dept_parent = #{dept_parent} WHERE dept_no = #{dept_no}")
    int updateDepartment(Department dept);

    @Delete("DELETE FROM departments WHERE dept_no = #{dept_no}")
    int deleteDepartment(@Param("dept_no") int deptNo);
}
