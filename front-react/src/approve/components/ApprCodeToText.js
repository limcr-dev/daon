export const getFormName = (form_no) => {
  switch (form_no) {
    case 1: return '휴가신청서';
    case 2: return '';
    case 3: return '';
    case 4: return '';
    case 5: return '업무기안서';
    default: return '';
  }
}

export const getStatusText = (status) => {
  switch (status) {
    case 1: return '임시저장';
    case 2: return '진행중';
    case 3: return '완료';
    case 4: return '반려';
    default: return '기안';
  }
}

export const getApprStatusText = (status) => {
  switch (status) {
    case 0: return '신청';
    case 1: return '예정';
    case 2: return '대기';
    case 3: return '승인';
    case 4: return '반려';
    default: return '';
  }
}

export const getVacationTypeText = (type) => {
  switch (type) {
    case 1: return '연차';
    case 2: return '병가';
    case 3: return '경조휴가';
    case 4: return '특별휴가';
    default: return '';
  }
}

// 결재 상태에 따른 배지 컴포넌트
export const StatusBadge = ({ status }) => {
  const statusInfo = {
    1: { text: '임시저장', color: '#999999' }, // 회색
    2: { text: '진행중', color: '#8BC34A' }, // 연두색
    3: { text: '승인', color: '#2196F3' }, // 파란색
    4: { text: '반려', color: '#F44336' }, // 빨간색
    5: { text: '상신취소', color: '#FF9800' }, // 주황색
  };

  const info = statusInfo[status] || { text: '', color: '#CCCCCC' };

  return (
    <span style={{
      backgroundColor: info.color,
      color: 'white',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 'bold',
      display: 'inline-block'
    }}>
      {info.text}
    </span>
  );
};

// 결재자 상태에 따른 배지 컴포넌트
export const ApprStatusBadge = ({ status, isSquare }) => {
  const statusInfo = {
    0: { text: '신청', color: '#795548' }, // 갈색
    1: { text: '예정', color: '#9E9E9E' }, // 회색
    2: { text: '대기', color: '#FF9800' }, // 주황색
    3: { text: '승인', color: '#4CAF50' }, // 초록색
    4: { text: '반려', color: '#F44336' }, // 빨간색
  };

  const info = statusInfo[status] || { text: '', color: '#CCCCCC' };

  const style = isSquare ? {
    backgroundColor: info.color,
    color: 'white',
    width: '40px',
    height: '40px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } : {
    backgroundColor: info.color,
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
    display: 'inline-block'
  };

  return (
    <span style={style}>
      {info.text}
    </span>
  );
};

// 긴급 여부에 따른 배지 컴포넌트
export const UrgentBadge = ({ isUrgent }) => {
  return isUrgent === 'Y' ? (
    <span style={{
      backgroundColor: '#F44336', // 빨간색
      color: 'white',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 'bold',
      display: 'inline-block'
    }}>
      긴급
    </span>
  ) : (
    <span style={{
      backgroundColor: '#CCCCCC', // 회색
      color: 'white',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 'bold',
      display: 'inline-block'
    }}>
      일반
    </span>
  );
};