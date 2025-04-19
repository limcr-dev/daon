import { Container, Content, Divider, Header } from "rsuite";
import SalaryLeftbar from "./SalaryLeftbar";
import Leftbar from "../../common/pages/Leftbar";

const Salary = () => {
    return(
        <Container style={{ minHeight: "100vh", width: "100%" }}>
      <Leftbar />
      <Container>
        <SalaryLeftbar />
        <Content>
          <Header />
          <Divider />
          
           

        </Content>
      </Container>
    </Container>
    )
}
export default Salary;