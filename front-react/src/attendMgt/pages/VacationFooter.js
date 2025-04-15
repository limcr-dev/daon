
import { Card } from 'rsuite';

const VacationFooter = (props) => {

  const { startDate, endDate } = props.moveDate;

  const vacation_occurList = props.vacation_occurList;

  return (
    <Card className="attendCard">
      <Card.Header className="cardHeaderList">
        <span style={{ fontWeight: '600', fontSize: '16px' }}>생성내역</span>
      </Card.Header>
      <table className='board-table'>
        <thead>
          <tr>
            <th style={{ width: "10%" }}>등록일</th>
            <th style={{ width: "15%" }}>사용기간</th>
            <th style={{ width: "11%" }}>발생일수</th>
            <th style={{ width: "11%" }}>사용가능일수</th>
            <th style={{ width: "29%" }}>내용</th>
          </tr>
        </thead>
        <tbody>
          {vacation_occurList
            .filter(vacation => vacation.create_at >= startDate && vacation.create_at <= endDate)
            .map(vacation => (
              <tr key={vacation.vac_no} >
                <td>{vacation.create_at}</td>
                <td>{vacation.expire_date}</td>
                <td >{vacation.earned_days}</td>
                <td >{vacation.available_days}</td>
                <td>{vacation.occur_reason}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </Card>
  );
};

export default VacationFooter;