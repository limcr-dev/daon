import {
  Button,
  Divider,
  Sidebar,
  Sidenav,
  Text,
} from 'rsuite';

import SalaryMenu from '../../components/SalaryMenu';
import { Icon } from '@rsuite/icons';
import { MdDescription } from 'react-icons/md';

const DeductionLeftbar = ({onRegisterClick}) => {

  return (
    <Sidebar style={{ backgroundColor: '#f0f0f0', width: '150px' }} >
      <Sidenav.Header
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}>
        {/* leftmenu - title */}
        <Text size={25} weight={'bold'} style={{ marginTop: '35px' }}>급여관리</Text>

        {/* leftmenu - button */}
        <Button style={{ marginTop: '15px', backgroundColor: '#CECEF2' }} onClick={onRegisterClick}>  
          <Icon as={MdDescription} /> 
          <p style={{ margin: '5px' }}>공제 등록</p>
        </Button>
        
      </Sidenav.Header>
      <Divider />
      <Sidenav style={{ marginTop: '20px' }}>
        <Sidenav.Body style={{ backgroundColor: '#f0f0f0' }}>
          <SalaryMenu />
        </Sidenav.Body>
      </Sidenav>
    </Sidebar>
  );
};
export default DeductionLeftbar;