import {
  ButtonToolbar,
  IconButton,
  Sidebar,
  Sidenav,
  Text
} from 'rsuite';

import AddOutlineIcon from '@rsuite/icons/AddOutline';
import MessengerTree from '../components/MessengerTree';

const MessengerLeftbar = () => {
  const msgRun = () => {
      const url = `/messenger/messengerRun`;
      const features = 'width=500,height=600,resizable=yes,scrollbars=yes,status=no,toolbar=no,menubar=no,location=no';
      window.open(url, '_blank', features)
  }

  return (
    <Sidebar style={{ backgroundColor: '#f0f0f0', width: '150px' }} >
      <Sidenav.Header
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column'
        }}>
        <Text size={35} style={{ marginTop: '20px' }}>메신저</Text>

        <ButtonToolbar style={{ marginTop: '10px' }}>
          <IconButton icon={<AddOutlineIcon />} onClick={msgRun}>메신저 실행</IconButton>
        </ButtonToolbar>

      </Sidenav.Header>
      <Sidenav style={{ marginTop: '20px' }}>
        <Sidenav.Body style={{ backgroundColor: '#f0f0f0' }}>
          <MessengerTree />
        </Sidenav.Body>
      </Sidenav>
    </Sidebar>
  );
};
export default MessengerLeftbar;