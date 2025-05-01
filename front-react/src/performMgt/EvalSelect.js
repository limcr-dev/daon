import { request } from "../common/components/helpers/axios_helper"
import { Container, Content } from "rsuite";
import { Card } from "react-bootstrap";
import Leftbar from "../common/pages/Leftbar";
import LeftbarDEvaluation from "./components/LeftbarDEvaluation";
import GradeChart from "./GradeChart";
import { useEffect, useState } from "react";
import Header from "../common/pages/Header";
import { getDeptName, getPositionName } from "../hrMgt/components/getEmployeeInfo";
import GoalpieOneChart from "./GoalpieOneChart";
import "../performMgt/css/EvalList.css"

const EvalSelect = () => {
    const [evalList, setEvalList] = useState([]);
    const [goalpieOneChart, setGoalpieOneChart] = useState([]);
    const [gradeChart, setGradeChart] = useState([]);
    // 전체 직원 평가 리스트 
    useEffect(() => {
        request('GET', `/perform/evalStatus`)
            .then(res => {
                if (!Array.isArray(res.data)) {
                    console.warn("evalStatus 응답이 배열 아님:", res.data);
                    return;
                }
                const employees = res.data;

                // 여기서 Promise.all 로 두개 동시에!
                Promise.all([
                    request('GET', `/perform/peerStatus`),
                    request('GET', `/perform/attandTotalScore`)
                ])
                    .then(([peerRes, attandRes]) => {
                        console.log("동료평가진행현황", peerRes.data);
                        console.log("근태평가 점수", attandRes.data);

                        const peerList = Array.isArray(peerRes?.data) ? peerRes.data : [];
                        const attandList = Array.isArray(attandRes?.data) ? attandRes.data : [];

                        const mergedList = Array.isArray(employees) ? employees.map(emp => {
                            const peerInfo = peerList.find(peer => peer.eval_emp_no === emp.emp_no);
                            const attandInfo = attandList.find(att => att.emp_no === emp.emp_no);

                            return {
                                ...emp,
                                peer_cnt: peerInfo?.peer_cnt || null,
                                peer_total_cnt: peerInfo?.peer_total_cnt || null,
                                attand_avg: attandInfo?.attand_avg || null,
                            };
                        }) : []; // <= 배열이 아닐 경우 빈 배열로 보장

                        setEvalList(mergedList);
                        const setSelf = getCntGrade(res.data, "self");
                        const setPeer = getCntGrade(res.data, "peer");
                        const setAttand = getCntGrade(mergedList, "attand");
                        setGradeChart([
                            { name: "자기평가", ...setSelf },
                            { name: "동료평가", ...setPeer },
                            { name: "근태평가", ...setAttand },
                        ]);

                        // 아래 줄들도 안전하게 reduce 사용
                        const totalCompleted = mergedList.reduce(
                            (sum, emp) => sum + (emp.self_cnt || 0) + (emp.peer_cnt || 0), 0
                        );

                        const totalTasks = mergedList.reduce(
                            (sum, emp) => sum + (emp.self_total_cnt || 0) + (emp.peer_total_cnt || 0), 0
                        );

                        const helpdata = () => {
                            if (totalTasks === 0) return [];
                            return [
                                { name: "완료", value: totalCompleted },
                                { name: "미완료", value: totalTasks - totalCompleted },
                            ];
                        }
                        const format = helpdata()
                        setGoalpieOneChart(format);
                    })
                    .catch((error) => {
                        console.error("동료평가나 근태평가 가져오기 오류 : ", error);
                    });
            })
            .catch((error) =>
                console.error("데이터 가져오기 오류 : ", error));
    }, []);

    const getGrade = (avg) => {
        if (avg >= 93 && avg <= 100) {
            return "S";
        } else if (avg >= 83 && avg <= 92) {
            return "A";
        } else if (avg >= 75 && avg <= 82) {
            return "B";
        } else if (avg >= 65 && avg <= 74) {
            return "C";
        } else if (avg >= 36 && avg <= 64) {
            return "D";
        } else {
            return "F";
        }
    }
    const getCntGrade = (evalList, type = "self") => {
        const distribute = { S: 0, A: 0, B: 0, C: 0, D: 0, F: 0 };

        evalList.forEach(emp => {
            let score;
            if (type === "self") {
                score = emp.self_avg;
            } else if (type === "peer") {
                score = emp.peer_avg;
            } else if (type === "attand") {
                score = emp.attand_avg;
            }
            if (score != null) { // score가 존재할 때만
                const grade = getGrade(score);
                distribute[grade]++;
            }
        });
        return distribute;
    };

    return (
        <Container style={{ minHeight: '100vh', width: '100%' }}>
            <Leftbar />
            <Container>
                <LeftbarDEvaluation />
                <Content>
                    <Header />
                    <Card align="center">
                        <h5 className="line"> 전체 통계 </h5>
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "stretch" }}>

                            <Card className='eval-card' style={{ flex: "1" }}>
                                {/* 상단 상태 표시 */}
                                <Card.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#f5f5f5', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                                    <h6>등급분포도</h6>
                                </Card.Header>
                                {/* 본문 */}
                                <Card.Body style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <div style={{ flex: "1", minWidth: "450px" }}>
                                        <GradeChart data={gradeChart} /></div>
                                </Card.Body>
                            </Card>

                            <Card className='eval-card' style={{ flex: "1" }}>
                                <Card.Header className="eval-tab">

                                    <h6>전체 진행 현황</h6>
                                </Card.Header>
                                <Card.Body style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    {goalpieOneChart.length > 0 && (
                                        <>
                                            <div style={{ display: "flex", minWidth: "150px", alignItems: "center", flexDirection: "column" }}>
                                                <GoalpieOneChart data={goalpieOneChart} /></div>

                                        </>
                                    )}{(goalpieOneChart.length === 0) && (
                                        <p>목표 데이터가 없습니다.</p>
                                    )}
                                </Card.Body>
                            </Card>
                        </div>

                        <Card className='eval-card' style={{ flex: "1" }}>
                            <table className='eval-table'>
                                <thead>
                                    <tr>
                                        <th>이름 (사번)</th>
                                        <th>자기평가 <br />(완료/전체)</th>
                                        <th>동료평가 <br />(완료/전체)</th>
                                        <th>근태평가</th>
                                        <th>부서</th>
                                        <th>직급</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {evalList.length > 0 ? (
                                        <>
                                            {evalList.map((item, evalIndex) => (
                                                <tr key={evalIndex}>
                                                    <td>{item.emp_name}<br />({item.emp_no})</td>
                                                    <td>{getGrade(item.self_avg)} 등급 <br />  ({item.self_cnt}/{item.self_total_cnt})</td>
                                                    <td>{getGrade(item.peer_avg)} 등급 <br />    ({item.peer_cnt}/{item.peer_total_cnt})</td>
                                                    <td>{getGrade(item.attand_avg)}등급 </td>
                                                    <td>{getDeptName(item.dept_no)}</td>
                                                    <td>{getPositionName(item.position_id)}</td>
                                                </tr>
                                            ))}
                                        </>
                                    ) : (
                                        <tr>
                                            <td>
                                                정보가 없음
                                            </td>
                                        </tr>)}
                                </tbody>
                            </table>
                        </Card>
                    </Card>
                </Content>
            </Container>
        </Container >
    );
};
export default EvalSelect;