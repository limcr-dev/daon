import React from 'react';
import {
  Container,
  Content,
} from 'rsuite';

import Leftbar from '../../common/Leftbar';

const ElectronicPayment = () => {
  return (
      <Container className="sidebar-page">
        <Leftbar />
        <Container>
          <Content>전자결재</Content>
        </Container>
      </Container>
  );
};
export default ElectronicPayment;