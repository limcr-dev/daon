import React, { useEffect, useState, useCallback } from "react";
import { Container, Content, Button, Input, Card } from "rsuite";
import { useNavigate } from "react-router-dom";
import Header from '../../common/pages/Header';
import Registration from "./Registration.js";
import { getPositionName, getRoleName, getDeptName, getEmpType } from "../components/getEmployeeInfo.js";

import "../css/EmployeeList.css";
import Leftbar from "../../common/pages/Leftbar.js";
import EmployeeLeftbar from "./EmployeeLeftbar.js";
import { request } from "../../common/components/helpers/axios_helper"; // ✅ axios 헬퍼 import

const EmployeeList = () => {
  const [employeelist, setEmployeelist] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [registrationModal, setRegistrationModal] = useState(false);
  const navigate = useNavigate();

  // 사원 목록 불러오기 (request 사용 + useCallback으로 감싸기)
  const fetchEmployeeList = useCallback(() => {
    request("get", "/api/employeeList")
      .then((res) => setEmployeelist(res.data))
      .catch((err) => {
        console.error("사원 목록 조회 실패:", err);
        alert("사원 목록을 불러오지 못했습니다.");
      });
  }, []);

  useEffect(() => {
    fetchEmployeeList();
  }, [fetchEmployeeList]); // useCallback 의존성 등록

  const openRegistrationModal = () => setRegistrationModal(true);
  const closeRegistrationModal = () => setRegistrationModal(false);

  const openDetailPage = (emp_no) => {
    navigate("/employee/" + emp_no);
  };

  const filteredList = employeelist.filter((a) =>
    a.emp_name.includes(searchKeyword)
  );

  return (
    <Container style={{ display: "flex", minHeight: "100vh" }}>
      <Leftbar />
      <Container>
        <EmployeeLeftbar />
        <Content>
          <Header/>

          <Card
            style={{
              borderRadius: "15px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              padding: "20px",
              marginBottom: "30px",
            }}
          >
            <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "bold" }}>👥 사원 목록</h3>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <Input
                placeholder="이름으로 검색"
                value={searchKeyword}
                onChange={setSearchKeyword}
                style={{ width: 250 }}
              />
              <Button appearance="primary" onClick={openRegistrationModal}>
                + 사원 등록
              </Button>
            </div>

            <table className="employee-list">
              <thead>
                <tr>
                  <th>사원번호</th>
                  <th>직급</th>
                  <th>이름</th>
                  <th>부서</th>
                  <th>직책</th>
                  <th>직원구분</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((a) => (
                  <tr key={a.emp_no} onClick={() => openDetailPage(a.emp_no)} style={{ cursor: "pointer" }}>
                    <td>{a.emp_no}</td>
                    <td>{getPositionName(a.position_id)}</td>
                    <td>{a.emp_name}</td>
                    <td>{getDeptName(a.dept_no)}</td>
                    <td>{getRoleName(a.role_id)}</td>
                    <td>{getEmpType(a.emp_type)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </Content>

        <Registration open={registrationModal} onClose={closeRegistrationModal} />
      </Container>
    </Container>
  );
};

export default EmployeeList;
