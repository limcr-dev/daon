package com.spring.daon.orgChart;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrgChartServiceImpl {

	@Autowired
    private OrgChartMapper Mapper;

    // 전체 조직도 조회 (부서 + 직원 포함)
    @Transactional(readOnly = true)
    public List<Department> getOrganization() {
        return Mapper.getOrganization();
    }
}
