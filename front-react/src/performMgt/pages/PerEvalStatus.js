import React, { useEffect, useState } from "react"
import { request } from "../../common/components/helpers/axios_helper"
import { Card } from "react-bootstrap";
import Leftbar from "../../common/pages/Leftbar";
import LeftbarDEvaluation from "../components/LeftbarDEvaluation";
import { Content, Button, Container } from "rsuite";
import { useUser } from '../../common/contexts/UserContext';
import { useNavigate } from "react-router-dom";
import ToTalScoreChart from "../ToTalScoreChart";
import PentagonOne from "../PentagonOne";
import GoalpieChart from "../GoalpieChart";
import Header from "../../common/pages/Header";

const PerEvalStatus = () => {

    const { user } = useUser();
    const [peerStatus, setPeerStatus] = useState([]); //동료평가 현황
    const [selfStatus, setSelfStatus] = useState([]); // 자기평가 현황
    const [peerEmpChart, setPeerEmpChart] = useState([]); // 동료평가 역량 차트
    const [peerLineChart, setPeerLineChart] = useState([]); // 동료평가 라인 차트
    const [selfEmpChart, setSelfEmpChart] = useState([]); // 자기평가 역량 차트
    const [selfLineChart, setSelfLineChart] = useState([]); // 자기평가 라인 차트
    const [attandLineChart, setAttandLineChart] = useState([]); // 근태평가 라인차트
    const [goalpieChart, setGoalpieChart] = useState([]); // 목표달성 진행률 차트
    const [selfChartIndex, setSelfChartIndex] = useState(0);
    const [peerChartIndex, setPeerChartIndex] = useState(0);
    const [goalChartIndex, setGoalChartIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.emp_no) {
            // 동료평가 진행현황
            request("GET", `/perform/peerStatus_emp/${user.emp_no}`)
                .then((res) => {
                    setPeerStatus(res.data);
                    console.log("동료평가진행현황", res.data)
                })
                .catch((error) => {
                    console.error("동료평가진행현황 오류 : ", error);
                });

            // 동료평가 점수
            request("GET", `/perform/peerScore/${user.emp_no}`)
                .then((res) => {
                    if (Array.isArray(res.data)) {
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
                    } else {
                        console.warn("응답이 배열이 아님:", res.data);
                    }
                })
                .catch((error) => {
                    console.error("동료평가점수 오류 : ", error);
                });

            // 자기평가 진행 현황
            request("GET", `/perform/selfStatus_emp/${user.emp_no}`)
                .then((res) => {
                    setSelfStatus(res.data);
                    console.log("자기평가진행현황", res.data)
                })
                .catch((error) => {
                    console.error("자기평가진행현황 오류 : ", error);
                });

            // 자기평가 점수    
            request("GET", `/perform/selfScore/${user.emp_no}`)
                .then((res) => {
                    if (Array.isArray(res.data)) {
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
                        const sortedFormat = format.sort((a, b) => new Date(b.eval_test_date) - new Date(a.eval_test_date));
                        setSelfEmpChart(sortedFormat);

                        console.log("자기평가점수", res.data)
                    } else {
                        console.warn("응답이 배열이 아님:", res.data);
                    }
                })
                .catch((error) => {
                    console.error("자기평가점수 오류 : ", error);
                });

            // 근태평가 점수    
            request("GET", `/perform/attandScore/${user.emp_no}`)
                .then((res) => {
                    if (Array.isArray(res.data)) {
                        setAttandLineChart(res.data);

                        console.log("근태평가 점수", res.data)
                    } else {
                        console.warn("응답이 배열이 아님:", res.data);
                    }
                })
                .catch((error) => {
                    console.error("근태평가 점수 오류 : ", error);
                });

            // 목표 달성 진행율    
            request("GET", `/perform/totalGoalsScore/${user.emp_no}`)
                .then((res) => {
                    if (Array.isArray(res.data)) {
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
                    } else {
                        console.warn("응답이 배열이 아님:", res.data);
                    }
                })
                .catch((error) => {
                    console.error("목표 달성 진행율 오류 : ", error);
                });
        }
    }, [user]);

    const evalself = (e) => {
        e.preventDefault();
        navigate('/performMgt/selfQues');
    }
    const evalpeer = (e) => {
        e.preventDefault();
        navigate('/performMgt/peerQues');
    }

    const selfHandlePrev = () => {
        setSelfChartIndex(prev => (prev > 0 ? prev - 1 : prev));
    };
    const peerHandlePrev = () => {
        setPeerChartIndex(prev => (prev > 0 ? prev - 1 : prev));
    };

    const goalHandlePrev = () => {
        setGoalChartIndex(prev => (prev > 0 ? prev - 1 : prev));
    };

    const selfHandleNext = () => {
        setSelfChartIndex(prev => (prev < selfEmpChart.length - 1 ? prev + 1 : prev));
    };

    const peerHandleNext = () => {
        setPeerChartIndex(prev => (prev < peerEmpChart.length - 1 ? prev + 1 : prev));
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
                            <h5 className="line"> 평가 현황 </h5>
                            <table className="comp-table">
                                <thead>
                                    <tr>
                                        <th className="comp-th">구분</th>
                                        <th className="comp-th">완료/전체</th>
                                        <th className="comp-th"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="comp-td">자기평가</td>
                                        <td className="comp-td">{selfStatus.self_cnt || "정보 없음"}/{selfStatus.self_total_cnt || "정보 없음"}</td>
                                        <td className="comp-td"><button className="subno" type="button" onClick={evalself} >자기평가 하러가기</button></td>
                                    </tr>
                                    <tr>
                                        <td className="comp-td">동료평가</td>
                                        <td className="comp-td">{peerStatus.peer_cnt || "정보 없음"}/{peerStatus.peer_total_cnt || "정보 없음"}</td>
                                        <td className="comp-td"><button className="subno" type="button" onClick={evalpeer} >동료평가 하러가기</button></td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* 꺾은선 그래프 -자기평가 */}
                            <Card className='eval-card'>
                                <Card.Header style={{ display: 'flex', justify: 'end' }}>
                                    <h5>자기평가 점수 현황</h5>
                                </Card.Header>
                                {/* 본문 */}
                                <Card.Body style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                    <div style={{ flex: "1", minWidth: "250px" }}>
                                        <ToTalScoreChart data={selfLineChart} /></div>
                                    {selfEmpChart.length > 0 && selfEmpChart[selfChartIndex]?.scores?.length > 0 && (
                                        <>
                                            <div style={{ display: "flex", minWidth: "5px", flexDirection: "column", marginLeft: '20px' }}>
                                                <Button onClick={selfHandlePrev} disabled={selfChartIndex === 0}>이전</Button></div>
                                            <div style={{ display: "flex", minWidth: "300px", flexDirection: "column" }}>
                                                <PentagonOne data={selfEmpChart[selfChartIndex]} /></div>
                                            <div style={{ display: "flex", minWidth: "5px", flexDirection: "column", marginRight: '20px' }}>
                                                <Button onClick={selfHandleNext} disabled={selfChartIndex === selfEmpChart.length - 1} style={{ marginLeft: '1px' }}>다음</Button> </div>
                                        </>
                                    )}
                                    {(selfEmpChart.length === 0 || selfEmpChart[selfChartIndex]?.scores?.length === 0) && (
                                        <p>데이터가 없습니다.</p>
                                    )}
                                </Card.Body>
                            </Card>

                            {/* 꺾은선 그래프 -동료평가 */}
                            <Card className='eval-card' >
                                <Card.Header style={{ display: 'flex', justify: 'end' }}>
                                    <h6>동료평가 점수 현황</h6>
                                </Card.Header>
                                {/* 본문 */}
                                <Card.Body style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                    <div style={{ flex: "1", minWidth: "250px" }}>
                                        <ToTalScoreChart data={peerLineChart} /></div>
                                    {peerEmpChart.length > 0 && peerEmpChart[peerChartIndex]?.scores?.length > 0 && (
                                        <>
                                            <div style={{ display: "flex", minWidth: "5px", flexDirection: "column", marginLeft: '20px' }}>
                                                <Button onClick={peerHandlePrev} disabled={peerChartIndex === 0}>이전</Button></div>
                                            <div style={{ display: "flex", minWidth: "300px", flexDirection: "column" }}>
                                                <PentagonOne data={peerEmpChart[peerChartIndex]} /></div>
                                            <div style={{ display: "flex", minWidth: "5px", flexDirection: "column", marginRight: '20px' }}>
                                                <Button onClick={peerHandleNext} disabled={peerChartIndex === peerEmpChart.length - 1} style={{ marginLeft: '1px' }}>다음</Button> </div>
                                        </>
                                    )}
                                    {(peerEmpChart.length === 0 || peerEmpChart[peerChartIndex]?.scores?.length === 0) && (
                                        <p>데이터가 없습니다.</p>
                                    )}
                                </Card.Body>
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
    )
}
export default PerEvalStatus;