import { Tree } from "rsuite";
import "../css/AttendMgtTree.css";
import { useNavigate } from "react-router-dom";

const data = [
  {
    label: "근태관리",
    value: "attendanceMgt",
    children: [
      { label: "내 근태 현황", value: "attendance" },
      { label: "내 연차 내역", value: "vacationMain" },
    ],
  },
  {
    label: "팀 근태관리",
    value: "teamattendanceMgt",
    children: [
      { label: "팀 근태 현황", value: "teamstatus/1" },
      { label: "팀 연차 내역", value: "teamstats/1" },
    ],
  },
  {
    label: "부서 근태관리",
    value: "deptattendanceMgt",
    children: [
      { label: "부서 근태 현황", value: "deptStatus/1" },
      { label: "부서 연차 내역", value: "deptStats/1" },
      {
        label: "팀명",
        value: "teamattendanceMgt/1",
        children: [
          { label: "팀 근태현황", value: "teamstatus/1" },
          { label: "팀 근태통계", value: "teamstats/1" },
        ],
      },
      {
        label: "팀명",
        value: "teamattendanceMgt/1",
        children: [
          { label: "팀 근태현황", value: "teamstatus/1" },
          { label: "팀 근태통계", value: "teamstats/1" },
        ],
      },
      {
        label: "팀명",
        value: "teamattendanceMgt/1",
        children: [
          { label: "팀 근태현황", value: "teamstatus/1" },
          { label: "팀 근태통계", value: "teamstats/1" },
        ],
      },
    ],
  },

  {
    label: "전체 부서 근태관리",
    value: "allDepartmentMgt",
    children: [
      {
        label: "경영부",
        value: "deptStatusMgt/10",
        children: [
          { label: "경영부 근태현황", value: "deptStatus/10" },
          { label: "경영부 근태통계", value: "deptStats/10" },
        ],
      },
      {
        label: "개발부",
        value: "deptStatusMgt/20",
        children: [
          { label: "개발부 근태현황", value: "deptStatus/20" },
          { label: "개발부 근태통계", value: "deptStats/20" },
        ],
      },
      {
        label: "영업부",
        value: "deptStatusMgt/30",
        children: [
          { label: "영업부 근태현황", value: "deptStatus/30" },
          { label: "영업부 근태통계", value: "deptStats/30" },
        ],
      },
    ],
  },

  {
    label: "전사 근태관리",
    value: "all",
    children: [
      { label: "전사 근태현황", value: "inbox" },
      { label: "전사 근태통계", value: "sent" },
      { label: "전사 연차현황", value: "swpam" },
      { label: "전사 연차 사용내역", value: "sqpam" },
    ],
  },
];

const updateLabels = (data, admin_type, dept_no) => {
  const deptMap = {
    10: "경영부",
    20: "개발부",
    30: "영업부",
    101: "인사팀",
    102: "총무팀",
    103: "회계팀",
    201: "연구개발팀",
    202: "생산관리팀",
    203: "it팀",
    301: "영업팀",
    302: "마케팅팀",
    303: "품질관리팀",
  };
  const teamMap = {
    10: [101, 102, 103], // 경영부
    20: [201, 202, 203], // 개발부
    30: [301, 302, 303], // 영업부
  };

  const deptName = deptMap[dept_no];

  const teamNo = teamMap[dept_no] || [];
  const teamNames = teamNo.map(No => deptMap[No]);

  // 인사, 급여 관리자
  if ([2, 3, 4].includes(admin_type)) {
    return data.filter(item => item.label !== '팀 근태관리' && item.label !== '부서 근태관리'); // 팀 근태관리와 부서 근태관리 제외
  }

  return data
    .map((item) => {
      // 예: 부서장(admin_type === 2)일 때 label 변경
      if (item.label === "근태관리") {
        return {
          ...item,
        };
      }
      // 팀장 일 때
      if (admin_type === 6 && item.label === "팀 근태관리") {
        // children을 따로 만들어서 지정
        const editChildren = item.children?.map(child => {
          return {
            ...child,
            label: child.label.replace('팀', `${deptName}`),
            value: child.value.replace('1', `${dept_no}`)
          }
        })
        return {
          ...item,
          label: `${deptName} 근태관리`,
          children: editChildren
        };
      }

      // 부서장 일 때
      if (admin_type === 5 && item.label === "부서 근태관리") {
        const editChildren = item.children?.map((child, index) => {
          // 처음 2개 children 요소에 부서별 근태관리,현황 replace
          if (index === 0 || index === 1) {
            return {
              ...child,
              label: child.label.replace('부서', `${deptName}`),
              value: child.value.replace('1', `${dept_no}`)
            }
          }
          // 그외 나머지 children 요소에 팀별 근태관리,현황 replace
          const editChildren2 = child.children?.map((child) => {
            return {
              ...child,
              label: child.label.replace('팀', `${teamNames[index - 2]}`),
              value: child.value.replace('1', `${teamNo[index - 2]}`)
            }
          })
          return {
            ...child,
            label: child.label.replace('팀명', `${teamNames[index - 2]}`),
            value: child.value.replace('1', `${teamNo[index - 2]}`),
            children: editChildren2
          }
        })
        return {
          ...item,
          label: `${deptName} 근태관리`,
          value: item.value.replace('1', `${dept_no}`),
          children: editChildren
        };
      }
      return null;
    })
    .filter(Boolean);
};

const AttendMgtTree = (props) => {
  const navigate = useNavigate();
  // 관리자 유형
  const admin_type = props.user.admin_type;
  // 부서 코드
  const dept_no = props.user.dept_no;

  const filteredData = updateLabels(data, admin_type, dept_no);

  const handleSelect = (selectedLabel) => { // label 클릭 시
    if (!selectedLabel.value.includes('Mgt')) { // 클릭한 value의 값안에 Mgt가 포함되지 않은 경우에만 실행
      navigate(`/attendMgt/${selectedLabel.value}`); // 클릭된 value에 따라 해당 경로로 이동
    }
  };
  return (
    <div className="height_change">
      <Tree
        data={filteredData}
        defaultExpandAll
        className="h-full"
        onSelect={handleSelect}
      />
    </div>
  );
};
export default AttendMgtTree;
