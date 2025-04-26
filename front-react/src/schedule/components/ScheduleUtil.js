
// yyyy-MM-dd HH:mm 형 변환
export const formatDate = (date, time) => {
  console.log("date" + date);
  console.log("time" + time);

  // date가 있을 때 
  if (date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0"); // 월 2자리로 맞추기
    const dd = String(date.getDate()).padStart(2, "0"); // 일 2자리로 맞추기

    if (time) {
      const HH = String(time.getHours()).padStart(2, "0");
      const MM = String(time.getMinutes()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd} ${HH}:${MM}`;
    }

    return `${yyyy}-${mm}-${dd} 00:00`;
  }
  // date가 없을 때 
  else {
    
    return null;
  }


};

// 캘린더 데이터 변환
export const formatData = (list, allList, checked) => {
  const merged = [...list, ...allList];
  return merged
    .filter((item) => checked.includes(Number(item.c_sch_no)))
    .flatMap(item => {
      let events = [];
      
      // 기본 일정 추가
      events.push({
        sch_no: item.sch_no,
        title: item.sch_title,
        start: item.sch_start_time,
        end: item.sch_end_time,
        color: item.c_sch_color,
        allDay: item.sch_all_day
      });

      // 반복 일정 추가 (N은 제외)
      if (item.sch_repeat !== 'N') {
        const repeatCount = item.sch_repeat_count;
        const startDate = new Date(item.sch_start_time);
        const endDate = new Date(item.sch_end_time);

        // 반복 추가 로직
        for (let i = 1; i < repeatCount; i++) {
          let newStart = new Date(startDate);
          let newEnd = new Date(endDate);

          switch (item.sch_repeat) {
            case 'W': // 매주 반복
              newStart.setDate(newStart.getDate() + i * 7); // 7일씩 더함
              newEnd.setDate(newEnd.getDate() + i * 7);
              break;
            case 'M': // 매월 반복
              newStart.setMonth(newStart.getMonth() + i); // 1개월씩 더함
              newEnd.setMonth(newEnd.getMonth() + i);
              break;
            case 'Y': // 매년 반복
              newStart.setFullYear(newStart.getFullYear() + i); // 1년씩 더함
              newEnd.setFullYear(newEnd.getFullYear() + i);
              break;
            default:
              break;
          }

          // 반복 일정 추가
          events.push({
            sch_no: item.sch_no,
            title: item.sch_title,
            start: newStart.toISOString(),
            end: newEnd.toISOString(),
            color: item.c_sch_color,
            allDay: item.sch_all_day
          });
        }
      }
      
      return events;
    });
}