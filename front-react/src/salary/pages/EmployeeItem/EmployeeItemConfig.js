import { Button, Container, Content, Card, Input } from "rsuite";
import Leftbar from "../../../common/pages/Leftbar";
import SalaryLeftbar from "../SalaryLeftbar";
import { useEffect, useState, useCallback } from "react";
import SalaryItemFormModal from "./SalaryItemFormModal";
import { getPositionName, getDeptName } from "../../../hrMgt/components/getEmployeeInfo";
import { request } from "../../../common/components/helpers/axios_helper";
import Header from '../../../common/pages/Header';
import "../../css/EmployeeItemConfig.css"; // ✅ 스타일 파일 import

const EmployeeItemConfig = () => {
  const [employees, setEmployees] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedEmp, setSelectedEmp] = useState(null);

  const today = new Date();
  const defaultMonth = today.toISOString().slice(0, 7);
  const [salaryMonth, setSalaryMonth] = useState(defaultMonth);

  const [salaryItems, setSalaryItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState();
  const [editItem, setEditItem] = useState(null);

  const fetchEmployees = useCallback(() => {
    request("get", "/api/employeeList")
      .then((res) => setEmployees(res.data))
      .catch((err) => {
        console.error("사원 목록 조회 실패:", err);
        alert("사원 목록을 불러오지 못했습니다.");
      });
  }, []);

  const fetchSalaryItems = useCallback(() => {
    if (!selectedEmp) return;

    request("get", `/api/salaryItem?emp_no=${selectedEmp.emp_no}&salary_month=${salaryMonth}`)
      .then((res) => setSalaryItems(res.data))
      .catch((err) => {
        console.error("급여 항목 조회 실패:", err);
        alert("급여 항목을 불러오지 못했습니다.");
      });
  }, [selectedEmp, salaryMonth]);

  const handleDelete = (id) => {
    if (window.confirm("삭제 하시겠습니까?")) {
      request("delete", `/api/salaryItem/${id}`)
        .then(() => fetchSalaryItems())
        .catch((err) => {
          console.error("삭제 실패:", err);
          alert("삭제에 실패했습니다.");
        });
    }
  };

  const handleCalculateSalary = () => {
    if (!selectedEmp) return;

    request("post", `/api/salary/calculate?emp_no=${selectedEmp.emp_no}&salary_month=${salaryMonth}`)
      .then(() => {
        alert("급여 계산 완료");
        fetchSalaryItems();
      })
      .catch((err) => {
        console.error("급여 계산 실패:", err);
        alert("급여 계산에 실패했습니다.");
      });
  };

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    fetchSalaryItems();
  }, [fetchSalaryItems]);

  const handleAdd = (type) => {
    setModalType(type);
    setEditItem(null);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setModalType(item.item_type);
    setShowModal(true);
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.emp_name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <Container style={{ minHeight: "100vh", width: "100%" }}>
      <Leftbar />
      <Container>
        <SalaryLeftbar />
        <Content>
          <Header />
          <Card
            style={{
              borderRadius: "15px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              padding: 20,
            }}
          >
            <h3 style={{ marginBottom: 20 }}>사원별 수당/공제 설정</h3>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
              <Input
                placeholder="사원 이름 검색"
                value={searchKeyword}
                onChange={setSearchKeyword}
                style={{ width: 200, marginRight: 320 }}
              />
              <label style={{ marginRight: 10 }}>급여 월:</label>
              <input
                type="month"
                value={salaryMonth}
                onChange={(e) => setSalaryMonth(e.target.value)}
                style={{ height: 34, marginRight: 20 }}
              />
              <Button appearance="primary" onClick={() => handleAdd("ALLOWANCE")} style={{ marginRight: 10 }}>
                수당 추가
              </Button>
              <Button appearance="primary" onClick={() => handleAdd("DEDUCTION")}>
                공제 추가
              </Button>
              <Button appearance="primary" color="green" onClick={handleCalculateSalary} style={{ marginLeft: 10 }}>
                급여 계산
              </Button>
            </div>

            <div style={{ display: "flex", gap: 20 }}>
              <Card style={{ flex: 1, padding: 15 }}>
                <table className="employee-item-config-table">
                  <thead>
                    <tr>
                      <th>사원명</th>
                      <th>부서</th>
                      <th>직급</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map((emp) => (
                      <tr
                        key={emp.emp_no}
                        className={selectedEmp?.emp_no === emp.emp_no ? "selected-row" : ""}
                        onClick={() => setSelectedEmp(emp)}
                      >
                        <td>{emp.emp_name}</td>
                        <td>{getDeptName(emp.dept_no)}</td>
                        <td>{getPositionName(emp.position_id)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>

              <Card style={{ flex: 2, padding: 15 }}>
                {selectedEmp ? (
                  <>
                    <h5>
                      선택된 사원: {selectedEmp.emp_name} ({salaryMonth})
                    </h5>

                    <table className="employee-item-config-table">
                      <thead>
                        <tr>
                          <th>구분</th>
                          <th>항목명</th>
                          <th>금액</th>
                          <th>관리</th>
                        </tr>
                      </thead>
                      <tbody>
                        {salaryItems.map((row, idx) => (
                          <tr key={idx}>
                            <td>{row.item_type === "ALLOWANCE" ? "수당" : "공제"}</td>
                            <td>{row.item_name}</td>
                            <td>{row.amount.toLocaleString()} 원</td>
                            <td>
                              <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                                <Button size="xs" onClick={() => handleEdit(row)}>수정</Button>
                                <Button size="xs" color="red" appearance="ghost" onClick={() => handleDelete(row.id)}>
                                  삭제
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                ) : (
                  <p>사원을 선택해주세요.</p>
                )}
              </Card>
            </div>

            {showModal && selectedEmp && (
              <SalaryItemFormModal
                open={showModal}
                onClose={() => setShowModal(false)}
                type={modalType}
                empNo={selectedEmp.emp_no}
                salaryMonth={salaryMonth}
                item={editItem}
                onSuccess={fetchSalaryItems}
              />
            )}
          </Card>
        </Content>
      </Container>
    </Container>
  );
};

export default EmployeeItemConfig;
