import React, { useEffect, useState, useCallback } from "react";
import { Container, Content, Button, Input, Card } from "rsuite";
import { request } from "../../../common/components/helpers/axios_helper";
import Leftbar from "../../../common/pages/Leftbar";
import EmployeeLeftbar from "../EmployeeLeftbar";
import PositionModal from "./PositionFormModal";
import Header from "../../../common/pages/Header";
import "../../css/PositionManage.css";
import Paging from "../../../common/components/paging.js"; // ✅ 페이징 컴포넌트 import 추가

const PositionManage = () => {
  const [positions, setPositions] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [page, setPage] = useState(1);   // ✅ 현재 페이지
  const size = 14;           // ✅ 한 페이지당 보여줄 개수

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

  // 검색 + 페이지 초기화
  const handleSearchChange = (value) => {
    setSearchKeyword(value);
    setPage(1); // ✅ 검색하면 1페이지로 리셋
  };

  const filtered = positions.filter((pos) =>
    pos.position_name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  // ✅ 현재 페이지 slice
  const startIndex = (page - 1) * size;
  const endIndex = startIndex + size;
  const paginatedList = filtered.slice(startIndex, endIndex);

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
                onChange={handleSearchChange}   // ✅ 변경
                style={{ width: 250 }}
              />
              <Button appearance="primary" onClick={() => { setSelectedItem(null); setOpen(true); }}>
                + 직급 등록
              </Button>
            </div>

            {/* ✅ 테이블 */}
            <table className="position-list">
              <thead>
                <tr>
                  <th>직급명</th>
                  <th>기본급</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {paginatedList.map((row, idx) => (
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

            {/* ✅ 페이징 추가 */}
            <div style={{ marginTop: 20, display: "flex", justifyContent: "center" }}>
              <Paging
                paging={{
                  page: page,
                  size: size,
                  totalCount: filtered.length
                }}
                onPageChange={(newPage) => setPage(newPage)}
              />
            </div>

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
