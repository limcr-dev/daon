import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { Button } from "rsuite";
import "../../../performMgt/css/CompList.css"; // CSS 파일 가져오기 (스타일 적용)


const CompList = ({ comp, clicked, onClick }) => {
  

  // clicked 버튼이 클릭되었는지를 저장하는 상태
  // const [clicked, setClicked] = useState([]);
  
  // const [isDisabled, setIsDisabled]= useState(false);
  // useEffect(()=>{
  //   // 클릭된 항목이 5개 이상이면 추가 선택을 막음
  //   setIsDisabled(clicked.length >=5);
  // },[clicked]);
  

  // const onClick = (compId) => {
  //   if (!compId){
  //     console.error("오류 : compId 가 유효하지 않음!", compId);
  //     return; // 상태 없데이트 방지지  
  //   }    
  //   setClicked((prevClicked) =>{
  //     console.log("이전상태 : ", prevClicked);  // 기존상태 출력
  //     console.log("현재클릭한 ID : ", compId);

  //     if(prevClicked.includes(compId)){
  //       console.log("이미 선택된 항목 -> 해제");
  //     // 이미 선택된 항목이면 해제(토글)
  //     return prevClicked.filter((id)=> id !== compId);

  //     }

  //     // 최대 5개까지만 선택가능
  //     if(prevClicked.length >= 5){
  //       alert(" 역량은 5개만 선택 할 수 있습니다.");
  //       console.log("최대개수 초과! 상태 변경 안함");
  //       return prevClicked;  // 기존 배열 유지(업데이트x)
  //     }
  //     // 새로운 항목 추가
  //     //return[...prevClicked, compId].slice(-5);
      
  //     const newClicked = [...prevClicked, compId];
  //     console.log("추가된 상태 : ", newClicked);
  //     return newClicked;
       
  //   });
  //   console.log("compClicked ;", compId);
  // };


  // 역량 데이터가 없을 경우 예외처리
  if (!comp) {
    console.error(" 오류 :comp데이터가 없습니다.");
    return <p>역량 데이터가 없습니다.</p>;  //예외처리
  }
  console.log("comp데이터 :", comp);

  // 객체에 필요한 값 꺼내기기
  const { eval_comp_id, eval_comp_type, eval_comp_name } = comp; // 구조분해 할당

  // eval_ques_id가 없는 경우 예외 처리
  if (!comp || !comp.eval_comp_id){
    
    return <p> 올바른 역량 데이터가 필요합니다. </p>;
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
     
      <br />

    </div>
  );

}


export default CompList;