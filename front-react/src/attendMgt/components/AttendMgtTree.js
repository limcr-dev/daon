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
        value: 'central1',
        children: [
          { label: '부서 근태현황', value: 'deptStatus10' },
          { label: '부서 근태통계', value: 'deptStats10' },
        ]
      },
      {
        label: '개발부',
        value: 'central2',
        children: [
          { label: '부서 근태현황', value: 'deptStatus20' },
          { label: '부서 근태통계', value: 'deptStats20' },
        ]
      },
      {
        label: '영업부',
        value: 'central3',
        children: [
          { label: '부서 근태현황', value: 'deptStatus30' },
          { label: '부서 근태통계', value: 'deptStats30' },
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
const filterByAdmin_type = (admin_type) => {
  switch (admin_type) {
    case 1: // 일반 직원
      return data.filter(item =>
        item.label === '근태관리');
    case 5: // 부서장
      return data.filter(item =>
        item.label === '근태관리' || item.label.children.label === '경영부'
      );
    case 6: // 팀 관리자
      return data.filter(item =>
        item.label === '근태관리' || item.label === '팀 근태관리'
      );
    case 3: // 인사관리자
    case 2: // 관리자
    case 4: // 급여관리자
      return data; // 전체 다 보여줌
    default:
      return [];
  }
};

const AttendMgtTree = (props) => {
  const navigate = useNavigate();
  // 관리자 유형
  const admin_type = props.user.admin_type;
  // 부서 코드
  const dept_no = props.user.dept_no;

  const filteredData = filterByAdmin_type(admin_type);

  const handleSelect = (selectedLabel) => {
    if (selectedLabel) {
      navigate(`/attendMgt/${selectedLabel.value}`); // 클릭된 value에 따라 해당 경로로 이동
    }
  };
  return (
    <div className="height_change">
      <Tree data={filteredData} defaultExpandAll className="h-full" onSelect={handleSelect} />
    </div>
  );
};
export default AttendMgtTree;
