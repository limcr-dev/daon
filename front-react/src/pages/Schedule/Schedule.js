import React from 'react';
import {
  Container,
  Content,
} from 'rsuite';

import Leftbar from '../../common/Leftbar';

const Schedule = () => {
  return (
      <Container style={{ minHeight: '100vh', width: '100%'}}>
        <Leftbar />
        <Container>
          <Content><img src="/image/monthgrid.jpg" alt="Daon" style={{ width: '1500px', height: 'auto' }} /> </Content>
        </Container>
      </Container>
  );
};
export default Schedule;