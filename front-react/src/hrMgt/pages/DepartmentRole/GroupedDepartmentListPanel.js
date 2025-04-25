import React, { useEffect, useState, useCallback } from "react";
import { Button, IconButton } from "rsuite";
import EditIcon from "@rsuite/icons/Edit";
import TrashIcon from "@rsuite/icons/Trash";
import DepartmentAddModal from "./DepartmentAddModal";
import { request } from "../../../common/components/helpers/axios_helper";

const GroupedDepartmentListPanel = ({ onSelectDept }) => {
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // ✅ 부서 목록 불러오기
  const fetchDepartments = useCallback(() => {
    request("get", "/api/departments")
      .then((res) => setDepartments(res.data))
      .catch((err) => {
        console.error("부서 목록 조회 실패:", err);
        alert("부서 목록을 불러오지 못했습니다.");
      });
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const handleSelect = (deptNo) => {
    setSelectedDept(deptNo);
    onSelectDept(deptNo);
  };

  const handleEdit = (dept) => {
    alert(`부서 수정: ${dept.dept_name}`);
  };

  const handleDelete = (dept) => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      request("delete", `/api/departments/${dept.dept_no}`)
        .then(() => fetchDepartments())
        .catch((err) => {
          console.error("부서 삭제 실패:", err);
          alert("부서 삭제에 실패했습니다.");
        });
    }
  };

  const topDepartments = departments.filter((d) => d.dept_parent === 1);

  return (
    <div
      style={{
        width: 300,
        backgroundColor: "#ffffff",
        borderRadius: 12,
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
        padding: 16,
      }}
    >
      {/* ✅ 상단 제목 및 버튼 */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "bold" }}>📂 부서 목록</h3>
        <div style={{ display: "flex", gap: 8 }}>
          <Button size="xs" onClick={() => setIsEditMode(!isEditMode)}>
            {isEditMode ? "편집 종료" : "✏️ 수정"}
          </Button>
          <Button appearance="primary" size="xs" onClick={() => setOpen(true)}>
            + 등록
          </Button>
        </div>
      </div>

      {/* ✅ 각 상위 부서별 카드 스타일 */}
      {topDepartments.map((top) => {
        const children = departments.filter((d) => d.dept_parent === top.dept_no);
        return (
          <div
            key={top.dept_no}
            style={{
              border: "1px solid #ddd",
              borderRadius: 8,
              marginBottom: 12,
              overflow: "hidden",
              backgroundColor: "#fdfdfd",
            }}
          >
            {/* 상위 부서 타이틀 */}
            <div
              style={{
                padding: "10px 12px",
                fontWeight: "bold",
                backgroundColor: "#f5f5f5",
                borderBottom: "1px solid #eee",
              }}
            >
              📁 {top.dept_name}
            </div>

            {/* 하위 부서 리스트 */}
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {children.map((child) => (
                <li
                  key={child.dept_no}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 12px",
                    backgroundColor: selectedDept === child.dept_no ? "#e8e8e8" : "#fafafa",
                    borderBottom: "1px solid #f0f0f0",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                  }}
                  onClick={() => handleSelect(child.dept_no)}
                >
                  <span>{child.dept_name}</span>
                  {isEditMode && (
                    <span>
                      <IconButton
                        icon={<EditIcon />}
                        size="xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(child);
                        }}
                      />
                      <IconButton
                        icon={<TrashIcon />}
                        size="xs"
                        color="red"
                        style={{ marginLeft: 6 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(child);
                        }}
                      />
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        );
      })}

      {/* ✅ 부서 추가 모달 */}
      <DepartmentAddModal open={open} onClose={() => setOpen(false)} onSuccess={fetchDepartments} />
    </div>
  );
};

export default GroupedDepartmentListPanel;
