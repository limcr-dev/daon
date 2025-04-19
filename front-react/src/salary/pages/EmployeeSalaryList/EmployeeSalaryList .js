import React, { useEffect, useState } from "react";
import { Container, Content, Divider, Header, Card} from "rsuite";
import Leftbar from "../../../common/pages/Leftbar";
import EmployeeSalaryListLeftbar from "./EmployeeSalaryListLeftbar";
import SalaryDetailModal from "./SalaryDetailModal";
import { getPositionName, getDeptName, getEmpStatus } from "../../../hrMgt/components/getEmployeeInfo.js"


const EmployeeSalaryList  = () => {
    const today = new Date();
    const defaultMonth = today.toISOString().slice(0, 7);
    const [salaryMonth, setSalaryMonth] = useState(defaultMonth);
    const [salaryList, setSalaryList] = useState([]);

    // ✅ 모달 관련 상태
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedEmpNo, setSelectedEmpNo] = useState(null);

    const fetchSalaryList = () => {
        fetch(`http://localhost:8081/api/salaries/summary?salaryMonth=${salaryMonth}`)
        .then(res => res.json())
        .then(data => setSalaryList(data));
    };

    useEffect(() => {
        fetchSalaryList();
    }, [salaryMonth]);

    // ✅ 상세 모달 열기
    const openDetail = (emp_no) => {
        setSelectedEmpNo(emp_no);
        setDetailModalOpen(true);
    };
    return(
     <Container style={{ minHeight: '100vh', width: '100%' }}>
        <Leftbar/>
        <Container>
            <EmployeeSalaryListLeftbar/>
            <Content>
            <Header />
            <Divider />
            <div style={{ padding: 20 }}>
            <h3>급여 요약 목록</h3>

            <div style={{ marginBottom: 16 }}>
                <label style={{ marginRight: 10 }}>급여 월:</label>
                <input
                type="month"
                value={salaryMonth}
                onChange={(e) => setSalaryMonth(e.target.value)}
                />
            </div>

            <Card style={{ borderRadius: '15px', padding: 20, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <h4 style={{ marginBottom: 15 }}>급여 목록</h4>

                <table className="board-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                    <tr>
                        <th>사번</th>
                        <th>이름</th>
                        <th>부서</th>
                        <th>직급</th>
                        <th>재직 상태</th>
                        <th>입사일</th>
                        <th style={{ textAlign: 'right' }}>기본급</th>
                        <th style={{ textAlign: 'right' }}>총 수당</th>
                        <th style={{ textAlign: 'right' }}>총 공제</th>
                        <th style={{ textAlign: 'right' }}>실수령액</th>
                    </tr>
                    </thead>
                    <tbody>
                    {salaryList.map((row, idx) => (
                        <tr
                        key={idx}
                        onClick={() => openDetail(row.emp_no)}
                        style={{ cursor: 'pointer' }}
                        >
                        <td>{row.emp_no}</td>
                        <td>{row.emp_name}</td>
                        <td>{getDeptName(row.dept_no)}</td>
                        <td>{getPositionName(row.position_id)}</td>
                        <td>{getEmpStatus(row.emp_status)}</td>
                        <td>{row.hire_date}</td>
                        <td style={{ textAlign: 'right' }}>{row.base_pay?.toLocaleString()}</td>
                        <td style={{ textAlign: 'right' }}>{row.total_allowance?.toLocaleString()}</td>
                        <td style={{ textAlign: 'right' }}>{row.total_deduction?.toLocaleString()}</td>
                        <td style={{ textAlign: 'right' }}>{row.actual_pay?.toLocaleString()}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </Card>

                {/* 상세 모달 */}
                <SalaryDetailModal
                    open={detailModalOpen}
                    onClose={() => setDetailModalOpen(false)}
                    empNo={selectedEmpNo}
                    salaryMonth={salaryMonth}
                />
            </div>


            </Content>
        </Container>
     </Container> 
    )
};
export default EmployeeSalaryList ;