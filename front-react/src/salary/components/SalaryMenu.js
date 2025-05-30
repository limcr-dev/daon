import { Tree } from 'rsuite';
import { useNavigate } from 'react-router-dom';

const data = [
  {
    label: '급여 통계',
    value: '',
    children: [
      { label: '수당 관리', value: 'allowanceList' },
      { label: '공제 관리', value: 'deductionList' },
      { label: '사원별 급여 항목 설정', value: 'EmployeeItemConfig' },
      { label: '급여 요약 목록', value: 'EmployeeSalaryList' },
      { label: '급여 대장', value: 'SalarySchedule' }
    ]
  }
];

const SalaryMenu = () => {
  const navigate = useNavigate();

  const handleSelect = (selectedLabel) => {
    if(selectedLabel) {
      navigate(`/salary/${selectedLabel.value}`)
    }
  }
  return(
    <div>
      <Tree data={data} defaultExpandAll h-full onSelect={handleSelect}/>
    </div>
  )
 
};
export default SalaryMenu;
