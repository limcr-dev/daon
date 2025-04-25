import React, { useEffect, useState } from 'react';
import '../css/workReportForm.css';
import { getDeptName } from '../../hrMgt/components/getEmployeeInfo';

const WorkReportUpdate = ({ approveLine, onFormDataChange, formData, docData }) => {
  
  // 오늘 날짜
  const today = new Date();
  const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  // 내일 날짜
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowDate = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;

  const [line, setLine] = useState(approveLine || []);
  const [report, setReport] = useState(formData || {});
  const [document, setDocument] = useState(docData || {});
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

  useEffect(() => {

    if (approveLine && Array.isArray(approveLine)) {
      setLine(approveLine);
    }

    if (formData) {
      setReport(formData);
    }

    if (docData) {
      setDocument(docData);
    }

    // 모든 필요한 데이터가 있으면 로딩 완료
    if (line && report && document) {
      setIsLoading(false);
    }

  }, [approveLine, formData, docData]);

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
  };

  // 로딩 중이면 로딩 표시
  if (isLoading || !line.length) {
    return <div>데이터를 불러오는 중입니다...</div>;
  }

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
                  <td>{document.emp_name}</td>
                </tr>
                <tr>
                  <td className="label-cell">소속</td>
                  <td>{getDeptName(document.dept_no)}</td>
                </tr>
                <tr>
                  <td className="label-cell">기안일</td>
                  <td>{document.doc_status !== 4 && (document.doc_reg_date)}</td>
                </tr>
                <tr>
                  <td className="label-cell">문서번호</td>
                  <td>{document.doc_no}</td>
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
                  <td className="approval-header">{line[0].appr_position}</td>
                </tr>
                <tr>
                  <td className="approval-sign">
                    {line[0].appr_status === 0 && document.doc_status !== 1 && <div className="approval-stamp">승인</div>}
                    <div className="approval-name">{line[0].appr_name || '이름 정보 없음'}</div>
                  </td>
                </tr>
                <tr>
                  <td className="approval-date">
                    {document.doc_status !== 1 && <div>{line[0].appr_date}</div>}
                  </td>
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
                        {line[1].appr_status === 3 && <div>{line[1].appr_date}</div>}
                      </td>
                      : null}
                    {line[2] ?
                      <td className="approval-date">
                        {line[2].appr_status === 3 && <div>{line[2].appr_date}</div>}
                      </td>
                      : null}
                    {line[3] ?
                      <td className="approval-date">
                        {line[3].appr_status === 3 && <div>{line[3].appr_date}</div>}
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
                  <select name="coop_dept_no" value={report.coop_dept_no} onChange={changeValue} required>
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
              <td colSpan={4} style={{ height: '500px', verticalAlign: 'top' }}>
                <textarea
                  name='content'
                  placeholder='내용을 입력하세요'
                  className="full-width-input"
                  value={report.content}
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

        {/* 첨부파일 */}
        <div className="form-footer">
          <div className="attachment-section">
            <h3>파일첨부</h3>
            <div className="attachment-box">
              <div className="attachment-placeholder">
                <img src="/paperclip-icon.png" alt="첨부" className="attachment-icon" />
                <span>이 곳에 파일을 드래그 하세요. 또는 파일첨부</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkReportUpdate;