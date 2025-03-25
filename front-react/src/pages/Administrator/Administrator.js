import React from 'react';
import {
  Container,
  Content,
} from 'rsuite';

import Leftbar from '../../common/Leftbar';

const Administrator = () => {
  return (
      <Container height={800} className="sidebar-page">
        <Leftbar />
        <Container>
          <Content>관리자</Content>
        </Container>
      </Container>
  );
};
export default Administrator;