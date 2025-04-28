import {
  Divider,
  Sidebar,
  Sidenav,
  Text,
} from 'rsuite';

import SalaryMenu from '../components/SalaryMenu';

const SalaryLeftbar = () => {

  return (
    <Sidebar style={{ backgroundColor: '#f0f0f0', width: '150px' }} >
      <Sidenav.Header
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}>
        <Text size={25} weight={'bold'} style={{ marginTop: '35px' }}>급여관리</Text>
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
export default SalaryLeftbar;