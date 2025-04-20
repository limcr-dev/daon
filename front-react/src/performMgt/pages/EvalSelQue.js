import React, { useEffect, useState } from "react";

import { Card } from 'react-bootstrap';

import Leftbar from "../../common/pages/Leftbar";
import LeftbarDEvaluation from "../components/LeftbarDEvaluation";

import { Container, Content } from "rsuite";
import QuesList from "./sub/QuesList";


// 자기 평가 문제 불러오기
const EvalSelQue = () => {

    const [testList, setTestList] = useState([]);

    // 테스트 리스트 불러오기
    useEffect(() => {
        fetch("http://localhost:8081/performMgt/testListT", {
            method: "GET",
        })
            .then((res) => res.json())
            .then((res) => {
                // '자기평가'만 필터링
                const filtered = res.filter(test => test.eval_emp_type === '자기평가');
                console.log('자기평가만 필터링', filtered);
                setTestList(filtered);
            })
            .catch((error) =>
                console.error("데이터 가져오기 오류 : ", error));
    }, []);

    const [quesList, setQuesList] = useState([]);
    // 문제 불러오기
    const startTest = (orderNum) => {
        if (window.confirm(`${orderNum}번 테스트를 시작할까요?`)) {

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

                        <h2 className="mb-4">✏️ 자기 평가</h2>
                        <Card align="center">

                            <h5 className="line"> 역량 테스트 리스트 </h5>

                            <div className="linenomal">&nbsp;</div>
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
                            <Card.Body>
                                {quesList.length > 0 ? (quesList.map(ques => (

                                    <QuesList key={ques.eval_ques_id} ques={ques} />))
                                ) : (
                                    <p> 질문을 불러오는 중...</p>

                                )
                                }

                                <br />

                            </Card.Body>


                        </Card>

                    </div>
                </Content>
            </Container>
        </Container>
    );

};

export default EvalSelQue;