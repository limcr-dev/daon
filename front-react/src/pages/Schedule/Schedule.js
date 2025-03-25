import React from 'react';
import {
  Container,
  Content,
} from 'rsuite';

import Leftbar from '../../common/Leftbar';

const Schedule = () => {
  return (
      <Container height={800} className="sidebar-page">
        <Leftbar />
        <Container>
          <Content>일정</Content>
        </Container>
      </Container>
  );
};
export default Schedule;