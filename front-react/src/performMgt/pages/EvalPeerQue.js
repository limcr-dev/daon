import { request } from "../../common/components/helpers/axios_helper"
import { useUser } from "../../common/contexts/UserContext";
import React, { useEffect, useState } from "react";
import { Card } from 'react-bootstrap';
import Leftbar from "../../common/pages/Leftbar";
import LeftbarDEvaluation from "../components/LeftbarDEvaluation";
import { Container, Content, Button } from "rsuite";
import QuesList from "./sub/QuesList";
import { useNavigate } from "react-router-dom";
import Header from "../../common/pages/Header";

// 동료 평가 문제 불러오기
const EvalPeerQue = () => {

    const { user } = useUser();
    const navigate = useNavigate();
    const [testList, setTestList] = useState([]);
    const [quesList, setQuesList] = useState([]);
    const [peerList, setPeerList] = useState([]);
    const [selectedPeer, setSelectedPeer] = useState("");
    const [orderNum, setOrderNum] = useState(null);
    const [answers, setAnswers] = useState({});

    // 테스트 리스트 불러오기
    useEffect(() => {
        request("GET", "/performMgt/testListT")
            .then((res) => {
                // 동료평가 테스트 리스트를 불러온다.. 진행안함만?!
                request("GET", `/performMgt/peerList/${user.emp_no}`)
                .then((response)=>{
                    // peerList에서 eval_order_num 값들만 배열로 추출
                    const peerEvalNums = response.data.map(item =>item.eval_order_num);

                    // testList에서 peerEvalNums에 해당하는 것만 필터링
                    const refiltered = res.data.filter(test =>
                        peerEvalNums.includes(test.eval_order_num)
                    );
                    console.log("필터된 자기평가 리스트: " , refiltered);
                    setTestList(refiltered);
                })
               .catch((error)=>{
                console.error("동료평가 리스트 가져오기 오류 : ", error);
               }) ;
            })
            .catch((error) =>{
                console.error("데이터 가져오기 오류 : ", error);
    });
    }, [user]);


    // 동료 리스트 불러오기!
    useEffect(() => {
        console.log("동료 리스트 불러오기 시작!");
        request("GET", `/performMgt/peerList/${user.emp_no}`)
            .then((response) => {
                setPeerList(response.data);
                console.log(response.data);
            })
            .catch((err) => console.error("동료 리스트 불러오기 실패", err));
    }, [user]);

    // 문제 불러오기
    const startTest = (orderNum) => {
        const test = testList.find(t => t.eval_order_num === orderNum);
        if (new Date() > new Date(test.eval_end_date)) {
            alert("마감일이 지났습니다");
            return;
        }
        //만약에 평가하고자 하는 사람을 선택안했으면 안돼! 
        if (!selectedPeer) {
            alert("평가할 동료를 먼저 선택해 주세요!");
            return;
        }

        if (window.confirm(`${orderNum}번 테스트를 ${selectedPeer}에게 시작할까요?`)) {
            setOrderNum(orderNum); // 저장
            request("GET", `/performMgt/queslist/${orderNum}`)
                .then((data) => {
                    console.log("응답", data);
                    setQuesList(data.data);
                })
                .catch((error) =>
                    console.error("데이터 가져오기 오류 : ", error));
        }
    };
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

        // 답변 수와 질문 수 비교
        const answerCount = Object.keys(answers).length;
        const questionCount = quesList.length;

        if (answerCount < questionCount) {
            alert("모든 질문에 응답해주세요.");
            return;
        }

        // 답들의 value들만 가져와서 배열로 변환 
        const answerList = Object.values(answers);

        // 역량 별 점수 누적 객체 만들기
        const compScoreMap = {};

        answerList.forEach(({ comp, score }) => {
            if (!compScoreMap[comp]) {
                compScoreMap[comp] = 0;
            }
            compScoreMap[comp] += score;
        });
        const compEntries = Object.entries(compScoreMap);

        const payload = {
            eval_peer_no: selectedPeer,       // 피평가자
            eval_no: user.emp_no,             // 평가자
            eval_type: "동료평가",
            eval_status: "제출완료",
            eval_total_score: answerList.reduce((sum, item) => sum + item.score, 0),
            eval_order_num: orderNum,
        };


        // comp1~comp5 채워넣기
        for (let i = 0; i < 5; i++) {
            payload[`eval_comp${i + 1}`] = compEntries[i]?.[0] || null;
            payload[`eval_comp${i + 1}_score`] = compEntries[i]?.[1] || 0;
        }

        try {
            const res = await request("POST", "/performMgt/evalPeerInsert", payload);

            if (res.status === 200 || res.data > 0) {
                alert("평가가 성공적으로 저장되었습니다!");
                // 초기화하거나, 다른 페이지로 이동하는 코드 여기에!
                console.log("전달하는 값 : ", payload);
                navigate(0);
                // peer_target 상태도 DB 트리거로 자동 업데이트됨
            } else {
                alert("저장에 실패했습니다.");
            }
        } catch (err) {
            console.error("평가 저장 중 오류:", err);
        }
    };


    return (

        <Container style={{ minHeight: '100vh', width: '100%' }}>
            <Leftbar />
            <Container>
                <LeftbarDEvaluation />
                <Content>
                    <Header />
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
                                        <option key={index} value={peer.eval_peer_no}>
                                            {peer.eval_peer_no || `동료 ${index + 1}`}
                                            &nbsp; : {peer.emp_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
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

                                                        <button className="subno" type="button" onClick={() => startTest(test.eval_order_num)} >테스트 하기</button>

                                                    </td>
                                                </tr>
                                            ))}
                                        </>
                                    ) : (
                                        <tr>
                                            <td colSpan={6} align="center">
                                                정보를 불러오는 중...
                                                
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
                                        <p> 테스트 하기를 클릭하시면 문제가 보입니다!</p>

                                    )
                                    }

                                    <br />

                                </Card.Body>
                                <div align='right'>
                                    <Button className="subutt" type="submit" onClick={handleSubmit}> 제출하기  </Button>
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