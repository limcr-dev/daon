// 날짜 형식 지정 ${yyyy}-${mm}-${dd}
export const formatDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // 월 2자리로 맞추기
    const dd = String(date.getDate()).padStart(2, '0');      // 일 2자리로 맞추기
    return `${yyyy}-${mm}-${dd}`;
  };