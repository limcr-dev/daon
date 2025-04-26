import { Container, Content } from "rsuite";
import SalaryLeftbar from "./SalaryLeftbar";
import Leftbar from "../../common/pages/Leftbar";
import SalaryDashboard from "./SalaryDashboard";
import Header from '../../common/pages/Header';

const Salary = () => {
  return (
    <Container style={{ minHeight: "100vh", width: "100%" }}>
      <Leftbar />
      <Container>
        <SalaryLeftbar />
        <Content>
          <Header />
          <SalaryDashboard />
        </Content>
      </Container>
    </Container>
  )
}
export default Salary;