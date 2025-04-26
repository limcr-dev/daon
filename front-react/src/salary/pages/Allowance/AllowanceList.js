import { Button, Container, Content, Card, Input } from "rsuite"; // ✅ Input 추가
import Leftbar from "../../../common/pages/Leftbar";
import SalaryLeftbar from "../SalaryLeftbar";
import { useEffect, useState } from "react";
import AllowanceModal from "./AllowanceModal";
import { request } from "../../../common/components/helpers/axios_helper";
import Header from "../../../common/pages/Header";
import Paging from "../../../common/components/paging.js"; // ✅ 페이징 import
import "../../css/AllowanceList.css"; 

const AllowanceList = () => {
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [page, setPage] = useState(1);    // ✅ 현재 페이지
  const size = 10;             // ✅ 한 페이지당 보여줄 개수
  const [searchKeyword, setSearchKeyword] = useState(""); // ✅ 검색어 추가

  const fetchList = () => {
    request("get", "/api/allowances")
      .then((res) => setList(res.data))
      .catch((err) => {
        console.error("수당 목록 조회 실패:", err);
        alert("수당 목록을 불러오지 못했습니다.");
      });
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("삭제하시겠습니까?")) {
      request("delete", `/api/allowance/${id}`)
        .then(() => fetchList())
        .catch((err) => {
          console.error("수당 삭제 실패:", err);
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
            <h3 style={{ marginBottom: 20 }}>수당 요약 목록</h3>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <Input
                placeholder="수당명 검색"
                value={searchKeyword}
                onChange={handleSearchChange} // ✅
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
                수당 등록
              </Button>
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

            {/* ✅ 페이징 추가 */}
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

            {/* ✅ 등록/수정 모달 */}
            {open && (
              <AllowanceModal
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

export default AllowanceList;
