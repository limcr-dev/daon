import { Button, Container, Content, Divider, Header, Card, Input } from "rsuite";
import Leftbar from "../../../common/pages/Leftbar";
import EmployeeItemLeftbar from "./EmployeeItemLeftbar";
import { useEffect, useState } from "react";
import SalaryItemFormModal  from "./SalaryItemFormModal";
import { getPositionName, getDeptName } from "../../../hrMgt/components/getEmployeeInfo.js";

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

  // 사원 목록
  const fetchEmployees = () => {
    fetch("http://localhost:8081/api/employeeList")
      .then((res) => res.json())
      .then((data) => setEmployees(data));
  };

  // 사원 급여 항목
  const fetchSalaryItems = () => {
    if (!selectedEmp) return;
    fetch(
      `http://localhost:8081/api/salaryItem?emp_no=${selectedEmp.emp_no}&salary_month=${salaryMonth}`
    )
      .then((res) => res.json())
      .then((data) => setSalaryItems(data));
  };

  // 사원 급여 삭제
  const handleDelete = (id) => {
    if (window.confirm("삭제 하시겠습니까?")) {
      fetch(`http://localhost:8081/api/salaryItem/${id}`, {
        method: "DELETE",
      }).then((res) => {
        if (res.ok) fetchSalaryItems();
        else alert("삭제 실패");
      });
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleCalculateSalary = () => {
    fetch(`http://localhost:8081/api/salary/calculate?emp_no=${selectedEmp.emp_no}&salary_month=${salaryMonth}`, {
      method: "POST",
    })
      .then((res) => {
        if (res.ok) {
          alert("급여 계산 완료");
          fetchSalaryItems();
        } else {
          alert("계산 실패");
        }
      });
  };

  useEffect(() => {
    fetchSalaryItems();
  }, [selectedEmp, salaryMonth]);

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
        <EmployeeItemLeftbar />
        <Content>
          <Header />
          <Divider />
          <Card
            style={{
              borderRadius: "15px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              padding: 20,
            }}
          >
            <h3 style={{ marginBottom: 20 }}>사원별 수당/공제 설정</h3>
            
            {/* 검색 & 월 선택 */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
            <Input
                placeholder="사원 이름 검색"
                value={searchKeyword}
                onChange={setSearchKeyword}
                style={{ width: 200, marginRight: 320}}
            />
            <label style={{ marginRight: 10 }}>급여 월:</label>
            <input
                type="month"
                value={salaryMonth}
                onChange={(e) => setSalaryMonth(e.target.value)}
                style={{ height: 34, marginRight: 20 }} // input 높이 Input에 맞추기 (선택)
            />
            <Button
                appearance="primary"
                onClick={() => handleAdd("ALLOWANCE")}
                style={{ marginRight: 10 }}
                >
                수당 추가
            </Button>
            <Button
                appearance="primary"
                onClick={() => handleAdd("DEDUCTION")}
                >
                공제 추가
            </Button>
            <Button
                appearance="primary"
                color="green"
                onClick={handleCalculateSalary}
                style={{ marginLeft: 10 }}
                >
                급여 계산
            </Button>
            </div>
        
            <div style={{ display: "flex", gap: 20 }}>
              {/* 사원 목록 */}
              <Card style={{ flex: 1, padding: 15 }}>
                <h5>사원 목록</h5>
                <table className="board-table" style={{ width: "100%" }}>
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
                        style={{
                          cursor: "pointer",
                          backgroundColor:
                            selectedEmp?.emp_no === emp.emp_no ? "#f0f8ff" : "",
                        }}
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
                    
                    
              {/* 수당/공제 항목 */}
              <Card style={{ flex: 2, padding: 15 }}>
                {selectedEmp ? (
                  <>
                    <h5>
                      선택된 사원: {selectedEmp.emp_name} ({salaryMonth})
                    </h5>
                    

                    <table className="board-table" style={{ width: "100%" }}>
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
                              <Button
                                size="xs"
                                onClick={() => handleEdit(row)}
                                style={{ marginRight: 6 }}
                              >
                                수정
                              </Button>
                              <Button
                                size="xs"
                                color="red"
                                appearance="ghost"
                                onClick={() => handleDelete(row.id)}
                              >
                                삭제
                              </Button>
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

            {/* 등록/수정 모달 */}
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
