import { request } from "../../common/components/helpers/axios_helper"

import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import Leftbar from "../../common/pages/Leftbar";
import LeftbarDEvaluation from "../components/LeftbarDEvaluation";
import { Button, Container, Content, Radio, RadioGroup } from "rsuite";
import CompList from './sub/CompList';
import { useNavigate } from "react-router-dom";
import TestList from './sub/TestList';
import Header from "../../common/pages/Header";

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
        registration: '',
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
        request("get", "/performMgt/compList")
            .then(comp => {
                // console.log("Fetched Data : ", comp);
                setCompList(comp.data);
            })
            .catch(error => console.error("Error fetching data :", error))
    }, [])


    // 마지막 번호를 받아서 +1세팅, 3자리 숫자로 생성
    useEffect(() => {
        request("get", "/performMgt/lastOrderNum")
            .then(res => {
                const text = res?.data ?? "000";  // null이거나 undefined 이면 "000"
                console.log("서버응답:", text);

                const last = parseInt(text, 10);

                // 숫자가 아닌 경우 → 0으로 간주
                const safeLast = isNaN(last) ? 0 : last;

                // if(isNaN(last)){
                //     console.error("숫자가 아닙니다.", text);
                //     alert("서버에서 유효한 번호를 받지 못했습니다!");
                //     return; // 저장x
                // }
                const next = (safeLast + 1).toString().padStart(3, '0');
                setOrderNum(next);
                setTest(prev => ({ ...prev, eval_order_num: next }));
            })
            .catch(err => {
                console.error("lastOrderNum API 호출 실패:", err);
                alert("서버에서 평가 번호를 받아오지 못했습니다!");
            });
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
        
        request("post", "/performMgt/insertComp" , test)
            .then((res) => {
                if (res.status === 201) {
                    alert("성공적으로 저장되었습니다");
                    navigate(0);
                } else {
                    alert("저장 실패");
                }
            })
            .catch((err) => {
                console.error("서버 오류 :", err);
            });
        }
       

        return (
            <Container style={{ minHeight: '100vh', width: '100%' }}>
                <Leftbar />
                <Container>
                    <LeftbarDEvaluation />
                    <Content>
                        <Header />
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