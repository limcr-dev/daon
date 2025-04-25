// GoalForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

const GoalForm = () => {
  const [goal, setGoal] = useState({ title: '', description: '', priority: 1 });

  const handleSubmit = async () => {
    await axios.post('/api/goals', goal); // 백엔드에 저장
    alert('목표가 저장되었습니다.');
  };

  return (
    <div className="p-4 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-2">목표 설정</h2>
      <input type="text" placeholder="목표명" className="block mb-2" onChange={e => setGoal({...goal, title: e.target.value})} />
      <textarea placeholder="설명" className="block mb-2" onChange={e => setGoal({...goal, description: e.target.value})} />
      <input type="number" placeholder="중요도" className="block mb-2" onChange={e => setGoal({...goal, priority: Number(e.target.value)})} />
      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSubmit}>등록</button>
    </div>
  );
}
export default GoalForm;