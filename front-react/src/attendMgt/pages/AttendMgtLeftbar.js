import {
    ButtonToolbar,
    Divider,
    IconButton,
    Sidebar,
    Sidenav,
    Text,
  } from 'rsuite';
  
  import AddOutlineIcon from '@rsuite/icons/AddOutline';
  import AttendMgtTree from '../components/AttendMgtTree';

  const AttendMgtLeftbar = () => {
      return(
        <Sidebar style={{ backgroundColor: '#f0f0f0', width: '150px' }} >
          <Sidenav.Header 
          style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          flexDirection: 'column' 
          }}>
            <Text size={24} style={{ marginTop: '20px' }}>근태관리</Text>
            
            <ButtonToolbar style={{ marginTop: '10px' }}>
              <IconButton icon={<AddOutlineIcon />}>메일쓰기</IconButton>
            </ButtonToolbar>
  
          </Sidenav.Header>
          <Divider/>
          
          <Sidenav style={{ marginTop: '20px' }}>
            <Sidenav.Body style={{ backgroundColor: '#f0f0f0' }}>
              <AttendMgtTree/>
            </Sidenav.Body>
          </Sidenav>
        </Sidebar>
      );
  };
  export default AttendMgtLeftbar;