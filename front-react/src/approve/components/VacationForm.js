import React, { useEffect, useState } from 'react';
import '../css/vacationForm.css';
import { useUser } from '../../common/contexts/UserContext';
import { getDeptName, getPositionName } from '../../hrMgt/components/getEmployeeInfo';
import { getCurrentVacationCycle, getExpireDate, getUsedVacation } from '../../attendMgt/components/VacationUtil';
import { request } from '../../common/components/helpers/axios_helper';

const VacationForm = ({ approveLine, onFormDataChange }) => {
  const { user } = useUser();

  const today = new Date();
  const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const [usedDays, setUsedDays] = useState(0);

  const [employees, setEmployees] = useState({});
  const [vacation_occurList, setVacation_occurList] = useState([]);
  const [vacationHistoryList, setVacationHistoryList] = useState([]);

  // 잔여 연차
  const { createVacation } = getExpireDate(vacation_occurList);

  // 입사일 기준 이번 주기 시작,끝 날짜 불러오기
  const { start, end } = getCurrentVacationCycle(employees.hire_date);

  // 사용연차 수 불러오기
  const { useVacation } = getUsedVacation(vacationHistoryList, start, end);

  const [line, setLine] = useState(approveLine);
  const [vacationForm, setVacationForm] = useState({
    emp_no: user ? user.emp_no : '',
    title: '',
    content: '',
    vacation_type: '',
    start_date: '',
    end_date: '',
    used_days: 0,
    remaining_days: 0
  });

  useEffect(() => {
    // 입사일 가져오기
    request("GET", "/api/getEmpInfo/" + user.emp_no)
      .then((res) => {
        setEmployees(res.data);

        // 휴가정보 불러오기
        request("GET", "/attend/vacation_log/" + user.emp_no)
          .then((res) => {
            setVacation_occurList(res.data);
          })

        // 휴가 사용기록 불러오기
        request("GET", "/attend/vacationHistory/" + user.emp_no)
          .then((res) => {
            setVacationHistoryList(res.data);
          })
      })
      .catch((error) => {
        console.log('로그인정보를 확인해주세요', error);
      })
  }, [user.emp_no])

  useEffect(() => {
    console.log("받은 결재선 데이터:", approveLine);
    if (approveLine && Array.isArray(approveLine)) {
      setLine(approveLine);
    }

  }, [approveLine]);

  // 폼 데이터가 변경될 때마다 부모 컴포넌트에 전달
  useEffect(() => {
    // 콜백 함수가 있으면 데이터 전달
    if (onFormDataChange) {
      onFormDataChange({
        ...vacationForm,
        remaining_days: (createVacation - useVacation)
      }, line);
    }
  }, [vacationForm, line, usedDays]);

  // 평일 수 계산 함수 - changeValue 함수보다 먼저 정의
  const countWorkingDays = (startDate, endDate) => {
    let count = 0;
    const curDate = new Date(startDate.getTime());

    // 날짜를 하루씩 증가시키며 평일인지 확인
    while (curDate <= endDate) {
      const dayOfWeek = curDate.getDay();
      // 0은 일요일, 6은 토요일
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count++;
      }
      curDate.setDate(curDate.getDate() + 1);
    }

    return count;
  };

  const changeValue = (e) => {
    let value = e.target.value;

    // coop_dept_no는 숫자로 변환, 빈 문자열이면 null로 설정
    if (e.target.name === 'vacation_type') {
      value = value === "" ? null : parseInt(value);
    }

    if (e.target.name === 'start_date' || e.target.name === 'end_date') {

      // 날짜 객체로 변환
      const start = new Date(e.target.name === 'start_date' ? value : vacationForm.start_date);
      const end = new Date(e.target.name === 'end_date' ? value : vacationForm.end_date);

      // 두 날짜가 모두 유효한지 확인
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        // 평일 수 계산 함수 호출
        const workingDays = countWorkingDays(start, end);
        vacationForm.used_days = workingDays;
        setUsedDays(workingDays);
      } else {
        setUsedDays(0);
      }
    }

    setVacationForm({
      ...vacationForm,
      [e.target.name]: value,
    });
  };

  return (
    <div className="form-container">
      <h2 className="form-title">휴가신청서</h2>

      <div className="form-content">
        {/* 상단 정보 테이블 */}
        <div className="form-header">
          <table className="header-table">
            <tbody>
              <tr>
                <td className="label-cell">기안자</td>
                <td>{user.emp_name}</td>
              </tr>
              <tr>
                <td className="label-cell">기안부서</td>
                <td>{getDeptName(user.dept_no)}</td>
              </tr>
              <tr>
                <td className="label-cell">기안일</td>
                <td></td>
              </tr>
              <tr>
                <td className="label-cell">문서번호</td>
                <td></td>
              </tr>
            </tbody>
          </table>

          {/* 신청 정보 (기안자 정보) - 항상 표시 */}
          <div style={{ display: 'flex' }}>
            <table className="approval-table">
              <tbody>
                <tr>
                  <td rowSpan="3" className="approval-position">신청</td>
                  <td className="approval-header">{user ? `${getPositionName(user.position_id)}` : '직급 정보 없음'}</td>
                </tr>
                <tr>
                  <td className="approval-sign">
                    <div className="approval-name">{user.emp_name || '이름 정보 없음'}</div>
                  </td>
                </tr>
                <tr>
                  <td className="approval-date"></td>
                </tr>
              </tbody>
            </table>
            {/* 승인 정보 (결재선) - 결재선이 있을 때만 표시 */}
            {line.length > 1 ? (
              <table className="approval-table">
                <tbody>
                  <tr>
                    <td rowSpan="3" className="approval-position">승인</td>
                    {line[1] ?
                      <td className="approval-header">{line[1].appr_position || '직급 정보 없음'}</td>
                      : null}
                    {line[2] ?
                      <td className="approval-header">{line[2].appr_position || '직급 정보 없음'}</td>
                      : null}
                    {line[3] ?
                      <td className="approval-header">{line[3].appr_position || '직급 정보 없음'}</td>
                      : null}
                  </tr>
                  <tr>
                    {line[1] ?
                      <td className="approval-sign">
                        {line[1].appr_status === 3 && document.doc_status !== 4 && <div className="approval-stamp">승인</div>}
                        <div className="approval-name">{line[1].appr_name || '이름 정보 없음'}</div>
                      </td>
                      : null}
                    {line[2] ?
                      <td className="approval-sign">
                        {line[2].appr_status === 3 && document.doc_status !== 4 && <div className="approval-stamp">승인</div>}
                        <div className="approval-name">{line[2].appr_name || '이름 정보 없음'}</div>
                      </td>
                      : null}
                    {line[3] ?
                      <td className="approval-sign">
                        {line[3].appr_status === 3 && document.doc_status !== 4 && <div className="approval-stamp">승인</div>}
                        <div className="approval-name">{line[3].appr_name || '이름 정보 없음'}</div>
                      </td>
                      : null}
                  </tr>
                  <tr>
                    {line[1] ?
                      <td className="approval-date">
                      </td>
                      : null}
                    {line[2] ?
                      <td className="approval-date">
                      </td>
                      : null}
                    {line[3] ?
                      <td className="approval-date">
                      </td>
                      : null}
                  </tr>
                </tbody>
              </table>) : <div></div>
            }
          </div>
        </div>

        {/* 휴가 신청 정보 */}
        <table className="vacation-info-table">
          <tbody>
            <tr>
              <td className="label-cell">휴가 종류</td>
              <td>
                <select name='vacation_type' onChange={changeValue}>
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
                <input type="date" name='start_date' onChange={changeValue} min={formattedDate} max={vacationForm.end_date !== '' ? vacationForm.end_date : null} />
                <span style={{ marginLeft: '10px', marginRight: '10px' }}>~</span>
                <input type="date" name='end_date' onChange={changeValue} min={vacationForm.start_date !== '' ? vacationForm.start_date : formattedDate} max={end} />

                <span style={{ marginLeft: '10px' }}>
                  <span> 신청일수 : </span>
                  <input type="number" className="day-input" name='used_days' value={vacationForm.used_days} readOnly />
                  {usedDays > createVacation - useVacation && (<span className="usage-message">신청가능일을 초과하였습니다.</span>)}
                </span>
              </td>
            </tr>
            <tr>
              <td className="label-cell">연차 일수</td>
              <td>
                <span>잔여일수 : </span>
                <input type="number" className="day-input" value={createVacation - useVacation} readOnly />
                <span style={{ marginLeft: '10px' }}>신청일수 : </span>
                <input type="number" className="day-input" value={vacationForm.vacation_type === 1 ? vacationForm.used_days : 0} readOnly />
                <span style={{ marginLeft: '10px' }}>신청 후 잔여일수 : </span>
                <input type="number" className="day-input" value={vacationForm.vacation_type === 1 ? createVacation - useVacation - vacationForm.used_days : createVacation - useVacation} readOnly />
              </td>
            </tr>
            <tr>
              <td className="label-cell">제목</td>
              <td colSpan="3">
                <input type="text" name='title' className="full-width-input" placeholder="제목을 입력하세요" onChange={changeValue} />
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
                  onChange={changeValue}
                  style={{ width: '100%', height: '100%', border: 'none', resize: 'none', verticalAlign: 'top', padding: '10px', outline: 'none' }}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VacationForm;