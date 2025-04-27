import React, { useState } from "react";
import { Container, Content } from "rsuite";
import RoleListPanel from "./RoleListPanel";
import GroupedDepartmentListPanel from "./GroupedDepartmentListPanel";
import Leftbar from "../../../common/pages/Leftbar";
import EmployeeLeftbar from "../EmployeeLeftbar";
import Header from '../../../common/pages/Header';

const DepartmentRoleManage = () => {
  const [selectedDept, setSelectedDept] = useState(null);

  return (
    <Container style={{ display: "flex", minHeight: "100vh" }}>
      <Leftbar />
      <Container>
        <EmployeeLeftbar />
        <Content>
          <Header />
          
          <div style={{ display: "flex", gap: 30, marginTop: "50px" }}>
            <GroupedDepartmentListPanel onSelectDept={setSelectedDept} />
            <RoleListPanel deptNo={selectedDept} />
          </div>
        </Content>
      </Container>
    </Container>
  );
};

export default DepartmentRoleManage;
