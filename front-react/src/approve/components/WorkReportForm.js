import React, { useEffect, useState } from 'react';
import '../css/workReportForm.css';
import { useUser } from '../../common/contexts/UserContext';
import { getDeptName, getPositionName } from '../../hrMgt/components/getEmployeeInfo';

const WorkReportForm = ({ approveLine, onFormDataChange }) => {
  const { user } = useUser();

  // 오늘 날짜
  const today = new Date();

  // 내일 날짜
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowDate = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;

  const [line, setLine] = useState(approveLine);
  const [report, setReport] = useState({
    emp_no: user.emp_no,
    title: '',
    content: '',
    execution_date: '',
    report_file: '',
    coop_dept_no: ''
  });

  useEffect(() => {
    if (approveLine && Array.isArray(approveLine)) {
      setLine(approveLine);
    }
  }, [approveLine]);

  // 폼 데이터가 변경될 때마다 부모 컴포넌트에 전달
  useEffect(() => {
    // 콜백 함수가 있으면 데이터 전달
    if (onFormDataChange) {
      onFormDataChange(report, line);
    }
  }, [report, line]);


  const changeValue = (e) => {

    let value = e.target.value;

    // coop_dept_no는 숫자로 변환, 빈 문자열이면 null로 설정
    if (e.target.name === 'coop_dept_no') {
      value = value === "" ? null : parseInt(value);
    }

    setReport({
      ...report,
      [e.target.name]: value,

    });
    console.log(line);
  };

  return (
    <div className="form-container">
      <h2 className="form-title">업무기안</h2>

      <div className="form-content">
        {/* 상단 정보 테이블 */}
        <div className="form-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <table className="header-table">
              <tbody>
                <tr>
                  <td className="label-cell">기안자</td>
                  <td>{user.emp_name}</td>
                </tr>
                <tr>
                  <td className="label-cell">소속</td>
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
          </div>

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
            {line && line.length > 1 ? (
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
                        {line[1].appr_status === 3 && <div className="approval-stamp">승인</div>}
                        <div className="approval-name">{line[1].appr_name || '이름 정보 없음'}</div>
                      </td>
                      : null}
                    {line[2] ?
                      <td className="approval-sign">
                        {line[2].appr_status === 3 && <div className="approval-stamp">승인</div>}
                        <div className="approval-name">{line[2].appr_name || '이름 정보 없음'}</div>
                      </td>
                      : null}
                    {line[3] ?
                      <td className="approval-sign">
                        {line[3].appr_status === 3 && <div className="approval-stamp">승인</div>}
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

        {/* 문서 정보 테이블 */}
        <table className="info-table">
          <tbody>
            <tr>
              <td className="label-cell">시행일자</td>
              <td>
                <div className="date-input">
                  <input type="date" name='execution_date' value={report.execution_date} format='yyyy/MM/dd' onChange={changeValue} min={tomorrowDate} />
                </div>
              </td>
              <td className="label-cell">협조부서</td>
              <td>
                <div>
                  <select name="coop_dept_no" value={report.coop_dept_no} onChange={changeValue}>
                    <option value="">부서 선택</option>
                    <option value="1">다온</option>
                    <option value="10">경영부</option>
                    <option value="101">인사팀(경영부)</option>
                    <option value="102">총무팀(경영부)</option>
                    <option value="103">회계팀(경영부)</option>
                    <option value="20">개발부</option>
                    <option value="201">연구개발팀(개발부)</option>
                    <option value="202">생산관리팀(개발부)</option>
                    <option value="203">it팀(개발부)</option>
                    <option value="30">영업부</option>
                    <option value="301">영업팀(영업부)</option>
                    <option value="302">마케팅팀(영업부)</option>
                    <option value="303">품질관리팀(영업부)</option>
                  </select>
                </div>
              </td>
            </tr>

            <tr>
              <td className="label-cell">제목</td>
              <td colSpan="3">
                <input
                  type="text"
                  name='title'
                  value={report.title}
                  className="full-width-input"
                  placeholder="제목을 입력하세요"
                  onChange={changeValue}
                />
              </td>
            </tr>
            <tr>
              <td colSpan={4} className="label-cell">내용</td>
            </tr>
            <tr>
              <td colSpan={4} style={{ height: '500px' }}>
                <textarea
                  name='content'
                  placeholder='내용을 입력하세요'
                  value={report.content}
                  className="full-width-input"
                  onChange={changeValue}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    resize: 'none',
                    verticalAlign: 'top',
                    padding: '10px',
                    outline: 'none'
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>
  );
};

export default WorkReportForm;
