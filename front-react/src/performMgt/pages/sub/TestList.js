import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { Button } from "rsuite";
import "../../../performMgt/css/CompList.css"; // CSS 파일 가져오기 (스타일 적용)

import { useNavigate } from "react-router-dom";

const TestList = () => {

  const [testList, setTestList] = useState([]);
  
  const navigate = useNavigate();


  useEffect(() => {
    fetch("http://localhost:8081/performMgt/testList", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("응답", res);
        setTestList(res);
      })
      .catch((error) =>
        console.error("데이터 가져오기 오류 : ", error));
  }, []);

  const evalList = (e) => {
    e.preventDefault();
    navigate('/performMgt/eval_list');
  }

  // 삭제
  const deleteTest = (orderNum) => {
    if (window.confirm(`${orderNum}번 데이터를 정말 삭제할까요?`))

      fetch(`http://localhost:8081/performMgt/testList/${orderNum}`, {
        method: 'DELETE',
      })
        .then((res) => res.text())
        .then((res) => {
          if (res === "ok") {
            alert("삭제완료");
            // 삭제 후 리스트 갱신
            setTestList(prev => prev.filter(test => test.eval_order_num !== orderNum))
          } else {
            alert("삭제 실패");
          }
        });
  }

  // 업데이트
  const updateTest = async (orderNum) => {
    if (window.confirm(`${orderNum}번 데이터를 등록 하시겠습니까?`)) {
      
      try {
        const updateRes = await fetch(`http://localhost:8081/performMgt/testList/${orderNum}`, {
          method: 'PUT',
          body: JSON.stringify({
            eval_order_num: orderNum,
            registration:'',
            // 추가 데이터 필요 시 여기에

          }),
          headers: {
            "Content-Type": "application/json;charset=utf-8"
          }
        });
        if (!updateRes.ok) {
          throw new Error('업데이트 실패');
        }
        alert("등록 완료!");

        // 등록 성공후 페이지로 이동 
        navigate(`/performMgt/evalList/${orderNum}`);
      } catch (err) {
        console.error(err);
        
      }
    }
  };

  return (
    <div>
      <Card align="center">

        <h5 className="line"> 현재 선택된 역량 테스트 </h5>

        <Button className="subutt1" onClick={evalList}> 직원 전체 리스트 </Button>
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
            {testList.length > 0 ? (

              <>
                {testList.map((test, index) => (
                  <tr key={index}>
                    <td className="comp-td">{test.eval_order_num || "정보 없음"}</td>
                    <td className="comp-td">{test.eval_start_date || "정보 없음"}</td>
                    <td className="comp-td">{test.eval_emp_type || "정보 없음"}</td>
                    <td className="comp-td">{test.eval_click_emp || "정보 없음"}</td>
                    <td className="comp-td">
                      <button className="subno" type="button" onClick={() => updateTest(test.eval_order_num)} >등록</button>
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
  );
};



export default TestList;