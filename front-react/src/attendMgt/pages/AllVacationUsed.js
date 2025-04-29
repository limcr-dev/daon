import React, { useEffect, useState } from "react";
import { Card, Col, Container, Content, DatePicker, Divider, Input, InputGroup, Row, Whisper } from "rsuite";

// 공통 js
import Leftbar from "../../common/pages/Leftbar";
import Header from "../../common/pages/Header";
import { request } from '../../common/components/helpers/axios_helper';

// css
import "../css/AttendCalendar.css";
import "../css/DeptStatus.css";

// js
import AttendMgtLeftbar from "./AttendMgtLeftbar";
import { useUser } from "../../common/contexts/UserContext";
import { AllVacationUseInfo } from "../components/Info";
import { formatDate } from '../components/CommonUtil';
import AttendPaging from "../components/AttendPaging";
import { getPositionName } from '../../hrMgt/components/getEmployeeInfo';

const AllVacationUsed = () => {
  // 직원 정보
  const { user } = useUser();

  // 부서별휴가사용정보 초기값
  const [vacationList, setVacationList] = useState([]);
  // 필터링된 부서별휴가사용정보
  const [filteredList, setFilteredList] = useState([]);
  // 페이징처리된 부서별휴가사용정보
  const [pageVacationList, setPageVacationList] = useState([]);

  // 휴가사용정보 불러오기
  useEffect(() => {
    request("GET", "/attend/vacationHistory")
      .then((res) => {
        setVacationList(res.data);
      })
      .catch((error) => {
        console.log("로그인정보를 확인해주세요", error);
      });
  }, []);

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

  // 부서별연차사용정보 초기값의 생성일이 지정한 날짜안에 포함하는 데이터만 필터
  useEffect(() => {
    const filtered = vacationList.filter(
      (vacationList) =>
        vacationList.start_date >= moveDate.startDate &&
        vacationList.start_date <= moveDate.endDate &&
        vacationList.emp_name.includes(keyword)
    );
    setFilteredList(filtered);
    setPageVacationList(filtered.slice(0, 10)); // 초기 1페이지 세팅
  }, [vacationList, moveDate, keyword]);
  // <<< 날짜 선택 끝 >>>

  // 페이지 변경 시 호출되는 함수
  const handlePageChange = (page) => {
    const startIndex = (page - 1) * 10;  // 10개씩 표시
    const endIndex = startIndex + 10;
    setPageVacationList(filteredList.slice(startIndex, endIndex));  // 해당 페이지에 맞는 데이터를 잘라서 set
  };

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
                  <b style={{ fontSize: "20px" }}>전사 연차 사용내역</b><br /><br />
                </div>
                <p style={{ fontSize: "16px" }}>기간 선택
                  <Whisper
                    placement="right"
                    trigger="click"
                    speaker={AllVacationUseInfo}
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
                    <span style={{ fontWeight: '600', fontSize: '16px' }}>사용내역</span>
                  </Card.Header>
                  <table className='attend-board-table'>
                    <thead>
                      <tr>
                        <th style={{ width: "10%", textAlign: "center" }}>직원명</th>
                        <th style={{ width: "10%", textAlign: "center" }}>부서명</th>
                        <th style={{ width: "8%", textAlign: "center" }}>직급</th>
                        <th style={{ width: "10%", textAlign: "center" }}>휴가종류</th>
                        <th style={{ width: "20%", textAlign: "center" }}>연차 사용기간</th>
                        <th style={{ width: "10%", textAlign: "center" }}>사용 연차</th>
                        <th style={{ width: "35%", textAlign: "center" }}>사유 </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageVacationList
                        .map((vacation) => (
                          <tr key={vacation.doc_no} >
                            <td align="center">{vacation.emp_name}</td>
                            <td align="center">{vacation.dept_name}</td>
                            <td align="center">{getPositionName(vacation.position_id)}</td>
                            <td align="center">{vacation.vacation_type === 1 ? '연차' : vacation.vacation_type === 2 ? '경조휴가' : '병가'}</td>
                            <td align="center">{vacation.start_date} ~ {vacation.end_date}</td>
                            <td align="center">{vacation.used_days}</td>
                            <td className="customText-truncate" align="center">
                              {vacation.content || '-'}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  <div style={{ margin: 'auto' }}>
                    <AttendPaging deptStatusList={filteredList} onPageChange={handlePageChange} />
                  </div>
                </Card>
              </Col>
            </Row>
          </Content>
        </Container>
      </Container>
    </div>
  );
};

export default AllVacationUsed;
