import React from "react";
import { Card, Placeholder, Tabs } from "rsuite";
// import rison from "rison-node";
const KibanaDashboard = (props) => {
  const pickDept_no = props.pickDept_no;

  let dashboardId = "56052dfca14308af28aea8c86ab6c3c2"; // 실제 대시보드 ID로 교체

  switch (pickDept_no) {
    case "10":
      dashboardId = "56052dfca14308af28aea8c86ab6c3c2";
      break;
    case "20":
      dashboardId = "56052dfca14308af28aea8c86ab6c3c2";
      break;
    case "30":
      dashboardId = "56052dfca14308af28aea8c86ab6c3c2";
      break;

    case "101":
      dashboardId = "56052dfca14308af28aea8c86ab6c3c2";
      break;
    case "102":
      dashboardId = "56052dfca14308af28aea8c86ab6c3c2";
      break;
    case "103":
      dashboardId = "56052dfca14308af28aea8c86ab6c3c2";
      break;

    case "201":
      dashboardId = "56052dfca14308af28aea8c86ab6c3c2";
      break;
    case "202":
      dashboardId = "56052dfca14308af28aea8c86ab6c3c2";
      break;
    case "203":
      dashboardId = "56052dfca14308af28aea8c86ab6c3c2";
      break;

    case "301":
      dashboardId = "56052dfca14308af28aea8c86ab6c3c2";
      break;
    case "302":
      dashboardId = "56052dfca14308af28aea8c86ab6c3c2";
      break;
    case "303":
      dashboardId = "56052dfca14308af28aea8c86ab6c3c2";
      break;
    default:
      dashboardId = "56052dfca14308af28aea8c86ab6c3c2";
      break;
  }
  const Dashboard = () => {
    return (
      <iframe
        title="DeptDashboard"
        src={kibanaUrl}
        width="100%"
        height="550px"
        style={{ border: "none" }}
      />
    );
  };
  // const kibanaUrl = `http://localhost:5601/goto/${dashboardId}?embed=true`;

  // 임시 url
  const kibanaUrl = `http://localhost:5601/goto/6ac55ec96f9017bdda5122c186309b35?embed=true`;
  return (
    <Card className="attendCard" style={{height:"600px"}}>
      <Card.Header className="" >
        <Tabs defaultActiveKey="1">
          <Tabs.Tab eventKey="1" title="결근통계">
            <Dashboard />
          </Tabs.Tab>
          <Tabs.Tab eventKey="2" title="지각통계">
            <Dashboard />
          </Tabs.Tab>
          <Tabs.Tab eventKey="3" title="조퇴통계">
            <Dashboard />
          </Tabs.Tab>
        </Tabs>
      </Card.Header>
    </Card>
  );
};

export default KibanaDashboard;
