import React from 'react';
import {
  Container,
  Content,
} from 'rsuite';

import Leftbar from '../../common/pages/Leftbar';

const ApproveList = () => {
  return (
      <Container style={{ minHeight: '100vh', width: '100%'}}>
        <Leftbar />
        <Container>
          <Content><img src="/image/approve_main.jpg" alt="Daon" style={{ width: '1500px', height: 'auto' }} /> </Content>
        </Container>
      </Container>
  );
};
export default ApproveList;