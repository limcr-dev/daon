import { Container, Content, Card, Input, IconButton, Notification, toaster } from "rsuite";
import PlusIcon from "@rsuite/icons/Plus";
import EditIcon from "@rsuite/icons/Edit";
import TrashIcon from "@rsuite/icons/Trash";

import Leftbar from "../../../common/pages/Leftbar";
import SalaryLeftbar from "../SalaryLeftbar";
import { useEffect, useState } from "react";
import AllowanceModal from "./AllowanceModal";
import { request } from "../../../common/components/helpers/axios_helper";
import Header from "../../../common/pages/Header";
import Paging from "../../../common/components/paging.js";
import "../../css/AllowanceList.css";

const AllowanceList = () => {
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [page, setPage] = useState(1);
  const size = 10;
  const [searchKeyword, setSearchKeyword] = useState("");

  const fetchList = () => {
    request("get", "/api/allowances")
      .then((res) => setList(res.data))
      .catch((err) => {
        console.error("수당 목록 조회 실패:", err);
        toaster.push(
          <Notification type="error" header="조회 실패" closable>
            수당 목록을 불러오지 못했습니다.
          </Notification>,
          { placement: "topCenter" }
        );
      });
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("삭제하시겠습니까?")) return;

    request("delete", `/api/allowance/${id}`)
      .then(() => {
        toaster.push(
          <Notification type="success" header="삭제 완료" closable>
            수당이 삭제되었습니다.
          </Notification>,
          { placement: "topCenter" }
        );
        fetchList();
      })
      .catch((err) => {
        console.error("수당 삭제 실패:", err);
        toaster.push(
          <Notification type="error" header="삭제 실패" closable>
            삭제에 실패했습니다.
          </Notification>,
          { placement: "topCenter" }
        );
      });
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setOpen(true);
  };

  const handleSearchChange = (value) => {
    setSearchKeyword(value);
    setPage(1);
  };

  const filteredList = list.filter((row) =>
    row.name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const startIndex = (page - 1) * size;
  const endIndex = startIndex + size;
  const paginatedList = filteredList.slice(startIndex, endIndex);

  return (
    <Container style={{ minHeight: "100vh", width: "100%" }}>
      <Leftbar />
      <Container>
        <SalaryLeftbar />
        <Content>
          <Header />
          <div style={{ marginTop: "50px" }}>
            <Card
              style={{
                borderRadius: "15px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                padding: 20,
              }}
            >
              <h3 style={{ marginBottom: 20 }}>수당 요약 목록</h3>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <Input
                  placeholder="수당명 검색"
                  value={searchKeyword}
                  onChange={handleSearchChange}
                  style={{ width: 250 }}
                />
                <IconButton
                  icon={<PlusIcon />}
                  appearance="primary"
                  size="sm"
                  onClick={() => {
                    setSelectedItem(null);
                    setOpen(true);
                  }}
                >
                  수당 등록
                </IconButton>
              </div>

              <table className="allowance-summary-table">
                <thead>
                  <tr>
                    <th>항목명</th>
                    <th>금액</th>
                    <th>고정</th>
                    <th>비과세</th>
                    <th>비과세 한도</th>
                    <th>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedList.map((row, index) => (
                    <tr key={index}>
                      <td>{row.name}</td>
                      <td>{row.fixed_amount?.toLocaleString()}원</td>
                      <td>{row.is_fixed ? "O" : "X"}</td>
                      <td>{row.is_tax_free ? "O" : "X"}</td>
                      <td>{row.tax_free_limit?.toLocaleString() || "0"}원</td>
                      <td>
                        <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                          <IconButton
                            icon={<EditIcon />}
                            size="xs"
                            onClick={() => handleEdit(row)}
                          />
                          <IconButton
                            icon={<TrashIcon />}
                            size="xs"
                            color="red"
                            appearance="subtle"
                            onClick={() => handleDelete(row.id)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

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

              {/* 등록/수정 모달 */}
              {open && (
                <AllowanceModal
                  open={open}
                  onClose={() => setOpen(false)}
                  item={selectedItem}
                  onSuccess={fetchList}
                />
              )}
            </Card>
          </div>
        </Content>
      </Container>
    </Container>
  );
};

export default AllowanceList;
