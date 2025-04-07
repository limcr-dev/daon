import { Tree } from 'rsuite';
import "../css/AttendMgtTree.css";
import { useNavigate } from 'react-router-dom';

const data = [
  {
    label: '근태관리',
    value: 'attendance',
    children: [
      { label: '내 근태 현황', value: '' },
      { label: '내 연차 내역', value: 'vacationMain' },
    ],
  },
  {
    label: '부서 근태관리',
    value: 'department',
    children: [
      {
        label: '경영부',
        value: 'central',
        children: [
          { label: '부서 근태현황', value: 'deptStatus' },
          { label: '부서 근태통계', value: 'design' },
        ]
      },
      {
        label: '개발부',
        value: 'central',
        children: [
          { label: '부서 근태현황', value: 'deptStatus' },
          { label: '부서 근태통계', value: 'design' },
        ]
      },
      {
        label: '영업부',
        value: 'central',
        children: [
          { label: '부서 근태현황', value: 'deptStatus' },
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
      { label: '전사 연차현황', value: 'swpam' },
      { label: '전사 연차 사용내역', value: 'sqpam' },
    ],
  },
];

const AttendMgtTree = () => {
  const navigate = useNavigate();

  const handleSelect = (selectedLabel) => {
    if (selectedLabel) {
      navigate(`/attendMgt/${selectedLabel.value}`); // 클릭된 value에 따라 해당 경로로 이동
    }
  };
  return (
    <div className="height_change">
      <Tree data={data} defaultExpandAll className="h-full" onSelect={handleSelect}/>
    </div>
  );
};
export default AttendMgtTree;
