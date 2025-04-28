import React, { useEffect, useState } from "react";
import { Modal, Button } from "rsuite";
import { request } from "../../../common/components/helpers/axios_helper";

const SalaryItemFormModal = ({ open, onClose, empNo, salaryMonth, type, item, onSuccess }) => {
  const [itemList, setItemList] = useState([]);
  const [formValue, setFormValue] = useState({
    item_id: "",
    amount: "",
  });

  // 수당 or 공제 항목 목록 불러오기
  useEffect(() => {
    const endpoint = type === "ALLOWANCE" ? "allowances" : "deductions";
    request("get", `/api/${endpoint}`)
      .then((res) => setItemList(res.data))
      .catch((err) => {
        console.error("항목 불러오기 실패:", err);
        alert("항목을 불러오지 못했습니다.");
      });
  }, [type]);

  // 수정 모드 시 초기값 세팅
  useEffect(() => {
    if (item) {
      setFormValue({
        item_id: item.item_id,
        amount: item.amount,
      });
    } else {
      setFormValue({
        item_id: "",
        amount: "",
      });
    }
  }, [item]);

  // 공제 자동 계산: 기본급 × 비율
  useEffect(() => {
    if (type === "DEDUCTION" && formValue.item_id && !item) {
      const selected = itemList.find(i => i.id === parseInt(formValue.item_id));
      if (selected?.rate) {
        request("get", `/api/employee/${empNo}/baseSalary`)
          .then((res) => {
            const rate = parseFloat(selected.rate) / 100;
            const amount = Math.round(res.data * rate);
            setFormValue((prev) => ({ ...prev, amount }));
          })
          .catch((err) => {
            console.error("기본급 불러오기 실패:", err);
            alert("기본급 정보를 불러오지 못했습니다.");
          });
      }
    }
  }, [formValue.item_id, itemList, type, empNo, item]);

  // 고정 수당 자동 입력
  useEffect(() => {
    if (type === "ALLOWANCE" && formValue.item_id && !item) {
      const selected = itemList.find(i => i.id === parseInt(formValue.item_id));
      if (selected?.is_fixed && selected.fixed_amount) {
        setFormValue((prev) => ({ ...prev, amount: selected.fixed_amount }));
      }
    }
  }, [formValue.item_id, itemList, type, item]);

  // 입력값 변경
  const changeValue = (e) => {
    const { name, value } = e.target;
    setFormValue({
      ...formValue,
      [name]: value
    });
  };

  // 저장 요청
  const handleSubmit = () => {
    const method = item ? "put" : "post";
    const url = item ? `/api/salaryItem/${item.id}` : `/api/salaryItem`;

    const payload = {
      emp_no: empNo,
      salary_month: salaryMonth,
      item_type: type,
      ...formValue
    };

    request(method, url, payload)
      .then(() => {
        onSuccess();
        onClose();
      })
      .catch((err) => {
        console.error("급여 항목 저장 실패:", err);
        alert("저장 실패");
      });
  };

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <Modal.Header>
        <h4>{item ? "항목 수정" : "항목 추가"} ({type === "ALLOWANCE" ? "수당" : "공제"})</h4>
      </Modal.Header>
      <Modal.Body>
        <label>항목 선택</label>
        <select
          name="item_id"
          value={formValue.item_id}
          onChange={changeValue}
          disabled={!!item} // 수정 시 항목 변경 불가
        >
          <option value="">항목 선택</option>
          {itemList.map(i => (
            <option key={i.id} value={i.id}>
              {i.name}
            </option>
          ))}
        </select>

        <label>금액</label>
        <input
          type="number"
          name="amount"
          value={formValue.amount}
          onChange={changeValue}
          disabled={
            (!item && type === "DEDUCTION" && itemList.find(i => i.id === parseInt(formValue.item_id))?.rate) ||
            (!item && type === "ALLOWANCE" && itemList.find(i => i.id === parseInt(formValue.item_id))?.is_fixed)
          }
        />
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

export default SalaryItemFormModal;
