import { request } from "../../common/components/helpers/axios_helper"
import { useUser } from "../../common/contexts/UserContext";
import React, { useEffect, useState } from "react";
import { Card } from 'react-bootstrap';
import Leftbar from "../../common/pages/Leftbar";
import LeftbarDEvaluation from "../components/LeftbarDEvaluation";
import { Container, Content, Button} from "rsuite";
import QuesList from "./sub/QuesList";
import { useNavigate } from "react-router-dom";
import Header from "../../common/pages/Header";

// 자기 평가 문제 불러오기
const EvalSelQue = () => {

    const { user } = useUser();
    const navigate = useNavigate();
    const [testList, setTestList] = useState([]);
    const [answers, setAnswers] = useState({});
    const [orderNum, setOrderNum] = useState(null);

    // 테스트 리스트 불러오기 
    useEffect(() => {
        request("get", "/performMgt/testListT")
            .then((res) => {
                console.log("자기평가 전체리스트", res.data);

                request("get", `/performMgt/selfList/${user.emp_no}`)
                    .then((response) => {
                        console.log("최종 자기평가 리스트:", response.data);

                        // selfList에서 eval_order_num 값들만 배열로 추출
                        const selfEvalNums = response.data.map(item => item.eval_order_num);

                        // testList에서 selfEvalNums에 해당하는 것만 필터링
                        const filtered = res.data.filter(test =>
                            selfEvalNums.includes(test.eval_order_num)
                        );
                        console.log("필터된 자기평가 리스트:", filtered);
                        setTestList(filtered);
                    })
                    .catch((error) => {
                        console.error("자기평가 리스트 가져오기 오류:", error);
                    });
            })
            .catch((error) => {
                console.error("데이터 가져오기 오류 : ", error);
            });
    }, [user]);


    const [quesList, setQuesList] = useState([]);

    // 문제 불러오기
    const startTest = (orderNum) => {
        const test = testList.find(t => t.eval_order_num === orderNum);
        if (new Date() > new Date(test.eval_end_date)) {
            alert("마감일이 지났습니다");
            return;
        }

        if (window.confirm(`${orderNum}번 테스트를 시작할까요?`)) {
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
            eval_order_num: orderNum,
            eval_emp_no: user.emp_no,             // 평가자   
            eval_type: "자기평가",
            eval_status: "제출완료",
            eval_total_score: answerList.reduce((sum, item) => sum + item.score, 0),

        };
        // comp1~comp5 채워넣기
        for (let i = 0; i < 5; i++) {
            payload[`eval_comp${i + 1}`] = compEntries[i]?.[0] || null;
            payload[`eval_comp${i + 1}_score`] = compEntries[i]?.[1] || 0;
        }

        try {
            const res = await request("post", `/performMgt/evalSelfInsert`, payload)

            if (res.status === 200 || res.data === "ok") {
                alert("평가가 성공적으로 저장되었습니다!");
                // 초기화하거나, 다른 페이지로 이동하는 코드 여기에!
                console.log("전달하는 값 : ", payload);
                navigate(0);
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

                        <h2 className="mb-4">✏️ 자기 평가</h2>
                        <Card align="center">

                            <h5 className="line"> 역량 테스트 리스트 </h5>

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
                                                        <button className="subno" type="button" onClick={() => startTest(test.eval_order_num)}> 테스트 하기 </button>

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



                        </Card>

                    </div>
                </Content>
            </Container>
        </Container>
    );

};

export default EvalSelQue;