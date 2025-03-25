import React from 'react';
import {
  Container,
  Content,
} from 'rsuite';

import Leftbar from '../../common/Leftbar';

const Reservation = () => {
  return (
      <Container height={800} className="sidebar-page">
        <Leftbar />
        <Container>
          <Content>예약</Content>
        </Container>
      </Container>
  );
};
export default Reservation;