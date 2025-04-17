import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { Button } from "rsuite";
import "../../../performMgt/css/CompList.css"; // CSS 파일 가져오기 (스타일 적용)


const CompList = ({ comp, clicked, onClick }) => {
  


  // 역량 데이터가 없을 경우 예외처리
  if (!comp) {
    console.error(" 오류 :comp데이터가 없습니다.");
    return '역량 데이터가 없습니다.';  //예외처리
  }
  // console.log("comp데이터 :", comp);

  // 객체에 필요한 값 꺼내기기
  const { eval_comp_id, eval_comp_type, eval_comp_name } = comp; // 구조분해 할당

  // eval_ques_id가 없는 경우 예외 처리
  if (!comp || !comp.eval_comp_id){
    
    return '올바른 역량 데이터가 필요합니다.';
  }

  
  return (
    <div>
      <Card align="center">
       
        <Button type="button"
          onClick={()=>onClick(eval_comp_id)}
          className={clicked.includes(eval_comp_id) ? "clicked-button" : "default-button"}  // 클릭 여부
          name="comp"
          value={eval_comp_id}
          disabled={clicked.length >=5 && !clicked.includes(eval_comp_id)}
        >
          타입 : {eval_comp_type} <br />
          {eval_comp_name} </Button>
          
      </Card>
      <div className="linenomal">&nbsp;</div>
    </div>
  );

}


export default CompList;