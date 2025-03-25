import React from 'react';
import {
  Container,
  Content,
} from 'rsuite';

import Leftbar from '../../common/Leftbar';
import LeftbarDetail from '../../common/LeftbarDetail';
import Header from '../../common/Header';

const Mail = () => {
  return (
      <Container style={{ minHeight: '100vh', width: '100%'}}>
        <Leftbar />
        <Container>
          <LeftbarDetail/>
          
          <Content><Header/></Content>
        </Container>
      </Container>
  );
};
export default Mail;