import React from 'react';
import {
  Container,
  Content,
} from 'rsuite';

import Leftbar from '../../common/Leftbar';

const AttendanceManagement = () => {
  return (
      <Container height={800} className="sidebar-page">
        <Leftbar />
        <Container>
          <Content>근태관리</Content>
        </Container>
      </Container>
  );
};
export default AttendanceManagement;