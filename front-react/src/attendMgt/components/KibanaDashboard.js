import React from "react";
import { Card, Placeholder, Tabs } from "rsuite";

const departmentUrls = {
  // 1 = 정상근무, 2 = 지각, 3 = 조퇴, 4 = 결근, 5 = 모아보기
  // 전사 통계
  "1": {
    1: "3bca72ddea9344763938381ebddec0a2",
    2: "933d14308567cb184d7324f779fb4ffb",
    3: "2f2d96bab7c69fe1adf3a42161edba70",
    4: "ac7f342601e2b611536c928bb8be62a6",
    5: "844dde791e1decd139862d565c8cf0bf"
  },
  // 경영부 통계
  "10": {
    1: "2cdc6025912a63bcde0eae8a4d799699",
    2: "55e38f78864b6a8925f4bad824d0e2be",
    3: "69fb609fb94324bde1ea096f35bb1c88",
    4: "e54a30eca266cc5398e0995c7ef1c506",
    5: "fe718dbaec67de3b5b095c888ed010d4"
  },
  // 개발부 통계
  "20": {
    1: "b0eb259f1989f65788f870ab11a8442f",
    2: "4ec41a5f35999ccde04d1311ec5f8165",
    3: "76e980071627b2c54defa2625bab3a5a",
    4: "ec465c13400790cb2a10fff4c12fa5a0",
    5: "66bd3be33844511932fddac89efa3695"
  },
  // 영업부 통계
  "30": {
    1: "380a0b424c0edfd4730b09e75a62625d",
    2: "65286f3c1669da99ad6ea5f671e10702",
    3: "2eda348606c146de80130fdfb72c107a",
    4: "b889cdf04344dc720aac639428315f4d",
    5: "7995780c047efe9e491537f0b377c8e0"
  },
};

const KibanaDashboard = (props) => {

  const pickDept_no = props.pickDept_no;

  const deptUrls = departmentUrls[pickDept_no] || {};

  // 배포용
  // const host = "13.209.178.147:5601";

  // localhost용
  const host = "localhost:5601";

  // 발표용
  // const host = "192.168.0.33:5601";
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