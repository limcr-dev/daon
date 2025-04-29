import React, { useEffect, useState } from "react";
import { Card, Col, Container, Content, Divider, Row } from "rsuite";

import { useParams } from "react-router-dom";

// 공통 js
import Leftbar from "../../common/pages/Leftbar";
import Header from "../../common/pages/Header";

// css
import "../css/AttendCalendar.css";
import "../css/DeptStatus.css";

// icon

// js
import AttendMgtLeftbar from "./AttendMgtLeftbar";
import { useUser } from "../../common/contexts/UserContext";
import KibanaDashboard from "../components/KibanaDashboard";
import MoveDateHeader from "./MoveDateHeader";
import { request } from "../../common/components/helpers/axios_helper";
import { getDeptName } from "../../hrMgt/components/getEmployeeInfo";

const DeptStats = () => {
  // 직원 정보
  const { user } = useUser();
  const { pickDept_no } = useParams();

  // 날짜 이동 버튼 시작
  const [currentDate, setCurrentDate] = useState(new Date());

  // 초기 날짜 설정
  const [moveDate, setMoveDate] = useState({
    year: currentDate.getFullYear(),
    month: currentDate.getMonth() + 1
  });
  // 날짜 이동 버튼 끝

  // 출퇴근 통계 불러올 변수
  const [attendance, setAttendance] = useState({
    date: '',
    normal: '',
    check_in_time: '',
    check_out_time: '',
    late: '',
    early_leave: '',
    absent: ''
  });
  // 출퇴근 통계 불러오기
  useEffect(() => {
    request("GET", "/attend/deptAttendCnt/" + pickDept_no + "/" + moveDate.year + "/" + moveDate.month)
      .then((res) => {
        setAttendance(res.data);
      })
      .catch((error) => {
        console.log('로그인정보를 확인해주세요', error);
      })
  }, [moveDate,pickDept_no])

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
                <MoveDateHeader
                  currentDate={currentDate}
                  setCurrentDate={setCurrentDate}
                  setMoveDate={setMoveDate}
                  pageName={getDeptName(pickDept_no)+' 근태 통계'} />

                <Card className="attendCard" >
                  <Card.Header className="cardHeaderContents">
                    <div>정상근무<br /> <p>{attendance.normal}</p></div>
                    <div>지각<br /> <p>{attendance.late}</p></div>
                    <div>조퇴<br /> <p>{attendance.early_leave}</p></div>
                    <div>결근<br /> <p>{attendance.absent}</p></div>
                    <div>연차/휴가 사용 횟수<br /> <p>{attendance.vacation}</p></div>
                  </Card.Header>
                </Card>
                <div style={{ width: "auto", border: 'none' }}>

                </div>
                <br></br>
                {/* ~~부 통계로 들어오면 부서의 통계 + 팀별 통계그래프 출력
                ~~팀 통계로 들어오면 팀의 통계 + 직원별 통계그래프 출력 */}
                <KibanaDashboard pickDept_no={pickDept_no} />
              </Col>
            </Row>
          </Content>
        </Container>
      </Container>
    </div>
  );
};

export default DeptStats;
