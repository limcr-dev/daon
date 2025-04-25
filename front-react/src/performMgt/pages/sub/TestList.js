import { request } from "../../../common/components/helpers/axios_helper"
import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { Button } from "rsuite";
import "../../../performMgt/css/CompList.css"; // CSS 파일 가져오기 (스타일 적용)

import { useNavigate } from "react-router-dom";

const TestList = () => {

  const [testList, setTestList] = useState([]);

  const navigate = useNavigate();


  useEffect(() => {
    request("get", "/performMgt/testList")
      .then((res) => {
        console.log("응답", res);
        setTestList(res.data);
      })
      .catch((error) =>
        console.error("데이터 가져오기 오류 : ", error));
  }, []);

  const evalList = (e) => {
    e.preventDefault();
    navigate('/performMgt/evalList');
  }

  // 삭제
  const deleteTest = (orderNum) => {
    if (window.confirm(`${orderNum}번 데이터를 정말 삭제할까요?`))

      request("delete", `/performMgt/testList/${orderNum}`)
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
        });
  }

  // 업데이트 등록
  const updateTest = async (test) => {

    if (!test.eval_order_num) {
      alert("평가 번호가 유효하지 않습니다.");
      return;
    }

    if (window.confirm(`${test.eval_order_num}번 데이터를 등록 하시겠습니까?`)) {
      const now = new Date();
      const endDate = new Date(test.eval_end_date);
      if (now > endDate) {
        alert("마감일이 지났습니다");
        return;
      }
      const payload = {
        eval_order_num: String(test.eval_order_num),
        registration: '',
      };

      try {

        console.log("서버로 보내는 데이터(put):", payload);

        const updateRes = await request("put", `/performMgt/testList/${test.eval_order_num}`, payload);
        console.log("서버응답:", updateRes.data);

        if (updateRes.status === 200 && updateRes.data > 0) {
          alert("등록 완료!");
          if (test.eval_emp_type === '자기평가') {

            // insert 자기평가 
            const insertRes = await request("post", `/performMgt/selfTargetInsert`, {eval_order_num: String(test.eval_order_num)});
            console.log("서버응답:", insertRes.data);

            if (insertRes.data === 1 || insertRes.data > 0) {
              alert("평가가 성공적으로 저장되었습니다!");
              // 등록 성공후 페이지로 이동 
              navigate("/performMgt/evalList"); // 자기평가일때만 이동
            } else {
              alert("평가 저장에 실패했습니다");
            }
          } else {
            // 동료평가 target 테이블 insert
            if (test.eval_emp_type === '동료평가') {
            
              const peerRes = await request("post", `/performMgt/peerTargetInsert`,{eval_order_num: String(test.eval_order_num)});
              console.log("peer_target 생성 응답:", peerRes.data);
            
              if (peerRes.status === 201 || peerRes.data === "ok") {
                alert("동료 평가 대상자가 자동으로 등록되었습니다!");
              } else {
                alert("peer_target 생성에 실패했습니다.");
              }
            }
          }
          
          navigate("/performMgt/evalList");
        }else{
          alert("등록에 실패 했습니다.");
        }

        }catch (err) {
          console.error("등록 또는 저장 중 오류:", err);
          alert("처리 중 오류가 발생했습니다");
        }
      };
    }
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
                        {new Date() > new Date(test.eval_end_date) ? (
                          <>
                            <button className="subno" type="button" style={{ color: "red" }}> 등록불가 </button>
                            <button className="subno" type="button" onClick={() => deleteTest(test.eval_order_num)}>삭제</button>
                          </>
                        ) : (
                          <>
                            <button className="subno" type="button" onClick={() => updateTest(test)}> 등록 </button>
                            <button className="subno" type="button" onClick={() => deleteTest(test.eval_order_num)}>삭제</button>
                          </>
                        )}

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
  }
  export default TestList;