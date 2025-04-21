import React, { useEffect, useState } from 'react';
import {
  Card,
  Col,
  Container,
  Content,
  DatePicker,
  Divider,
  Popover,
  Row,
  Whisper,
} from 'rsuite';

// 공통 js
import Leftbar from '../../common/pages/Leftbar';
import Header from '../../common/pages/Header';

// css
import "../css/AttendCalendar.css";
import "../css/AttendCommon.css"

// js
import AttendMgtLeftbar from './AttendMgtLeftbar';
import VacationFooter from './VacationFooter';
import { useUser } from '../../common/contexts/UserContext';
import VacationHistory from './VacationHistory';
import { getCurrentVacationCycle, getExpireDate, getUsedVacation } from '../components/VacationUtil';
import { formatDate } from '../components/CommonUtil';

const VacationMain = () => {

  // 직원 정보
  const { user } = useUser();

  const [employees, setEmployees] = useState({});

  const [vacation_occurList, setVacation_occurList] = useState([]);

  const [vacationHistoryList, setVacationHistoryList] = useState([]);

  // 가장 빠른 만료 예정일, 잔여 연차, 총 연차 불러오기
  const { maxExpireDate, remainVacation, createVacation } = getExpireDate(vacation_occurList);

  // 입사일 기준 이번 주기 시작,끝 날짜 불러오기
  const {start, end } = getCurrentVacationCycle(employees.hire_date);

  // 사용연차 수 불러오기
  const { useVacation } = getUsedVacation(vacationHistoryList, start, end);

  useEffect(() => {
    // 입사일 가져오기
    fetch("http://localhost:8081/api/getEmpInfo/" + user.emp_no)
      .then((res) => res.json())
      .then((res) => {
        setEmployees(res);

        // 휴가정보 불러오기
        fetch("http://localhost:8081/attend/vacation_log/" + user.emp_no, {
          method: "GET"
        })
          .then((res) => res.json())
          .then((res) => {
            setVacation_occurList(res);
          })
        // 휴가 사용기록 불러오기
        fetch("http://localhost:8081/attend/vacationHistory/" + user.emp_no, {
          method: "GET"
        })
          .then((res) => res.json())
          .then((res) => {
            setVacationHistoryList(res);
          })
      })
      .catch((error) => {
        console.log('로그인정보를 확인해주세요', error);
      })
  }, [user.emp_no])

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
  // <<< 날짜 선택 끝 >>>

  // 연차 목록

  // 발생 연차 설명
  const vacationInfo = (
    <Popover style={{ whiteSpace: "pre-line", padding: "10px" }} arrow={false}>
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
  const vacationInfo2 = (
    <Popover style={{ whiteSpace: "pre-line", padding: "10px" }} arrow={false}>
      <div>
        <b>회차 단위 연차 이력 관리</b><br />
        - 연차는 '연도 기준'이 아닌 '입사일 기준 1년 단위'로 관리됩니다.<br />
        - 입사일을 기준으로 1년마다 새로운 회차가 시작됩니다.<br /><br />
        - 예: 입사일이 2023.12.20인 경우 → 1회차: 2023.12.20 ~ 2024.12.19<br />
        - 회차별로 연차 발생·사용·잔여·만료 이력을 구분해 확인할 수 있습니다.
      </div>
    </Popover>
  )
  const vacationInfo3 = (
    <Popover style={{ minWidth: "250px", whiteSpace: "pre-line", padding: "10px" }} arrow={false} >
      <div>가장 빠르게 만료되는 연차의 만료일입니다.</div>
    </Popover>
  )
  const vacationInfo4 = (
    <Popover style={{ whiteSpace: "pre-line", padding: "10px" }} arrow={false}>
      <div>사용,생성 날짜기준으로 검색 됩니다.</div>
    </Popover>
  )
  return (
    <div>
      <Container style={{ minHeight: '100vh', width: '100%' }}>
        <Leftbar />
        <Container>

          <AttendMgtLeftbar user={user} />

          <Content style={{ marginTop: '20px' }}>
            <Header />

            <Divider style={{ margin: "0px" }} />

            <Row gutter={20} style={{ padding: '15px', display: 'flex', flexDirection: 'column' }}>
              <Col>
                {/* 상단 날짜 */}
                <div style={{ display: 'flex' }}>
                  <b style={{ fontSize: "20px" }}>내 연차 내역</b>
                  <div className='headCenter'>
                    <h5>
                      {start} ~ {end}
                      <Whisper
                        placement="right"
                        trigger="click"
                        speaker={vacationInfo2}
                      > 💡
                      </Whisper>
                    </h5>
                  </div><br/><br/>
                </div>

                {/* 상단 연차 내역 시작 */}
                <Card className="attendCard" >
                  <Card.Header className="cardHeaderContents" >
                    <div>발생 연차
                      <Whisper
                        placement="right"
                        trigger="click"
                        speaker={vacationInfo}
                      > 💡
                      </Whisper>
                      <p>{createVacation}</p>
                    </div>
                    <div>사용 연차<br /> <p>{useVacation}</p></div>
                    {/* 결재승인 시 사용가능연차 업데이트 완료 후{remainVacation}로 바꿀 예정 */}
                    <div>잔여 연차<br /> <p>{createVacation - useVacation}</p></div> 
                    <div>만료 예정
                      <Whisper
                        placement="right"
                        trigger="click"
                        speaker={vacationInfo3}
                      > 💡
                      </Whisper>
                      {maxExpireDate && <p>{maxExpireDate} </p>}
                    </div>
                    <div>입사일<br /> <p>{employees.hire_date}</p></div>
                  </Card.Header>
                </Card>
                <br />
                {/* 상단 연차 내역 끝 */}

                {/* 연차 사용,생성 내역 시작 */}
                <div style={{ display: "flex" }}> </div>
                <p style={{ fontSize: "16px" }}>기간 선택 (사용 / 생성 내역)
                  <Whisper
                    placement="right"
                    trigger="click"
                    speaker={vacationInfo4}
                  > 💡
                  </Whisper></p>
                <DatePicker oneTap format="yyyy-MM-dd" onChange={startDatePick} value={new Date(moveDate.startDate)} />~
                <DatePicker oneTap format="yyyy-MM-dd" onChange={endDatePick} value={new Date(moveDate.endDate)} />
                <br></br><br></br>
                <VacationHistory moveDate={moveDate} vacationHistoryList={vacationHistoryList} />

                <br />
                {/* 생성 내역 */}
                <VacationFooter moveDate={moveDate} vacation_occurList={vacation_occurList} />
                {/* 연차 사용,생성 내역 끝 */}
              </Col>
            </Row>
          </Content>
        </Container>
      </Container >
    </div >
  );
};

export default VacationMain;