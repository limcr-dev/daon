import React from 'react';
import {
  Container,
  Content,
} from 'rsuite';

import Leftbar from '../../common/Leftbar';

const ReferenceRoom = () => {
  return (
      <Container style={{ minHeight: '100vh', width: '100%'}}>
        <Leftbar />
        <Container>
          <Content>자료실</Content>
        </Container>
      </Container>
  );
};
export default ReferenceRoom;