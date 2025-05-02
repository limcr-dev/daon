import React, { useEffect, useState } from 'react';
import '../css/vacationForm.css';
import { getDeptName } from '../../hrMgt/components/getEmployeeInfo';
import { request } from '../../common/components/helpers/axios_helper';
import { getCurrentVacationCycle, getExpireDate, getUsedVacation } from '../../attendMgt/components/VacationUtil';
import { useUser } from '../../common/contexts/UserContext';

const VacationUpdate = ({ approveLine, onFormDataChange, formData, docData }) => {
  const { user } = useUser();
  const [line, setLine] = useState(approveLine || []);
  const [vacationForm, setVacationForm] = useState(formData || {});
  const [document, setDocument] = useState(docData || {});
  const [isLoading, setIsLoading] = useState(true);

  const today = new Date();
  const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const [employees, setEmployees] = useState({});
  const [vacation_occurList, setVacation_occurList] = useState([]);
  const [vacationHistoryList, setVacationHistoryList] = useState([]);

  const [createVacation, setCreateVacation] = useState(0);
  const [useVacation, setUseVacation] = useState(0);
  const [remainingDays, setRemainingDays] = useState(0);

  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);

  // 👉 평일 수 계산
  const countWorkingDays = (startDate, endDate) => {
    let count = 0;
    const curDate = new Date(startDate.getTime());
    while (curDate <= endDate) {
      const day = curDate.getDay();
      if (day !== 0 && day !== 6) count++;
      curDate.setDate(curDate.getDate() + 1);
    }
    return count;
  };

  // ✅ 변경 처리
  const changeValue = (e) => {
    let value = e.target.value;
    if (e.target.name === 'vacation_type') {
      value = value === "" ? null : parseInt(value);
    }

    const updatedForm = {
      ...vacationForm,
      [e.target.name]: value,
    };

    // 날짜 관련 처리
    const startDate = new Date(
      e.target.name === 'start_date' ? value : vacationForm.start_date
    );
    const endDate = new Date(
      e.target.name === 'end_date' ? value : vacationForm.end_date
    );

    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
      const workingDays = countWorkingDays(startDate, endDate);
      updatedForm.used_days = workingDays;
    }

    setVacationForm(updatedForm);
  };

  // 📦 입사일/휴가 정보 불러오기
  useEffect(() => {
    request("GET", "/api/getEmpInfo/" + user.emp_no)
      .then(res => {
        setEmployees(res.data);

        const { start, end } = getCurrentVacationCycle(res.data.hire_date);
        setStart(start);
        setEnd(end);

        request("GET", "/attend/vacation_log/" + user.emp_no)
          .then(res => {
            setVacation_occurList(res.data);
            const { createVacation } = getExpireDate(res.data);
            setCreateVacation(createVacation);
          });

        request("GET", "/attend/vacationHistory/" + user.emp_no)
          .then(res => {
            setVacationHistoryList(res.data);
            const { useVacation } = getUsedVacation(res.data, start, end);
            setUseVacation(useVacation);
          });
      })
      .catch(err => console.error("직원 정보 조회 실패", err));
  }, [user.emp_no]);

  // ✅ 잔여일수 계산 및 전달
  useEffect(() => {
    const remaining = createVacation - useVacation;
    setRemainingDays(remaining);

    if (onFormDataChange) {
      onFormDataChange({
        ...vacationForm,
        remaining_days: remaining
      }, line);
    }
  }, [vacationForm, line, createVacation, useVacation]);

  useEffect(() => {
    if (approveLine) setLine(approveLine);
    if (formData) setVacationForm(formData);
    if (docData) setDocument(docData);
    setIsLoading(false);
  }, [approveLine, formData, docData]);

  if (isLoading || !line.length) return <div>데이터 불러오는 중...</div>;

  return (
    <div className="form-container">
      <h2 className="form-title">휴가신청서</h2>
      <div className="form-content">
        <div className="form-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <table className="header-table">
              <tbody>
                <tr><td className="label-cell">기안자</td><td>{document.emp_name}</td></tr>
                <tr><td className="label-cell">소속</td><td>{getDeptName(document.dept_no)}</td></tr>
                <tr><td className="label-cell">기안일</td><td>{document.doc_reg_date}</td></tr>
                <tr><td className="label-cell">문서번호</td><td>{document.doc_no}</td></tr>
              </tbody>
            </table>
          </div>
          {/* 결재선 출력 생략 가능 */}
        </div>

        {/* 휴가 입력 폼 */}
        <table className="vacation-info-table">
          <tbody>
            <tr>
              <td className="label-cell">휴가 종류</td>
              <td>
                <select name='vacation_type' value={vacationForm.vacation_type} onChange={changeValue}>
                  <option value="">휴가 종류 선택</option>
                  <option value="1">연차</option>
                  <option value="2">병가</option>
                  <option value="3">경조휴가</option>
                  <option value="4">특별휴가</option>
                </select>
              </td>
            </tr>
            <tr>
              <td className="label-cell">기간 및 일시</td>
              <td>
                <input type="date" name='start_date' value={vacationForm.start_date} onChange={changeValue} min={formattedDate} />
                <span style={{ margin: '0 10px' }}>~</span>
                <input type="date" name='end_date' value={vacationForm.end_date} onChange={changeValue} min={vacationForm.start_date || formattedDate} max={end} />
                <span style={{ marginLeft: '10px' }}>
                  신청일수:
                  <input type="number" className="day-input" name='used_days' value={vacationForm.used_days || 0} readOnly />
                </span>
              </td>
            </tr>
            <tr>
              <td className="label-cell">연차 일수</td>
              <td>
                <span>잔여일수: </span>
                <input type="number" className="day-input" value={remainingDays} readOnly />
                <span style={{ marginLeft: '10px' }}>신청 후 잔여일수: </span>
                <input
                  type="number"
                  className="day-input"
                  value={
                    vacationForm.vacation_type === 1
                      ? remainingDays - (vacationForm.used_days || 0)
                      : remainingDays
                  }
                  readOnly
                />
              </td>
            </tr>
            <tr>
              <td className="label-cell">제목</td>
              <td colSpan="3">
                <input type="text" name='title' className="full-width-input" value={vacationForm.title || ''} placeholder="제목을 입력하세요" onChange={changeValue} />
              </td>
            </tr>
            <tr>
              <td colSpan={4} className="label-cell">휴가사유</td>
            </tr>
            <tr>
              <td colSpan={4} style={{ height: '300px' }}>
                <textarea
                  name='content'
                  placeholder='휴가사유를 입력하세요'
                  className="full-width-input"
                  value={vacationForm.content || ''}
                  onChange={changeValue}
                  style={{ width: '100%', height: '100%', border: 'none', resize: 'none', padding: '10px' }}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VacationUpdate;
