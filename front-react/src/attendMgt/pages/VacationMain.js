import React, { useEffect, useRef, useState } from 'react';
import {
  Card,
  Col,
  Container,
  Content,
  Divider,
  Row,
} from 'rsuite';

import Leftbar from '../../common/pages/Leftbar';
import AttendMgtLeftbar from './AttendMgtLeftbar';
import Header from '../../common/pages/Header';

// data

// css
import "../css/AttendCalendar.css";
import "../css/AttendMgtMain.css";

// icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import FooterAttent from './AttendFooter';

const VacationMain = () => {

  const [employees, setEmployees] = useState({
    emp_no: '1002',
    work_type_no: ''
  });

  // 근무 유형 정보
  const [work_schedules, setWork_schedules] = useState({
    type_name: '',
    start_time: '',
    end_time: '',
  });

  // 날짜 이동 버튼 시작
  const [currentDate, setCurrentDate] = useState(new Date());
  const calendarRef = useRef();
  const dayRef = useRef();

  const [moveDate, setMoveDate] = useState({
    // 초기 날짜 설정
    year: currentDate.getFullYear(),
    month: currentDate.getMonth() + 1
  });

  // 버튼 클릭 시
  const changeDate = (plusminus) => {

    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + plusminus
    );
    setMoveDate({ year: newDate.getFullYear(), month: newDate.getMonth() + 1 })
    setCurrentDate(newDate);
  };

  // currentDate 변경 시

  // 날짜 이동 버튼 끝
  // 상단 날짜 표기방식
  const monthDisplay = currentDate.toLocaleString('default', {
    year: 'numeric',
    month: 'long'
  });
  return (
    <div>
      <Container style={{ minHeight: '100vh', width: '100%' }}>
        <Leftbar />
        <Container>

          <AttendMgtLeftbar emp_no={employees.emp_no} work_schedules={work_schedules} />

          <Content style={{ marginTop: '20px' }}>
            <Header />

            <Divider style={{ margin: "0px" }} />

            <Row gutter={20} style={{ padding: '15px', display: 'flex', flexDirection: 'column' }}>

              <Col>
                {/* 상단 날짜 이동 버튼 시작 */}
                <div style={{ display: "flex" }}>
                  <b style={{ fontSize: "20px" }}>내 연차 내역</b>

                  <div style={{ display: "flex", position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
                    <button onClick={() => changeDate(-1)}><FontAwesomeIcon icon={faChevronLeft} /></button>
                    <h5>{monthDisplay}</h5>
                    <button onClick={() => changeDate(1)}><FontAwesomeIcon icon={faChevronRight} /></button>
                  </div>
                  <br /> <br /><br />
                </div>
                
                {/* 상단 날짜 이동 버튼 끝 */}

                {/* 상단 연차 내역 시작 */}
                <Card style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                  <Card.Header className="headerContents" style={{ minWidth: "800px", display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '30px', paddingBottom: '30px', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                    <div>발생 연차<br /> <p>17</p></div>
                    <div>발생 월차<br /> <p>0</p></div>
                    <div>이월 연차<br /> <p>0</p></div>
                    <div>총 연차<br /> <p>17</p></div>
                    <div>사용 연차<br /> <p>3</p></div>
                    <div>잔여 연차<br /> <p>14</p></div>
                  </Card.Header>
                </Card>
                <br />
                {/* 상단 연차 내역 끝 */}

                {/* 연차 사용 내역 시작 */}
                <div className='attendCalendar' style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                  <Card style={{ borderRadius: '15px',boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                    <Card.Header className="leftCalendar" style={{ paddingBottom: "16px", minWidth: "100px",alignItems: 'center', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                      <div style={{ width: '100%' }}>
                        사용 내역
                      </div>
                    </Card.Header>
                  </Card>
                </div>
                {/* 연차 사용 내역 끝 */}
                <br />
                {/* 생성 내역 시작 */}
                <FooterAttent emp_no={employees.emp_no} year={moveDate.year} month={moveDate.month} />
                {/* 생성 내역 끝 */}
              </Col>
            </Row>
          </Content>
        </Container>
      </Container >
    </div>
  );
};

export default VacationMain;