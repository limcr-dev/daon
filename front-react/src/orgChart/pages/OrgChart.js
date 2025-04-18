import React from 'react';
import {
  Container,
  Content,
} from 'rsuite';

import Leftbar from '../../common/pages/Leftbar';
import Treea from './Treea';

const OrgChart = () => {
  return (
    <div>
      <Container style={{ minHeight: '100vh', width: '100%' }}>
        <Leftbar />
        <Container>
          <Content>organization chart
            <Content>
              <Treea />
            </Content>
          </Content>
        </Container>
      </Container>
    </div>
  );
};
export default OrgChart;