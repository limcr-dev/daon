package com.spring.daon.orgChart;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



@CrossOrigin
@RestController
@RequestMapping("/api/organization")
public class OrgChartController {

	@Autowired
    private OrgChartServiceImpl service;

    // 조직도 조회 (부서 + 직원 포함)
    @GetMapping
    public List<Department> getOrganization() {
        List<Department> organization = service.getOrganization();
        
        // 로그 출력해서 데이터 확인 (서버 콘솔에서 확인 가능)
        System.out.println("조직도 데이터: " + organization);
        
        return organization;
    }
}

