import React from 'react';
import {
  Sidebar, Sidenav, Nav, IconButton, HStack, Stack, Button
} from 'rsuite';
import { Icon } from '@rsuite/icons';
import {
  MdDashboard, MdGroup, MdEmail, MdDescription, MdEvent,
  MdBusinessCenter, MdSupervisorAccount, MdKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight, MdAccountTree
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../common/contexts/UserContext';

const Leftbar = ({ onOpenOrgChart }) => {
  const navigate = useNavigate();
  const [expand, setExpand] = React.useState(true);
  const { user } = useUser();

  return (
    <Sidebar
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between', // ✅ 상/하단 분리 핵심
        backgroundColor: '#cecef2',
        height: '100vh',
        borderRight: 'none'
      }}
      width={expand ? 200 : 60}
      collapsible
    >

      {/* 상단 영역 - 로고 + 메뉴 */}
      <div>
        <Sidenav.Header style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
          <Brand expand={expand} />
        </Sidenav.Header>

        <Sidenav expanded={expand} appearance="subtle">
          <Sidenav.Body>
            <Nav>
              <Nav.Item icon={<Icon as={MdDashboard} />} onClick={() => navigate('/home')}>홈</Nav.Item>
              <Nav.Item icon={<Icon as={MdGroup} />} onClick={() => navigate('/attendMgt')}>근태 관리</Nav.Item>
              <Nav.Item icon={<Icon as={MdEmail} />} onClick={() => navigate('/mail')}>메일</Nav.Item>
              <Nav.Item icon={<Icon as={MdEvent} />} onClick={() => navigate('/schedule')}>일정</Nav.Item>
              <Nav.Item icon={<Icon as={MdDescription} />} onClick={() => navigate('/approve')}>전자결재</Nav.Item>

              <Nav.Item icon={<Icon as={MdBusinessCenter} />} onClick={() => navigate('/performMgt')}>인사평가</Nav.Item>

              {(user?.admin_type === 2 || user?.admin_type === 3) && (
                <Nav.Item icon={<Icon as={MdGroup} />} onClick={() => navigate('/employee')}>인사관리</Nav.Item>
              )}
              <Nav.Item icon={<Icon as={MdDescription} />} onClick={() => navigate('/board')}>게시판</Nav.Item>
              <Nav.Item icon={<Icon as={MdSupervisorAccount} />} onClick={() => navigate('/messenger/addressBook')}>주소록</Nav.Item>
              {(user?.admin_type === 2 || user?.admin_type === 4) && (
                <Nav.Item icon={<Icon as={MdSupervisorAccount} />} onClick={() => navigate('/salary')}>급여</Nav.Item>
              )}
            </Nav>
          </Sidenav.Body>
        </Sidenav>
      </div>

      {/* 하단 영역 - 조직도 버튼 + 토글 */}
      <div>
        <Stack justifyContent="center" style={{ padding: 10 }}>
          <Button
            onClick={onOpenOrgChart}
            appearance="ghost"
            size="sm"
            startIcon={<MdAccountTree />}
            style={{ color: '#000', border: '1px solid #000', width: '100%', }}
          >
            {expand && "조직도"}
          </Button>
        </Stack>

        <NavToggle expand={expand} onChange={() => setExpand(!expand)} />
      </div>
    </Sidebar>
  );
};

const NavToggle = ({ expand, onChange }) => (
  <Stack className="nav-toggle" justifyContent={expand ? 'flex-end' : 'center'} style={{ padding: 10 }}>
    <IconButton
      onClick={onChange}
      appearance="subtle"
      size="lg"
      icon={expand ? <MdKeyboardArrowLeft /> : <MdOutlineKeyboardArrowRight />}
    />
  </Stack>
);

const Brand = ({ expand }) => (
  <HStack spacing={12}>
    {expand && <img src="/daon_logo.png" alt="Daon" style={{ width: '100px', height: 'auto' }} />}
  </HStack>
);

export default Leftbar;
