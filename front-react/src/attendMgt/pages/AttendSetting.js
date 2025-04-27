import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Container,
  Content,
  Divider,
  Modal,
  Row,
} from "rsuite";

// 공통 js
import Leftbar from "../../common/pages/Leftbar";
import Header from "../../common/pages/Header";
import { request } from "../../common/components/helpers/axios_helper";

// css
import "../css/AttendCalendar.css";
import "../css/DeptStatus.css";

// js
import AttendMgtLeftbar from "./AttendMgtLeftbar";
import { useUser } from "../../common/contexts/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import WorkScheduleEdit from "../components/WorkScheduleEdit";
import WorkScheduleAdd from "../components/WorkScheduleAdd";
import AttendSettingRight from "./AttendSettingRight";
import AttendSettingLeft from "./AttendSettingLeft";

const AttendSetting = () => {
  // 직원 정보
  const { user } = useUser();

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
                <div style={{ display: "flex" }}>
                  <b style={{ fontSize: "20px" }}>전사 근태 설정</b>
                  <br /> <br />
                </div>

                <div style={{ display: "flex", gap: 30 }}>
                  <div style={{ width: "33%" , height:"1000px"}}>
                    <AttendSettingLeft user={user} />
                  </div>
                  {/* 우측카드 */}
                  <div style={{ width: "66%" }}>
                    <AttendSettingRight user={user} />
                  </div>
                </div>
              </Col>
            </Row>
          </Content>
        </Container>
      </Container>
    </div>
  );
};

export default AttendSetting;
