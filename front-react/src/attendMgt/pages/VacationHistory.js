
import { Card } from 'rsuite';

const VacationHistory = (props) => {

  const { startDate, endDate } = props.moveDate;

  const vacationHistoryList = props.vacationHistoryList;

  return (
    <Card className="attendCard">
      <Card.Header className="cardHeaderList">
        <span style={{ fontWeight: '600', fontSize: '16px' }}>사용내역</span>
      </Card.Header>
      <table className='board-table'>
        <thead>
          <tr>
            <th style={{ width: "10%" }}>휴가종류</th>
            <th style={{ width: "15%" }}>연차 사용기간</th>
            <th style={{ width: "11%" }}>사용 연차</th>
            <th style={{ width: "40%" }}>사유</th>
          </tr>
        </thead>
        <tbody>
          {vacationHistoryList
            .filter(vacation => vacation.start_date >= startDate && vacation.start_date <= endDate)
            .map(vacation => (
              <tr key={vacation.doc_no} >
                <td>{vacation.vacation_type === 1? '연차': vacation.vacation_type === 2? '경조휴가' : '병가'}</td>
                <td>{vacation.start_date} ~ {vacation.end_date}</td>
                <td >{vacation.used_days}</td>
                <td>{vacation.content}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </Card>
  );
};

export default VacationHistory;