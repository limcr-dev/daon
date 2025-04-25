import { request } from "../../common/components/helpers/axios_helper"
import React, { useEffect, useState } from "react";
import Leftbar from "../../common/pages/Leftbar";
import LeftbarDEvaluation from "../components/LeftbarDEvaluation";
import { Button, Col, Container, Content } from "rsuite";
import { Card } from "react-bootstrap";
import { useUser } from '../../common/contexts/UserContext';
import "../css/EvalList.css";
import { getDeptName, getPositionName, getRoleName } from "../../hrMgt/components/getEmployeeInfo";


const EvalList = () => {
    const { user } = useUser();

    const [testList, setTestList] = useState([]);


    useEffect(() => {
        request('GET', "/performMgt/testListT")
            .then(res => {
                setTestList(res.data);
            })
            .catch((error) =>
                console.error("데이터 가져오기 오류 : ", error));
    }, []);



    // 삭제
    const deleteTest = (orderNum) => {
        if (window.confirm(`${orderNum}번 데이터를 정말 삭제할까요?`))

            request('DELETE', `/performMgt/testList/${orderNum}`)
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
    // 전체 직원 평가 리스트 
    useEffect(() => {
        request('GET', `/performMgt/evalStatus`)
            .then(res => {
                setEvalList(res.data);

                console.log("직원리스트", res.data)
            })
            .catch((error) =>
                console.error("데이터 가져오기 오류 : ", error));
    }, []);

    const getGrade = (self_avg) => {
        return self_avg;
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
                            {/* <Col style={{ marginBottom: '20px' , width: '98%' }}> */}
                            <h5 className="line"> 통계 </h5>
                            <Card className='eval-card'>
                                {/* 상단 상태 표시 */}
                                <Card.Header style={{ display: 'flex', justify: 'end' }}>
                                    <span>
                                        대시보드
                                    </span>
                                </Card.Header>

                                {/* 본문 */}
                                <Card.Body className="p-4 space-y-2">
                                    <p style={{ fontWeight: '600', fontSize: '16px' }}>
                                        대시보드
                                    </p>

                                </Card.Body>

                                {/* 하단 버튼 */}
                                <Card.Footer>
                                    <Button>
                                        자세히 보러가기???
                                    </Button>
                                </Card.Footer>
                            </Card>

                            {/* </Col>  */}

                            {/* <Col style={{ marginBottom: '20px', width: '98%' }}> */}

                            <Card className='eval-card'>
                                <Card.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#f5f5f5', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                                    <h5 style={{marginLeft:'20px'}}> 직원 리스트 </h5>
                                </Card.Header>

                                <table className='eval-table'>
                                    <thead>
                                        <tr>
                                            <th>이름 (사번)</th>
                                            <th>자기평가</th>
                                            <th>동료평가</th>
                                            <th>완료/전체</th>
                                            <th>부서</th>
                                            <th>직급</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {evalList.eval_emp_no}
                                        {evalList.length > 0 ? (
                                            // {item.emp_img}
                                            <>
                                                {evalList.map((item, evalIndex) => (
                                                    <tr key={evalIndex}>
                                                        <td>{item.emp_name}&nbsp;({item.emp_no})</td>
                                                        <td>{getGrade(item.self_avg)}</td>
                                                        <td>{getGrade(item.peer_avg)}</td>
                                                        <td>{item.self_cnt}/{item.self_total_cnt}</td>
                                                        <td>{getDeptName(item.dept_no)}</td>
                                                        <td>{getPositionName(item.position_id)}</td>

                                                        <td>상세보기</td>
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

                                {/* <Card.Body className="p-4 space-y-2">
                                <p style={{ fontWeight: '600', fontSize: '16px' }}>
                                    대시보드
                                </p>

                            </Card.Body>

                            {/* 하단 버튼 */}
                                {/* <Card.Footer>
                                <Button>
                                    자세히 보러가기???
                                </Button>
                            </Card.Footer> */}
                            </Card>
                            {/* </Col>*/}
                        </Card>
                    </div>
                </Content>
            </Container>
        </Container >

    )


}
export default EvalList;