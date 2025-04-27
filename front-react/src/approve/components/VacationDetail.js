import React, { useEffect, useState } from 'react';
import '../css/vacationForm.css';
import { getDeptName } from '../../hrMgt/components/getEmployeeInfo';
import { getVacationTypeText } from './ApprCodeToText';
import { request } from '../../common/components/helpers/axios_helper';
import { getExpireDate } from '../../attendMgt/components/VacationUtil';
import { MdDomainVerification } from 'react-icons/md';

const VacationDetail = ({ approveLine, formData, docData }) => {
  const [line, setLine] = useState(approveLine || []);
  const [vacationForm, serVacationForm] = useState(formData || {});
  const [document, setDocument] = useState(docData || {});
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

  const [employees, setEmployees] = useState({});
  const [vacation_occurList, setVacation_occurList] = useState([]);
  const [vacationHistoryList, setVacationHistoryList] = useState([]);

  // 잔여 연차
  const { remainVacation } = getExpireDate(vacation_occurList);

  useEffect(() => {

    if (approveLine && Array.isArray(approveLine)) {
      setLine(approveLine);
    }

    if (formData) {
      serVacationForm(formData);
    }

    if (docData) {
      setDocument(docData);
    }

    // 모든 필요한 데이터가 있으면 로딩 완료
    if (line && vacationForm && document) {
      setIsLoading(false);
      console.log("데이터 가져오기 성공");
      if (docData.emp_no) {
        // 입사일 가져오기
        request("GET", "/api/getEmpInfo/" + docData.emp_no)
          .then((res) => {
            setEmployees(res.data);

            // 휴가정보 불러오기
            request("GET", "/attend/vacation_log/" + docData.emp_no)
              .then((res) => {
                setVacation_occurList(res.data);
              })

            // 휴가 사용기록 불러오기
            request("GET", "/attend/vacationHistory/" + docData.emp_no)
              .then((res) => {
                setVacationHistoryList(res.data);
              })
          })
          .catch((error) => {
            console.log('로그인정보를 확인해주세요', error);
          });
      }
    }

  }, [approveLine, formData, docData]);

 
  // 로딩 중이면 로딩 표시
  if (isLoading || !line.length) {
    return <div>데이터를 불러오는 중입니다...</div>;
  }

  return (
    <div className="form-container">
      <h2 className="form-title">휴가신청서</h2>

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

        {/* 휴가 신청 정보 */}
        <table className="vacation-info-table">
          <tbody>
            <tr>
              <td className="label-cell">휴가 종류</td>
              <td>
                {getVacationTypeText(vacationForm.vacation_type)}
              </td>
            </tr>
            <tr>
              <td className="label-cell">기간 및 일시</td>
              <td>
                <input type="date" name='start_date' value={vacationForm.start_date} readOnly />
                <span style={{ marginLeft: '10px', marginRight: '10px' }}>~</span>
                <input type="date" name='end_date' value={vacationForm.end_date} readOnly />
                <span style={{ marginLeft: '30px' }}>
                  <span> 신청일수 : {vacationForm.used_days}</span>
                  <span style={{ marginLeft: '10px' }}>
                    {vacationForm.used_days > remainVacation && (<span className="usage-message">신청가능일을 초과하였습니다.</span>)}
                  </span>
                </span>
              </td>
            </tr>
            <tr>
              <td className="label-cell">연차 일수</td>
              <td>
                <span>잔여일수 : {remainVacation} </span>
                <span style={{ marginLeft: '30px' }}>신청일수 : {vacationForm.vacation_type === 1 ? vacationForm.used_days : 0} </span>
                <span style={{ marginLeft: '30px' }}>신청 후 잔여일수 : {vacationForm.vacation_type === 1 ? remainVacation - formData.used_days : remainVacation}</span>
              </td>
            </tr>
            <tr>
              <td className="label-cell">제목</td>
              <td colSpan="3">
                {vacationForm.title}
              </td>
            </tr>
            <tr>
              <td colSpan={4} className="label-cell">휴가사유</td>
            </tr>
            <tr>
              <td colSpan={4} style={{ height: '300px', verticalAlign: 'top' }}>
                {vacationForm.content}
              </td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>
  );
};

export default VacationDetail;