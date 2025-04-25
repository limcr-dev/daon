
import {
  ButtonToolbar,
  Sidebar,
  Sidenav,
  Text,
} from 'rsuite';

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
        <Text size={35} style={{ marginTop: '20px' }}>인사 평가</Text>

        <ButtonToolbar style={{ marginTop: '10px' }}>
          {/* <IconButton icon={<AddOutlineIcon />}>메일쓰기</IconButton> */}
        </ButtonToolbar>

      </Sidenav.Header>
      <Sidenav style={{ marginTop: '20px' }}>
        <Sidenav.Body style={{ backgroundColor: '#f0f0f0' }}>
          <EvalTree />
        </Sidenav.Body>
      </Sidenav>
    </Sidebar>
  );
};
export default LeftbarDEvaluation;

