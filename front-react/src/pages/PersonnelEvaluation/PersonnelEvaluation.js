import React from 'react';
import {
  Container,
  Content,
} from 'rsuite';

import Leftbar from '../../common/Leftbar';

const PersonnelEvaluation = () => {
  return (
      <Container height={800} className="sidebar-page">
        <Leftbar />
        <Container>
          <Content>인사평가</Content>
        </Container>
      </Container>
  );
};
export default PersonnelEvaluation;