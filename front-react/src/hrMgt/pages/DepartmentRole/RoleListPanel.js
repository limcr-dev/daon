import React, { useEffect, useState } from "react";
import { Card, Button, Input, Divider, Table, IconButton, Modal, Notification, toaster } from "rsuite";
import EditIcon from "@rsuite/icons/Edit";
import TrashIcon from "@rsuite/icons/Trash";

const { Column, HeaderCell, Cell } = Table;

const RoleListPanel = ({ deptNo }) => {
  const [roles, setRoles] = useState([]);
  const [newRoleName, setNewRoleName] = useState("");
  const [editRole, setEditRole] = useState(null);
  const [editName, setEditName] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteRoleId, setDeleteRoleId] = useState(null);

  // ✅ 부서 선택 시 목록 불러오기
  useEffect(() => {
    if (!deptNo) {
      setRoles([]);
      return;
    }

    fetch(`http://localhost:8081/api/roles?deptNo=${deptNo}`)
      .then((res) => res.json())
      .then((data) => setRoles(data));
  }, [deptNo]);

  const fetchRoles = () => {
    fetch(`http://localhost:8081/api/roles?deptNo=${deptNo}`)
      .then((res) => res.json())
      .then((data) => setRoles(data));
  };

  // ✅ 직책 추가
  const handleAddRole = () => {
    if (!newRoleName.trim()) {
      toaster.push(
        <Notification type="warning" header="입력 필요" closable>
          직책명을 입력해주세요.
        </Notification>,
        { placement: "topCenter" }
      );
      return;
    }

    fetch("http://localhost:8081/api/roles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role_name: newRoleName, dept_no: deptNo })
    })
      .then((res) => res.json())
      .then(() => {
        setNewRoleName("");
        toaster.push(
          <Notification type="success" header="등록 완료" closable>
            직책이 등록되었습니다.
          </Notification>,
          { placement: "topCenter" }
        );
        fetchRoles();
      })
      .catch(() => {
        toaster.push(
          <Notification type="error" header="등록 실패" closable>
            직책 등록에 실패했습니다.
          </Notification>,
          { placement: "topCenter" }
        );
      });
  };

  // ✅ 수정 시작
  const handleEdit = (role) => {
    setEditRole(role);
    setEditName(role.role_name);
  };

  // ✅ 수정 완료
  const handleEditSubmit = () => {
    if (!editName.trim()) {
      toaster.push(
        <Notification type="warning" header="입력 필요" closable>
          직책명을 입력해주세요.
        </Notification>,
        { placement: "topCenter" }
      );
      return;
    }

    fetch("http://localhost:8081/api/roles", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...editRole, role_name: editName })
    })
      .then((res) => res.json())
      .then(() => {
        setEditRole(null);
        setEditName("");
        toaster.push(
          <Notification type="success" header="수정 완료" closable>
            직책명이 수정되었습니다.
          </Notification>,
          { placement: "topCenter" }
        );
        fetchRoles();
      })
      .catch(() => {
        toaster.push(
          <Notification type="error" header="수정 실패" closable>
            직책 수정에 실패했습니다.
          </Notification>,
          { placement: "topCenter" }
        );
      });
  };

  // ✅ 삭제 요청
  const handleDelete = (roleId) => {
    setDeleteRoleId(roleId);
    setShowConfirm(true);
  };

  // ✅ 삭제 확인
  const confirmDelete = () => {
    fetch(`http://localhost:8081/api/roles/${deleteRoleId}`, {
      method: "DELETE"
    })
      .then(() => {
        setShowConfirm(false);
        setDeleteRoleId(null);
        toaster.push(
          <Notification type="success" header="삭제 완료" closable>
            직책이 삭제되었습니다.
          </Notification>,
          { placement: "topCenter" }
        );
        fetchRoles();
      })
      .catch(() => {
        toaster.push(
          <Notification type="error" header="삭제 실패" closable>
            직책 삭제에 실패했습니다.
          </Notification>,
          { placement: "topCenter" }
        );
      });
  };

  return (
    <Card style={{ padding: 20, width: "100%" }}>
      <h4>🧩 직책 목록</h4>
      <Divider />

      {/* 등록 */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <Input
          placeholder="직책명 입력"
          value={newRoleName}
          onChange={setNewRoleName}
          onPressEnter={handleAddRole}
        />
        <Button appearance="primary" onClick={handleAddRole}>추가</Button>
      </div>

      {/* 목록 */}
      <Table height={400} data={roles} autoHeight>
        <Column flexGrow={1} align="center">
          <HeaderCell>직책명</HeaderCell>
          <Cell>
            {(rowData) => (
              editRole?.role_id === rowData.role_id ? (
                <Input
                  value={editName}
                  onChange={setEditName}
                  onPressEnter={handleEditSubmit}
                  onBlur={handleEditSubmit}
                  autoFocus
                />
              ) : (
                rowData.role_name
              )
            )}
          </Cell>
        </Column>
        <Column width={100} align="center">
          <HeaderCell>관리</HeaderCell>
          <Cell>
            {(rowData) => (
              <>
                <IconButton icon={<EditIcon />} size="xs" onClick={() => handleEdit(rowData)} />
                <IconButton icon={<TrashIcon />} size="xs" appearance="subtle" color="red" onClick={() => handleDelete(rowData.role_id)} style={{ marginLeft: 8 }} />
              </>
            )}
          </Cell>
        </Column>
      </Table>

      {/* 삭제 확인 모달 */}
      <Modal open={showConfirm} onClose={() => setShowConfirm(false)}>
        <Modal.Header>
          <Modal.Title>삭제 확인</Modal.Title>
        </Modal.Header>
        <Modal.Body>정말로 삭제하시겠습니까?</Modal.Body>
        <Modal.Footer>
          <Button appearance="primary" onClick={confirmDelete}>확인</Button>
          <Button appearance="subtle" onClick={() => setShowConfirm(false)}>취소</Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default RoleListPanel;
