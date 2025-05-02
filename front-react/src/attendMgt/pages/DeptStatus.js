import React, { useEffect, useState } from "react";
import { Card, Col, Container, Content, DatePicker, Divider, Input, InputGroup, Row, Whisper } from "rsuite";

import { useParams } from "react-router-dom";

// 공통 js
import Leftbar from "../../common/pages/Leftbar";
import Header from "../../common/pages/Header";
import { request } from '../../common/components/helpers/axios_helper';

// css
import "../css/AttendCalendar.css";
import "../css/DeptStatus.css";
import "../css/AttendBoard.css"

// js
import AttendMgtLeftbar from "./AttendMgtLeftbar";
import { useUser } from "../../common/contexts/UserContext";
import { deptStatusInfo } from "../components/Info";
import { formatDate, getStatusText } from '../components/CommonUtil';
import { getDeptName, getPositionName } from '../../hrMgt/components/getEmployeeInfo';
import AttendPaging from "../components/AttendPaging";
import ColorLegend from "../components/ColorLegend";
import AttendUpdate from "./AttendEdit";

const DeptStatus = () => {
  // 직원 정보
  const { user } = useUser();
  const { pickDept_no } = useParams();

  // 부서별근태현황 초기값
  const [deptStatusList, setDeptStatusList] = useState([]);
  // 필터링된 부서별근태현황
  const [filteredList, setFilteredList] = useState([]);
  // 페이징처리된 부서별근태현황
  const [pageDeptStatusList, setPageDeptStatusList] = useState([]);

  // 선택한 부서에 따른 근태데이터 가져오기
  useEffect(() => {
    request("GET", "/attend/deptStatus/" + pickDept_no)
      .then((res) => {
        setDeptStatusList(res.data);
      })
      .catch((error) => {
        console.log("로그인정보를 확인해주세요", error);
      });
  }, [pickDept_no]);

  // 직원 검색
  const [keyword, setKeyword] = useState('');
  const searchPerson = (value) => {
    setKeyword(value);
  };
  // <<< 날짜 선택 시작 >>>
  // 초기 날짜 설정
  const currentDate = new Date();
  const [moveDate, setMoveDate] = useState({
    startDate: currentDate.getFullYear() + "-01-01",
    endDate: currentDate.getFullYear() + "-12-31",
  });
  // 1번 데이트피커 선택
  const startDatePick = (startDatePick) => {
    if (startDatePick != null) {
      setMoveDate(prev => ({
        ...prev,// endDate값 보존
        startDate: formatDate(startDatePick),
      }));
    }
  }
  // 2번 데이트피커 선택
  const endDatePick = (endDatePick) => {
    if (endDatePick != null) {
      setMoveDate(prev => ({
        ...prev, // startDate값 보존
        endDate: formatDate(endDatePick),
      }));
    }
  }
  useEffect(() => {
    // 날짜 필터링이 변경될 때마다 실행
    const filtered = deptStatusList.filter(
      (deptStatus) =>
        deptStatus.date >= moveDate.startDate &&
        deptStatus.date <= moveDate.endDate &&
        deptStatus.emp_name.includes(keyword)
    );
    setFilteredList(filtered);
    setPageDeptStatusList(filtered.slice(0, 10)); // 초기 1페이지 세팅
  }, [deptStatusList, moveDate, keyword]);
  // <<< 날짜 선택 끝 >>>

  // 페이지 변경 시 호출되는 함수
  const handlePageChange = (page) => {
    const startIndex = (page - 1) * 10;  // 10개씩 표시
    const endIndex = startIndex + 10;
    setPageDeptStatusList(filteredList.slice(startIndex, endIndex));  // 해당 페이지에 맞는 데이터를 잘라서 set
  };

  // 수정 모달창
  const [editModal, setEditModal] = useState(false);
  const [attendance_no, setAttendance_no] = useState();

  // 권한을 가진 직원만 수정창 오픈
  const openEditPage = (attendance_no) => {
    if (user.admin_type === 2 || user.admin_type === 3) {
      setAttendance_no(attendance_no);
      setEditModal(true);
    }
    else {
      alert("관리자만 수정할 수 있습니다.")
    }
  }
  // 수정창 닫기
  const closeModal = () => {
    setEditModal(false);
  }
  return (
    <div>
      <Container style={{ height: '1050px', width: '100%' }}>
        <Leftbar />
        <Container>
          <AttendMgtLeftbar user={user} />

          <Content style={{ marginTop: "20px" }}>
            <Header />

            <Divider style={{ margin: "0px" }} />

            <Row
              gutter={20}
              style={{
                padding: "15px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Col>
                <div style={{ display: 'flex' }}>
                  <b style={{ fontSize: "20px" }}>{getDeptName(pickDept_no)} 근태 현황</b><br /><br />
                </div>
                <p style={{ fontSize: "16px" }}>기간 선택
                  <Whisper
                    placement="right"
                    trigger="click"
                    speaker={deptStatusInfo}
                  > 💡
                  </Whisper></p>
                <div style={{ display: "flex" }}>
                  <DatePicker
                    oneTap
                    format="yyyy-MM-dd"
                    onChange={startDatePick}
                    value={new Date(moveDate.startDate)} />~
                  <DatePicker
                    oneTap
                    format="yyyy-MM-dd"
                    onChange={endDatePick}
                    value={new Date(moveDate.endDate)} />&nbsp;&nbsp;
                  <InputGroup inside style={{ width: "200px" }}>
                    <Input
                      placeholder='이름 입력'
                      value={keyword}
                      onChange={searchPerson}
                    />
                  </InputGroup>
                </div>
                <br /><br />
                <Card className="attendCard">
                  <Card.Header className="cardHeaderList">
                    <span style={{ fontWeight: '600', fontSize: '16px' }}>근태현황</span>
                  </Card.Header>
                  <table className='attend-board-table'>
                    <thead>
                      <tr>
                        <th style={{ width: "10%"}}>직원명</th>
                        <th style={{ width: "10%"}}>근무타입</th>
                        <th style={{ width: "10%"}}>부서명</th>
                        <th style={{ width: "8%"}}>직급</th>
                        <th style={{ width: "12%"}}>날짜</th>
                        <th style={{ width: "8%"}}>출근</th>
                        <th style={{ width: "8%"}}>퇴근</th>
                        <th style={{ width: "16%"}}>비고 </th>
                        <th style={{ width: "35%"}}>수정메시지 </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageDeptStatusList
                        .filter(deptStatus => deptStatus.date >= moveDate.startDate && deptStatus.date <= moveDate.endDate)
                        .map((deptStatus) => (
                          <tr key={deptStatus.attendance_no} onClick={() => openEditPage(deptStatus.attendance_no)}>
                            <td>{deptStatus.emp_name}</td>
                            <td>{deptStatus.type_name}</td>
                            <td>{deptStatus.dept_name}</td>
                            <td>{getPositionName(deptStatus.position_id)}</td>
                            <td >{deptStatus.date}</td>
                            <td style={{ color: deptStatus.late ? '#FF6B6B' : '#49A902' }}>
                              <b>{deptStatus.check_in_time || '-'}</b>
                            </td>
                            <td style={{ color: deptStatus.early_leave ? '#FFA500' : '#49A902' }} align="center">
                              <b>{deptStatus.check_out_time || '-'}</b>
                            </td>
                            <td style={{ color: deptStatus.vacation ? '#3B82F6' : deptStatus.absent ? '#D32F2F' : 'black' }} align="center">
                              {getStatusText(deptStatus)}
                            </td>
                            <td className="customText-truncate" align="center">
                              {deptStatus.message || '-'}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>

                  <div style={{ paddingLeft: "10px" }}>
                    <ColorLegend />
                  </div>
                  <div style={{ margin: 'auto' }}>
                    <AttendPaging deptStatusList={filteredList} onPageChange={handlePageChange} />
                  </div>
                </Card>
              </Col>
            </Row>
          </Content>
        </Container>
      </Container>
      <AttendUpdate open={editModal} onClose={closeModal} attendance_no={attendance_no} user={user} />
    </div>
  );
};

export default DeptStatus;
