import { useEffect, useState } from "react";

import { Card } from "react-bootstrap";

import Leftbar from "../../common/pages/Leftbar";
import LeftbarDEvaluation from "../components/LeftbarDEvaluation";

import { Button, Container, Content, Radio, RadioGroup } from "rsuite";
import CompList from './sub/CompList';
import { useNavigate } from "react-router-dom";
import TestList from './sub/TestList';


// 관리자 평가 역량 선택해서 테스트 만들기
const CheckComp = () => {
    const navigate = useNavigate();
    // oder num 초기값 설정
    const [orderNum, setOrderNum] = useState('001');

    // 서버에 전송할 데이터 TEST 세팅 (선택된 역량과 평가 유형과 순서번호)
    const [test, setTest] = useState({
        eval_emp_type: '',
        eval_click_emp: '',
        eval_order_num: '',
        registration:'',
    });


    // 서버에서 받아온 역량평가 리스트 세팅
    const [compList, setCompList] = useState([]);

    // 사용자가 클릭해서 선택한 역량ID 세팅
    const [clicked, setClicked] = useState([]);


    // 클릭핸들  >  선택해제가능
    const handleClick = (compId) => {
        setClicked((prev) =>
            prev.includes(compId)
                ? prev.filter((id) => id !== compId)
                : [...prev, compId]
        );
    };
    // 선택된 항목을 test상태에 반영
    useEffect(() => {
        setTest((prevTest) => ({
            ...prevTest,
            eval_click_emp: clicked.join(", "),
        }));

    }, [clicked]);


    // 사용자가 평가 유형을 선택했을 때  전송힐 데이터 준비
    const changeValue = ({ name, value }) => {
        setTest((prevTest) => ({
            ...prevTest,
            [name]: value,  // name의 값을 업데이트          
        }));
    };

    // 컴포넌트 처음 랜더링 될때 역량 리스트 가져와서 배열
    useEffect(() => {
        // alert("test");
        fetch("http://localhost:8081/performMgt/compList", {
            method: "GET"
        }).then(res => res.json())
            .then(comp => {
                // console.log("Fetched Data : ", comp);
                setCompList(comp);
            })
            .catch(error => console.error("Error fetching data :", error))
    }, [])


    // 마지막 번호를 받아서 +1세팅, 3자리 숫자로 생성
    useEffect(() => {
        fetch("http://localhost:8081/performMgt/lastOrderNum")
            .then(res => res.text())
            .then(text => {
                console.log("서버응답 lastOrderNum:", text);
                const last = parseInt(text || '0', 10);
                const next = (last + 1).toString().padStart(3, '0');
                setOrderNum(next);
                setTest(prev => ({ ...prev, eval_order_num: next }));
            })
            .catch(err => console.error("lastOrderNum API 호출 실패:", err));
    }, []);

    //  서버로 데이터 보내기 
    const insertComp = (e) => {

        e.preventDefault();

        console.log("insert 실행!")
        console.log("전송데이터:", test);

        // 평가 유형이 선택 되지 않았을 경우 알림
        if (!test.eval_emp_type) {
            alert("평가 유형을 선택해 주세요!");
            return; // 함수 종료
        }

        // 선택된 역량의 개수가 5개가 아닐 경우 알림
        if (clicked.length !== 5) {
            alert("역량을 5개 꼭!! 선택해야 합니다!");
            return; // 함수 종료
        }

        // 전송할 데이터 준비
        // const newTest = {
        //     ...test,
        //     eval_click_emp: clicked.join(", "),
        // };

        fetch("http://localhost:8081/performMgt/insertComp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify(test)  // javascript 오브젝트를 json으로 변경해서 넘긴다.
        })   // 데이터를 스프링 부트에서 insert하고 201을 리턴
            .then((res) => {
                console.log("서버 응답 상태", res.status);
                if (res.status === 201) {
                    return res.json();
                } else {
                    throw new Error("서버 응답 에러");
                }
            })
            .then((data) => {
                console.log('서버 응답 데이터', data);
                if (data !== null) {
                    alert("성공적으로 저장되었습니다.");
                    // react-router-dom v6에서 현재 위치 새로고침
                    navigate(0);
                    // 전체 새로고침 window.location.reload();은 react를 쓰는 의미가 없어짐
                } else {
                    alert("역량 선택을 저장하는데 실패했습니다.");
                }
            })
            .catch((error) => {
                console.log('실패', error);
            })
    }

    return (
        <Container style={{ minHeight: '100vh', width: '100%' }}>
            <Leftbar />
            <Container>
                <LeftbarDEvaluation />
                <Content>
                    <div className="main-content p-4">

                        <h2 className="mb-4"> 역량 선택(5가지)</h2>

                        <TestList />

                        <Card>
                            <Card.Body>
                                {/* clicked.join(", ") */}

                                <form onSubmit={insertComp}>
                                    <Button className="subutt" type="submit">평가 유형 및 역량 선택 </Button>
                                    <div className="linenomal">&nbsp;</div>
                                    <Card>
                                        <RadioGroup label="평가 유형" name="eval_emp_type" onChange={(value) => changeValue({ name: "eval_emp_type", value })}>
                                            <Radio value="자기평가" > 자기 평가 </Radio>
                                            <Radio value="동료평가" > 동료 평가 </Radio>
                                        </RadioGroup>
                                    </Card>
                                </form>

                                <h4 className="line">선택된 역량 개수 :{clicked.length} /5 </h4>
                                <h5 className="line">현재 선택된 역량 : {clicked.join(", ")}</h5>

                                {compList.length > 0 ? (compList.map(comp => (

                                    <CompList
                                        key={comp.eval_comp_id}
                                        comp={comp}
                                        clicked={clicked}
                                        onClick={handleClick}

                                    />
                                ))
                                ) : (
                                    <p> 역량 불러오는 중...</p>

                                )
                                }

                            </Card.Body>

                        </Card>

                    </div>
                </Content>
            </Container>
        </Container >
    );


};
export default CheckComp;