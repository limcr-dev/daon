import { Tree } from 'rsuite';
import { useNavigate } from 'react-router-dom';

const data = [
  {
    label: '사원 관리',
    value: '',
    children: [
      { label: '사원 목록', value: 'employeeList' },
      { label: '계약직/인턴 사원 관리', value: 'contractEmployeeManage' },
      { label: '직급/기본급 관리', value: 'positionManage' },
      { label: '부서/직책 관리', value: 'departmentRoleManage' },
      { label: '권한 설정', value: 'adminRoleManage' },
      { label: '퇴사 처리', value: 'employeeResignPage' }
    ]
  }
];

const EmployeeMenu = () => {
  const navigate = useNavigate();

  const handleSelect = (selectedLabel) => {
    if(selectedLabel) {
      navigate(`/employee/${selectedLabel.value}`)
    }
  }
  return(
    <div>
      <Tree data={data} defaultExpandAll onSelect={handleSelect}/>
    </div>
  )
 
};
export default EmployeeMenu;
