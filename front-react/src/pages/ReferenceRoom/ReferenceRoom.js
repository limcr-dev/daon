import React from 'react';
import {
  Container,
  Content,
} from 'rsuite';

import Leftbar from '../../common/Leftbar';

const ReferenceRoom = () => {
  return (
      <Container height={800} className="sidebar-page">
        <Leftbar />
        <Container>
          <Content>자료실</Content>
        </Container>
      </Container>
  );
};
export default ReferenceRoom;