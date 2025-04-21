export const getStatusText = (status) => {
    switch(status) {
      case 0: return '예정';
      case 1: return '진행중';
      case 2: return '승인';
      case 3: return '반려';
      case 4: return '임시저장';
      default: return '문서';
    }
  }

  export const getApprStatusText = (status) => {
    switch(status) {
      case 0: return '예정';
      case 1: return '대기';
      case 2: return '승인';
      case 3: return '반려';
      default: return '문서';
    }
  }