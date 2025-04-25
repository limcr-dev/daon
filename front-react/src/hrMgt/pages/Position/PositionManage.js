// 📁 src/pages/hrMgt/PositionManage.js
import React, { useEffect, useState, useCallback } from "react";
import { Container, Content, Button, Input, Card } from "rsuite";

import { request } from "../../../common/components/helpers/axios_helper";
import Leftbar from "../../../common/pages/Leftbar";
import EmployeeLeftbar from "../EmployeeLeftbar";
import PositionModal from "./PositionFormModal";
import Header from "../../../common/pages/Header";
import "../../css/PositionManage.css"

const PositionManage = () => {
  const [positions, setPositions] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // ✅ 목록 조회
  const fetchPositions = useCallback(() => {
    request("get", "/api/positions")
      .then((res) => setPositions(res.data))
      .catch((err) => {
        console.error("직급 목록 조회 실패:", err);
        alert("직급 목록을 불러오지 못했습니다.");
      });
  }, []);

  useEffect(() => {
    fetchPositions();
  }, [fetchPositions]);

  // ✅ 필터
  const filtered = positions.filter((pos) =>
    pos.position_name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <Container style={{ display: "flex", minHeight: "100vh" }}>
      <Leftbar />
      <Container>
        <EmployeeLeftbar />
        <Content>
          <Header />

          <Card
            style={{
                borderRadius: "15px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                padding: "20px",
                marginBottom: "30px",
            }}
          >
            <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "bold" }}>📌 직급 관리</h3>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <Input
                placeholder="직급명 검색"
                value={searchKeyword}
                onChange={setSearchKeyword}
                style={{ width: 250 }}
              />
              <Button appearance="primary" onClick={() => { setSelectedItem(null); setOpen(true); }}>
                + 직급 등록
              </Button>
            </div>

            <table className="position-list">
              <thead>
                <tr>
                  <th>직급명</th>
                  <th>기본급</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.position_name}</td>
                    <td>{Number(row.base_salary).toLocaleString()} 원</td>
                    <td>
                      <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                        <Button
                          size="xs"
                          appearance="primary"
                          onClick={() => {
                            setSelectedItem(row);
                            setOpen(true);
                          }}
                        >
                          수정
                        </Button>
                        <Button
                          size="xs"
                          appearance="ghost"
                          color="red"
                          onClick={() => {
                            if (window.confirm("삭제하시겠습니까?")) {
                              request("delete", `/api/positions/${row.position_id}`)
                                .then(() => fetchPositions())
                                .catch(() => alert("삭제 실패"));
                            }
                          }}
                        >
                          삭제
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {/* ✅ 등록/수정 모달 */}
          {open && (
            <PositionModal
              open={open}
              onClose={() => setOpen(false)}
              item={selectedItem}
              onSuccess={fetchPositions}
            />
          )}
        </Content>
      </Container>
    </Container>
  );
};

export default PositionManage;
