import React from 'react';
import { Panel, IconButton } from 'rsuite';
import { MdClose } from 'react-icons/md';
import Treea from './Treea'; // 기존 트리 컴포넌트 재사용

const OrgChartPopup = ({ onClose, onSelectEmployee }) => {
  return (
    <div>
      <Panel header="조직도" bordered>
        <div className="org-chart-header">
          <IconButton icon={<MdClose />} size="sm" appearance="subtle" onClick={onClose} />
        </div>
        <Treea onEmployeeSelect={onSelectEmployee} />
      </Panel>
    </div>
  );
};

export default OrgChartPopup;
