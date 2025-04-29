
import { Button, Divider, Sidebar, Sidenav,Text} from 'rsuite';
import { useState } from 'react';
import EvalTree from './EvalTree';

const LeftbarDEvaluation = () => {

  return (
    <Sidebar style={{ backgroundColor: '#f0f0f0', width: '150px' }} >
      <Sidenav.Header
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column'
        }}>
          {/* leftmenu - title */}
        <Text size={25} weight={'bold'} style={{ marginTop: '35px' }}>인사평가</Text>

        {/* leftmenu - button */}
        {/* <Button style={{ marginTop: '15px', backgroundColor: '#CECEF2' }}> */}
          <p style={{ margin: '20px' }}></p>
         
        {/* </Button> */}

        </Sidenav.Header>
        <Divider />

      <Sidenav style={{ marginTop: '20px' }}>
        <Sidenav.Body style={{ backgroundColor: '#f0f0f0' }}>
          <EvalTree />
        </Sidenav.Body>
      </Sidenav>
    </Sidebar>
  );
};
export default LeftbarDEvaluation;

