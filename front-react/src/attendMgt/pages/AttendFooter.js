
import React, { useEffect, useState } from 'react';
import { Avatar, Card } from 'rsuite';
import { request } from '../../common/components/helpers/axios_helper';

const AttendFooter = (props) => {

  const emp_no = props.emp_no;
  const year = props.year;
  const month = props.month;

  // 수정 기록 
  const [changeLog, setChangeLog] = useState([])

  // 수정 기록  불러오기
  useEffect(() => {
    request("GET", "/attend/changeLog/" + emp_no + "/" + year + "/" + month)
      .then((res) => {
        setChangeLog(res.data);
      })
  }, [emp_no, year, month]);

  return (
    <div>
      <Card className="attendCard">
        <Card.Header className="cardHeaderList">
          <span style={{ fontWeight: '600', fontSize: '16px' }}>변경이력 {changeLog.length}</span>
        </Card.Header>
        <table className='board-table'>
          <tbody>
            {changeLog.map(log => (
              <tr key={log.attendance_no}>
                <td style={{ width: "50px" }}>
                  <Avatar
                    circle
                    size="sm"
                    src={log.emp_img}
                    alt="프로필"
                    style={{ cursor: 'pointer' }}
                    onError={(e) => { e.target.src = '/default-profile.png'; }}
                  /></td>
                <td>{log.emp_name}
                  {/* 수정 날짜 회색,작은글씨 */}
                  <small style={{ color: "#9FA19F" }}>{log.modifyTime}</small>
                  <br></br>
                  {log.message}</td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div >
  );
};

export default AttendFooter;