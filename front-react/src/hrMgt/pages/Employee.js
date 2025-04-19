import React, { useEffect, useState } from "react";
import { Container, Content, Header, Button, Input } from "rsuite"; // Input 추가
import { useNavigate } from "react-router-dom";

import Registration from "./Registration";
import { getPositionName, getRoleName, getDeptName, getEmpType } from "../components/getEmployeeInfo.js";

import "../css/EmployeeList.css";
import Leftbar from "../../common/pages/Leftbar.js";

const Employee = () => {
    const [employeelist, setEmployeelist] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState(""); // 🔍 검색어 상태
    const [registrationModal, setRegistrationModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:8081/api/employeeList", {
            method: "GET",
        })
            .then((res) => res.json())
            .then((res) => {
                console.log("Employee List:", res);
                setEmployeelist(res);
            });
    }, []);

    const openRegistrationModal = () => setRegistrationModal(true);
    const closeRegistrationModal = () => setRegistrationModal(false);

    const openDetailPage = (emp_no) => {
        navigate("/employee/" + emp_no);
    };

    // 🔍 검색 필터링
    const filteredList = employeelist.filter((a) =>
        a.emp_name.includes(searchKeyword)
    );

    return (
        <Container style={{ display: "flex", minHeight: "100vh" }}>
            <Leftbar />
            <Container>
                <Header>사원정보관리</Header>
                <Content>
                    {/* 🔍 검색창 */}
                    <div style={{ marginBottom: "1rem" }}>
                        <Input
                            placeholder="이름으로 검색"
                            value={searchKeyword}
                            onChange={setSearchKeyword}
                            style={{ width: 300 }}
                        />
                    </div>

                    <div className="employee-list">
                        <table className="employee-table">
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
                                    <tr key={a.emp_no} onClick={() => openDetailPage(a.emp_no)}>
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
                    </div>
                    <Button onClick={openRegistrationModal}>등록</Button>
                </Content>

                <Registration open={registrationModal} onClose={closeRegistrationModal} />
            </Container>
        </Container>
    );
};

export default Employee;
