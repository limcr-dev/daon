import React, { useEffect, useState } from 'react';
import '../css/workReportForm.css';
import { useUser } from '../../common/contexts/UserContext';
import { getDeptName, getPositionName } from '../../hrMgt/components/getEmployeeInfo';
import { getApprStatusText } from './ApprCodeToText';

const WorkReportDetail = ({ approveLine, formData, docData }) => {
  const [line, setLine] = useState(approveLine || []);
  const [report, setReport] = useState(formData || {});
  const [document, setDocument] = useState(docData || {});
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

  useEffect(() => {

    if (approveLine && Array.isArray(approveLine)) { setLine(approveLine); }

    if (formData) { setReport(formData); }

    if (docData) { setDocument(docData); }

    // 모든 필요한 데이터가 있으면 로딩 완료
    if (approveLine && formData && docData) {
      setIsLoading(false);
    }

  }, [approveLine, formData, docData]);

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
                {line[0] && (
                  <>
                    <tr>
                      <td rowSpan="3" className="approval-position">신청</td>
                      <td className="approval-header">{line[0].appr_position || '직급 정보 없음'}</td>
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
                  </>
                )}
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
                {report.execution_date ? report.execution_date : ''}
              </td>
              <td className="label-cell">협조부서</td>
              <td>
                {report.coop_dept_no && report.coop_dept_no > 0
                  ? getDeptName(report.coop_dept_no)
                  : "협조부서 없음"}
              </td>
            </tr>

            <tr>
              <td className="label-cell">제목</td>
              <td colSpan="3">
                {report.title}
              </td>
            </tr>
            <tr>
              <td colSpan={4} className="label-cell">내용</td>
            </tr>
            <tr>
              <td colSpan={4} style={{ height: '500px', verticalAlign: 'top' }}>
                {report.content}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkReportDetail;