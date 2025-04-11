

import React, { useEffect, useState } from "react";

//import React, { useEffect, useState } from "react";
import { Card } from 'react-bootstrap';

import Leftbar from "../../common/pages/Leftbar";
import LeftbarDEvaluation from "../components/LeftbarDEvaluation";

import { Container, Content } from "rsuite";
import QuesList from "./sub/QuesList";


// 동료 평가 문제 불러오기
const EvalPeerQue = () => {

    const [ quesList, setQuesList ] = useState([]);   // 초기값을 모르므로 빈배열로 대입
    
    useEffect(() => {
        alert("test");
        fetch("http://localhost:8081/performMgt/queslist", {
            method : "GET"
        }).then(res => res.json())
        .then(data => {
            console.log("Fetched Data : ", data);
            setQuesList(data);
        })
        .catch(error => console.error("Error fetching data : " , error))
    }, [])
   
    return (

        <Container style={{ minHeight: '100vh', width: '100%' }}>
            <Leftbar />
            <Container>
            <LeftbarDEvaluation />
                <Content>
                    <div className="main-content p-4">
                        
                        <h2 className="mb-4">✏️ 동료 평가</h2>
                        <Card>
                            <Card.Body>  
                                {quesList.length > 0? (quesList.map(ques =>( 
                                        
                                        <QuesList key={ques.eval_ques_id} ques={ques}  />))
                                    ): (
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

export default EvalPeerQue;