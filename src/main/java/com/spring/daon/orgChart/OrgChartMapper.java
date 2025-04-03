package com.spring.daon.orgChart;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

@Mapper
@Repository
public interface OrgChartMapper {

	List<Department> getOrganization();
}
