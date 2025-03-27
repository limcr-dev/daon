import React from 'react';
import {
  Sidebar,
  Sidenav,
  Nav,
  IconButton,
  HStack,
  Stack,
} from 'rsuite';
import { Icon } from '@rsuite/icons';
import {
  MdDashboard,
  MdGroup,
  MdEmail,
  MdDescription,
  MdLibraryBooks,
  MdEvent,
  MdBusinessCenter,
  MdSupervisorAccount,
  MdKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const Leftbar = () => {
  const navigate = useNavigate();
  const [expand, setExpand] = React.useState(true);

  return (
    <Sidebar style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#CCCCFB' }} width={expand ? 180 : 56} collapsible>
      <Sidenav.Header style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100px', // 부모 요소의 높이를 100%로 설정
        width: '100%' // 부모 요소의 너비를 100%로 설정
      }}>
        <Brand expand={expand} />
      </Sidenav.Header>
      <Sidenav expanded={expand} appearance="subtle">
        <Sidenav.Body>
          <Nav defaultActiveKey="1">
            <Nav.Item eventKey="1" onClick={() => navigate('/home')} icon={<Icon as={MdDashboard} />}>
              홈
            </Nav.Item>
            <Nav.Item eventKey="2" onClick={() => navigate('/attendMgt')} icon={<Icon as={MdGroup} />}>
              근태 관리
            </Nav.Item>
            <Nav.Item eventKey="3" onClick={() => navigate('/mail')} icon={<Icon as={MdEmail} />}>
              메일
            </Nav.Item>
            <Nav.Item eventKey="7" onClick={() => navigate('/schedule')} icon={<Icon as={MdEvent} />}>
              일정
            </Nav.Item>
            <Nav.Item eventKey="4" onClick={() => navigate('/approve')} icon={<Icon as={MdDescription} />}>
              전자결재
            </Nav.Item>
            <Nav.Item eventKey="6" onClick={() => navigate('/performMgt')} icon={<Icon as={MdBusinessCenter} />}>
              인사평가
            </Nav.Item>
            <Nav.Item eventKey="10" onClick={() => navigate('/HRMgt')} icon={<Icon as={MdGroup} />}>
              인사관리
            </Nav.Item>
          </Nav>
        </Sidenav.Body>
        <Nav>
          <Nav.Item eventKey="10" onClick={() => navigate('/orgChart')} icon={<Icon as={MdGroup} />}>
            조직도
          </Nav.Item>
          <Nav.Item eventKey="10" onClick={() => navigate('/messenger')} icon={<Icon as={MdSupervisorAccount} />}>
            메신저
          </Nav.Item>
        </Nav>
      </Sidenav>
      <NavToggle expand={expand} onChange={() => setExpand(!expand)} />
    </Sidebar>
  );
};

const NavToggle = ({ expand, onChange }) => (
  <Stack className="nav-toggle" justifyContent={expand ? 'flex-end' : 'center'}>
    <IconButton onClick={onChange} appearance="subtle" size="lg" icon={expand ? <MdKeyboardArrowLeft /> : <MdOutlineKeyboardArrowRight />} />
  </Stack>
);

const Brand = ({ expand }) => (
  <HStack className="page-brand" spacing={12}>
    {expand && <img src="/daon_logo.png" alt="Daon" style={{ width: '100px', height: 'auto' }} />}
  </HStack>
);
export default Leftbar;
