import { request } from "../../common/components/helpers/axios_helper"
import React, { useEffect, useState } from "react";
import Leftbar from "../../common/pages/Leftbar";
import LeftbarDEvaluation from "../components/LeftbarDEvaluation";
import { Container, Content } from "rsuite";
import { Card } from "react-bootstrap";
import "../css/EvalList.css";
import { getDeptName, getPositionName } from "../../hrMgt/components/getEmployeeInfo";
import GradeChart from "../GradeChart";
import { useNavigate } from "react-router-dom";
import Header from "../../common/pages/Header";


const EvalList = () => {
    const navigate = useNavigate();
    const [testList, setTestList] = useState([]);

    useEffect(() => {
        request('GET', "/perform/testListT")
            .then(res => {
                if (Array.isArray(res.data)) {
                    setTestList(res.data);
                }
                else {
                    console.warn("응답이 배열이 아님:", res.data);
                }
            })
            .catch((error) =>
                console.error("데이터 가져오기 오류 : ", error));
    }, []);

    // 삭제
    const deleteTest = (orderNum) => {
        if (window.confirm(`${orderNum}번 데이터를 정말 삭제할까요?`))

            request('DELETE', `/perform/testList/${orderNum}`)
                .then((res) => {
                    console.log("삭제 응답", res.data);
                    if (res.data === "ok") {
                        alert("삭제완료");

                        // 삭제 후 리스트 갱신
                        setTestList(prev => prev.filter(test => test.eval_order_num !== orderNum))
                    } else {
                        alert("삭제 실패");
                    }
                })
                .catch((error) => {
                    console.error("삭제오류: ", error);
                    alert("오류가 발생했습니다");
                    if (error.response) {
                        console.log("서버 응답 상태 : ", error.response.status);
                        console.log("서버 응답 메세지 : ", error.response.LeftbarDEvaluation);
                    } else {
                        alert("네트워크 오류 또는 서버 연결 실패");
                    }
                });
    }

    const [evalList, setEvalList] = useState([]);
    const [gradeChart, setGradeChart] = useState([]);

    // 전체 직원 평가 리스트 
    useEffect(() => {
        request('GET', `/perform/evalStatus`)
            .then(res => {
                if (Array.isArray(res.data)) {
                    console.log("직원리스트", res.data)

                    const employees = res.data;

                    // 여기서 Promise.all 로 두개 동시에!
                    Promise.all([
                        request('GET', `/perform/peerStatus`),
                        request('GET', `/perform/attandTotalScore`)
                    ])
                        .then(([peerRes, attandRes]) => {
                            console.log("동료평가진행현황", peerRes.data);
                            console.log("근태평가 점수", attandRes.data);

                            const peerList = Array.isArray(peerRes.data) ? peerRes.data : [];
                            const attandList = Array.isArray(attandRes.data) ? attandRes.data : [];

                            const mergedList = employees.map(emp => {
                                const peerInfo = peerList.find(peer => peer.eval_emp_no === emp.emp_no);
                                const attandInfo = attandList.find(att => att.emp_no === emp.emp_no);

                                return {
                                    ...emp,
                                    peer_cnt: peerInfo?.peer_cnt || null,
                                    peer_total_cnt: peerInfo?.peer_total_cnt || null,
                                    attand_avg: attandInfo?.attand_avg || null,
                                };
                            });

                            setEvalList(mergedList);


                            const setSelf = getCntGrade(res.data, "self");
                            const setPeer = getCntGrade(res.data, "peer");
                            const setAttand = getCntGrade(mergedList, "attand");
                            setGradeChart([
                                { name: "자기평가", ...setSelf },
                                { name: "동료평가", ...setPeer },
                                { name: "근태평가", ...setAttand },
                            ]);

                        })
                        .catch((error) => {
                            console.error("동료평가나 근태평가 가져오기 오류 : ", error);
                        });
                } else {
                    console.warn("응답이 배열이 아님:", res.data);
                }
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
                    <div>
                        <Card align="center">
                            <h5 className="line"> 현재 등록된 역량 테스트 </h5>
                            <div className="linenomal">&nbsp;</div>
                            <table className="comp-table">
                                <thead>
                                    <tr>
                                        <th className="comp-th">순번</th>
                                        <th className="comp-th"> 등록일 </th>
                                        <th className="comp-th"> 마감일 </th>
                                        <th className="comp-th"> 평가유형 </th>
                                        <th className="comp-th"> 평가역량 </th>
                                        <th className="comp-th">  </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {testList.length > 0 ? (
                                        <>
                                            {testList.map((test, index) => (
                                                <tr key={index}>
                                                    <td className="comp-td">{test.eval_order_num || "정보 없음"}</td>
                                                    <td className="comp-td">{test.eval_start_date || "정보 없음"}</td>
                                                    <td className="comp-td">{test.eval_end_date || "정보 없음"}</td>
                                                    <td className="comp-td">{test.eval_emp_type || "정보 없음"}</td>
                                                    <td className="comp-td">{test.eval_click_emp || "정보 없음"}</td>
                                                    <td className="comp-td">
                                                        <button className="subno" type="button" onClick={() => deleteTest(test.eval_order_num)}>삭제</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </>
                                    ) : (
                                        <tr>
                                            <td colSpan={6} align="center">
                                                등록된 데이터가 없습니다.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </Card>
                        <Card align="center">
                            <h5 className="line"> 통계 </h5>
                            <Card className='eval-card'>
                                {/* 상단 상태 표시 */}
                                <Card.Header style={{ display: 'flex', justify: 'end' }}>
                                    <span>
                                        등급분포도
                                    </span>
                                </Card.Header>
                                {/* 본문 */}
                                <Card.Body className="p-4 space-y-2">
                                    <GradeChart data={gradeChart} />
                                </Card.Body>
                            </Card>
                            <Card className='eval-card'>
                                <Card.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#f5f5f5', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                                    <h5 style={{ marginLeft: '20px' }}> 직원 리스트 </h5>
                                </Card.Header>
                                <table className='eval-table'>
                                    <thead>
                                        <tr>

                                            <th rowSpan={2}>이름  <br />(사번) </th>
                                            <th colSpan={2}>자기평가</th>
                                            <th colSpan={2}>동료평가</th>
                                            <th rowSpan={2}>근태평가</th>
                                            <th rowSpan={2}>부서</th>
                                            <th rowSpan={2}>직급</th>
                                            <th rowSpan={2}></th>
                                        </tr>
                                        <tr>
                                            <th>완료/전체</th>
                                            <th>점수</th>
                                            <th>완료/전체</th>
                                            <th>점수</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {evalList.length > 0 ? (
                                            <>
                                                {evalList.map((item, evalIndex) => (
                                                    <tr key={evalIndex}>
                                                        <td>{item.emp_name}<br />({item.emp_no})</td>
                                                        <td>({item.self_cnt}/{item.self_total_cnt})</td>
                                                        <td> {getGrade(item.self_avg)}등급<br />({item.self_avg})</td>
                                                        <td>({item.peer_cnt}/{item.peer_total_cnt})</td>
                                                        <td>{getGrade(item.peer_avg)}등급 <br />({item.peer_avg})</td>
                                                        <td>{getGrade(item.attand_avg)}등급<br />({item.attand_avg})</td>
                                                        <td>{getDeptName(item.dept_no)}</td>
                                                        <td>{getPositionName(item.position_id)}</td>
                                                        <td> <button onClick={() => navigate(`/performMgt/evaluation/detail/${item.emp_no}`)}>
                                                            상세보기
                                                        </button></td>
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
                    </div>
                </Content>
            </Container>
        </Container >
    )
}
export default EvalList;