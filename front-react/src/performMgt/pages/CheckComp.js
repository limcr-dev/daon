import { useEffect, useState } from "react";

import { Card } from "react-bootstrap";

import Leftbar from "../../common/pages/Leftbar";
import LeftbarDEvaluation from "../components/LeftbarDEvaluation";

import { Button, Container, Content } from "rsuite";
import CompList from './sub/CompList';


const CheckComp = () => {
    
    const [compList, setCompList] = useState([]);

    // clicked 버튼이 클릭되었는지를 저장하는 상태
    const [clicked, setClicked] = useState([]);

    useEffect(() => {
        alert("test");
        fetch("http://localhost:8081/performMgt/complist", {
            method: "GET"
        }).then(res => res.json())
            .then(comp => {
                console.log("Fetched Data : ", comp);
                setCompList(comp);
            })

            .catch(error => console.error("Error fetching data :", error))
    }, [])

    const handleClick = (compId) =>{
        if (!compId){
            console.error("오류 : compId 가 유효하지 않음!", compId);
            return; // 상태 없데이트 방지  
        }
        setClicked((prev)=>{
            if(prev.includes(compId)){
                console.log("이미 선택된 항목 -> 해제");
                return prev.filter((id) => id !== compId);
            }

            // 최대 5개까지만 선택가능
            if(prev.length >= 5){
                alert("역량은 최대 5개 까지 선택 가능합니다.");
                console.log("최대개수 초과! 상태 변경 안함");
                return prev; // 기존 배열 유지(업데이트x)
            }
            // 새로운 항목 추가
            //return [...prev, compId];
            const newClicked = [...prev, compId];
            console.log("추가된 상태 : ", newClicked);
            return newClicked;
        });
        console.log("compClicked 역량 클릭;", compId);
    };

    console.log("현재 선택된 역량 Id배열", clicked);
    if(clicked.length === 5){
        console.log("5개의 역량이 선택되었습니다.",  clicked);
    } 

    // 역량 insert 평가
    const insertComp =(e) =>{
        fetch("http://localhost:8081/performMgt/insertComp",{
            method: "POST",
            headers:{
                "Content-Type" : "application/json;charset=utf-8"
            },
            body : JSON.stringify(insertComp)  // javascript 오브젝트를 json으로 변경해서 넘긴다.
        })   // 데이터를 스프링 부트에서 insert하고 201을 리턴
        .then((res) => {
            console.log(1, res);
            if(res.status === 201){
                return res.json();
            } else {
                return null;
            }
        })
        .then((res) => {
            console.log('정상', res);
            if(res !== null){
                // Navigate(/);
            } else{ 
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
                        <Card>
                            <Card.Body>
                            {/* clicked.join(", ") */}
                                <Button 
                                        type="submit"
                                        onClick={insertComp}
                                        name="comp"
                                        value={clicked.join(", ")}
                                    > 역량 선택
                                    </Button>
                                <h3>선택된 역량 개수 :{clicked.length} /5 </h3>
                                <h3>현재 선택된 역량 : {clicked.join(", ")}</h3>
                                <button onClick={() => alert(`현재 선택된 역량 : ${clicked.join(", ")}`)}>
                                    선택된 역량 확인
                                </button>

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
                            {/* <Button onClick={}> &nbsp;&nbsp;&nbsp;선택 </Button>  */}
                        </Card>

                    </div>
                </Content>
            </Container>
        </Container >
    );


};
export default CheckComp;