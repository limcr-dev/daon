import { Tree } from 'rsuite';
import "../../performMgt/css/evalTree.css";
import { useNavigate } from 'react-router-dom';

const data = [
  {
    label: '인적 평가',
    value: 'evaluation1',
    children: [ 
      { label: '자기 평가', value: 'evalque' },
      { label: '동료 평가', value: 'home' },
      { label: '근태 평가', value: 'attendance' },
    ],
  },
  {
    label: '달성 평가',
    value: 'evaluation2',
    children: [
      { label: '실적 달성률', value: 'performance1' },
      { label: '업무 달성률', value: 'performance2' },
      { label: '교육 테스트', value: 'education' },
    ],
  },
  {
    label: '인사 평가',
    value: 'evaluation3',
    children: [
      { label: '평가 조회', value: 'eval_select' },
      { label: '평가 리스트', value: 'eval_list' },
      { label: '평가 관리', value: 'eval_mgnt' },
    ],
  },
];


const EvalTree = () => {
  const navigate = useNavigate();

  const handleSelect = (label) => {
    if (label) {
      navigate(`/performMgt/${label.value}`); // 클릭된 value에 따라 해당 경로로 이동
    }
  };
  return (
    <div className="height_change">
      <Tree data={data} defaultExpandAll className="h-full" onSelect={handleSelect}/>
    </div>
  );
};
export default EvalTree;