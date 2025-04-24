// 날짜 형식 지정 ${yyyy}-${mm}-${dd}
export const formatDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // 월 2자리로 맞추기
    const dd = String(date.getDate()).padStart(2, '0');      // 일 2자리로 맞추기
    return `${yyyy}-${mm}-${dd}`;
  };

// 시간 형변환 HH:MM >> HH:MM:SS
export const formatTime = (time) => {
  return time.split(".")[0];
};

// 근태상태명 변환
export const getStatusText = (status) => {
  if (status.vacation) return '휴가';
  if (status.absent) return '결근';
  if (status.late && status.early_leave) return '지각, 조퇴';
  if (status.late) return '지각';
  if (status.early_leave) return '조퇴';
  return '정상';
};

// 근태상태에 따른 색 리턴
export const attendStateColor = (status) => {
  if (status.vacation === 1) {
    return '#3B82F6'; // 휴가 (맑은 블루)
  }
  if (status.absent === 1) {
    return '#D32F2F'; // 결근 (	진한 레드)
  }
  if (status.normal === 1) {
    return '#49A902'; // 정상 (그린)
  }
  if (status.late === 1) {
    return '#FF6B6B'; // 지각 (선명한 레드)
  }
  if (status.early_leave === 1) {
    return '#FFA500'; // 조퇴 (오렌지)
  }

  if (status.late === 1 && status.early_leave === 1) {
    return '#FF400'; // 지각, 조퇴 (오렌지레드)
  }
  if (status === 1) {
    return '#49A902'; // 정상 (그린)
  }

  return '#808080'; // 기본 색 (회색) - 상태가 모두 0일 경우
};