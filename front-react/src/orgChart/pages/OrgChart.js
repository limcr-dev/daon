import React from 'react';
import {
  Container,
  Content,
} from 'rsuite';

import Leftbar from '../../common/pages/Leftbar';

const OrgChart = () => {
  return (
    <div>
      <Container style={{ minHeight: '100vh', width: '100%' }}>
        <Leftbar />
        <Container>
          <Content>organization chart
            <Content>
              <img src="/image/organization_profile.png" alt="Daon" style={{ width: '800px', height: 'auto' }} />
            </Content>
          </Content>
        </Container>
      </Container>
    </div>
  );
};
export default OrgChart;