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
          <div style={{ marginTop: "50px", marginLeft: "30px", marginRight: "30px" }}>
          <EmployeeDashboard/>
          </div>
        </Content>
      </Container>
    </Container>
    )
}
export default Employee;