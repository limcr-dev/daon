import React from 'react';
import {
  Container,
  Content,
} from 'rsuite';

import Leftbar from '../../common/Leftbar';

const Administrator = () => {
  return (
      <Container style={{ minHeight: '100vh', width: '100%'}}>
        <Leftbar />
        <Container>
          <Content>관리자</Content>
          <Content></Content>
        </Container>
      </Container>
  );
};
export default Administrator;