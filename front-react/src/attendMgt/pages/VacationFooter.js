
import FullCalendar from '@fullcalendar/react';
import React, { useEffect, useState } from 'react';
import { Card } from 'rsuite';
import dayGridPlugin from "@fullcalendar/daygrid";
const VacationFooter = (props) => {

  const emp_no = props.emp_no;
  const year = props.year;
  const month = props.month;

  const [changeLog, setChangeLog] = useState([])
  useEffect(() => {
    fetch("http://localhost:8081/attend/changeLog/" + emp_no + "/" + year + "/" + month, {
      method: "GET"
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("test ", res);
        setChangeLog(res);
      })
  }, [emp_no, year, month]);

  return (
    <Card style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <Card.Header style={{ justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#f5f5f5', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
        <span style={{ fontWeight: '600', fontSize: '16px' }}>생성내역</span>
      </Card.Header>
      <table className='board-table'>
        <tr>
          <th>등록일</th>
          <th>사용기간</th>
          <th>발생일수</th>
          <th>내용</th>
        </tr>
        <tr>
          <td>2025-04-07</td>
          <td>2026-03-07</td>
          <td>1</td>
          <td>연차</td>
        </tr>
        <tr>
          <td>2025-03-07</td>
          <td>2026-03-07</td>
          <td>1</td>
          <td>연차</td>
        </tr>
      </table>
    </Card>
  );
};

export default VacationFooter;