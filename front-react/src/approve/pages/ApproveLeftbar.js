import {
  Button,
  Divider,
  Modal,
  Sidebar,
  Sidenav,
  Text,
} from 'rsuite';

import ApproveMenu from '../components/ApproveMenu';
import { Icon } from '@rsuite/icons';
import { MdDescription } from 'react-icons/md';
import { useState } from 'react';
import SelectForm from './SelectForm';

const ApproveLeftbar = () => {

  const [open, setOpen] = useState(false);

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
        <Text size={25} weight={'bold'} style={{ marginTop: '35px' }}>전자결재</Text>

        {/* leftmenu - button */}
        <Button style={{ marginTop: '15px', backgroundColor: '#CECEF2' }} onClick={() => setOpen(true)}>  
          <Icon as={MdDescription} /> <p style={{ margin: '5px' }}>새 결재 진행</p>
        </Button>
        

      </Sidenav.Header>
      <Divider />
      <Sidenav style={{ marginTop: '20px' }}>
        <Sidenav.Body style={{ backgroundColor: '#f0f0f0' }}>
          <ApproveMenu />
        </Sidenav.Body>
      </Sidenav>
      
      {/* 모달 창 */}
      <Modal open={open} onClose={() => setOpen(false)} size="md">
        <Modal.Header>
          <Modal.Title>결재 양식 선택</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SelectForm closeModal={() => setOpen(false)} />
        </Modal.Body>
      </Modal>
    </Sidebar>
  );
};
export default ApproveLeftbar;