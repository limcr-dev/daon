import React, { useState, useEffect } from 'react';
import { request } from "../common/components/helpers/axios_helper";
import { useUser } from "../common/contexts/UserContext";
import { Container, Content } from 'rsuite';
import { Card } from "react-bootstrap";
import Leftbar from '../common/pages/Leftbar';
import Header from "../common/pages/Header";
import { useNavigate } from 'react-router-dom';
import LeftbarDEvaluation from './components/LeftbarDEvaluation';

const GoalForm = () => {
  const { user } = useUser();
  const [goals, setGoals] = useState([]);
  const [addGoal, setAddGoal] = useState({ title: '', description: '' });
  const navigate = useNavigate();


  // 목표 리스트 가져오기
  useEffect(() => {
    request('GET', `/performMgt/getAllGoals/${user.emp_no}`)
      .then(res => {
        console.log("목표 리스트:", res.data);   // 추가
        setGoals(res.data);
      })
      .catch((error) => {
        console.error("목표리스트 가져오기 오류 : ", error);
      });
  }, []);

  // 목표 추가하는 함수
  const handleAddGoal = () => {
    if (!addGoal.title.trim() || !addGoal.description.trim()) {
      alert("목표 제목과 내용을 모두 입력하세요!");
      return;
    }

    const goalToSend = {
      ...addGoal,
      emp_id: user.emp_no,  // user 정보에서 emp_no를 가져와서 같이 보낸다
    };


    request('POST', "/performMgt/addGoal", goalToSend)
      .then(res => {
        if (res.status === 201 || res.status === 200) {
          alert("목표설정 성공");
          setAddGoal({ title: '', description: '' }); // 입력값 초기화
          navigate(0);
        } else {
          alert("목표 설정 실패");
        }
      })
      .catch(error => {
        console.error("목표 추가 오류 : ", error);
      });
  };

  // 목표 완료처리하는 함수
  const handleCompleteGoal = (id) => {
    request('PUT', `/performMgt/${id}/complete`)
      .then(res => {
        if (res.status === 201 || res.status === 200) {
          alert("목표 완료 성공");
          navigate(0);
        } else {
          alert("목표 완료 실패");
        }
      })
      .catch(error => {
        console.error("목표 완료 오류 : ", error);
      });
  };

  // 달성률 계산
  const completedGoals = goals.filter(goal => goal.completed === 1).length;
  const totalGoals = goals.length;
  const completionRate = totalGoals ? Math.round((completedGoals / totalGoals) * 100) : 0;

  return (
    <Container style={{ minHeight: '100vh', width: '100%' }}>
      <Leftbar />
      <Container>
        <LeftbarDEvaluation />
        <Content>
          <Header />
          <div>
            <h5 className="line">목표 달성</h5>

            {/* 목표 추가 영역 */}
            <Card className='eval-card'>
              <Card.Header style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h5>목표 설정</h5>
              </Card.Header>
              <Card.Body className="p-4 space-y-2">
                <input
                  value={addGoal.title}
                  onChange={e => setAddGoal({ ...addGoal, title: e.target.value })}
                  placeholder="새 목표 입력"
                  style={{ width: "50%", marginRight: "10px", marginBottom: "3px" }}
                />
                <input
                  value={addGoal.description}
                  onChange={e => setAddGoal({ ...addGoal, description: e.target.value })}
                  placeholder="내용 입력"
                  style={{ width: "50%", height: "100px", marginRight: "10px" }}
                />
                <button className="subno" onClick={handleAddGoal}>추가</button>
              </Card.Body>
            </Card>

            {/* 목표 리스트 영역 */}
            <Card className='eval-card'>
              <Card.Header style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h5>목표 목록</h5>
              </Card.Header>
              <Card.Body className="p-4 space-y-2">
                <ul>
                  {goals.map(goal => (
                    <li key={goal.id} style={{ marginBottom: "10px" }}>
                      <span style={{ textDecoration: goal.completed ? 'line-through' : 'none' }}>
                        {goal.title}<br />
                      </span>
                      내용 :{goal.description}
                      {!goal.completed && (
                        <button
                          style={{ marginLeft: "10px" }}
                          className="subno"
                          onClick={() => handleCompleteGoal(goal.id)}
                        >
                          완료
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </Card.Body>
              <Card.Footer>
                <h5>달성률: {completionRate}%</h5>
              </Card.Footer>
            </Card>
          </div>
        </Content>
      </Container>
    </Container>
  );
};

export default GoalForm;