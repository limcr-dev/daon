import { useEffect } from 'react';

const History = (props) => {

  const emp_no = props.emp_no;
  const year = props.year;
  const month = props.month;
  const onDataFetched = props.onDataFetched;

  useEffect(() => {
    
    fetch("http://localhost:8081/attend/attendHistory/" + emp_no + "/" + year + "/" + month, {
      method: "GET"
    })
      .then((data) => data.json())
      .then((data) => {
        const transformedData = transformData(data);
        onDataFetched(transformedData);  // 변환된 데이터를 부모로 전달
        // }
      })
      .catch((error) => {
        console.log('로그인정보를 확인해주세요', error);
      })
  }, [emp_no, year, month, onDataFetched])

  // 데이터 형식변환 후 리턴
  const transformData = (data) => {
    
    return data.flatMap((item) => ([
      {
        "title": item.late ? '지각' : '출근',
        "date": item.date + 'T' + item.check_in_time,  // 기본 색상 설정 (없으면)
        "color": item.late ? 'red' : '#81d742'
      },
      {
        "title": item.early_leave ? '조퇴' : '퇴근',
        "date": item.date + 'T' + item.check_out_time,  // 기본 색상 설정 (없으면)
        "color": item.early_leave ? 'orange' : '#81d742'
      }
    ]));
  };
  return null
};

export default History;