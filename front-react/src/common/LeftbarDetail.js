import {
  ButtonToolbar,
  IconButton,
  Sidebar,
  Sidenav,
  Text,
} from 'rsuite';

import AddOutlineIcon from '@rsuite/icons/AddOutline';
import MailTree from '../components/LeftbarDetail/MailTree';

const LeftbarDetail = () => {
    return(
      <Sidebar style={{ backgroundColor: '#f0f0f0', width: '150px' }} >
        <Sidenav.Header 
        style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        flexDirection: 'column' 
        }}>
          <Text size={35} style={{ marginTop: '20px' }}>메일함</Text>
          
          <ButtonToolbar style={{ marginTop: '10px' }}>
            <IconButton icon={<AddOutlineIcon />}>메일쓰기</IconButton>
          </ButtonToolbar>

        </Sidenav.Header>
        <Sidenav style={{ marginTop: '20px' }}>
          <Sidenav.Body style={{ backgroundColor: '#f0f0f0' }}>
            <MailTree/>
          </Sidenav.Body>
        </Sidenav>
      </Sidebar>
    );
};
export default LeftbarDetail;