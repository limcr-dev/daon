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

const DeptStats = () => {
  // 직원 정보
  const { user } = useUser();
  const { pickDept_no } = useParams();
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
              
              </div>
                <KibanaDashboard pickDept_no={pickDept_no}/>
              </Col>
            </Row>
          </Content>
        </Container>
      </Container>
    </div>
  );
};

export default DeptStats;
