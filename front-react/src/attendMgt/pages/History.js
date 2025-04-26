import { useEffect } from 'react';
import { request } from '../../common/components/helpers/axios_helper';

import { attendStateColor } from '../components/CommonUtil';

const History = (props) => {

  const emp_no = props.emp_no;
  const { year, month } = props.moveDate;
  const onDataFetched = props.onDataFetched;

  // 직원의 emp_no로 지정한 날짜(연,월)의 근태기록을 불러오기
  useEffect(() => {
    request("GET", "/attend/attendHistory/" + + emp_no + "/" + year + "/" + month)
      .then((data) => {
        const transformedData = transformData(data.data);
        onDataFetched(transformedData);  // 변환된 데이터를 부모로 전달
      })
      .catch((error) => {
        console.log('로그인정보를 확인해주세요', error);
      })
  }, [emp_no, year, month, props.attendance])

  // 데이터 형식변환 후 리턴
  const transformData = (data) => {

    return data.flatMap((item) => {
      // 휴가 기록이 있다면 휴가로 처리
      if (item.vacation !== 0) {
        return [
          {
            title: '휴가',
            date: item.date,
            color: attendStateColor(item)
          }
        ];
      }
      return [
        {
          // 출근 기록 변환
          title: item.late ? '지각' : item.absent ? '결근' : '출근', // late(지각)가 1이면 지각 아니면 absent(결근)이 1이면 결근 아니면 출근
          date: item.absent ? item.date : item.date + 'T' + item.check_in_time,
          color: item.late || item.absent ? attendStateColor(item) : attendStateColor(1)
        },
        {
           // 퇴근 기록 변환
          title: item.early_leave ? '조퇴' : '퇴근', // early_leave(조퇴)가 1이면 조퇴 아니면 퇴근
          date: item.date + 'T' + item.check_out_time,
          color: item.early_leave || item.absent ? attendStateColor(item) : attendStateColor(1)
        }
      ];
    });
  };
  return null
};

export default History;