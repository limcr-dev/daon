
import React, { useEffect, useState } from "react";
import Leftbar from "../../common/pages/Leftbar";
import LeftbarDEvaluation from "../components/LeftbarDEvaluation";
import { Container, Content } from "rsuite";
import { Card } from "react-bootstrap";
import { useUser } from '../../common/contexts/UserContext';



const EvalList = () => {
    const { user } = useUser();

    const [evalList, setEvalList] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8081/performMgt/testListT", {
            method: 'GET',
        })
            .then(res => res.json())
            .then(data => {
                setEvalList(data);
            })
            .catch((error) =>
                console.error("데이터 가져오기 오류 : ", error));
    }, []);
    // 삭제
    const deleteTest = (orderNum) => {
        if (window.confirm(`${orderNum}번 데이터를 정말 삭제할까요?`))

            fetch(`http://localhost:8081/performMgt/evalList/${orderNum}`, {
                method: 'DELETE',
            })
                .then((res) => res.text())
                .then((res) => {
                    if (res === "ok") {
                        alert("삭제완료");
                        // 삭제 후 리스트 갱신
                        setEvalList(prev => prev.filter(test => test.eval_order_num !== orderNum))
                    } else {
                        alert("삭제 실패");
                    }
                });
    }


    return (
        <Container style={{ minHeight: '100vh', width: '100%' }}>
            <Leftbar />
            <Container>
                <LeftbarDEvaluation />
                <Content>
                    <div>

                        <Card align="center">

                            <h5 className="line"> 현재 등록된 역량 테스트 </h5>


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
                                    {evalList.length > 0 ? (

                                        <>
                                            {evalList.map((test, index) => (
                                                <tr key={index}>
                                                    <td className="comp-td">{test.eval_order_num || "정보 없음"}</td>
                                                    <td className="comp-td">{test.eval_start_date || "정보 없음"}</td>
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
                                                테스트 데이터가 없습니다.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </Card>

                    </div>
                </Content>
            </Container>
        </Container >

    )


}
export default EvalList;