import React from 'react';
import { Panel, IconButton } from 'rsuite';
import { MdClose } from 'react-icons/md';
import Treea from './Treea'; // 기존 트리 컴포넌트 재사용

const OrgChartPopup = ({ onClose, onSelectEmployee }) => {
  // 1. header 자체를 커스텀 JSX로 만든다
  const HeaderWithCloseButton = (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span>조직도</span> {/* 왼쪽: 제목 */}
      <IconButton icon={<MdClose />} size="sm" appearance="subtle" onClick={onClose} />
      {/* 오른쪽: 닫기 버튼 */}
    </div>
  );

  return (
    <div style={{ width: '300px', margin: '0 auto' }}>
      <Panel header={HeaderWithCloseButton} bordered> {/* 커스텀 헤더 적용 */}
        <Treea onEmployeeSelect={onSelectEmployee} />
      </Panel>
    </div>
  );
};

export default OrgChartPopup;
