import { Tree } from 'rsuite';
import "../css/AttendMgtTree.css";
import { useNavigate } from 'react-router-dom';

const data = [
  {
    label: '근태관리',
    value: 'attendance',
    children: [
      { label: '내 근태 현황', value: 'attendMgt' },
      { label: '내 연차 내역', value: 'vacationHistory' },
      { label: '내 인사 정보', value: 'item3' },
    ],
  },
  {
    label: '부서 근태관리',
    value: 'department',
    children: [
      {
        label: '본부',
        value: 'central',
        children: [
          { label: '부서 근태현황', value: 'development' },
          { label: '부서 근태통계', value: 'design' },
        ]
      }

    ],
  },
  {
    label: '전사 근태관리',
    value: 'all',
    children: [
      { label: '전사 근태현황', value: 'inbox' },
      { label: '전사 근태통계', value: 'sent' },
      { label: '전사 인사정보', value: 'spfam' },
      { label: '전사 연차현황', value: 'swpam' },
      { label: '전사 연차 사용내역', value: 'sqpam' },
    ],
  },
];

const AttendMgtTree = () => {
  const navigate = useNavigate();

  const handleSelect = (selectedLabel) => {
    if (selectedLabel) {
      navigate(`/${selectedLabel.value}`); // 클릭된 value에 따라 해당 경로로 이동
    }
  };
  return (
    <div className="height_change">
      <Tree data={data} defaultExpandAll h-full onSelect={handleSelect}/>
    </div>
  );
};
export default AttendMgtTree;
