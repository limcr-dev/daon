import React from 'react';
import {
  Container,
  Content,
} from 'rsuite';

import Leftbar from '../../common/pages/Leftbar';
import MyCalendar from './MyCalendar';

const Schedule = () => {
  return (
      <Container style={{ minHeight: '100vh', width: '100%'}}>
        <Leftbar />
        <Container>
          <Content>
          <MyCalendar/>
             </Content>
        </Container>
      </Container>
  );
};
export default Schedule;