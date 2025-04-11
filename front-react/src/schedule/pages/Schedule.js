import React, { useState } from 'react';
import {
  Card,
  Col,
  Container,
  Content,
  Divider,
  Row,
} from 'rsuite';

import Leftbar from '../../common/pages/Leftbar';
import MyCalendar from './MyCalendar';
import ScheduleLeftbar from './ScheduleLeftbar';
import Header from '../../common/pages/Header';

const Schedule = () => {
  const [employees, setEmployees] = useState({
    emp_no: '1001'
  });

  return (
    <Container style={{ minHeight: '100vh', width: '100%' }}>
      <Leftbar />
      <Container>

        <ScheduleLeftbar emp_no={employees.emp_no} />

        <Content style={{ marginTop: '20px' }}>
          <Header />
          <Divider style={{ margin: "0px" }} />
          <Row gutter={20} style={{ padding: '15px', display: 'flex', flexDirection: 'column' }}>
            <Col>
              <Card style={{maxWidth:"1400px", margin:"auto"}} >
                <Card.Header className="">
                  <MyCalendar />
                </Card.Header>
              </Card>
            </Col>
          </Row>
        </Content>
      </Container>
    </Container>
  );
};
export default Schedule;