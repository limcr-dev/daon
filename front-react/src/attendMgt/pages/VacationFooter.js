
import React, { useEffect, useRef, useState } from 'react';
import { Card } from 'rsuite';
const VacationFooter = (props) => {

  const emp_no = props.emp_no;
  const { startDate, endDate } = props.moveDate;

  const [vacation_occurList, setVacation_occurList] = useState([])
  useEffect(() => {

      fetch("http://localhost:8081/attend/vacation_log/" + emp_no + "/" + startDate + "/" + endDate, {
        method: "GET"
      })
        .then((res) => res.json())
        .then((res) => {
          setVacation_occurList(res);
        })

  }, [emp_no, startDate, endDate]);

  return (
    <Card className="attendCard">
      <Card.Header className="cardHeaderList">
        <span style={{ fontWeight: '600', fontSize: '16px' }}>생성내역</span>
      </Card.Header>
      <table className='board-table'>
        <thead>
          <tr>
            <th style={{width:"10%"}}>등록일</th>
            <th style={{width:"15%"}}>사용기간</th>
            <th style={{width:"11%"}}>발생일수</th>
            <th style={{width:"40%"}}>내용</th>
          </tr>
        </thead>
        <tbody>
          {vacation_occurList.map(vacation => (
            <tr key={vacation.vac_no}>
              <td>{vacation.create_at}</td>
              <td>{vacation.expire_date}</td>
              <td >{vacation.earned_days}</td>
              <td>{vacation.occur_reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};

export default VacationFooter;