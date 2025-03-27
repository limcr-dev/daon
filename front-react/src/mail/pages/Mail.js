import React from 'react';
import {
  Container,
  Content,
} from 'rsuite';

import Leftbar from '../../common/pages/Leftbar';
import Header from '../../common/pages/Header';
import MailLeftbar from './MailLeftbar';
const Mail = () => {
  return (
    <Container style={{ minHeight: '100vh', width: '100%' }}>
      <Leftbar />
      <Container>
        <MailLeftbar />

        <Content>
          <Header />
          <img src="/image/email_main.jpg" alt="Daon" style={{ width: '1500px', height: 'auto' }} />
        </Content>

      </Container>
    
    </Container>
  );
};
export default Mail;