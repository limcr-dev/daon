import React, { useEffect, useState } from 'react';
import '../css/vacationForm.css';
import { useUser } from '../../common/contexts/UserContext';
import { request } from '../../common/components/helpers/axios_helper';

const VacationForm = () => {

  const { user } = useUser();
  const today = new Date();
  const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const [vacationForm, setVacationForm] = useState({
    emp_no: user ? user.emp_no : '',
    vacationType: '',
    startDate: '',
    endDate: '',
    halfDayType: null,
    totalDays: 0,
    usedDays: 0,
    remainingDays: 0
  });

  const handleDateChange = (field, value) => {
    setVacationForm({
      ...vacationForm,
      [field]: value
    });
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await request("GET", "/approve/getVacationInfo", user.emp_no);
  //     } catch (error) {
  //       console.error("데이터 불러오기 오류:", error);
  //     }
  //   };

  //   fetchData();
  // },[])

  return (
    <div className="vacation-form-container">
      <h2 className="form-title">연차신청서</h2>

      <div className="form-content">
        {/* 상단 정보 테이블 */}
        <div className="form-header">
          <table className="header-table">
            <tbody>
              <tr>
                <td className="label-cell">기안자</td>
                <td>김지연</td>
              </tr>
              <tr>
                <td className="label-cell">기안부서</td>
                <td>영업팀</td>
              </tr>
              <tr>
                <td className="label-cell">기안일</td>
                <td>{formattedDate}(화)</td>
              </tr>
              <tr>
                <td className="label-cell">문서번호</td>
                <td></td>
              </tr>
            </tbody>
          </table>

          {/* 결재라인 테이블 */}
          <table className="approval-table">
            <tbody>
              <tr>
                <td className="approval-header">부장</td>
              </tr>
              <tr>
                <td className="approval-sign">김지연</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 휴가 신청 정보 */}
        <table className="vacation-info-table">
          <tbody>
            <tr>
              <td className="label-cell">휴가 종류</td>
              <td>
                <select value={vacationForm.vacationType} onChange={(e) => handleDateChange('vacationType', e.target.value)}>
                  <option value="연차">연차</option>
                  <option value="반차">반차</option>
                  <option value="병가">병가</option>
                  <option value="특별휴가">특별휴가</option>
                </select>
              </td>
            </tr>
            <tr>
              <td className="label-cell">기간 및 일시</td>
              <td className="date-range">
                <input
                  type="date"
                  value={vacationForm.startDate}
                  onChange={(e) => handleDateChange('startDate', e.target.value)}
                />
                <span className="date-separator">~</span>
                <input
                  type="date"
                  value={vacationForm.endDate}
                  onChange={(e) => handleDateChange('endDate', e.target.value)}
                />
                <span className="usage-status">
                  <span className="usage-label">사용일수 : </span>
                  <input type="number" className="day-input" value={vacationForm.totalDays} readOnly />
                  <span className="usage-message">신청가능일을 초과하였습니다.</span>
                </span>
              </td>
            </tr>
            <tr>
              <td className="label-cell">반차 여부</td>
              <td className="half-day-options">
                <label>
                  <input type="checkbox" /> 시작일
                </label>
                <label className="radio-label">
                  <input type="radio" name="startHalf" disabled /> 오전
                </label>
                <label className="radio-label">
                  <input type="radio" name="startHalf" disabled /> 오후
                </label>
                <label>
                  <input type="checkbox" /> 종료일
                </label>
                <label className="radio-label">
                  <input type="radio" name="endHalf" disabled /> 오전
                </label>
                <label className="radio-label">
                  <input type="radio" name="endHalf" disabled /> 오후
                </label>
              </td>
            </tr>
            <tr>
              <td className="label-cell">연차 일수</td>
              <td className="leave-days">
                <div>
                  <span>전체일수 : </span>
                  <input type="number" className="day-input" value="0" readOnly />
                </div>
                <div>
                  <span>신청일수 : </span>
                  <input type="number" className="day-input" value="1" readOnly />
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="form-notice">
          <p>※ '휴가 사유' 작성란은 삭제되었습니다.</p>
          <p>- 경조휴가 등 휴가 사유를 반드시 알아야 하는 경우에는 [결재문서] 항목 후 기안자건에 작어주세요.</p>
          <ol>
            <li>연차의 사용은 근로기준법에 따라 전년도에 발생한 개인별 한도에 맞추어 사용함을 원칙으로 한다. 단, 최초 입사자에는 근로 기준법에 따라 발생 예정된 연차를 전용하여 월 1회 사용 할 수 있다.</li>
            <li>경조사 휴가는 행사일을 증명할 수 있는 가족 관계 증명서 또는 등본, 청첩장 등 제출</li>
            <li>공가(예비군/민방위)는 사전에 통지서, 사후에 참석증을 반드시 제출</li>
          </ol>
        </div>

        <div className="form-footer">
          <div className="attachment-section">
            <h3>파일첨부</h3>
            <div className="attachment-box">
              <div className="attachment-placeholder">
                <span>이 곳에 파일을 드래그 하세요. 또는 파일첨부</span>
              </div>
            </div>
          </div>

          <div className="related-docs">
            <h3>관련문서</h3>
            <button className="related-docs-btn">문서 검색</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VacationForm;