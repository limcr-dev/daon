import React, { useEffect, useState } from "react";
import { Container, Content, Card, Input, Button } from "rsuite";
import Leftbar from "../../../common/pages/Leftbar";
import SalaryLeftbar from "../SalaryLeftbar";
import Header from '../../../common/pages/Header';
import "../../css/SalarySchedule.css";
import { request } from "../../../common/components/helpers/axios_helper"; // ✅ 요청 헬퍼 사용

const SalarySchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [newMonth, setNewMonth] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingPayday, setEditingPayday] = useState("");
  const [showClosedOnly, setShowClosedOnly] = useState(false);
  const [showCalculatedOnly, setShowCalculatedOnly] = useState(false);
  const [searchMonth, setSearchMonth] = useState("");

  // ✅ 급여 대장 목록 조회
  const fetchSchedules = () => {
    request("get", "/api/schedule")
      .then((res) => setSchedules(res.data))
      .catch((err) => {
        console.error("급여 대장 조회 실패:", err);
        alert("급여 대장을 불러오지 못했습니다.");
      });
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  // ✅ 대장 생성
  const handleCreate = () => {
    if (!newMonth) return alert("📅 급여 월을 선택해주세요.");

    request("get", `/api/schedule/${newMonth}`)
      .then(() => {
        alert("⚠️ 이미 해당 월의 급여 대장이 존재합니다.");
      })
      .catch(() => {
        request("post", "/api/schedule", {
          salary_month: newMonth,
          is_closed: false
        })
          .then(() => {
            alert("✅ 급여 대장이 생성되었습니다.");
            fetchSchedules();
          })
          .catch(() => alert("❌ 생성 실패"));
      });
  };

  // ✅ 전체 급여 계산
  const handleCalculateAll = () => {
    if (!newMonth) return alert("📅 먼저 급여 월을 선택해주세요.");

    request("post", `/api/salary/calculate-all?salary_month=${newMonth}`)
      .then(() => {
        alert("💰 전체 급여 계산 완료!");
        fetchSchedules();
      })
      .catch(() => alert("❌ 서버 오류로 계산에 실패했습니다."));
  };

  // ✅ 마감 처리
  const handleClose = (id, isCalculated) => {
    if (!isCalculated) return alert("⚠️ 전체 급여 계산 후 마감할 수 있습니다.");
    if (window.confirm("정말 마감 처리하시겠습니까?")) {
      request("put", `/api/schedule/close/${id}`)
        .then(() => {
          alert("🔒 마감 처리되었습니다.");
          fetchSchedules();
        })
        .catch(() => alert("❌ 마감 실패"));
    }
  };

  // ✅ 지급일 수정 시작
  const startEdit = (row) => {
    setEditingId(row.id);
    setEditingPayday(row.payday?.substring(0, 10) || "");
  };

  // ✅ 지급일 저장
  const saveEdit = () => {
    request("put", `/api/schedule/${editingId}`, {
      payday: editingPayday
    })
      .then(() => {
        alert("✅ 지급일이 수정되었습니다.");
        setEditingId(null);
        setEditingPayday("");
        fetchSchedules();
      })
      .catch(() => alert("❌ 수정 실패 (마감된 대장은 수정 불가)"));
  };

  // ✅ 대장 삭제
  const handleDelete = (id, isClosed) => {
    if (isClosed) return alert("❌ 마감된 급여 대장은 삭제할 수 없습니다.");
    if (window.confirm("정말 삭제하시겠습니까?")) {
      request("delete", `/api/schedule/${id}`)
        .then(() => {
          alert("🗑️ 삭제 완료되었습니다.");
          fetchSchedules();
        })
        .catch(() => alert("❌ 삭제 실패"));
    }
  };

  // ✅ 정렬 및 필터링
  const sortedSchedules = [...schedules].sort((a, b) => b.salary_month.localeCompare(a.salary_month));
  const filteredSchedules = sortedSchedules.filter((row) => {
    if (showClosedOnly && !row.is_closed) return false;
    if (showCalculatedOnly && !row.is_calculated) return false;
    if (searchMonth && row.salary_month !== searchMonth) return false;
    return true;
  });

  return (
    <Container style={{ minHeight: "100vh", width: "100%" }}>
      <Leftbar />
      <Container>
        <SalaryLeftbar />
        <Content>
          <Header />
          <Card style={{ borderRadius: 15, padding: 20 }}>
            <h3 style={{ marginBottom: 20 }}>급여 대장 관리</h3>

            {/* 컨트롤 영역 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <Input type="month" value={newMonth} onChange={setNewMonth} style={{ width: 160 }} />
                <Button onClick={handleCreate} appearance="primary">📌 대장 생성</Button>
                <Button onClick={handleCalculateAll} appearance="ghost" color="green">💵 전체 급여 계산</Button>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <label><input type="checkbox" checked={showClosedOnly} onChange={() => setShowClosedOnly(!showClosedOnly)} /> 마감만</label>
                <label><input type="checkbox" checked={showCalculatedOnly} onChange={() => setShowCalculatedOnly(!showCalculatedOnly)} /> 계산됨만</label>
                <Input type="month" value={searchMonth} onChange={setSearchMonth} style={{ width: 160 }} />
              </div>
            </div>

            {/* 대장 테이블 */}
            <table className="salary-schedule-table">
              <thead>
                <tr>
                  <th>급여월</th>
                  <th>지급일</th>
                  <th>생성일</th>
                  <th>마감</th>
                  <th>계산</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchedules.map((row) => (
                  <tr key={row.id}>
                    <td>{row.salary_month}</td>
                    <td>
                      {editingId === row.id ? (
                        <Input type="date" value={editingPayday} onChange={setEditingPayday} />
                      ) : row.payday || "-"}
                    </td>
                    <td>{row.created_at}</td>
                    <td>{row.is_closed ? "✅" : "❌"}</td>
                    <td>{row.is_calculated ? "🟢" : "⚪"}</td>
                    <td>
                      {!row.is_closed && editingId === row.id ? (
                        <>
                          <Button size="xs" onClick={saveEdit}>저장</Button>
                          <Button size="xs" onClick={() => setEditingId(null)}>취소</Button>
                        </>
                      ) : !row.is_closed && (
                        <>
                          <Button size="xs" onClick={() => startEdit(row)}>수정</Button>
                          <Button size="xs" onClick={() => handleClose(row.id, row.is_calculated)}>마감</Button>
                          <Button size="xs" color="red" appearance="ghost" onClick={() => handleDelete(row.id, row.is_closed)}>삭제</Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </Content>
      </Container>
    </Container>
  );
};

export default SalarySchedule;
