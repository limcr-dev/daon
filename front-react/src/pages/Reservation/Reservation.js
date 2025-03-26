import React from 'react';
import {
  Container,
  Content,
} from 'rsuite';

import Leftbar from '../../common/Leftbar';

const Reservation = () => {
  return (
      <Container style={{ minHeight: '100vh', width: '100%'}}>
        <Leftbar />
        <Container>
          <Content>예약</Content>
        </Container>
      </Container>
  );
};
export default Reservation;