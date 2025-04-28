import React from 'react';
import { Panel, IconButton } from 'rsuite';
import { MdClose } from 'react-icons/md';
import Treea from './Treea';

const OrgChartPopup = ({ onClose, onSelectEmployee }) => {

  const HeaderWithCloseButton = (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span>조직도</span> 
      <IconButton icon={<MdClose />} size="sm" appearance="subtle" onClick={onClose} />
    </div>
  );

  return (
    <div style={{ width: '300px', margin: '0 auto' }}>
      <Panel header={HeaderWithCloseButton} bordered> 
        <Treea onEmployeeSelect={onSelectEmployee} />
      </Panel>
    </div>
  );
};

export default OrgChartPopup;
