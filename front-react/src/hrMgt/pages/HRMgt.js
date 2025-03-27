import React from 'react';
import {
  Container,
  Content,
} from 'rsuite';

import Leftbar from '../../common/pages/Leftbar';

const HRMgt = () => {
  return (
      <Container style={{ minHeight: '100vh', width: '100%'}}>
        <Leftbar />
        <Container>
        <Content><img src="/image/evaluation_main.jpg" alt="Daon" style={{ width: '1500px', height: 'auto' }} /> </Content>
        </Container>
      </Container>
  );
};
export default HRMgt;