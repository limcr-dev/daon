
import { useUser } from "../../common/contexts/UserContext";
import React, { useEffect, useState } from "react";

//import React, { useEffect, useState } from "react";
import { Card } from 'react-bootstrap';

import Leftbar from "../../common/pages/Leftbar";
import LeftbarDEvaluation from "../components/LeftbarDEvaluation";

import { Container, Content, Button } from "rsuite";
import QuesList from "./sub/QuesList";


// 동료 평가 문제 불러오기
const EvalPeerQue = () => {

    const { user } = useUser();
    const [testList, setTestList] = useState([]);
    const [quesList, setQuesList] = useState([]);
    const [peerList, setPeerList] = useState([]);
    const [selectedPeer, setSelectedPeer] = useState("");

    const [answers, setAnswers] = useState({});

    const handleScoreChange = (quesId, { comp, score }) => {
        setAnswers(prev => ({
            ...prev,
            [quesId]: { comp, score }
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!user || !selectedPeer) {
            alert("사용자 정보 또는 피평가자를 선택해주세요.");
            return;
        }
    
        const answerList = Object.values(answers);
    
        // if (answerList.length !== 5) {
        //     alert("모든 질문에 응답해주세요.");
        //     return;
        // }
    
        const payload = {
            eval_peer_no: selectedPeer,       // 피평가자
            eval_no: user.emp_no,             // 평가자
            eval_type: "동료평가",
            eval_comp1: answerList[0].comp,
            eval_comp1_score: answerList[0].score,
            eval_comp2: answerList[1].comp,
            eval_comp2_score: answerList[1].score,
            eval_comp3: answerList[2].comp,
            eval_comp3_score: answerList[2].score,
            eval_comp4: answerList[3].comp,
            eval_comp4_score: answerList[3].score,
            eval_comp5: answerList[4].comp,
            eval_comp5_score: answerList[4].score,
            eval_total_score: answerList.reduce((acc, cur) => acc + cur.score, 0),
            eval_status: "제출완료",
        };
    
        try {
            const res = await fetch("http://localhost:8081/performMgt/evalPeerInsert", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("auth_token")}`
                },
                body: JSON.stringify(payload)
            });
    
            if (res.ok) {
                alert("평가가 성공적으로 저장되었습니다!");
                // 초기화하거나, 다른 페이지로 이동하는 코드 여기에!
            } else {
                alert("저장에 실패했습니다.");
            }
        } catch (err) {
            console.error("평가 저장 중 오류:", err);
        }
    };

    // 테스트 리스트 불러오기
    useEffect(() => {
        fetch("http://localhost:8081/performMgt/testListT", {
            method: "GET",
        })
            .then((res) => res.json())
            .then((res) => {
                // '동료평가'만 필터링
                const filtered = res.filter(test => test.eval_emp_type === '동료평가');
                console.log("동료평가만 필터링", filtered);
                setTestList(filtered);
            })
            .catch((error) =>
                console.error("데이터 가져오기 오류 : ", error));
    }, []);


    // 동료 리스트 불러오기!
    useEffect(() => {
        console.log("동료 리스트 불러오기 시작!");
        fetch('http://localhost:8081/performMgt/peerList/', {
            method: "GET",
        })
            .then((res) => res.json())
            .then((data) => {
                // '같은 팀만 필터링
                if (user) {
                    const filteredPeers = data.filter(
                        peer => peer.dept_no === user.dept_no &&  // 같은 부서사람
                            peer.emp_no !== user.emp_no   // 나는 제외
                        //&&  !evaluatedPeers.includes(peer.emp_no) //평가한 사람은 제외!
                    );
                    setPeerList(filteredPeers);
                }

            })
            .catch((err) => console.error("동료 리스트 불러오기 실패", err));
    }, [user]);

    // 문제 불러오기
    const startTest = (orderNum) => {
        if (!selectedPeer) {
            alert("평가할 동료를 먼저 선택해 주세요!");
            return;
        }

        if (window.confirm(`${orderNum}번 테스트를 ${selectedPeer}에게 시작할까요?`)) {
            //만약에 평가하고자 하는 사람을 선택안했으면 안돼! 
            fetch(`http://localhost:8081/performMgt/queslist/${orderNum}`, {
                method: "GET",
            })
                .then((data) => data.json())
                .then((data) => {
                    console.log("응답", data);
                    setQuesList(data);

                })
                .catch((error) =>
                    console.error("데이터 가져오기 오류 : ", error));
        }
    };



    return (

        <Container style={{ minHeight: '100vh', width: '100%' }}>
            <Leftbar />
            <Container>
                <LeftbarDEvaluation />
                <Content>
                    <div className="main-content p-4">

                        <h2 className="mb-4">✏️ 동료 평가</h2>
                        <Card align="center">

                            <h5 className="line"> 역량 테스트 리스트 </h5>

                            <div className="linenomal">&nbsp;</div>
                            {/* 동료 선택 드롭다운 */}
                            <div style={{ marginBottom: "20px" }}>
                                <label><strong>동료 선택 : &nbsp; </strong></label>
                                <select
                                    value={selectedPeer}
                                    onChange={(e) => setSelectedPeer(e.target.value)}
                                    style={{ padding: "8px", fontSize: "16px", width: "200px" }}
                                >
                                    <option value="">동료를 선택하세요</option>
                                    {peerList.map((peer, index) => (
                                        <option key={index} value={peer.emp_no}>
                                            {peer.emp_no || `동료 ${index + 1}`}
                                            {peer.emp_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <table className="comp-table">
                                <thead>
                                    <tr>
                                        <th className="comp-th">순번</th>
                                        <th className="comp-th"> 등록일 </th>
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
                                                    <td className="comp-td">{test.eval_emp_type || "정보 없음"}</td>
                                                    <td className="comp-td">{test.eval_click_emp || "정보 없음"}</td>

                                                    <td className="comp-td">

                                                        <button className="subno" type="button" onClick={() => startTest(test.eval_order_num)} >테스트 하기</button>

                                                    </td>
                                                </tr>
                                            ))}
                                        </>
                                    ) : (
                                        <tr>
                                            <td colSpan={6} align="center">
                                                테스트 리스트 불러오는 중...
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </Card>
                        <Card>
                            <form>
                                <Card.Body>

                                    {quesList.length > 0 ? (quesList.map(ques => (

                                        <QuesList key={ques.eval_ques_id} ques={ques}
                                            onScoreChange={handleScoreChange}
                                            selectedScore={answers[ques.eval_ques_id]?.score || null} />))
                                    ) : (
                                        <p> 테스트 리스트 불러오는 중...</p>

                                    )
                                    }

                                    <br />

                                </Card.Body>
                                <div align='right'>
                                    <Button className="subutt" type="submit"  onClick={handleSubmit}> 제출하기  </Button>
                                </div>
                            </form>
                        </Card>

                    </div>
                </Content>
            </Container>
        </Container>
    );

};

export default EvalPeerQue;