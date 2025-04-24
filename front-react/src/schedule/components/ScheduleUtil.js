
// yyyy-MM-dd HH:mm 형 변환
export const formatDate = (date, time) => {
  console.log("date" + date);
  console.log("time" + time);

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0"); // 월 2자리로 맞추기
  const dd = String(date.getDate()).padStart(2, "0"); // 일 2자리로 맞추기
  const HH = String(time.getHours()).padStart(2, "0"); // 일 2자리로 맞추기
  const MM = String(time.getMinutes()).padStart(2, "0"); // 일 2자리로 맞추기

  return `${yyyy}-${mm}-${dd} ${HH}:${MM}`;
};

export const formatData = (list, checked) => {

    return list
    
    .filter((item) => checked.includes(Number(item.c_sch_no)))
    .map(item => {
        return {
          title: item.sch_title, 
          start: item.sch_start_time,  
          end: item.sch_end_time,      
          color: item.c_sch_color
        };
      });
}