import React from 'react';
import {
  Sidebar, Sidenav, Nav, IconButton, HStack, Stack, Button
} from 'rsuite';
import { Icon } from '@rsuite/icons';
import {
  MdGroup, MdContactPage, MdCreate, MdDescription, MdPayments,
  MdBusinessCenter, MdCalendarMonth, MdKeyboardArrowLeft, MdHome,
  MdOutlineKeyboardArrowRight, MdAssignment, MdAccountTree
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../common/contexts/UserContext';

const Leftbar = ({ onOpenOrgChart }) => {
  const navigate = useNavigate();
  const [expand, setExpand] = React.useState(true);
  const { user } = useUser();

  return (
    // ✅ 바깥에 sticky div 추가
    <div style={{
      position: 'sticky',
      top: 0,
      height: '100vh',
      zIndex: 90, // Header보다 낮게
    }}>
      <Sidebar
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between', // 상하단 분리
          backgroundColor: '#cecef2',
          minHeight: '100%',
          borderRight: 'none',
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
                <Nav.Item icon={<Icon as={MdHome} />} onClick={() => navigate('/home')}>홈</Nav.Item>
                <Nav.Item icon={<Icon as={MdBusinessCenter} />} onClick={() => navigate('/attendMgt')}>근태 관리</Nav.Item>
                <Nav.Item icon={<Icon as={MdCalendarMonth} />} onClick={() => navigate('/schedule')}>일정</Nav.Item>
                <Nav.Item icon={<Icon as={MdAssignment} />} onClick={() => navigate('/approveMgt')}>전자결재</Nav.Item>
                <Nav.Item icon={<Icon as={MdCreate} />} onClick={() => navigate('/performMgt')}>인사평가</Nav.Item>

                {(user?.admin_type === 2 || user?.admin_type === 3) && (
                  <Nav.Item icon={<Icon as={MdGroup} />} onClick={() => navigate('/employee')}>인사관리</Nav.Item>
                )}
                <Nav.Item icon={<Icon as={MdDescription} />} onClick={() => navigate('/boardMgt')}>게시판</Nav.Item>
                <Nav.Item icon={<Icon as={MdContactPage} />} onClick={() => navigate('/messengerMgt/addressBook')}>주소록</Nav.Item>
                {(user?.admin_type === 2 || user?.admin_type === 4) && (
                  <Nav.Item icon={<Icon as={MdPayments} />} onClick={() => navigate('/salary')}>급여</Nav.Item>
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
              style={{ color: '#000', border: '1px solid #000', width: '100%' }}
            >
              {expand && "조직도"}
            </Button>
          </Stack>

          <NavToggle expand={expand} onChange={() => setExpand(!expand)} />
        </div>
      </Sidebar>
    </div>
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
