import React from "react";
import { Card, Placeholder, Tabs } from "rsuite";
// import rison from "rison-node";
const departmentUrls = {
  "1": {
    1: "3bca72ddea9344763938381ebddec0a2",
    2: "933d14308567cb184d7324f779fb4ffb",
    3: "2f2d96bab7c69fe1adf3a42161edba70",
    4: "ac7f342601e2b611536c928bb8be62a6",
    5: "844dde791e1decd139862d565c8cf0bf"
  },
  "20": {
    1: "url_1_for_dept_20",
    2: "url_2_for_dept_20",
    3: "url_3_for_dept_20",
    4: "url_4_for_dept_20"
  },
  // 다른 부서들도 같은 형태로 추가...
};

const KibanaDashboard = (props) => {

  const pickDept_no = props.pickDept_no;

  const deptUrls = departmentUrls[pickDept_no] || {};
  const host = "localhost:5601";
  const Dashboard = ({ pick }) => {
    // 해당 부서에 맞는 URL
    const kibanaUrl = `http://${host}/goto/${deptUrls[pick] || ""}?embed=true`;

    const iframeHeight = pick === 5 ? "850px" : "550px";

    return (
      <iframe
        title="DeptDashboard"
        src={kibanaUrl}
        width="100%"
        height={iframeHeight}
        style={{ border: "none" }}
      />
    );
  };

  return (
    <Card className="attendCard" >
      <Card.Header className="" >
        <Tabs defaultActiveKey="1">
          <Tabs.Tab eventKey="1" title="정상근무통계">
            <Dashboard pick={1} />
          </Tabs.Tab>
          <Tabs.Tab eventKey="2" title="지각통계">
            <Dashboard pick={2} />
          </Tabs.Tab>
          <Tabs.Tab eventKey="3" title="조퇴통계">
            <Dashboard pick={3} />
          </Tabs.Tab>
          <Tabs.Tab eventKey="4" title="결근통계">
            <Dashboard pick={4} />
          </Tabs.Tab>
          <Tabs.Tab eventKey="5" title="모아보기">
            <Dashboard pick={5} />
          </Tabs.Tab>
        </Tabs>
      </Card.Header>
    </Card>
  );
};

export default KibanaDashboard;
