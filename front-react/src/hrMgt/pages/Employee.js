import { Container, Content } from "rsuite";
import Leftbar from "../../common/pages/Leftbar";
import EmployeeDashboard from "./EmployeeDashboard";
import Header from '../../common/pages/Header';
import EmployeeLeftbar from "./EmployeeLeftbar";

const Employee = () => {
    return(
        <Container style={{ minHeight: "100vh", width: "100%" }}>
      <Leftbar />
      <Container>
        <EmployeeLeftbar />
        <Content>
          <Header />
          <EmployeeDashboard/>
        </Content>
      </Container>
    </Container>
    )
}
export default Employee;