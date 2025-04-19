import React, { useState, useEffect } from "react";
import { Modal, Button } from "rsuite";
 

const AllowanceModal = ({ open, onClose, item, onSuccess }) => {
  // ✅ 초기 상태 정의
  const [form, setForm] = useState({
    name: "",
    fixed_amount: "",
    is_fixed: true,
    is_tax_free: false,
    tax_free_type: "",
    tax_free_limit: "",
    is_active: true
  });

  // ✅ 수정 모드인 경우 기존 데이터를 form에 세팅
  useEffect(() => {
    if (item) {
      setForm({
        ...item,
        fixed_amount: item.fixed_amount ?? "",
        tax_free_limit: item.tax_free_limit ?? "",
        tax_free_type: item.tax_free_type ?? "",
        is_fixed: item.is_fixed ?? true,
        is_tax_free: item.is_tax_free ?? false,
        is_active: item.is_active ?? true
      });
    } else {
      // 등록 모드 초기화
      setForm({
        name: "",
        fixed_amount: "",
        is_fixed: true,
        is_tax_free: false,
        tax_free_type: "",
        tax_free_limit: "",
        is_active: true
      });
    }
  }, [item]);

  // ✅ 입력값 핸들링
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // ✅ 저장 처리 (등록 or 수정)
  const handleSubmit = () => {
    const method = item ? "PUT" : "POST";
    const url = item
      ? `http://localhost:8081/api/allowance/${item.id}`
      : `http://localhost:8081/api/allowance`;

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
      .then((res) => {
        if (res.ok) {
          onSuccess(); // 목록 새로고침
          onClose();   // 모달 닫기
        } else {
          alert("저장 실패");
        }
      });
  };

  return (
    <Modal open={open} onClose={onClose} size="md">
      <Modal.Header>
        <h4>{item ? "수당 항목 수정" : "수당 항목 등록"}</h4>
      </Modal.Header>

      <Modal.Body>
        <label>항목명</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <label>고정 금액 (원)</label>
        <input
          type="number"
          step="100"
          name="fixed_amount"
          value={form.fixed_amount}
          onChange={handleChange}
          required
        />

        <label>
          <input
            type="checkbox"
            name="is_fixed"
            checked={form.is_fixed}
            onChange={handleChange}
          />
          고정 수당 여부
        </label>

        <label>
          <input
            type="checkbox"
            name="is_tax_free"
            checked={form.is_tax_free}
            onChange={handleChange}
          />
          비과세 여부
        </label>

        {/* ✅ 비과세 항목만 노출 */}
        {form.is_tax_free && (
          <>
            <label>비과세 유형</label>
            <input
              type="text"
              name="tax_free_type"
              value={form.tax_free_type}
              onChange={handleChange}
            />

            <label>비과세 한도 (원)</label>
            <input
              type="number"
              step="100"
              name="tax_free_limit"
              value={form.tax_free_limit}
              onChange={handleChange}
            />
          </>
        )}

        <label>
          <input
            type="checkbox"
            name="is_active"
            checked={form.is_active}
            onChange={handleChange}
          />
          사용 여부
        </label>
      </Modal.Body>

      <Modal.Footer>
        <Button appearance="primary" onClick={handleSubmit}>
          {item ? "수정" : "등록"}
        </Button>
        <Button appearance="subtle" onClick={onClose}>
          취소
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AllowanceModal;
