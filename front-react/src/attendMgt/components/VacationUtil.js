import { formatDate } from './CommonUtil';

// 입사일 기준 이번 주기 시작,끝 날짜 계산
export const getCurrentVacationCycle = (hireDate) => {
  const today = new Date();
  const hire_date = new Date(hireDate);

  // 오늘 연도 - 입사연도 = 이번연도 입사 기념일
  const yearWorks = today.getFullYear() - hire_date.getFullYear();
  const annivDate = new Date(
    hire_date.getFullYear() + yearWorks,
    hire_date.getMonth(),
    hire_date.getDate()
  );

  let start = "";
  let end = "";

  // 이번연도 입사 기념일이 오늘보다 이르면 + 1
  if (today >= annivDate) {
    start = annivDate;
    end = new Date(
      annivDate.getFullYear() + 1,
      annivDate.getMonth(),
      annivDate.getDate()
    );
    // 이번연도 입사 기념일이 오늘보다 늦으면 - 1 
  } else {
    end = annivDate;
    start = new Date(
      annivDate.getFullYear() - 1,
      annivDate.getMonth(),
      annivDate.getDate()
    );
  }
  // 형 변환 후 리턴
  return { start: formatDate(start), end: formatDate(end) };
};

// 가장 빠른 만료 예정일, 잔여 연차 계산
export const getExpireDate = (vacation_occurList) => {
  let maxExpireDate = "";
  let createVacation = "";

  // 연차 생성 기록이 있을 때만 
  if (vacation_occurList.length > 0) {
    // 만료일이 현재 날짜 이후인 데이터만 추출
    const futureVacations = vacation_occurList.filter(v => new Date(v.expire_date) > new Date());

    // 현재 날짜 이후 목록중 가장 작은 값 추출
    const maxExpire = Math.min(
      ...futureVacations.map(v => new Date(v.expire_date).getTime())
    );
    // 만료예정일 형식 변환
    maxExpireDate = new Date(maxExpire).toISOString().slice(0, 10);

    // 총 연차 수 합산 (사용연차 반영X)
    createVacation = futureVacations.map(v => v.earned_days).reduce((sum, earned_days) => sum + earned_days, 0);
  }
  return { maxExpireDate, createVacation };
}

// 사용연차 수 계산
export const getUsedVacation = (vacationHistoryList, start, end) => {
  let useVacation = "";

  // start, end 값을 받아와 그기간에 포함하는 사용 연차만 필터
  const currentUsedVacation = vacationHistoryList.filter(v => {
    const vacationStart = new Date(v.start_date);
    return vacationStart >= new Date(start) && vacationStart < new Date(end);
  });

  // 필터된 사용연차 목록 중 사용안 연차 수 합산(reduce)
  useVacation = currentUsedVacation.map(history => history.used_days)
    .reduce((sum, used_days) => sum + used_days, 0);

  return { useVacation };
}