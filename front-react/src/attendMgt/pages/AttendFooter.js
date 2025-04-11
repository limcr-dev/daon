
import React, { useEffect, useState } from 'react';
import { Card } from 'rsuite';

const AttendFooter = (props) => {

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
        setChangeLog(res);
      })
  }, [emp_no, year, month]);

  return (
    <div>
      <Card className="attendCard">
        <Card.Header className="cardHeaderList">
          <span style={{ fontWeight: '600', fontSize: '16px' }}>변경이력 {changeLog.length}</span>
        </Card.Header>
        <table className='board-table'>
          {/* .map() 함수를 사용하여 noticeList 안의 값을 하나씩 꺼냄 */}
          <tbody>
            {changeLog.map(log => (
              <tr>
                {/* <td>{log.emp_img}</td> */}
                <td style={{ width: "100px" }}>daon_logo.png</td>
                <td>{log.emp_name} {log.modifyTime}<br></br>{log.message}</td>
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