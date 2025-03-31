import {
  Divider,
  Sidebar,
  Sidenav,
  Text,
} from 'rsuite';
import BoardMenu from '../components/BoardMenu';


const BoardLeftbar = () => {
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
        <Text size={25} weight={'bold'} style={{ marginTop: '35px' }}>게시판</Text>
      </Sidenav.Header>
      <Divider />
      <Sidenav style={{ marginTop: '20px' }}>
        <Sidenav.Body style={{ backgroundColor: '#f0f0f0' }}>
          <BoardMenu />
        </Sidenav.Body>
      </Sidenav>
    </Sidebar>
  );
};
export default BoardLeftbar;