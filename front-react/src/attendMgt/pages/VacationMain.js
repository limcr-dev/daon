import React, { useEffect, useRef, useState } from 'react';
import {
  Card,
  Col,
  Container,
  Content,
  Divider,
  Popover,
  Row,
  Whisper,
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

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Button from 'react-bootstrap/Button';
import VacationFooter from './VacationFooter';
import MoveDateHeader from './MoveDateHeader';

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

  // 초기 날짜 설정
  const [moveDate, setMoveDate] = useState({
    year: currentDate.getFullYear(),
    month: currentDate.getMonth() + 1
  });
  // 날짜 이동 버튼 끝
  // const renderTooltip = (props) => (
  //   <Tooltip id="button-tooltip" {...props} >
  //     1년 미만 근속자<br />
  //     - 입사 후 1개월 근무할 때마다 1일씩 지급<br />

  //     - 최대 1년간 11일 발생<br />

  //     - 단, 1년 이상 근속 시 기존 지급분(최대 11일)은 차감됨<br />

  //     1년 이상 근속자<br />
  //     - 1년 근속 시 15일 지급<br />

  //     - 이후 2년마다 1일 추가 지급, 최대 25일까지 가능<br />

  //     - 예: 3년차 16일, 5년차 17일, … 21년차 25일<br />

  //     - 1년간 소정 근로일의 80% 이상 출근해야 발생<br />
  //   </Tooltip>

  // );
  const vacationInfo = (
    <Popover style={{ minWidth: "300px", whiteSpace: "pre-line", padding: "10px" }} arrow={false}>
      <div>
        <b>1년 미만 근속자</b><br />
        - 입사 후 1개월 근무할 때마다 1일씩 지급<br />
        - 최대 1년간 11일 발생<br />
        - 단, 1년 이상 근속 시 기존 지급분(최대 11일)은 차감됨<br /><br />

        <b>1년 이상 근속자</b><br />
        - 1년 근속 시 15일 지급<br />
        - 이후 2년마다 1일 추가 지급, 최대 25일까지 가능<br />
        - 예: 3년차 16일, 5년차 17일, … 21년차 25일<br />
        - 1년간 소정 근로일의 80% 이상 출근해야 발생
      </div>
    </Popover>
  )
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
                {/* 상단 날짜 이동 헤더  */}
                <MoveDateHeader currentDate={currentDate} setCurrentDate={setCurrentDate} moveDate={moveDate} setMoveDate={setMoveDate} />

                {/* 상단 연차 내역 시작 */}
                <Card style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                  <Card.Header className="headerContents" style={{ minWidth: "800px", display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '30px', paddingBottom: '30px', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                    <div>발생 연차
                      <Whisper
                        placement="right"
                        trigger="click"
                        speaker={vacationInfo}
                      > 💡
                      </Whisper>
                      <p>0</p>
                    </div>
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
                  <Card style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                    <Card.Header style={{ justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#f5f5f5', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                      <span style={{ fontWeight: '600', fontSize: '16px' }}>사용 내역</span>
                    </Card.Header>
                    <table className='board-table'>
                      <tr>
                        <th>휴가종류</th>
                        <th>연차 사용기간</th>
                        <th>사용 연차</th>
                        <th>사유</th>
                      </tr>
                    </table>
                  </Card>
                </div>
                {/* 연차 사용 내역 끝 */}
                <br />
                {/* 생성 내역 시작 */}
                <VacationFooter emp_no={employees.emp_no} year={moveDate.year} month={moveDate.month} />
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