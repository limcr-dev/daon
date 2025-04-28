import React, { useEffect, useState, useCallback } from "react";
import {
  Container, Content, Card, Input,
  IconButton, Notification, toaster
} from "rsuite";
import PlusIcon from "@rsuite/icons/Plus";
import EditIcon from "@rsuite/icons/Edit";
import TrashIcon from "@rsuite/icons/Trash";

import { request } from "../../../common/components/helpers/axios_helper";
import Leftbar from "../../../common/pages/Leftbar";
import EmployeeLeftbar from "../EmployeeLeftbar";
import PositionModal from "./PositionFormModal";
import Header from "../../../common/pages/Header";
import "../../css/PositionManage.css";
import Paging from "../../../common/components/paging.js";

const PositionManage = () => {
  const [positions, setPositions] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [page, setPage] = useState(1);
  const size = 14; 

  const fetchPositions = useCallback(() => {
    request("get", "/api/positions")
      .then((res) => setPositions(res.data))
      .catch((err) => {
        console.error("직급 목록 조회 실패:", err);
        toaster.push(
          <Notification type="error" header="조회 실패" closable>
            직급 목록을 불러오지 못했습니다.
          </Notification>,
          { placement: 'topEnd' }
        );
      });
  }, []);

  useEffect(() => {
    fetchPositions();
  }, [fetchPositions]);

  const handleSearchChange = (value) => {
    setSearchKeyword(value);
    setPage(1);
  };

  const filtered = positions.filter((pos) =>
    pos.position_name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const startIndex = (page - 1) * size;
  const endIndex = startIndex + size;
  const paginatedList = filtered.slice(startIndex, endIndex);

  const handleDelete = (positionId) => {
    if (!window.confirm("삭제하시겠습니까?")) return;

    request("delete", `/api/positions/${positionId}`)
      .then(() => {
        toaster.push(
          <Notification type="success" header="삭제 완료" closable>
            직급이 성공적으로 삭제되었습니다.
          </Notification>,
          { placement: 'topEnd' }
        );
        fetchPositions();
      })
      .catch((err) => {
        console.error("삭제 실패:", err);
        toaster.push(
          <Notification type="error" header="삭제 실패" closable>
            직급 삭제에 실패했습니다.
          </Notification>,
          { placement: 'topEnd' }
        );
      });
  };

  return (
    <Container style={{ display: "flex", minHeight: "100vh" }}>
      <Leftbar />
      <Container>
        <EmployeeLeftbar />
        <Content>
          <Header />
          <div style={{ marginTop: "50px", marginLeft: "30px", marginRight: "30px" }}>
            <Card
              style={{
                borderRadius: "15px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                padding: "20px",
                marginBottom: "30px",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "bold" }}>📌 직급 관리</h3>
              {/* 검색창 + 등록 버튼 */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <Input
                  placeholder="직급명 검색"
                  value={searchKeyword}
                  onChange={handleSearchChange}
                  style={{ width: 250 }}
                />
                <IconButton
                  icon={<PlusIcon />}
                  appearance="primary"
                  size="sm"
                  onClick={() => { setSelectedItem(null); setOpen(true); }}
                >
                  직급 등록
                </IconButton>
              </div>
              {/* 테이블 */}
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
                        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                          <IconButton
                            icon={<EditIcon />}
                            size="xs"
                            onClick={() => {
                              setSelectedItem(row);
                              setOpen(true);
                            }}
                          />
                          <IconButton
                            icon={<TrashIcon />}
                            size="xs"
                            appearance="subtle"
                            color="red"
                            onClick={() => handleDelete(row.position_id)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* 페이징 */}
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
          </div>
          {/* 등록/수정 모달 */}
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
