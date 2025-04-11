import React from "react";
import { Card } from "react-bootstrap";
import { Button } from "rsuite";




const QuesList = ({ ques }) => {

    if (!ques) return <p>질문 데이터가 없습니다.</p>;  //예외처리

    const { eval_comp_type, eval_comp_name, eval_ques_text } = ques; // 구조분해 할당당


    return (
        <div>
            분류 : {eval_comp_type} / {eval_comp_name}
            <Card.Title>{eval_ques_text}</Card.Title>

            <Card>
                <Button variant="Light">매우그렇다</Button>
            </Card>

            <Card >
                <Button variant="Light">다소그런편이다</Button>
            </Card>

            <Card >
                <Button variant="Light">보통이다</Button>
            </Card>

            <Card >
                <Button variant="Light">그렇지 않은 편이다</Button>
            </Card>

            <Card >
                <Button variant="Light">전혀 그렇지 않다</Button>
            </Card>
            <br /><br /><br />
        </div>
    );

}


export default QuesList;