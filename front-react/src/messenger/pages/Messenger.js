import React from 'react';
import {
  Button,
  ButtonToolbar,
  Container,
  Content,
  IconButton,
} from 'rsuite';

import Leftbar from '../../common/pages/Leftbar';

const Messenger = () => {
  return (
    <div>
      <Container style={{ minHeight: '100vh', width: '100%' }}>
        <Leftbar />
        <div style={{display:'flex', maxHeight: '35px'}}>
          <input placeholder='이름/이메일검색'>

          </input>
          <ButtonToolbar >
            <Button style={{backgroundColor:'#BEB1E3'}}>검색</Button>
          </ButtonToolbar>
        </div>
        {/* <Container>
          <Content>Messenger
            <Content>
              
              <img src="/image/Contact.jpg" alt="Daon" style={{ width: '300px', height: 'auto' }} />
            </Content>
          </Content>
        </Container> */}
      </Container>
      <img src="/image/chat_list.jpg" alt="Daon" style={{ width: '300px', height: 'auto' }} />
    </div>
  );
};
export default Messenger;