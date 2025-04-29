import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card } from "react-bootstrap";
import { request } from "../common/components/helpers/axios_helper"; // API 요청
import { Button, Container, Content } from 'rsuite';
import Leftbar from '../common/pages/Leftbar';
import LeftbarDEvaluation from './components/LeftbarDEvaluation';
import ToTalScoreChart from './ToTalScoreChart';
import PentagonChart from './PentagonChart';
import Header from "../common/pages/Header";
import GoalpieChart from './GoalpieChart';

const EvalDetail = () => {
    const { emp_no } = useParams();
    const [peerStatus, setPeerStatus] = useState({}); //동료평가 현황
    const [selfStatus, setSelfStatus] = useState({}); // 자기평가 현황
    const [peerEmpChart, setPeerEmpChart] = useState({}); // 동료평가 역량 차트
    const [peerLineChart, setPeerLineChart] = useState({}); // 동료평가 라인 차트
    const [selfEmpChart, setSelfEmpChart] = useState({}); // 동료평가 역량 차트
    const [selfLineChart, setSelfLineChart] = useState({}); // 동료평가 라인 차트
    const [attandLineChart, setAttandLineChart] = useState([]); // 근태평가 라인차트
    const [emp, setEmp] = useState({}); // 직원
    const [showSelfPentagon, setShowSelfPentagon] = useState(false);
    const [showPeerPentagon, setShowPeerPentagon] = useState(false);
    const [goalpieChart, setGoalpieChart] = useState([]); // 목표달성 진행률 차트
    const [goalChartIndex, setGoalChartIndex] = useState(0);

    useEffect(() => {
        if (emp_no) {
            request('GET', `/performMgt/employees/${emp_no}`)
                .then((res) => {
                    console.log("직원 정보불러오기", res.data)
                    setEmp(res.data);
                })
                .catch((error) => {
                    console.error("직원 정보불러오기 오류 : ", error);
                });

            // 동료평가 진행현황
            request("GET", `/performMgt/peerStatus_emp/${emp_no}`)
                .then((res) => {
                    setPeerStatus(res.data);
                    console.log("동료평가진행현황", res.data)
                })
                .catch((error) => {
                    console.error("동료평가진행현황 오류 : ", error);
                });

            // 동료평가 점수
            request("GET", `/performMgt/peerScore/${emp_no}`)
                .then((res) => {
                    setPeerLineChart(res.data);
                    const helpdata = (list) => {
                        if (!list || list.length === 0) return [];

                        return list.map(data => ({
                            eval_order_num: data.eval_order_num,
                            avg_total: data.avg_total,
                            eval_test_date: data.eval_test_date,
                            scores: [
                                { subject: data.eval_comp1, score: data.avg1 },
                                { subject: data.eval_comp2, score: data.avg2 },
                                { subject: data.eval_comp3, score: data.avg3 },
                                { subject: data.eval_comp4, score: data.avg4 },
                                { subject: data.eval_comp5, score: data.avg5 },
                            ]
                        }));
                    };
                    const format = helpdata(res.data);
                    setPeerEmpChart(format);
                    console.log("동료평가점수", format)
                })
                .catch((error) => {
                    console.error("동료평가점수 오류 : ", error);
                });

            // 자기평가 진행 현황
            request("GET", `/performMgt/selfStatus_emp/${emp_no}`)
                .then((res) => {

                    setSelfStatus(res.data);
                    console.log("자기평가진행현황", res.data)
                })
                .catch((error) => {
                    console.error("자기평가진행현황 오류 : ", error);
                });

            // 자기평가 점수    
            request("GET", `/performMgt/selfScore/${emp_no}`)
                .then((res) => {
                    setSelfLineChart(res.data);
                    const helpdata = (list) => {
                        if (!list || list.length === 0) return [];

                        return list.map(data => ({
                            eval_order_num: data.eval_order_num,
                            avg_total: data.avg_total,
                            eval_test_date: data.eval_test_date,
                            scores: [
                                { subject: data.eval_comp1, score: data.eval_comp1_score },
                                { subject: data.eval_comp2, score: data.eval_comp2_score },
                                { subject: data.eval_comp3, score: data.eval_comp3_score },
                                { subject: data.eval_comp4, score: data.eval_comp4_score },
                                { subject: data.eval_comp5, score: data.eval_comp5_score },
                            ]
                        }));
                    };
                    const format = helpdata(res.data);
                    setSelfEmpChart(format);
                    console.log("자기평가점수", res.data)
                })
                .catch((error) => {
                    console.error("자기평가점수 오류 : ", error);
                });
            // 근태평가 점수    
            request("GET", `/performMgt/attandScore/${emp_no}`)
                .then((res) => {
                    setAttandLineChart(res.data);
                    console.log("근태평가 점수", res.data)
                })
                .catch((error) => {
                    console.error("근태평가 점수 오류 : ", error);
                });
            // 목표 달성 진행율    
            request("GET", `/performMgt/totalGoalsScore/${emp_no}`)
                .then((res) => {
                    const helpdata = (goal) => {
                        if (!goal || goal.length === 0) return [];

                        return goal.map(data => ({
                            goal_month: data.goal_month,
                            goal_score: data.completion_rate,
                            scores: [
                                { name: "완료", value: data.completion_rate },
                                { name: "미완료", value: 100 - data.completion_rate }
                            ]
                        }));
                    }
                    const format = helpdata(res.data);
                    setGoalpieChart(format);

                    console.log("목표 달성 진행율", format);
                })
                .catch((error) => {
                    console.error("목표 달성 진행율 오류 : ", error);
                });
        }
    }, [emp_no]);

    const goalHandlePrev = () => {
        setGoalChartIndex(prev => (prev > 0 ? prev - 1 : prev));
    };
    const goalHandleNext = () => {
        setGoalChartIndex(prev => (prev < goalpieChart.length - 1 ? prev + 1 : prev));
    };
    return (
        <Container style={{ minHeight: '100vh', width: '100%' }}>
            <Leftbar />
            <Container>
                <LeftbarDEvaluation />
                <Content>
                    <Header />
                    <div>
                        <Card align="center">
                            {emp.emp_name}
                            {emp.self_avg}
                            {emp.peer_avg}
                            {emp.dept_no}
                            {emp.position_id}
                            <h5 className="line"> 평가 현황 </h5>
                            <table className="comp-table">
                                <thead>
                                    <tr>
                                        <th className="comp-th">구분</th>
                                        <th className="comp-th">완료/전체</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="comp-td">자기평가</td>
                                        <td className="comp-td">{selfStatus.self_cnt || "정보 없음"}/{selfStatus.self_total_cnt || "정보 없음"}</td>
                                    </tr>
                                    <tr>
                                        <td className="comp-td">동료평가</td>
                                        <td className="comp-td">{peerStatus.peer_cnt || "정보 없음"}/{peerStatus.peer_total_cnt || "정보 없음"}</td>

                                    </tr>

                                </tbody>
                            </table>

                            {/* 꺾은선 그래프 -자기평가 */}
                            <Card className='eval-card'>
                                <Card.Header style={{ display: 'flex', justify: 'end' }}>
                                    <h5>자기평가 점수 현황</h5>
                                </Card.Header>
                                {/* 본문 */}
                                <Card.Body className="p-4 space-y-2">
                                    <ToTalScoreChart data={selfLineChart} />
                                </Card.Body>
                                <Card.Footer>
                                    <Button onClick={() => setShowSelfPentagon(!showSelfPentagon)}>
                                        {showSelfPentagon ? "닫기" : "자세히 보기"}
                                    </Button>
                                    {/* 역량그래프-자기평가 */}
                                    {showSelfPentagon && (
                                        <div style={{ marginTop: '20px' }}>
                                            <h6>자기평가 역량 그래프</h6>
                                            <br />
                                            <PentagonChart data={selfEmpChart} />
                                        </div>
                                    )}
                                </Card.Footer>
                            </Card>

                            {/* 꺾은선 그래프 -동료평가 */}
                            <Card className='eval-card'>
                                <Card.Header style={{ display: 'flex', justify: 'end' }}>
                                    <h5>동료평가 점수 현황</h5>
                                </Card.Header>
                                {/* 본문 */}
                                <Card.Body className="p-4 space-y-2">
                                    <ToTalScoreChart data={peerLineChart} />
                                </Card.Body>
                                <Card.Footer>
                                    <Button onClick={() => setShowPeerPentagon(!showPeerPentagon)}>
                                        {showPeerPentagon ? "닫기" : " 자세히 보기"}
                                    </Button>
                                    {/* 역량그래프-동료평가 */}
                                    {showPeerPentagon && (
                                        <div style={{ marginTop: '20px' }}>
                                            <h6>동료평가 역량 그래프</h6>
                                            <br />
                                            <PentagonChart data={peerEmpChart} />
                                        </div>
                                    )}
                                </Card.Footer>
                            </Card>

                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "stretch" }}>
                                {/* 꺾은선 그래프 -근태평가 */}
                                <Card className='eval-card' style={{ flex: "1" }}>
                                    <Card.Header style={{ display: 'flex', justify: 'end' }}>
                                        <h6>근태평가 점수 현황</h6>
                                    </Card.Header>
                                    {/* 본문 */}
                                    <Card.Body style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        <div style={{ flex: "1", minWidth: "350px" }}>
                                            <ToTalScoreChart data={attandLineChart} /></div>
                                    </Card.Body>
                                </Card>


                                {/* 목표 달성 현황 */}
                                <Card className='eval-card' style={{ flex: "1" }}>
                                    <Card.Header style={{ display: 'flex', justify: 'end' }}>
                                        <h6>목표 달성 현황</h6>
                                    </Card.Header>

                                    {/* 본문 */}
                                    <Card.Body style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        {goalpieChart.length > 0 && (
                                            <>
                                                <div style={{ display: "flex", minWidth: "10px", flexDirection: "column" }}>
                                                    <Button onClick={goalHandlePrev} disabled={goalChartIndex === 0}>이전</Button></div>

                                                <div style={{ display: "flex", minWidth: "180px", alignItems: "center", flexDirection: "column" }}>
                                                    <GoalpieChart data={goalpieChart[goalChartIndex]} /></div>

                                                <div style={{ display: "flex", minWidth: "10px", flexDirection: "column" }}>
                                                    <Button onClick={goalHandleNext} disabled={goalChartIndex === goalpieChart.length - 1} style={{ marginLeft: '1px' }}>다음</Button> </div>
                                            </>
                                        )}
                                        {(goalpieChart.length === 0 || goalpieChart[goalChartIndex]?.goal?.length === 0) && (
                                            <p>목표 데이터가 없습니다.</p>
                                        )}
                                    </Card.Body>
                                </Card>
                            </div>
                        </Card>
                    </div>
                </Content>
            </Container>
        </Container >

    );
}

export default EvalDetail;