import React from 'react';
import {
  Container,
  Content,
} from 'rsuite';

import Leftbar from '../../common/Leftbar';

const Messenger = () => {
  return (
    <div>
      <Container style={{ minHeight: '100vh', width: '100%' }}>
        <Leftbar />
        <Container>
          <Content>Messenger
            <Content>
              <img src="/image/chat_list.jpg" alt="Daon" style={{ width: '300px', height: 'auto' }} />
              <img src="/image/Contact.jpg" alt="Daon" style={{ width: '300px', height: 'auto' }} />
              <img src="/image/chat_list.jpg" alt="Daon" style={{ width: '300px', height: 'auto' }} />
            </Content>
          </Content>
        </Container>
      </Container>
    </div>
  );
};
export default Messenger;