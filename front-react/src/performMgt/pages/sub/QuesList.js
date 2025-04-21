import React, { useState } from "react";
import { Card } from "react-bootstrap";
import { Button } from "rsuite";
import "../../../performMgt/css/CompList.css"; // CSS 파일 가져오기 (스타일 적용)


const QuesList = ({ ques , onScoreChange, selectedScore }) => {

    if (!ques) return <p>질문 데이터가 없습니다.</p>;  //예외처리

 

    const { eval_comp_type, eval_comp_name, eval_ques_text, eval_ques_id  } = ques; // 구조분해 할당
    
    const handleScoreSelect = (score) =>{
        if (!score) {
            alert("답을 선택해해 주세요!");
            return; // 함수 종료
        }


        onScoreChange(eval_ques_id, {
            comp: eval_comp_name,
            score
        });
    };

    return (
        <div>
            분류 : {eval_comp_type} / {eval_comp_name}
            <Card.Title>{eval_ques_text}</Card.Title>

            {[5,4,3,2,1].map(score=>(
                <Card key={score}>
                    <Button  type='button' 
                             className={selectedScore ===  score ? "clicked-button" : "default-button"}  // 클릭 여부
                            //  disabled={clicked.length >=1 && !clicked.includes()}
                            onClick={() => handleScoreSelect(score)}>
                        {['매우 그렇다', '다소 그런 편이다', '보통이다', '그렇지 않은 편이다', '전혀 그렇지 않다'][5 - score]}
                    </Button>

                </Card>
            ))}
            <br /><br /><br />
        </div>
    );

}


export default QuesList;