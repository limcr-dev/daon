import { Button, Container, Content, Card, Input } from "rsuite"; // ✅ Input 추가
import Leftbar from "../../../common/pages/Leftbar";
import SalaryLeftbar from "../SalaryLeftbar";
import { useEffect, useState } from "react";
import DeductionModal from "./DeductionModal";
import { request } from "../../../common/components/helpers/axios_helper";
import Header from "../../../common/pages/Header";
import Paging from "../../../common/components/paging.js"; // ✅ 페이징 import
import "../../css/DeductionList.css";

const DeductionList = () => {
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [page, setPage] = useState(1);    // ✅ 현재 페이지
  const size = 10;             // ✅ 한 페이지당 보여줄 개수
  const [searchKeyword, setSearchKeyword] = useState(""); // ✅ 검색어 추가

  const fetchList = () => {
    request("get", "/api/deductions")
      .then((res) => setList(res.data))
      .catch((err) => {
        console.error("공제 목록 조회 실패:", err);
        alert("공제 목록을 불러오지 못했습니다.");
      });
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("삭제하시겠습니까?")) {
      request("delete", `/api/deduction/${id}`)
        .then(() => fetchList())
        .catch((err) => {
          console.error("공제 삭제 실패:", err);
          alert("삭제 실패하였습니다.");
        });
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setOpen(true);
  };

  // ✅ 이름 검색 필터
  const filteredList = list.filter((row) =>
    row.name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  // ✅ 현재 페이지 slice
  const startIndex = (page - 1) * size;
  const endIndex = startIndex + size;
  const paginatedList = filteredList.slice(startIndex, endIndex);

  const handleSearchChange = (value) => {
    setSearchKeyword(value);
    setPage(1); // 검색하면 페이지 1로 초기화
  };

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
            <h3 style={{ marginBottom: 20 }}>공제 요약 목록</h3>

            {/* ✅ 검색창 + 등록버튼 */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <Input
                placeholder="공제명 검색"
                value={searchKeyword}
                onChange={handleSearchChange}
                style={{ width: 250 }}
              />
              <Button
                appearance="primary"
                size="sm"
                onClick={() => {
                  setSelectedItem(null);
                  setOpen(true);
                }}
              >
                공제 등록
              </Button>
            </div>

            {/* ✅ 테이블 */}
            <table className="deduction-summary-table">
              <thead>
                <tr>
                  <th>항목명</th>
                  <th>공제율</th>
                  <th>고정금액</th>
                  <th>소득세</th>
                  <th>사용</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {paginatedList.map((row, index) => (
                  <tr key={index}>
                    <td>{row.name}</td>
                    <td>{row.rate ? `${row.rate}%` : "-"}</td>
                    <td>{row.fixed_amount ? `${row.fixed_amount.toLocaleString()} 원` : "-"}</td>
                    <td>{row.is_tax ? "O" : "X"}</td>
                    <td>{row.is_active ? "O" : "X"}</td>
                    <td>
                      <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                        <Button
                          size="xs"
                          appearance="primary"
                          onClick={() => handleEdit(row)}
                        >
                          수정
                        </Button>
                        <Button
                          size="xs"
                          appearance="ghost"
                          color="red"
                          onClick={() => handleDelete(row.id)}
                        >
                          삭제
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* ✅ 페이징 */}
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

            {/* ✅ 수정/등록 모달 */}
            {open && (
              <DeductionModal
                open={open}
                onClose={() => setOpen(false)}
                item={selectedItem}
                onSuccess={fetchList}
              />
            )}
          </Card>
        </Content>
      </Container>
    </Container>
  );
};

export default DeductionList;
