import React, { useEffect, useRef, useState } from "react";
import { Col, Container, Content, Divider, Row } from "rsuite";

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

const DeptStatus = () => {
  // 직원 정보
  const { user } = useUser();
  const { dept_no } = useParams();
  const year = 2025;
  const month = 4;

  const [deptStats, setDeptStats] = useState([]);

  useEffect(() => {
    fetch(
      "http://localhost:8081/attend/deptStats/" +
        user.dept_no +
        "/" +
        year +
        "/" +
        month,
      {
        method: "GET",
      }
    )
      .then((res) => res.json())
      .then((res) => {
        // moveDate 값이 변경될때만 set (날짜 이동 버튼 클릭 시에만)
        setDeptStats(res);
      })
      .catch((error) => {
        console.log("로그인정보를 확인해주세요", error);
      });
  }, [user.dept_no]);

  return (
    <div>
      <Container style={{ minHeight: "100vh", width: "100%" }}>
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
              <div style={{width:"auto", border: 'none'}}>
              {/* <iframe src="http://localhost:5601/goto/cdc9ce9909e23fdfe4a685cf06107bb0" height="1000" width="1000"></iframe> */}
              
              </div>
              {/* <iframe title="AttendanceDashboardEmbed"src="http://localhost:5601/goto/56052dfca14308af28aea8c86ab6c3c2" height="500" width="1500" style={{ border: 'none' }}></iframe> */}
                <KibanaDashboard />
              </Col>
            </Row>
          </Content>
        </Container>
      </Container>
    </div>
  );
};

export default DeptStatus;
