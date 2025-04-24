import React, { useState } from "react";
import { Card, Col, Container, Content, Divider, Row } from "rsuite";

import Leftbar from "../../common/pages/Leftbar";
import MyCalendar from "./MyCalendar";
import ScheduleLeftbar from "./ScheduleLeftbar";
import Header from "../../common/pages/Header";
import { useUser } from "../../common/contexts/UserContext";
import { CategoryProvider } from "../components/CategoryContext";

const ScheduleMain = () => {
  // UserContext에서 사용자 정보 가져오기
  const { user } = useUser();

  return (
    <CategoryProvider>
      <Container style={{ minHeight: "100vh", width: "100%" }}>
        <Leftbar />
        <Container>
          <ScheduleLeftbar emp_no={user.emp_no} />

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
                <Card style={{ width: "100%", margin: "auto" }}>
                  <Card.Header className="">
                    {/* 캘린더 출력 */}
                    <MyCalendar user={user} />
                  </Card.Header>
                </Card>
              </Col>
            </Row>
          </Content>
        </Container>
      </Container>
    </CategoryProvider>
  );
};
export default ScheduleMain;
