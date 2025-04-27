import React, { useEffect, useState, useCallback } from "react";
import { Container, Content, Card, Input, IconButton, Notification, toaster } from "rsuite";
import { useNavigate } from "react-router-dom";
import PlusIcon from "@rsuite/icons/Plus";
import TrashIcon from "@rsuite/icons/Trash";

import Header from '../../common/pages/Header';
import Registration from "./Registration.js";
import { getPositionName, getRoleName, getDeptName, getEmpType } from "../components/getEmployeeInfo.js";
import Leftbar from "../../common/pages/Leftbar.js";
import EmployeeLeftbar from "./EmployeeLeftbar.js";
import { request } from "../../common/components/helpers/axios_helper";
import Paging from "../../common/components/paging.js"; // ✅ Paging 컴포넌트 import

import "../css/EmployeeList.css";

const EmployeeList = () => {
  const [employeelist, setEmployeelist] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [registrationModal, setRegistrationModal] = useState(false);
  const [page, setPage] = useState(1); // ✅ 현재 페이지
  const size = 10; // ✅ 한 페이지당 보여줄 개수

  const navigate = useNavigate();

  // ✅ 사원 목록 불러오기
  const fetchEmployeeList = useCallback(() => {
    request("get", "/api/employeeList")
      .then((res) => setEmployeelist(res.data))
      .catch((err) => {
        console.error("사원 목록 조회 실패:", err);
        toaster.push(
          <Notification type="error" header="조회 실패" closable>
            사원 목록을 불러오지 못했습니다.
          </Notification>,
          { placement: "topEnd" }
        );
      });
  }, []);

  useEffect(() => {
    fetchEmployeeList();
  }, [fetchEmployeeList]);

  // ✅ 사원 등록 모달 열기/닫기
  const openRegistrationModal = () => setRegistrationModal(true);
  const closeRegistrationModal = () => setRegistrationModal(false);

  // ✅ 사원 상세페이지로 이동
  const openDetailPage = (emp_no) => {
    navigate("/employee/" + emp_no);
  };

  // ✅ 검색어 변경 핸들러
  const handleSearchChange = (value) => {
    setSearchKeyword(value);
    setPage(1); // 검색어 바뀌면 1페이지로 돌아감
  };

  // ✅ 사원 삭제
  const deleteEmployee = (emp_no) => {
    if (window.confirm("정말 이 사원을 삭제하시겠습니까?")) {
      request("delete", `/api/deleteEmployee/${emp_no}`)
        .then(() => {
          toaster.push(
            <Notification type="success" header="삭제 완료" closable>
              사원이 성공적으로 삭제되었습니다.
            </Notification>,
            { placement: "topEnd" }
          );
          fetchEmployeeList(); // 삭제 후 목록 다시 불러오기
        })
        .catch((err) => {
          console.error("사원 삭제 실패:", err);
          toaster.push(
            <Notification type="error" header="삭제 실패" closable>
              사원 삭제에 실패했습니다.
            </Notification>,
            { placement: "topEnd" }
          );
        });
    }
  };

  // ✅ 필터링된 사원 목록
  const filteredList = employeelist.filter((a) =>
    a.emp_name.includes(searchKeyword)
  );

  // ✅ 현재 페이지에 맞는 데이터
  const startIndex = (page - 1) * size;
  const endIndex = startIndex + size;
  const paginatedList = filteredList.slice(startIndex, endIndex);

  return (
    <Container style={{ display: "flex", minHeight: "100vh" }}>
      <Leftbar />
      <Container>
        <EmployeeLeftbar />
        <Content>
          <Header />
          <div style={{ marginTop: "50px" }}>
            <Card
              style={{
                borderRadius: "15px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                padding: "20px",
                marginBottom: "30px",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "bold" }}>👥 사원 목록</h3>

              {/* 🔍 검색창 + 등록 버튼 */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <Input
                  placeholder="이름으로 검색"
                  value={searchKeyword}
                  onChange={handleSearchChange}
                  style={{ width: 250 }}
                />
                <IconButton
                  icon={<PlusIcon />}
                  appearance="primary"
                  size="sm"
                  onClick={openRegistrationModal}
                >
                  사원 등록
                </IconButton>
              </div>

              {/* 📋 사원 목록 테이블 */}
              <table className="employee-list">
                <thead>
                  <tr>
                    <th>사원번호</th>
                    <th>직급</th>
                    <th>이름</th>
                    <th>부서</th>
                    <th>직책</th>
                    <th>직원구분</th>
                    <th>삭제</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedList.map((a) => (
                    <tr key={a.emp_no} style={{ cursor: "pointer" }}>
                      <td onClick={() => openDetailPage(a.emp_no)}>{a.emp_no}</td>
                      <td onClick={() => openDetailPage(a.emp_no)}>{getPositionName(a.position_id)}</td>
                      <td onClick={() => openDetailPage(a.emp_no)}>{a.emp_name}</td>
                      <td onClick={() => openDetailPage(a.emp_no)}>{getDeptName(a.dept_no)}</td>
                      <td onClick={() => openDetailPage(a.emp_no)}>{getRoleName(a.role_id)}</td>
                      <td onClick={() => openDetailPage(a.emp_no)}>{getEmpType(a.emp_type)}</td>
                      <td>
                        <IconButton
                          icon={<TrashIcon />}
                          size="xs"
                          appearance="subtle"
                          color="red"
                          onClick={(e) => {
                            e.stopPropagation(); // 상세보기 방지
                            deleteEmployee(a.emp_no);
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* 📄 페이징 */}
              <div style={{ marginTop: 20, display: "flex", justifyContent: "center" }}>
                <Paging
                  paging={{
                    page: page,
                    size: size,
                    totalCount: filteredList.length
                  }}
                  onPageChange={(newPage) => setPage(newPage)}
                />
              </div>
            </Card>
          </div>
        </Content>

        {/* 📄 사원 등록 모달 */}
        <Registration open={registrationModal} onClose={closeRegistrationModal} />

      </Container>
    </Container>
  );
};

export default EmployeeList;
