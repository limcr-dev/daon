import { useEffect } from 'react';

const History = (props) => {

  const emp_no = props.emp_no;
  const {year,month} = props.moveDate;
  const onDataFetched = props.onDataFetched;
  const {check_in_time, check_out_time} = props.attendance;
  useEffect(() => {
    
    fetch("http://localhost:8081/attend/attendHistory/" + emp_no + "/" + year + "/" + month, {
      method: "GET"
    })
      .then((data) => data.json())
      .then((data) => {
        const transformedData = transformData(data);
        onDataFetched(transformedData);  // 변환된 데이터를 부모로 전달
      })
      .catch((error) => {
        console.log('로그인정보를 확인해주세요', error);
      })
  }, [emp_no, year, month, props.attendance])

  // 데이터 형식변환 후 리턴
  const transformData = (data) => {
    
    return data.flatMap((item) => ([
      {
        "title": item.late ? '지각' : item.absent ? '결근' : '출근',
        "date":  item.absent ? item.date : item.date + 'T' + item.check_in_time,  
        "color": item.late ? 'red' : item.absent ? 'red':'#81d742'
      },
      {
        "title": item.early_leave ? '조퇴' : '퇴근',
        "date": item.date + 'T' + item.check_out_time,  
        "color": item.early_leave ? 'orange' : '#81d742'
      }
    ]));
  };
  return null
};

export default History;